'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { WanSnapLogo } from '../../../components/wan-snap-logo';

const T = {
  ink: '#1F1A14',
  ink70: '#4A4239',
  ink50: '#7E7567',
  paper: '#FFFEFB',
  cream: '#F4EDE0',
  creamSoft: '#FAF5EA',
  terracotta: '#B95A3D',
};

function MagicLinkSentContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';

  return (
    <div style={{ minHeight: '100vh', background: T.cream, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px' }}>
      <WanSnapLogo />

      <div style={{ marginTop: 48, textAlign: 'center', maxWidth: 320 }}>
        <div style={{ fontSize: 48, marginBottom: 24 }}>✉️</div>

        <div style={{ fontFamily: 'var(--font-serif, serif)', fontSize: 26, fontWeight: 500, color: T.ink, letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 16 }}>
          メールを送りました
        </div>

        <div style={{ fontSize: 14, color: T.ink70, lineHeight: 1.7, marginBottom: 8 }}>
          {email && (
            <span style={{ fontWeight: 600, color: T.ink }}>{email}</span>
          )}
          {email && ' に'}ログイン用のリンクを送りました。
        </div>
        <div style={{ fontSize: 13.5, color: T.ink50, lineHeight: 1.7 }}>
          メールに届いたリンクをタップすると、自動でログインできます。
          リンクの有効期限は1時間です。
        </div>
      </div>

      <div style={{ marginTop: 48, textAlign: 'center' }}>
        <Link
          href="/auth/sign-in"
          style={{ fontSize: 13, color: T.ink50, textDecoration: 'underline' }}
        >
          ← ログイン画面に戻る
        </Link>
      </div>
    </div>
  );
}

export default function MagicLinkSentPage() {
  return (
    <Suspense>
      <MagicLinkSentContent />
    </Suspense>
  );
}
