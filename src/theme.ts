// src/theme.ts
import { Platform } from 'react-native';

export const Colors = {
  bg: '#0A0A0D',
  surface: '#111116',
  surface2: '#18181F',
  surface3: '#1F1F28',
  border: '#252530',
  borderLight: '#2E2E3A',
  accent: '#7B6EF6',
  accentDim: 'rgba(123,110,246,0.15)',
  accentBright: '#9B8FF8',
  ember: '#F06A6A',
  emberDim: 'rgba(240,106,106,0.15)',
  mint: '#52D6A8',
  mintDim: 'rgba(82,214,168,0.12)',
  amber: '#F0A050',
  amberDim: 'rgba(240,160,80,0.12)',
  text: '#EEEEF5',
  textSub: '#9898B0',
  textMuted: '#5A5A72',
  white: '#FFFFFF',
  black: '#000000',
};

export const Typography = {
  displayFont: Platform.select({ ios: 'Georgia', android: 'serif' }),
  bodyFont: Platform.select({ ios: 'System', android: 'sans-serif' }),
  monoFont: Platform.select({ ios: 'Courier New', android: 'monospace' }),
};

export const Radius = { sm: 8, md: 12, lg: 16, xl: 24, pill: 999 };
export const Spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };
