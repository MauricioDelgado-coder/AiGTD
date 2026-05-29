// src/screens/NotesScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, TextInput,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, Radius } from '../theme';
import { useNotesStore } from '../store/notesStore';
import { Note } from '../services/notesService';
import { EmptyState } from '../components/EmptyState';
import { format } from 'date-fns';

export const NotesScreen: React.FC = () => {
  const router = useRouter();
  const { notes, loading, searchResults, searchQuery, loadNotes, search, clearSearch } = useNotesStore();
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => { loadNotes(); }, []);

  const handleSearch = useCallback(async (text: string) => {
    setQuery(text);
    if (!text.trim()) { clearSearch(); return; }
    setSearching(true);
    await search(text);
    setSearching(false);
  }, [search, clearSearch]);

  const displayNotes = query.trim() ? searchResults : notes;

  const renderNote = ({ item }: { item: Note }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/notes/${item.id}`)}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.cardDate}>
          {format(new Date(item.updatedAt), 'MMM d')}
        </Text>
      </View>
      {item.body.trim() ? (
        <Text style={styles.cardPreview} numberOfLines={2}>
          {item.body.replace(/\[\[|\]\]/g, '').replace(/#\w+/g, '')}
        </Text>
      ) : null}
      {item.tags.length > 0 && (
        <View style={styles.tagRow}>
          {item.tags.slice(0, 4).map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}
      {item.wikilinks.length > 0 && (
        <View style={styles.linkRow}>
          <Text style={styles.linkIcon}>🔗</Text>
          <Text style={styles.linkText} numberOfLines={1}>
            {item.wikilinks.join('  ·  ')}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Notes</Text>
        <TouchableOpacity
          style={styles.newBtn}
          onPress={() => router.push('/notes/new')}
        >
          <Text style={styles.newBtnText}>＋ New</Text>
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={handleSearch}
            placeholder="Search by meaning or keyword…"
            placeholderTextColor={Colors.textMuted}
            returnKeyType="search"
          />
          {searching && <ActivityIndicator color={Colors.accent} size="small" />}
          {query.length > 0 && !searching && (
            <TouchableOpacity onPress={() => { setQuery(''); clearSearch(); }}>
              <Text style={styles.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search label */}
      {query.trim() ? (
        <View style={styles.searchLabel}>
          <Text style={styles.searchLabelText}>
            {searching ? 'Searching…' : `${displayNotes.length} result${displayNotes.length !== 1 ? 's' : ''} for "${query}"`}
          </Text>
          <View style={styles.searchBadge}>
            <Text style={styles.searchBadgeText}>✦ Semantic</Text>
          </View>
        </View>
      ) : null}

      <FlatList
        data={displayNotes}
        keyExtractor={(n) => n.id}
        renderItem={renderNote}
        contentContainerStyle={[
          styles.list,
          displayNotes.length === 0 && styles.listEmpty,
        ]}
        ListEmptyComponent={
          loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator color={Colors.accent} />
            </View>
          ) : query ? (
            <EmptyState icon="🔍" title="No results" sub="Try different words — semantic search understands meaning, not just exact matches." />
          ) : (
            <EmptyState icon="📝" title="No notes yet" sub="Tap + New to write your first note. Use [[links]] to connect ideas and #tags to organise them." />
          )
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: 14,
    paddingBottom: 8,
  },
  title: {
    fontFamily: Typography.displayFont,
    fontSize: 26,
    color: Colors.text,
    fontStyle: 'italic',
  },
  newBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  newBtnText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '600',
    fontFamily: Typography.bodyFont,
  },
  searchRow: {
    paddingHorizontal: Spacing.md,
    marginBottom: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchIcon: { color: Colors.textMuted, fontSize: 16 },
  searchInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 14,
    fontFamily: Typography.bodyFont,
    paddingVertical: 11,
  },
  clearBtn: { color: Colors.textMuted, fontSize: 14, padding: 4 },
  searchLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    marginBottom: 8,
    gap: 8,
  },
  searchLabelText: {
    color: Colors.textMuted,
    fontSize: 11,
    fontFamily: Typography.monoFont,
  },
  searchBadge: {
    backgroundColor: Colors.accentDim,
    borderRadius: Radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  searchBadgeText: {
    color: Colors.accent,
    fontSize: 10,
    fontFamily: Typography.monoFont,
  },
  list: { paddingHorizontal: Spacing.md, paddingBottom: 100 },
  listEmpty: { flexGrow: 1 },
  loadingWrap: { padding: 40, alignItems: 'center' },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    marginBottom: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  cardTitle: {
    flex: 1,
    color: Colors.text,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: Typography.bodyFont,
    marginRight: 8,
  },
  cardDate: {
    color: Colors.textMuted,
    fontSize: 11,
    fontFamily: Typography.monoFont,
  },
  cardPreview: {
    color: Colors.textSub,
    fontSize: 13,
    fontFamily: Typography.bodyFont,
    lineHeight: 18,
    marginBottom: 8,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginBottom: 4,
  },
  tag: {
    backgroundColor: Colors.surface2,
    borderRadius: Radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagText: {
    color: Colors.accent,
    fontSize: 10,
    fontFamily: Typography.monoFont,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  linkIcon: { fontSize: 11 },
  linkText: {
    color: Colors.textMuted,
    fontSize: 11,
    fontFamily: Typography.monoFont,
    flex: 1,
  },
});
