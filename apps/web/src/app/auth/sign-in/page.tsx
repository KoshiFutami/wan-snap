'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { saveTokens } from '../../../lib/auth-store';

const T = {
  ink: '#1F1A14',
  ink70: '#4A4239',
  ink50: '#7E7567',
  ink30: '#B8AE9E',
  paper: '#FFFEFB',
  cream: '#F4EDE0',
  creamSoft: '#FAF5EA',
  terracotta: '#B95A3D',
  hairline: 'rgba(31,26,20,0.08)',
  hairlineStrong: 'rgba(31,26,20,0.14)',
};

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const tokens = await api.auth.signIn({ email, password });
      saveTokens(tokens.accessToken, tokens.refreshToken);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ログインに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: T.cream, position: 'relative', overflow: 'hidden' }}>
      {/* ヒーロー — 斜め犬写真 */}
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
          padding: '32px 16px 40px',
          boxShadow: '0 -20px 40px rgba(31,26,20,0.06)',
        }}
      >
        {/* ロゴ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill={T.ink}>
            <ellipse cx="6" cy="9" rx="2" ry="2.6" />
            <ellipse cx="11" cy="6.4" rx="2" ry="2.6" />
            <ellipse cx="16.3" cy="7.6" rx="2" ry="2.6" />
            <ellipse cx="20" cy="11.5" rx="1.8" ry="2.3" />
            <path d="M12 11c-3.5 0-6.5 2.6-6.5 5.8 0 2 1.5 3.4 3.5 3.4 1.2 0 2.2-.6 3-.6s1.8.6 3 .6c2 0 3.5-1.4 3.5-3.4 0-3.2-3-5.8-6.5-5.8z" />
          </svg>
          <span
            style={{
              fontFamily: 'var(--font-serif, serif)',
              fontWeight: 600,
              fontSize: 18,
              letterSpacing: '-0.01em',
              color: T.ink,
            }}
          >
            Wan<span style={{ opacity: 0.45, margin: '0 1px' }}>·</span>Snap
          </span>
        </div>

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

        {!showEmailForm ? (
          <>
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                style={{
                  padding: '13px 16px',
                  borderRadius: 999,
                  background: T.ink,
                  color: T.cream,
                  fontSize: 13.5,
                  fontWeight: 600,
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path
                    fill={T.cream}
                    d="M17.05 20.28c-.98.95-2.05.86-3.08.42-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.42C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
                  />
                </svg>
                Appleで続ける
              </button>
              <button
                style={{
                  padding: '13px 16px',
                  borderRadius: 999,
                  background: T.paper,
                  color: T.ink,
                  border: `1px solid ${T.hairlineStrong}`,
                  fontSize: 13.5,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.5 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.9c-.25 1.37-1.02 2.53-2.18 3.31v2.75h3.53c2.07-1.9 3.26-4.71 3.26-8.07z" />
                  <path fill="#34A853" d="M12 23c2.95 0 5.42-.98 7.23-2.66l-3.53-2.75c-.98.66-2.23 1.04-3.7 1.04-2.85 0-5.27-1.92-6.13-4.5H2.22v2.84A10.99 10.99 0 0012 23z" />
                  <path fill="#FBBC05" d="M5.87 14.13a6.6 6.6 0 010-4.25V7.04H2.22a11 11 0 000 9.93l3.65-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.61 0 3.05.55 4.18 1.64l3.13-3.13C17.42 2.06 14.95 1 12 1A11 11 0 002.22 7.04l3.65 2.84C6.73 7.3 9.15 5.38 12 5.38z" />
                </svg>
                Googleで続ける
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
              <div style={{ flex: 1, height: 1, background: T.hairline }} />
              <div style={{ fontSize: 10.5, color: T.ink50, letterSpacing: '0.1em' }}>または</div>
              <div style={{ flex: 1, height: 1, background: T.hairline }} />
            </div>

            <button
              onClick={() => setShowEmailForm(true)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 999,
                background: 'transparent',
                color: T.ink,
                fontSize: 12.5,
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              メールアドレスでサインイン →
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <FieldRow label="メールアドレス">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={inputStyle}
              />
            </FieldRow>
            <FieldRow label="パスワード">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={inputStyle}
              />
            </FieldRow>

            {error && (
              <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(185,90,61,0.08)', border: `1px solid rgba(185,90,61,0.2)`, fontSize: 12.5, color: T.terracotta }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px 22px',
                borderRadius: 999,
                background: T.ink,
                color: T.cream,
                fontSize: 13.5,
                fontWeight: 600,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              {loading ? 'ログイン中...' : 'ログイン'}
              {!loading && (
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowEmailForm(false)}
              style={{ background: 'none', border: 'none', color: T.ink50, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              ← 戻る
            </button>
          </form>
        )}

        <div style={{ fontSize: 10, color: T.ink50, textAlign: 'center', marginTop: 16, lineHeight: 1.5 }}>
          続行することで、
          <span style={{ color: T.ink, textDecoration: 'underline' }}>利用規約</span>
          {' '}と{' '}
          <span style={{ color: T.ink, textDecoration: 'underline' }}>プライバシーポリシー</span>
          {' '}に同意したものとみなされます
        </div>

        <div style={{ marginTop: 14, textAlign: 'center', fontSize: 12.5, color: T.ink50 }}>
          アカウントをお持ちでない方は{' '}
          <Link href="/auth/sign-up" style={{ color: T.ink, fontWeight: 600, textDecoration: 'none' }}>
            新規登録
          </Link>
        </div>
      </div>
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 11.5, fontWeight: 500, color: T.ink, letterSpacing: '0.02em', marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}

const inputStyle: CSSProperties = {
  width: '100%',
  background: T.paper,
  borderRadius: 12,
  border: `1px solid ${T.hairline}`,
  padding: '0 14px',
  height: 46,
  fontSize: 14,
  color: T.ink,
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
};
