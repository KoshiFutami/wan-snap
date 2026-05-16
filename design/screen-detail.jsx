// Screen: Post Detail — Full snap with item breakdown

function DetailScreen() {
  const T = WS_TOKENS, F = WS_FONTS, P = WS_PHOTOS;
  const nav = useNav();

  return (
    <Screen bg={T.paper}>
      <StatusBar/>

      {/* Floating header */}
      <div style={{
        position: 'absolute', top: 54, left: 0, right: 0, zIndex: 10,
        padding: '0 16px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        <IconBtn>{Icons.back()}</IconBtn>
        <div style={{ display: 'flex', gap: 8 }}>
          <IconBtn>{Icons.share()}</IconBtn>
          <IconBtn>{Icons.bookmark()}</IconBtn>
        </div>
      </div>

      <div style={{
        position: 'absolute', top: 102, left: 0, right: 0, bottom: 82,
        overflowY: 'auto',
      }}>
        {/* Big photo */}
        <div style={{
          position: 'relative', margin: '0 20px', borderRadius: 20,
          overflow: 'hidden', aspectRatio: '4 / 5',
          background: T.ink10,
        }}>
          <img src={P.shibaPark} style={{
            width: '100%', height: '100%', objectFit: 'cover', display: 'block',
          }}/>
          <ItemTag x={50} y={64} brand="TRUE LOVE" item="リネンバンダナ" side="right"/>
          <ItemTag x={47} y={78} brand="Mandarine Bros." item="パピーハーネス" side="left"/>

          {/* Pagination dots */}
          <div style={{
            position: 'absolute', bottom: 12, left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', gap: 4,
          }}>
            <span style={{ width: 16, height: 4, borderRadius: 4, background: '#fff' }}/>
            <span style={{ width: 4, height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.5)' }}/>
            <span style={{ width: 4, height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.5)' }}/>
          </div>
        </div>

        {/* Owner + dog info row */}
        <div onClick={() => nav.go('other-profile')} style={{
          padding: '18px 20px 14px', display: 'flex',
          alignItems: 'center', gap: 12, cursor: 'pointer',
        }}>
          <DogAvatar src={P.shibaPort} size={44}/>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <div style={{
                fontFamily: F.serif, fontSize: 18, fontWeight: 500,
                color: T.ink, lineHeight: 1,
              }}>エマ</div>
              <div style={{ fontSize: 11, color: T.ink50 }}>@koushi_to_ema</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 5 }}>
              <span style={{
                padding: '2px 7px', borderRadius: 4,
                background: T.cream, fontSize: 10, color: T.ink,
              }}>柴犬</span>
              <span style={{ fontSize: 10.5, color: T.ink50 }}>赤 · ♀</span>
              <span style={{ width: 2, height: 2, borderRadius: 2, background: T.ink30 }}/>
              <span style={{
                fontSize: 10.5, color: T.ink,
                fontFamily: F.mono, fontWeight: 500,
              }}>9.5kg · 胴囲48cm</span>
            </div>
          </div>
          <button style={{
            padding: '8px 14px', borderRadius: 999,
            background: T.ink, color: T.cream,
            fontSize: 11, fontWeight: 600, border: 'none',
            fontFamily: F.sans,
          }}>フォロー</button>
        </div>

        {/* Caption */}
        <div style={{
          padding: '0 20px 18px',
          fontSize: 13, lineHeight: 1.6, color: T.ink,
        }}>
          新宿中央公園で初めてのバンダナデビュー🌿 リネン素材だから夏でも蒸れないし、首回りもゆとりあって◎
        </div>

        {/* Item breakdown */}
        <div style={{
          margin: '0 20px', padding: '18px 16px 16px',
          borderRadius: 18, background: T.creamSoft,
          border: `1px solid ${T.hairline}`,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 14,
          }}>
            <div style={{
              fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
              color: T.ink50, fontWeight: 500,
            }}>着用アイテム · 2</div>
            <div style={{ fontSize: 11, color: T.terracotta, fontWeight: 500 }}>すべて見る →</div>
          </div>

          <ItemRow
            brand="TRUE LOVE"
            name="リネンバンダナ"
            size="S size"
            fit="少しゆとり"
            price="¥3,200"
            color={T.terracotta}
          />
          <div style={{ height: 1, background: T.hairline, margin: '12px 0' }}/>
          <ItemRow
            brand="Mandarine Bros."
            name="ライトパピーハーネス"
            size="XS size"
            fit="ジャスト"
            price="¥4,800"
            color={T.forest}
          />
        </div>

        {/* Action bar */}
        <div style={{
          padding: '18px 20px 12px',
          display: 'flex', gap: 14, alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {Icons.heart(T.terracotta, true)}
            <span style={{
              fontFamily: F.mono, fontSize: 13, fontWeight: 500, color: T.ink,
            }}>428</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {Icons.comment()}
            <span style={{
              fontFamily: F.mono, fontSize: 13, fontWeight: 500, color: T.ink,
            }}>34</span>
          </div>
          <div style={{ flex: 1 }}/>
          <div style={{ fontSize: 11, color: T.ink50 }}>11分前 · 新宿</div>
        </div>
      </div>

      <HomeBar/>
    </Screen>
  );
}

function ItemRow({ brand, name, size, fit, price, color }) {
  const T = WS_TOKENS, F = WS_FONTS;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {/* product placeholder */}
      <div style={{
        width: 52, height: 52, borderRadius: 10,
        background: T.paper,
        border: `1px solid ${T.hairline}`,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `repeating-linear-gradient(45deg, ${T.ink10} 0, ${T.ink10} 4px, transparent 4px, transparent 8px)`,
        }}/>
        <div style={{
          position: 'absolute', top: 6, left: 6,
          width: 8, height: 8, borderRadius: 8, background: color,
        }}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase',
          color: T.ink50, fontWeight: 600,
        }}>{brand}</div>
        <div style={{
          fontSize: 13, fontWeight: 500, color: T.ink, marginTop: 2,
        }}>{name}</div>
        <div style={{
          display: 'flex', gap: 8, marginTop: 4,
          fontSize: 10.5, color: T.ink70,
        }}>
          <span>{size}</span>
          <span style={{ color: T.ink30 }}>·</span>
          <span style={{ color }}>{fit}</span>
        </div>
      </div>
      <div style={{
        fontFamily: F.mono, fontSize: 13, fontWeight: 500, color: T.ink,
        letterSpacing: '-0.02em',
      }}>{price}</div>
    </div>
  );
}

Object.assign(window, { DetailScreen });
