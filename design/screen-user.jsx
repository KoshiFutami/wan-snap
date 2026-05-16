// User-related screens: My profile (マイわん), Other user, Edit profile, Album

// ─── MY PROFILE ─────────────────────────────────────────────
function MyProfileScreen() {
  const T = WS_TOKENS, F = WS_FONTS, P = WS_PHOTOS;
  const nav = useNav();
  return (
    <Screen bg={T.cream}>
      <StatusBar/>
      <div style={{
        padding: '4px 16px 6px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>@koushi_to_ema</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <IconBtn onClick={() => nav.go('new-post')}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M10 2v14M3 9l7-7 7 7" stroke={T.ink} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </IconBtn>
          <IconBtn onClick={() => nav.go('edit-profile')}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="3" stroke={T.ink} strokeWidth="1.5"/>
              <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4 4l1.5 1.5M14.5 14.5L16 16M4 16l1.5-1.5M14.5 5.5L16 4" stroke={T.ink} strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </IconBtn>
        </div>
      </div>

      <div style={{
        position: 'absolute', top: 96, bottom: 84, left: 0, right: 0,
        overflowY: 'auto',
      }}>
        {/* User header */}
        <div style={{ padding: '8px 20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 76, height: 76, borderRadius: 38,
              background: T.cream,
              border: `1px solid ${T.hairline}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: F.serif, fontSize: 30, fontWeight: 500, color: T.ink,
            }}>k</div>
            <div style={{ flex: 1, display: 'flex', gap: 6 }}>
              <Stat2 v="87" l="投稿"/>
              <Stat2 v="1.2k" l="フォロワー"/>
              <Stat2 v="284" l="フォロー中"/>
            </div>
          </div>
          <div style={{
            fontFamily: F.serif, fontSize: 24, fontWeight: 500,
            color: T.ink, letterSpacing: '-0.01em', marginTop: 14,
          }}>こうし</div>
          <div style={{
            fontSize: 12, color: T.ink70, lineHeight: 1.5, marginTop: 4,
          }}>新宿在住の柴犬オーナー。リネン素材と帆布バッグが好き。<br/>愛犬: エマ・モカ</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button onClick={() => nav.go('edit-profile')} style={{
              flex: 1, padding: '9px 14px', borderRadius: 10,
              background: T.paper, color: T.ink,
              border: `1px solid ${T.hairlineStrong}`,
              fontSize: 12, fontWeight: 500, fontFamily: F.sans,
              cursor: 'pointer',
            }}>プロフィール編集</button>
            <button style={{
              padding: '9px 14px', borderRadius: 10,
              background: T.paper, color: T.ink,
              border: `1px solid ${T.hairlineStrong}`,
              fontSize: 12, fontWeight: 500,
            }}>シェア</button>
          </div>
        </div>

        {/* Dogs carousel */}
        <div style={{ marginTop: 24 }}>
          <div style={{
            padding: '0 20px 10px', display: 'flex',
            alignItems: 'baseline', justifyContent: 'space-between',
          }}>
            <div style={{
              fontFamily: F.serif, fontSize: 16, fontWeight: 500, color: T.ink,
            }}>マイわん <span style={{ color: T.ink50, fontFamily: F.mono, fontSize: 12 }}>2</span></div>
            <div style={{ fontSize: 11, color: T.terracotta, fontWeight: 500 }}>+ 追加</div>
          </div>
          <div style={{
            display: 'flex', gap: 10, padding: '0 20px 4px',
            overflowX: 'auto',
          }}>
            <Tap to="dog-profile"><DogCard name="エマ" breed="柴犬" weight="9.5" src={P.shibaPort} active/></Tap>
            <Tap to="dog-profile"><DogCard name="モカ" breed="ヨーキー" weight="2.7" src={P.yorkie}/></Tap>
            <Tap to="new-dog"><DogCard placeholder/></Tap>
          </div>
        </div>

        {/* Tab switch */}
        <div style={{
          marginTop: 24, padding: '0 20px',
          borderBottom: `1px solid ${T.hairline}`,
          display: 'flex', gap: 24,
        }}>
          <TabSegment label="スナップ" count="87" active/>
          <TabSegment label="アイテム" count="42"/>
          <TabSegment label="保存" count="218"/>
        </div>

        {/* Snap grid */}
        <div style={{
          padding: '14px 20px 16px',
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4,
        }}>
          {[
            P.shibaPark, P.shibaPort, P.yorkieGrass,
            P.shibaPort, P.shibaPark, P.yorkie,
            P.yorkie, P.shibaPort, P.shibaPark,
          ].map((src, i) => (
            <div key={i} onClick={() => nav.go('detail')} style={{
              aspectRatio: '1', borderRadius: 4, overflow: 'hidden',
              position: 'relative', background: T.ink10, cursor: 'pointer',
            }}>
              <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
            </div>
          ))}
        </div>
      </div>

      <TabBar active="profile"/>
      <HomeBar/>
    </Screen>
  );
}

function Stat2({ v, l }) {
  const T = WS_TOKENS, F = WS_FONTS;
  return (
    <div style={{ flex: 1, textAlign: 'center' }}>
      <div style={{
        fontFamily: F.serif, fontSize: 20, fontWeight: 500, color: T.ink, lineHeight: 1,
      }}>{v}</div>
      <div style={{ fontSize: 10, color: T.ink50, marginTop: 4, letterSpacing: '0.04em' }}>{l}</div>
    </div>
  );
}

function TabSegment({ label, count, active = false }) {
  const T = WS_TOKENS, F = WS_FONTS;
  return (
    <div style={{
      paddingBottom: 10, position: 'relative',
      display: 'flex', alignItems: 'baseline', gap: 5,
      color: active ? T.ink : T.ink50,
    }}>
      <span style={{ fontSize: 12.5, fontWeight: active ? 600 : 500 }}>{label}</span>
      <span style={{ fontSize: 10, fontFamily: F.mono, opacity: 0.5 }}>{count}</span>
      {active && <div style={{
        position: 'absolute', bottom: -1, left: 0, right: 0, height: 2,
        background: T.ink, borderRadius: 2,
      }}/>}
    </div>
  );
}

function DogCard({ name, breed, weight, src, active, placeholder }) {
  const T = WS_TOKENS, F = WS_FONTS;
  if (placeholder) return (
    <div style={{
      width: 88, height: 110, borderRadius: 14,
      border: `1px dashed ${T.hairlineStrong}`,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 4, color: T.ink50, flexShrink: 0,
    }}>
      {Icons.plus(T.ink50)}
      <span style={{ fontSize: 10 }}>追加</span>
    </div>
  );
  return (
    <div style={{
      width: 88, padding: 8, borderRadius: 14,
      background: active ? T.paper : 'transparent',
      border: active ? `1px solid ${T.hairlineStrong}` : `1px solid transparent`,
      flexShrink: 0,
      boxShadow: active ? '0 4px 14px rgba(31,26,20,0.06)' : 'none',
    }}>
      <div style={{
        width: '100%', aspectRatio: '1', borderRadius: 10,
        backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center',
        marginBottom: 6,
      }}/>
      <div style={{ fontSize: 12, fontWeight: 600, color: T.ink, textAlign: 'center' }}>{name}</div>
      <div style={{
        fontSize: 9, color: T.ink50, textAlign: 'center', marginTop: 2, fontFamily: F.mono,
      }}>{breed} · {weight}kg</div>
    </div>
  );
}

// ─── OTHER USER PROFILE ─────────────────────────────────────
function OtherProfileScreen() {
  const T = WS_TOKENS, F = WS_FONTS, P = WS_PHOTOS;
  const nav = useNav();
  return (
    <Screen bg={T.cream}>
      <StatusBar/>
      <AppBar title="@biscuit.theyork" dense/>

      <div style={{
        position: 'absolute', top: 90, bottom: 84, left: 0, right: 0,
        overflowY: 'auto',
      }}>
        <div style={{ padding: '8px 20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 76, height: 76, borderRadius: 38,
              background: `url(${P.yorkie}) center/cover`,
              border: `1px solid ${T.hairline}`,
            }}/>
            <div style={{ flex: 1, display: 'flex', gap: 6 }}>
              <Stat2 v="142" l="投稿"/>
              <Stat2 v="8.4k" l="フォロワー"/>
              <Stat2 v="312" l="フォロー中"/>
            </div>
          </div>
          <div style={{
            fontFamily: F.serif, fontSize: 24, fontWeight: 500,
            color: T.ink, marginTop: 14,
          }}>Mio</div>
          <div style={{
            fontSize: 11.5, color: T.ink70, lineHeight: 1.55, marginTop: 4,
          }}>表参道在住 · ヨーキー専門コーデ。<br/>愛犬: ビスケット (XS)</div>

          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button style={{
              flex: 1, padding: '10px 14px', borderRadius: 999,
              background: T.ink, color: T.cream, border: 'none',
              fontSize: 12.5, fontWeight: 600, fontFamily: F.sans,
            }}>フォローする</button>
            <button style={{
              flex: 1, padding: '10px 14px', borderRadius: 999,
              background: T.paper, color: T.ink,
              border: `1px solid ${T.hairlineStrong}`,
              fontSize: 12.5, fontWeight: 500,
            }}>メッセージ</button>
            <button style={{
              width: 40, padding: '10px', borderRadius: 999,
              background: T.paper, border: `1px solid ${T.hairlineStrong}`,
              color: T.ink,
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="3" cy="7" r="1.2" fill="currentColor"/>
                <circle cx="7" cy="7" r="1.2" fill="currentColor"/>
                <circle cx="11" cy="7" r="1.2" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Dogs */}
        <div style={{ marginTop: 22 }}>
          <div style={{
            padding: '0 20px 10px',
          }}>
            <div style={{
              fontFamily: F.serif, fontSize: 16, fontWeight: 500, color: T.ink,
            }}>Mioの愛犬</div>
          </div>
          <div style={{ padding: '0 20px', display: 'flex', gap: 10 }}>
            <DogCard name="ビスケット" breed="ヨーキー" weight="2.7" src={P.yorkie} active/>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          marginTop: 24, padding: '0 20px',
          borderBottom: `1px solid ${T.hairline}`,
          display: 'flex', gap: 24,
        }}>
          <TabSegment label="スナップ" count="142" active/>
          <TabSegment label="サイズ感" count="36"/>
          <TabSegment label="ブランド" count="18"/>
        </div>

        {/* Snap grid */}
        <div style={{
          padding: '14px 20px',
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4,
        }}>
          {[P.yorkie, P.yorkieGrass, P.yorkie, P.yorkieGrass, P.yorkie, P.yorkieGrass,
            P.yorkie, P.yorkieGrass, P.yorkie].map((src, i) => (
            <div key={i} onClick={() => nav.go('detail')} style={{
              aspectRatio: '1', borderRadius: 4, overflow: 'hidden', background: T.ink10, cursor: 'pointer',
            }}>
              <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
            </div>
          ))}
        </div>
      </div>
      <HomeBar/>
    </Screen>
  );
}

// ─── EDIT MY PROFILE ────────────────────────────────────────
function EditProfileScreen() {
  const T = WS_TOKENS, F = WS_FONTS, P = WS_PHOTOS;
  const nav = useNav();
  return (
    <Screen bg={T.creamSoft}>
      <StatusBar/>
      <AppBar title="プロフィール編集" trailing={
        <button onClick={() => nav.back()} style={{
          padding: '7px 14px', borderRadius: 999, background: T.ink, color: T.cream,
          fontSize: 12, fontWeight: 600, border: 'none', fontFamily: F.sans,
          cursor: 'pointer',
        }}>保存</button>
      }/>

      <div style={{
        position: 'absolute', top: 100, bottom: 28, left: 0, right: 0,
        overflowY: 'auto', padding: '0 20px 20px',
      }}>
        {/* Avatar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 22 }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 96, height: 96, borderRadius: 48,
              background: T.cream, border: `1px solid ${T.hairline}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: F.serif, fontSize: 40, color: T.ink,
            }}>k</div>
            <div style={{
              position: 'absolute', bottom: -2, right: -2,
              width: 30, height: 30, borderRadius: 15,
              background: T.terracotta, color: '#fff',
              border: `3px solid ${T.creamSoft}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3 5h2l1-1.5h4L11 5h2v8H3V5z" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round"/>
                <circle cx="8" cy="9" r="2" stroke="#fff" strokeWidth="1.4"/>
              </svg>
            </div>
          </div>
        </div>

        <FormSection title="基本情報">
          <TextField label="表示名" value="こうし"/>
          <TextField label="ユーザーID" value="koushi_to_ema" suffix=".wansnap"/>
          <TextField label="自己紹介" multiline rows={3}
            value="新宿在住の柴犬オーナー。リネン素材と帆布バッグが好き。"
            hint="42 / 160"/>
          <TextField label="リンク" placeholder="https://" hint="任意"/>
        </FormSection>

        <FormSection title="プライバシー">
          <ToggleRow label="非公開アカウント" sub="承認したフォロワーのみ閲覧可能"/>
          <ToggleRow label="他人のタグ付けを許可" sub="他人のスナップでタグ付けされた時に通知" on/>
          <ToggleRow label="連絡先からの検索" sub="電話・メールから見つけられる" on/>
        </FormSection>
      </div>
      <HomeBar/>
    </Screen>
  );
}

function ToggleRow({ label, sub, on = false }) {
  const T = WS_TOKENS;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 14px', borderRadius: 12,
      background: T.paper, border: `1px solid ${T.hairline}`,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: T.ink }}>{label}</div>
        <div style={{ fontSize: 10.5, color: T.ink50, marginTop: 3 }}>{sub}</div>
      </div>
      <div style={{
        width: 40, height: 24, borderRadius: 12,
        background: on ? T.forest : T.ink10,
        position: 'relative', flexShrink: 0,
      }}>
        <div style={{
          position: 'absolute', top: 2, left: on ? 18 : 2,
          width: 20, height: 20, borderRadius: 10,
          background: '#fff', transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}/>
      </div>
    </div>
  );
}

// ─── ALBUM ──────────────────────────────────────────────────
function AlbumScreen() {
  const T = WS_TOKENS, F = WS_FONTS, P = WS_PHOTOS;
  const nav = useNav();

  const Month = ({ year, month, count, photos, big = false }) => (
    <div style={{ marginBottom: 28 }}>
      <div style={{
        padding: '0 20px 12px', display: 'flex',
        alignItems: 'baseline', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{
            fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
            color: T.ink50, fontWeight: 500,
          }}>{year}</div>
          <div style={{
            fontFamily: F.serif, fontSize: big ? 28 : 22, fontWeight: 500,
            color: T.ink, lineHeight: 1, marginTop: 4, letterSpacing: '-0.01em',
          }}>{month}</div>
        </div>
        <div style={{
          fontSize: 10.5, color: T.ink50, fontFamily: F.mono,
        }}>{count} snaps</div>
      </div>
      <div style={{ padding: '0 20px', display: big ? 'grid' : 'grid',
        gridTemplateColumns: big ? '2fr 1fr' : 'repeat(4, 1fr)',
        gap: 4,
      }}>
        {photos.map((src, i) => (
          <div key={i} onClick={() => nav.go('detail')} style={{
            aspectRatio: big && i === 0 ? '4 / 5' : '1',
            borderRadius: 6, overflow: 'hidden', background: T.ink10,
            gridRow: big && i === 0 ? 'span 2' : 'auto',
            cursor: 'pointer',
          }}>
            <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Screen bg={T.cream}>
      <StatusBar/>
      <div style={{
        padding: '4px 20px 12px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{
            fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
            color: T.ink50, fontWeight: 500,
          }}>Album · 成長記録</div>
          <div style={{
            fontFamily: F.serif, fontSize: 28, fontWeight: 500, color: T.ink, lineHeight: 1, marginTop: 4,
          }}>エマと、87日。</div>
        </div>
        <IconBtn>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M3 5h2l1-1.5h4L11 5h2v8H3V5z" stroke={T.ink} strokeWidth="1.5" strokeLinejoin="round"/>
            <circle cx="8" cy="9" r="2.5" stroke={T.ink} strokeWidth="1.5"/>
          </svg>
        </IconBtn>
      </div>

      {/* Dog filter chips */}
      <div style={{
        display: 'flex', gap: 6, padding: '4px 20px 12px',
        overflowX: 'auto',
      }}>
        <DogChip name="エマ" breed="柴犬" src={P.shibaPort} active/>
        <DogChip name="モカ" breed="ヨーキー" src={P.yorkie}/>
      </div>

      <div style={{
        position: 'absolute', top: 174, bottom: 84, left: 0, right: 0,
        overflowY: 'auto',
      }}>
        <Month year="2026" month="May" count="12" big
          photos={[P.shibaPark, P.shibaPort, P.shibaPark, P.yorkieGrass, P.shibaPark]}/>
        <Month year="2026" month="April" count="18"
          photos={[P.shibaPort, P.shibaPark, P.shibaPort, P.shibaPark,
            P.shibaPark, P.shibaPort, P.shibaPark, P.shibaPort]}/>
        <Month year="2026" month="March" count="22"
          photos={[P.shibaPark, P.shibaPort, P.shibaPark, P.shibaPort,
            P.shibaPort, P.shibaPark, P.shibaPort, P.shibaPark]}/>
      </div>

      <TabBar active="profile"/>
      <HomeBar/>
    </Screen>
  );
}

Object.assign(window, {
  MyProfileScreen, OtherProfileScreen, EditProfileScreen, AlbumScreen,
  Stat2, TabSegment, DogCard, ToggleRow,
});
