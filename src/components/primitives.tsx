import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { T, FontFamily, Radius } from '../theme';

export function Mono({ children, color = T.faint, size = 10.5, spacing = 1.6, style }: any) {
  return <Text style={[{ fontFamily: FontFamily.mono, fontSize: size, letterSpacing: spacing, textTransform: 'uppercase', color, fontWeight: '500' }, style]}>{children}</Text>;
}

export function Serif({ children, size = 30, color = T.text, style }: any) {
  return <Text style={[{ fontFamily: FontFamily.serif, fontStyle: 'italic', fontSize: size, color, lineHeight: size * 1.08, letterSpacing: -0.3 }, style]}>{children}</Text>;
}

export function Card({ children, style, soft }: any) {
  return <View style={[{ backgroundColor: soft ? T.cardSoft : T.card, borderRadius: Radius.lg, borderWidth: 1, borderColor: T.line }, style]}>{children}</View>;
}

export function Chip({ children, active, onPress, style }: any) {
  const Wrap = onPress ? TouchableOpacity : View;
  return (
    <Wrap onPress={onPress} style={[{ paddingHorizontal: 12, paddingVertical: 7, borderRadius: Radius.pill, backgroundColor: active ? T.indigoBg : 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: active ? T.indigoBd : T.line }, style]}>
      <Text style={{ fontFamily: FontFamily.mono, fontSize: 10.5, letterSpacing: 1.2, textTransform: 'uppercase', color: active ? T.indigoLt : T.sub, fontWeight: '500' }}>{children}</Text>
    </Wrap>
  );
}

export function Checkbox({ done, color = T.indigo, size = 22, onPress }: any) {
  const Wrap = onPress ? TouchableOpacity : View;
  return (
    <Wrap onPress={onPress} style={{ width: size, height: size, borderRadius: 7, borderWidth: 1.8, borderColor: done ? color : T.dim, backgroundColor: done ? color : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
      {done && <Text style={{ color: '#0A0A0E', fontSize: size * 0.5, fontWeight: '700' }}>✓</Text>}
    </Wrap>
  );
}

export function Icon({ name, size = 22, color = T.sub }: any) {
  const icons: any = { sparkle: '✦', chevL: '‹', chevR: '›', inbox: '⊡', home: '⌂', note: '✎', chat: '◎', review: '↻', search: '⌕', plus: '+', mic: '♪', send: '➤', more: '···', flag: '⚑', star: '★', link: '⚭', check: '✓', bolt: '⚡', calendar: '▦', folder: '⊞', hash: '#' };
  return <Text style={{ fontSize: size * 0.75, color, lineHeight: size }}>{icons[name] || '•'}</Text>;
}

export function GlassTabBar({ active = 'home', onPress }: any) {
  const tabs = [{ id: 'home', icon: '⌂', label: 'Home' }, { id: 'inbox', icon: '⊡', label: 'Inbox' }, { id: 'note', icon: '✎', label: 'Notes' }, { id: 'chat', icon: '◎', label: 'AI' }, { id: 'review', icon: '↻', label: 'Review' }];
  return (
    <View style={{ position: 'absolute', left: 16, right: 16, bottom: 26, height: 62, borderRadius: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 8, backgroundColor: T.glass, borderWidth: 1, borderColor: T.glassBd }}>
      {tabs.map(t => (
        <TouchableOpacity key={t.id} onPress={() => onPress?.(t.id)} style={{ width: 46, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: active === t.id ? T.indigoBg : 'transparent' }}>
          <Text style={{ fontSize: 20, color: active === t.id ? T.indigoLt : T.faint }}>{t.icon}</Text>
          <Text style={{ fontSize: 9, color: active === t.id ? T.indigoLt : T.faint, fontFamily: FontFamily.mono, marginTop: 1 }}>{t.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
