import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { T, FontFamily } from '../theme';
import { Mono, Serif } from '../components/primitives';

export const NoteDetailScreen: React.FC = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const tools = ['H', 'B', 'i', '[[]]', '#', '•'];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: T.line }}>
          <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ color: T.indigoLt, fontSize: 18 }}>‹</Text>
            <Mono color={T.indigoLt}>Notes</Mono>
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: T.indigo, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 7 }} onPress={() => router.back()}>
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 13, fontFamily: FontFamily.sans }}>Save</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80 }} keyboardShouldPersistTaps="handled">
          <Mono color={T.faint}>New note</Mono>
          <TextInput style={{ fontFamily: FontFamily.serif, fontStyle: 'italic', fontSize: 28, color: T.text, marginTop: 10, marginBottom: 16, padding: 0 }} value={title} onChangeText={setTitle} placeholder="Note title…" placeholderTextColor={T.faint} autoFocus multiline={false} />
          <TextInput style={{ fontSize: 14.5, lineHeight: 24, color: T.text, fontFamily: FontFamily.sans, minHeight: 300, padding: 0 }} value={body} onChangeText={setBody} placeholder={'Start writing…\n\n[[Link to note]]\n#tag'} placeholderTextColor={T.faint} multiline textAlignVertical="top" />
        </ScrollView>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 6, paddingVertical: 8, backgroundColor: T.glass, borderTopWidth: 1, borderTopColor: T.glassBd }}>
          {tools.map((t, i) => (
            <TouchableOpacity key={i} style={{ flex: 1, alignItems: 'center', paddingVertical: 8 }}>
              <Text style={{ fontFamily: FontFamily.mono, fontSize: 13.5, color: i === 3 ? T.indigoLt : T.sub, fontWeight: '500' }}>{t}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={{ flex: 1, alignItems: 'center', paddingVertical: 8 }}>
            <Text style={{ fontSize: 16, color: T.indigoLt }}>✦</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
