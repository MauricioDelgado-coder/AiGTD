// src/services/fileImportService.ts
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { getSecureItem } from '../lib/secureStorage';
import Anthropic from '@anthropic-ai/sdk';

export interface ImportedNote {
  title: string;
  body: string;
  tags: string[];
}

const SUPPORTED_TYPES = [
  'text/plain',
  'text/markdown',
  'application/pdf',
  'application/octet-stream', // fallback for .md files on some platforms
];

/** Pick one or more files and return parsed notes */
export async function pickAndImportFiles(): Promise<ImportedNote[]> {
  const result = await DocumentPicker.getDocumentAsync({
    type: SUPPORTED_TYPES,
    multiple: true,
    copyToCacheDirectory: true,
  });

  if (result.canceled || !result.assets?.length) return [];

  const notes: ImportedNote[] = [];
  for (const asset of result.assets) {
    try {
      const note = await parseFile(asset);
      if (note) notes.push(note);
    } catch (e) {
      console.warn(`Failed to import ${asset.name}:`, e);
    }
  }
  return notes;
}

async function parseFile(asset: DocumentPicker.DocumentPickerAsset): Promise<ImportedNote | null> {
  const name = asset.name ?? 'Imported note';
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  const titleFromName = name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');

  if (ext === 'pdf') {
    return parsePdf(asset.uri, titleFromName);
  }

  // txt, md, and anything else — read as plain text
  try {
    const text = await FileSystem.readAsStringAsync(asset.uri, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    return {
      title: titleFromName,
      body: text,
      tags: extractTags(text, ext),
    };
  } catch {
    return null;
  }
}

/** Extract text from PDF using Claude's document understanding */
async function parsePdf(uri: string, title: string): Promise<ImportedNote | null> {
  const key = await getSecureItem('aigtd.anthropicKey');
  if (!key) throw new Error('NO_API_KEY');

  // Read PDF as base64
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const client = new Anthropic({ apiKey: key });
  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'document',
            source: { type: 'base64', media_type: 'application/pdf', data: base64 },
          } as any,
          {
            type: 'text',
            text: 'Extract the full text content of this document. Return only the text, preserving paragraph breaks. No commentary.',
          },
        ],
      },
    ],
  });

  const body = msg.content[0].type === 'text' ? msg.content[0].text : '';
  return { title, body, tags: extractTags(body, 'pdf') };
}

/** Pull #hashtags from text and infer tags from file type */
function extractTags(text: string, ext: string): string[] {
  const hashTags = (text.match(/#(\w+)/g) ?? []).map(t => t.slice(1));
  const typeTags: Record<string, string> = {
    pdf: 'pdf',
    md: 'markdown',
    txt: 'text',
  };
  const typeTag = typeTags[ext];
  return Array.from(new Set([...hashTags, ...(typeTag ? [typeTag] : [])]));
}
