'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { api } from '../lib/api';
import { getValidToken } from '../lib/auth-store';

const T = {
  ink: '#1F1A14',
  ink50: '#7E7567',
  paper: '#FFFEFB',
  cream: '#F4EDE0',
  terracotta: '#B95A3D',
  hairline: 'rgba(31,26,20,0.08)',
};

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? T.ink : 'none'}>
      <path d="M4 11l8-7 8 7v9h-5v-6h-6v6H4v-9z" stroke={T.ink} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
      <circle cx="9" cy="9" r="6" stroke={T.ink50} strokeWidth="1.6" />
      <path d="M13.5 13.5L17 17" stroke={T.ink50} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function BellIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3a7 7 0 0 0-7 7v4l-1.5 2.5h17L19 14v-4a7 7 0 0 0-7-7z"
        stroke={active ? T.ink : T.ink50}
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill={active ? T.ink : 'none'}
      />
      <path
        d="M10 19a2 2 0 0 0 4 0"
        stroke={active ? T.ink : T.ink50}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="7" r="3.2" stroke={T.ink50} strokeWidth="1.5" />
      <path d="M3.5 17c.8-3.4 3.5-5 6.5-5s5.7 1.6 6.5 5" stroke={T.ink50} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke="#FFFEFB" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function useUnreadCount() {
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetch() {
      const token = await getValidToken();
      if (!token || cancelled) return;
      try {
        const res = await api.notifications.list(token, { limit: 1 });
        if (!cancelled) setHasUnread(res.unreadCount > 0);
      } catch {
        // 取得失敗時はバッジなし
      }
    }
    fetch();
    const id = setInterval(fetch, 60_000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  return hasUnread;
}

export function BottomNav() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const hasUnread = useUnreadCount();

  return (
    <nav
      className="ws-bottom-nav"
    >
      <div
        className="ws-bottom-nav__inner"
      >
        <NavItem href="/" label="フィード" active={isHome}>
          <HomeIcon active={isHome} />
        </NavItem>

        <NavItem href="/search" label="さがす" active={pathname === '/search' || pathname === '/discover'}>
          <SearchIcon />
        </NavItem>

        {/* Center FAB */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', marginTop: -22 }}>
          <Link
            href="/posts/new"
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              background: T.terracotta,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 6px 18px rgba(185,90,61,0.35), 0 0 0 4px ${T.paper}`,
              textDecoration: 'none',
            }}
          >
            <PlusIcon />
          </Link>
        </div>

        <NavItem href="/notifications" label="お知らせ" active={pathname === '/notifications'}>
          <div style={{ position: 'relative', display: 'inline-flex' }}>
            <BellIcon active={pathname === '/notifications'} />
            {hasUnread && pathname !== '/notifications' && (
              <span
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: T.terracotta,
                  border: `1.5px solid ${T.paper}`,
                }}
              />
            )}
          </div>
        </NavItem>

        <NavItem href="/profile" label="マイわん" active={pathname === '/profile'}>
          <UserIcon />
        </NavItem>
      </div>
    </nav>
  );
}

function NavItem({
  href,
  label,
  active,
  children,
}: {
  href: string;
  label: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        textDecoration: 'none',
        color: active ? T.ink : T.ink50,
      }}
    >
      {children}
      <span
        style={{
          fontSize: 10,
          fontWeight: active ? 600 : 500,
          letterSpacing: '0.04em',
          color: active ? T.ink : T.ink50,
        }}
      >
        {label}
      </span>
    </Link>
  );
}
