'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getValidToken } from '../../lib/auth-store';
import { api } from '../../lib/api';
import { getSupabase } from '../../lib/supabase';

const T = {
  ink: '#1F1A14',
  ink70: '#4A4239',
  ink50: '#7E7567',
  paper: '#FFFEFB',
  cream: '#F4EDE0',
  terracotta: '#B95A3D',
  hairline: 'rgba(31,26,20,0.08)',
  hairlineStrong: 'rgba(31,26,20,0.14)',
};

export default function SettingsPage() {
  const router = useRouter();
  const [confirmed, setConfirmed] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!confirmed || deleting) return;
    setDeleting(true);
    setError('');
    try {
      const token = await getValidToken();
      if (!token) { router.push('/auth/sign-in'); return; }
      await api.users.deleteMe(token);
      await getSupabase().auth.signOut();
      router.replace('/auth/sign-in');
    } catch {
      setError('退会処理に失敗しました。もう一度お試しください。');
      setDeleting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: T.cream }}>
      {/* ヘッダー */}
      <div style={{ padding: '16px 16px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link
          href="/profile"
          style={{ color: T.ink50, fontSize: 13, textDecoration: 'none' }}
        >
          ← 戻る
        </Link>
        <span style={{ fontSize: 15, fontWeight: 600, color: T.ink }}>設定</span>
      </div>

      <div style={{ padding: '32px 16px' }}>
        {/* 機能要望リンク */}
        <Link
          href="/feedback"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            background: T.paper,
            borderRadius: 14,
            textDecoration: 'none',
            marginBottom: 12,
            border: `1px solid ${T.hairline}`,
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.ink }}>機能要望を送る</div>
            <div style={{ fontSize: 12, color: T.ink50, marginTop: 2 }}>
              ほしい機能や改善点を教えてください
            </div>
          </div>
          <span style={{ color: T.ink50, fontSize: 16 }}>›</span>
        </Link>

        {/* 退会セクション */}
        <div style={{
          marginTop: 40,
          padding: 20,
          background: T.paper,
          borderRadius: 14,
          border: `1px solid rgba(185,90,61,0.2)`,
        }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.terracotta, marginBottom: 8 }}>
            退会する
          </div>
          <p style={{ fontSize: 13, color: T.ink70, lineHeight: 1.6, margin: '0 0 20px' }}>
            退会すると、投稿・愛犬データ・コメントなどすべてのデータが削除されます。この操作は取り消せません。
          </p>

          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 20 }}>
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              style={{ width: 16, height: 16, accentColor: T.terracotta }}
            />
            <span style={{ fontSize: 13, color: T.ink70 }}>
              上記の内容を理解し、退会することに同意します
            </span>
          </label>

          {error && (
            <div style={{ fontSize: 12, color: T.terracotta, marginBottom: 12 }}>{error}</div>
          )}

          <button
            onClick={handleDelete}
            disabled={!confirmed || deleting}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: 999,
              border: 'none',
              background: confirmed ? T.terracotta : T.hairline,
              color: confirmed ? '#fff' : T.ink50,
              fontSize: 14,
              fontWeight: 600,
              cursor: confirmed && !deleting ? 'pointer' : 'default',
              fontFamily: 'inherit',
              transition: 'background 0.15s',
            }}
          >
            {deleting ? '処理中...' : '退会する'}
          </button>
        </div>
      </div>
    </div>
  );
}
