// Post creation + editing flow

function NewPostScreen() {
  const T = WS_TOKENS, F = WS_FONTS, P = WS_PHOTOS;
  const nav = useNav();
  return (
    <Screen bg={T.cream}>
      <StatusBar/>
      <AppBar
        title="新しいスナップ"
        leading="close"
        trailing={
          <button onClick={() => nav.reset('home')} style={{
            padding: '7px 14px', borderRadius: 999,
            background: T.ink, color: T.cream,
            fontSize: 12, fontWeight: 600, border: 'none', fontFamily: F.sans,
            cursor: 'pointer',
          }}>投稿</button>
        }
      />

      <div style={{
        position: 'absolute', top: 100, bottom: 28, left: 0, right: 0,
        overflowY: 'auto', padding: '0 20px',
      }}>
        {/* Photo with tag-add interaction */}
        <div style={{
          width: '100%', aspectRatio: '4 / 5',
          borderRadius: 18, overflow: 'hidden', position: 'relative',
          background: T.ink10,
        }}>
          <img src={P.shibaPark} style={{
            width: '100%', height: '100%', objectFit: 'cover', display: 'block',
          }}/>

          {/* Existing tag */}
          <ItemTag x={50} y={64} brand="TRUE LOVE" item="リネンバンダナ" side="right"/>

          {/* Tag being added — dashed picker */}
          <div style={{
            position: 'absolute', left: '47%', top: '78%',
            transform: 'translate(-50%, -50%)',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 18,
              background: 'rgba(255,254,251,0.85)',
              backdropFilter: 'blur(8px)',
              border: `2px dashed ${T.terracotta}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: T.terracotta,
            }}>
              {Icons.plus(T.terracotta)}
            </div>
            <div style={{
              position: 'absolute', top: -28, left: '50%',
              transform: 'translateX(-50%)',
              padding: '4px 8px', borderRadius: 6,
              background: T.terracotta, color: '#fff',
              fontSize: 10, fontWeight: 500, whiteSpace: 'nowrap',
            }}>タップしてタグ付け</div>
          </div>

          {/* Thumbnail strip — multi-photo */}
          <div style={{
            position: 'absolute', bottom: 12, left: 12,
            display: 'flex', gap: 6,
          }}>
            {[P.shibaPark, P.shibaPort, null].map((src, i) => (
              <div key={i} style={{
                width: 44, height: 44, borderRadius: 8,
                border: i === 0 ? `2px solid #fff` : `1px solid rgba(255,255,255,0.4)`,
                background: src ? `url(${src}) center/cover` : 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: src ? 'none' : 'blur(8px)',
                color: '#fff',
              }}>
                {!src && Icons.plus('#fff')}
              </div>
            ))}
          </div>

          {/* Floating tag count */}
          <div style={{
            position: 'absolute', top: 12, right: 12,
            padding: '6px 10px', borderRadius: 999,
            background: 'rgba(31,26,20,0.65)',
            color: '#fff', fontSize: 10.5, fontWeight: 500,
            display: 'inline-flex', alignItems: 'center', gap: 5,
            backdropFilter: 'blur(8px)',
          }}>
            {Icons.tag('#fff')}
            1 / 5 タグ
          </div>
        </div>

        {/* Caption */}
        <div style={{ marginTop: 18 }}>
          <TextField
            label="キャプション"
            value="新宿中央公園で初めてのバンダナデビュー🌿 リネン素材だから夏でも蒸れないし、首回りもゆとりあって◎"
            multiline rows={3}
            hint="142 / 500"
          />
        </div>

        {/* Dog selector */}
        <div style={{ marginTop: 16 }}>
          <div style={{
            fontSize: 11.5, fontWeight: 500, color: T.ink, marginBottom: 6,
          }}>愛犬 <span style={{ color: T.terracotta }}>*</span></div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '2px 0' }}>
            <DogChip name="エマ" breed="柴犬" src={P.shibaPort} active/>
            <DogChip name="モカ" breed="ヨーキー" src={P.yorkie}/>
            <DogChip name="+ 新しい愛犬" placeholder/>
          </div>
        </div>

        {/* Location + advanced */}
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 0,
          background: T.paper, borderRadius: 14, border: `1px solid ${T.hairline}`,
          overflow: 'hidden',
        }}>
          <ListRow
            icon={<svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M10 17s-5-5-5-9a5 5 0 0110 0c0 4-5 9-5 9z" stroke={T.ink70} strokeWidth="1.5"/>
              <circle cx="10" cy="8" r="2" stroke={T.ink70} strokeWidth="1.5"/>
            </svg>}
            label="場所"
            detail="新宿中央公園"
          />
          <ListRow
            icon={<svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="7" stroke={T.ink70} strokeWidth="1.5"/>
              <circle cx="10" cy="10" r="2.5" stroke={T.ink70} strokeWidth="1.5"/>
            </svg>}
            label="サイズ感"
            detail="少しゆとり"
          />
          <ListRow
            icon={<svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="3" width="14" height="14" rx="3" stroke={T.ink70} strokeWidth="1.5"/>
              <circle cx="13" cy="7" r="1.5" fill={T.ink70}/>
            </svg>}
            label="公開範囲"
            detail="全員に公開"
            last
          />
        </div>
      </div>
      <HomeBar/>
    </Screen>
  );
}

function DogChip({ name, breed, src, active = false, placeholder = false }) {
  const T = WS_TOKENS, F = WS_FONTS;
  if (placeholder) return (
    <div style={{
      padding: '8px 12px 8px 8px', borderRadius: 999,
      border: `1px dashed ${T.hairlineStrong}`,
      display: 'flex', alignItems: 'center', gap: 8,
      color: T.ink50, fontSize: 12, whiteSpace: 'nowrap', flexShrink: 0,
    }}>{name}</div>
  );
  return (
    <div style={{
      padding: '4px 12px 4px 4px', borderRadius: 999,
      background: active ? T.ink : T.paper,
      color: active ? T.cream : T.ink,
      border: `1px solid ${active ? T.ink : T.hairline}`,
      display: 'flex', alignItems: 'center', gap: 8,
      whiteSpace: 'nowrap', flexShrink: 0,
    }}>
      <DogAvatar src={src} size={28}/>
      <span style={{ fontSize: 12.5, fontWeight: 600 }}>{name}</span>
      <span style={{ fontSize: 10, opacity: 0.6 }}>{breed}</span>
    </div>
  );
}

function EditPostScreen() {
  const T = WS_TOKENS, F = WS_FONTS, P = WS_PHOTOS;
  const nav = useNav();
  return (
    <Screen bg={T.creamSoft}>
      <StatusBar/>
      <AppBar
        title="スナップを編集"
        trailing={
          <button onClick={() => nav.back()} style={{
            padding: '7px 14px', borderRadius: 999,
            background: T.ink, color: T.cream,
            fontSize: 12, fontWeight: 600, border: 'none', fontFamily: F.sans,
            cursor: 'pointer',
          }}>保存</button>
        }
      />

      <div style={{
        position: 'absolute', top: 100, bottom: 28, left: 0, right: 0,
        overflowY: 'auto', padding: '0 20px 20px',
      }}>
        {/* Compact photo preview */}
        <div style={{
          display: 'flex', gap: 12, alignItems: 'center',
          background: T.paper, padding: 12, borderRadius: 14,
          border: `1px solid ${T.hairline}`, marginBottom: 20,
        }}>
          <div style={{
            width: 64, height: 80, borderRadius: 10, overflow: 'hidden',
            background: T.ink10,
          }}>
            <img src={P.shibaPark} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase',
              color: T.ink50, fontWeight: 500,
            }}>公開済み · 11分前</div>
            <div style={{
              fontSize: 13, fontWeight: 500, color: T.ink, marginTop: 4, lineHeight: 1.4,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>新宿中央公園で初めてのバンダナデビュー🌿 リネン素材だから夏でも蒸れないし、首回りもゆとりあって◎</div>
            <div style={{
              fontSize: 10.5, color: T.ink50, marginTop: 6,
              fontFamily: F.mono,
            }}>♥ 428 · 💬 34 · ✓ 62</div>
          </div>
        </div>

        <TextField
          label="キャプション"
          value="新宿中央公園で初めてのバンダナデビュー🌿 リネン素材だから夏でも蒸れないし、首回りもゆとりあって◎"
          multiline rows={3}
          hint="142 / 500"
        />

        {/* Tagged items list */}
        <div style={{ marginTop: 20 }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 8,
          }}>
            <div style={{
              fontSize: 11.5, fontWeight: 500, color: T.ink, letterSpacing: '0.02em',
            }}>着用アイテム <span style={{ color: T.ink50, fontWeight: 400 }}>· 2</span></div>
            <button style={{
              background: 'transparent', border: 'none', color: T.terracotta,
              fontSize: 11, fontWeight: 500, padding: 0,
            }}>+ 追加</button>
          </div>

          {[
            { brand: 'TRUE LOVE', item: 'リネンバンダナ', size: 'S', fit: '少しゆとり', c: T.terracotta },
            { brand: 'Mandarine Bros.', item: 'ライトパピーハーネス', size: 'XS', fit: 'ジャスト', c: T.forest },
          ].map((t, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: T.paper, borderRadius: 12, padding: 12, marginBottom: 8,
              border: `1px solid ${T.hairline}`,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 8,
                background: T.cream, position: 'relative',
                border: `1px solid ${T.hairline}`,
              }}>
                <div style={{
                  position: 'absolute', top: 6, left: 6,
                  width: 6, height: 6, borderRadius: 6, background: t.c,
                }}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: T.ink50, fontWeight: 600,
                }}>{t.brand}</div>
                <div style={{
                  fontSize: 12.5, fontWeight: 500, color: T.ink, marginTop: 2,
                }}>{t.item}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 3, fontSize: 10, color: T.ink70 }}>
                  <span>{t.size}</span>
                  <span style={{ color: T.ink30 }}>·</span>
                  <span style={{ color: t.c }}>{t.fit}</span>
                </div>
              </div>
              <button style={{
                width: 28, height: 28, borderRadius: 7,
                background: 'transparent', border: `1px solid ${T.hairlineStrong}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: T.ink50,
              }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 3h10M4 3V1.5h4V3M3 3l.8 8h4.4l.8-8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Danger zone */}
        <div style={{ marginTop: 24, padding: '16px 14px', borderRadius: 12,
          background: 'rgba(185,90,61,0.06)',
          border: `1px solid rgba(185,90,61,0.18)`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: T.terracotta }}>スナップを削除</div>
              <div style={{ fontSize: 10.5, color: T.ink70, marginTop: 3 }}>この操作は取り消せません</div>
            </div>
            <button style={{
              padding: '8px 14px', borderRadius: 999,
              background: 'transparent', color: T.terracotta,
              border: `1px solid ${T.terracotta}`,
              fontSize: 11, fontWeight: 500, fontFamily: F.sans,
            }}>削除</button>
          </div>
        </div>
      </div>
      <HomeBar/>
    </Screen>
  );
}

Object.assign(window, { NewPostScreen, EditPostScreen, DogChip });
