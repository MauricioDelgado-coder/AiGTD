import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { Colors } from '../../src/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.textMuted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Notes',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>📝</Text>,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>⚙️</Text>,
        }}
      />
    </Tabs>
  );
}
