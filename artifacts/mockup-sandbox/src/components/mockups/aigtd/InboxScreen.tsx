import './aigtd.css';

const T = {
  bg: '#EFF1F3',
  bgGrad: 'radial-gradient(120% 80% at 80% -10%, rgba(42,111,219,0.08) 0%, rgba(42,111,219,0) 55%), #EFF1F3',
  card: '#FFFFFF', line: 'rgba(24,28,38,0.08)', lineHi: 'rgba(24,28,38,0.14)',
  text: '#1A1D24', sub: '#62656E', faint: '#92959E', dim: '#C4C6CE',
  rose: '#D8536E', amber: '#B5821F', green: '#1F9D6B',
  indigo: '#2A6FDB', indigoLt: '#1E5BC0',
  indigoBg: 'rgba(42,111,219,0.10)', indigoBd: 'rgba(42,111,219,0.28)',
  glass: 'rgba(255,255,255,0.82)', glassBd: 'rgba(20,18,40,0.07)',
  serif: 'Georgia, "Times New Roman", serif',
  mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
  sans: '-apple-system, "SF Pro Text", system-ui, sans-serif',
};
function Mono({ children, color = T.faint, size = 10.5, spacing = 1.6 }: any) {
  return <span style={{ fontFamily: T.mono, fontSize: size, letterSpacing: spacing, textTransform: 'uppercase' as any, color, fontWeight: 500 }}>{children}</span>;
}
function Serif({ children, size = 30, color = T.text }: any) {
  return <span style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: size, color, lineHeight: 1.08 }}>{children}</span>;
}
function Chip({ children, active }: any) {
  return <span style={{ fontFamily: T.mono, fontSize: 10.5, letterSpacing: 1.2, textTransform: 'uppercase' as any, padding: '7px 12px', borderRadius: 999, whiteSpace: 'nowrap' as any, background: active ? T.indigoBg : 'rgba(20,18,40,0.05)', border: `1px solid ${active ? T.indigoBd : T.line}`, color: active ? T.indigo : T.sub, fontWeight: 500 }}>{children}</span>;
}
function Checkbox() {
  return <div style={{ width: 22, height: 22, borderRadius: 7, flexShrink: 0, border: `1.8px solid ${T.dim}`, background: 'transparent' }} />;
}
const tabs = [
  { id: 'home',   path: 'M3 10.5 12 3l9 7.5M5 9.5V21h5v-6h4v6h5V9.5' },
  { id: 'inbox',  path: 'M3 12h5l2 3h4l2-3h5M3 12l3-7h12l3 7v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
  { id: 'note',   path: 'M5 3h9l5 5v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM14 3v5h5M8 13h8M8 17h5' },
  { id: 'chat',   path: 'M4 5h16v11H9l-4 4V5z' },
  { id: 'review', path: 'M21 12a9 9 0 1 1-3-6.7M21 4v4h-4' },
];
function TabBar({ active = 'home' }: any) {
  return (
    <div style={{ position: 'absolute', left: 16, right: 16, bottom: 26, height: 62, borderRadius: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 8px', background: T.glass, backdropFilter: 'blur(20px) saturate(160%)', WebkitBackdropFilter: 'blur(20px) saturate(160%)', border: `1px solid ${T.glassBd}`, boxShadow: '0 8px 24px rgba(20,18,40,0.12)' }}>
      {tabs.map(t => {
        const on = t.id === active;
        return (
          <div key={t.id} style={{ width: 46, height: 42, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? T.indigoBg : 'transparent' }}>
            <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={on ? T.indigo : T.faint} strokeWidth={on ? 2 : 1.7} strokeLinecap="round" strokeLinejoin="round"><path d={t.path} /></svg>
          </div>
        );
      })}
    </div>
  );
}
const groups = [
  { h: 'Today', items: [
    { t: 'Send recap to design team', tag: 'Eng',      meta: 'Due 5pm',       flag: true, p: '#D8536E' },
    { t: 'Approve Q3 budget draft',   tag: 'Finance',  meta: 'Due today',            p: '#B5821F' },
    { t: 'Book dentist appointment',  tag: 'Personal', meta: '2 min',                p: '#1F9D6B' },
  ]},
  { h: 'Unsorted', items: [
    { t: 'Idea: weekly digest as podcast',   tag: 'Inbox',   meta: 'Captured 8:14', p: '#2A6FDB' },
    { t: 'Read "Building a Second Brain"',   tag: 'Reading', meta: 'Someday',       p: '#92959E' },
    { t: 'Follow up with Priya re: hiring',  tag: 'Team',    meta: 'Waiting',       p: '#1E5BC0' },
  ]},
];

export function InboxScreen() {
  return (
    <div style={{ width: 390, height: 844, background: T.bgGrad, color: T.text, fontFamily: T.sans, position: 'relative', overflow: 'hidden' }}>
      <div style={{ height: '100%', overflowY: 'auto', padding: '54px 20px 132px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <Serif size={30}>Inbox</Serif>
          <Mono color={T.faint}>23 items</Mono>
        </div>

        {/* Capture bar */}
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10, padding: '6px 6px 6px 16px', borderRadius: 16, background: T.card, border: `1px solid ${T.indigoBd}`, boxShadow: '0 0 0 4px rgba(42,111,219,0.07)' }}>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={T.indigo} strokeWidth={1.7} strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          <span style={{ flex: 1, fontSize: 15, color: T.faint }}>Capture anything…</span>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: T.indigo, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={19} height={19} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.7} strokeLinecap="round"><path d="M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3zM5 11a7 7 0 0 0 14 0M12 18v3" /></svg>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          {['All', 'Today', 'Flagged', 'Unsorted'].map((f, i) => <Chip key={f} active={i === 0}>{f}</Chip>)}
        </div>

        {groups.map(g => (
          <div key={g.h}>
            <div style={{ margin: '22px 2px 10px' }}><Mono color={T.sub} spacing={2}>{g.h}</Mono></div>
            <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 18, overflow: 'hidden' }}>
              {g.items.map((r: any, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 15px', borderTop: i ? `1px solid ${T.line}` : 'none' }}>
                  <Checkbox />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as any, color: T.text }}>{r.t}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 }}>
                      <span style={{ width: 6, height: 6, borderRadius: 3, background: r.p, flexShrink: 0 }} />
                      <Mono size={9.5} spacing={1}>{r.tag}</Mono>
                      <span style={{ color: T.dim }}>·</span>
                      <Mono size={9.5} spacing={1} color={T.faint}>{r.meta}</Mono>
                    </div>
                  </div>
                  {r.flag && <svg width={15} height={15} viewBox="0 0 24 24" fill="#D8536E" stroke="none"><path d="M5 21V4M5 4h11l-2 4 2 4H5" /></svg>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <TabBar active="inbox" />
    </div>
  );
}
