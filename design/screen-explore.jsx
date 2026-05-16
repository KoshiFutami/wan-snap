// Screen: Explore — Pinterest-style masonry of dog snaps

function ExploreScreen() {
  const T = WS_TOKENS, F = WS_FONTS, P = WS_PHOTOS;
  const nav = useNav();

  const Item = ({ photo, dogName, breed, weight, h, items }) => (
    <div onClick={() => nav.go('detail')} style={{
      position: 'relative', background: T.paper,
      borderRadius: 14, overflow: 'hidden',
      border: `1px solid ${T.hairline}`,
      marginBottom: 10,
      breakInside: 'avoid', display: 'inline-block', width: '100%',
      cursor: 'pointer',
    }}>
      <div style={{
        position: 'relative', width: '100%', height: h,
        background: T.ink10,
      }}>
        <img src={photo} alt={dogName} style={{
          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
        }}/>
        {items && (
          <div style={{
            position: 'absolute', top: 8, right: 8,
            padding: '3px 7px', borderRadius: 999,
            background: 'rgba(31,26,20,0.55)',
            backdropFilter: 'blur(8px)',
            color: '#fff', fontSize: 9.5, fontWeight: 500,
            display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>
            {Icons.tag('#fff')}
            {items}
          </div>
        )}
      </div>
      <div style={{ padding: '8px 10px 10px' }}>
        <div style={{
          fontSize: 12, fontWeight: 600, color: T.ink,
          marginBottom: 2,
        }}>{dogName}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontSize: 10, color: T.ink50 }}>{breed}</span>
          <span style={{ width: 2, height: 2, borderRadius: 2, background: T.ink30 }}/>
          <span style={{
            fontSize: 10, color: T.ink50,
            fontFamily: F.mono, letterSpacing: '-0.02em',
          }}>{weight}kg</span>
        </div>
      </div>
    </div>
  );

  // Two columns, each with sequenced items
  const col1 = [
    { photo: P.shibaPark, dogName: 'エマ', breed: '柴犬', weight: '9.5', h: 280, items: 2 },
    { photo: P.poodle, dogName: 'ルル', breed: 'トイプー', weight: '3.4', h: 200, items: 3 },
    { photo: P.dachshund, dogName: 'チャイ', breed: 'ダックス', weight: '5.8', h: 240 },
    { photo: P.frenchie, dogName: 'モモ', breed: 'フレンチブル', weight: '11.0', h: 180, items: 1 },
  ];
  const col2 = [
    { photo: P.yorkieGrass, dogName: 'ビスケット', breed: 'ヨーキー', weight: '2.7', h: 220, items: 1 },
    { photo: P.corgi, dogName: 'ドーナツ', breed: 'コーギー', weight: '13.2', h: 260, items: 2 },
    { photo: P.pomeranian, dogName: 'ポム', breed: 'ポメ', weight: '3.1', h: 180 },
    { photo: P.malti, dogName: 'ラテ', breed: 'マルチーズ', weight: '3.5', h: 240, items: 2 },
  ];

  return (
    <Screen bg={T.cream}>
      <StatusBar/>

      {/* Header */}
      <div style={{ padding: '8px 20px 4px' }}>
        <div style={{
          fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
          color: T.ink50, fontWeight: 500, marginBottom: 4,
        }}>Discover</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div style={{
            fontFamily: F.serif, fontSize: 30, fontWeight: 500,
            color: T.ink, letterSpacing: '-0.015em', lineHeight: 1,
          }}>今日のスナップ<span style={{ color: T.terracotta }}>。</span></div>
          <IconBtn onClick={() => nav.go('search-modal')}>{Icons.filter()}</IconBtn>
        </div>
      </div>

      {/* Search input */}
      <div style={{ padding: '14px 20px 12px' }}>
        <div onClick={() => nav.go('search-results')} style={{
          background: T.paper, borderRadius: 999,
          border: `1px solid ${T.hairline}`,
          padding: '10px 14px', display: 'flex',
          alignItems: 'center', gap: 8, cursor: 'pointer',
        }}>
          {Icons.search(T.ink50)}
          <input
            readOnly
            value="柴犬 8〜10kg"
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontSize: 13, color: T.ink, fontFamily: F.sans,
            }}
          />
          <div style={{
            width: 18, height: 18, borderRadius: 9, background: T.ink10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {Icons.close(T.ink70)}
          </div>
        </div>
      </div>

      {/* Quick filter pills */}
      <div style={{
        display: 'flex', gap: 6, padding: '0 20px 14px',
        overflowX: 'auto',
      }}>
        <Chip active color={T.forest}>すべて</Chip>
        <Chip>👕 服</Chip>
        <Chip>🎀 首輪</Chip>
        <Chip>🦮 ハーネス</Chip>
        <Chip>👜 キャリー</Chip>
      </div>

      {/* Masonry */}
      <div style={{
        position: 'absolute', top: 246, left: 0, right: 0, bottom: 84,
        overflowY: 'auto', padding: '0 20px 24px',
      }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            {col1.map((it, i) => <Item key={i} {...it}/>)}
          </div>
          <div style={{ flex: 1 }}>
            {col2.map((it, i) => <Item key={i} {...it}/>)}
          </div>
        </div>
      </div>

      <TabBar active="explore"/>
      <HomeBar/>
    </Screen>
  );
}

Object.assign(window, { ExploreScreen });
