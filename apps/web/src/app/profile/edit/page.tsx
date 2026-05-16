'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getValidToken } from '../../../lib/auth-store';
import { api, type User } from '../../../lib/api';

const T = {
  ink: '#1F1A14',
  ink70: '#4A4239',
  ink50: '#7E7567',
  ink10: '#E8E0D0',
  paper: '#FFFEFB',
  cream: '#F4EDE0',
  terracotta: '#B95A3D',
  hairline: 'rgba(31,26,20,0.08)',
  green: '#3D7A4B',
};

export default function ProfileEditPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getValidToken().then((token) => {
      if (!token) { router.replace('/auth/sign-in'); return; }
      api.users.getMe(token).then((u) => {
        setUser(u);
        setDisplayName(u.displayName ?? '');
        setBio(u.bio ?? '');
        setLocation(u.location ?? '');
        setAvatarUrl(u.avatarUrl ?? '');
      }).catch(() => router.replace('/auth/sign-in'));
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const token = await getValidToken();
      if (!token) throw new Error('ログインが必要です');
      const body: Parameters<typeof api.users.updateMe>[0] = {};
      if (displayName !== (user?.displayName ?? '')) body.displayName = displayName;
      if (bio !== (user?.bio ?? '')) body.bio = bio;
      if (location !== (user?.location ?? '')) body.location = location;
      if (avatarUrl !== (user?.avatarUrl ?? '')) body.avatarUrl = avatarUrl || undefined;
      await api.users.updateMe(body, token);
      setSuccess(true);
      setTimeout(() => router.push('/profile'), 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div style={{ padding: '64px 20px', textAlign: 'center', color: T.ink50, fontSize: 14 }}>
        読み込み中…
      </div>
    );
  }

  return (
    <div style={{ padding: '16px 20px 40px' }}>
      {/* ヘッダー */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <button
          onClick={() => router.back()}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 4,
            display: 'flex',
            alignItems: 'center',
            color: T.ink70,
          }}
          aria-label="戻る"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1
          style={{
            fontFamily: 'var(--font-serif, serif)',
            fontSize: 20,
            fontWeight: 500,
            color: T.ink,
            margin: 0,
          }}
        >
          プロフィール編集
        </h1>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Field label="表示名" required>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={100}
            required
            placeholder="表示名"
            style={inputStyle}
          />
        </Field>

        <Field label="自己紹介">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={500}
            rows={4}
            placeholder="愛犬との日常など、自由に書いてください"
            style={{ ...inputStyle, resize: 'vertical', height: 'auto' }}
          />
          <div style={{ fontSize: 11, color: T.ink50, textAlign: 'right', marginTop: 4 }}>
            {bio.length} / 500
          </div>
        </Field>

        <Field label="場所">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            maxLength={100}
            placeholder="例: 東京都渋谷区"
            style={inputStyle}
          />
        </Field>

        <Field label="アバター画像URL">
          <input
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://..."
            style={inputStyle}
          />
          {avatarUrl && (
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
              <img
                src={avatarUrl}
                alt="プレビュー"
                style={{ width: 48, height: 48, borderRadius: 24, objectFit: 'cover', border: `1px solid ${T.hairline}` }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <span style={{ fontSize: 12, color: T.ink50 }}>プレビュー</span>
            </div>
          )}
        </Field>

        {error && (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 10,
              background: '#FEF2F2',
              color: T.terracotta,
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 10,
              background: '#F0FDF4',
              color: T.green,
              fontSize: 13,
            }}
          >
            保存しました
          </div>
        )}

        <button
          type="submit"
          disabled={saving || !displayName.trim()}
          style={{
            padding: '14px',
            borderRadius: 12,
            background: saving || !displayName.trim() ? T.ink10 : T.ink,
            color: saving || !displayName.trim() ? T.ink50 : T.cream,
            border: 'none',
            fontSize: 14,
            fontWeight: 600,
            cursor: saving || !displayName.trim() ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            transition: 'background 0.15s',
          }}
        >
          {saving ? '保存中…' : '保存する'}
        </button>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 10,
  border: `1px solid rgba(31,26,20,0.15)`,
  background: '#FFFEFB',
  fontSize: 14,
  color: '#1F1A14',
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
};

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: '#4A4239', letterSpacing: '0.02em' }}>
        {label}
        {required && <span style={{ color: '#B95A3D', marginLeft: 3 }}>*</span>}
      </label>
      {children}
    </div>
  );
}
