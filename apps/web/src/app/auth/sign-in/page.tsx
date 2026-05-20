'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { supabase } from '../../../lib/supabase';
import { WanSnapLogo } from '../../../components/wan-snap-logo';

const T = {
  ink: '#1F1A14',
  ink70: '#4A4239',
  ink50: '#7E7567',
  paper: '#FFFEFB',
  cream: '#F4EDE0',
  creamSoft: '#FAF5EA',
  terracotta: '#B95A3D',
  green: '#06C755',
  hairline: 'rgba(31,26,20,0.08)',
  hairlineStrong: 'rgba(31,26,20,0.14)',
};

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [magicLinkSending, setMagicLinkSending] = useState(false);
  const [magicLinkError, setMagicLinkError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [lineLoading, setLineLoading] = useState(false);

  const redirectTo =
    typeof window !== 'undefined'
      ? `${window.location.origin}/auth/callback`
      : '/auth/callback';

  const handleGoogle = async () => {
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });
    if (error) setGoogleLoading(false);
  };

  const handleLine = async () => {
    setLineLoading(true);
    // LINE は Supabase の Custom OIDC Provider 経由で設定する。
    // Supabase ダッシュボード → Authentication → Providers → Add custom provider (LINE OIDC) が必要。
    // プロバイダー名は Supabase 管理画面の設定名に合わせること。
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'line' as Parameters<typeof supabase.auth.signInWithOAuth>[0]['provider'],
      options: { redirectTo },
    });
    if (error) setLineLoading(false);
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setMagicLinkError('');
    setMagicLinkSending(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo },
      });
      if (error) {
        setMagicLinkError(error.message);
        return;
      }
      router.push(`/auth/magic-link-sent?email=${encodeURIComponent(email)}`);
    } finally {
      setMagicLinkSending(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: T.cream, position: 'relative', overflow: 'hidden' }}>
      {/* ヒーロー */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 340, overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            top: 60,
            right: -40,
            width: 260,
            height: 260,
            borderRadius: 20,
            background: `url(https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?w=600&auto=format&fit=crop) center/cover`,
            transform: 'rotate(5deg)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 100,
            left: -20,
            width: 160,
            height: 200,
            borderRadius: 16,
            background: `url(https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&auto=format&fit=crop) center/cover`,
            transform: 'rotate(-8deg)',
          }}
        />
      </div>

      {/* ボトムシート */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: T.creamSoft,
          borderRadius: '32px 32px 0 0',
          padding: '32px 20px 48px',
          boxShadow: '0 -20px 40px rgba(31,26,20,0.06)',
        }}
      >
        <WanSnapLogo />

        <div
          style={{
            fontFamily: 'var(--font-serif, serif)',
            fontSize: 32,
            fontWeight: 500,
            color: T.ink,
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            marginTop: 24,
          }}
        >
          愛犬の今日の<br />一枚を、世界へ<span style={{ color: T.terracotta }}>。</span>
        </div>
        <div style={{ fontSize: 12.5, color: T.ink70, marginTop: 10, lineHeight: 1.5 }}>
          サイズ感とコーデが見つかる、<br />
          ファッションスナップ・コミュニティ。
        </div>

        {errorParam && (
          <div style={{ marginTop: 16, padding: '10px 14px', borderRadius: 10, background: 'rgba(185,90,61,0.08)', border: `1px solid rgba(185,90,61,0.2)`, fontSize: 12.5, color: T.terracotta }}>
            ログインに失敗しました。もう一度お試しください。
          </div>
        )}

        {/* ソーシャルログイン */}
        <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <SocialButton
            onClick={handleGoogle}
            loading={googleLoading}
            icon={<GoogleIcon />}
            label="Googleでログイン"
            style={{ background: T.paper, color: T.ink, border: `1px solid ${T.hairlineStrong}` }}
          />
          <SocialButton
            onClick={handleLine}
            loading={lineLoading}
            icon={<LineIcon />}
            label="LINEでログイン"
            style={{ background: T.green, color: '#fff', border: 'none' }}
          />
        </div>

        {/* 区切り線 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
          <div style={{ flex: 1, height: 1, background: T.hairline }} />
          <div style={{ fontSize: 10.5, color: T.ink50, letterSpacing: '0.1em' }}>メールでログイン</div>
          <div style={{ flex: 1, height: 1, background: T.hairline }} />
        </div>

        {/* マジックリンク */}
        <form onSubmit={handleMagicLink} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={inputStyle}
          />

          {magicLinkError && (
            <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(185,90,61,0.08)', border: `1px solid rgba(185,90,61,0.2)`, fontSize: 12.5, color: T.terracotta }}>
              {magicLinkError}
            </div>
          )}

          <button
            type="submit"
            disabled={magicLinkSending}
            style={{
              width: '100%',
              padding: '14px 22px',
              borderRadius: 999,
              background: T.ink,
              color: T.cream,
              fontSize: 13.5,
              fontWeight: 600,
              border: 'none',
              cursor: magicLinkSending ? 'not-allowed' : 'pointer',
              opacity: magicLinkSending ? 0.5 : 1,
              fontFamily: 'inherit',
            }}
          >
            {magicLinkSending ? '送信中...' : 'マジックリンクを送る'}
          </button>
        </form>

        <div style={{ fontSize: 10, color: T.ink50, textAlign: 'center', marginTop: 16, lineHeight: 1.5 }}>
          続行することで、
          <Link href="/terms" style={{ color: T.ink, textDecoration: 'underline' }}>利用規約</Link>
          {' '}と{' '}
          <Link href="/privacy-policy" style={{ color: T.ink, textDecoration: 'underline' }}>プライバシーポリシー</Link>
          {' '}に同意したものとみなされます
        </div>
      </div>
    </div>
  );
}

function SocialButton({
  onClick,
  loading,
  icon,
  label,
  style,
}: {
  onClick: () => void;
  loading: boolean;
  icon: React.ReactNode;
  label: string;
  style: CSSProperties;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      style={{
        width: '100%',
        padding: '13px 16px',
        borderRadius: 999,
        fontSize: 13.5,
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        fontFamily: 'inherit',
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.6 : 1,
        ...style,
      }}
    >
      {!loading && icon}
      {loading ? '処理中...' : label}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.5 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.9c-.25 1.37-1.02 2.53-2.18 3.31v2.75h3.53c2.07-1.9 3.26-4.71 3.26-8.07z" />
      <path fill="#34A853" d="M12 23c2.95 0 5.42-.98 7.23-2.66l-3.53-2.75c-.98.66-2.23 1.04-3.7 1.04-2.85 0-5.27-1.92-6.13-4.5H2.22v2.84A10.99 10.99 0 0012 23z" />
      <path fill="#FBBC05" d="M5.87 14.13a6.6 6.6 0 010-4.25V7.04H2.22a11 11 0 000 9.93l3.65-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.61 0 3.05.55 4.18 1.64l3.13-3.13C17.42 2.06 14.95 1 12 1A11 11 0 002.22 7.04l3.65 2.84C6.73 7.3 9.15 5.38 12 5.38z" />
    </svg>
  );
}

function LineIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
      <path d="M19.952 9.85c0-4.22-4.23-7.653-9.432-7.653C5.316 2.197 1.086 5.63 1.086 9.85c0 3.783 3.354 6.953 7.886 7.553.307.066.726.203.832.466.095.24.062.617.03.86l-.134.808c-.041.24-.19.94.822.513 1.013-.428 5.467-3.22 7.457-5.51 1.376-1.51 2.173-3.046 2.173-4.69z"/>
    </svg>
  );
}

const inputStyle: CSSProperties = {
  width: '100%',
  background: '#FFFEFB',
  borderRadius: 12,
  border: '1px solid rgba(31,26,20,0.08)',
  padding: '0 14px',
  height: 46,
  fontSize: 14,
  color: '#1F1A14',
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
};

export default function SignInPage() {
  return (
    <Suspense>
      <SignInContent />
    </Suspense>
  );
}
