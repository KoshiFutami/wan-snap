// Desktop shell components for Wan-Snap PC

// Sidebar nav — 220px wide
function PCSidebar({ active = 'home' }) {
  const T = WS_TOKENS, F = WS_FONTS, P = WS_PHOTOS;
  const navItem = (id, label, icon, count) => {
    const a = active === id;
    return (
      <div style={{
        padding: '10px 14px', borderRadius: 10,
        background: a ? T.ink : 'transparent', color: a ? T.cream : T.ink,
        display: 'flex', alignItems: 'center', gap: 12,
        fontSize: 13, fontWeight: a ? 600 : 500,
        marginBottom: 2, cursor: 'pointer',
      }}>
        {icon(a ? T.cream : T.ink)}
        <span style={{ flex: 1 }}>{label}</span>
        {count && <span style={{
          fontSize: 10, fontFamily: F.mono,
          color: a ? 'rgba(244,237,224,0.5)' : T.ink50,
        }}>{count}</span>}
      </div>
    );
  };
  return (
    <div style={{
      width: 220, flexShrink: 0, height: '100%',
      borderRight: `1px solid ${T.hairline}`,
      background: T.creamSoft,
      padding: '24px 14px', display: 'flex', flexDirection: 'column', gap: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '0 8px 24px' }}>
        <div style={{
          fontFamily: F.serif, fontSize: 22, fontWeight: 500,
          color: T.ink, letterSpacing: '-0.01em', lineHeight: 1,
        }}>Wan<span style={{ opacity: 0.5 }}>·</span>Snap<span style={{ color: T.terracotta }}>.</span></div>
      </div>

      {/* Primary nav */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {navItem('home', 'フィード', (c) => Icons.home(c, active === 'home'))}
        {navItem('explore', 'さがす', (c) => Icons.search(c), '284')}
        {navItem('notifications', 'お知らせ', (c) => Icons.bookmark(c), '8')}
        {navItem('album', 'アルバム', (c) => (
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <rect x="3" y="4" width="14" height="13" rx="2" stroke={c} strokeWidth="1.5"/>
            <path d="M3 13l4-4 3 3 3-3 4 4" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/>
            <circle cx="13" cy="8" r="1.4" fill={c}/>
          </svg>
        ))}

        <div style={{
          fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: T.ink50, fontWeight: 600,
          padding: '20px 10px 8px',
        }}>マイわんたち</div>

        {/* Dog rows */}
        <DogRow name="エマ" breed="柴犬 · 9.5kg" src={P.shibaPort} active={active === 'dog-ema'}/>
        <DogRow name="モカ" breed="ヨーキー · 2.7kg" src={P.yorkie}/>

        <div style={{
          padding: '10px 14px', borderRadius: 10,
          color: T.ink50, fontSize: 12, fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 10,
          cursor: 'pointer',
        }}>
          <div style={{
            width: 24, height: 24, borderRadius: 12,
            border: `1px dashed ${T.hairlineStrong}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {Icons.plus(T.ink50)}
          </div>
          愛犬を追加
        </div>
      </div>

      {/* New post CTA */}
      <button style={{
        padding: '12px 16px', borderRadius: 999,
        background: T.terracotta, color: '#fff',
        fontSize: 13, fontWeight: 600, border: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        fontFamily: F.sans, cursor: 'pointer', marginBottom: 12,
      }}>
        {Icons.plus('#fff')}
        スナップを投稿
      </button>

      {/* Profile chip */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 8px', borderRadius: 10,
        cursor: 'pointer',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 18,
          background: T.cream, border: `1px solid ${T.hairline}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: F.serif, fontSize: 16, color: T.ink, fontWeight: 500,
        }}>k</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: T.ink }}>こうし</div>
          <div style={{ fontSize: 10.5, color: T.ink50 }}>@koushi_to_ema</div>
        </div>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <circle cx="4" cy="8" r="1.1" fill={T.ink50}/>
          <circle cx="8" cy="8" r="1.1" fill={T.ink50}/>
          <circle cx="12" cy="8" r="1.1" fill={T.ink50}/>
        </svg>
      </div>
    </div>
  );
}

function DogRow({ name, breed, src, active }) {
  const T = WS_TOKENS, F = WS_FONTS;
  return (
    <div style={{
      padding: '8px 10px', borderRadius: 10,
      display: 'flex', alignItems: 'center', gap: 10,
      background: active ? T.cream : 'transparent',
      cursor: 'pointer', marginBottom: 2,
    }}>
      <div style={{
        width: 26, height: 26, borderRadius: 13,
        background: `url(${src}) center/cover`,
        boxShadow: active ? `0 0 0 1.5px ${T.terracotta}` : 'none',
      }}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: T.ink }}>{name}</div>
        <div style={{ fontSize: 10, color: T.ink50, fontFamily: F.mono }}>{breed}</div>
      </div>
    </div>
  );
}

// Top header bar inside main content
function PCHeader({ title, eyebrow, search = false, actions }) {
  const T = WS_TOKENS, F = WS_FONTS;
  return (
    <div style={{
      padding: '24px 40px 18px',
      borderBottom: `1px solid ${T.hairline}`,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      gap: 24, background: T.cream,
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      <div style={{ minWidth: 0 }}>
        {eyebrow && <div style={{
          fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
          color: T.ink50, fontWeight: 500, marginBottom: 6,
        }}>{eyebrow}</div>}
        <div style={{
          fontFamily: F.serif, fontSize: 32, fontWeight: 500,
          color: T.ink, letterSpacing: '-0.015em', lineHeight: 1,
        }}>{title}</div>
      </div>
      {search && (
        <div style={{
          flex: 1, maxWidth: 420,
          background: T.paper, borderRadius: 999,
          border: `1px solid ${T.hairline}`,
          padding: '10px 16px',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          {Icons.search(T.ink50)}
          <input placeholder="犬種・ブランド・タグで検索"
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontSize: 13, color: T.ink, fontFamily: F.sans,
            }}/>
          <span style={{
            padding: '2px 6px', borderRadius: 4, fontSize: 10,
            color: T.ink50, background: T.cream,
            fontFamily: F.mono, letterSpacing: '0.04em',
          }}>⌘ K</span>
        </div>
      )}
      {actions}
    </div>
  );
}

// Right rail container
function PCRightRail({ children, w = 300 }) {
  const T = WS_TOKENS;
  return (
    <div style={{
      width: w, flexShrink: 0, height: '100%',
      borderLeft: `1px solid ${T.hairline}`,
      background: T.creamSoft,
      padding: '32px 24px', overflowY: 'auto',
    }}>{children}</div>
  );
}

// Rail section
function RailSection({ title, action, children }) {
  const T = WS_TOKENS, F = WS_FONTS;
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        marginBottom: 12,
      }}>
        <div style={{
          fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
          color: T.ink50, fontWeight: 600,
        }}>{title}</div>
        {action && <div style={{ fontSize: 11, color: T.terracotta, fontWeight: 500, cursor: 'pointer' }}>{action}</div>}
      </div>
      {children}
    </div>
  );
}

// PC layout shell
function PCLayout({ active, children, rightRail }) {
  const T = WS_TOKENS;
  return (
    <div style={{
      width: 1440, height: 900,
      background: T.cream, color: T.ink,
      fontFamily: WS_FONTS.sans,
      display: 'flex', overflow: 'hidden',
      letterSpacing: '0.005em',
    }}>
      <PCSidebar active={active}/>
      <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
        {children}
      </div>
      {rightRail && <PCRightRail>{rightRail}</PCRightRail>}
    </div>
  );
}

Object.assign(window, { PCSidebar, PCHeader, PCRightRail, RailSection, PCLayout, DogRow });
