// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Set these in your .env file:
// EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
// EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = supabaseUrl
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;

// ============================================================
// DATABASE TYPES
// ============================================================
export interface NoteRow {
  id: string;
  user_id: string;
  title: string;
  body: string;
  tags: string[];
  linked_tasks: string[];
  linked_notes: string[];
  embedding: number[] | null;
  created_at: string;
  updated_at: string;
}

export interface SearchResult {
  id: string;
  title: string;
  body: string;
  tags: string[];
  similarity?: number;
  score?: number;
  created_at: string;
}
