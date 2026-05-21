'use client';

import { useState, useRef, useEffect } from 'react';
import type { Comment } from '../../../lib/api';
import { api } from '../../../lib/api';
import { getValidToken } from '../../../lib/auth-store';

const T = {
  ink: '#1F1A14',
  ink70: '#4A4239',
  ink50: '#7E7567',
  ink30: '#B8AE9E',
  ink10: '#E8E0D0',
  paper: '#FFFEFB',
  cream: '#F4EDE0',
  terracotta: '#B95A3D',
  hairline: 'rgba(31,26,20,0.08)',
};

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'たった今';
  if (m < 60) return `${m}分前`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}時間前`;
  return `${Math.floor(h / 24)}日前`;
}

type Props = {
  postId: string;
  initialComments: Comment[];
  initialNextCursor: string | null;
  commentCount: number;
};

export function CommentSection({
  postId,
  initialComments,
  initialNextCursor,
  commentCount: initialCount,
}: Props) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor);
  const [count, setCount] = useState(initialCount);
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    getValidToken().then(async (token) => {
      if (!token) return;
      const me = await api.users.getMe(token).catch(() => null);
      if (me) setCurrentUserId(me.id);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = body.trim();
    if (!trimmed || submitting) return;

    const token = await getValidToken();
    if (!token) return;

    setSubmitting(true);
    try {
      const comment = await api.posts.createComment(postId, trimmed, token);
      setComments((prev) => [...prev, comment]);
      setCount((c) => c + 1);
      setBody('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const token = await getValidToken();
    if (!token) return;
    await api.comments.delete(id, token);
    setComments((prev) => prev.filter((c) => c.id !== id));
    setCount((c) => c - 1);
  };

  const loadMore = async () => {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await api.posts.listComments(postId, { cursor: nextCursor });
      setComments((prev) => [...prev, ...res.comments]);
      setNextCursor(res.nextCursor);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div style={{ padding: '0 12px 24px' }}>
      {/* セクションヘッダー */}
      <div
        style={{
          fontSize: 10,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: T.ink50,
          fontWeight: 500,
          marginBottom: 16,
        }}
      >
        コメント · {count}
      </div>

      {/* コメント一覧 */}
      {comments.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          {comments.map((comment) => (
            <div
              key={comment.id}
              style={{
                display: 'flex',
                gap: 10,
                marginBottom: 14,
                alignItems: 'flex-start',
              }}
            >
              {/* アバタープレースホルダー */}
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  background: T.ink10,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  color: T.ink50,
                  fontWeight: 600,
                  overflow: 'hidden',
                }}
              >
                {comment.author.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={comment.author.avatarUrl}
                    alt={comment.author.displayName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  comment.author.displayName.charAt(0).toUpperCase()
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 3 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: T.ink }}>
                    {comment.author.displayName}
                  </span>
                  <span style={{ fontSize: 10.5, color: T.ink50 }}>
                    {relativeTime(comment.createdAt)}
                  </span>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: T.ink70,
                    lineHeight: 1.5,
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {comment.body}
                </p>
              </div>

              {/* 削除ボタン（投稿者本人のみ） */}
              {currentUserId === comment.author.id && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '2px 4px',
                    cursor: 'pointer',
                    color: T.ink30,
                    fontSize: 11,
                    flexShrink: 0,
                  }}
                  title="削除"
                >
                  ×
                </button>
              )}
            </div>
          ))}

          {nextCursor && (
            <button
              onClick={loadMore}
              disabled={loadingMore}
              style={{
                background: 'none',
                border: `1px solid ${T.hairline}`,
                borderRadius: 8,
                padding: '6px 12px',
                fontSize: 12,
                color: T.ink50,
                cursor: 'pointer',
                width: '100%',
                marginBottom: 12,
              }}
            >
              {loadingMore ? '読み込み中...' : 'さらに表示'}
            </button>
          )}
        </div>
      )}

      {/* コメント入力フォーム */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
        <textarea
          ref={textareaRef}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="コメントを追加..."
          maxLength={500}
          rows={2}
          style={{
            flex: 1,
            padding: '10px 12px',
            borderRadius: 12,
            border: `1px solid ${T.hairline}`,
            background: T.cream,
            fontSize: 13,
            color: T.ink,
            resize: 'none',
            outline: 'none',
            fontFamily: 'inherit',
            lineHeight: 1.5,
          }}
        />
        <button
          type="submit"
          disabled={!body.trim() || submitting}
          style={{
            padding: '10px 16px',
            borderRadius: 12,
            border: 'none',
            background: body.trim() ? T.terracotta : T.ink10,
            color: body.trim() ? '#fff' : T.ink50,
            fontSize: 13,
            fontWeight: 600,
            cursor: body.trim() ? 'pointer' : 'default',
            transition: 'background 0.15s',
            whiteSpace: 'nowrap',
          }}
        >
          {submitting ? '...' : '送信'}
        </button>
      </form>
    </div>
  );
}
