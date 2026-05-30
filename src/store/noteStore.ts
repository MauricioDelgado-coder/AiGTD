// src/store/noteStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Note {
  id: string;
  title: string;
  body: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const now = () => new Date().toISOString();

interface NoteStore {
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Note;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
}

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      notes: [],
      addNote: (data) => {
        const note: Note = { ...data, id: uid(), createdAt: now(), updatedAt: now() };
        set((s) => ({ notes: [note, ...s.notes] }));
        return note;
      },
      updateNote: (id, updates) =>
        set((s) => ({
          notes: s.notes.map((n) => n.id === id ? { ...n, ...updates, updatedAt: now() } : n),
        })),
      deleteNote: (id) => set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),
    }),
    { name: 'aigtd-notes', storage: createJSONStorage(() => AsyncStorage) }
  )
);
