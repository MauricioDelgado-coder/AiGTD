// src/services/iCloudService.ts
/**
 * iCloud KV sync via expo-icloud-storage
 * Falls back to AsyncStorage when iCloud is unavailable.
 *
 * Expo setup (already done in app.json):
 *   ios.entitlements["com.apple.developer.ubiquity-kvstore-identifier"]
 *   = "$(TeamIdentifierPrefix)$(CFBundleIdentifier)"
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, Project } from '../types';

const TASKS_KEY = 'aigtd.tasks';
const PROJECTS_KEY = 'aigtd.projects';
const LAST_SYNC_KEY = 'aigtd.lastSync';

// Lazy import — only available on iOS device/simulator with iCloud
let iCloudStorage: any = null;
try {
  iCloudStorage = require('expo-icloud-storage').default;
} catch {
  // Not available (Android, web, or missing native build)
}

class ICloudService {
  get available() {
    return !!iCloudStorage;
  }

  async sync(tasks: Task[], projects: Project[]): Promise<void> {
    const ts = new Date().toISOString();
    try {
      if (this.available) {
        iCloudStorage.set(TASKS_KEY, JSON.stringify(tasks));
        iCloudStorage.set(PROJECTS_KEY, JSON.stringify(projects));
        iCloudStorage.set(LAST_SYNC_KEY, ts);
      } else {
        await AsyncStorage.multiSet([
          [TASKS_KEY, JSON.stringify(tasks)],
          [PROJECTS_KEY, JSON.stringify(projects)],
          [LAST_SYNC_KEY, ts],
        ]);
      }
    } catch (e) {
      console.warn('[iCloudService] sync error:', e);
    }
  }

  async load(): Promise<{ tasks: Task[]; projects: Project[] } | null> {
    try {
      let tasksJson: string | null = null;
      let projectsJson: string | null = null;

      if (this.available) {
        tasksJson = iCloudStorage.getString(TASKS_KEY) ?? null;
        projectsJson = iCloudStorage.getString(PROJECTS_KEY) ?? null;
      } else {
        const res = await AsyncStorage.multiGet([TASKS_KEY, PROJECTS_KEY]);
        tasksJson = res[0][1];
        projectsJson = res[1][1];
      }

      return {
        tasks: tasksJson ? (JSON.parse(tasksJson) as Task[]) : [],
        projects: projectsJson ? (JSON.parse(projectsJson) as Project[]) : [],
      };
    } catch (e) {
      console.warn('[iCloudService] load error:', e);
      return null;
    }
  }

  async getLastSynced(): Promise<string | null> {
    try {
      if (this.available) return iCloudStorage.getString(LAST_SYNC_KEY) ?? null;
      return AsyncStorage.getItem(LAST_SYNC_KEY);
    } catch { return null; }
  }
}

export const iCloudService = new ICloudService();
