'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { getSupabase } from '../../../lib/supabase';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/';

    if (!code) {
      router.replace('/auth/sign-in?error=auth_error');
      return;
    }

    // クライアントサイドで交換することでlocalStorageにセッションが保存される
    getSupabase()
      .auth.exchangeCodeForSession(code)
      .then(({ error }) => {
        if (error) {
          router.replace('/auth/sign-in?error=auth_error');
        } else {
          router.replace(next);
        }
      });
  }, [router, searchParams]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F4EDE0',
        fontSize: 14,
        color: '#7E7567',
      }}
    >
      ログイン中...
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense>
      <CallbackContent />
    </Suspense>
  );
}
