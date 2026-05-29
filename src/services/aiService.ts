// src/services/aiService.ts
import Anthropic from '@anthropic-ai/sdk';
import * as SecureStore from 'expo-secure-store';
import { Task, TaskBucket } from '../types';
import { notesService } from './notesService';

const API_KEY_STORE = 'aigtd.anthropicKey';

async function getClient(): Promise<Anthropic> {
  const key = await SecureStore.getItemAsync(API_KEY_STORE);
  if (!key) throw new Error('NO_API_KEY');
  return new Anthropic({ apiKey: key });
}

export async function saveApiKey(key: string): Promise<void> {
  await SecureStore.setItemAsync(API_KEY_STORE, key);
}

export async function getApiKey(): Promise<string | null> {
  return SecureStore.getItemAsync(API_KEY_STORE);
}

// ============================================================
// TYPES
// ============================================================
export interface ClarifyResult {
  needsAction: boolean;
  isQuick: boolean;
  suggestedBucket: TaskBucket;
  nextAction: string;
  summary: string;
  suggestedTags: string[];
}

// ============================================================
// SYSTEM PROMPTS
// ============================================================
const SYSTEM_CLARIFY = `You are a GTD assistant. Respond ONLY with valid JSON, no markdown.
Schema: { "needsAction": boolean, "isQuick": boolean, "suggestedBucket": "current"|"project"|"scheduled"|"delegated"|"future"|"reference"|"trash", "nextAction": string, "summary": string, "suggestedTags": string[] }`;

const buildChatSystem = (notesContext: string) => `You are an AI GTD co-pilot with access to the user's second brain — their personal knowledge base of notes, ideas, and references.

When answering, naturally draw on the notes context provided if relevant. Be concise, warm, and practical. Max 3 sentences unless the user asks for more.
${notesContext}`;

const buildReviewSystem = () => `You are a GTD weekly review AI. Respond ONLY with JSON.
Schema: { "inboxCount": number, "overdueCount": number, "completedCount": number, "openProjectCount": number, "highlights": string[], "blockers": string[], "topThreeToday": string[], "motivationalNote": string }`;

// ============================================================
// SERVICE
// ============================================================
export const aiService = {

  // ----------------------------------------------------------
  // CLARIFY — classify a single inbox item
  // ----------------------------------------------------------
  async clarify(rawText: string): Promise<ClarifyResult> {
    const client = await getClient();

    const msg = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 400,
      system: SYSTEM_CLARIFY,
      messages: [{ role: 'user', content: `Inbox item: "${rawText}"` }],
    });

    const text = msg.content[0].type === 'text' ? msg.content[0].text : '{}';
    try {
      return JSON.parse(text.replace(/```json|```/g, '').trim()) as ClarifyResult;
    } catch {
      return {
        needsAction: true,
        isQuick: false,
        suggestedBucket: 'current',
        nextAction: 'Review and decide next step',
        summary: 'Could not auto-classify. Please route manually.',
        suggestedTags: [],
      };
    }
  },

  // ----------------------------------------------------------
  // CHAT — with second brain context injected automatically
  // ----------------------------------------------------------
  async chat(
    userMessage: string,
    history: Array<{ role: 'user' | 'assistant'; content: string }>,
    tasks?: Task[]
  ): Promise<string> {
    const client = await getClient();

    // 1. Pull relevant notes from second brain
    const notesContext = await notesService.getContextForQuery(userMessage);

    // 2. Build task context
    const taskContext = tasks?.length
      ? `\n\nUser's current tasks:\n${JSON.stringify(
          tasks.slice(0, 30).map((t) => ({
            title: t.title,
            bucket: t.bucket,
            priority: t.priority,
            done: t.done,
            nextAction: t.nextAction,
          }))
        )}`
      : '';

    const messages = [
      ...history.slice(-10), // last 10 turns for context window efficiency
      { role: 'user' as const, content: userMessage + taskContext },
    ];

    const msg = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      system: buildChatSystem(notesContext),
      messages,
    });

    return msg.content[0].type === 'text'
      ? msg.content[0].text
      : "Sorry, I couldn't process that.";
  },

  // ----------------------------------------------------------
  // WEEKLY REVIEW
  // ----------------------------------------------------------
  async weeklyReview(tasks: Task[]): Promise<{
    inboxCount: number;
    overdueCount: number;
    completedCount: number;
    openProjectCount: number;
    highlights: string[];
    blockers: string[];
    topThreeToday: string[];
    motivationalNote: string;
  }> {
    const client = await getClient();

    const msg = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 800,
      system: buildReviewSystem(),
      messages: [{ role: 'user', content: `Task data: ${JSON.stringify(tasks)}` }],
    });

    const text = msg.content[0].type === 'text' ? msg.content[0].text : '{}';
    try {
      return JSON.parse(text.replace(/```json|```/g, '').trim());
    } catch {
      return {
        inboxCount: tasks.filter((t) => t.bucket === 'inbox').length,
        overdueCount: 0,
        completedCount: tasks.filter((t) => t.done).length,
        openProjectCount: 0,
        highlights: ['Keep capturing', 'Keep processing'],
        blockers: ['Inbox needs processing'],
        topThreeToday: tasks.filter((t) => !t.done && t.priority === 'urgent').slice(0, 3).map((t) => t.title),
        motivationalNote: "Small steps every day.",
      };
    }
  },

  // ----------------------------------------------------------
  // DAILY DIGEST — with second brain context
  // ----------------------------------------------------------
  async dailyDigest(tasks: Task[]): Promise<string> {
    const client = await getClient();
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    // Pull any notes tagged "daily" or recently updated
    const notesContext = await notesService.getContextForQuery('today priorities focus', 3);

    const msg = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 400,
      system: `You are a GTD daily briefing AI. Given today's tasks and notes context, write a short upbeat daily digest. Start with the date. Highlight 1-2 must-dos, quick wins, and one motivational note. Under 100 words. No markdown.${notesContext}`,
      messages: [{ role: 'user', content: `Today is ${today}. Tasks: ${JSON.stringify(tasks.filter((t) => !t.done).slice(0, 20))}` }],
    });

    return msg.content[0].type === 'text' ? msg.content[0].text : 'Good morning! Focus on your top priorities today.';
  },

  // ----------------------------------------------------------
  // NOTE ASSISTANT — AI help while writing a note
  // ----------------------------------------------------------
  async expandNote(title: string, body: string, tasks: Task[]): Promise<string> {
    const client = await getClient();

    // Search for related notes to provide context
    const related = await notesService.getContextForQuery(`${title} ${body}`, 3);

    const msg = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      system: `You are a knowledge assistant helping the user expand and improve their notes. Suggest connections, add missing context, or ask clarifying questions. Be concise. 3-5 sentences max.${related}`,
      messages: [{
        role: 'user',
        content: `Note title: "${title}"\nBody: "${body}"\n\nHelp me develop this note.`,
      }],
    });

    return msg.content[0].type === 'text' ? msg.content[0].text : '';
  },
};
