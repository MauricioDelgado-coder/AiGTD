import './aigtd.css';

const T = {
  bg: '#0A0A0E', bgGrad: 'radial-gradient(120% 80% at 80% -10%, rgba(123,110,246,0.10) 0%, rgba(123,110,246,0) 55%), #0A0A0E',
  card: '#141419', cardSoft: '#101015', line: 'rgba(255,255,255,0.065)', lineHi: 'rgba(255,255,255,0.12)',
  text: '#ECEAF3', sub: '#8B8896', faint: '#5A5766', dim: '#403E4A',
  green: '#5BD6A6', amber: '#F2C14E', rose: '#F2748C',
  indigo: '#7B6EF6', indigoLt: '#A89EFA', indigoBg: 'rgba(123,110,246,0.14)', indigoBd: 'rgba(123,110,246,0.38)',
  glass: 'rgba(22,22,28,0.74)', glassBd: 'rgba(255,255,255,0.07)',
  serif: 'Georgia, "Times New Roman", serif',
  mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
  sans: '-apple-system, "SF Pro Text", system-ui, sans-serif',
};

function Mono({ children, color = T.faint, size = 10.5, spacing = 1.6 }: any) {
  return <span style={{ fontFamily: T.mono, fontSize: size, letterSpacing: spacing, textTransform: 'uppercase' as any, color, fontWeight: 500 }}>{children}</span>;
}
function Serif({ children, size = 30, color = T.text, style = {} }: any) {
  return <span style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: size, color, lineHeight: 1.08, letterSpacing: '-0.01em', ...style }}>{children}</span>;
}
function Card({ children, style = {} }: any) {
  return <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 18, ...style }}>{children}</div>;
}
function Checkbox({ done }: any) {
  return (
    <div style={{ width: 22, height: 22, borderRadius: 7, flexShrink: 0, border: `1.8px solid ${done ? T.indigo : T.dim}`, background: done ? T.indigo : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {done && <span style={{ color: '#0A0A0E', fontSize: 11, fontWeight: 700 }}>✓</span>}
    </div>
  );
}

const tabs = [
  { id: 'home', label: 'Home', path: 'M3 10.5 12 3l9 7.5M5 9.5V21h5v-6h4v6h5V9.5' },
  { id: 'inbox', label: 'Inbox', path: 'M3 12h5l2 3h4l2-3h5M3 12l3-7h12l3 7v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
  { id: 'note', label: 'Notes', path: 'M5 3h9l5 5v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM14 3v5h5M8 13h8M8 17h5' },
  { id: 'chat', label: 'AI', path: 'M4 5h16v11H9l-4 4V5z' },
  { id: 'review', label: 'Review', path: 'M21 12a9 9 0 1 1-3-6.7M21 4v4h-4' },
];
function TabBar({ active = 'home' }: any) {
  return (
    <div style={{ position: 'absolute', left: 16, right: 16, bottom: 26, height: 62, borderRadius: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 8px', background: T.glass, backdropFilter: 'blur(20px) saturate(160%)', WebkitBackdropFilter: 'blur(20px) saturate(160%)', border: `1px solid ${T.glassBd}`, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
      {tabs.map(t => {
        const on = t.id === active;
        return (
          <div key={t.id} style={{ width: 46, height: 42, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? T.indigoBg : 'transparent' }}>
            <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={on ? T.indigoLt : T.faint} strokeWidth={on ? 2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
              <path d={t.path} />
            </svg>
          </div>
        );
      })}
    </div>
  );
}

const stats = [
  { n: '12/18', l: 'DONE TODAY', c: '#5BD6A6' },
  { n: '2h 40m', l: 'FOCUS', c: '#A89EFA' },
  { n: '7', l: 'STREAK', c: '#F2C14E' },
];
const next = [
  { t: 'Finalize Q3 product roadmap', tag: 'Roadmap', time: '10:00', done: false, p: '#F2748C' },
  { t: 'Review design system PR', tag: 'Eng', time: '11:30', done: false, p: '#7B6EF6' },
  { t: 'Reply to onboarding thread', tag: 'Inbox', time: '14:00', done: true, p: '#5A5766' },
];

export function HomeScreen() {
  return (
    <div style={{ width: 390, height: 844, background: T.bgGrad, color: T.text, fontFamily: T.sans, position: 'relative', overflow: 'hidden' }}>
      <div style={{ height: '100%', overflowY: 'auto', padding: '54px 20px 132px', boxSizing: 'border-box' }}>
        <Mono>Thursday · May 29</Mono>
        <div style={{ marginTop: 8 }}><Serif size={32}>Good morning, Alex.</Serif></div>

        <Card style={{ marginTop: 20, padding: 18, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(90% 120% at 100% 0%, rgba(123,110,246,0.16), transparent 60%)', borderRadius: 18 }} />
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <svg width={15} height={15} viewBox="0 0 24 24" fill={T.indigoLt} stroke="none"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z" /></svg>
              <Mono color={T.indigoLt} spacing={1.8}>AI Daily Digest</Mono>
            </div>
            <div style={{ fontSize: 15, lineHeight: 1.55, color: T.text }}>
              You have <b style={{ color: T.indigoLt, fontWeight: 600 }}>4 tasks</b> due and 2 meetings. Your top priority is the <b style={{ fontWeight: 600 }}>Q3 roadmap</b> — it's blocking three downstream items.
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <div style={{ flex: 1, textAlign: 'center', padding: '9px 0', borderRadius: 11, background: T.indigo, color: '#fff', fontSize: 13, fontWeight: 600 }}>Start Focus Block</div>
              <div style={{ padding: '9px 14px', borderRadius: 11, border: `1px solid ${T.lineHi}`, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: T.sub }}>
                <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke={T.sub} strokeWidth={1.7} strokeLinecap="round"><path d="M4 5h16v11H9l-4 4V5z" /></svg> Ask
              </div>
            </div>
          </div>
        </Card>

        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          {stats.map(s => (
            <Card key={s.l} style={{ flex: 1, padding: '14px 12px' }}>
              <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 23, color: s.c }}>{s.n}</div>
              <div style={{ marginTop: 6 }}><Mono size={8.5} spacing={1}>{s.l}</Mono></div>
            </Card>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '26px 2px 12px' }}>
          <Mono color={T.sub} spacing={2}>Up Next</Mono>
          <Mono>3 of 18</Mono>
        </div>
        <Card style={{ overflow: 'hidden' }}>
          {next.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 16px', borderTop: i ? `1px solid ${T.line}` : 'none' }}>
              <Checkbox done={r.done} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14.5, color: r.done ? T.faint : T.text, textDecoration: r.done ? 'line-through' : 'none', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.t}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 3, background: r.p, flexShrink: 0 }} />
                  <Mono size={9.5} spacing={1}>{r.tag}</Mono>
                </div>
              </div>
              <Mono color={T.sub}>{r.time}</Mono>
            </div>
          ))}
        </Card>
      </div>
      <TabBar active="home" />
    </div>
  );
}
