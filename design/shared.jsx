// Shared UI primitives for Wan-Snap screens
const T = WS_TOKENS;
const F = WS_FONTS;

// ──────────────────────────────────────────────────────────
// Screen shell — full mobile frame. 390x844 (iPhone 14 Pro)
// ──────────────────────────────────────────────────────────
function Screen({ children, bg = T.cream, style = {} }) {
  return (
    <div style={{
      width: 390, height: 844, background: bg,
      fontFamily: F.sans, color: T.ink,
      overflow: 'hidden', position: 'relative',
      letterSpacing: '0.005em',
      ...style,
    }}>
      {children}
    </div>
  );
}

// iOS status bar with dark glyphs (placement only — visual)
function StatusBar({ dark = false }) {
  const c = dark ? '#fff' : T.ink;
  return (
    <div style={{
      height: 54, padding: '14px 28px 0', display: 'flex',
      alignItems: 'flex-start', justifyContent: 'space-between',
      position: 'relative', zIndex: 5,
    }}>
      <div style={{
        fontFamily: '-apple-system, SF Pro Text, system-ui',
        fontWeight: 600, fontSize: 16, color: c, letterSpacing: '-0.01em',
      }}>9:41</div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 2 }}>
        <svg width="18" height="11" viewBox="0 0 18 11" fill="none">
          <rect x="0" y="7" width="3" height="4" rx="0.6" fill={c}/>
          <rect x="5" y="5" width="3" height="6" rx="0.6" fill={c}/>
          <rect x="10" y="2.5" width="3" height="8.5" rx="0.6" fill={c}/>
          <rect x="15" y="0" width="3" height="11" rx="0.6" fill={c}/>
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke={c} strokeOpacity="0.4" fill="none"/>
          <rect x="2" y="2" width="18" height="8" rx="1.5" fill={c}/>
          <path d="M23 4v4c.7-.2 1.3-1 1.3-2s-.6-1.8-1.3-2z" fill={c} fillOpacity="0.5"/>
        </svg>
      </div>
    </div>
  );
}

// Wordmark — paw silhouette + serif name
function Logo({ size = 22, color = T.ink }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
        <ellipse cx="6" cy="9" rx="2" ry="2.6" fill={color}/>
        <ellipse cx="11" cy="6.4" rx="2" ry="2.6" fill={color}/>
        <ellipse cx="16.3" cy="7.6" rx="2" ry="2.6" fill={color}/>
        <ellipse cx="20" cy="11.5" rx="1.8" ry="2.3" fill={color}/>
        <path d="M12 11c-3.5 0-6.5 2.6-6.5 5.8 0 2 1.5 3.4 3.5 3.4 1.2 0 2.2-.6 3-.6s1.8.6 3 .6c2 0 3.5-1.4 3.5-3.4 0-3.2-3-5.8-6.5-5.8z" fill={color}/>
      </svg>
      <div style={{
        fontFamily: F.serif, fontWeight: 600, fontSize: size + 2,
        letterSpacing: '-0.01em', color: color, lineHeight: 1,
        fontFeatureSettings: '"palt"',
      }}>Wan<span style={{ opacity: 0.5, margin: '0 1px' }}>·</span>Snap</div>
    </div>
  );
}

// Circular icon button
function IconBtn({ children, onClick, active = false, size = 40 }) {
  return (
    <button onClick={onClick} style={{
      width: size, height: size, borderRadius: size / 2,
      background: active ? T.ink : T.paper,
      border: `1px solid ${T.hairline}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', padding: 0, color: active ? T.cream : T.ink,
      flexShrink: 0,
    }}>
      {children}
    </button>
  );
}

// Glyph icons
const Icons = {
  search: (c = 'currentColor') => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="9" cy="9" r="6" stroke={c} strokeWidth="1.6"/>
      <path d="M13.5 13.5L17 17" stroke={c} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  user: (c = 'currentColor') => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="7" r="3.2" stroke={c} strokeWidth="1.5"/>
      <path d="M3.5 17c.8-3.4 3.5-5 6.5-5s5.7 1.6 6.5 5" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  heart: (c = 'currentColor', filled = false) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? c : 'none'}>
      <path d="M12 20.5s-7.5-4.7-7.5-10.2c0-2.7 2-4.8 4.5-4.8 1.8 0 2.7 1 3 1.7.3-.7 1.2-1.7 3-1.7 2.5 0 4.5 2.1 4.5 4.8 0 5.5-7.5 10.2-7.5 10.2z" stroke={c} strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  ),
  bookmark: (c = 'currentColor', filled = false) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? c : 'none'}>
      <path d="M6 4h12v17l-6-3.5L6 21V4z" stroke={c} strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  ),
  comment: (c = 'currentColor') => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M4 5h16v11h-9l-4 3.5V16H4V5z" stroke={c} strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  ),
  share: (c = 'currentColor') => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 3v13M12 3l-4 4M12 3l4 4M5 14v5h14v-5" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  plus: (c = 'currentColor') => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  back: (c = 'currentColor') => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M14 5l-7 7 7 7" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  filter: (c = 'currentColor') => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M3 5h14M5 10h10M7 15h6" stroke={c} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  weight: (c = 'currentColor') => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M3 5h10l-1 9H4L3 5z" stroke={c} strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M6 5a2 2 0 014 0" stroke={c} strokeWidth="1.4"/>
    </svg>
  ),
  paw: (c = 'currentColor') => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={c}>
      <ellipse cx="6" cy="9" rx="2" ry="2.6"/>
      <ellipse cx="11" cy="6.4" rx="2" ry="2.6"/>
      <ellipse cx="16.3" cy="7.6" rx="2" ry="2.6"/>
      <ellipse cx="20" cy="11.5" rx="1.8" ry="2.3"/>
      <path d="M12 11c-3.5 0-6.5 2.6-6.5 5.8 0 2 1.5 3.4 3.5 3.4 1.2 0 2.2-.6 3-.6s1.8.6 3 .6c2 0 3.5-1.4 3.5-3.4 0-3.2-3-5.8-6.5-5.8z"/>
    </svg>
  ),
  home: (c = 'currentColor', filled = false) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? c : 'none'}>
      <path d="M4 11l8-7 8 7v9h-5v-6h-6v6H4v-9z" stroke={c} strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  ),
  grid: (c = 'currentColor', filled = false) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="4" width="7" height="7" rx="1" stroke={c} strokeWidth="1.6" fill={filled ? c : 'none'}/>
      <rect x="13" y="4" width="7" height="7" rx="1" stroke={c} strokeWidth="1.6"/>
      <rect x="4" y="13" width="7" height="7" rx="1" stroke={c} strokeWidth="1.6"/>
      <rect x="13" y="13" width="7" height="7" rx="1" stroke={c} strokeWidth="1.6"/>
    </svg>
  ),
  tag: (c = 'currentColor') => (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
      <path d="M2 2h6l6 6-6 6-6-6V2z" stroke={c} strokeWidth="1.4" strokeLinejoin="round"/>
      <circle cx="5" cy="5" r="1" fill={c}/>
    </svg>
  ),
  close: (c = 'currentColor') => (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path d="M5 5l10 10M15 5L5 15" stroke={c} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
};

// Dog avatar — uses real photo, falls back to colored circle
function DogAvatar({ src, size = 40, ring = false }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size / 2,
      background: T.ink10, overflow: 'hidden',
      flexShrink: 0,
      boxShadow: ring ? `0 0 0 2px ${T.cream}, 0 0 0 3.5px ${T.terracotta}` : 'none',
      backgroundImage: src ? `url(${src})` : 'none',
      backgroundSize: 'cover', backgroundPosition: 'center',
    }} />
  );
}

// Metric chip — "柴犬", "9.5kg", etc
function MetaChip({ label, value, color = T.ink, dot = null, compact = false }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: compact ? 10.5 : 11.5, fontWeight: 500,
      color, lineHeight: 1, whiteSpace: 'nowrap',
    }}>
      {dot && <span style={{ width: 4, height: 4, borderRadius: 4, background: color, opacity: 0.5 }}/>}
      {label && <span style={{ opacity: 0.55, letterSpacing: '0.04em' }}>{label}</span>}
      <span style={{ fontFeatureSettings: '"tnum"' }}>{value}</span>
    </div>
  );
}

// Section heading — eyebrow + serif title
function SectionHeading({ eyebrow, title, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 20px' }}>
      <div>
        {eyebrow && <div style={{
          fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: T.ink50, marginBottom: 6, fontWeight: 500,
        }}>{eyebrow}</div>}
        <div style={{
          fontFamily: F.serif, fontSize: 24, fontWeight: 500,
          color: T.ink, letterSpacing: '-0.01em', lineHeight: 1.1,
        }}>{title}</div>
      </div>
      {action && <div style={{ fontSize: 12, color: T.ink50, paddingBottom: 4 }}>{action}</div>}
    </div>
  );
}

// Filter chip — pill button
function Chip({ children, active = false, color = T.ink, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '7px 13px', borderRadius: 999,
      border: `1px solid ${active ? color : T.hairlineStrong}`,
      background: active ? color : 'transparent',
      color: active ? T.paper : T.ink,
      fontSize: 12.5, fontWeight: 500, lineHeight: 1.2,
      cursor: 'pointer', whiteSpace: 'nowrap',
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontFamily: F.sans,
    }}>
      {children}
    </button>
  );
}

// Item tag pinned on photo — connects to point on garment
function ItemTag({ x, y, brand, item, side = 'right' }) {
  return (
    <div style={{
      position: 'absolute', left: `${x}%`, top: `${y}%`,
      transform: 'translate(-50%, -50%)', pointerEvents: 'none',
    }}>
      {/* Point dot */}
      <div style={{
        position: 'absolute', width: 10, height: 10, borderRadius: 10,
        background: T.paper, border: `2px solid ${T.ink}`,
        left: -5, top: -5,
        boxShadow: '0 0 0 4px rgba(31,26,20,0.15)',
      }}/>
      {/* Connector line */}
      <div style={{
        position: 'absolute',
        width: 22, height: 1, background: T.paper,
        left: side === 'right' ? 5 : -27,
        top: -0.5,
        opacity: 0.9,
      }}/>
      {/* Card */}
      <div style={{
        position: 'absolute',
        left: side === 'right' ? 27 : 'auto',
        right: side === 'right' ? 'auto' : 27,
        top: -16,
        background: T.paper,
        padding: '6px 10px 7px',
        borderRadius: 6,
        boxShadow: '0 2px 14px rgba(31,26,20,0.18)',
        whiteSpace: 'nowrap',
      }}>
        <div style={{
          fontSize: 8.5, letterSpacing: '0.14em', textTransform: 'uppercase',
          color: T.ink50, fontWeight: 600, marginBottom: 1,
        }}>{brand}</div>
        <div style={{
          fontSize: 11, fontWeight: 500, color: T.ink, lineHeight: 1.1,
        }}>{item}</div>
      </div>
    </div>
  );
}

// Bottom tab bar
function TabBar({ active = 'home' }) {
  const nav = useNav();
  const Tab = ({ k, label, icon, to }) => {
    const a = active === k;
    return (
      <div onClick={() => to && nav.go(to)} style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 4, color: a ? T.ink : T.ink50,
        cursor: to ? 'pointer' : 'default', padding: '2px 0',
      }}>
        {icon(a ? T.ink : T.ink50, a)}
        <div style={{ fontSize: 10, fontWeight: a ? 600 : 500, letterSpacing: '0.04em' }}>{label}</div>
      </div>
    );
  };
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      paddingTop: 12, paddingBottom: 28,
      background: T.paper,
      borderTop: `1px solid ${T.hairline}`,
      display: 'flex', alignItems: 'flex-start',
      zIndex: 5,
    }}>
      <Tab k="home" label="フィード" to="home" icon={(c, a) => Icons.home(c, a)}/>
      <Tab k="explore" label="さがす" to="explore" icon={(c) => Icons.search(c)}/>
      {/* Big center create button */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', marginTop: -22 }}>
        <div onClick={() => nav.go('new-post')} style={{
          width: 52, height: 52, borderRadius: 26,
          background: T.terracotta, color: T.paper,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 6px 18px rgba(185,90,61,0.35), 0 0 0 4px ' + T.paper,
          cursor: 'pointer',
        }}>
          {Icons.plus(T.paper)}
        </div>
      </div>
      <Tab k="notifications" label="お知らせ" to="notifications" icon={(c) => Icons.bookmark(c)}/>
      <Tab k="profile" label="マイわん" to="my-profile" icon={(c) => Icons.user(c)}/>
    </div>
  );
}

// Home indicator
function HomeBar() {
  return (
    <div style={{
      position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
      width: 134, height: 5, borderRadius: 3, background: T.ink, opacity: 0.85, zIndex: 10,
    }}/>
  );
}

// Top app bar — back arrow + center title + trailing action
function AppBar({ title, eyebrow, leading = 'back', trailing, bg = 'transparent', dense = false, onLeading }) {
  const nav = useNav();
  const handleLeading = onLeading || (() => nav.back());
  return (
    <div style={{
      padding: dense ? '4px 16px 10px' : '4px 16px 16px',
      background: bg,
      display: 'flex', alignItems: 'center', gap: 12,
      position: 'relative', zIndex: 4,
    }}>
      {leading === 'back' && <IconBtn onClick={handleLeading}>{Icons.back()}</IconBtn>}
      {leading === 'close' && <IconBtn onClick={handleLeading}>{Icons.close()}</IconBtn>}
      {leading === null && <div style={{ width: 40 }}/>}
      <div style={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
        {eyebrow && <div style={{
          fontSize: 9.5, letterSpacing: '0.2em', textTransform: 'uppercase',
          color: T.ink50, fontWeight: 500, marginBottom: 2,
        }}>{eyebrow}</div>}
        <div style={{
          fontSize: 14, fontWeight: 600, color: T.ink,
          letterSpacing: '0.01em',
        }}>{title}</div>
      </div>
      {trailing || <div style={{ width: 40 }}/>}
    </div>
  );
}

// Form text field
function TextField({ label, placeholder, value, suffix, hint, required = false, multiline = false, rows = 3 }) {
  return (
    <div>
      {label && (
        <div style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          marginBottom: 6,
        }}>
          <div style={{
            fontSize: 11.5, fontWeight: 500, color: T.ink, letterSpacing: '0.02em',
          }}>
            {label}
            {required && <span style={{ color: T.terracotta, marginLeft: 4 }}>*</span>}
          </div>
          {hint && <div style={{ fontSize: 10, color: T.ink50 }}>{hint}</div>}
        </div>
      )}
      <div style={{
        background: T.paper, borderRadius: 12,
        border: `1px solid ${T.hairline}`,
        padding: multiline ? '12px 14px' : '0 14px',
        height: multiline ? 'auto' : 46,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        {multiline ? (
          <div style={{
            flex: 1, fontSize: 13.5, color: value ? T.ink : T.ink30,
            lineHeight: 1.55, fontFamily: F.sans,
            minHeight: rows * 20,
          }}>{value || placeholder}</div>
        ) : (
          <div style={{
            flex: 1, fontSize: 14, color: value ? T.ink : T.ink30,
            fontFamily: F.sans,
          }}>{value || placeholder}</div>
        )}
        {suffix && <div style={{
          fontSize: 11, color: T.ink50, fontFamily: F.mono,
        }}>{suffix}</div>}
      </div>
    </div>
  );
}

// Select / dropdown row
function SelectField({ label, value, placeholder, required = false }) {
  return (
    <div>
      {label && (
        <div style={{
          fontSize: 11.5, fontWeight: 500, color: T.ink, letterSpacing: '0.02em',
          marginBottom: 6,
        }}>
          {label}
          {required && <span style={{ color: T.terracotta, marginLeft: 4 }}>*</span>}
        </div>
      )}
      <div style={{
        background: T.paper, borderRadius: 12,
        border: `1px solid ${T.hairline}`,
        padding: '0 14px', height: 46,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div style={{
          flex: 1, fontSize: 14, color: value ? T.ink : T.ink30,
        }}>{value || placeholder}</div>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M4 6l4 4 4-4" stroke={T.ink50} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}

// Primary CTA
function PrimaryButton({ children, color = T.ink, fg = T.cream, full = false, icon, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: full ? '100%' : 'auto',
      padding: '14px 22px', borderRadius: 999,
      background: color, color: fg,
      fontSize: 13.5, fontWeight: 600, fontFamily: F.sans,
      border: 'none', cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      letterSpacing: '0.02em',
    }}>
      {children}
      {icon}
    </button>
  );
}

// List row — generic settings-style row
function ListRow({ icon, label, detail, sub, chevron = true, last = false }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 16px',
      borderBottom: last ? 'none' : `1px solid ${T.hairline}`,
    }}>
      {icon && (
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: T.cream,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {icon}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, color: T.ink, fontWeight: 500 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: T.ink50, marginTop: 2 }}>{sub}</div>}
      </div>
      {detail && <div style={{ fontSize: 12, color: T.ink50 }}>{detail}</div>}
      {chevron && (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M6 4l4 4-4 4" stroke={T.ink30} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
  );
}

Object.assign(window, {
  Screen, StatusBar, Logo, IconBtn, Icons,
  DogAvatar, MetaChip, SectionHeading, Chip, ItemTag, TabBar, HomeBar,
  AppBar, TextField, SelectField, PrimaryButton, ListRow,
});
