import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { T, FontFamily, Radius } from '../theme';
import { Mono, Serif, Chip, GlassTabBar } from '../components/primitives';

export const NotesScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [query, setQuery] = useState('');
  const notes: any[] = [];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 8 }}>
        <Serif size={30}>Notes</Serif>
        <TouchableOpacity style={{ backgroundColor: T.indigo, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 7 }} onPress={() => navigation.navigate('NoteDetail', { noteId: null })}>
          <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600', fontFamily: FontFamily.sans }}>+ New</Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginHorizontal: 20, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: T.card, borderRadius: 18, borderWidth: 1, borderColor: T.line, paddingHorizontal: 13, paddingVertical: 10 }}>
        <Text style={{ color: T.faint, fontSize: 16 }}>⌕</Text>
        <TextInput style={{ flex: 1, fontSize: 14, color: T.text, fontFamily: FontFamily.sans }} value={query} onChangeText={setQuery} placeholder="Search by meaning or keyword…" placeholderTextColor={T.faint} />
      </View>
      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginBottom: 14 }}>
        {['All', 'Projects', 'Ideas', 'Reading', 'Daily'].map(f => <Chip key={f} active={f === 'All'}>{f}</Chip>)}
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 40, marginBottom: 16 }}>📝</Text>
        <Serif size={20}>No notes yet</Serif>
        <Mono color={T.faint} style={{ marginTop: 8, textAlign: 'center', paddingHorizontal: 40 }}>Tap + New to write your first note. Use [[links]] to connect ideas.</Mono>
      </View>
      <GlassTabBar active="note" onPress={id => { const map: any = { home: 'Main', inbox: 'Inbox', chat: 'AIChat', review: 'WeeklyReview' }; if (map[id]) navigation.navigate(map[id], {}); }} />
    </SafeAreaView>
  );
};
