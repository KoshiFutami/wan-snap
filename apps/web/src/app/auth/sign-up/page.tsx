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

  return (
    <div className="mx-auto max-w-sm py-12">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight">はじめる</h1>
        <p className="mt-1 text-sm text-gray-500">愛犬のスナップを共有しよう</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">表示名</label>
          <input
            type="text"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-gray-400 focus:outline-none"
            placeholder="柴犬親バカ"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-gray-400 focus:outline-none"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">パスワード（8文字以上）</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-gray-400 focus:outline-none"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gray-900 py-2.5 text-sm font-medium text-white hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {loading ? '登録中...' : 'アカウントを作成'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        すでにアカウントをお持ちの方は{' '}
        <Link href="/auth/sign-in" className="font-medium text-gray-900 hover:underline">
          ログイン
        </Link>
      </p>
    </div>
  );
}
