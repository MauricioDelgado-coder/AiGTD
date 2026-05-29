// src/screens/NoteDetailScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, Typography, Radius } from '../theme';
import { useNotesStore } from '../store/notesStore';
import { useGTDStore } from '../store/gtdStore';
import { aiService } from '../services/aiService';
import { AIOrb } from '../components/AIOrb';
import { notesService } from '../services/notesService';

export const NoteDetailScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const noteId = id === 'new' ? null : id;
  const { notes, createNote, updateNote, deleteNote } = useNotesStore();
  const { tasks } = useGTDStore();

  const isNew = !noteId;
  const existing = isNew ? null : notes.find((n) => n.id === noteId) ?? null;

  const [title, setTitle] = useState(existing?.title ?? '');
  const [body, setBody] = useState(existing?.body ?? '');
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [relatedTasks, setRelatedTasks] = useState<string[]>(existing?.linkedTasks ?? []);
  const [showTaskPicker, setShowTaskPicker] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-save with debounce
  useEffect(() => {
    if (!title.trim()) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => handleSave(false), 1500);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [title, body]);

  const handleSave = async (showFeedback = true) => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      if (isNew && !noteId) {
        await createNote({ title, body, linkedTasks: relatedTasks });
        if (showFeedback) { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); router.back(); }
      } else if (existing) {
        await updateNote(existing.id, { title, body });
        if (showFeedback) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (e) {
      Alert.alert('Save failed', String(e));
    } finally {
      setSaving(false);
    }
  };

  const handleAIExpand = async () => {
    if (!title.trim()) { Alert.alert('Add a title first'); return; }
    setAiLoading(true);
    setAiSuggestion('');
    try {
      const suggestion = await aiService.expandNote(title, body, tasks);
      setAiSuggestion(suggestion);
    } catch {
      setAiSuggestion('Could not reach AI. Check your API key in Settings.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleDelete = () => {
    if (!existing) return;
    Alert.alert('Delete Note', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await deleteNote(existing.id);
        router.back();
      }},
    ]);
  };

  // Insert wikilink syntax at cursor
  const insertWikilink = (noteName: string) => {
    setBody((b) => b + `[[${noteName}]]`);
  };

  // Highlight [[wikilinks]] in preview
  const renderBodyWithHighlights = () => {
    const parts = body.split(/(\[\[[^\]]+\]\]|#\w+)/g);
    return parts.map((part, i) => {
      if (part.match(/^\[\[.+\]\]$/)) {
        return <Text key={i} style={styles.wikilink}>{part}</Text>;
      }
      if (part.match(/^#\w+$/)) {
        return <Text key={i} style={styles.hashtag}>{part}</Text>;
      }
      return <Text key={i} style={styles.bodyText}>{part}</Text>;
    });
  };

  const wikilinks = body.match(/\[\[([^\]]+)\]\]/g)?.map((m) => m.slice(2, -2)) ?? [];
  const hashtags = body.match(/#(\w+)/g)?.map((m) => m.slice(1)) ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.headerActions}>
            {saving && <ActivityIndicator color={Colors.accent} size="small" style={{ marginRight: 8 }} />}
            {!isNew && (
              <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
                <Text style={styles.deleteBtnText}>🗑</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.saveBtn} onPress={() => handleSave(true)}>
              <Text style={styles.saveBtnText}>{isNew ? 'Create' : 'Save'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {/* Title */}
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Note title…"
            placeholderTextColor={Colors.textMuted}
            fontSize={22}
            multiline={false}
            autoFocus={isNew}
          />

          {/* Metadata row */}
          {(wikilinks.length > 0 || hashtags.length > 0) && (
            <View style={styles.metaRow}>
              {wikilinks.map((l) => (
                <View key={l} style={styles.wikilinkBadge}>
                  <Text style={styles.wikilinkBadgeText}>🔗 {l}</Text>
                </View>
              ))}
              {hashtags.map((t) => (
                <View key={t} style={styles.tagBadge}>
                  <Text style={styles.tagBadgeText}>#{t}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Body editor */}
          <TextInput
            style={styles.bodyInput}
            value={body}
            onChangeText={setBody}
            placeholder={`Start writing…\n\nUse [[Note Title]] to link notes\nUse #tag to add tags\nUse [[Task: task name]] to link tasks`}
            placeholderTextColor={Colors.textMuted}
            multiline
            textAlignVertical="top"
          />

          {/* AI Suggestion */}
          {(aiLoading || aiSuggestion) && (
            <View style={styles.aiCard}>
              <View style={styles.aiCardHeader}>
                <AIOrb size={20} thinking={aiLoading} />
                <Text style={styles.aiCardLabel}>AI Suggestion</Text>
              </View>
              {aiLoading
                ? <ActivityIndicator color={Colors.accent} />
                : (
                  <>
                    <Text style={styles.aiCardText}>{aiSuggestion}</Text>
                    <TouchableOpacity
                      style={styles.appendBtn}
                      onPress={() => { setBody((b) => b + '\n\n' + aiSuggestion); setAiSuggestion(''); }}
                    >
                      <Text style={styles.appendBtnText}>+ Append to note</Text>
                    </TouchableOpacity>
                  </>
                )
              }
            </View>
          )}

          {/* Linked tasks */}
          {relatedTasks.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>LINKED TASKS</Text>
              {relatedTasks.map((taskId) => {
                const t = tasks.find((t) => t.id === taskId);
                return t ? (
                  <View key={taskId} style={styles.linkedTask}>
                    <Text style={styles.linkedTaskText}>⚡ {t.title}</Text>
                  </View>
                ) : null;
              })}
            </View>
          )}
        </ScrollView>

        {/* Bottom toolbar */}
        <View style={styles.toolbar}>
          <TouchableOpacity style={styles.toolBtn} onPress={handleAIExpand} disabled={aiLoading}>
            <Text style={styles.toolBtnText}>✦ AI Expand</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolBtn} onPress={() => setBody((b) => b + '[[')}>
            <Text style={styles.toolBtnText}>[[Link]]</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolBtn} onPress={() => setBody((b) => b + '#')}>
            <Text style={styles.toolBtnText}>#Tag</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolBtn} onPress={() => setShowTaskPicker(!showTaskPicker)}>
            <Text style={styles.toolBtnText}>⚡ Task</Text>
          </TouchableOpacity>
        </View>

        {/* Task picker */}
        {showTaskPicker && (
          <View style={styles.taskPicker}>
            <Text style={styles.taskPickerLabel}>Link a task:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {tasks.filter((t) => !t.done).slice(0, 15).map((t) => (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.taskChip, relatedTasks.includes(t.id) && styles.taskChipActive]}
                  onPress={() => {
                    setRelatedTasks((prev) =>
                      prev.includes(t.id) ? prev.filter((id) => id !== t.id) : [...prev, t.id]
                    );
                    insertWikilink(`Task: ${t.title}`);
                  }}
                >
                  <Text style={styles.taskChipText} numberOfLines={1}>{t.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  back: { color: Colors.accent, fontSize: 15, fontFamily: Typography.bodyFont },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  deleteBtn: { padding: 4 },
  deleteBtnText: { fontSize: 18 },
  saveBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  saveBtnText: { color: Colors.white, fontWeight: '600', fontSize: 13, fontFamily: Typography.bodyFont },
  scroll: { flex: 1 },
  content: { padding: Spacing.md, paddingBottom: 20 },
  titleInput: {
    color: Colors.text,
    fontFamily: Typography.displayFont,
    fontStyle: 'italic',
    fontSize: 22,
    marginBottom: 12,
    paddingVertical: 0,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  wikilinkBadge: {
    backgroundColor: 'rgba(94,207,177,0.1)',
    borderRadius: Radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: Colors.mint,
  },
  wikilinkBadgeText: { color: Colors.mint, fontSize: 11, fontFamily: Typography.monoFont },
  tagBadge: {
    backgroundColor: Colors.accentDim,
    borderRadius: Radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  tagBadgeText: { color: Colors.accent, fontSize: 11, fontFamily: Typography.monoFont },
  bodyInput: {
    color: Colors.text,
    fontFamily: Typography.bodyFont,
    fontSize: 15,
    lineHeight: 24,
    minHeight: 220,
    paddingVertical: 0,
  },
  bodyText: { color: Colors.text },
  wikilink: { color: Colors.mint, fontStyle: 'italic' },
  hashtag: { color: Colors.accent },
  aiCard: {
    backgroundColor: Colors.accentDim,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.accent,
    padding: 14,
    marginTop: 20,
  },
  aiCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  aiCardLabel: { color: Colors.accent, fontSize: 10, fontFamily: Typography.monoFont, letterSpacing: 1 },
  aiCardText: { color: Colors.text, fontSize: 14, fontFamily: Typography.bodyFont, lineHeight: 21 },
  appendBtn: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  appendBtnText: { color: Colors.white, fontSize: 12, fontFamily: Typography.bodyFont, fontWeight: '600' },
  section: { marginTop: 20 },
  sectionLabel: {
    color: Colors.textMuted, fontSize: 10, fontFamily: Typography.monoFont,
    letterSpacing: 1.5, marginBottom: 8,
  },
  linkedTask: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  linkedTaskText: { color: Colors.text, fontSize: 13, fontFamily: Typography.bodyFont },
  toolbar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingVertical: 8,
    paddingHorizontal: Spacing.md,
    gap: 8,
  },
  toolBtn: {
    backgroundColor: Colors.surface2,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toolBtnText: { color: Colors.textSub, fontSize: 12, fontFamily: Typography.bodyFont, fontWeight: '500' },
  taskPicker: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    padding: 12,
  },
  taskPickerLabel: {
    color: Colors.textMuted, fontSize: 10, fontFamily: Typography.monoFont,
    letterSpacing: 1.2, marginBottom: 8,
  },
  taskChip: {
    backgroundColor: Colors.surface2,
    borderRadius: Radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    maxWidth: 180,
  },
  taskChipActive: { backgroundColor: Colors.accentDim, borderColor: Colors.accent },
  taskChipText: { color: Colors.textSub, fontSize: 12, fontFamily: Typography.bodyFont },
});
