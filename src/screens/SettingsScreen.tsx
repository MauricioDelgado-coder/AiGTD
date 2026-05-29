import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { T, FontFamily, Radius } from '../theme';
import { Mono, Serif, Card } from '../components/primitives';
import { useGTDStore } from '../store/gtdStore';

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { tasks, projects } = useGTDStore();
  const [anthropicKey, setAnthropicKey] = useState('');
  const [voyageKey, setVoyageKey] = useState('');
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');

  useEffect(() => {
    AsyncStorage.multiGet(['aigtd.anthropicKey', 'aigtd.voyageKey', 'aigtd.supabaseUrl', 'aigtd.supabaseKey']).then(r => {
      setAnthropicKey(r[0][1] ?? ''); setVoyageKey(r[1][1] ?? ''); setSupabaseUrl(r[2][1] ?? ''); setSupabaseKey(r[3][1] ?? '');
    });
  }, []);

  const saveAll = async () => {
    await AsyncStorage.multiSet([['aigtd.anthropicKey', anthropicKey.trim()], ['aigtd.voyageKey', voyageKey.trim()], ['aigtd.supabaseUrl', supabaseUrl.trim()], ['aigtd.supabaseKey', supabaseKey.trim()]]);
    Alert.alert('Saved', 'All keys saved.');
  };

  const Field = ({ label, value, onChange, placeholder, help }: any) => (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ color: T.text, fontSize: 13, fontWeight: '600', fontFamily: FontFamily.sans, marginBottom: 3 }}>{label}</Text>
      {help && <Text style={{ color: T.faint, fontSize: 11, fontFamily: FontFamily.mono, marginBottom: 4 }}>{help}</Text>}
      <TextInput style={{ backgroundColor: T.cardSoft, borderRadius: 12, borderWidth: 1, borderColor: T.line, padding: 11, color: T.text, fontSize: 13, fontFamily: FontFamily.mono }} value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor={T.faint} secureTextEntry={!value.startsWith('https')} autoCapitalize="none" autoCorrect={false} />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }} edges={['top', 'bottom']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: T.line }}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={{ fontSize: 22, color: T.sub }}>‹</Text></TouchableOpacity>
        <Serif size={18}>Settings</Serif>
        <View style={{ width: 22 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <Mono style={{ marginBottom: 8 }}>AI — Required</Mono>
        <Card style={{ padding: 16, marginBottom: 20 }}>
          <Field label="Anthropic API Key" value={anthropicKey} onChange={setAnthropicKey} placeholder="sk-ant-…" help="console.anthropic.com → API Keys" />
        </Card>
        <Mono style={{ marginBottom: 8 }}>Second Brain — Notes & Search</Mono>
        <Card style={{ padding: 16, marginBottom: 20 }}>
          <Field label="Supabase URL" value={supabaseUrl} onChange={setSupabaseUrl} placeholder="https://xxxx.supabase.co" help="supabase.com → Settings → API" />
          <Field label="Supabase Anon Key" value={supabaseKey} onChange={setSupabaseKey} placeholder="eyJ…" />
          <Field label="Voyage AI Key" value={voyageKey} onChange={setVoyageKey} placeholder="pa-…" help="dash.voyageai.com — 200M free tokens" />
        </Card>
        <TouchableOpacity style={{ backgroundColor: T.indigo, borderRadius: 18, padding: 14, alignItems: 'center', marginBottom: 20 }} onPress={saveAll}>
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15, fontFamily: FontFamily.sans }}>Save All Keys</Text>
        </TouchableOpacity>
        <Mono style={{ marginBottom: 8 }}>Data</Mono>
        <Card style={{ padding: 16 }}>
          {[['Tasks', tasks.length], ['Completed', tasks.filter(t => t.done).length], ['Projects', projects.length]].map(([l, v]) => (
            <View key={l as string} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: T.line }}>
              <Text style={{ color: T.sub, fontSize: 13, fontFamily: FontFamily.sans }}>{l as string}</Text>
              <Text style={{ color: T.text, fontFamily: FontFamily.mono, fontWeight: '600' }}>{String(v)}</Text>
            </View>
          ))}
        </Card>
        <Text style={{ color: T.faint, fontSize: 12, fontFamily: FontFamily.mono, textAlign: 'center', marginTop: 20 }}>aiGTD v1.0.0 · Built with Claude AI</Text>
      </ScrollView>
    </SafeAreaView>
  );
};
