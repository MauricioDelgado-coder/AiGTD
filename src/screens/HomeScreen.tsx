import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { T, FontFamily, Radius, Spacing } from '../theme';
import { Mono, Serif, Card, Checkbox, Icon, GlassTabBar } from '../components/primitives';
import { useGTDStore } from '../store/gtdStore';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { tasks, toggleDone } = useGTDStore();
  const [digest, setDigest] = useState('Loading your daily digest...');
  const [refreshing, setRefreshing] = useState(false);
  const inboxCount = tasks.filter(t => t.bucket === 'inbox').length;
  const upNext = tasks.filter(t => t.bucket === 'current' && !t.done).slice(0, 3);
  const stats = [
    { n: String(tasks.filter(t => t.done).length), l: 'Done', c: T.green },
    { n: String(inboxCount), l: 'Inbox', c: T.indigoLt },
    { n: String(tasks.filter(t => t.priority === 'urgent' && !t.done).length), l: 'Urgent', c: T.amber },
  ];
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 120 }} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} tintColor={T.indigoLt} onRefresh={() => {}} />}>
        <Mono>{today}</Mono>
        <Serif size={32} style={{ marginTop: 6, marginBottom: 20 }}>Good morning.</Serif>
        <Card style={{ padding: 18, marginBottom: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Icon name="sparkle" size={15} color={T.indigoLt} />
            <Mono color={T.indigoLt} spacing={1.8}>AI Daily Digest</Mono>
          </View>
          <Text style={{ fontSize: 15, lineHeight: 23, color: T.text, fontFamily: FontFamily.sans }}>{digest}</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
            <TouchableOpacity style={{ flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 11, backgroundColor: T.indigo }} onPress={() => navigation.navigate('AIChat', {})}>
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600', fontFamily: FontFamily.sans }}>Start Focus Block</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 11, borderWidth: 1, borderColor: T.lineHi }} onPress={() => navigation.navigate('AIChat', {})}>
              <Text style={{ fontSize: 13, color: T.sub, fontFamily: FontFamily.sans }}>Ask</Text>
            </TouchableOpacity>
          </View>
        </Card>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
          {stats.map(st => (
            <Card key={st.l} style={{ flex: 1, padding: 14 }}>
              <Serif size={23} color={st.c}>{st.n}</Serif>
              <Mono size={8.5} spacing={1} style={{ marginTop: 6 }}>{st.l}</Mono>
            </Card>
          ))}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
          <Mono color={T.sub} spacing={2}>Up Next</Mono>
          <Mono>{upNext.length} tasks</Mono>
        </View>
        <Card style={{ overflow: 'hidden', marginBottom: 16 }}>
          {upNext.length === 0 ? <View style={{ padding: 20, alignItems: 'center' }}><Mono color={T.faint}>All clear</Mono></View> :
            upNext.map((task, i) => (
              <TouchableOpacity key={task.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 13, padding: 14, borderTopWidth: i > 0 ? 1 : 0, borderTopColor: T.line }} onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}>
                <Checkbox done={task.done} color={task.done ? T.faint : T.indigo} onPress={() => toggleDone(task.id)} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14.5, color: task.done ? T.faint : T.text, fontWeight: '500', fontFamily: FontFamily.sans, textDecorationLine: task.done ? 'line-through' : 'none' }} numberOfLines={1}>{task.title}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 5 }}>
                    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: task.priority === 'urgent' ? T.rose : T.indigo }} />
                    <Mono size={9.5} spacing={1}>{task.tags[0] || task.bucket}</Mono>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
        </Card>
        {inboxCount > 0 && (
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: T.indigoBg, borderRadius: 18, borderWidth: 1, borderColor: T.indigoBd, padding: 16 }} onPress={() => navigation.navigate('Inbox')}>
            <Text style={{ fontSize: 20 }}>📥</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: T.text, fontFamily: FontFamily.sans, marginBottom: 2 }}>{inboxCount} items to process</Text>
              <Mono color={T.indigoLt} size={9.5} spacing={1}>Tap to clarify with AI →</Mono>
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>
      <GlassTabBar active="home" onPress={id => { const map: any = { inbox: 'Inbox', note: 'Notes', chat: 'AIChat', review: 'WeeklyReview' }; if (map[id]) navigation.navigate(map[id], {}); }} />
    </SafeAreaView>
  );
};
