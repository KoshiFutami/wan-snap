'use client';

import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { saveTokens } from '../../../lib/auth-store';

const T = {
  ink: '#1F1A14',
  ink70: '#4A4239',
  ink50: '#7E7567',
  ink10: '#E8E0D0',
  paper: '#FFFEFB',
  cream: '#F4EDE0',
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
    <div style={{ padding: '8px 20px 120px' }}>
      {/* ステップインジケーター */}
      <div style={{ marginBottom: 22, paddingTop: 8 }}>
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

      <div
        style={{
          fontFamily: 'var(--font-serif, serif)',
          fontSize: 26,
          fontWeight: 500,
          color: T.ink,
          letterSpacing: '-0.015em',
          lineHeight: 1.15,
          marginBottom: 8,
        }}
      >
        はじめまして、<br />あなたのこと教えて<span style={{ color: T.terracotta }}>。</span>
      </div>
      <div style={{ fontSize: 12.5, color: T.ink70, marginBottom: 28, lineHeight: 1.55 }}>
        次の画面で愛犬の情報も入れていきます。
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
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={inputStyle}
          />
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
            <span style={{ color: T.ink, fontWeight: 500, textDecoration: 'underline', cursor: 'pointer' }}>利用規約</span>
            と
            <span style={{ color: T.ink, fontWeight: 500, textDecoration: 'underline', cursor: 'pointer' }}>プライバシーポリシー</span>
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
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px 20px 32px',
            background: `linear-gradient(180deg, transparent, ${T.cream} 30%)`,
          }}
        >
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
        </div>
      </form>

      <div style={{ marginTop: 16, textAlign: 'center', fontSize: 12.5, color: T.ink50 }}>
        すでにアカウントをお持ちの方は{' '}
        <Link href="/auth/sign-in" style={{ color: T.ink, fontWeight: 600, textDecoration: 'none' }}>
          ログイン
        </Link>
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
