// Screen: Home — Editorial timeline feed
// Photo-forward cards with breed/weight metadata + item tags

function HomeScreen() {
  const T = WS_TOKENS, F = WS_FONTS, P = WS_PHOTOS;
  const nav = useNav();

  return (
    <Screen bg={T.cream}>
      <StatusBar/>

      {/* App bar */}
      <div style={{
        padding: '4px 20px 12px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Logo size={22}/>
        <div style={{ display: 'flex', gap: 8 }}>
          <IconBtn onClick={() => nav.go('search-results')}>{Icons.search()}</IconBtn>
          <IconBtn onClick={() => nav.go('my-profile')}>
            <div style={{
              width: 26, height: 26, borderRadius: 13,
              backgroundImage: `url(${P.shibaPort})`, backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}/>
          </IconBtn>
        </div>
      </div>

      {/* Filter rail */}
      <div style={{
        display: 'flex', gap: 8, padding: '4px 20px 14px',
        overflowX: 'auto', alignItems: 'center',
      }}>
        <Chip active color={T.ink}>すべて</Chip>
        <Chip>フォロー中</Chip>
        <Chip>
          <span style={{ width: 6, height: 6, borderRadius: 6, background: T.terracotta }}/>
          似たサイズ
        </Chip>
        <Chip>近所</Chip>
        <Chip>新着</Chip>
      </div>

      {/* Scrollable feed */}
      <div style={{
        position: 'absolute', top: 138, left: 0, right: 0, bottom: 84,
        overflowY: 'auto', padding: '0 20px 24px',
      }}>
        {/* Card 1 — Shiba */}
        <Tap to="detail">
        <FeedCard
          owner="koushi_to_ema"
          ownerName="こうし"
          dogName="エマ"
          breed="柴犬"
          color="赤"
          weight="9.5"
          age="2y 4m"
          time="11分前"
          avatar={P.shibaPort}
          photo={P.shibaPark}
          aspect="4 / 5"
          caption="新宿中央公園で初めてのバンダナデビュー。"
          tags={[
            { x: 50, y: 64, brand: 'TRUE LOVE', item: 'リネンバンダナ', side: 'right' },
            { x: 47, y: 78, brand: 'Mandarine Bros.', item: 'パピーハーネス', side: 'left' },
          ]}
          likes={428}
          saves={62}
        />
        </Tap>

        <div style={{ height: 24 }}/>

        {/* Card 2 — Yorkie editorial single image w/ tags */}
        <Tap to="detail">
        <FeedCard
          owner="biscuit.theyork"
          ownerName="Mio"
          dogName="ビスケット"
          breed="ヨーキー"
          color="シルバー"
          weight="2.7"
          age="3y"
          time="2時間前"
          avatar={P.yorkie}
          photo={P.yorkieGrass}
          aspect="1 / 1"
          caption="春のチェック柄、これXSでぴったり！"
          tags={[
            { x: 52, y: 56, brand: 'Maison Bowwow', item: 'ギンガムシャツ XS', side: 'right' },
          ]}
          likes={1208}
          saves={314}
        />
        </Tap>
      </div>

      <TabBar active="home"/>
      <HomeBar/>
    </Screen>
  );
}

// Feed card
function FeedCard({
  owner, ownerName, dogName, breed, color, weight, age, time,
  avatar, photo, aspect = '4 / 5', caption, tags = [], likes, saves,
}) {
  const T = WS_TOKENS, F = WS_FONTS;
  return (
    <div style={{
      background: T.paper, borderRadius: 18, overflow: 'hidden',
      border: `1px solid ${T.hairline}`,
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 14px 10px', display: 'flex',
        alignItems: 'center', gap: 10,
      }}>
        <DogAvatar src={avatar} size={36}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>{dogName}</div>
            <div style={{ fontSize: 10.5, color: T.ink50 }}>@{owner}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 10.5, color: T.ink70, fontWeight: 500,
            }}>
              {Icons.paw(T.terracotta)}
              {breed}
            </span>
            <span style={{ width: 2, height: 2, borderRadius: 2, background: T.ink30 }}/>
            <span style={{ fontSize: 10.5, color: T.ink70 }}>{color}</span>
            <span style={{ width: 2, height: 2, borderRadius: 2, background: T.ink30 }}/>
            <span style={{
              fontSize: 10.5, color: T.ink70, fontWeight: 500,
              fontFamily: F.mono, letterSpacing: '-0.02em',
            }}>{weight}kg</span>
          </div>
        </div>
        <div style={{ fontSize: 10.5, color: T.ink50 }}>{time}</div>
      </div>

      {/* Photo */}
      <div style={{
        position: 'relative', width: '100%', aspectRatio: aspect,
        background: T.ink10, overflow: 'hidden',
      }}>
        <img src={photo} alt={dogName} style={{
          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
        }}/>
        {/* Top-right item-count pill */}
        <div style={{
          position: 'absolute', top: 12, right: 12,
          padding: '5px 9px', borderRadius: 999,
          background: 'rgba(31,26,20,0.55)',
          backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
          color: '#fff', fontSize: 10.5, fontWeight: 500,
          display: 'inline-flex', alignItems: 'center', gap: 5,
        }}>
          {Icons.tag('#fff')}
          {tags.length} アイテム
        </div>
        {tags.map((tag, i) => <ItemTag key={i} {...tag}/>)}
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16, marginBottom: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: T.ink }}>
            {Icons.heart()}
            <span style={{ fontSize: 12, fontWeight: 500, fontFamily: F.mono }}>{likes}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: T.ink }}>
            {Icons.comment()}
            <span style={{ fontSize: 12, fontWeight: 500, fontFamily: F.mono }}>34</span>
          </div>
          <div style={{ color: T.ink }}>{Icons.share()}</div>
          <div style={{ flex: 1 }}/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: T.ink }}>
            {Icons.bookmark()}
            <span style={{ fontSize: 12, fontWeight: 500, fontFamily: F.mono }}>{saves}</span>
          </div>
        </div>
        <div style={{
          fontSize: 13, color: T.ink, lineHeight: 1.5,
        }}>
          <span style={{ fontWeight: 600 }}>{dogName}</span>
          <span style={{ color: T.ink70, marginLeft: 8 }}>{caption}</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HomeScreen, FeedCard });
