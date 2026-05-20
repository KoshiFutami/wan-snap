'use client';

import { supabase } from './supabase';

/**
 * 有効なアクセストークンを返す。
 * Supabaseが自動でトークンをリフレッシュする。
 * ログイン済みでない場合は null を返す。
 */
export async function getValidToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  // トークンが60秒以内に切れる場合はリフレッシュ
  const expiresAt = session.expires_at ?? 0;
  if (expiresAt * 1000 > Date.now() + 60_000) {
    return session.access_token;
  }

  const { data: { session: refreshed } } = await supabase.auth.refreshSession();
  return refreshed?.access_token ?? null;
}

/**
 * 現在ログイン中のSupabaseユーザーIDを返す。
 * 注意: Supabase IDはバックエンドの User.id ではなく User.supabaseId に対応する。
 * バックエンドの User.id が必要な場合は /api/v1/users/me を呼ぶこと。
 */
export async function getCurrentSupabaseUserId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

// 後方互換: 既存コードで使われている同期版 getCurrentUserId は
// セッションをキャッシュできないため非推奨。getValidToken 経由で userId を取得すること。
export function getCurrentUserId(): string | null {
  return null;
}

/** @deprecated Supabase Auth に移行済み。getValidToken() を使うこと */
export function saveTokens(_accessToken: string, _refreshToken: string): void {
  // no-op
}

/** @deprecated Supabase Auth に移行済み。signOut() を使うこと */
export function clearTokens(): void {
  void supabase.auth.signOut();
}

/** @deprecated Supabase Auth に移行済み。getValidToken() を使うこと */
export function getAccessToken(): string | null {
  return null;
}

/** @deprecated */
export function getRefreshToken(): string | null {
  return null;
}
