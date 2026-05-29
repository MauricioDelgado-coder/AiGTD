import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '../../src/theme';

const TAB_ICONS: Record<string, string> = {
  home:     '⌂',
  inbox:    '⊡',
  index:    '✎',
  review:   '↻',
  settings: '⚙',
};

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: Math.max(insets.bottom, 10) + 16,
        height: 62,
        borderRadius: 22,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 8,
        backgroundColor: T.glass,
        borderWidth: 1,
        borderColor: T.glassBd,
        // @ts-ignore web shadow
        boxShadow: '0 8px 24px rgba(20,18,40,0.12)',
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
      }}
    >
      {state.routes.map((route: any, idx: number) => {
        const isFocused = state.index === idx;
        const icon = TAB_ICONS[route.name] || '•';

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            style={{
              width: 46,
              height: 42,
              borderRadius: 14,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isFocused ? T.indigoBg : 'transparent',
            }}
          >
            <Text style={{ color: isFocused ? T.indigo : T.faint, fontSize: 20, lineHeight: 26 }}>
              {icon}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="home"     options={{ title: 'Home' }} />
      <Tabs.Screen name="inbox"    options={{ title: 'Inbox' }} />
      <Tabs.Screen name="index"    options={{ title: 'Notes' }} />
      <Tabs.Screen name="review"   options={{ title: 'Review' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
