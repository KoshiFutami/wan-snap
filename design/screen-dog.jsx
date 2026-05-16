// Dog: new + edit

function NewDogScreen() {
  const T = WS_TOKENS, F = WS_FONTS, P = WS_PHOTOS;
  const nav = useNav();
  return (
    <Screen bg={T.cream}>
      <StatusBar/>
      <AppBar title="愛犬を登録" leading="close" trailing={
        <button onClick={() => nav.reset('home')} style={{
          padding: '7px 14px', borderRadius: 999,
          background: T.ink, color: T.cream,
          fontSize: 12, fontWeight: 600, border: 'none', fontFamily: F.sans,
          cursor: 'pointer',
        }}>完了</button>
      }/>

      <div style={{
        position: 'absolute', top: 100, bottom: 28, left: 0, right: 0,
        overflowY: 'auto', padding: '0 20px 20px',
      }}>
        {/* Step indicator */}
        <div style={{ marginBottom: 18 }}>
          <div style={{
            fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
            color: T.ink50, fontWeight: 500, marginBottom: 8,
          }}>step 2 / 3 · 愛犬情報</div>
          <div style={{ display: 'flex', gap: 4 }}>
            <div style={{ flex: 1, height: 3, borderRadius: 3, background: T.ink }}/>
            <div style={{ flex: 1, height: 3, borderRadius: 3, background: T.ink }}/>
            <div style={{ flex: 1, height: 3, borderRadius: 3, background: T.ink10 }}/>
          </div>
        </div>

        {/* Avatar upload */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 110, height: 110, borderRadius: 55,
              backgroundImage: `url(${P.shibaPort})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              border: `3px solid ${T.paper}`,
              boxShadow: `0 0 0 1px ${T.hairline}, 0 6px 16px rgba(31,26,20,0.08)`,
            }}/>
            <div style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 36, height: 36, borderRadius: 18,
              background: T.terracotta, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `3px solid ${T.cream}`,
            }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 5h2l1-1.5h4L11 5h2v8H3V5z" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round"/>
                <circle cx="8" cy="9" r="2.2" stroke="#fff" strokeWidth="1.4"/>
              </svg>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <TextField label="名前" value="エマ" required hint="3文字以内推奨"/>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <SelectField label="犬種" value="柴犬" required/>
            <SelectField label="性別" value="女の子"/>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <TextField label="体重" value="9.5" suffix="kg" required/>
            <TextField label="胴囲" value="48" suffix="cm"/>
            <TextField label="着丈" value="35" suffix="cm"/>
          </div>
          <TextField label="毛色" value="赤"/>
          <SelectField label="誕生日" value="2023年12月3日"/>

          {/* Size preview card */}
          <div style={{
            marginTop: 4, padding: '14px 14px',
            background: T.creamSoft, borderRadius: 14,
            border: `1px solid ${T.hairline}`,
          }}>
            <div style={{
              fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
              color: T.ink50, fontWeight: 500, marginBottom: 8,
            }}>サイズ推定</div>
            <div style={{
              display: 'flex', alignItems: 'baseline', gap: 12,
            }}>
              <div style={{
                fontFamily: F.serif, fontSize: 28, fontWeight: 500,
                color: T.terracotta, letterSpacing: '-0.01em', lineHeight: 1,
              }}>M</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: T.ink }}>標準体型 · 柴犬の平均的なサイズ</div>
                <div style={{
                  fontSize: 10, color: T.ink50, marginTop: 3,
                  fontFamily: F.mono,
                }}>9.5kg / 48cm — 同犬種平均値内</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <HomeBar/>
    </Screen>
  );
}

function EditDogScreen() {
  const T = WS_TOKENS, F = WS_FONTS, P = WS_PHOTOS;
  const nav = useNav();
  return (
    <Screen bg={T.creamSoft}>
      <StatusBar/>
      <AppBar title="エマのプロフィール" trailing={
        <button onClick={() => nav.back()} style={{
          padding: '7px 14px', borderRadius: 999,
          background: T.ink, color: T.cream,
          fontSize: 12, fontWeight: 600, border: 'none', fontFamily: F.sans,
          cursor: 'pointer',
        }}>保存</button>
      }/>

      <div style={{
        position: 'absolute', top: 100, bottom: 28, left: 0, right: 0,
        overflowY: 'auto', padding: '0 20px 20px',
      }}>
        {/* Avatar + name banner */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '16px', borderRadius: 16,
          background: T.paper, border: `1px solid ${T.hairline}`, marginBottom: 22,
        }}>
          <div style={{ position: 'relative' }}>
            <DogAvatar src={P.shibaPort} size={64}/>
            <div style={{
              position: 'absolute', bottom: -4, right: -4,
              width: 24, height: 24, borderRadius: 12,
              background: T.ink, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `2px solid ${T.paper}`,
            }}>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M2 4h2l1-1h2l1 1h2v6H2V4z" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: F.serif, fontSize: 22, fontWeight: 500, color: T.ink, lineHeight: 1,
            }}>エマ</div>
            <div style={{ fontSize: 11, color: T.ink50, marginTop: 5 }}>
              柴犬 · ♀ · 2y 4m
            </div>
            <div style={{ fontSize: 10, color: T.ink50, marginTop: 4, fontFamily: F.mono }}>
              登録: 2024.03.12
            </div>
          </div>
        </div>

        {/* Form sections */}
        <FormSection title="基本情報">
          <TextField label="名前" value="エマ"/>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <SelectField label="犬種" value="柴犬"/>
            <SelectField label="性別" value="女の子"/>
          </div>
          <TextField label="毛色" value="赤"/>
          <SelectField label="誕生日" value="2023年12月3日"/>
        </FormSection>

        <FormSection title="サイズ" subtitle="服選びに使用">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <TextField label="体重" value="9.5" suffix="kg"/>
            <TextField label="胴囲" value="48" suffix="cm"/>
            <TextField label="着丈" value="35" suffix="cm"/>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <TextField label="首囲" value="32" suffix="cm"/>
            <SelectField label="サイズ目安" value="M"/>
          </div>
        </FormSection>

        <FormSection title="プロフィール">
          <TextField label="自己紹介" multiline rows={3} value="朝はいつも代々木公園を散歩。少しゆとりのある服が好み。リネン素材が大好物。"/>
        </FormSection>

        {/* Danger */}
        <button style={{
          width: '100%', padding: '14px', borderRadius: 12,
          background: 'transparent', color: T.terracotta,
          border: `1px solid ${T.terracotta}`,
          fontSize: 12.5, fontWeight: 500, fontFamily: F.sans, marginTop: 8,
        }}>エマのプロフィールを削除</button>
      </div>
      <HomeBar/>
    </Screen>
  );
}

function FormSection({ title, subtitle, children }) {
  const T = WS_TOKENS, F = WS_FONTS;
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12,
      }}>
        <div style={{
          fontFamily: F.serif, fontSize: 16, fontWeight: 500, color: T.ink, lineHeight: 1,
        }}>{title}</div>
        {subtitle && <div style={{ fontSize: 10.5, color: T.ink50 }}>{subtitle}</div>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {children}
      </div>
    </div>
  );
}

Object.assign(window, { NewDogScreen, EditDogScreen, FormSection });
