'use client';

import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { saveTokens } from '../../../lib/auth-store';
import { FloatingFormFooter } from '../../../components/floating-form-footer';
import { WanSnapLogo } from '../../../components/wan-snap-logo';

const T = {
  ink: '#1F1A14',
  ink70: '#4A4239',
  ink50: '#7E7567',
  ink10: '#E8E0D0',
  paper: '#FFFEFB',
  cream: '#F4EDE0',
  creamSoft: '#FAF5EA',
  terracotta: '#B95A3D',
  hairline: 'rgba(31,26,20,0.08)',
};

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

export default function SignUpPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const tokens = await api.auth.signUp({ email, password, displayName });
      saveTokens(tokens.accessToken, tokens.refreshToken);
      router.push('/dogs/new');
    } catch (err) {
      setError(err instanceof Error ? err.message : '登録に失敗しました');
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

      {/* ボトムシート — スクロール可能 */}
      <div
        style={{
          position: 'absolute',
          top: 220,
          bottom: 0,
          left: 0,
          right: 0,
          background: T.creamSoft,
          borderRadius: '32px 32px 0 0',
          padding: '32px 16px 120px',
          boxShadow: '0 -20px 40px rgba(31,26,20,0.06)',
          overflowY: 'auto',
        }}
      >
        {/* ロゴ */}
        <WanSnapLogo />

        <div
          style={{
            fontFamily: 'var(--font-serif, serif)',
            fontSize: 28,
            fontWeight: 500,
            color: T.ink,
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            marginTop: 20,
          }}
        >
          はじめまして、<br />あなたのこと教えて<span style={{ color: T.terracotta }}>。</span>
        </div>
        <div style={{ fontSize: 12.5, color: T.ink70, marginTop: 8, lineHeight: 1.5 }}>
          サイズ感とコーデが見つかる、<br />
          ファッションスナップ・コミュニティ。
        </div>

        {/* ステップインジケーター */}
        <div style={{ marginTop: 28, marginBottom: 22 }}>
          <div
            style={{
              fontSize: 10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: T.ink50,
              fontWeight: 500,
              marginBottom: 8,
            }}
          >
            step 1 / 3
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <div style={{ flex: 1, height: 3, borderRadius: 3, background: T.ink }} />
            <div style={{ flex: 1, height: 3, borderRadius: 3, background: T.ink10 }} />
            <div style={{ flex: 1, height: 3, borderRadius: 3, background: T.ink10 }} />
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <FieldRow label="お名前">
          <input
            type="text"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="こうし"
            style={inputStyle}
          />
        </FieldRow>

        <FieldRow label="メールアドレス" required>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={inputStyle}
          />
        </FieldRow>

        <FieldRow label="パスワード" required hint="8文字以上">
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ ...inputStyle, paddingRight: 68 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
              aria-pressed={showPassword}
              style={{
                position: 'absolute',
                top: '50%',
                right: 12,
                transform: 'translateY(-50%)',
                border: 'none',
                background: 'transparent',
                color: T.ink50,
                fontSize: 12,
                fontWeight: 500,
                padding: 0,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {showPassword ? '非表示' : '表示'}
            </button>
          </div>
        </FieldRow>

        {/* 利用規約同意 */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 4 }}>
          <button
            type="button"
            onClick={() => setAgreed((v) => !v)}
            style={{
              width: 18,
              height: 18,
              borderRadius: 5,
              background: agreed ? T.ink : 'transparent',
              border: `1.5px solid ${agreed ? T.ink : T.ink50}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: 1,
              cursor: 'pointer',
            }}
          >
            {agreed && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5l2 2 4-4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
          <div style={{ fontSize: 11, color: T.ink70, lineHeight: 1.55 }}>
            <Link href="/terms" style={{ color: T.ink, fontWeight: 500, textDecoration: 'underline' }}>利用規約</Link>
            と
            <Link href="/privacy-policy" style={{ color: T.ink, fontWeight: 500, textDecoration: 'underline' }}>プライバシーポリシー</Link>
            に同意します
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 10,
              background: 'rgba(185,90,61,0.08)',
              border: `1px solid rgba(185,90,61,0.2)`,
              fontSize: 12.5,
              color: T.terracotta,
            }}
          >
            {error}
          </div>
        )}

        {/* CTA — 固定フッター */}
        <FloatingFormFooter>
          <button
            type="submit"
            disabled={loading || !agreed}
            style={{
              width: '100%',
              padding: '14px 22px',
              borderRadius: 999,
              background: T.ink,
              color: T.cream,
              fontSize: 13.5,
              fontWeight: 600,
              border: 'none',
              cursor: loading || !agreed ? 'not-allowed' : 'pointer',
              opacity: loading || !agreed ? 0.45 : 1,
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              letterSpacing: '0.02em',
            }}
          >
            {loading ? '登録中...' : '次へ · 愛犬の情報'}
            {!loading && (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </FloatingFormFooter>
        </form>

        <div style={{ marginTop: 16, textAlign: 'center', fontSize: 12.5, color: T.ink50 }}>
          すでにアカウントをお持ちの方は{' '}
          <Link href="/auth/sign-in" style={{ color: T.ink, fontWeight: 600, textDecoration: 'none' }}>
            ログイン
          </Link>
        </div>
      </div>
    </div>
  );
}

function FieldRow({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 6,
        }}
      >
        <div style={{ fontSize: 11.5, fontWeight: 500, color: T.ink, letterSpacing: '0.02em' }}>
          {label}
          {required && <span style={{ color: T.terracotta, marginLeft: 4 }}>*</span>}
        </div>
        {hint && <div style={{ fontSize: 10, color: T.ink50 }}>{hint}</div>}
      </div>
      {children}
    </div>
  );
}
