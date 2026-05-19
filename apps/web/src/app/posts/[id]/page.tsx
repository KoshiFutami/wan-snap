import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { EditButton } from './EditButton';
import { BookmarkButton } from './BookmarkButton';
import { LikeButton } from './LikeButton';
import { FollowButton } from './FollowButton';
import { CommentSection } from './CommentSection';
import { ShareButton } from './ShareButton';
import { PostMediaSection } from './PostMediaSection';

type Props = { params: Promise<{ id: string }> };

const T = {
  ink: '#1F1A14',
  ink70: '#4A4239',
  ink50: '#7E7567',
  ink30: '#B8AE9E',
  ink10: '#E8E0D0',
  paper: '#FFFEFB',
  cream: '#F4EDE0',
  terracotta: '#B95A3D',
  forest: '#3F5A40',
  hairline: 'rgba(31,26,20,0.08)',
};

function relativeTime(iso: string): string {
  const date = new Date(iso);
  const diff = Date.now() - date.getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'たった今';
  if (m < 60) return `${m}分前`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}時間前`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}日前`;
  const sameYear = date.getFullYear() === new Date().getFullYear();
  return date.toLocaleDateString('ja-JP', {
    ...(!sameYear && { year: 'numeric' }),
    month: 'long',
    day: 'numeric',
  });
}


export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;
  const post = await api.posts.get(id).catch(() => null);
  if (!post) notFound();

  const commentsRes = await api.posts.listComments(id).catch(() => ({ comments: [], nextCursor: null }));

  const dogName = post.dog?.name ?? 'わんこ';
  const breed = post.dog?.breed;
  const weight = post.dog?.weightKg;
  const neckCm = post.dog?.neckCm;
  const chestCm = post.dog?.chestCm;
  const backLengthCm = post.dog?.backLengthCm;
  const dogPhotoUrl = post.dog?.photoUrl;

  return (
    <div style={{ paddingBottom: 40, background: T.paper }}>
      {/* ヘッダー：戻る／シェア／ブックマーク */}
      <div style={{
        padding: '16px 20px 8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 38,
            height: 38,
            borderRadius: 19,
            background: T.paper,
            border: `1px solid ${T.hairline}`,
            textDecoration: 'none',
            color: T.ink,
            flexShrink: 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M14 5l-7 7 7 7" stroke={T.ink} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* シェアボタン */}
          <ShareButton postId={post.id} />
          <BookmarkButton postId={post.id} initialCount={post.bookmarkCount ?? 0} initialBookmarked={post.isBookmarkedByMe ?? false} />
          <EditButton postId={post.id} authorId={post.authorId} />
        </div>
      </div>

      <PostMediaSection
        imageUrl={post.imageUrl}
        imageAlt={post.caption ?? 'スナップ写真'}
        imageWidth={post.imageWidth ?? null}
        imageHeight={post.imageHeight ?? null}
        items={post.items}
        hasGrooming={!!post.grooming}
      />

      {/* グルーミング情報カード */}
      {post.grooming && (
        <div style={{
          margin: '0 20px 16px',
          borderRadius: 18,
          background: '#FAF5EA',
          border: `1px solid ${T.hairline}`,
          overflow: 'hidden',
        }}>
          {/* ヘッダー */}
          <div style={{ padding: '14px 16px 12px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 19,
              background: T.terracotta,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="6" cy="6" r="2.5" stroke="#fff" strokeWidth="1.6" />
                <circle cx="6" cy="18" r="2.5" stroke="#fff" strokeWidth="1.6" />
                <path d="M8.5 6l11 11M8.5 18L19.5 7" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div style={{
                fontSize: 9.5,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: T.terracotta,
                fontWeight: 600,
                marginBottom: 2,
              }}>
                TRIMMING · 仕上がり報告
              </div>
              <div style={{
                fontFamily: 'var(--font-serif, serif)',
                fontSize: 17,
                fontWeight: 500,
                color: T.ink,
                lineHeight: 1.2,
              }}>
                {post.grooming.salonName}
              </div>
            </div>
          </div>

          {/* URL行 */}
          {post.grooming.salonUrl && (
            <div style={{
              margin: '0 12px 8px',
              padding: '10px 12px',
              borderRadius: 12,
              background: T.paper,
              border: `1px solid ${T.hairline}`,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke={T.ink50} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke={T.ink50} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ flex: 1, fontSize: 12, color: T.ink50, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {post.grooming.salonUrl.replace(/^https?:\/\//, '')}
              </span>
              <a
                href={post.grooming.salonUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '5px 12px',
                  borderRadius: 999,
                  background: T.terracotta,
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 600,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                店舗サイトを開く →
              </a>
            </div>
          )}

          {/* Instagram行 */}
          {post.grooming.salonInstagram && (
            <div style={{
              margin: `0 12px ${post.grooming.cutStyle ? '8px' : '12px'}`,
              padding: '10px 12px',
              borderRadius: 12,
              background: T.paper,
              border: `1px solid ${T.hairline}`,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <rect x="2" y="2" width="20" height="20" rx="5" stroke={T.ink50} strokeWidth="1.8" />
                <circle cx="12" cy="12" r="4" stroke={T.ink50} strokeWidth="1.8" />
                <circle cx="17.5" cy="6.5" r="1" fill={T.ink50} />
              </svg>
              <span style={{ flex: 1, fontSize: 12, color: T.ink50, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                @{post.grooming.salonInstagram.replace(/\/+$/, '')}
              </span>
              <a
                href={`https://www.instagram.com/${post.grooming.salonInstagram.replace(/\/+$/, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '5px 12px',
                  borderRadius: 999,
                  background: 'transparent',
                  color: T.terracotta,
                  fontSize: 11,
                  fontWeight: 600,
                  textDecoration: 'none',
                  border: `1.5px solid ${T.terracotta}`,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                Instagram →
              </a>
            </div>
          )}

          {/* MENU行 */}
          {post.grooming.cutStyle && (
            <div style={{
              margin: '0 12px 12px',
              padding: '10px 12px',
              borderRadius: 12,
              background: T.paper,
              border: `1px solid ${T.hairline}`,
            }}>
              <div style={{
                fontSize: 9,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: T.ink50,
                fontWeight: 600,
                marginBottom: 4,
              }}>
                MENU
              </div>
              <div style={{ fontSize: 13, color: T.ink, lineHeight: 1.5 }}>
                {post.grooming.cutStyle}
              </div>
            </div>
          )}
        </div>
      )}

      {/* オーナー・犬情報 */}
      <div style={{
        padding: '18px 20px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <Link
          href={post.author ? `/users/${post.author.username}` : '#'}
          style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', flex: 1, minWidth: 0 }}
        >
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            background: T.ink10,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative',
          }}>
            {dogPhotoUrl ? (
              <Image
                src={dogPhotoUrl}
                alt={`${dogName}の登録画像`}
                fill
                sizes="44px"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <svg width="26" height="26" viewBox="0 0 24 24" fill={T.ink50}>
                <ellipse cx="6" cy="9" rx="2" ry="2.6" />
                <ellipse cx="11" cy="6.4" rx="2" ry="2.6" />
                <ellipse cx="16.3" cy="7.6" rx="2" ry="2.6" />
                <ellipse cx="20" cy="11.5" rx="1.8" ry="2.3" />
                <path d="M12 11c-3.5 0-6.5 2.6-6.5 5.8 0 2 1.5 3.4 3.5 3.4 1.2 0 2.2-.6 3-.6s1.8.6 3 .6c2 0 3.5-1.4 3.5-3.4 0-3.2-3-5.8-6.5-5.8z" />
              </svg>
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{
                fontFamily: 'var(--font-serif, serif)',
                fontSize: 18,
                fontWeight: 500,
                color: T.ink,
                lineHeight: 1,
              }}>
                {dogName}
              </span>
              {post.author?.username && (
                <span style={{ fontSize: 11, color: T.ink50 }}>@{post.author.username}</span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 5, flexWrap: 'wrap' }}>
              {breed && (
                <span style={{
                  padding: '2px 7px',
                  borderRadius: 4,
                  background: T.cream,
                  fontSize: 10,
                  color: T.ink,
                }}>
                  {breed}
                </span>
              )}
              {weight != null && (
                <span style={{ fontSize: 10.5, color: T.ink, fontFamily: 'var(--font-mono, monospace)', fontWeight: 500 }}>
                  {weight}kg
                </span>
              )}
              {(neckCm != null || chestCm != null || backLengthCm != null) && (
                <span style={{ fontSize: 10, color: T.ink50, fontFamily: 'var(--font-mono, monospace)' }}>
                  {[
                    neckCm != null ? `首${neckCm}` : null,
                    chestCm != null ? `胸${chestCm}` : null,
                    backLengthCm != null ? `背${backLengthCm}` : null,
                  ].filter(Boolean).join(' / ')}cm
                </span>
              )}
            </div>
          </div>
        </Link>
        <FollowButton authorId={post.authorId} />
      </div>

      {/* キャプション */}
      {post.caption && (
        <div style={{ padding: '0 20px 18px', fontSize: 13, lineHeight: 1.6, color: T.ink, whiteSpace: 'pre-wrap' }}>
          {post.caption}
        </div>
      )}

      {/* タグ */}
      {post.tags.length > 0 && (
        <div style={{ padding: '0 20px 16px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              style={{ fontSize: 12, color: T.ink50, fontWeight: 500, textDecoration: 'none' }}
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {/* アクションバー：いいね・コメント件数・時刻 */}
      <div style={{
        padding: '18px 20px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}>
        <LikeButton
          postId={post.id}
          initialCount={post.likeCount ?? 0}
          initialLiked={post.isLikedByMe ?? false}
          flat
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M4 5h16v11h-9l-4 3.5V16H4V5z" stroke={T.ink} strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 13, fontWeight: 500, color: T.ink }}>
            {post.commentCount}
          </span>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 11, color: T.ink50 }}>
          {relativeTime(post.createdAt)}
          {post.location && ` · ${post.location}`}
        </div>
      </div>

      {/* コメントセクション */}
      <CommentSection
        postId={post.id}
        initialComments={commentsRes.comments}
        initialNextCursor={commentsRes.nextCursor}
        commentCount={post.commentCount ?? 0}
      />
    </div>
  );
}
