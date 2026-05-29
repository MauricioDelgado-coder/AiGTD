import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { T, FontFamily } from '../theme';
import { Mono, Serif, Chip, Card } from '../components/primitives';
import { useGTDStore } from '../store/gtdStore';

export const NotesScreen: React.FC = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Projects', 'Ideas', 'Reading', 'Daily'];

  const NOTE_ACCENTS = [T.indigo, T.green, T.amber, T.indigoLt, T.rose];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }} edges={['top']}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 8 }}>
        <Serif size={30}>Notes</Serif>
        <TouchableOpacity
          style={{ backgroundColor: T.indigo, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 7 }}
          onPress={() => router.push('/notes/new')}
        >
          <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600', fontFamily: FontFamily.sans }}>+ New</Text>
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View style={{ marginHorizontal: 20, marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: T.card, borderRadius: 14, borderWidth: 1, borderColor: T.line, paddingHorizontal: 14, paddingVertical: 11 }}>
        <Text style={{ color: T.faint, fontSize: 16 }}>⌕</Text>
        <TextInput
          style={{ flex: 1, fontSize: 14.5, color: T.text, fontFamily: FontFamily.sans }}
          value={query}
          onChangeText={setQuery}
          placeholder="Search notes & backlinks…"
          placeholderTextColor={T.faint}
        />
        <Mono size={9.5} color={T.dim} spacing={0}>⌘K</Mono>
      </View>

      {/* Tag filters */}
      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginBottom: 16 }}>
        {filters.map(f => (
          <Chip key={f} active={f === activeFilter} onPress={() => setActiveFilter(f)}>{f}</Chip>
        ))}
      </View>

      {/* Empty state */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 }}>
        <Text style={{ fontSize: 40, marginBottom: 16 }}>📝</Text>
        <Serif size={20}>No notes yet</Serif>
        <Mono color={T.faint} style={{ marginTop: 10, textAlign: 'center' }}>
          Tap + New to write your first note. Use {'[[links]]'} to connect ideas.
        </Mono>
        <TouchableOpacity
          style={{ marginTop: 24, backgroundColor: T.indigoBg, borderRadius: 14, borderWidth: 1, borderColor: T.indigoBd, paddingHorizontal: 20, paddingVertical: 12 }}
          onPress={() => router.push('/notes/new')}
        >
          <Mono color={T.indigoLt} spacing={1.5}>Create first note →</Mono>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
