import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { T, FontFamily } from '../theme';
import { Mono, Serif, Card, Checkbox, Icon } from '../components/primitives';
import { useGTDStore } from '../store/gtdStore';

export const HomeScreen: React.FC = () => {
  const router = useRouter();
  const { tasks, toggleDone } = useGTDStore();
  const [refreshing, setRefreshing] = useState(false);
  const inboxCount = tasks.filter(t => t.bucket === 'inbox').length;
  const upNext = tasks.filter(t => t.bucket === 'current' && !t.done).slice(0, 3);
  const doneCount = tasks.filter(t => t.done).length;
  const urgentCount = tasks.filter(t => t.priority === 'urgent' && !t.done).length;
  const stats = [
    { n: `${doneCount}`, l: 'Done', c: T.green },
    { n: String(inboxCount), l: 'Inbox', c: T.indigoLt },
    { n: String(urgentCount), l: 'Urgent', c: T.amber },
  ];
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} tintColor={T.indigoLt} onRefresh={() => {}} />}
      >
        <Mono>{today}</Mono>
        <Serif size={32} style={{ marginTop: 6, marginBottom: 20 }}>Good morning.</Serif>

        {/* AI Digest card with radial gradient accent */}
        <View style={{
          backgroundColor: T.card,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: T.line,
          padding: 18,
          marginBottom: 14,
          overflow: 'hidden',
          position: 'relative',
        }}>
          {Platform.OS === 'web' && (
            <View style={{
              position: 'absolute',
              top: 0, right: 0, bottom: 0, left: 0,
              borderRadius: 18,
              // @ts-ignore
              background: 'radial-gradient(90% 120% at 100% 0%, rgba(123,110,246,0.16), transparent 60%)',
            }} />
          )}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Icon name="sparkle" size={15} color={T.indigoLt} />
            <Mono color={T.indigoLt} spacing={1.8}>AI Daily Digest</Mono>
          </View>
          <Text style={{ fontSize: 15, lineHeight: 23, color: T.text, fontFamily: FontFamily.sans }}>
            Your AI digest will appear here once you add your Anthropic API key in{' '}
            <Text style={{ color: T.indigoLt, fontWeight: '600' }}>Settings</Text>.
            Add tasks to your inbox to get started.
          </Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
            <TouchableOpacity
              style={{ flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 11, backgroundColor: T.indigo }}
              onPress={() => router.push('/(tabs)/inbox')}
            >
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600', fontFamily: FontFamily.sans }}>Go to Inbox</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 11, borderWidth: 1, borderColor: T.lineHi }}
              onPress={() => router.push('/(tabs)/review')}
            >
              <Icon name="review" size={16} color={T.sub} />
              <Text style={{ fontSize: 13, color: T.sub, fontFamily: FontFamily.sans }}>Review</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats row */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 22 }}>
          {stats.map(st => (
            <Card key={st.l} style={{ flex: 1, padding: 14 }}>
              <Serif size={23} color={st.c}>{st.n}</Serif>
              <Mono size={8.5} spacing={1} style={{ marginTop: 6 }}>{st.l}</Mono>
            </Card>
          ))}
        </View>

        {/* Up Next */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
          <Mono color={T.sub} spacing={2}>Up Next</Mono>
          <Mono>{upNext.length} tasks</Mono>
        </View>
        <Card style={{ overflow: 'hidden', marginBottom: 16 }}>
          {upNext.length === 0 ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Mono color={T.faint}>All clear — inbox zero</Mono>
            </View>
          ) : (
            upNext.map((task, i) => (
              <TouchableOpacity
                key={task.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 13,
                  padding: 14,
                  borderTopWidth: i > 0 ? 1 : 0,
                  borderTopColor: T.line,
                }}
                onPress={() => router.push(`/task/${task.id}`)}
              >
                <Checkbox
                  done={task.done}
                  color={task.done ? T.faint : T.indigo}
                  onPress={() => toggleDone(task.id)}
                />
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 14.5,
                    color: task.done ? T.faint : T.text,
                    fontWeight: '500',
                    fontFamily: FontFamily.sans,
                    textDecorationLine: task.done ? 'line-through' : 'none',
                  }} numberOfLines={1}>
                    {task.title}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 5 }}>
                    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: task.priority === 'urgent' ? T.rose : T.indigo }} />
                    <Mono size={9.5} spacing={1}>{task.tags[0] || task.bucket}</Mono>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </Card>

        {/* Inbox prompt */}
        {inboxCount > 0 && (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              backgroundColor: T.indigoBg,
              borderRadius: 18,
              borderWidth: 1,
              borderColor: T.indigoBd,
              padding: 16,
            }}
            onPress={() => router.push('/(tabs)/inbox')}
          >
            <Text style={{ fontSize: 20 }}>📥</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: T.text, fontFamily: FontFamily.sans, marginBottom: 2 }}>
                {inboxCount} items to process
              </Text>
              <Mono color={T.indigoLt} size={9.5} spacing={1}>Tap to clarify with AI →</Mono>
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
