// Notifications + Search results

// ─── NOTIFICATIONS ──────────────────────────────────────────
function NotificationsScreen() {
  const T = WS_TOKENS, F = WS_FONTS, P = WS_PHOTOS;
  const nav = useNav();

  const NotifRow = ({ icon, color, who, what, time, thumb, action, target = 'detail' }) => (
    <div onClick={() => nav.go(target)} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 20px', cursor: 'pointer',
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 19,
        background: T.paper,
        border: `1px solid ${T.hairline}`,
        position: 'relative', flexShrink: 0,
      }}>
        <div style={{
          width: '100%', height: '100%', borderRadius: 19,
          background: who.bg ? `url(${who.bg}) center/cover` : T.cream,
        }}/>
        <div style={{
          position: 'absolute', bottom: -3, right: -3,
          width: 18, height: 18, borderRadius: 9,
          background: color, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `2px solid ${T.cream}`,
        }}>
          {icon}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, color: T.ink, lineHeight: 1.5 }}>
          <span style={{ fontWeight: 600 }}>{who.name}</span>
          <span style={{ color: T.ink70 }}> {what}</span>
        </div>
        <div style={{ fontSize: 10, color: T.ink50, marginTop: 3, fontFamily: F.mono }}>{time}</div>
      </div>
      {thumb && (
        <div style={{
          width: 40, height: 40, borderRadius: 8,
          background: `url(${thumb}) center/cover`, flexShrink: 0,
        }}/>
      )}
      {action && (
        <button style={{
          padding: '6px 12px', borderRadius: 999,
          background: T.ink, color: T.cream, border: 'none',
          fontSize: 11, fontWeight: 600, flexShrink: 0,
        }}>{action}</button>
      )}
    </div>
  );

  return (
    <Screen bg={T.cream}>
      <StatusBar/>
      <div style={{ padding: '8px 20px 4px' }}>
        <div style={{
          fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
          color: T.ink50, fontWeight: 500,
        }}>Notifications · 8 new</div>
        <div style={{
          fontFamily: F.serif, fontSize: 28, fontWeight: 500,
          color: T.ink, lineHeight: 1, marginTop: 4, letterSpacing: '-0.01em',
        }}>お知らせ</div>
      </div>

      {/* Tab toggle */}
      <div style={{
        padding: '14px 20px 8px', display: 'flex', gap: 6,
      }}>
        <Chip active color={T.ink}>すべて</Chip>
        <Chip>
          <span style={{
            background: T.terracotta, color: '#fff',
            width: 14, height: 14, borderRadius: 7,
            fontSize: 8.5, fontWeight: 700,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>8</span>
          未読
        </Chip>
        <Chip>いいね</Chip>
        <Chip>コメント</Chip>
        <Chip>フォロー</Chip>
      </div>

      <div style={{
        position: 'absolute', top: 152, bottom: 84, left: 0, right: 0,
        overflowY: 'auto',
      }}>
        {/* Today */}
        <SectionLabel label="今日"/>
        <div style={{ position: 'relative', background: 'rgba(185,90,61,0.04)' }}>
          <NotifRow
            icon={<svg width="10" height="10" viewBox="0 0 12 12" fill="#fff"><path d="M6 11s-4-2.5-4-5.5C2 4 3 3 4.3 3c.9 0 1.4.5 1.7 1 .3-.5.8-1 1.7-1C9 3 10 4 10 5.5 10 8.5 6 11 6 11z"/></svg>}
            color={T.terracotta}
            who={{ name: 'Mio', bg: P.yorkie }}
            what="と他14名がエマのスナップにいいねしました"
            time="5分前"
            thumb={P.shibaPark}
          />
          <NotifRow
            icon={<svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 3h8v5H6L4 9.5V8H2V3z" fill="#fff"/></svg>}
            color={T.forest}
            who={{ name: 'tomato.thecorg', bg: P.corgi }}
            what={'がコメントしました：「リネンバンダナどこのですか？✨」'}
            time="12分前"
            thumb={P.shibaPark}
          />
          <NotifRow
            icon={<svg width="10" height="10" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="4.5" r="2" fill="#fff"/><path d="M2 11c.5-2 2-3 4-3s3.5 1 4 3" stroke="#fff" strokeWidth="1.4"/></svg>}
            color={T.ochre}
            who={{ name: 'biscuit.theyork', bg: P.yorkie }}
            what="があなたをフォローしました"
            time="1時間前"
            action="フォロー"
          />
        </div>

        <SectionLabel label="今週"/>
        <NotifRow
          icon={<svg width="10" height="10" viewBox="0 0 12 12" fill="#fff"><path d="M6 11s-4-2.5-4-5.5C2 4 3 3 4.3 3c.9 0 1.4.5 1.7 1 .3-.5.8-1 1.7-1C9 3 10 4 10 5.5 10 8.5 6 11 6 11z"/></svg>}
          color={T.terracotta}
          who={{ name: 'mochi.thefrenchie', bg: P.frenchie }}
          what="がエマのスナップを保存しました"
          time="昨日"
          thumb={P.shibaPort}
        />
        <NotifRow
          icon={<svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M3 6h6M3 3h6M3 9h6" stroke="#fff" strokeWidth="1.4" strokeLinecap="round"/></svg>}
          color={T.ink}
          who={{ name: 'Wan-Snap', bg: null }}
          what="エマの似たサイズの新着スナップが3件あります"
          time="2日前"
        />
        <NotifRow
          icon={<svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 3h8v5H6L4 9.5V8H2V3z" fill="#fff"/></svg>}
          color={T.forest}
          who={{ name: 'tofu.poodle', bg: P.poodle }}
          what={'がコメントしました：「うちもこれ気になってました！」'}
          time="3日前"
          thumb={P.shibaPark}
        />

        <SectionLabel label="今月"/>
        <NotifRow
          icon={<svg width="10" height="10" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="4.5" r="2" fill="#fff"/><path d="M2 11c.5-2 2-3 4-3s3.5 1 4 3" stroke="#fff" strokeWidth="1.4"/></svg>}
          color={T.ochre}
          who={{ name: 'shiba.gallery', bg: P.shibaPort }}
          what="と他23名があなたをフォローしました"
          time="先週"
        />
      </div>

      <TabBar active="explore"/>
      <HomeBar/>
    </Screen>
  );
}

function SectionLabel({ label }) {
  const T = WS_TOKENS;
  return (
    <div style={{
      padding: '14px 20px 6px',
      fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
      color: T.ink50, fontWeight: 500,
    }}>{label}</div>
  );
}

// ─── SEARCH RESULTS ─────────────────────────────────────────
function SearchResultsScreen() {
  const T = WS_TOKENS, F = WS_FONTS, P = WS_PHOTOS;
  const nav = useNav();

  return (
    <Screen bg={T.cream}>
      <StatusBar/>
      <div style={{
        padding: '4px 20px 12px', display: 'flex',
        alignItems: 'center', gap: 10,
      }}>
        <IconBtn onClick={() => nav.back()}>{Icons.back()}</IconBtn>
        <div onClick={() => nav.go('search-modal')} style={{
          flex: 1, background: T.paper, borderRadius: 999,
          border: `1px solid ${T.hairline}`,
          padding: '8px 14px', display: 'flex',
          alignItems: 'center', gap: 8, cursor: 'pointer',
        }}>
          {Icons.search(T.ink50)}
          <input
            readOnly value="柴犬 バンダナ"
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontSize: 13, color: T.ink, fontFamily: F.sans,
            }}/>
          <div style={{
            width: 18, height: 18, borderRadius: 9, background: T.ink10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{Icons.close(T.ink70)}</div>
        </div>
      </div>

      {/* Active filter chips */}
      <div style={{
        display: 'flex', gap: 6, padding: '0 20px 12px',
        overflowX: 'auto', alignItems: 'center',
      }}>
        <div style={{
          padding: '6px 11px', borderRadius: 999,
          background: T.ink, color: T.cream,
          fontSize: 11, fontWeight: 500,
          display: 'inline-flex', alignItems: 'center', gap: 5,
          whiteSpace: 'nowrap',
        }}>
          柴犬
          {Icons.close(T.cream)}
        </div>
        <div style={{
          padding: '6px 11px', borderRadius: 999,
          background: T.ink, color: T.cream,
          fontSize: 11, fontWeight: 500,
          display: 'inline-flex', alignItems: 'center', gap: 5,
          whiteSpace: 'nowrap',
        }}>
          8–10kg
          {Icons.close(T.cream)}
        </div>
        <div style={{
          padding: '6px 11px', borderRadius: 999,
          background: T.ink, color: T.cream,
          fontSize: 11, fontWeight: 500,
          display: 'inline-flex', alignItems: 'center', gap: 5,
          whiteSpace: 'nowrap',
        }}>
          バンダナ
          {Icons.close(T.cream)}
        </div>
        <Chip>+ 絞り込み</Chip>
      </div>

      {/* Result count + sort */}
      <div style={{
        padding: '4px 20px 14px', display: 'flex',
        alignItems: 'baseline', justifyContent: 'space-between',
      }}>
        <div>
          <span style={{
            fontFamily: F.serif, fontSize: 22, fontWeight: 500, color: T.ink,
          }}>284</span>
          <span style={{ fontSize: 12, color: T.ink50, marginLeft: 6 }}>件のスナップ</span>
        </div>
        <button style={{
          background: 'transparent', border: 'none',
          fontSize: 12, color: T.ink70, fontFamily: F.sans,
          display: 'inline-flex', alignItems: 'center', gap: 4,
        }}>
          人気順
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Top brands quick row */}
      <div style={{ padding: '0 20px 14px' }}>
        <div style={{
          fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
          color: T.ink50, fontWeight: 500, marginBottom: 8,
        }}>関連ブランド</div>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
          {['TRUE LOVE', 'Maison Bowwow', 'Mandarine', 'iDog', 'PETIO'].map((b, i) => (
            <div key={b} style={{
              padding: '6px 11px', borderRadius: 7,
              background: T.paper, border: `1px solid ${T.hairline}`,
              fontSize: 10.5, color: T.ink, fontWeight: 500,
              letterSpacing: '0.06em', whiteSpace: 'nowrap',
            }}>{b} <span style={{ color: T.ink50, fontFamily: F.mono, marginLeft: 4 }}>{[42,28,14,11,8][i]}</span></div>
          ))}
        </div>
      </div>

      {/* Result grid — 3-col with mixed heights */}
      <div style={{
        position: 'absolute', top: 232, bottom: 84, left: 0, right: 0,
        overflowY: 'auto', padding: '0 20px 20px',
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8,
        }}>
          {[
            { src: P.shibaPark, dog: 'エマ', breed: '柴犬 9.5kg', brand: 'TRUE LOVE', tall: true },
            { src: P.shibaPort, dog: 'モチ', breed: '柴犬 10.2kg', brand: 'Mandarine', tall: false },
            { src: P.shibaPort, dog: 'クロ', breed: '柴犬 8.8kg', brand: 'iDog', tall: false },
            { src: P.shibaPark, dog: 'ハナ', breed: '柴犬 9.0kg', brand: 'Maison Bowwow', tall: true },
            { src: P.shibaPark, dog: 'まめ', breed: '豆柴 6.5kg', brand: 'TRUE LOVE', tall: false },
            { src: P.shibaPort, dog: 'コタ', breed: '柴犬 11.2kg', brand: 'PETIO', tall: false },
          ].map((it, i) => (
            <div key={i} onClick={() => nav.go('detail')} style={{
              background: T.paper, borderRadius: 12,
              border: `1px solid ${T.hairline}`,
              overflow: 'hidden', cursor: 'pointer',
            }}>
              <div style={{
                width: '100%', aspectRatio: it.tall ? '3/4' : '1',
                background: `url(${it.src}) center/cover`,
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', bottom: 6, left: 6,
                  padding: '3px 7px', borderRadius: 5,
                  background: 'rgba(255,254,251,0.92)',
                  backdropFilter: 'blur(8px)',
                  fontSize: 9, fontWeight: 600,
                  letterSpacing: '0.08em',
                  color: T.ink,
                }}>{it.brand}</div>
              </div>
              <div style={{ padding: '8px 10px 10px' }}>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: T.ink }}>{it.dog}</div>
                <div style={{
                  fontSize: 9.5, color: T.ink50, fontFamily: F.mono, marginTop: 2,
                }}>{it.breed}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TabBar active="explore"/>
      <HomeBar/>
    </Screen>
  );
}

Object.assign(window, { NotificationsScreen, SearchResultsScreen, SectionLabel });
