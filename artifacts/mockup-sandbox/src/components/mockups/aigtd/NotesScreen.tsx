import './aigtd.css';

const T = {
  bg: '#0A0A0E', bgGrad: 'radial-gradient(120% 80% at 80% -10%, rgba(123,110,246,0.10) 0%, rgba(123,110,246,0) 55%), #0A0A0E',
  card: '#141419', line: 'rgba(255,255,255,0.065)',
  text: '#ECEAF3', sub: '#8B8896', faint: '#5A5766', dim: '#403E4A',
  indigo: '#7B6EF6', indigoLt: '#A89EFA', indigoBg: 'rgba(123,110,246,0.14)', indigoBd: 'rgba(123,110,246,0.38)',
  green: '#5BD6A6', amber: '#F2C14E',
  glass: 'rgba(22,22,28,0.74)', glassBd: 'rgba(255,255,255,0.07)',
  serif: 'Georgia, "Times New Roman", serif',
  mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
  sans: '-apple-system, "SF Pro Text", system-ui, sans-serif',
};
function Mono({ children, color = T.faint, size = 10.5, spacing = 1.6 }: any) {
  return <span style={{ fontFamily: T.mono, fontSize: size, letterSpacing: spacing, textTransform: 'uppercase' as any, color, fontWeight: 500 }}>{children}</span>;
}
function Serif({ children, size = 30, color = T.text, style = {} }: any) {
  return <span style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: size, color, lineHeight: 1.15, letterSpacing: '-0.01em', ...style }}>{children}</span>;
}
function Chip({ children, active }: any) {
  return <span style={{ fontFamily: T.mono, fontSize: 10.5, letterSpacing: 1.2, textTransform: 'uppercase' as any, padding: '7px 12px', borderRadius: 999, whiteSpace: 'nowrap' as any, background: active ? T.indigoBg : 'rgba(255,255,255,0.04)', border: `1px solid ${active ? T.indigoBd : T.line}`, color: active ? T.indigoLt : T.sub, fontWeight: 500 }}>{children}</span>;
}
const tabs = [
  { id: 'home', path: 'M3 10.5 12 3l9 7.5M5 9.5V21h5v-6h4v6h5V9.5' },
  { id: 'inbox', path: 'M3 12h5l2 3h4l2-3h5M3 12l3-7h12l3 7v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
  { id: 'note', path: 'M5 3h9l5 5v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM14 3v5h5M8 13h8M8 17h5' },
  { id: 'chat', path: 'M4 5h16v11H9l-4 4V5z' },
  { id: 'review', path: 'M21 12a9 9 0 1 1-3-6.7M21 4v4h-4' },
];
function TabBar({ active = 'home' }: any) {
  return (
    <div style={{ position: 'absolute', left: 16, right: 16, bottom: 26, height: 62, borderRadius: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 8px', background: T.glass, backdropFilter: 'blur(20px) saturate(160%)', WebkitBackdropFilter: 'blur(20px) saturate(160%)', border: `1px solid ${T.glassBd}`, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
      {tabs.map(t => {
        const on = t.id === active;
        return (
          <div key={t.id} style={{ width: 46, height: 42, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? T.indigoBg : 'transparent' }}>
            <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={on ? T.indigoLt : T.faint} strokeWidth={on ? 2 : 1.7} strokeLinecap="round" strokeLinejoin="round"><path d={t.path} /></svg>
          </div>
        );
      })}
    </div>
  );
}

const notes = [
  { t: 'Q3 Product Roadmap', ex: 'Three pillars: onboarding, retention, and the new AI Digest surface…', links: 6, d: 'May 28', tag: 'Project', accent: '#7B6EF6' },
  { t: 'Second Brain Method', ex: 'Capture → organize → distill → express. The CODE workflow applied…', links: 11, d: 'May 26', tag: 'Idea', accent: '#5BD6A6' },
  { t: 'Onboarding Teardown', ex: 'Linear nails the empty state. Notes on activation moments and…', links: 3, d: 'May 24', tag: 'Reading', accent: '#F2C14E' },
  { t: 'Weekly Review Ritual', ex: 'Clear inbox, scan projects, pick one needle-mover. Linked to GTD…', links: 4, d: 'May 23', tag: 'System', accent: '#A89EFA' },
];

export function NotesScreen() {
  return (
    <div style={{ width: 390, height: 844, background: T.bgGrad, color: T.text, fontFamily: T.sans, position: 'relative', overflow: 'hidden' }}>
      <div style={{ height: '100%', overflowY: 'auto', padding: '54px 20px 132px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <Serif size={30}>Notes</Serif>
          <Mono>248 notes</Mono>
        </div>

        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 14, background: T.card, border: `1px solid ${T.line}` }}>
          <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke={T.faint} strokeWidth={1.7} strokeLinecap="round"><path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4" /></svg>
          <span style={{ flex: 1, fontSize: 14.5, color: T.faint }}>Search notes & backlinks…</span>
          <Mono size={9.5} color={T.dim}>⌘K</Mono>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 14, overflow: 'hidden' }}>
          {['All', 'Projects', 'Ideas', 'Reading', 'Daily'].map((t, i) => <Chip key={t} active={i === 0}>{t}</Chip>)}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 18 }}>
          {notes.map((n, i) => (
            <div key={i} style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 18, padding: 14, display: 'flex', flexDirection: 'column', minHeight: 138 }}>
              <div style={{ width: 22, height: 3, borderRadius: 2, background: n.accent, marginBottom: 11 }} />
              <Serif size={16.5}>{n.t}</Serif>
              <div style={{ flex: 1, fontSize: 11.5, color: T.sub, lineHeight: 1.5, marginTop: 7 }}>{n.ex}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 11, paddingTop: 10, borderTop: `1px solid ${T.line}` }}>
                <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke={T.indigoLt} strokeWidth={1.7} strokeLinecap="round"><path d="M9 14l6-6M8.5 9.5 7 11a3.5 3.5 0 0 0 5 5l1.5-1.5M15.5 14.5 17 13a3.5 3.5 0 0 0-5-5l-1.5 1.5" /></svg>
                <Mono size={9} color={T.faint} spacing={0.8}>{n.links} links</Mono>
                <span style={{ marginLeft: 'auto' }}>
                  <Mono size={9} color={T.dim} spacing={0}>{n.d}</Mono>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <TabBar active="note" />
    </div>
  );
}
