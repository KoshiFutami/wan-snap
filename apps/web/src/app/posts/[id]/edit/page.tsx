'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getValidToken } from '../../../../lib/auth-store';
import { api, type Post } from '../../../../lib/api';
import { PhotoTagCanvas } from '../../../../components/photo-tag-canvas';
import { HashtagInput } from '../../../../components/hashtag-input';
import { ItemEditorSection, generateItemKey, validateItems, type EditableItem } from '../../../../components/item-editor-section';

type PostMode = 'outfit' | 'grooming';

const T = {
  ink: '#1F1A14',
  ink70: '#4A4239',
  ink50: '#7E7567',
  ink10: '#E8E0D0',
  paper: '#FFFEFB',
  cream: '#F4EDE0',
  creamSoft: '#FAF5EA',
  terracotta: '#B95A3D',
  hairline: 'rgba(31,26,20,0.08)',
  hairlineStrong: 'rgba(31,26,20,0.14)',
};

const inputStyle = {
  width: '100%', height: 46, background: T.paper, borderRadius: 12,
  border: `1px solid ${T.hairline}`, padding: '0 14px',
  fontSize: 14, color: T.ink, fontFamily: 'inherit', outline: 'none',
  boxSizing: 'border-box' as const,
};

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
  const [postMode, setPostMode] = useState<PostMode>('outfit');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [items, setItems] = useState<EditableItem[]>([]);
  const [placingItemKey, setPlacingItemKey] = useState<string | null>(null);
  const [salonName, setSalonName] = useState('');
  const [salonUrl, setSalonUrl] = useState('');
  const [salonInstagram, setSalonInstagram] = useState('');
  const [cutStyle, setCutStyle] = useState('');
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
      setLocation(p.location ?? '');
      setTags(p.tags);
      setItems(p.items.map(({ id: _id, category, ...item }) => ({ ...item, category: category as EditableItem['category'], _key: generateItemKey() })));

      if (p.grooming) {
        setPostMode('grooming');
        setSalonName(p.grooming.salonName);
        setSalonUrl(p.grooming.salonUrl ?? '');
        setSalonInstagram(p.grooming.salonInstagram ?? '');
        setCutStyle(p.grooming.cutStyle ?? '');
      }
    });
  }, [id, router]);

  const handleSave = async () => {
    if (!post) return;
    if (postMode === 'outfit') {
      const urlError = validateItems(items);
      if (urlError) { setError(urlError); return; }
    }
    if (postMode === 'grooming' && !salonName.trim()) {
      setError('サロン名を入力してください');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      const token = tokenRef.current ?? await getValidToken();
      if (!token) throw new Error('ログインが必要です');
      await api.posts.update(
        post.id,
        {
          caption: caption.trim() || undefined,
          location: location.trim() || undefined,
          tags,
          items: postMode === 'outfit' ? items.map(({ _key: _k, ...rest }) => rest) : [],
          grooming: postMode === 'grooming' && salonName.trim()
            ? {
                salonName: salonName.trim(),
                salonUrl: salonUrl.trim() || null,
                salonInstagram: salonInstagram.trim() || null,
                cutStyle: cutStyle.trim() || null,
                note: null,
              }
            : null,
        },
        token,
      );
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

  const handlePlaceItem = (key: string, xPct: number, yPct: number) => {
    setItems((current) =>
      current.map((item) => (item._key === key ? { ...item, xPct, yPct } : item)),
    );
    setPlacingItemKey(null);
  };

  const handleClearItemPosition = (key: string) => {
    setItems((current) =>
      current.map((item) =>
        item._key === key ? { ...item, xPct: null, yPct: null } : item,
      ),
    );
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
          border: `1px solid ${T.hairline}`, marginBottom: 16,
        }}>
          <div style={{
            width: 64, height: 80, borderRadius: 10, overflow: 'hidden',
            background: T.ink10, flexShrink: 0, position: 'relative',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            {postMode === 'grooming' && (
              <div style={{
                position: 'absolute', top: 4, left: 4,
                background: T.terracotta, borderRadius: 3,
                padding: '1px 4px', fontSize: 7, fontWeight: 700, color: '#fff', letterSpacing: '0.05em',
              }}>
                TRIM
              </div>
            )}
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
              ♥ {post.likeCount} · 💬 {post.commentCount} · ✓ {post.items.length}
            </div>
          </div>
        </div>

        {/* コーデ / トリミング タブ */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {(['outfit', 'grooming'] as PostMode[]).map((mode) => {
            const active = postMode === mode;
            const label = mode === 'outfit' ? 'コーデ' : 'トリミング';
            return (
              <button
                key={mode}
                type="button"
                onClick={() => setPostMode(mode)}
                style={{
                  flex: 1,
                  padding: '9px 0',
                  borderRadius: 10,
                  background: active ? T.ink : T.paper,
                  color: active ? T.cream : T.ink70,
                  border: `1px solid ${active ? T.ink : T.hairline}`,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                {mode === 'outfit' ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M6 3L3 6l4 4-1 4 4-1 4 4 3-3-2-2 2-2-2-2 2-2-3-3-2 2-2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                {label}
              </button>
            );
          })}
        </div>

        <div style={{ marginBottom: 20 }}>
          <PhotoTagCanvas
            imageUrl={post.imageUrl}
            items={postMode === 'outfit' ? items : []}
            placingItemKey={postMode === 'outfit' ? placingItemKey : null}
            onPlace={handlePlaceItem}
            onClearPosition={handleClearItemPosition}
          />
        </div>

        {/* トリミング情報フォーム */}
        {postMode === 'grooming' && (
          <div style={{
            background: T.paper,
            borderRadius: 14,
            border: `1px solid ${T.hairline}`,
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            marginBottom: 20,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 14,
                background: T.terracotta,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M6 3L3 6l4 4-1 4 4-1 4 4 3-3-2-2 2-2-2-2 2-2-3-3-2 2-2-2z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', color: T.terracotta }}>TRIMMING · 仕上がり報告</div>
                <div style={{ fontSize: 11, color: T.ink50, marginTop: 1 }}>サロン名とURLを記録すると、他のオーナーの参考になります</div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 11.5, fontWeight: 500, color: T.ink }}>
                  サロン名 <span style={{ color: T.terracotta }}>*</span>
                </label>
                <span style={{ fontSize: 10, color: T.ink50 }}>必須</span>
              </div>
              <input type="text" value={salonName} onChange={(e) => setSalonName(e.target.value)} maxLength={100} placeholder="例: Salon de Wan 表参道" style={inputStyle} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 11.5, fontWeight: 500, color: T.ink }}>ウェブサイト / 予約URL</label>
                <span style={{ fontSize: 10, color: T.ink50 }}>任意</span>
              </div>
              <input type="url" value={salonUrl} onChange={(e) => setSalonUrl(e.target.value)} maxLength={512} placeholder="https://salon-de-wan.jp" style={inputStyle} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 11.5, fontWeight: 500, color: T.ink }}>Instagram</label>
                <span style={{ fontSize: 10, color: T.ink50 }}>任意</span>
              </div>
              <input type="text" value={salonInstagram} onChange={(e) => setSalonInstagram(e.target.value)} maxLength={100} placeholder="@salondewan_omotesando" style={inputStyle} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 11.5, fontWeight: 500, color: T.ink }}>カット / メニュー</label>
                <span style={{ fontSize: 10, color: T.ink50 }}>任意</span>
              </div>
              <input type="text" value={cutStyle} onChange={(e) => setCutStyle(e.target.value)} maxLength={100} placeholder="例: サマーカット" style={inputStyle} />
            </div>
          </div>
        )}

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

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11.5, fontWeight: 500, color: T.ink, letterSpacing: '0.02em', marginBottom: 6 }}>タグ</div>
          <HashtagInput value={tags} onChange={setTags} />
        </div>

        {/* 着用アイテム（コーデモードのみ） */}
        {postMode === 'outfit' && (
          <div style={{ marginBottom: 24 }}>
            <ItemEditorSection
              items={items}
              onChange={setItems}
              placingItemKey={placingItemKey}
              onSetPosition={setPlacingItemKey}
            />
          </div>
        )}

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11.5, fontWeight: 500, color: T.ink, letterSpacing: '0.02em', marginBottom: 6 }}>場所</div>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value.slice(0, 100))}
            maxLength={100}
            placeholder="例: 代々木公園、渋谷ドッグラン"
            style={inputStyle}
          />
        </div>
        {/* TODO: スナップの公開範囲仕様が確定したら登録・編集画面に再表示する */}

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

      {/* Home indicator */}
      <div style={{
        position: 'fixed', bottom: 8, left: '50%', transform: 'translateX(-50%)',
        width: 134, height: 5, borderRadius: 3, background: T.ink, opacity: 0.85, zIndex: 10,
        pointerEvents: 'none',
      }} />
    </div>
  );
}
