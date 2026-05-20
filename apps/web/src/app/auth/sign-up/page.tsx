'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Supabase Auth 移行により、新規登録はログイン画面のソーシャルログインから行う。
 * 既存の /auth/sign-up リンクをリダイレクトする。
 */
export default function SignUpPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/auth/sign-in');
  }, [router]);
  return null;
}
