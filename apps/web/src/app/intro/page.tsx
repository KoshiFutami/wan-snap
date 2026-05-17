'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WanSnapLogo } from '../../components/wan-snap-logo';

const T = {
  ink: '#1F1A14',
  ink70: '#4A4239',
  ink50: '#7E7567',
  ink10: '#E8E0D0',
  paper: '#FFFEFB',
  cream: '#F4EDE0',
  creamSoft: '#FAF5EA',
  terracotta: '#B95A3D',
  hairlineStrong: 'rgba(31,26,20,0.14)',
};

const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill={T.ink10}>
        <ellipse cx="6" cy="9" rx="2" ry="2.6" />
        <ellipse cx="11" cy="6.4" rx="2" ry="2.6" />
        <ellipse cx="16.3" cy="7.6" rx="2" ry="2.6" />
        <ellipse cx="20" cy="11.5" rx="1.8" ry="2.3" />
        <path d="M12 11c-3.5 0-6.5 2.6-6.5 5.8 0 2 1.5 3.4 3.5 3.4 1.2 0 2.2-.6 3-.6s1.8.6 3 .6c2 0 3.5-1.4 3.5-3.4 0-3.2-3-5.8-6.5-5.8z" />
      </svg>
    ),
    label: '犬種で探す',
    desc: '同じ犬種の子のコーデが一覧で見られる',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="14" rx="2.5" stroke={T.ink10} strokeWidth="1.6" />
        <circle cx="12" cy="12" r="3.5" stroke={T.ink10} strokeWidth="1.6" />
        <circle cx="17.5" cy="7.5" r="1" fill={T.ink10} />
      </svg>
    ),
    label: 'コーデを記録',
    desc: 'アイテムとサイズ感をまとめて残せる',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="8" r="3" stroke={T.ink10} strokeWidth="1.5" />
        <circle cx="17" cy="8" r="2.5" stroke={T.ink10} strokeWidth="1.5" />
        <path d="M3 19c.7-3 3-4.5 6-4.5s5.3 1.5 6 4.5" stroke={T.ink10} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M17 14c1.5.3 3 1.5 3.5 3.5" stroke={T.ink10} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    label: 'つながる',
    desc: '気になるオーナーをフォローしよう',
  },
] as const;

export default function IntroPage() {
  const router = useRouter();

  const handleBrowse = () => {
    sessionStorage.setItem('wan_snap_seen_intro', '1');
    router.push('/');
  };

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: T.cream,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 写真コラージュ */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 380,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 36,
            right: -24,
            width: 230,
            height: 290,
            borderRadius: 22,
            background: `url(https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&auto=format&fit=crop) center/cover`,
            transform: 'rotate(6deg)',
            boxShadow: '0 14px 36px rgba(31,26,20,0.18)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 90,
            left: -24,
            width: 175,
            height: 225,
            borderRadius: 18,
            background: `url(https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&auto=format&fit=crop) center/cover`,
            transform: 'rotate(-8deg)',
            boxShadow: '0 14px 36px rgba(31,26,20,0.18)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 210,
            left: 135,
            width: 108,
            height: 108,
            borderRadius: 16,
            background: `url(https://images.unsplash.com/photo-1534361960057-19f4434a4c23?w=600&auto=format&fit=crop) center/cover`,
            transform: 'rotate(3deg)',
            boxShadow: '0 8px 22px rgba(31,26,20,0.15)',
          }}
        />
        {/* フェードアウト */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 100,
            background: `linear-gradient(to bottom, transparent, ${T.cream})`,
          }}
        />
      </div>

      {/* ボトムシート */}
      <div
        style={{
          position: 'absolute',
          top: 300,
          bottom: 0,
          left: 0,
          right: 0,
          background: T.creamSoft,
          borderRadius: '32px 32px 0 0',
          padding: '28px 20px calc(env(safe-area-inset-bottom, 16px) + 32px)',
          boxShadow: '0 -20px 40px rgba(31,26,20,0.06)',
          overflowY: 'auto',
        }}
      >
        <WanSnapLogo />

        <div
          style={{
            fontFamily: 'var(--font-serif, serif)',
            fontSize: 30,
            fontWeight: 500,
            color: T.ink,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            marginTop: 20,
          }}
        >
          愛犬の今日の<br />
          一枚を、世界へ<span style={{ color: T.terracotta }}>。</span>
        </div>

        <div style={{ fontSize: 12.5, color: T.ink70, marginTop: 10, lineHeight: 1.65 }}>
          犬種ごとに、サイズ感と着こなしが見つかる。<br />
          愛犬家のためのファッションスナップ・コミュニティ。
        </div>

        {/* フィーチャーカード */}
        <div
          style={{
            display: 'flex',
            gap: 10,
            marginTop: 22,
            overflowX: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            paddingBottom: 4,
          }}
        >
          {FEATURES.map(({ icon, label, desc }) => (
            <div
              key={label}
              style={{
                flexShrink: 0,
                background: T.paper,
                border: `1px solid ${T.hairlineStrong}`,
                borderRadius: 16,
                padding: '14px 14px 12px',
                width: 132,
              }}
            >
              {icon}
              <div style={{ marginTop: 8, fontSize: 12, fontWeight: 600, color: T.ink }}>{label}</div>
              <div style={{ marginTop: 4, fontSize: 10.5, color: T.ink50, lineHeight: 1.45 }}>{desc}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link
            href="/auth/sign-up"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '14px 22px',
              borderRadius: 999,
              background: T.ink,
              color: T.cream,
              fontSize: 13.5,
              fontWeight: 600,
              textDecoration: 'none',
              letterSpacing: '0.02em',
            }}
          >
            無料で新規登録
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

          <Link
            href="/auth/sign-in"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '13px 22px',
              borderRadius: 999,
              background: 'transparent',
              color: T.ink,
              border: `1.5px solid ${T.hairlineStrong}`,
              fontSize: 13.5,
              fontWeight: 600,
              textDecoration: 'none',
              letterSpacing: '0.02em',
            }}
          >
            ログイン
          </Link>
        </div>

        <button
          onClick={handleBrowse}
          style={{
            marginTop: 16,
            width: '100%',
            background: 'none',
            border: 'none',
            fontSize: 12.5,
            color: T.ink50,
            cursor: 'pointer',
            fontFamily: 'inherit',
            padding: '8px 0',
            textAlign: 'center',
          }}
        >
          まずは見てみる →
        </button>

        <div style={{ fontSize: 10, color: T.ink50, textAlign: 'center', marginTop: 10, lineHeight: 1.6 }}>
          新規登録することで、
          <span style={{ color: T.ink, textDecoration: 'underline' }}>利用規約</span>と
          <span style={{ color: T.ink, textDecoration: 'underline' }}>プライバシーポリシー</span>
          に同意したものとみなされます
        </div>
      </div>
    </div>
  );
}
