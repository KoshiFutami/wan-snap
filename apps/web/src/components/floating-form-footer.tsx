'use client';

import type { ReactNode } from 'react';

const T = {
  cream: '#F4EDE0',
  hairline: 'rgba(31,26,20,0.08)',
};

export function FloatingFormFooter({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        padding: '16px 12px calc(env(safe-area-inset-bottom, 0px) + 16px)',
        background: `linear-gradient(180deg, rgba(244,237,224,0), ${T.cream} 28%)`,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--app-floating-footer-max-width)',
          margin: '0 auto',
          borderTop: `1px solid ${T.hairline}`,
          paddingTop: 12,
        }}
      >
        {children}
      </div>
    </div>
  );
}
