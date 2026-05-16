// PC screens for Wan-Snap

// ─── PC HOME · 2-column editorial feed ──────────────────────
function PCHomeScreen() {
  const T = WS_TOKENS, F = WS_FONTS, P = WS_PHOTOS;

  const Card = ({ photo, dogName, owner, breed, color, weight, time, caption, tags = [], aspect = '4/5', likes, saves, avatar }) => (
    <div style={{
      background: T.paper, borderRadius: 18, overflow: 'hidden',
      border: `1px solid ${T.hairline}`,
    }}>
      <div style={{ padding: '14px 18px 12px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 20, background: `url(${avatar}) center/cover` }}/>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.ink }}>{dogName}</div>
            <div style={{ fontSize: 11, color: T.ink50 }}>@{owner}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: T.ink70, fontWeight: 500 }}>
              {Icons.paw(T.terracotta)} {breed}
            </span>
            <span style={{ width: 2, height: 2, borderRadius: 2, background: T.ink30 }}/>
            <span style={{ fontSize: 11, color: T.ink70 }}>{color}</span>
            <span style={{ width: 2, height: 2, borderRadius: 2, background: T.ink30 }}/>
            <span style={{ fontSize: 11, color: T.ink70, fontFamily: F.mono, fontWeight: 500 }}>{weight}kg</span>
          </div>
        </div>
        <div style={{ fontSize: 11, color: T.ink50 }}>{time}</div>
      </div>
      <div style={{ position: 'relative', width: '100%', aspectRatio: aspect, background: T.ink10 }}>
        <img src={photo} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}/>
        <div style={{
          position: 'absolute', top: 14, right: 14,
          padding: '5px 10px', borderRadius: 999,
          background: 'rgba(31,26,20,0.55)', backdropFilter: 'blur(10px)',
          color: '#fff', fontSize: 11, fontWeight: 500,
          display: 'inline-flex', alignItems: 'center', gap: 5,
        }}>{Icons.tag('#fff')} {tags.length} アイテム</div>
        {tags.map((tag, i) => <ItemTag key={i} {...tag}/>)}
      </div>
      <div style={{ padding: '14px 18px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {Icons.heart(T.ink)} <span style={{ fontSize: 12, fontFamily: F.mono, fontWeight: 500 }}>{likes}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {Icons.comment(T.ink)} <span style={{ fontSize: 12, fontFamily: F.mono, fontWeight: 500 }}>34</span>
          </div>
          {Icons.share(T.ink)}
          <div style={{ flex: 1 }}/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {Icons.bookmark(T.ink)} <span style={{ fontSize: 12, fontFamily: F.mono, fontWeight: 500 }}>{saves}</span>
          </div>
        </div>
        <div style={{ fontSize: 13.5, color: T.ink, lineHeight: 1.55 }}>
          <span style={{ fontWeight: 600 }}>{dogName}</span>
          <span style={{ color: T.ink70, marginLeft: 8 }}>{caption}</span>
        </div>
      </div>
    </div>
  );

  return (
    <PCLayout active="home" rightRail={
      <>
        <RailSection title="エマと似たサイズ">
          <div style={{
            background: T.paper, padding: 14, borderRadius: 14,
            border: `1px solid ${T.hairline}`, marginBottom: 8,
          }}>
            <div style={{ fontSize: 11, color: T.ink50, marginBottom: 4 }}>柴犬 · 8–10kg</div>
            <div style={{ fontFamily: F.serif, fontSize: 24, fontWeight: 500, color: T.ink, lineHeight: 1 }}>
              284<span style={{ fontSize: 11, color: T.ink50, marginLeft: 4 }}>件</span>
            </div>
            <div style={{ display: 'flex', gap: 4, marginTop: 10 }}>
              {[P.shibaPark, P.shibaPort, P.shibaPark].map((s, i) => (
                <div key={i} style={{ flex: 1, aspectRatio: 1, borderRadius: 6,
                  background: `url(${s}) center/cover` }}/>
              ))}
            </div>
            <div style={{
              marginTop: 10, fontSize: 11, color: T.terracotta, fontWeight: 500,
            }}>すべて見る →</div>
          </div>
        </RailSection>

        <RailSection title="今週のトレンド犬種" action="すべて見る →">
          {[
            { name: '柴犬', count: '+18%', src: P.shibaPort },
            { name: 'ヨーキー', count: '+12%', src: P.yorkie },
            { name: 'フレンチブル', count: '+9%', src: P.frenchie },
            { name: 'トイプー', count: '+6%', src: P.poodle },
          ].map((b, i) => (
            <div key={b.name} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 0',
              borderBottom: i < 3 ? `1px solid ${T.hairline}` : 'none',
            }}>
              <div style={{ fontSize: 10, color: T.ink50, fontFamily: F.mono, width: 16 }}>0{i+1}</div>
              <div style={{
                width: 32, height: 32, borderRadius: 16, background: `url(${b.src}) center/cover`,
              }}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 500, color: T.ink }}>{b.name}</div>
                <div style={{ fontSize: 10, color: T.ink50, marginTop: 1 }}>{(54 - i*7) * 12}件 / 週</div>
              </div>
              <div style={{ fontSize: 11, color: T.forest, fontWeight: 600, fontFamily: F.mono }}>{b.count}</div>
            </div>
          ))}
        </RailSection>

        <RailSection title="おすすめオーナー">
          {[
            { name: 'Mio', tag: '@biscuit.theyork', breed: 'ヨーキー XS', src: P.yorkie },
            { name: 'Tomo', tag: '@tomato.thecorg', breed: 'コーギー L', src: P.corgi },
          ].map((u) => (
            <div key={u.name} style={{
              padding: 14, borderRadius: 14,
              background: T.paper, border: `1px solid ${T.hairline}`, marginBottom: 8,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 20,
                background: `url(${u.src}) center/cover` }}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: T.ink }}>{u.name}</div>
                <div style={{ fontSize: 10, color: T.ink50 }}>{u.tag} · {u.breed}</div>
              </div>
              <button style={{
                padding: '6px 11px', borderRadius: 999, background: T.ink, color: T.cream,
                border: 'none', fontSize: 11, fontWeight: 600, fontFamily: F.sans,
              }}>フォロー</button>
            </div>
          ))}
        </RailSection>
      </>
    }>
      <PCHeader
        eyebrow="May 16, 2026 · Saturday"
        title="今日のスナップ"
        search
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{
              padding: '9px 14px', borderRadius: 999, background: T.paper,
              border: `1px solid ${T.hairlineStrong}`, fontSize: 12, fontWeight: 500,
              color: T.ink, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              {Icons.filter(T.ink)}
              絞り込み
            </button>
          </div>
        }
      />

      {/* Filter chips row */}
      <div style={{
        display: 'flex', gap: 8, padding: '16px 40px 8px',
        background: T.cream,
      }}>
        <Chip active color={T.ink}>すべて</Chip>
        <Chip>フォロー中</Chip>
        <Chip>
          <span style={{ width: 6, height: 6, borderRadius: 6, background: T.terracotta }}/>
          エマと似たサイズ
        </Chip>
        <Chip>近所</Chip>
        <Chip>新着</Chip>
        <Chip>+ カスタム</Chip>
      </div>

      {/* Feed grid 2-col */}
      <div style={{
        padding: '14px 40px 40px',
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20,
        maxWidth: 1080, margin: '0 auto',
      }}>
        <Card
          dogName="エマ" owner="koushi_to_ema" breed="柴犬" color="赤" weight="9.5"
          time="11分前" avatar={P.shibaPort} photo={P.shibaPark} aspect="4/5"
          caption="新宿中央公園で初めてのバンダナデビュー🌿"
          tags={[
            { x: 50, y: 64, brand: 'TRUE LOVE', item: 'リネンバンダナ', side: 'right' },
            { x: 47, y: 78, brand: 'Mandarine Bros.', item: 'パピーハーネス', side: 'left' },
          ]}
          likes="428" saves="62"
        />
        <Card
          dogName="ビスケット" owner="biscuit.theyork" breed="ヨーキー" color="シルバー" weight="2.7"
          time="2時間前" avatar={P.yorkie} photo={P.yorkieGrass} aspect="1/1"
          caption="春のチェック柄、XSでぴったり！"
          tags={[
            { x: 52, y: 56, brand: 'Maison Bowwow', item: 'ギンガムシャツ XS', side: 'right' },
          ]}
          likes="1208" saves="314"
        />
        <Card
          dogName="モチ" owner="mochi.thefrenchie" breed="フレンチブル" color="クリーム" weight="11.0"
          time="4時間前" avatar={P.frenchie} photo={P.frenchie} aspect="4/5"
          caption="お散歩日和。新しいハーネス試してみました。"
          tags={[{ x: 50, y: 70, brand: 'PETIO', item: 'メッシュハーネス', side: 'right' }]}
          likes="892" saves="184"
        />
        <Card
          dogName="ドーナツ" owner="tomato.thecorg" breed="コーギー" color="セーブル" weight="13.2"
          time="6時間前" avatar={P.corgi} photo={P.corgi} aspect="1/1"
          caption="お気に入りのキャリーで日帰り旅。Lサイズが体型にぴったり。"
          tags={[{ x: 50, y: 60, brand: 'iDog', item: '帆布キャリー L', side: 'left' }]}
          likes="2104" saves="412"
        />
      </div>
    </PCLayout>
  );
}

// ─── PC EXPLORE · 4-column masonry ─────────────────────────
function PCExploreScreen() {
  const T = WS_TOKENS, F = WS_FONTS, P = WS_PHOTOS;

  const MItem = ({ src, dogName, breed, weight, h, items, brand }) => (
    <div style={{
      position: 'relative', borderRadius: 14, overflow: 'hidden',
      background: T.paper, border: `1px solid ${T.hairline}`,
      breakInside: 'avoid', marginBottom: 12, display: 'inline-block', width: '100%',
    }}>
      <div style={{ position: 'relative', width: '100%', height: h, background: T.ink10 }}>
        <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}/>
        {brand && (
          <div style={{
            position: 'absolute', bottom: 10, left: 10,
            padding: '4px 9px', borderRadius: 6,
            background: 'rgba(255,254,251,0.92)', backdropFilter: 'blur(8px)',
            fontSize: 9.5, fontWeight: 600, letterSpacing: '0.08em', color: T.ink,
          }}>{brand}</div>
        )}
        {items && (
          <div style={{
            position: 'absolute', top: 10, right: 10,
            padding: '3px 8px', borderRadius: 999,
            background: 'rgba(31,26,20,0.55)', backdropFilter: 'blur(8px)',
            color: '#fff', fontSize: 10, fontWeight: 500,
            display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>{Icons.tag('#fff')} {items}</div>
        )}
      </div>
      <div style={{ padding: '10px 12px 12px' }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: T.ink }}>{dogName}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
          <span style={{ fontSize: 10.5, color: T.ink50 }}>{breed}</span>
          <span style={{ width: 2, height: 2, borderRadius: 2, background: T.ink30 }}/>
          <span style={{ fontSize: 10.5, color: T.ink50, fontFamily: F.mono }}>{weight}kg</span>
        </div>
      </div>
    </div>
  );

  const cols = [
    [
      { src: P.shibaPark, dogName: 'エマ', breed: '柴犬', weight: '9.5', h: 360, items: 2, brand: 'TRUE LOVE' },
      { src: P.poodle, dogName: 'ルル', breed: 'トイプー', weight: '3.4', h: 240, items: 3 },
      { src: P.dachshund, dogName: 'チャイ', breed: 'ダックス', weight: '5.8', h: 320 },
    ],
    [
      { src: P.yorkieGrass, dogName: 'ビスケット', breed: 'ヨーキー', weight: '2.7', h: 260, items: 1, brand: 'Maison Bowwow' },
      { src: P.corgi, dogName: 'ドーナツ', breed: 'コーギー', weight: '13.2', h: 320, items: 2 },
      { src: P.pomeranian, dogName: 'ポム', breed: 'ポメ', weight: '3.1', h: 220 },
    ],
    [
      { src: P.frenchie, dogName: 'モチ', breed: 'フレンチブル', weight: '11.0', h: 220, items: 1, brand: 'PETIO' },
      { src: P.golden, dogName: 'ハル', breed: 'ゴールデン', weight: '24.5', h: 340 },
      { src: P.shibaPort, dogName: 'コタ', breed: '柴犬', weight: '11.2', h: 260, items: 2 },
    ],
    [
      { src: P.malti, dogName: 'ラテ', breed: 'マルチーズ', weight: '3.5', h: 320, items: 2 },
      { src: P.jrt, dogName: 'ソル', breed: 'JRT', weight: '6.8', h: 220, items: 1 },
      { src: P.goldenLeash, dogName: 'ヒナ', breed: 'ゴールデン', weight: '22.0', h: 280, items: 1, brand: 'iDog' },
    ],
  ];

  return (
    <PCLayout active="explore">
      <PCHeader
        eyebrow="Discover · 4,128 snaps"
        title="さがす"
        search
        actions={
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button style={{
              padding: '9px 14px', borderRadius: 999,
              background: T.ink, color: T.cream, border: 'none',
              fontSize: 12, fontWeight: 600, fontFamily: F.sans,
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              {Icons.filter('#fff')}
              絞り込み <span style={{ fontFamily: F.mono, fontSize: 10, opacity: 0.6, marginLeft: 4 }}>3</span>
            </button>
          </div>
        }
      />

      {/* Category mega-row */}
      <div style={{ padding: '20px 40px 10px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10,
        }}>
          {[
            { icon: '👕', label: '服', count: '42k', c: T.terracotta },
            { icon: '🎀', label: '首輪', count: '18k', c: T.forest },
            { icon: '🦮', label: 'ハーネス', count: '9.2k', c: T.ochre },
            { icon: '🧥', label: 'アウター', count: '6.1k' },
            { icon: '🩱', label: 'レイン', count: '2.4k' },
            { icon: '👜', label: 'キャリー', count: '3.8k' },
          ].map(c => (
            <div key={c.label} style={{
              padding: '14px 14px',
              background: T.paper, border: `1px solid ${T.hairline}`,
              borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10,
              cursor: 'pointer',
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: T.cream, display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: 18,
              }}>{c.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: T.ink }}>{c.label}</div>
                <div style={{ fontSize: 10, color: T.ink50, fontFamily: F.mono, marginTop: 2 }}>{c.count}</div>
              </div>
              {c.c && <div style={{ width: 6, height: 6, borderRadius: 6, background: c.c }}/>}
            </div>
          ))}
        </div>
      </div>

      {/* Active filter chips */}
      <div style={{
        display: 'flex', gap: 8, padding: '10px 40px 14px',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: 11, color: T.ink50, marginRight: 4 }}>絞り込み:</span>
        <Chip active color={T.ink}>柴犬 ×</Chip>
        <Chip active color={T.ink}>8–10kg ×</Chip>
        <Chip active color={T.ink}>服 ×</Chip>
        <button style={{
          background: 'transparent', border: 'none', color: T.terracotta,
          fontSize: 11, fontWeight: 500, marginLeft: 4, cursor: 'pointer',
        }}>すべてクリア</button>
      </div>

      {/* Masonry — 4 cols */}
      <div style={{ padding: '0 40px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {cols.map((col, ci) => (
            <div key={ci}>
              {col.map((it, i) => <MItem key={i} {...it}/>)}
            </div>
          ))}
        </div>
      </div>
    </PCLayout>
  );
}

Object.assign(window, { PCHomeScreen, PCExploreScreen });
