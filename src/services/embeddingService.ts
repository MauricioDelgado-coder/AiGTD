// src/services/embeddingService.ts
/**
 * Embedding service using Voyage AI (voyage-3-lite)
 *
 * Why Voyage AI:
 * - Anthropic's officially recommended embedding partner
 * - voyage-3-lite: 1024 dimensions, fast, cheap ($0.02/MTok)
 * - 200M free tokens to start — enough for years of personal notes
 *
 * Get your free API key at: https://dash.voyageai.com
 * Set EXPO_PUBLIC_VOYAGE_API_KEY in your .env file
 */

const VOYAGE_API_KEY = process.env.EXPO_PUBLIC_VOYAGE_API_KEY!;
const VOYAGE_MODEL = 'voyage-3-lite'; // 1024 dims, fast, cheap
const VOYAGE_URL = 'https://api.voyageai.com/v1/embeddings';

export const embeddingService = {
  /**
   * Embed a single piece of text.
   * input_type "document" = for storing notes
   * input_type "query"    = for search queries
   */
  async embed(
    text: string,
    inputType: 'document' | 'query' = 'document'
  ): Promise<number[]> {
    const response = await fetch(VOYAGE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${VOYAGE_API_KEY}`,
      },
      body: JSON.stringify({
        model: VOYAGE_MODEL,
        input: [text],
        input_type: inputType,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Voyage embedding failed: ${err}`);
    }

    const data = await response.json();
    return data.data[0].embedding as number[];
  },

  /**
   * Embed multiple texts in a single API call (more efficient).
   */
  async embedBatch(
    texts: string[],
    inputType: 'document' | 'query' = 'document'
  ): Promise<number[][]> {
    const response = await fetch(VOYAGE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${VOYAGE_API_KEY}`,
      },
      body: JSON.stringify({
        model: VOYAGE_MODEL,
        input: texts,
        input_type: inputType,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Voyage batch embedding failed: ${err}`);
    }

    const data = await response.json();
    return data.data.map((d: any) => d.embedding) as number[][];
  },

  /**
   * Build the text to embed for a note.
   * Combines title + tags + body for richer semantic representation.
   */
  buildNoteText(title: string, body: string, tags: string[]): string {
    const tagStr = tags.length ? `Tags: ${tags.join(', ')}` : '';
    return [title, tagStr, body].filter(Boolean).join('\n').slice(0, 4000);
  },
};
