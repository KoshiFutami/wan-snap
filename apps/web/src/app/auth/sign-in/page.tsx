'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { saveTokens } from '../../../lib/auth-store';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  const inputClass = "w-full rounded-2xl border-2 border-border-warm bg-white px-4 py-3 text-sm font-medium text-text-main placeholder:text-text-muted focus:border-primary focus:outline-none transition-colors";

  return (
    <div className="mx-auto max-w-sm py-12">
      <div className="mb-8 text-center">
        <span className="text-4xl">🐾</span>
        <h1 className="mt-3 text-2xl font-black tracking-tight text-text-main">ログイン</h1>
        <p className="mt-1 text-sm text-text-sub">Wan Snap へようこそ</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-black text-text-sub uppercase tracking-widest mb-1.5">メールアドレス</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-xs font-black text-text-sub uppercase tracking-widest mb-1.5">パスワード</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl py-3 text-sm font-black text-white transition-all hover:opacity-90 hover:-translate-y-px disabled:opacity-50 disabled:translate-y-0"
          style={{ background: 'linear-gradient(135deg, #FF6B35, #EF476F)', boxShadow: '0 6px 20px rgba(255,107,53,0.4)' }}
        >
          {loading ? 'ログイン中...' : 'ログイン'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-text-sub">
        アカウントをお持ちでない方は{' '}
        <Link href="/auth/sign-up" className="font-bold text-primary hover:text-primary-dark">
          新規登録
        </Link>
      </p>
    </div>
  );
}
