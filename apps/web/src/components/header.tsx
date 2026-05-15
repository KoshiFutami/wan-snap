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
    <header className="sticky top-0 z-50 border-b border-border-warm bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-1">
          <span
            className="text-xl font-black tracking-tight"
            style={{ background: 'linear-gradient(135deg, #FF6B35, #EF476F)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
          >
            🐾 Wan-Snap
          </span>
        </Link>

        <nav className="flex items-center gap-3">
          {isAuthed ? (
            <>
              <Link
                href="/posts/new"
                className="rounded-full px-4 py-1.5 text-sm font-bold text-white transition-all hover:opacity-90 hover:-translate-y-px"
                style={{ background: 'linear-gradient(135deg, #FF6B35, #EF476F)', boxShadow: '0 4px 14px rgba(255,107,53,0.4)' }}
              >
                ＋ 投稿する
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm font-medium text-text-sub hover:text-text-main transition-colors"
              >
                ログアウト
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/sign-in"
                className="text-sm font-medium text-text-sub hover:text-text-main transition-colors"
              >
                ログイン
              </Link>
              <Link
                href="/auth/sign-up"
                className="rounded-full px-4 py-1.5 text-sm font-bold text-white transition-all hover:opacity-90 hover:-translate-y-px"
                style={{ background: 'linear-gradient(135deg, #FF6B35, #EF476F)', boxShadow: '0 4px 14px rgba(255,107,53,0.4)' }}
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
