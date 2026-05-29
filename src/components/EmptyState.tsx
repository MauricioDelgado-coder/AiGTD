// src/components/EmptyState.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography } from '../theme';

export const EmptyState: React.FC<{ icon: string; title: string; sub: string }> = ({ icon, title, sub }) => (
  <View style={styles.wrap}>
    <Text style={styles.icon}>{icon}</Text>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.sub}>{sub}</Text>
  </View>
);

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, paddingBottom: 60 },
  icon: { fontSize: 44, marginBottom: 16 },
  title: { color: Colors.text, fontSize: 20, fontFamily: Typography.displayFont, marginBottom: 8, textAlign: 'center' },
  sub: { color: Colors.textSub, fontSize: 14, fontFamily: Typography.bodyFont, textAlign: 'center', lineHeight: 20 },
});
