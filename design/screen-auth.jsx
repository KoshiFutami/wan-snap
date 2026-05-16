// Auth screens: Sign-in, Sign-up

function SignInScreen() {
  const T = WS_TOKENS, F = WS_FONTS, P = WS_PHOTOS;
  const nav = useNav();
  return (
    <Screen bg={T.cream}>
      <StatusBar/>

      {/* Top hero — overlapping dog photo */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 320,
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 70, right: -40, width: 280, height: 280,
          borderRadius: 24,
          backgroundImage: `url(${P.shibaPort})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          transform: 'rotate(5deg)',
        }}/>
        <div style={{
          position: 'absolute', top: 110, left: -30, width: 180, height: 220,
          borderRadius: 18,
          backgroundImage: `url(${P.yorkie})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          transform: 'rotate(-8deg)',
        }}/>
      </div>

      {/* Bottom sheet content */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: T.creamSoft,
        borderRadius: '32px 32px 0 0',
        padding: '32px 24px 28px',
        boxShadow: '0 -20px 40px rgba(31,26,20,0.06)',
      }}>
        <Logo size={20}/>
        <div style={{
          fontFamily: F.serif, fontSize: 34, fontWeight: 500,
          color: T.ink, letterSpacing: '-0.02em', lineHeight: 1.05,
          marginTop: 24,
        }}>
          愛犬の今日の<br/>一枚を、世界へ<span style={{ color: T.terracotta }}>。</span>
        </div>
        <div style={{
          fontSize: 12.5, color: T.ink70, marginTop: 10, lineHeight: 1.5,
        }}>
          サイズ感とコーデが見つかる、<br/>
          ファッションスナップ・コミュニティ。
        </div>

        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={() => nav.reset('home')} style={{
            padding: '13px 16px', borderRadius: 999, background: T.ink, color: T.cream,
            fontSize: 13.5, fontWeight: 600, border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontFamily: F.sans, cursor: 'pointer',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill={T.cream} d="M17.05 20.28c-.98.95-2.05.86-3.08.42-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.42C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            Appleで続ける
          </button>
          <button onClick={() => nav.reset('home')} style={{
            padding: '13px 16px', borderRadius: 999,
            background: T.paper, color: T.ink, border: `1px solid ${T.hairlineStrong}`,
            fontSize: 13.5, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontFamily: F.sans, cursor: 'pointer',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.5 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.9c-.25 1.37-1.02 2.53-2.18 3.31v2.75h3.53c2.07-1.9 3.26-4.71 3.26-8.07z"/>
              <path fill="#34A853" d="M12 23c2.95 0 5.42-.98 7.23-2.66l-3.53-2.75c-.98.66-2.23 1.04-3.7 1.04-2.85 0-5.27-1.92-6.13-4.5H2.22v2.84A10.99 10.99 0 0012 23z"/>
              <path fill="#FBBC05" d="M5.87 14.13a6.6 6.6 0 010-4.25V7.04H2.22a11 11 0 000 9.93l3.65-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.61 0 3.05.55 4.18 1.64l3.13-3.13C17.42 2.06 14.95 1 12 1A11 11 0 002.22 7.04l3.65 2.84C6.73 7.3 9.15 5.38 12 5.38z"/>
            </svg>
            Googleで続ける
          </button>
        </div>

        {/* Divider */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0',
        }}>
          <div style={{ flex: 1, height: 1, background: T.hairline }}/>
          <div style={{ fontSize: 10.5, color: T.ink50, letterSpacing: '0.1em' }}>または</div>
          <div style={{ flex: 1, height: 1, background: T.hairline }}/>
        </div>

        <button onClick={() => nav.go('sign-up')} style={{
          width: '100%', padding: '12px 16px', borderRadius: 999,
          background: 'transparent', color: T.ink,
          fontSize: 12.5, fontWeight: 500, border: 'none', cursor: 'pointer',
        }}>
          メールアドレスでサインイン →
        </button>

        <div style={{
          fontSize: 10, color: T.ink50, textAlign: 'center', marginTop: 14,
          lineHeight: 1.5,
        }}>
          続行することで、<span style={{ color: T.ink, textDecoration: 'underline' }}>利用規約</span> と<br/>
          <span style={{ color: T.ink, textDecoration: 'underline' }}>プライバシーポリシー</span> に同意したものとみなされます
        </div>
      </div>

      <HomeBar/>
    </Screen>
  );
}

function SignUpScreen() {
  const T = WS_TOKENS, F = WS_FONTS;
  const nav = useNav();
  return (
    <Screen bg={T.cream}>
      <StatusBar/>
      <AppBar title="新規登録" trailing={<div style={{ width: 40 }}/>}/>

      <div style={{ padding: '8px 20px 24px' }}>
        <div style={{
          fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
          color: T.ink50, fontWeight: 500, marginBottom: 8,
        }}>step 1 / 3</div>
        <div style={{ display: 'flex', gap: 4, marginBottom: 22 }}>
          <div style={{ flex: 1, height: 3, borderRadius: 3, background: T.ink }}/>
          <div style={{ flex: 1, height: 3, borderRadius: 3, background: T.ink10 }}/>
          <div style={{ flex: 1, height: 3, borderRadius: 3, background: T.ink10 }}/>
        </div>
        <div style={{
          fontFamily: F.serif, fontSize: 28, fontWeight: 500,
          color: T.ink, letterSpacing: '-0.015em', lineHeight: 1.1,
        }}>はじめまして、<br/>あなたのこと教えて<span style={{ color: T.terracotta }}>。</span></div>
        <div style={{
          fontSize: 12.5, color: T.ink70, marginTop: 10, lineHeight: 1.5,
        }}>次の画面で愛犬の情報も入れていきます。</div>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <TextField label="お名前" value="こうし" hint=""/>
        <TextField label="ユーザーID" value="koushi_to_ema" suffix=".wansnap" required hint="変更できません"/>
        <TextField label="メールアドレス" value="koushi@example.com" required/>
        <TextField label="パスワード" placeholder="8文字以上" required suffix="◉"/>
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 4,
        }}>
          <div style={{
            width: 18, height: 18, borderRadius: 5, background: T.ink,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, marginTop: 1,
          }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5l2 2 4-4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ fontSize: 11, color: T.ink70, lineHeight: 1.5 }}>
            <span style={{ color: T.ink, fontWeight: 500 }}>利用規約</span>と<span style={{ color: T.ink, fontWeight: 500 }}>プライバシーポリシー</span>に同意します
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '16px 20px 32px',
        background: `linear-gradient(180deg, transparent, ${T.cream} 30%)`,
      }}>
        <PrimaryButton full color={T.ink} fg={T.cream}
          onClick={() => nav.go('new-dog')}
          icon={
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }>
          次へ · 愛犬の情報
        </PrimaryButton>
      </div>
      <HomeBar/>
    </Screen>
  );
}

Object.assign(window, { SignInScreen, SignUpScreen });
