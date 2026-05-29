import { Platform } from 'react-native';

export const Colors = {
  bg: '#0A0A0E',
  surface: '#141419',
  surface2: '#1A1A21',
  surface3: '#1F1F28',
  border: 'rgba(255,255,255,0.065)',
  borderLight: 'rgba(255,255,255,0.12)',
  accent: '#7B6EF6',
  accentDim: 'rgba(123,110,246,0.14)',
  accentBright: '#A89EFA',
  ember: '#F2748C',
  emberDim: 'rgba(242,116,140,0.14)',
  mint: '#5BD6A6',
  mintDim: 'rgba(91,214,166,0.12)',
  amber: '#F2C14E',
  amberDim: 'rgba(242,193,78,0.12)',
  text: '#ECEAF3',
  textSub: '#8B8896',
  textMuted: '#5A5766',
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
  bg: '#0A0A0E',
  card: '#141419',
  cardSoft: '#101015',
  cardHi: '#1A1A21',
  line: 'rgba(255,255,255,0.065)',
  lineHi: 'rgba(255,255,255,0.12)',
  dim: '#403E4A',
  faint: '#5A5766',
  sub: '#8B8896',
  text: '#ECEAF3',
  indigo: '#7B6EF6',
  indigoLt: '#A89EFA',
  indigoDk: '#5A4ED6',
  indigoBg: 'rgba(123,110,246,0.14)',
  indigoBd: 'rgba(123,110,246,0.38)',
  rose: '#F2748C',
  roseBg: 'rgba(242,116,140,0.14)',
  green: '#5BD6A6',
  greenBg: 'rgba(91,214,166,0.10)',
  amber: '#F2C14E',
  amberBg: 'rgba(242,193,78,0.10)',
  glass: 'rgba(22,22,28,0.74)',
  glassBd: 'rgba(255,255,255,0.07)',
};

export const FontFamily = {
  serif: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia, serif' }),
  sans: Platform.select({ ios: 'System', android: '-apple-system, "SF Pro Text", system-ui, sans-serif', default: '-apple-system, "SF Pro Text", system-ui, sans-serif' }),
  mono: Platform.select({ ios: 'Menlo', android: 'monospace', default: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace' }),
};
