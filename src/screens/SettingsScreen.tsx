// src/screens/SettingsScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Radius, Spacing, Typography } from '../theme';
import { iCloudService } from '../services/iCloudService';
import { useGTDStore } from '../store/gtdStore';

const ANTHROPIC_KEY = 'aigtd.anthropicKey';

export const SettingsScreen: React.FC = () => {
  const router = useRouter();
  const { tasks, projects, lastSynced, setLastSynced } = useGTDStore();

  const [anthropicKey, setAnthropicKey] = useState('');
  const [voyageKey, setVoyageKey] = useState('');
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [saved, setSaved] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    (async () => {
      setAnthropicKey((await SecureStore.getItemAsync(ANTHROPIC_KEY)) ?? '');
      setVoyageKey((await AsyncStorage.getItem('aigtd.voyageKey')) ?? '');
      setSupabaseUrl((await AsyncStorage.getItem('aigtd.supabaseUrl')) ?? '');
      setSupabaseKey((await AsyncStorage.getItem('aigtd.supabaseKey')) ?? '');
    })();
  }, []);

  const saveAll = async () => {
    await SecureStore.setItemAsync(ANTHROPIC_KEY, anthropicKey.trim());
    await AsyncStorage.multiSet([
      ['aigtd.voyageKey', voyageKey.trim()],
      ['aigtd.supabaseUrl', supabaseUrl.trim()],
      ['aigtd.supabaseKey', supabaseKey.trim()],
    ]);
    setSaved(true);
    Alert.alert('Saved', 'All keys saved. The app is fully configured.');
  };

  const forceSync = async () => {
    setSyncing(true);
    await iCloudService.sync(tasks, projects);
    const ts = new Date().toISOString();
    setLastSynced(ts);
    setSyncing(false);
    Alert.alert('Synced', 'Data pushed to iCloud.');
  };

  const KeyField = ({
    label, value, onChange, placeholder, help,
  }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; help?: string }) => (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {help && <Text style={styles.fieldHelp}>{help}</Text>}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        secureTextEntry={!value.startsWith('https')}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {/* AI */}
        <Text style={styles.sectionLabel}>AI — REQUIRED</Text>
        <View style={styles.card}>
          <KeyField
            label="Anthropic API Key"
            value={anthropicKey}
            onChange={setAnthropicKey}
            placeholder="sk-ant-…"
            help="console.anthropic.com → Get API Keys"
          />
        </View>

        {/* Second Brain */}
        <Text style={styles.sectionLabel}>SECOND BRAIN — NOTES & SEARCH</Text>
        <View style={styles.card}>
          <Text style={styles.cardDesc}>
            Notes are stored in Supabase (free tier). Semantic search uses Voyage AI embeddings (200M free tokens — enough for years of personal use).
          </Text>
          <KeyField
            label="Supabase Project URL"
            value={supabaseUrl}
            onChange={setSupabaseUrl}
            placeholder="https://xxxx.supabase.co"
            help="supabase.com → your project → Settings → API"
          />
          <KeyField
            label="Supabase Anon Key"
            value={supabaseKey}
            onChange={setSupabaseKey}
            placeholder="eyJ…"
          />
          <KeyField
            label="Voyage AI API Key"
            value={voyageKey}
            onChange={setVoyageKey}
            placeholder="pa-…"
            help="dash.voyageai.com → free tier, no card needed"
          />
        </View>

        {/* Save */}
        <TouchableOpacity style={styles.saveBtn} onPress={saveAll}>
          <Text style={styles.saveBtnText}>{saved ? '✓ All Keys Saved' : 'Save All Keys'}</Text>
        </TouchableOpacity>

        {/* iCloud */}
        <Text style={styles.sectionLabel}>iCLOUD SYNC</Text>
        <View style={styles.card}>
          <Text style={styles.cardDesc}>
            Tasks sync automatically via iCloud Key-Value Storage ({iCloudService.available ? '✓ Connected' : '○ Simulator/fallback — will sync on device'}).
          </Text>
          {lastSynced && (
            <Text style={styles.syncTime}>Last synced: {new Date(lastSynced).toLocaleString()}</Text>
          )}
          <TouchableOpacity style={styles.secondaryBtn} onPress={forceSync}>
            <Text style={styles.secondaryBtnText}>{syncing ? 'Syncing…' : '☁ Force Sync'}</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <Text style={styles.sectionLabel}>DATA</Text>
        <View style={styles.card}>
          {[
            { label: 'Tasks', value: tasks.length },
            { label: 'Completed', value: tasks.filter((t) => t.done).length },
            { label: 'Projects', value: projects.length },
          ].map((s) => (
            <View key={s.label} style={styles.statRow}>
              <Text style={styles.statLabel}>{s.label}</Text>
              <Text style={styles.statValue}>{s.value}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.cardDesc, { textAlign: 'center', marginTop: 12 }]}>
          aiGTD v1.0.0 · Built with Claude AI
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.md, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  back: { color: Colors.accent, fontSize: 15, fontFamily: Typography.bodyFont },
  headerTitle: { color: Colors.text, fontFamily: Typography.displayFont, fontSize: 18, fontStyle: 'italic' },
  content: { padding: Spacing.md, paddingBottom: 60 },
  sectionLabel: {
    color: Colors.textMuted, fontSize: 10, fontFamily: Typography.monoFont,
    letterSpacing: 1.5, marginBottom: 8, marginTop: 20,
  },
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border, padding: 16, gap: 12,
  },
  cardDesc: { color: Colors.textSub, fontSize: 13, fontFamily: Typography.bodyFont, lineHeight: 19 },
  fieldWrap: { gap: 4 },
  fieldLabel: { color: Colors.text, fontSize: 13, fontWeight: '600', fontFamily: Typography.bodyFont },
  fieldHelp: { color: Colors.textMuted, fontSize: 11, fontFamily: Typography.monoFont },
  input: {
    backgroundColor: Colors.surface2, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border,
    padding: 11, color: Colors.text, fontSize: 13, fontFamily: Typography.monoFont,
  },
  saveBtn: {
    backgroundColor: Colors.accent, borderRadius: Radius.md,
    padding: 14, alignItems: 'center', marginTop: 12,
    shadowColor: Colors.accent, shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4, shadowRadius: 8,
  },
  saveBtnText: { color: Colors.white, fontWeight: '600', fontSize: 15, fontFamily: Typography.bodyFont },
  secondaryBtn: {
    backgroundColor: Colors.surface2, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border, padding: 12, alignItems: 'center',
  },
  secondaryBtnText: { color: Colors.textSub, fontFamily: Typography.bodyFont },
  syncTime: { color: Colors.mint, fontSize: 12, fontFamily: Typography.monoFont },
  statRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  statLabel: { color: Colors.textSub, fontSize: 13, fontFamily: Typography.bodyFont },
  statValue: { color: Colors.text, fontFamily: Typography.monoFont, fontWeight: '600' },
});
