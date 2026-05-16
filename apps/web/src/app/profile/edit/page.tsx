'use client';

import { useEffect, useRef, useState } from 'react';
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
  creamSoft: '#FAF5EA',
  terracotta: '#B95A3D',
  forest: '#3D7A4B',
  hairline: 'rgba(31,26,20,0.08)',
  hairlineStrong: 'rgba(31,26,20,0.18)',
};

export default function ProfileEditPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [privateAccount, setPrivateAccount] = useState(false);
  const [allowTagging, setAllowTagging] = useState(true);
  const [allowContactSearch, setAllowContactSearch] = useState(true);
  const tokenRef = useRef<string | null>(null);

  useEffect(() => {
    getValidToken().then((token) => {
      if (!token) { router.replace('/auth/sign-in'); return; }
      tokenRef.current = token;
      api.users.getMe(token).then((u) => {
        setUser(u);
        setDisplayName(u.displayName ?? '');
        setBio(u.bio ?? '');
        setLocation(u.location ?? '');
      }).catch(() => router.replace('/auth/sign-in'));
    });
  }, [router]);

  const handleSave = async () => {
    setError(null);
    setSaving(true);
    try {
      const token = tokenRef.current ?? await getValidToken();
      if (!token) throw new Error('ログインが必要です');
      const body: Parameters<typeof api.users.updateMe>[0] = {};
      if (displayName !== (user?.displayName ?? '')) body.displayName = displayName;
      if (bio !== (user?.bio ?? '')) body.bio = bio;
      if (location !== (user?.location ?? '')) body.location = location;
      await api.users.updateMe(body, token);
      setSuccess(true);
      setTimeout(() => router.push('/profile'), 700);
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

  const initial = (user.displayName ?? 'u')[0].toLowerCase();

  return (
    <div style={{ background: T.creamSoft, minHeight: '100dvh' }}>
      {/* AppBar */}
      <div style={{
        padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
        background: T.creamSoft,
        position: 'sticky', top: 0, zIndex: 10,
        borderBottom: `1px solid ${T.hairline}`,
      }}>
        <button
          onClick={() => router.back()}
          style={{
            width: 40, height: 40, borderRadius: 20,
            background: T.paper, border: `1px solid ${T.hairline}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
          }}
          aria-label="戻る"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M14 5l-7 7 7 7" stroke={T.ink} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 14, fontWeight: 600, color: T.ink }}>
          プロフィール編集
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !displayName.trim()}
          style={{
            padding: '7px 16px', borderRadius: 999,
            background: saving || !displayName.trim() ? T.ink10 : T.ink,
            color: saving || !displayName.trim() ? T.ink50 : T.cream,
            border: 'none', fontSize: 12, fontWeight: 600,
            cursor: saving || !displayName.trim() ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit', flexShrink: 0,
            transition: 'background 0.15s',
          }}
        >
          {saving ? '保存中…' : '保存'}
        </button>
      </div>

      <div style={{ padding: '0 20px 40px', overflowY: 'auto' }}>
        {/* Avatar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24, marginBottom: 26 }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 96, height: 96, borderRadius: 48,
              background: T.cream, border: `1px solid ${T.hairline}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-serif, serif)', fontSize: 40, fontWeight: 500, color: T.ink,
              overflow: 'hidden',
            }}>
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : initial}
            </div>
            <div style={{
              position: 'absolute', bottom: -2, right: -2,
              width: 30, height: 30, borderRadius: 15,
              background: T.terracotta, color: '#fff',
              border: `3px solid ${T.creamSoft}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3 5h2l1-1.5h4L11 5h2v8H3V5z" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
                <circle cx="8" cy="9" r="2" stroke="#fff" strokeWidth="1.4" />
              </svg>
            </div>
          </div>
        </div>

        {/* 基本情報 */}
        <FormSection title="基本情報">
          <FieldRow label="表示名" required>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={100}
              required
              placeholder="表示名"
              style={inputStyle}
            />
          </FieldRow>

          <FieldRow label="ユーザーID">
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={user.id.slice(0, 8)}
                readOnly
                style={{ ...inputStyle, paddingRight: 90, color: T.ink50, cursor: 'default' }}
              />
              <span style={{
                position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                fontSize: 12, color: T.ink50,
                fontFamily: 'var(--font-mono, monospace)',
                pointerEvents: 'none',
              }}>.wansnap</span>
            </div>
          </FieldRow>

          <FieldRow label="自己紹介" hint={`${bio.length} / 160`}>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 160))}
              maxLength={160}
              rows={3}
              placeholder="愛犬との日常など、自由に書いてください"
              style={{ ...inputStyle, resize: 'none', height: 'auto', paddingTop: 12, paddingBottom: 12, lineHeight: 1.55 }}
            />
          </FieldRow>

          <FieldRow label="リンク" hint="任意">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              maxLength={100}
              placeholder="https://"
              style={inputStyle}
            />
          </FieldRow>
        </FormSection>

        {/* プライバシー */}
        <FormSection title="プライバシー">
          <ToggleRow
            label="非公開アカウント"
            sub="承認したフォロワーのみ閲覧可能"
            on={privateAccount}
            onChange={setPrivateAccount}
          />
          <ToggleRow
            label="他人のタグ付けを許可"
            sub="他人のスナップでタグ付けされた時に通知"
            on={allowTagging}
            onChange={setAllowTagging}
          />
          <ToggleRow
            label="連絡先からの検索"
            sub="電話・メールから見つけられる"
            on={allowContactSearch}
            onChange={setAllowContactSearch}
          />
        </FormSection>

        {error && (
          <div style={{
            padding: '12px 14px', borderRadius: 10,
            background: 'rgba(185,90,61,0.08)',
            border: `1px solid rgba(185,90,61,0.2)`,
            color: T.terracotta, fontSize: 13, marginTop: 8,
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            padding: '12px 14px', borderRadius: 10,
            background: 'rgba(61,122,75,0.08)',
            border: `1px solid rgba(61,122,75,0.2)`,
            color: T.forest, fontSize: 13, marginTop: 8,
          }}>
            保存しました
          </div>
        )}
      </div>
    </div>
  );
}

function FormSection({ title, subtitle, children }: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
        <div style={{
          fontFamily: 'var(--font-serif, serif)', fontSize: 16, fontWeight: 500,
          color: T.ink, lineHeight: 1,
        }}>{title}</div>
        {subtitle && <div style={{ fontSize: 10.5, color: T.ink50 }}>{subtitle}</div>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {children}
      </div>
    </div>
  );
}

function FieldRow({ label, required, hint, children }: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ fontSize: 11.5, fontWeight: 500, color: T.ink, letterSpacing: '0.02em' }}>
          {label}
          {required && <span style={{ color: T.terracotta, marginLeft: 4 }}>*</span>}
        </div>
        {hint && <div style={{ fontSize: 10, color: T.ink50, fontFamily: 'var(--font-mono, monospace)' }}>{hint}</div>}
      </div>
      {children}
    </div>
  );
}

function ToggleRow({ label, sub, on, onChange }: {
  label: string;
  sub: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 14px', borderRadius: 12,
        background: T.paper, border: `1px solid ${T.hairline}`,
        cursor: 'pointer',
      }}
      onClick={() => onChange(!on)}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: T.ink }}>{label}</div>
        <div style={{ fontSize: 10.5, color: T.ink50, marginTop: 3 }}>{sub}</div>
      </div>
      <div style={{
        width: 40, height: 24, borderRadius: 12,
        background: on ? T.forest : T.ink10,
        position: 'relative', flexShrink: 0,
        transition: 'background 0.2s',
      }}>
        <div style={{
          position: 'absolute', top: 2, left: on ? 18 : 2,
          width: 20, height: 20, borderRadius: 10,
          background: '#fff',
          transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: T.paper,
  borderRadius: 12,
  border: `1px solid ${T.hairline}`,
  padding: '0 14px',
  height: 46,
  fontSize: 14,
  color: T.ink,
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
};
