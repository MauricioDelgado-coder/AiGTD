// src/screens/ChatScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { T, FontFamily } from '../theme';
import { Mono, Serif } from '../components/primitives';
import { aiService } from '../services/aiService';
import { useGTDStore } from '../store/gtdStore';

type Message = { id: string; role: 'user' | 'assistant'; content: string };
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

export const ChatScreen: React.FC = () => {
  const { tasks } = useGTDStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi! I'm your GTD co-pilot. Ask me anything — your tasks, priorities, what to focus on today, or just think out loud.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');

    const userMsg: Message = { id: uid(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const history = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));

      const reply = await aiService.chat(text, history, tasks);
      setMessages(prev => [...prev, { id: uid(), role: 'assistant', content: reply }]);
    } catch (e: any) {
      const errMsg = e?.message === 'NO_API_KEY'
        ? 'No API key set — add your Anthropic key in Settings first.'
        : 'Something went wrong. Please try again.';
      setMessages(prev => [...prev, { id: uid(), role: 'assistant', content: errMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';
    return (
      <View style={{ alignSelf: isUser ? 'flex-end' : 'flex-start', maxWidth: '82%', marginBottom: 12 }}>
        {!isUser && (
          <Mono size={9} spacing={1.5} color={T.indigo} style={{ marginBottom: 4, marginLeft: 4 }}>
            AI CO-PILOT
          </Mono>
        )}
        <View style={{
          backgroundColor: isUser ? T.indigo : T.card,
          borderRadius: 18,
          borderBottomRightRadius: isUser ? 4 : 18,
          borderBottomLeftRadius: isUser ? 18 : 4,
          borderWidth: isUser ? 0 : 1,
          borderColor: T.line,
          padding: 13,
        }}>
          <Text style={{
            color: isUser ? '#fff' : T.text,
            fontSize: 14.5,
            lineHeight: 22,
            fontFamily: FontFamily.sans,
          }}>
            {item.content}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }} edges={['top']}>
      {/* Header */}
      <View style={{
        paddingHorizontal: 20,
        paddingTop: 14,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: T.line,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      }}>
        <Text style={{ fontSize: 20, color: T.indigo }}>✦</Text>
        <View>
          <Serif size={26}>AI Chat</Serif>
          <Mono color={T.faint} size={9.5} spacing={1} style={{ marginTop: 2 }}>
            Knows your tasks · Powered by Claude
          </Mono>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={m => m.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 12 }}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={loading ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <ActivityIndicator size="small" color={T.indigo} />
              <Mono color={T.faint} size={10} spacing={1}>Thinking…</Mono>
            </View>
          ) : null}
        />

        {/* Input bar */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          gap: 10,
          paddingHorizontal: 16,
          paddingTop: 10,
          paddingBottom: 100,
          borderTopWidth: 1,
          borderTopColor: T.line,
          backgroundColor: T.bg,
        }}>
          <TextInput
            style={{
              flex: 1,
              backgroundColor: T.card,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: T.indigoBd,
              paddingHorizontal: 14,
              paddingVertical: 10,
              color: T.text,
              fontSize: 14.5,
              fontFamily: FontFamily.sans,
              maxHeight: 100,
            }}
            value={input}
            onChangeText={setInput}
            placeholder="Ask anything about your tasks…"
            placeholderTextColor={T.faint}
            multiline
            returnKeyType="send"
            onSubmitEditing={send}
            blurOnSubmit
          />
          <TouchableOpacity
            onPress={send}
            disabled={!input.trim() || loading}
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              backgroundColor: input.trim() && !loading ? T.indigo : T.card,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: input.trim() && !loading ? T.indigo : T.line,
            }}
          >
            <Text style={{ fontSize: 20, color: input.trim() && !loading ? '#fff' : T.faint }}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
