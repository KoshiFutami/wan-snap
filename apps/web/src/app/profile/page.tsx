'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAccessToken, clearTokens, getValidToken } from '../../lib/auth-store';
import { api, type User } from '../../lib/api';

const T = {
  ink: '#1F1A14',
  ink70: '#4A4239',
  ink50: '#7E7567',
  ink10: '#E8E0D0',
  paper: '#FFFEFB',
  cream: '#F4EDE0',
  terracotta: '#B95A3D',
  hairline: 'rgba(31,26,20,0.08)',
};

export default function ProfilePage() {
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    setIsAuthed(true);
    getValidToken().then((t) => {
      if (!t) return;
      api.users.getMe(t).then(setUser).catch(() => null);
    });
  }, []);

  const handleSignOut = () => {
    clearTokens();
    router.push('/');
  };

  if (!isAuthed) {
    return (
      <div style={{ padding: '64px 20px', textAlign: 'center' }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill={T.ink10} style={{ margin: '0 auto' }}>
          <ellipse cx="6" cy="9" rx="2" ry="2.6" />
          <ellipse cx="11" cy="6.4" rx="2" ry="2.6" />
          <ellipse cx="16.3" cy="7.6" rx="2" ry="2.6" />
          <ellipse cx="20" cy="11.5" rx="1.8" ry="2.3" />
          <path d="M12 11c-3.5 0-6.5 2.6-6.5 5.8 0 2 1.5 3.4 3.5 3.4 1.2 0 2.2-.6 3-.6s1.8.6 3 .6c2 0 3.5-1.4 3.5-3.4 0-3.2-3-5.8-6.5-5.8z" />
        </svg>
        <p style={{ marginTop: 16, fontSize: 14, fontWeight: 600, color: T.ink70 }}>ログインが必要です</p>
        <button
          onClick={() => router.push('/auth/sign-in')}
          style={{
            marginTop: 16,
            padding: '12px 24px',
            borderRadius: 999,
            background: T.ink,
            color: T.cream,
            fontSize: 13.5,
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          ログイン
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 20px' }}>
      {/* アバター＋名前 */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: 32 }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            background: T.ink10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `3px solid ${T.paper}`,
            boxShadow: `0 0 0 1px ${T.hairline}`,
            overflow: 'hidden',
          }}
        >
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <svg width="40" height="40" viewBox="0 0 20 20" fill={T.ink50}>
              <circle cx="10" cy="7" r="3.2" />
              <path d="M3.5 17c.8-3.4 3.5-5 6.5-5s5.7 1.6 6.5 5" />
            </svg>
          )}
        </div>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontFamily: 'var(--font-serif, serif)',
              fontSize: 22,
              fontWeight: 500,
              color: T.ink,
              lineHeight: 1.1,
            }}
          >
            {user?.displayName ?? '…'}
          </div>
          {user?.bio && (
            <div style={{ fontSize: 12.5, color: T.ink70, marginTop: 6, maxWidth: 240, lineHeight: 1.5 }}>
              {user.bio}
            </div>
          )}
          {user?.location && (
            <div style={{ fontSize: 12, color: T.ink50, marginTop: 4 }}>{user.location}</div>
          )}
        </div>
      </div>

      {/* メニュー */}
      <div
        style={{
          background: T.paper,
          borderRadius: 16,
          border: `1px solid ${T.hairline}`,
          overflow: 'hidden',
        }}
      >
        <MenuRow
          label="プロフィールを編集"
          href="/profile/edit"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15.5 4.5l4 4L7 21H3v-4L15.5 4.5z" stroke={T.ink70} strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          }
        />
        <MenuRow
          label="愛犬を登録"
          href="/dogs/new"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill={T.ink70}>
              <ellipse cx="6" cy="9" rx="2" ry="2.6" />
              <ellipse cx="11" cy="6.4" rx="2" ry="2.6" />
              <ellipse cx="16.3" cy="7.6" rx="2" ry="2.6" />
              <ellipse cx="20" cy="11.5" rx="1.8" ry="2.3" />
              <path d="M12 11c-3.5 0-6.5 2.6-6.5 5.8 0 2 1.5 3.4 3.5 3.4 1.2 0 2.2-.6 3-.6s1.8.6 3 .6c2 0 3.5-1.4 3.5-3.4 0-3.2-3-5.8-6.5-5.8z" />
            </svg>
          }
        />
        <MenuRow
          label="スナップを投稿"
          href="/posts/new"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="5" width="18" height="14" rx="3" stroke={T.ink70} strokeWidth="1.5" />
              <circle cx="12" cy="12" r="3" stroke={T.ink70} strokeWidth="1.5" />
              <circle cx="17" cy="8" r="1.2" fill={T.ink70} />
            </svg>
          }
          last
        />
      </div>

      {/* ログアウト */}
      <button
        onClick={handleSignOut}
        style={{
          width: '100%',
          marginTop: 16,
          padding: '14px',
          borderRadius: 12,
          background: 'transparent',
          color: T.terracotta,
          border: `1px solid ${T.terracotta}`,
          fontSize: 13,
          fontWeight: 500,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        ログアウト
      </button>
    </div>
  );
}

function MenuRow({
  label,
  href,
  icon,
  last = false,
}: {
  label: string;
  href: string;
  icon: ReactNode;
  last?: boolean;
}) {
  return (
    <Link
      href={href}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 16px',
        borderBottom: last ? 'none' : `1px solid ${T.hairline}`,
        textDecoration: 'none',
        color: T.ink,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 9,
          background: T.cream,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </div>
      <span style={{ flex: 1, fontSize: 13.5, fontWeight: 500 }}>{label}</span>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path d="M6 4l4 4-4 4" stroke={T.ink50} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}
