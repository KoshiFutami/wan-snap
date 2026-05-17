'use client';

import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAccessToken } from '../lib/auth-store';

const T = {
  ink: '#1F1A14',
  ink50: '#7E7567',
  paper: '#FFFEFB',
  cream: '#F4EDE0',
  hairline: 'rgba(31,26,20,0.08)',
};

function PawLogo() {
  return (
    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <ellipse cx="6" cy="9" rx="2" ry="2.6" fill={T.ink} />
        <ellipse cx="11" cy="6.4" rx="2" ry="2.6" fill={T.ink} />
        <ellipse cx="16.3" cy="7.6" rx="2" ry="2.6" fill={T.ink} />
        <ellipse cx="20" cy="11.5" rx="1.8" ry="2.3" fill={T.ink} />
        <path
          d="M12 11c-3.5 0-6.5 2.6-6.5 5.8 0 2 1.5 3.4 3.5 3.4 1.2 0 2.2-.6 3-.6s1.8.6 3 .6c2 0 3.5-1.4 3.5-3.4 0-3.2-3-5.8-6.5-5.8z"
          fill={T.ink}
        />
      </svg>
      <span
        style={{
          fontFamily: 'var(--font-serif), "Noto Serif JP", serif',
          fontWeight: 600,
          fontSize: 20,
          letterSpacing: '-0.01em',
          color: T.ink,
          lineHeight: 1,
        }}
      >
        Wan<span style={{ opacity: 0.45, margin: '0 1px' }}>·</span>Snap
      </span>
    </Link>
  );
}

function IconCircleBtn({ children, href, onClick }: { children: ReactNode; href?: string; onClick?: () => void }) {
  const style: CSSProperties = {
    width: 38,
    height: 38,
    borderRadius: 19,
    background: T.paper,
    border: `1px solid ${T.hairline}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
    color: T.ink,
    textDecoration: 'none',
  };
  if (href) return <Link href={href} style={style}>{children}</Link>;
  return <button onClick={onClick} style={style}>{children}</button>;
}

export function Header() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setIsAuthed(!!getAccessToken());
  }, []);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastY && y > 60) setHidden(true);
      else if (y < lastY) setHidden(false);
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'rgba(244,237,224,0.92)',
        borderBottom: `1px solid ${T.hairline}`,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 0.25s ease',
      }}
    >
      <div
        style={{
          maxWidth: 390,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 12px',
        }}
      >
        <PawLogo />

        <div style={{ display: 'flex', gap: 8 }}>
          {isAuthed ? (
            <>
              <IconCircleBtn href="/discover">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <circle cx="9" cy="9" r="6" stroke={T.ink} strokeWidth="1.6" />
                  <path d="M13.5 13.5L17 17" stroke={T.ink} strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </IconCircleBtn>
              <IconCircleBtn href="/profile">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="7" r="3.2" stroke={T.ink} strokeWidth="1.5" />
                  <path d="M3.5 17c.8-3.4 3.5-5 6.5-5s5.7 1.6 6.5 5" stroke={T.ink} strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </IconCircleBtn>
            </>
          ) : (
            <>
              <Link
                href="/auth/sign-in"
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: T.ink50,
                  textDecoration: 'none',
                  padding: '8px 4px',
                }}
              >
                ログイン
              </Link>
              <Link
                href="/auth/sign-up"
                style={{
                  padding: '8px 16px',
                  borderRadius: 999,
                  background: T.ink,
                  color: '#F4EDE0',
                  fontSize: 12.5,
                  fontWeight: 600,
                  textDecoration: 'none',
                  letterSpacing: '0.02em',
                }}
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
