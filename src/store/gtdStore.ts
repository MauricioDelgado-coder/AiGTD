// src/store/gtdStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, Project, TaskBucket } from '../types';

const generateId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const now = () => new Date().toISOString();

interface GTDStore {
  tasks: Task[];
  projects: Project[];
  lastSynced: string | null;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, bucket: TaskBucket) => void;
  toggleDone: (id: string) => void;
  setLastSynced: (date: string) => void;
  hydrate: (tasks: Task[], projects: Project[]) => void;
}

export const useGTDStore = create<GTDStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      projects: [],
      lastSynced: null,

      addTask: (taskData) => {
        const task: Task = { ...taskData, id: generateId(), createdAt: now(), updatedAt: now() };
        set((s) => ({ tasks: [task, ...s.tasks] }));
        return task;
      },

      updateTask: (id, updates) =>
        set((s) => ({
          tasks: s.tasks.map((t) => t.id === id ? { ...t, ...updates, updatedAt: now() } : t),
        })),

      deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      moveTask: (id, bucket) =>
        set((s) => ({
          tasks: s.tasks.map((t) => t.id === id ? { ...t, bucket, updatedAt: now() } : t),
        })),

      toggleDone: (id) =>
        set((s) => ({
          tasks: s.tasks.map((t) => t.id === id ? { ...t, done: !t.done, updatedAt: now() } : t),
        })),

      setLastSynced: (date) => set({ lastSynced: date }),

      hydrate: (tasks, projects) => set({ tasks, projects }),
    }),
    {
      name: 'aigtd-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export function seedDemoData(store: GTDStore) {
  if (store.tasks.length > 0) return;
  store.addTask({ title: 'Follow up on permit status with contractor', bucket: 'inbox', priority: 'urgent', tags: ['work'], done: false });
  store.addTask({ title: 'Research CX survey tools for Q3', bucket: 'inbox', priority: 'normal', tags: ['work', 'research'], done: false });
  store.addTask({ title: 'Submit Orlando summit expense report', bucket: 'inbox', priority: 'normal', tags: ['work', 'finance'], done: false });
  store.addTask({ title: 'Explore AI agents for homebuilding workflows', bucket: 'future', priority: 'low', tags: ['ideas', 'ai'], done: false });
}
