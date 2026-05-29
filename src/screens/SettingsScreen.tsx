import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSecureItem, setSecureItem } from '../lib/secureStorage';
import { Colors, Radius, Spacing, Typography, T, FontFamily } from '../theme';
import { useGTDStore } from '../store/gtdStore';

const ANTHROPIC_KEY = 'aigtd.anthropicKey';

export const SettingsScreen: React.FC = () => {
  const router = useRouter();
  const { tasks, projects } = useGTDStore();

  const [anthropicKey, setAnthropicKey] = useState('');
  const [voyageKey, setVoyageKey] = useState('');
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      setAnthropicKey((await getSecureItem(ANTHROPIC_KEY)) ?? '');
      setVoyageKey((await AsyncStorage.getItem('aigtd.voyageKey')) ?? '');
      setSupabaseUrl((await AsyncStorage.getItem('aigtd.supabaseUrl')) ?? '');
      setSupabaseKey((await AsyncStorage.getItem('aigtd.supabaseKey')) ?? '');
    })();
  }, []);

  const saveAll = async () => {
    await setSecureItem(ANTHROPIC_KEY, anthropicKey.trim());
    await AsyncStorage.multiSet([
      ['aigtd.voyageKey', voyageKey.trim()],
      ['aigtd.supabaseUrl', supabaseUrl.trim()],
      ['aigtd.supabaseKey', supabaseKey.trim()],
    ]);
    setSaved(true);
    Alert.alert('Saved', 'All keys saved. The app is fully configured.');
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
        placeholderTextColor={T.faint}
        secureTextEntry={!value.startsWith('https')}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>

        <Text style={styles.pageTitle}>Settings</Text>

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

        <Text style={styles.sectionLabel}>SECOND BRAIN — NOTES & SEARCH</Text>
        <View style={styles.card}>
          <Text style={styles.cardDesc}>
            Notes are stored in Supabase (free tier). Semantic search uses Voyage AI embeddings (200M free tokens).
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

        <TouchableOpacity style={styles.saveBtn} onPress={saveAll}>
          <Text style={styles.saveBtnText}>{saved ? '✓ All Keys Saved' : 'Save All Keys'}</Text>
        </TouchableOpacity>

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
  safe: { flex: 1, backgroundColor: T.bg },
  content: { padding: Spacing.md, paddingBottom: 60 },
  pageTitle: { color: T.text, fontFamily: FontFamily.serif, fontStyle: 'italic', fontSize: 28, marginBottom: 8, marginTop: 4 },
  sectionLabel: {
    color: T.faint, fontSize: 10, fontFamily: FontFamily.mono,
    letterSpacing: 1.5, marginBottom: 8, marginTop: 20,
  },
  card: {
    backgroundColor: T.card, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: T.line, padding: 16, gap: 12,
  },
  cardDesc: { color: T.sub, fontSize: 13, fontFamily: FontFamily.sans, lineHeight: 19 },
  fieldWrap: { gap: 4 },
  fieldLabel: { color: T.text, fontSize: 13, fontWeight: '600', fontFamily: FontFamily.sans },
  fieldHelp: { color: T.faint, fontSize: 11, fontFamily: FontFamily.mono },
  input: {
    backgroundColor: T.cardSoft, borderRadius: Radius.md,
    borderWidth: 1, borderColor: T.line,
    padding: 11, color: T.text, fontSize: 13, fontFamily: FontFamily.mono,
  },
  saveBtn: {
    backgroundColor: T.indigo, borderRadius: Radius.md,
    padding: 14, alignItems: 'center', marginTop: 12,
  },
  saveBtnText: { color: '#fff', fontWeight: '600', fontSize: 15, fontFamily: FontFamily.sans },
  statRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: T.line,
  },
  statLabel: { color: T.sub, fontSize: 13, fontFamily: FontFamily.sans },
  statValue: { color: T.text, fontFamily: FontFamily.mono, fontWeight: '600' },
});
