'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-end border-t border-border-warm bg-white"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)', boxShadow: '0 -4px 20px rgba(0,0,0,0.06)' }}
    >
      <div className="mx-auto flex w-full max-w-sm items-end">
        <NavItem href="/" icon="🏠" label="ホーム" active={isActive('/')} />
        <NavItem href="/discover" icon="🔍" label="発見" active={isActive('/discover')} />

        {/* FAB */}
        <div className="flex flex-1 justify-center">
          <Link
            href="/posts/new"
            className="mb-1 flex h-12 w-12 -translate-y-2.5 items-center justify-center rounded-full text-2xl text-white transition-transform hover:scale-110"
            style={{ background: 'linear-gradient(135deg, #FF6B35, #EF476F)', boxShadow: '0 6px 20px rgba(255,107,53,0.45)' }}
          >
            ＋
          </Link>
        </div>

        <NavItem href="/album" icon="📸" label="アルバム" active={isActive('/album')} />
        <NavItem href="/profile" icon="🐾" label="マイわん" active={isActive('/profile')} />
      </div>
    </nav>
  );
}

function NavItem({ href, icon, label, active }: { href: string; icon: string; label: string; active: boolean }) {
  return (
    <Link href={href} className="flex flex-1 flex-col items-center gap-0.5 py-2 transition-transform active:scale-95">
      <span className={`text-[22px] transition-transform ${active ? 'scale-110' : ''}`}>{icon}</span>
      <span className={`text-[9px] font-bold ${active ? 'text-primary' : 'text-text-muted'}`}>{label}</span>
    </Link>
  );
}
