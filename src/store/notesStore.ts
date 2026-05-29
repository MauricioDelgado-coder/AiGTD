// src/store/notesStore.ts
import { create } from 'zustand';
import { notesService, Note } from '../services/notesService';

interface NotesStore {
  notes: Note[];
  loading: boolean;
  searchResults: Note[];
  searchQuery: string;

  // Actions
  loadNotes: () => Promise<void>;
  createNote: (input: { title: string; body: string; tags?: string[]; linkedTasks?: string[] }) => Promise<Note>;
  updateNote: (id: string, updates: { title?: string; body?: string; tags?: string[] }) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  search: (query: string) => Promise<void>;
  clearSearch: () => void;
}

export const useNotesStore = create<NotesStore>((set, get) => ({
  notes: [],
  loading: false,
  searchResults: [],
  searchQuery: '',

  loadNotes: async () => {
    set({ loading: true });
    try {
      const notes = await notesService.getAll();
      set({ notes });
    } catch (e) {
      console.warn('[notesStore] loadNotes error:', e);
    } finally {
      set({ loading: false });
    }
  },

  createNote: async (input) => {
    const note = await notesService.create(input);
    set((state) => ({ notes: [note, ...state.notes] }));
    return note;
  },

  updateNote: async (id, updates) => {
    const updated = await notesService.update(id, updates);
    set((state) => ({
      notes: state.notes.map((n) => (n.id === id ? updated : n)),
    }));
  },

  deleteNote: async (id) => {
    await notesService.delete(id);
    set((state) => ({ notes: state.notes.filter((n) => n.id !== id) }));
  },

  search: async (query) => {
    set({ searchQuery: query, loading: true });
    try {
      const results = await notesService.search(query);
      // Cast SearchResult to Note shape for display
      set({ searchResults: results as any });
    } catch {
      set({ searchResults: [] });
    } finally {
      set({ loading: false });
    }
  },

  clearSearch: () => set({ searchResults: [], searchQuery: '' }),
}));
