import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { T, FontFamily } from '../theme';
import { Mono, Serif, Card, Checkbox } from '../components/primitives';
import { useGTDStore } from '../store/gtdStore';

export const WeeklyReviewScreen: React.FC = () => {
  const router = useRouter();
  const { tasks } = useGTDStore();
  const BARS = [{ d: 'M', v: 0.5 }, { d: 'T', v: 0.8 }, { d: 'W', v: 0.65 }, { d: 'T', v: 1.0 }, { d: 'F', v: 0.45 }, { d: 'S', v: 0.2 }, { d: 'S', v: 0.35 }];
  const STEPS = [{ t: 'Clear the inbox', n: `${tasks.filter(t => t.bucket === 'inbox').length} left`, done: false }, { t: 'Review active projects', n: '5 of 5', done: true }, { t: 'Flag what stalled', n: '2 found', done: false }];
  const stats = [[String(tasks.filter(t => t.done).length), 'Completed', T.green], [String(tasks.filter(t => t.bucket === 'inbox').length), 'Inbox', T.indigoLt], ['6', 'Carried Over', T.amber]];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Serif size={30} style={{ marginTop: 6, marginBottom: 18 }}>Weekly Review</Serif>
        <Card style={{ padding: 17, marginBottom: 14, borderLeftWidth: 3, borderLeftColor: T.indigo }}>
          <Mono color={T.indigoLt} spacing={1.8}>This Week, In Brief</Mono>
          <Text style={{ marginTop: 10, fontFamily: FontFamily.serif, fontStyle: 'italic', fontSize: 17, lineHeight: 24, color: T.text }}>
            "Strong follow-through midweek. Thursday was your peak — but the inbox crept up again."
          </Text>
        </Card>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
          {stats.map(([n, l, c]) => (
            <Card key={l as string} style={{ flex: 1, padding: 13 }}>
              <Serif size={24} color={c as string}>{n as string}</Serif>
              <Mono size={8} spacing={0.8} style={{ marginTop: 5 }}>{l as string}</Mono>
            </Card>
          ))}
        </View>
        <Card style={{ marginBottom: 14, padding: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 }}>
            <Mono color={T.sub} spacing={1.5}>Completed / Day</Mono>
            <Mono color={T.faint}>peak Thu</Mono>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 64, gap: 8 }}>
            {BARS.map((b, i) => (
              <View key={i} style={{ flex: 1, alignItems: 'center', gap: 7 }}>
                <View style={{ width: '100%', height: b.v * 64, borderRadius: 5, backgroundColor: b.v === 1 ? T.indigo : T.indigoBg, borderWidth: 1, borderColor: b.v === 1 ? T.indigo : T.indigoBd }} />
                <Mono size={9} color={b.v === 1 ? T.indigoLt : T.faint}>{b.d}</Mono>
              </View>
            ))}
          </View>
        </Card>
        <View style={{ marginBottom: 12 }}><Mono color={T.sub} spacing={2}>Review Checklist</Mono></View>
        <Card style={{ overflow: 'hidden', marginBottom: 20 }}>
          {STEPS.map((s, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 13, padding: 14, borderTopWidth: i > 0 ? 1 : 0, borderTopColor: T.line }}>
              <Checkbox done={s.done} color={s.done ? T.green : T.indigo} />
              <Text style={{ flex: 1, fontSize: 14.5, fontWeight: '500', color: s.done ? T.faint : T.text, fontFamily: FontFamily.sans, textDecorationLine: s.done ? 'line-through' : 'none' }}>{s.t}</Text>
              <Mono color={T.faint}>{s.n}</Mono>
            </View>
          ))}
        </Card>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 18, backgroundColor: T.indigoBg, borderWidth: 1, borderColor: T.indigoBd }} onPress={() => router.push('/(tabs)/inbox')}>
          <Text style={{ color: T.indigoLt, fontSize: 15, fontWeight: '600', fontFamily: FontFamily.sans }}>Clear Inbox →</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
