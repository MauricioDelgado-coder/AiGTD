// src/types.ts

export type TaskBucket =
  | 'inbox'
  | 'current'
  | 'project'
  | 'scheduled'
  | 'delegated'
  | 'future'
  | 'reference'
  | 'trash';

export type TaskPriority = 'urgent' | 'normal' | 'low';

export interface Task {
  id: string;
  title: string;
  notes?: string;
  bucket: TaskBucket;
  priority: TaskPriority;
  projectId?: string;
  scheduledDate?: string;
  delegateTo?: string;
  nextAction?: string;
  aiSuggestion?: string;
  tags: string[];
  done: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  taskIds: string[];
  color: string;
  createdAt: string;
  updatedAt: string;
}
