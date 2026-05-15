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
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border-warm bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-sm items-center justify-between px-4 py-2.5">
        <Link href="/" className="flex items-center gap-1">
          <span
            className="text-xl font-black tracking-tight"
            style={{ background: 'linear-gradient(135deg, #FF6B35, #EF476F)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
          >
            🐾 Wan-Snap
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {isAuthed ? (
            <>
              <IconButton emoji="🔍" href="/discover" />
              <button
                onClick={handleSignOut}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-base transition-colors hover:bg-primary-light"
                title="ログアウト"
              >
                👤
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
                className="rounded-full px-4 py-1.5 text-sm font-bold text-white transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #FF6B35, #EF476F)', boxShadow: '0 4px 14px rgba(255,107,53,0.4)' }}
              >
                はじめる
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function IconButton({ emoji, href }: { emoji: string; href?: string }) {
  const cls = "flex h-9 w-9 items-center justify-center rounded-full bg-surface text-base transition-colors hover:bg-primary-light";
  if (href) return <Link href={href} className={cls}>{emoji}</Link>;
  return <button className={cls}>{emoji}</button>;
}
