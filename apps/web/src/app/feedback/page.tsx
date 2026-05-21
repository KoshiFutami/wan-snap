'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getValidToken } from '../../lib/auth-store';
import { api } from '../../lib/api';

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

export default function FeedbackPage() {
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const token = await getValidToken();
      if (!token) { setError('ログインが必要です'); return; }
      await api.feedback.send({ message: trimmed }, token);
      setSent(true);
    } catch {
      setError('送信に失敗しました。もう一度お試しください。');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: T.cream }}>
      {/* ヘッダー */}
      <div style={{ padding: '16px 16px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link
          href="/settings"
          style={{ color: T.ink50, fontSize: 13, textDecoration: 'none' }}
        >
          ← 戻る
        </Link>
        <span style={{ fontSize: 15, fontWeight: 600, color: T.ink }}>機能要望</span>
      </div>

      <div style={{ padding: '32px 16px' }}>
        {sent ? (
          <div style={{
            padding: 24,
            background: T.paper,
            borderRadius: 16,
            textAlign: 'center',
            border: `1px solid ${T.hairline}`,
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🐾</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.ink, marginBottom: 8 }}>
              ありがとうございます！
            </div>
            <p style={{ fontSize: 13, color: T.ink70, lineHeight: 1.6, margin: '0 0 24px' }}>
              要望を受け付けました。
            </p>
            <Link
              href="/profile"
              style={{
                display: 'inline-block',
                padding: '11px 28px',
                borderRadius: 999,
                background: T.ink,
                color: '#fff',
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              プロフィールへ戻る
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p style={{ fontSize: 13, color: T.ink70, lineHeight: 1.7, margin: '0 0 20px' }}>
              ほしい機能や改善点、バグ報告などを自由に書いてください。
              いただいた要望はすべて目を通しています。
            </p>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="例: 投稿にブランドのタグをつけられるようにしてほしい"
              maxLength={2000}
              rows={8}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 14,
                border: `1px solid ${T.hairlineStrong}`,
                background: T.paper,
                fontSize: 14,
                color: T.ink,
                resize: 'none',
                outline: 'none',
                fontFamily: 'inherit',
                lineHeight: 1.6,
                boxSizing: 'border-box',
              }}
            />

            <div style={{ textAlign: 'right', fontSize: 11, color: T.ink50, marginTop: 4, marginBottom: 16 }}>
              {message.length} / 2000
            </div>

            {error && (
              <div style={{ fontSize: 12, color: T.terracotta, marginBottom: 12 }}>{error}</div>
            )}

            <button
              type="submit"
              disabled={!message.trim() || submitting}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 999,
                border: 'none',
                background: message.trim() ? T.ink : T.hairline,
                color: message.trim() ? '#fff' : T.ink50,
                fontSize: 14,
                fontWeight: 600,
                cursor: message.trim() && !submitting ? 'pointer' : 'default',
                fontFamily: 'inherit',
                transition: 'background 0.15s',
              }}
            >
              {submitting ? '送信中...' : '送信する'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
