import { Platform } from 'react-native';

export const Colors = {
  bg: '#EFF1F3',
  surface: '#FFFFFF',
  surface2: '#E7E9ED',
  surface3: '#DDE0E5',
  border: 'rgba(24,28,38,0.08)',
  borderLight: 'rgba(24,28,38,0.14)',
  accent: '#2A6FDB',
  accentDim: 'rgba(42,111,219,0.10)',
  accentBright: '#1E5BC0',
  ember: '#D8536E',
  emberDim: 'rgba(216,83,110,0.12)',
  mint: '#1F9D6B',
  mintDim: 'rgba(31,157,107,0.10)',
  amber: '#B5821F',
  amberDim: 'rgba(181,130,31,0.10)',
  text: '#1A1D24',
  textSub: '#62656E',
  textMuted: '#92959E',
  white: '#FFFFFF',
  black: '#000000',
};

export const Typography = {
  displayFont: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia, serif' }),
  bodyFont: Platform.select({ ios: 'System', android: 'sans-serif', default: '-apple-system, "SF Pro Text", system-ui, sans-serif' }),
  monoFont: Platform.select({ ios: 'Menlo', android: 'monospace', default: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace' }),
};

export const Radius = { sm: 8, md: 12, lg: 18, xl: 24, pill: 999 };
export const Spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };

export const T = {
  bg: '#EFF1F3',
  card: '#FFFFFF',
  cardSoft: '#E7E9ED',
  cardHi: '#FFFFFF',
  line: 'rgba(24,28,38,0.08)',
  lineHi: 'rgba(24,28,38,0.14)',
  dim: '#C4C6CE',
  faint: '#92959E',
  sub: '#62656E',
  text: '#1A1D24',
  indigo: '#2A6FDB',
  indigoLt: '#1E5BC0',
  indigoDk: '#1650A8',
  indigoBg: 'rgba(42,111,219,0.10)',
  indigoBd: 'rgba(42,111,219,0.28)',
  rose: '#D8536E',
  roseBg: 'rgba(216,83,110,0.10)',
  green: '#1F9D6B',
  greenBg: 'rgba(31,157,107,0.10)',
  amber: '#B5821F',
  amberBg: 'rgba(181,130,31,0.10)',
  glass: 'rgba(255,255,255,0.82)',
  glassBd: 'rgba(20,18,40,0.07)',
};

export const FontFamily = {
  serif: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia, serif' }),
  sans: Platform.select({ ios: 'System', android: '-apple-system, "SF Pro Text", system-ui, sans-serif', default: '-apple-system, "SF Pro Text", system-ui, sans-serif' }),
  mono: Platform.select({ ios: 'Menlo', android: 'monospace', default: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace' }),
};
