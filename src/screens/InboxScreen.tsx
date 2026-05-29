import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { T, FontFamily, Radius } from '../theme';
import { Mono, Serif, Card, Checkbox, Chip, Icon, GlassTabBar } from '../components/primitives';
import { useGTDStore } from '../store/gtdStore';

export const InboxScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { tasks, addTask, updateTask, toggleDone, moveTask } = useGTDStore();
  const [captureText, setCaptureText] = useState('');
  const [processing, setProcessing] = useState(false);
  const [filter, setFilter] = useState('All');
  const inboxTasks = tasks.filter(t => t.bucket === 'inbox');

  const handleCapture = async () => {
    const text = captureText.trim();
    if (!text || processing) return;
    setCaptureText('');
    setProcessing(true);
    addTask({ title: text, bucket: 'inbox', priority: 'normal', tags: [], done: false });
    setProcessing(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 6 }}>
        <Serif size={30}>Inbox</Serif>
        <Mono>{inboxTasks.length} items</Mono>
      </View>
      <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 6, paddingLeft: 16, borderRadius: 16, backgroundColor: T.card, borderWidth: 1, borderColor: T.line }}>
          <Text style={{ fontSize: 18, color: T.indigoLt }}>+</Text>
          <TextInput style={{ flex: 1, fontSize: 15, color: T.text, fontFamily: FontFamily.sans, paddingVertical: 8 }} value={captureText} onChangeText={setCaptureText} placeholder="Capture anything…" placeholderTextColor={T.faint} returnKeyType="done" onSubmitEditing={handleCapture} />
          <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: T.indigo, alignItems: 'center', justifyContent: 'center' }} onPress={handleCapture} disabled={processing}>
            {processing ? <ActivityIndicator color="#fff" size="small" /> : <Text style={{ color: '#fff', fontSize: 18 }}>♪</Text>}
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginBottom: 14 }}>
        {['All', 'Today', 'Flagged', 'Unsorted'].map(f => <Chip key={f} active={filter === f} onPress={() => setFilter(f)}>{f}</Chip>)}
      </View>
      <FlatList
        data={inboxTasks}
        keyExtractor={t => t.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
        ListEmptyComponent={<View style={{ padding: 40, alignItems: 'center' }}><Mono color={T.faint}>Inbox zero — well done</Mono></View>}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 13, padding: 14, backgroundColor: T.card, borderRadius: index === 0 ? 18 : 0, borderWidth: 1, borderColor: T.line, marginBottom: 8, borderRadius: 18 }} onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}>
            <Checkbox done={item.done} color={item.done ? T.faint : T.indigo} onPress={() => toggleDone(item.id)} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14.5, fontWeight: '500', color: item.done ? T.faint : T.text, fontFamily: FontFamily.sans, textDecorationLine: item.done ? 'line-through' : 'none' }} numberOfLines={2}>{item.title}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 5 }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: item.priority === 'urgent' ? T.rose : T.indigo }} />
                <Mono size={9.5} spacing={1}>{item.tags[0] || 'Inbox'}</Mono>
                {item.nextAction ? <><Text style={{ color: T.dim }}>·</Text><Mono size={9.5} spacing={1} color={T.faint}>{item.nextAction.slice(0, 24)}</Mono></> : null}
              </View>
            </View>
            {item.priority === 'urgent' && <Text style={{ color: T.rose }}>⚑</Text>}
          </TouchableOpacity>
        )}
      />
      <GlassTabBar active="inbox" onPress={id => { const map: any = { home: 'Main', note: 'Notes', chat: 'AIChat', review: 'WeeklyReview' }; if (map[id]) navigation.navigate(map[id], {}); }} />
    </SafeAreaView>
  );
};
