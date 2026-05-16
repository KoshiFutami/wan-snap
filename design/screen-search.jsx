// Screen: Search / Filter — Clean filter UI for breed, weight, item category

function SearchScreen() {
  const T = WS_TOKENS, F = WS_FONTS;
  const nav = useNav();

  return (
    <Screen bg={T.creamSoft}>
      <StatusBar/>

      {/* Header */}
      <div style={{
        padding: '4px 20px 16px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        <IconBtn>{Icons.back()}</IconBtn>
        <div style={{
          fontSize: 14, fontWeight: 600, color: T.ink, letterSpacing: '0.02em',
        }}>絞り込み</div>
        <button style={{
          background: 'transparent', border: 'none',
          fontSize: 12, color: T.terracotta, fontWeight: 500,
          fontFamily: F.sans, cursor: 'pointer',
        }}>リセット</button>
      </div>

      {/* Scrollable content */}
      <div style={{
        position: 'absolute', top: 100, left: 0, right: 0, bottom: 96,
        overflowY: 'auto', padding: '0 20px 16px',
      }}>

        {/* Search input */}
        <div style={{
          background: T.paper, borderRadius: 14,
          padding: '12px 14px', display: 'flex',
          alignItems: 'center', gap: 10,
          border: `1px solid ${T.hairline}`,
          marginBottom: 24,
        }}>
          {Icons.search(T.ink50)}
          <input
            placeholder="犬種・ブランド・タグ"
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontSize: 14, color: T.ink, fontFamily: F.sans,
            }}
          />
        </div>

        {/* Breed section */}
        <FilterSection label="犬種" subtitle="人気順">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {[
              ['柴犬', true], ['豆柴', false], ['トイプードル', true],
              ['チワワ', false], ['ヨーキー', true], ['ダックスフンド', false],
              ['ポメラニアン', false], ['コーギー', false], ['フレンチブル', true],
              ['マルチーズ', false], ['ミックス', false],
            ].map(([name, on]) => (
              <Chip key={name} active={on} color={T.ink}>{name}</Chip>
            ))}
            <Chip color={T.ink50}>+ もっと見る</Chip>
          </div>
        </FilterSection>

        {/* Weight section — range slider */}
        <FilterSection label="体重" subtitle="2.5kg〜12kg">
          <WeightSlider min={0} max={30} from={2.5} to={12}/>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: 10.5, color: T.ink50, fontFamily: F.mono,
            marginTop: 8, padding: '0 2px',
          }}>
            <span>0kg</span>
            <span>10</span>
            <span>20</span>
            <span>30kg+</span>
          </div>
        </FilterSection>

        {/* Category section */}
        <FilterSection label="アイテム" subtitle="3つ選択中">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            <CatTile icon="👕" label="服" sub="42k" active/>
            <CatTile icon="🎀" label="首輪" sub="18k" active/>
            <CatTile icon="🦮" label="ハーネス" sub="9.2k" active/>
            <CatTile icon="🧥" label="アウター" sub="6.1k"/>
            <CatTile icon="🩱" label="レイン" sub="2.4k"/>
            <CatTile icon="👜" label="キャリー" sub="3.8k"/>
          </div>
        </FilterSection>

        {/* Color/season */}
        <FilterSection label="サイズ感" subtitle="着用感">
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <Chip color={T.ink}>ジャスト</Chip>
            <Chip active color={T.forest}>少しゆとり</Chip>
            <Chip color={T.ink}>大きめ</Chip>
            <Chip color={T.ink}>ぴったり</Chip>
          </div>
        </FilterSection>
      </div>

      {/* Sticky bottom CTA */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '14px 20px 28px',
        background: T.creamSoft,
        borderTop: `1px solid ${T.hairline}`,
        display: 'flex', gap: 10, alignItems: 'center',
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10.5, color: T.ink50, letterSpacing: '0.05em' }}>該当スナップ</div>
          <div style={{
            fontFamily: F.serif, fontSize: 22, fontWeight: 500, color: T.ink,
            lineHeight: 1, marginTop: 2,
          }}>1,284<span style={{ fontSize: 12, color: T.ink50, marginLeft: 4 }}>件</span></div>
        </div>
        <button onClick={() => nav.replace('search-results')} style={{
          padding: '14px 24px', borderRadius: 999,
          background: T.ink, color: T.cream,
          fontSize: 13, fontWeight: 600, fontFamily: F.sans,
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 8,
          letterSpacing: '0.02em',
        }}>
          スナップを表示
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </Screen>
  );
}

function FilterSection({ label, subtitle, children }) {
  const T = WS_TOKENS, F = WS_FONTS;
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        marginBottom: 12,
      }}>
        <div style={{
          fontFamily: F.serif, fontSize: 17, fontWeight: 500,
          color: T.ink, letterSpacing: '-0.005em',
        }}>{label}</div>
        <div style={{ fontSize: 11, color: T.ink50 }}>{subtitle}</div>
      </div>
      {children}
    </div>
  );
}

function CatTile({ icon, label, sub, active = false }) {
  const T = WS_TOKENS, F = WS_FONTS;
  return (
    <div style={{
      padding: '14px 10px',
      background: active ? T.ink : T.paper,
      color: active ? T.cream : T.ink,
      border: `1px solid ${active ? T.ink : T.hairline}`,
      borderRadius: 14,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      position: 'relative',
    }}>
      {active && (
        <div style={{
          position: 'absolute', top: 8, right: 8,
          width: 14, height: 14, borderRadius: 7,
          background: T.terracotta,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M1.5 4.2L3 5.7l3.5-3.5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
      <div style={{ fontSize: 22, lineHeight: 1 }}>{icon}</div>
      <div style={{ fontSize: 12, fontWeight: 600, marginTop: 2 }}>{label}</div>
      <div style={{
        fontSize: 10, opacity: 0.6, fontFamily: F.mono, letterSpacing: '-0.02em',
      }}>{sub}</div>
    </div>
  );
}

function WeightSlider({ min, max, from, to }) {
  const T = WS_TOKENS, F = WS_FONTS;
  const fromPct = (from / max) * 100;
  const toPct = (to / max) * 100;
  return (
    <div style={{ position: 'relative', padding: '20px 12px 8px' }}>
      {/* Track */}
      <div style={{
        position: 'relative', height: 4, borderRadius: 4,
        background: T.ink10,
      }}>
        <div style={{
          position: 'absolute', top: 0, height: 4, borderRadius: 4,
          left: `${fromPct}%`, width: `${toPct - fromPct}%`,
          background: T.ink,
        }}/>
        {/* From handle */}
        <Handle pct={fromPct} value={`${from}kg`}/>
        <Handle pct={toPct} value={`${to}kg`}/>
      </div>
    </div>
  );
}

function Handle({ pct, value }) {
  const T = WS_TOKENS, F = WS_FONTS;
  return (
    <div style={{
      position: 'absolute', left: `${pct}%`, top: -8,
      transform: 'translateX(-50%)',
    }}>
      <div style={{
        position: 'absolute', bottom: 26, left: '50%',
        transform: 'translateX(-50%)',
        padding: '3px 7px', borderRadius: 6,
        background: T.ink, color: T.cream,
        fontSize: 10.5, fontWeight: 500, fontFamily: F.mono,
        whiteSpace: 'nowrap',
      }}>
        {value}
      </div>
      <div style={{
        width: 20, height: 20, borderRadius: 10,
        background: T.paper,
        border: `2px solid ${T.ink}`,
        boxShadow: '0 2px 6px rgba(31,26,20,0.15)',
      }}/>
    </div>
  );
}

Object.assign(window, { SearchScreen });
