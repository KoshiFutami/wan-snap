'use client';

const ACCESS_TOKEN_KEY = 'wan_snap_access';
const REFRESH_TOKEN_KEY = 'wan_snap_refresh';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function saveTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

function jwtExpiresAt(token: string): number {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return (payload.exp as number) * 1000;
  } catch {
    return 0;
  }
}

let inflightRefresh: Promise<string | null> | null = null;

async function doRefresh(): Promise<string | null> {
  const rt = getRefreshToken();
  if (!rt) return null;
  try {
    const res = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: rt }),
    });
    if (!res.ok) { clearTokens(); return null; }
    const tokens = (await res.json()) as { accessToken: string; refreshToken: string };
    saveTokens(tokens.accessToken, tokens.refreshToken);
    return tokens.accessToken;
  } catch {
    clearTokens();
    return null;
  }
}

/**
 * アクセストークンからユーザーIDを取得する。
 */
export function getCurrentUserId(): string | null {
  const token = getAccessToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as { sub: string };
    return payload.sub ?? null;
  } catch {
    return null;
  }
}

/**
 * 有効なアクセストークンを返す。
 * 期限切れ（または60秒以内に切れる）場合はリフレッシュトークンで自動更新する。
 * 更新失敗（リフレッシュトークン期限切れ等）時は null を返す。
 */
export async function getValidToken(): Promise<string | null> {
  const token = getAccessToken();
  if (!token) return null;

  const expiresAt = jwtExpiresAt(token);
  // 60秒の余裕を持ってリフレッシュ
  if (expiresAt > Date.now() + 60_000) return token;

  if (!inflightRefresh) {
    inflightRefresh = doRefresh().finally(() => { inflightRefresh = null; });
  }
  return inflightRefresh;
}
