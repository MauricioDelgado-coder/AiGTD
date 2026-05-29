import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { T, FontFamily } from '../theme';
import { Mono, Serif, Card } from '../components/primitives';
import { useGTDStore } from '../store/gtdStore';
import { TaskBucket } from '../types';

const BUCKETS: { bucket: TaskBucket; icon: string; label: string; desc: string; color: string }[] = [
  { bucket: 'current',   icon: '⚡', label: 'Current Tasks', desc: 'Do as soon as possible', color: T.indigoLt },
  { bucket: 'project',   icon: '📋', label: 'Project',       desc: 'Multi-step, needs a plan', color: T.amber },
  { bucket: 'scheduled', icon: '🗓', label: 'Schedule',      desc: 'Do at a specific time', color: T.green },
  { bucket: 'delegated', icon: '🤝', label: 'Delegate',      desc: 'Someone else owns this', color: T.sub },
  { bucket: 'future',    icon: '💡', label: 'Future Ideas',  desc: 'Hold for later review', color: T.indigoLt },
  { bucket: 'reference', icon: '📁', label: 'Reference',     desc: 'Retrieve when needed', color: T.sub },
  { bucket: 'trash',     icon: '🗑', label: 'Trash',         desc: 'Not worth doing', color: T.rose },
];

export const TaskDetailScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tasks, updateTask, moveTask, deleteTask } = useGTDStore();
  const task = tasks.find(t => t.id === id);
  const [nextAction, setNextAction] = useState(task?.nextAction ?? '');
  if (!task) return <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}><Text style={{ color: T.text, padding: 20 }}>Task not found.</Text></SafeAreaView>;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }} edges={['top', 'bottom']}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: T.line }}>
        <TouchableOpacity onPress={() => router.back()}><Text style={{ fontSize: 22, color: T.sub }}>‹</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => Alert.alert('Delete?', '', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: () => { deleteTask(task.id); router.back(); } }])}><Text style={{ fontSize: 18 }}>🗑</Text></TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        {task.aiSuggestion && (
          <View style={{ backgroundColor: T.indigoBg, borderRadius: 18, borderWidth: 1, borderColor: T.indigoBd, padding: 14, marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 8 }}><Text style={{ color: T.indigoLt }}>✦</Text><Mono color={T.indigoLt} spacing={1.8}>AI Analysis</Mono></View>
            <Text style={{ fontSize: 14, color: T.text, lineHeight: 20, fontFamily: FontFamily.sans }}>{task.aiSuggestion}</Text>
          </View>
        )}
        <Serif size={22} style={{ marginBottom: 20 }}>{task.title}</Serif>
        <Mono style={{ marginBottom: 10 }}>Next Action</Mono>
        <TextInput style={{ backgroundColor: T.card, borderRadius: 18, borderWidth: 1, borderColor: T.line, padding: 14, color: T.text, fontSize: 14, fontFamily: FontFamily.sans, minHeight: 70, marginBottom: 24 }} value={nextAction} onChangeText={setNextAction} placeholder="What's the very next physical step?" placeholderTextColor={T.faint} multiline />
        <Mono style={{ marginBottom: 10 }}>Where Does This Belong?</Mono>
        {BUCKETS.map(opt => (
          <TouchableOpacity key={opt.bucket} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: task.bucket === opt.bucket ? T.indigoBg : T.card, borderRadius: 18, borderWidth: 1, borderColor: task.bucket === opt.bucket ? T.indigoBd : T.line, padding: 14, marginBottom: 8 }} onPress={() => { updateTask(task.id, { nextAction }); moveTask(task.id, opt.bucket); router.back(); }}>
            <Text style={{ fontSize: 20 }}>{opt.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: opt.color, fontFamily: FontFamily.sans, marginBottom: 2 }}>{opt.label}</Text>
              <Text style={{ fontSize: 12, color: T.sub, fontFamily: FontFamily.sans }}>{opt.desc}</Text>
            </View>
            {task.bucket === opt.bucket && <Text style={{ color: T.indigoLt, fontSize: 16, fontWeight: '700' }}>✓</Text>}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};
