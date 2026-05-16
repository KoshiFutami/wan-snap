// Screen: Dog Profile — Pet info + snaps gallery

function ProfileScreen() {
  const T = WS_TOKENS, F = WS_FONTS, P = WS_PHOTOS;
  const nav = useNav();

  return (
    <Screen bg={T.cream}>
      <StatusBar/>

      {/* Floating header */}
      <div style={{
        position: 'absolute', top: 54, left: 0, right: 0, zIndex: 10,
        padding: '0 16px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        <IconBtn onClick={() => nav.back()}>{Icons.back()}</IconBtn>
        <IconBtn onClick={() => nav.go('edit-dog')}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <circle cx="4" cy="10" r="1.4" fill={T.ink}/>
            <circle cx="10" cy="10" r="1.4" fill={T.ink}/>
            <circle cx="16" cy="10" r="1.4" fill={T.ink}/>
          </svg>
        </IconBtn>
      </div>

      {/* Scroll content */}
      <div style={{
        position: 'absolute', top: 54, left: 0, right: 0, bottom: 84,
        overflowY: 'auto',
      }}>
        {/* Hero portrait */}
        <div style={{
          position: 'relative', width: '100%', height: 340,
          marginTop: 48,
          padding: '0 20px',
        }}>
          <div style={{
            width: '100%', height: '100%', borderRadius: 24,
            backgroundImage: `url(${P.shibaPort})`,
            backgroundSize: 'cover', backgroundPosition: 'center 30%',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Caption pill at top */}
            <div style={{
              position: 'absolute', top: 14, left: 14,
              padding: '6px 10px', borderRadius: 999,
              background: 'rgba(255,254,251,0.92)',
              backdropFilter: 'blur(10px)',
              fontSize: 10.5, fontWeight: 500, color: T.ink,
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: 5, background: T.forest }}/>
              アクティブ
            </div>
          </div>
        </div>

        {/* Name + identity */}
        <div style={{ padding: '20px 20px 0' }}>
          <div style={{
            fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
            color: T.ink50, fontWeight: 500, marginBottom: 6,
          }}>こうしの愛犬 · #014</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <div style={{
              fontFamily: F.serif, fontSize: 42, fontWeight: 500,
              color: T.ink, letterSpacing: '-0.02em', lineHeight: 0.95,
            }}>エマ</div>
            <div style={{
              fontFamily: F.serif, fontSize: 18, fontWeight: 400,
              color: T.ink50, letterSpacing: '-0.005em',
              fontStyle: 'italic',
            }}>Ema</div>
          </div>
          <div style={{
            fontSize: 12.5, color: T.ink70, marginTop: 8, lineHeight: 1.55,
          }}>新宿在住 · 朝はいつも代々木公園を散歩。少しゆとりのある服が好み。</div>
        </div>

        {/* Stats row */}
        <div style={{
          margin: '20px 20px 0',
          padding: '16px 4px',
          background: T.paper,
          borderRadius: 18,
          border: `1px solid ${T.hairline}`,
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr',
        }}>
          <Stat first label="犬種" value="柴犬" sub="赤"/>
          <Stat label="体重" value="9.5" unit="kg" sub="標準"/>
          <Stat label="胴囲" value="48" unit="cm" sub="M"/>
          <Stat label="年齢" value="2" unit="y4m" sub="若犬"/>
        </div>

        {/* Section header */}
        <div style={{
          padding: '28px 20px 16px',
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{
              fontFamily: F.serif, fontSize: 20, fontWeight: 500,
              color: T.ink, letterSpacing: '-0.01em', lineHeight: 1,
            }}>これまでのスナップ</div>
            <div style={{ fontSize: 11, color: T.ink50, marginTop: 4 }}>
              <span style={{ fontFamily: F.mono }}>87</span>枚 ·
              <span style={{ fontFamily: F.mono, marginLeft: 4 }}>12</span>ブランド
            </div>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <div style={{
              padding: 6, borderRadius: 8, background: T.ink, color: T.cream,
            }}>{Icons.grid(T.cream, true)}</div>
            <div style={{
              padding: 6, borderRadius: 8, color: T.ink50,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="4" width="16" height="6" rx="1" stroke="currentColor" strokeWidth="1.6"/>
                <rect x="4" y="14" width="16" height="6" rx="1" stroke="currentColor" strokeWidth="1.6"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Snap grid */}
        <div style={{
          padding: '0 20px 24px',
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4,
        }}>
          {[
            P.shibaPark, P.shibaPort, P.shibaPark,
            P.shibaPort, P.shibaPark, P.shibaPort,
            P.shibaPark, P.shibaPort, P.shibaPark,
          ].map((src, i) => (
            <div key={i} onClick={() => nav.go('detail')} style={{
              aspectRatio: '1', borderRadius: 4, overflow: 'hidden',
              position: 'relative', background: T.ink10, cursor: 'pointer',
            }}>
              <img src={src} style={{
                width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                filter: i % 4 === 2 ? 'grayscale(0.1)' : 'none',
              }}/>
              {i % 3 === 1 && (
                <div style={{
                  position: 'absolute', top: 5, right: 5,
                  padding: '2px 5px', borderRadius: 999,
                  background: 'rgba(31,26,20,0.6)',
                  fontSize: 9, color: '#fff', fontFamily: WS_FONTS.mono,
                }}>×{2 + i % 3}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <TabBar active="profile"/>
      <HomeBar/>
    </Screen>
  );
}

function Stat({ label, value, unit, sub, first = false }) {
  const T = WS_TOKENS, F = WS_FONTS;
  return (
    <div style={{
      padding: '4px 8px',
      borderLeft: first ? 'none' : `1px solid ${T.hairline}`,
      textAlign: 'center',
    }}>
      <div style={{
        fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase',
        color: T.ink50, fontWeight: 500, marginBottom: 4,
      }}>{label}</div>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 2,
      }}>
        <div style={{
          fontFamily: F.serif, fontSize: 20, fontWeight: 500,
          color: T.ink, letterSpacing: '-0.01em', lineHeight: 1,
        }}>{value}</div>
        {unit && <div style={{
          fontSize: 10, color: T.ink50, fontFamily: F.mono,
        }}>{unit}</div>}
      </div>
      <div style={{
        fontSize: 9.5, color: T.terracotta, marginTop: 3, fontWeight: 500,
      }}>{sub}</div>
    </div>
  );
}

Object.assign(window, { ProfileScreen });
