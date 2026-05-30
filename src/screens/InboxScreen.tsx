import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { T, FontFamily } from '../theme';
import { Mono, Serif, Checkbox, Chip, Card } from '../components/primitives';
import { useGTDStore } from '../store/gtdStore';
import { aiService } from '../services/aiService';

export const InboxScreen: React.FC = () => {
  const router = useRouter();
  const { tasks, addTask, updateTask, toggleDone } = useGTDStore();
  const [captureText, setCaptureText] = useState('');
  const [processing, setProcessing] = useState(false);
  const [filter, setFilter] = useState('All');

  const inboxTasks = tasks.filter(t => t.bucket === 'inbox');

  const filteredTasks = inboxTasks.filter(t => {
    if (filter === 'All') return true;
    if (filter === 'Flagged') return t.priority === 'urgent';
    if (filter === 'Unsorted') return t.tags.length === 0;
    if (filter === 'Today') {
      if (!t.scheduledDate) return false;
      const today = new Date().toDateString();
      return new Date(t.scheduledDate).toDateString() === today;
    }
    return true;
  });

  const handleCapture = async () => {
    const text = captureText.trim();
    if (!text || processing) return;
    setCaptureText('');
    setProcessing(true);

    // Add task immediately so UI feels fast
    const task = addTask({ title: text, bucket: 'inbox', priority: 'normal', tags: [], done: false });

    // Then try AI clarification in the background
    try {
      const result = await aiService.clarify(text);
      updateTask(task.id, {
        aiSuggestion: result.summary,
        nextAction: result.nextAction,
        tags: result.suggestedTags,
        priority: result.isQuick ? 'normal' : (result.needsAction ? 'normal' : 'low'),
      });
    } catch {
      // No API key or network error — task already added, just skip AI
    } finally {
      setProcessing(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }} edges={['top']}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 6 }}>
        <Serif size={30}>Inbox</Serif>
        <Mono>{inboxTasks.length} items</Mono>
      </View>

      {/* Capture bar */}
      <View style={{ paddingHorizontal: 20, marginBottom: 14 }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          padding: 6,
          paddingLeft: 16,
          borderRadius: 16,
          backgroundColor: T.card,
          borderWidth: 1,
          borderColor: T.indigoBd,
          // @ts-ignore
          boxShadow: '0 0 0 4px rgba(123,110,246,0.07)',
        }}>
          <Text style={{ fontSize: 16, color: T.indigoLt, fontWeight: '600' }}>+</Text>
          <TextInput
            style={{ flex: 1, fontSize: 15, color: T.text, fontFamily: FontFamily.sans, paddingVertical: 8 }}
            value={captureText}
            onChangeText={setCaptureText}
            placeholder="Capture anything…"
            placeholderTextColor={T.faint}
            returnKeyType="done"
            onSubmitEditing={handleCapture}
          />
          <TouchableOpacity
            style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: T.indigo, alignItems: 'center', justifyContent: 'center' }}
            onPress={handleCapture}
            disabled={processing}
          >
            {processing
              ? <ActivityIndicator color="#fff" size="small" />
              : <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>✦</Text>
            }
          </TouchableOpacity>
        </View>
        {processing && (
          <Mono color={T.indigo} size={10} spacing={1} style={{ marginTop: 6, marginLeft: 4 }}>
            AI is analyzing your task…
          </Mono>
        )}
      </View>

      {/* Filter chips */}
      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginBottom: 14 }}>
        {['All', 'Today', 'Flagged', 'Unsorted'].map(f => (
          <Chip key={f} active={filter === f} onPress={() => setFilter(f)}>{f}</Chip>
        ))}
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={t => t.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
        ListEmptyComponent={
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ fontSize: 28, marginBottom: 12 }}>📭</Text>
            <Serif size={18} color={T.sub}>{filter === 'All' ? 'Inbox zero' : `No ${filter.toLowerCase()} items`}</Serif>
            <Mono color={T.faint} style={{ marginTop: 8, textAlign: 'center' }}>
              {filter === 'All' ? 'Well done — nothing left to capture' : 'Try a different filter'}
            </Mono>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 13,
              padding: 14,
              backgroundColor: T.card,
              borderRadius: 18,
              borderWidth: 1,
              borderColor: item.aiSuggestion ? T.indigoBd : T.line,
              marginBottom: 8,
            }}
            onPress={() => router.push(`/task/${item.id}`)}
          >
            <Checkbox done={item.done} color={item.done ? T.faint : T.indigo} onPress={() => toggleDone(item.id)} />
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 14.5,
                fontWeight: '500',
                color: item.done ? T.faint : T.text,
                fontFamily: FontFamily.sans,
                textDecorationLine: item.done ? 'line-through' : 'none',
              }} numberOfLines={2}>
                {item.title}
              </Text>
              {item.aiSuggestion ? (
                <Mono size={9.5} spacing={1} color={T.indigo} style={{ marginTop: 5 }} numberOfLines={1}>
                  ✦ {item.aiSuggestion}
                </Mono>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 5 }}>
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: item.priority === 'urgent' ? T.rose : T.indigo }} />
                  <Mono size={9.5} spacing={1}>{item.tags[0] || 'Inbox'}</Mono>
                </View>
              )}
            </View>
            {item.priority === 'urgent' && (
              <Text style={{ color: T.rose, fontSize: 14 }}>⚑</Text>
            )}
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};
