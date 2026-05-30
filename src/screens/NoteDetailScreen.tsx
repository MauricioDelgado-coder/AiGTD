import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { T, FontFamily } from '../theme';
import { Mono, Serif } from '../components/primitives';
import { useNoteStore } from '../store/noteStore';
import { useGTDStore } from '../store/gtdStore';
import { aiService } from '../services/aiService';

const TOOLS = [
  { label: 'H',    before: '## ',  after: ''   },
  { label: 'B',    before: '**',   after: '**' },
  { label: 'i',    before: '*',    after: '*'  },
  { label: '[[]]', before: '[[',   after: ']]' },
  { label: '#',    before: '#',    after: ''   },
  { label: '•',    before: '- ',   after: ''   },
];

export const NoteDetailScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { notes, addNote, updateNote } = useNoteStore();
  const { tasks } = useGTDStore();

  const existing = id ? notes.find(n => n.id === id) : null;

  const [title, setTitle] = useState(existing?.title ?? '');
  const [body, setBody]   = useState(existing?.body  ?? '');
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [aiLoading, setAiLoading] = useState(false);
  const bodyRef = useRef<TextInput>(null);

  const insertAtCursor = (before: string, after: string) => {
    const selected = body.slice(selection.start, selection.end);
    const newBody =
      body.slice(0, selection.start) +
      before + selected + after +
      body.slice(selection.end);
    setBody(newBody);
    // refocus
    setTimeout(() => bodyRef.current?.focus(), 50);
  };

  const handleSave = () => {
    const t = title.trim() || 'Untitled';
    const b = body.trim();
    // extract #tags from body
    const tags = [...new Set((b.match(/#(\w+)/g) ?? []).map(t => t.slice(1)))];
    if (existing) {
      updateNote(existing.id, { title: t, body: b, tags });
    } else {
      addNote({ title: t, body: b, tags });
    }
    router.back();
  };

  const handleAI = async () => {
    if (!title.trim() && !body.trim()) {
      Alert.alert('Write something first', 'Add a title or some content before asking AI to expand.');
      return;
    }
    setAiLoading(true);
    try {
      const suggestion = await aiService.expandNote(title, body, tasks);
      setBody(prev => prev + '\n\n---\n✦ AI suggestion:\n' + suggestion);
    } catch (e: any) {
      Alert.alert(
        'AI unavailable',
        e?.message === 'NO_API_KEY'
          ? 'Add your Anthropic API key in Settings.'
          : 'Something went wrong.'
      );
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Nav bar */}
        <View style={{
          flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
          paddingHorizontal: 18, paddingVertical: 12,
          borderBottomWidth: 1, borderBottomColor: T.line,
        }}>
          <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ color: T.indigoLt, fontSize: 18 }}>‹</Text>
            <Mono color={T.indigoLt}>Notes</Mono>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ backgroundColor: T.indigo, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 7 }}
            onPress={handleSave}
          >
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 13, fontFamily: FontFamily.sans }}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 80 }}
          keyboardShouldPersistTaps="handled"
        >
          <Mono color={T.faint}>{existing ? 'Edit note' : 'New note'}</Mono>
          <TextInput
            style={{
              fontFamily: FontFamily.serif, fontStyle: 'italic',
              fontSize: 28, color: T.text,
              marginTop: 10, marginBottom: 16, padding: 0,
            }}
            value={title}
            onChangeText={setTitle}
            placeholder="Note title…"
            placeholderTextColor={T.faint}
            autoFocus={!existing}
            multiline={false}
          />
          <TextInput
            ref={bodyRef}
            style={{
              fontSize: 14.5, lineHeight: 24, color: T.text,
              fontFamily: FontFamily.sans, minHeight: 300, padding: 0,
            }}
            value={body}
            onChangeText={setBody}
            onSelectionChange={e => setSelection(e.nativeEvent.selection)}
            placeholder={'Start writing…\n\n[[Link to note]]\n#tag'}
            placeholderTextColor={T.faint}
            multiline
            textAlignVertical="top"
          />
        </ScrollView>

        {/* Toolbar */}
        <View style={{
          flexDirection: 'row', alignItems: 'center',
          paddingHorizontal: 6, paddingVertical: 8,
          backgroundColor: T.glass,
          borderTopWidth: 1, borderTopColor: T.glassBd,
        }}>
          {TOOLS.map((tool) => (
            <TouchableOpacity
              key={tool.label}
              style={{ flex: 1, alignItems: 'center', paddingVertical: 8 }}
              onPress={() => insertAtCursor(tool.before, tool.after)}
            >
              <Text style={{
                fontFamily: FontFamily.mono, fontSize: 13.5,
                color: tool.label === '[[]]' ? T.indigoLt : T.sub,
                fontWeight: '500',
              }}>
                {tool.label}
              </Text>
            </TouchableOpacity>
          ))}
          {/* AI expand button */}
          <TouchableOpacity
            style={{ flex: 1, alignItems: 'center', paddingVertical: 8 }}
            onPress={handleAI}
            disabled={aiLoading}
          >
            {aiLoading
              ? <ActivityIndicator size="small" color={T.indigo} />
              : <Text style={{ fontSize: 16, color: T.indigoLt }}>✦</Text>
            }
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
