'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './header';
import { BottomNav } from './bottom-nav';

const BOTTOM_NAV_HEIGHT = 112;
const HEADER_HEIGHT = 58;

function shouldHideHeader(pathname: string) {
  return pathname !== '/';
}

function shouldHideBottomNav(pathname: string) {
  return pathname.startsWith('/auth/')
    || pathname === '/intro'
    || pathname === '/posts/new'
    || pathname === '/dogs/new';
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideHeader = shouldHideHeader(pathname);
  const hideBottomNav = shouldHideBottomNav(pathname);

  return (
    <>
      {!hideHeader && <Header />}
      <main
        style={{
          width: '100%',
          maxWidth: 390,
          margin: '0 auto',
          paddingTop: hideHeader ? 0 : HEADER_HEIGHT,
          paddingBottom: hideBottomNav ? 0 : BOTTOM_NAV_HEIGHT,
        }}
      >
        {children}
      </main>
      {!hideBottomNav && <BottomNav />}
    </>
  );
}
