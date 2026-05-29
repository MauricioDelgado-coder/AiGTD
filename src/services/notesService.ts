// src/services/notesService.ts
import { supabase, NoteRow, SearchResult } from '../lib/supabase';
import { embeddingService } from './embeddingService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_ID_KEY = 'aigtd.userId';

// ============================================================
// Stable device user ID (no auth required)
// ============================================================
async function getUserId(): Promise<string> {
  let id = await AsyncStorage.getItem(USER_ID_KEY);
  if (!id) {
    id = 'user_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    await AsyncStorage.setItem(USER_ID_KEY, id);
  }
  return id;
}

// ============================================================
// Parse [[wikilinks]] from note body
// ============================================================
function extractWikilinks(body: string): string[] {
  const matches = body.match(/\[\[([^\]]+)\]\]/g) ?? [];
  return matches.map((m) => m.slice(2, -2).trim());
}

// ============================================================
// Parse #tags from note body
// ============================================================
function extractInlineTags(body: string): string[] {
  const matches = body.match(/#(\w+)/g) ?? [];
  return matches.map((m) => m.slice(1).toLowerCase());
}

export interface Note {
  id: string;
  title: string;
  body: string;
  tags: string[];
  linkedTasks: string[];
  linkedNotes: string[];
  wikilinks: string[]; // parsed from body
  inlineTags: string[]; // parsed from body
  createdAt: string;
  updatedAt: string;
}

function rowToNote(row: NoteRow): Note {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    tags: row.tags,
    linkedTasks: row.linked_tasks,
    linkedNotes: row.linked_notes,
    wikilinks: extractWikilinks(row.body),
    inlineTags: extractInlineTags(row.body),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const notesService = {
  // ----------------------------------------------------------
  // CREATE
  // ----------------------------------------------------------
  async create(input: {
    title: string;
    body: string;
    tags?: string[];
    linkedTasks?: string[];
  }): Promise<Note> {
    const userId = await getUserId();
    const tags = [
      ...(input.tags ?? []),
      ...extractInlineTags(input.body),
    ].filter((v, i, a) => a.indexOf(v) === i); // dedupe

    // Generate embedding async - don't block save
    let embedding: number[] | null = null;
    try {
      embedding = await embeddingService.embed(
        embeddingService.buildNoteText(input.title, input.body, tags),
        'document'
      );
    } catch (e) {
      console.warn('[notesService] embedding failed, saving without:', e);
    }

    if (!supabase) throw new Error('Supabase not configured. Add your credentials in Settings.');

    const { data, error } = await supabase
      .from('notes')
      .insert({
        user_id: userId,
        title: input.title,
        body: input.body,
        tags,
        linked_tasks: input.linkedTasks ?? [],
        linked_notes: [],
        embedding,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return rowToNote(data as NoteRow);
  },

  // ----------------------------------------------------------
  // UPDATE
  // ----------------------------------------------------------
  async update(
    id: string,
    updates: { title?: string; body?: string; tags?: string[]; linkedTasks?: string[] }
  ): Promise<Note> {
    // Re-embed if title or body changed
    let embedding: number[] | undefined;
    if (updates.title || updates.body) {
      const existing = await notesService.getById(id);
      const newTitle = updates.title ?? existing?.title ?? '';
      const newBody = updates.body ?? existing?.body ?? '';
      const newTags = updates.tags ?? existing?.tags ?? [];
      try {
        embedding = await embeddingService.embed(
          embeddingService.buildNoteText(newTitle, newBody, newTags),
          'document'
        );
      } catch {
        // keep existing embedding
      }
    }

    if (!supabase) throw new Error('Supabase not configured. Add your credentials in Settings.');

    const payload: Partial<NoteRow> = {};
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.body !== undefined) payload.body = updates.body;
    if (updates.tags !== undefined) payload.tags = updates.tags;
    if (updates.linkedTasks !== undefined) payload.linked_tasks = updates.linkedTasks;
    if (embedding) payload.embedding = embedding;

    const { data, error } = await supabase
      .from('notes')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return rowToNote(data as NoteRow);
  },

  // ----------------------------------------------------------
  // DELETE
  // ----------------------------------------------------------
  async delete(id: string): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured. Add your credentials in Settings.');
    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },

  // ----------------------------------------------------------
  // GET ALL (for list view)
  // ----------------------------------------------------------
  async getAll(): Promise<Note[]> {
    if (!supabase) return [];
    const userId = await getUserId();
    const { data, error } = await supabase
      .from('notes')
      .select('id, title, body, tags, linked_tasks, linked_notes, created_at, updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data as NoteRow[]).map(rowToNote);
  },

  // ----------------------------------------------------------
  // GET BY ID
  // ----------------------------------------------------------
  async getById(id: string): Promise<Note | null> {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return rowToNote(data as NoteRow);
  },

  // ----------------------------------------------------------
  // HYBRID SEARCH (semantic + keyword)
  // The main search used everywhere in the app
  // ----------------------------------------------------------
  async search(query: string, limit = 5): Promise<SearchResult[]> {
    const userId = await getUserId();

    // Embed the query
    let queryEmbedding: number[];
    try {
      queryEmbedding = await embeddingService.embed(query, 'query');
    } catch {
      // Fall back to keyword-only search
      return notesService.keywordSearch(query, limit);
    }

    if (!supabase) return notesService.keywordSearch(query, limit);
    const { data, error } = await supabase.rpc('hybrid_search_notes', {
      query_text: query,
      query_embedding: queryEmbedding,
      match_count: limit,
      p_user_id: userId,
      semantic_weight: 0.7,
      keyword_weight: 0.3,
    });

    if (error) {
      console.warn('[notesService] hybrid search error:', error);
      return notesService.keywordSearch(query, limit);
    }

    return data as SearchResult[];
  },

  // ----------------------------------------------------------
  // KEYWORD SEARCH fallback (no embedding needed)
  // ----------------------------------------------------------
  async keywordSearch(query: string, limit = 10): Promise<SearchResult[]> {
    if (!supabase) return [];
    const userId = await getUserId();
    const { data, error } = await supabase
      .from('notes')
      .select('id, title, body, tags, created_at')
      .eq('user_id', userId)
      .textSearch('fts', query, { type: 'plain', config: 'english' })
      .limit(limit);

    if (error) return [];
    return data as SearchResult[];
  },

  // ----------------------------------------------------------
  // CONTEXT FETCH FOR AI AGENT
  // Called before every AI response to inject relevant notes
  // Returns top N notes as formatted context string
  // ----------------------------------------------------------
  async getContextForQuery(query: string, maxNotes = 4): Promise<string> {
    try {
      const results = await notesService.search(query, maxNotes);
      if (!results.length) return '';

      const formatted = results
        .map((n, i) => {
          const preview = n.body.slice(0, 400).trim();
          return `[Note ${i + 1}: "${n.title}"]\n${preview}${n.body.length > 400 ? '…' : ''}`;
        })
        .join('\n\n---\n\n');

      return `\n\n=== RELEVANT NOTES FROM YOUR SECOND BRAIN ===\n${formatted}\n=== END NOTES ===`;
    } catch {
      return '';
    }
  },

  // ----------------------------------------------------------
  // GET NOTES LINKED TO A TASK
  // ----------------------------------------------------------
  async getForTask(taskId: string): Promise<Note[]> {
    if (!supabase) return [];
    const userId = await getUserId();
    const { data, error } = await supabase
      .from('notes')
      .select('id, title, body, tags, linked_tasks, linked_notes, created_at, updated_at')
      .eq('user_id', userId)
      .contains('linked_tasks', [taskId]);

    if (error) return [];
    return (data as NoteRow[]).map(rowToNote);
  },
};
