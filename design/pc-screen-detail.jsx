// PC: Detail modal overlay, Profile, Search results

// ─── PC DETAIL · Modal overlay ──────────────────────────────
function PCDetailScreen() {
  const T = WS_TOKENS, F = WS_FONTS, P = WS_PHOTOS;

  // Background: dimmed feed-ish layout
  return (
    <div style={{
      width: 1440, height: 900,
      background: T.cream, color: T.ink, fontFamily: F.sans,
      display: 'flex', overflow: 'hidden',
      position: 'relative',
    }}>
      <PCSidebar active="home"/>
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {/* Faint feed in background */}
        <div style={{
          position: 'absolute', inset: 0,
          opacity: 0.35, filter: 'blur(3px)',
          pointerEvents: 'none',
        }}>
          <PCHeader
            eyebrow="May 16, 2026 · Saturday"
            title="今日のスナップ"
            search
          />
          <div style={{
            padding: '24px 40px',
            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20,
            maxWidth: 1080, margin: '0 auto',
          }}>
            <div style={{ aspectRatio: '4/5', borderRadius: 18, background: `url(${P.shibaPark}) center/cover`}}/>
            <div style={{ aspectRatio: '1', borderRadius: 18, background: `url(${P.yorkieGrass}) center/cover`}}/>
          </div>
        </div>

        {/* Dim overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(31,26,20,0.55)',
          backdropFilter: 'blur(4px)',
        }}/>

        {/* Modal */}
        <div style={{
          position: 'absolute', top: 40, left: 40, right: 40, bottom: 40,
          borderRadius: 18, background: T.paper,
          overflow: 'hidden', display: 'flex',
          boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
        }}>
          {/* Photo side */}
          <div style={{
            flex: 1, background: T.ink10, position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <img src={P.shibaPark} style={{
              width: '100%', height: '100%', objectFit: 'cover',
            }}/>
            <ItemTag x={50} y={64} brand="TRUE LOVE" item="リネンバンダナ" side="right"/>
            <ItemTag x={47} y={78} brand="Mandarine Bros." item="パピーハーネス" side="left"/>

            {/* L/R nav */}
            <button style={{
              position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)',
              width: 44, height: 44, borderRadius: 22,
              background: 'rgba(255,254,251,0.92)', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}>{Icons.back(T.ink)}</button>
            <button style={{
              position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)',
              width: 44, height: 44, borderRadius: 22,
              background: 'rgba(255,254,251,0.92)', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M10 5l7 7-7 7" stroke={T.ink} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div style={{
              position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
              display: 'flex', gap: 4,
            }}>
              <span style={{ width: 24, height: 4, borderRadius: 4, background: '#fff' }}/>
              <span style={{ width: 4, height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.5)' }}/>
              <span style={{ width: 4, height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.5)' }}/>
            </div>
          </div>

          {/* Detail side */}
          <div style={{ width: 440, display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{
              padding: '20px 24px', borderBottom: `1px solid ${T.hairline}`,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 22, background: `url(${P.shibaPort}) center/cover` }}/>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <div style={{ fontFamily: F.serif, fontSize: 18, fontWeight: 500, color: T.ink, lineHeight: 1 }}>エマ</div>
                  <div style={{ fontSize: 11, color: T.ink50 }}>@koushi_to_ema</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 5 }}>
                  <span style={{ padding: '2px 7px', borderRadius: 4, background: T.cream, fontSize: 10, color: T.ink }}>柴犬</span>
                  <span style={{ fontSize: 10.5, color: T.ink50 }}>赤 · ♀</span>
                  <span style={{ width: 2, height: 2, borderRadius: 2, background: T.ink30 }}/>
                  <span style={{ fontSize: 10.5, color: T.ink, fontFamily: F.mono, fontWeight: 500 }}>9.5kg · 胴囲48cm</span>
                </div>
              </div>
              <button style={{
                padding: '8px 14px', borderRadius: 999, background: T.ink, color: T.cream,
                fontSize: 11.5, fontWeight: 600, border: 'none', fontFamily: F.sans,
              }}>フォロー</button>
            </div>

            {/* Body — scrollable */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
              <div style={{
                fontSize: 13.5, lineHeight: 1.6, color: T.ink, marginBottom: 20,
              }}>新宿中央公園で初めてのバンダナデビュー🌿 リネン素材だから夏でも蒸れないし、首回りもゆとりあって◎</div>

              {/* Items */}
              <div style={{
                padding: '18px 16px', borderRadius: 16,
                background: T.creamSoft, border: `1px solid ${T.hairline}`,
              }}>
                <div style={{
                  fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: T.ink50, fontWeight: 600, marginBottom: 14,
                }}>着用アイテム · 2</div>

                <ItemRow brand="TRUE LOVE" name="リネンバンダナ" size="S size" fit="少しゆとり" price="¥3,200" color={T.terracotta}/>
                <div style={{ height: 1, background: T.hairline, margin: '14px 0' }}/>
                <ItemRow brand="Mandarine Bros." name="ライトパピーハーネス" size="XS size" fit="ジャスト" price="¥4,800" color={T.forest}/>
              </div>

              {/* Comments preview */}
              <div style={{ marginTop: 22 }}>
                <div style={{
                  fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: T.ink50, fontWeight: 600, marginBottom: 12,
                }}>コメント · 34</div>
                {[
                  { name: 'Mio', avatar: P.yorkie, text: 'リネンバンダナどこのですか？✨ うちのビスケットにも欲しい！', time: '11分前', likes: 12 },
                  { name: 'tomato.thecorg', avatar: P.corgi, text: 'エマちゃん相変わらず美犬…💚', time: '24分前', likes: 8 },
                  { name: 'mochi.thefrenchie', avatar: P.frenchie, text: 'うちもS買いました！色違いも欲しい〜', time: '1時間前', likes: 3 },
                ].map((c, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 10, marginBottom: 14,
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 14,
                      background: `url(${c.avatar}) center/cover`, flexShrink: 0,
                    }}/>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.45 }}>
                        <span style={{ fontWeight: 600 }}>{c.name}</span>
                        <span style={{ marginLeft: 8, color: T.ink70 }}>{c.text}</span>
                      </div>
                      <div style={{
                        display: 'flex', gap: 12, marginTop: 5,
                        fontSize: 10, color: T.ink50,
                      }}>
                        <span>{c.time}</span>
                        <span>♥ {c.likes}</span>
                        <span style={{ cursor: 'pointer' }}>返信</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action bar */}
            <div style={{
              padding: '14px 24px', borderTop: `1px solid ${T.hairline}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {Icons.heart(T.terracotta, true)}
                  <span style={{ fontSize: 13, fontFamily: F.mono, fontWeight: 500 }}>428</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {Icons.comment(T.ink)}
                  <span style={{ fontSize: 13, fontFamily: F.mono, fontWeight: 500 }}>34</span>
                </div>
                <div style={{ flex: 1 }}/>
                {Icons.bookmark(T.ink)}
                {Icons.share(T.ink)}
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: T.cream, padding: '8px 14px', borderRadius: 999,
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 12,
                  background: T.paper, border: `1px solid ${T.hairline}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontFamily: F.serif, color: T.ink, fontWeight: 500,
                }}>k</div>
                <input placeholder="コメントを書く…" style={{
                  flex: 1, border: 'none', outline: 'none', background: 'transparent',
                  fontSize: 12.5, fontFamily: F.sans, color: T.ink,
                }}/>
                <button style={{
                  fontSize: 12, fontWeight: 600, color: T.terracotta,
                  background: 'transparent', border: 'none',
                }}>送信</button>
              </div>
            </div>
          </div>

          {/* Close button */}
          <button style={{
            position: 'absolute', top: 16, right: 16,
            width: 36, height: 36, borderRadius: 18,
            background: 'rgba(31,26,20,0.85)', border: 'none',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', zIndex: 10,
          }}>{Icons.close('#fff')}</button>
        </div>
      </div>
    </div>
  );
}

// ─── PC PROFILE · マイわん ──────────────────────────────────
function PCProfileScreen() {
  const T = WS_TOKENS, F = WS_FONTS, P = WS_PHOTOS;

  return (
    <PCLayout active="dog-ema">
      <div style={{ position: 'relative' }}>
        {/* Cover */}
        <div style={{
          height: 200, width: '100%',
          background: `linear-gradient(180deg, ${T.terracottaSoft}, ${T.cream})`,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', right: 80, top: 20, bottom: 20,
            width: 240,
            backgroundImage: `url(${P.shibaPark})`,
            backgroundSize: 'cover', backgroundPosition: 'center 30%',
            borderRadius: 12, transform: 'rotate(3deg)',
            boxShadow: '0 12px 32px rgba(31,26,20,0.18)',
          }}/>
          <div style={{
            position: 'absolute', right: 340, top: 30, bottom: 30,
            width: 180,
            backgroundImage: `url(${P.shibaPort})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            borderRadius: 12, transform: 'rotate(-5deg)',
            boxShadow: '0 12px 32px rgba(31,26,20,0.18)',
          }}/>
        </div>

        {/* Hero name */}
        <div style={{
          padding: '32px 40px 0', display: 'flex',
          alignItems: 'flex-end', gap: 24,
        }}>
          <div style={{ position: 'relative', marginTop: -90, flexShrink: 0 }}>
            <div style={{
              width: 144, height: 144, borderRadius: 72,
              background: `url(${P.shibaPort}) center/cover`,
              border: `5px solid ${T.cream}`,
              boxShadow: '0 8px 24px rgba(31,26,20,0.1)',
            }}/>
          </div>
          <div style={{ flex: 1, minWidth: 0, paddingBottom: 8 }}>
            <div style={{
              fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
              color: T.ink50, fontWeight: 500, marginBottom: 6,
            }}>こうしの愛犬 · #014</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
              <div style={{
                fontFamily: F.serif, fontSize: 56, fontWeight: 500,
                color: T.ink, letterSpacing: '-0.025em', lineHeight: 0.95,
              }}>エマ</div>
              <div style={{
                fontFamily: F.serif, fontStyle: 'italic',
                fontSize: 22, color: T.ink50,
              }}>Ema</div>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, marginTop: 12,
              fontSize: 13, color: T.ink70,
            }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                {Icons.paw(T.terracotta)} 柴犬・赤
              </span>
              <span style={{ width: 3, height: 3, borderRadius: 3, background: T.ink30 }}/>
              <span style={{ fontFamily: F.mono, fontWeight: 500 }}>2y 4m</span>
              <span style={{ width: 3, height: 3, borderRadius: 3, background: T.ink30 }}/>
              <span>新宿在住</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, paddingBottom: 4 }}>
            <button style={{
              padding: '10px 18px', borderRadius: 999, background: T.paper,
              border: `1px solid ${T.hairlineStrong}`, fontSize: 12.5, fontWeight: 500,
              color: T.ink, display: 'inline-flex', alignItems: 'center', gap: 6,
              fontFamily: F.sans, cursor: 'pointer',
            }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M2 4h2l1-1h2l1 1h2v6H2V4z" stroke={T.ink70} strokeWidth="1.4" strokeLinejoin="round"/>
                <circle cx="8" cy="8" r="2.2" stroke={T.ink70} strokeWidth="1.4"/>
              </svg>
              プロフィール編集
            </button>
            <button style={{
              padding: '10px 18px', borderRadius: 999, background: T.ink, color: T.cream,
              fontSize: 12.5, fontWeight: 600, border: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontFamily: F.sans, cursor: 'pointer',
            }}>
              {Icons.plus('#fff')}
              スナップを追加
            </button>
          </div>
        </div>

        {/* About row */}
        <div style={{
          padding: '24px 40px 0',
          fontSize: 13.5, color: T.ink70, lineHeight: 1.6, maxWidth: 720,
        }}>朝はいつも代々木公園を散歩。少しゆとりのある服が好み。リネン素材が大好物で、夏でも快適に過ごせる涼しい服を集めるのが家族の楽しみ。</div>

        {/* Metrics */}
        <div style={{
          padding: '20px 40px 0',
          display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)',
          gap: 0,
          maxWidth: 900,
        }}>
          {[
            { l: 'スナップ', v: '87', sub: '+12 / 月' },
            { l: 'フォロワー', v: '1.2k', sub: '+184' },
            { l: '体重', v: '9.5', u: 'kg', sub: '標準' },
            { l: '胴囲', v: '48', u: 'cm', sub: 'M' },
            { l: '着丈', v: '35', u: 'cm', sub: 'M' },
            { l: 'ブランド', v: '12', sub: '着用済み' },
          ].map((m, i) => (
            <div key={i} style={{
              padding: '14px 16px', textAlign: 'left',
              borderLeft: i > 0 ? `1px solid ${T.hairline}` : 'none',
            }}>
              <div style={{
                fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase',
                color: T.ink50, fontWeight: 500, marginBottom: 6,
              }}>{m.l}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <div style={{
                  fontFamily: F.serif, fontSize: 26, fontWeight: 500,
                  color: T.ink, letterSpacing: '-0.01em', lineHeight: 1,
                }}>{m.v}</div>
                {m.u && <div style={{ fontSize: 11, color: T.ink50, fontFamily: F.mono }}>{m.u}</div>}
              </div>
              <div style={{ fontSize: 10, color: T.terracotta, marginTop: 4, fontWeight: 500 }}>{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{
          margin: '32px 40px 0',
          borderBottom: `1px solid ${T.hairline}`,
          display: 'flex', gap: 28,
        }}>
          <PCTab label="スナップ" count="87" active/>
          <PCTab label="アイテム" count="42"/>
          <PCTab label="ブランド" count="12"/>
          <PCTab label="サイズ感メモ" count="8"/>
          <PCTab label="統計"/>
        </div>

        {/* Grid */}
        <div style={{
          padding: '20px 40px 60px',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10,
        }}>
          {[
            { src: P.shibaPark, t: 3 }, { src: P.shibaPort, t: 1 }, { src: P.shibaPark, t: 2 },
            { src: P.shibaPort, t: 1 }, { src: P.shibaPark, t: 2 }, { src: P.shibaPort, t: 1 },
            { src: P.shibaPark, t: 3 }, { src: P.shibaPort, t: 1 }, { src: P.shibaPark, t: 2 },
            { src: P.shibaPort, t: 1 }, { src: P.shibaPark, t: 2 }, { src: P.shibaPort, t: 1 },
          ].map((it, i) => (
            <div key={i} style={{
              aspectRatio: '1', borderRadius: 8, overflow: 'hidden',
              position: 'relative', background: T.ink10,
              cursor: 'pointer',
            }}>
              <img src={it.src} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
              <div style={{
                position: 'absolute', top: 8, right: 8,
                padding: '3px 7px', borderRadius: 999,
                background: 'rgba(31,26,20,0.6)', backdropFilter: 'blur(6px)',
                color: '#fff', fontSize: 10, fontWeight: 500,
                display: 'inline-flex', alignItems: 'center', gap: 4,
              }}>{Icons.tag('#fff')}×{it.t}</div>
            </div>
          ))}
        </div>
      </div>
    </PCLayout>
  );
}

function PCTab({ label, count, active = false }) {
  const T = WS_TOKENS, F = WS_FONTS;
  return (
    <div style={{
      paddingBottom: 12, position: 'relative',
      display: 'flex', alignItems: 'baseline', gap: 6,
      color: active ? T.ink : T.ink50, cursor: 'pointer',
    }}>
      <span style={{ fontSize: 13, fontWeight: active ? 600 : 500 }}>{label}</span>
      {count && <span style={{ fontSize: 11, fontFamily: F.mono, opacity: 0.5 }}>{count}</span>}
      {active && <div style={{
        position: 'absolute', bottom: -1, left: 0, right: 0, height: 2,
        background: T.ink, borderRadius: 2,
      }}/>}
    </div>
  );
}

// ─── PC SEARCH RESULTS ──────────────────────────────────────
function PCSearchResultsScreen() {
  const T = WS_TOKENS, F = WS_FONTS, P = WS_PHOTOS;

  return (
    <PCLayout active="explore" rightRail={
      <>
        <RailSection title="この検索で絞り込み">
          <div style={{ marginBottom: 16 }}>
            <div style={{
              fontSize: 11.5, fontWeight: 500, color: T.ink, marginBottom: 8,
            }}>犬種</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <Chip active color={T.ink}>柴犬</Chip>
              <Chip>豆柴</Chip>
              <Chip>ミックス</Chip>
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{
              fontSize: 11.5, fontWeight: 500, color: T.ink, marginBottom: 8,
              display: 'flex', justifyContent: 'space-between',
            }}>
              <span>体重</span>
              <span style={{ fontSize: 10.5, color: T.ink50, fontFamily: F.mono }}>8.0 — 10.0 kg</span>
            </div>
            <div style={{ position: 'relative', height: 4, borderRadius: 4, background: T.ink10, margin: '14px 0 18px' }}>
              <div style={{ position: 'absolute', left: '26%', right: '66%', height: 4, borderRadius: 4, background: T.ink }}/>
              <div style={{ position: 'absolute', left: '26%', top: -6, width: 16, height: 16, borderRadius: 8, background: T.paper, border: `2px solid ${T.ink}`, transform: 'translateX(-50%)' }}/>
              <div style={{ position: 'absolute', left: '34%', top: -6, width: 16, height: 16, borderRadius: 8, background: T.paper, border: `2px solid ${T.ink}`, transform: 'translateX(-50%)' }}/>
            </div>
          </div>
          <div>
            <div style={{
              fontSize: 11.5, fontWeight: 500, color: T.ink, marginBottom: 8,
            }}>アイテム</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <Chip active color={T.ink}>バンダナ</Chip>
              <Chip>首輪</Chip>
              <Chip>ハーネス</Chip>
              <Chip>服</Chip>
            </div>
          </div>
        </RailSection>

        <RailSection title="関連ブランド">
          {[
            ['TRUE LOVE', 42],
            ['Maison Bowwow', 28],
            ['Mandarine Bros.', 14],
            ['iDog', 11],
            ['PETIO', 8],
          ].map(([b, n]) => (
            <div key={b} style={{
              display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
              padding: '8px 0', borderBottom: `1px solid ${T.hairline}`, cursor: 'pointer',
            }}>
              <span style={{ fontSize: 12, color: T.ink, letterSpacing: '0.04em' }}>{b}</span>
              <span style={{ fontSize: 10.5, color: T.ink50, fontFamily: F.mono }}>{n}件</span>
            </div>
          ))}
        </RailSection>
      </>
    }>
      <PCHeader
        eyebrow={'検索 · "柴犬 バンダナ"'}
        title="284件のスナップ"
        search
        actions={
          <button style={{
            background: 'transparent', border: 'none', fontSize: 12, color: T.ink70,
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            人気順
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </button>
        }
      />

      {/* Active filter chips */}
      <div style={{
        display: 'flex', gap: 6, padding: '16px 40px 8px', alignItems: 'center',
      }}>
        <Chip active color={T.ink}>柴犬 ×</Chip>
        <Chip active color={T.ink}>8–10kg ×</Chip>
        <Chip active color={T.ink}>バンダナ ×</Chip>
      </div>

      {/* Results grid 3 col */}
      <div style={{
        padding: '12px 40px 40px',
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14,
      }}>
        {[
          { src: P.shibaPark, dog: 'エマ', breed: '柴犬 9.5kg', brand: 'TRUE LOVE', tall: true },
          { src: P.shibaPort, dog: 'モチ', breed: '柴犬 10.2kg', brand: 'Mandarine', tall: false },
          { src: P.shibaPort, dog: 'クロ', breed: '柴犬 8.8kg', brand: 'iDog', tall: false },
          { src: P.shibaPark, dog: 'ハナ', breed: '柴犬 9.0kg', brand: 'Maison Bowwow', tall: true },
          { src: P.shibaPark, dog: 'まめ', breed: '豆柴 6.5kg', brand: 'TRUE LOVE', tall: false },
          { src: P.shibaPort, dog: 'コタ', breed: '柴犬 11.2kg', brand: 'PETIO', tall: false },
          { src: P.shibaPort, dog: 'ナナ', breed: '柴犬 9.4kg', brand: 'TRUE LOVE', tall: true },
          { src: P.shibaPark, dog: 'ラン', breed: '柴犬 8.6kg', brand: 'iDog', tall: false },
          { src: P.shibaPark, dog: 'ヒナ', breed: '柴犬 10.0kg', brand: 'Maison Bowwow', tall: false },
        ].map((it, i) => (
          <div key={i} style={{
            background: T.paper, borderRadius: 14, overflow: 'hidden',
            border: `1px solid ${T.hairline}`, cursor: 'pointer',
          }}>
            <div style={{
              width: '100%', aspectRatio: it.tall ? '3/4' : '1',
              background: `url(${it.src}) center/cover`, position: 'relative',
            }}>
              <div style={{
                position: 'absolute', bottom: 10, left: 10,
                padding: '4px 9px', borderRadius: 6,
                background: 'rgba(255,254,251,0.92)', backdropFilter: 'blur(8px)',
                fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', color: T.ink,
              }}>{it.brand}</div>
            </div>
            <div style={{ padding: '10px 14px 14px' }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: T.ink }}>{it.dog}</div>
              <div style={{ fontSize: 10.5, color: T.ink50, fontFamily: F.mono, marginTop: 2 }}>{it.breed}</div>
            </div>
          </div>
        ))}
      </div>
    </PCLayout>
  );
}

Object.assign(window, { PCDetailScreen, PCProfileScreen, PCSearchResultsScreen, PCTab });
