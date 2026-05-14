'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAccessToken, clearTokens } from '../lib/auth-store';

export function Header() {
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    setIsAuthed(!!getAccessToken());
  }, []);

  const handleSignOut = () => {
    clearTokens();
    setIsAuthed(false);
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
          Wan Snap
        </Link>

        <nav className="flex items-center gap-3">
          {isAuthed ? (
            <>
              <Link
                href="/posts/new"
                className="rounded-full bg-gray-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
              >
                投稿する
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                ログアウト
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/sign-in"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                ログイン
              </Link>
              <Link
                href="/auth/sign-up"
                className="rounded-full bg-gray-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
              >
                はじめる
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
