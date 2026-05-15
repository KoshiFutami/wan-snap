'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { saveTokens } from '../../../lib/auth-store';

export default function SignUpPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const inputClass = "w-full rounded-2xl border-2 border-border-warm bg-white px-4 py-3 text-sm font-medium text-text-main placeholder:text-text-muted focus:border-primary focus:outline-none transition-colors";

  return (
    <div className="mx-auto max-w-sm py-12">
      <div className="mb-8 text-center">
        <span className="text-4xl">🐾</span>
        <h1 className="mt-3 text-2xl font-black tracking-tight text-text-main">はじめる</h1>
        <p className="mt-1 text-sm text-text-sub">愛犬のスナップを共有しよう</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-black text-text-sub uppercase tracking-widest mb-1.5">表示名</label>
          <input
            type="text"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className={inputClass}
            placeholder="柴犬親バカ"
          />
        </div>
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
          <label className="block text-xs font-black text-text-sub uppercase tracking-widest mb-1.5">パスワード（8文字以上）</label>
          <input
            type="password"
            required
            minLength={8}
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
          {loading ? '登録中...' : 'アカウントを作成'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-text-sub">
        すでにアカウントをお持ちの方は{' '}
        <Link href="/auth/sign-in" className="font-bold text-primary hover:text-primary-dark">
          ログイン
        </Link>
      </p>
    </div>
  );
}
