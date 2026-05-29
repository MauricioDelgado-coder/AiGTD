import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { T } from '../../src/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: T.card,
          borderTopColor: T.line,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: T.indigo,
        tabBarInactiveTintColor: T.faint,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>⌂</Text>,
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: 'Inbox',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>⊡</Text>,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Notes',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>✎</Text>,
        }}
      />
      <Tabs.Screen
        name="review"
        options={{
          title: 'Review',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>↻</Text>,
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
