import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { T, FontFamily } from '../theme';
import { Mono, Serif, Chip } from '../components/primitives';
import { useNoteStore } from '../store/noteStore';
import { useGTDStore } from '../store/gtdStore';
import { pickAndImportFiles } from '../services/fileImportService';

export const NotesScreen: React.FC = () => {
  const router = useRouter();
  const { notes, addNote } = useNoteStore();
  const { tasks } = useGTDStore();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [importing, setImporting] = useState(false);

  // Derive unique tags from all tasks + existing notes
  const taskTags = tasks.flatMap(t => t.tags);
  const noteTags = notes.flatMap(n => n.tags);
  const allTags = ['All', ...Array.from(new Set([...taskTags, ...noteTags])).sort()];

  const filtered = notes.filter(n => {
    const matchesQuery = !query ||
      n.title.toLowerCase().includes(query.toLowerCase()) ||
      n.body.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = activeFilter === 'All' || n.tags.includes(activeFilter.toLowerCase());
    return matchesQuery && matchesFilter;
  });

  const NOTE_ACCENTS = [T.indigo, T.green, T.amber, T.indigoLt, T.rose];

  const handleImport = async () => {
    setImporting(true);
    try {
      const imported = await pickAndImportFiles();
      if (imported.length === 0) return;
      imported.forEach(n => addNote(n));
      Alert.alert(
        `Imported ${imported.length} note${imported.length > 1 ? 's' : ''}`,
        imported.map(n => `• ${n.title}`).join('\n')
      );
    } catch (e: any) {
      Alert.alert(
        'Import failed',
        e?.message === 'NO_API_KEY'
          ? 'Add your Anthropic API key in Settings to import PDFs.'
          : 'Could not import file. Supported formats: PDF, MD, TXT.'
      );
    } finally {
      setImporting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }} edges={['top']}>
      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingTop: 14, paddingBottom: 8,
      }}>
        <Serif size={30}>Notes</Serif>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          {/* Import button */}
          <TouchableOpacity
            style={{
              flexDirection: 'row', alignItems: 'center', gap: 5,
              borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7,
              backgroundColor: T.card, borderWidth: 1, borderColor: T.indigoBd,
            }}
            onPress={handleImport}
            disabled={importing}
          >
            {importing
              ? <ActivityIndicator size="small" color={T.indigo} />
              : <Text style={{ color: T.indigo, fontSize: 13, fontWeight: '600', fontFamily: FontFamily.sans }}>⬆ Import</Text>
            }
          </TouchableOpacity>
          {/* New button */}
          <TouchableOpacity
            style={{ backgroundColor: T.indigo, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 7 }}
            onPress={() => router.push('/notes/new')}
          >
            <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600', fontFamily: FontFamily.sans }}>+ New</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search bar */}
      <View style={{
        marginHorizontal: 20, marginBottom: 12,
        flexDirection: 'row', alignItems: 'center', gap: 10,
        backgroundColor: T.card, borderRadius: 14,
        borderWidth: 1, borderColor: T.line,
        paddingHorizontal: 14, paddingVertical: 11,
      }}>
        <Text style={{ color: T.faint, fontSize: 16 }}>⌕</Text>
        <TextInput
          style={{ flex: 1, fontSize: 14.5, color: T.text, fontFamily: FontFamily.sans }}
          value={query}
          onChangeText={setQuery}
          placeholder="Search notes…"
          placeholderTextColor={T.faint}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Text style={{ color: T.faint, fontSize: 16 }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tag filters — derived from user tags */}
      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginBottom: 16, flexWrap: 'wrap' }}>
        {allTags.map(f => (
          <Chip key={f} active={f === activeFilter} onPress={() => setActiveFilter(f)}>
            {f === 'All' ? f : `#${f}`}
          </Chip>
        ))}
      </View>

      {/* Notes list or empty state */}
      {notes.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 }}>
          <Text style={{ fontSize: 40, marginBottom: 16 }}>📝</Text>
          <Serif size={20}>No notes yet</Serif>
          <Mono color={T.faint} style={{ marginTop: 10, textAlign: 'center' }}>
            Write a new note or import PDF, MD, or TXT files.
          </Mono>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 24 }}>
            <TouchableOpacity
              style={{ backgroundColor: T.card, borderRadius: 14, borderWidth: 1, borderColor: T.indigoBd, paddingHorizontal: 16, paddingVertical: 12 }}
              onPress={handleImport}
              disabled={importing}
            >
              <Mono color={T.indigo} spacing={1.5}>⬆ Import file</Mono>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: T.indigoBg, borderRadius: 14, borderWidth: 1, borderColor: T.indigoBd, paddingHorizontal: 16, paddingVertical: 12 }}
              onPress={() => router.push('/notes/new')}
            >
              <Mono color={T.indigoLt} spacing={1.5}>+ New note</Mono>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={n => n.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
          ListEmptyComponent={
            <View style={{ paddingTop: 40, alignItems: 'center' }}>
              <Mono color={T.faint}>No notes match "{query || activeFilter}"</Mono>
            </View>
          }
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={{
                backgroundColor: T.card, borderRadius: 18,
                borderWidth: 1, borderColor: T.line,
                borderLeftWidth: 3,
                borderLeftColor: NOTE_ACCENTS[index % NOTE_ACCENTS.length],
                padding: 16, marginBottom: 10,
              }}
              onPress={() => router.push(`/notes/${item.id}`)}
            >
              <Text style={{ fontSize: 15, fontWeight: '600', color: T.text, fontFamily: FontFamily.sans, marginBottom: 4 }} numberOfLines={1}>
                {item.title || 'Untitled'}
              </Text>
              <Text style={{ fontSize: 13, color: T.sub, fontFamily: FontFamily.sans, lineHeight: 19 }} numberOfLines={2}>
                {item.body}
              </Text>
              {item.tags.length > 0 && (
                <View style={{ flexDirection: 'row', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                  {item.tags.map(tag => (
                    <View key={tag} style={{ backgroundColor: T.indigoBg, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 }}>
                      <Mono size={9.5} color={T.indigo} spacing={0.5}>#{tag}</Mono>
                    </View>
                  ))}
                </View>
              )}
              <Mono size={9} color={T.faint} style={{ marginTop: 8 }}>
                {new Date(item.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </Mono>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};
