import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { T, FontFamily, Radius } from '../theme';

export function Mono({ children, color = T.faint, size = 10.5, spacing = 1.6, weight = '500', style }: any) {
  return (
    <Text style={[{
      fontFamily: FontFamily.mono,
      fontSize: size,
      letterSpacing: spacing,
      textTransform: 'uppercase',
      color,
      fontWeight: weight,
    } as TextStyle, style]}>
      {children}
    </Text>
  );
}

export function Serif({ children, size = 30, color = T.text, style }: any) {
  return (
    <Text style={[{
      fontFamily: FontFamily.serif,
      fontStyle: 'italic',
      fontSize: size,
      color,
      lineHeight: size * 1.1,
      letterSpacing: -0.3,
    } as TextStyle, style]}>
      {children}
    </Text>
  );
}

export function Card({ children, style, soft }: any) {
  return (
    <View style={[{
      backgroundColor: soft ? T.cardSoft : T.card,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: T.line,
    }, style]}>
      {children}
    </View>
  );
}

export function Chip({ children, active, onPress, color, style }: any) {
  const Wrap = onPress ? TouchableOpacity : View;
  return (
    <Wrap
      onPress={onPress}
      style={[{
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: Radius.pill,
        backgroundColor: active ? T.indigoBg : 'rgba(255,255,255,0.04)',
        borderWidth: 1,
        borderColor: active ? T.indigoBd : T.line,
      } as ViewStyle, style]}
    >
      <Text style={{
        fontFamily: FontFamily.mono,
        fontSize: 10.5,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        color: active ? T.indigoLt : (color || T.sub),
        fontWeight: '500',
      }}>
        {children}
      </Text>
    </Wrap>
  );
}

export function Checkbox({ done, color = T.indigo, size = 22, onPress }: any) {
  const Wrap = onPress ? TouchableOpacity : View;
  return (
    <Wrap
      onPress={onPress}
      style={{
        width: size,
        height: size,
        borderRadius: 7,
        borderWidth: 1.8,
        borderColor: done ? color : T.dim,
        backgroundColor: done ? color : 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {done && (
        <Text style={{ color: '#0A0A0E', fontSize: size * 0.5, fontWeight: '800' }}>✓</Text>
      )}
    </Wrap>
  );
}

const GTD_ICONS: Record<string, string> = {
  sparkle: '✦',
  chevL: '‹',
  chevR: '›',
  inbox: '⊡',
  home: '⌂',
  note: '✎',
  chat: '◎',
  review: '↻',
  settings: '⚙',
  search: '⌕',
  plus: '+',
  mic: '♪',
  send: '➤',
  more: '···',
  flag: '⚑',
  star: '★',
  link: '⚭',
  check: '✓',
  bolt: '⚡',
  calendar: '▦',
  folder: '⊞',
  hash: '#',
  tag: '⊹',
  clock: '◷',
};

export function Icon({ name, size = 22, color = T.sub }: any) {
  return (
    <Text style={{ fontSize: size * 0.75, color, lineHeight: size, textAlign: 'center' }}>
      {GTD_ICONS[name] || '•'}
    </Text>
  );
}

const TAB_PATHS: Record<string, string> = {
  home:    'M3 10.5 12 3l9 7.5M5 9.5V21h5v-6h4v6h5V9.5',
  inbox:   'M3 12h5l2 3h4l2-3h5M3 12l3-7h12l3 7v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  note:    'M5 3h9l5 5v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM14 3v5h5M8 13h8M8 17h5',
  review:  'M21 12a9 9 0 1 1-3-6.7M21 4v4h-4',
  settings:'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
};

export function GlassTabBar({ active = 'home', onPress }: any) {
  const tabList = [
    { id: 'home',     label: 'Home' },
    { id: 'inbox',    label: 'Inbox' },
    { id: 'note',     label: 'Notes' },
    { id: 'review',   label: 'Review' },
    { id: 'settings', label: 'Settings' },
  ];
  return (
    <View style={{
      position: 'absolute',
      left: 16,
      right: 16,
      bottom: 26,
      height: 62,
      borderRadius: 22,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      paddingHorizontal: 8,
      backgroundColor: T.glass,
      borderWidth: 1,
      borderColor: T.glassBd,
      // @ts-ignore web-only shadow
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    }}>
      {tabList.map(tab => {
        const on = tab.id === active;
        const path = TAB_PATHS[tab.id] || TAB_PATHS.home;
        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onPress?.(tab.id)}
            style={{
              width: 46,
              height: 42,
              borderRadius: 14,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: on ? T.indigoBg : 'transparent',
            }}
          >
            <Text style={{ color: on ? T.indigoLt : T.faint, fontSize: 18, lineHeight: 24 }}>
              {tab.id === 'home' ? '⌂' : tab.id === 'inbox' ? '⊡' : tab.id === 'note' ? '✎' : tab.id === 'review' ? '↻' : '⚙'}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
