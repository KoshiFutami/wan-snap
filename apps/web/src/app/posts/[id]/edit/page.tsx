'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getValidToken } from '../../../../lib/auth-store';
import { api, type Post, type PostItem } from '../../../../lib/api';

const T = {
  ink: '#1F1A14',
  ink70: '#4A4239',
  ink50: '#7E7567',
  ink30: '#B8AE9E',
  ink10: '#E8E0D0',
  paper: '#FFFEFB',
  cream: '#F4EDE0',
  creamSoft: '#FAF5EA',
  terracotta: '#B95A3D',
  forest: '#3D7A4B',
  hairline: 'rgba(31,26,20,0.08)',
  hairlineStrong: 'rgba(31,26,20,0.14)',
};

type EditableItem = Omit<PostItem, 'id'> & { _key: string };

function itemKey() {
  return Math.random().toString(36).slice(2);
}

function relativeTime(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'たった今';
  if (diff < 3600) return `${Math.floor(diff / 60)}分前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}時間前`;
  return `${Math.floor(diff / 86400)}日前`;
}

export default function PostEditPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [caption, setCaption] = useState('');
  const [items, setItems] = useState<EditableItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const tokenRef = useRef<string | null>(null);

  useEffect(() => {
    getValidToken().then(async (token) => {
      if (!token) { router.replace('/auth/sign-in'); return; }
      tokenRef.current = token;

      const me = await api.users.getMe(token).catch(() => null);
      const p = await api.posts.get(id).catch(() => null);
      if (!p) { router.replace('/'); return; }
      if (!me || p.authorId !== me.id) { router.replace(`/posts/${id}`); return; }

      setPost(p);
      setCaption(p.caption ?? '');
      setItems(p.items.map((item) => ({ ...item, _key: itemKey() })));
    });
  }, [id, router]);

  const handleSave = async () => {
    if (!post) return;
    setError(null);
    setSaving(true);
    try {
      const token = tokenRef.current ?? await getValidToken();
      if (!token) throw new Error('ログインが必要です');
      const sanitizedItems = items.map(({ _key: _k, ...rest }) => rest);
      await api.posts.update(post.id, { caption: caption.trim() || undefined, items: sanitizedItems }, token);
      router.push(`/posts/${post.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!post) return;
    setDeleting(true);
    try {
      const token = tokenRef.current ?? await getValidToken();
      if (!token) throw new Error('ログインが必要です');
      await api.posts.delete(post.id, token);
      router.push('/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : '削除に失敗しました');
      setDeleting(false);
    }
  };

  const removeItem = (key: string) => {
    setItems((prev) => prev.filter((i) => i._key !== key));
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        _key: itemKey(),
        category: 'アクセサリー',
        brand: null,
        productName: null,
        size: null,
        purchaseUrl: null,
        priceJpy: null,
        fitNote: null,
      },
    ]);
  };

  if (!post) {
    return (
      <div style={{ padding: '64px 20px', textAlign: 'center', color: T.ink50, fontSize: 14 }}>
        読み込み中…
      </div>
    );
  }

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
          スナップを編集
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: '7px 16px', borderRadius: 999,
            background: saving ? T.ink10 : T.ink,
            color: saving ? T.ink50 : T.cream,
            border: 'none', fontSize: 12, fontWeight: 600,
            cursor: saving ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit', flexShrink: 0,
            transition: 'background 0.15s',
          }}
        >
          {saving ? '保存中…' : '保存'}
        </button>
      </div>

      <div style={{ padding: '20px 20px 40px' }}>
        {/* Compact photo preview */}
        <div style={{
          display: 'flex', gap: 12, alignItems: 'center',
          background: T.paper, padding: 12, borderRadius: 14,
          border: `1px solid ${T.hairline}`, marginBottom: 20,
        }}>
          <div style={{
            width: 64, height: 80, borderRadius: 10, overflow: 'hidden',
            background: T.ink10, flexShrink: 0,
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase',
              color: T.ink50, fontWeight: 500,
            }}>
              公開済み · {relativeTime(post.createdAt)}
            </div>
            <div style={{
              fontSize: 13, fontWeight: 500, color: T.ink, marginTop: 4, lineHeight: 1.4,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            } as React.CSSProperties}>
              {post.caption ?? '(キャプションなし)'}
            </div>
            <div style={{ fontSize: 10.5, color: T.ink50, marginTop: 6, fontFamily: 'var(--font-mono, monospace)' }}>
              ✓ {post.items.length}アイテム
            </div>
          </div>
        </div>

        {/* Caption */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ fontSize: 11.5, fontWeight: 500, color: T.ink, letterSpacing: '0.02em' }}>キャプション</div>
            <div style={{ fontSize: 10, color: T.ink50, fontFamily: 'var(--font-mono, monospace)' }}>
              {caption.length} / 500
            </div>
          </div>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value.slice(0, 500))}
            rows={3}
            maxLength={500}
            placeholder="キャプションを入力…"
            style={{
              width: '100%', background: T.paper, borderRadius: 12,
              border: `1px solid ${T.hairline}`, padding: '12px 14px',
              fontSize: 14, color: T.ink, fontFamily: 'inherit', outline: 'none',
              resize: 'none', lineHeight: 1.55, boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Tagged items */}
        <div style={{ marginBottom: 24 }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 8,
          }}>
            <div style={{ fontSize: 11.5, fontWeight: 500, color: T.ink, letterSpacing: '0.02em' }}>
              着用アイテム{' '}
              {items.length > 0 && (
                <span style={{ color: T.ink50, fontWeight: 400 }}>· {items.length}</span>
              )}
            </div>
            <button
              onClick={addItem}
              style={{
                background: 'transparent', border: 'none', color: T.terracotta,
                fontSize: 11, fontWeight: 500, padding: 0, cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              + 追加
            </button>
          </div>

          {items.map((item, i) => (
            <div key={item._key} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: T.paper, borderRadius: 12, padding: 12, marginBottom: 8,
              border: `1px solid ${T.hairline}`,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 8,
                background: T.cream, flexShrink: 0,
                border: `1px solid ${T.hairline}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}>
                <div style={{
                  width: 6, height: 6, borderRadius: 6,
                  background: i % 2 === 0 ? T.terracotta : T.forest,
                }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: T.ink50, fontWeight: 600,
                }}>
                  {item.brand ?? item.category}
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 500, color: T.ink, marginTop: 2 }}>
                  {item.productName ?? '—'}
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 3, fontSize: 10, color: T.ink70 }}>
                  {item.size && <span>{item.size}</span>}
                  {item.size && item.fitNote && <span style={{ color: T.ink30 }}>·</span>}
                  {item.fitNote && (
                    <span style={{ color: i % 2 === 0 ? T.terracotta : T.forest }}>{item.fitNote}</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => removeItem(item._key)}
                style={{
                  width: 28, height: 28, borderRadius: 7,
                  background: 'transparent', border: `1px solid ${T.hairlineStrong}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: T.ink50, cursor: 'pointer', flexShrink: 0,
                }}
                aria-label="削除"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 3h10M4 3V1.5h4V3M3 3l.8 8h4.4l.8-8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {error && (
          <div style={{
            padding: '12px 14px', borderRadius: 10,
            background: 'rgba(185,90,61,0.08)', border: `1px solid rgba(185,90,61,0.2)`,
            color: T.terracotta, fontSize: 13, marginBottom: 16,
          }}>
            {error}
          </div>
        )}

        {/* Danger zone */}
        <div style={{
          padding: '16px 14px', borderRadius: 12,
          background: 'rgba(185,90,61,0.06)',
          border: `1px solid rgba(185,90,61,0.18)`,
        }}>
          {confirmDelete ? (
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: T.terracotta, marginBottom: 4 }}>
                本当に削除しますか？
              </div>
              <div style={{ fontSize: 10.5, color: T.ink70, marginBottom: 12 }}>この操作は取り消せません</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setConfirmDelete(false)}
                  style={{
                    flex: 1, padding: '8px 14px', borderRadius: 999,
                    background: T.paper, color: T.ink70,
                    border: `1px solid ${T.hairlineStrong}`,
                    fontSize: 11, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  キャンセル
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  style={{
                    flex: 1, padding: '8px 14px', borderRadius: 999,
                    background: T.terracotta, color: '#fff',
                    border: 'none',
                    fontSize: 11, fontWeight: 600,
                    cursor: deleting ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {deleting ? '削除中…' : '削除する'}
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: T.terracotta }}>スナップを削除</div>
                <div style={{ fontSize: 10.5, color: T.ink70, marginTop: 3 }}>この操作は取り消せません</div>
              </div>
              <button
                onClick={() => setConfirmDelete(true)}
                style={{
                  padding: '8px 14px', borderRadius: 999,
                  background: 'transparent', color: T.terracotta,
                  border: `1px solid ${T.terracotta}`,
                  fontSize: 11, fontWeight: 500,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                削除
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
