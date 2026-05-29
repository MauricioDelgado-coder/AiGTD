// src/components/AIOrb.tsx
import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';
import { Colors } from '../theme';

interface Props {
  size?: number;
  thinking?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const AIOrb: React.FC<Props> = ({ size = 32, thinking = false, style }) => {
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: thinking ? 500 : 1800, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: thinking ? 500 : 1800, useNativeDriver: true }),
      ])
    ).start();
  }, [thinking]);

  const opacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] });

  return (
    <Animated.View
      style={[{
        width: size, height: size, borderRadius: size / 2,
        backgroundColor: Colors.accent,
        alignItems: 'center', justifyContent: 'center',
        opacity,
        shadowColor: Colors.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.7,
        shadowRadius: 8,
      }, style]}
    >
      <Animated.Text style={{ fontSize: size * 0.42, color: '#fff' }}>✦</Animated.Text>
    </Animated.View>
  );
};
