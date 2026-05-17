import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { EditButton } from './EditButton';
import { BookmarkButton } from './BookmarkButton';
import { LikeButton } from './LikeButton';
import { FollowButton } from './FollowButton';
import { CommentSection } from './CommentSection';
import { ItemTagOverlay } from '../../../components/photo-tag-canvas';

type Props = { params: Promise<{ id: string }> };

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
  forest: '#3F5A40',
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

const itemColors = [T.terracotta, T.forest, '#7B6EA8', '#2E7D8A'];

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;
  const post = await api.posts.get(id).catch(() => null);
  if (!post) notFound();

  const commentsRes = await api.posts.listComments(id).catch(() => ({ comments: [], nextCursor: null }));

  const dogName = post.dog?.name ?? 'わんこ';
  const breed = post.dog?.breed;
  const weight = post.dog?.weightKg;
  const dogPhotoUrl = post.dog?.photoUrl;
  const positionedItems = post.items.filter(
    (item) => item.xPct != null && item.yPct != null,
  );
  const listItems = post.items.filter(
    (item) => item.xPct == null || item.yPct == null,
  );

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
          <button
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 38,
              height: 38,
              borderRadius: 19,
              background: T.paper,
              border: `1px solid ${T.hairline}`,
              cursor: 'pointer',
            }}
            aria-label="シェア"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 3v13M7 8l5-5 5 5M4 17v2a1 1 0 001 1h14a1 1 0 001-1v-2" stroke={T.ink} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <BookmarkButton postId={post.id} initialCount={post.bookmarkCount ?? 0} />
          <EditButton postId={post.id} authorId={post.authorId} />
        </div>
      </div>

      {/* メイン写真 */}
      <div style={{
        margin: '0 20px',
        borderRadius: 20,
        overflow: 'hidden',
        aspectRatio: post.imageWidth && post.imageHeight ? `${post.imageWidth}/${post.imageHeight}` : '4/5',
        background: T.ink10,
        position: 'relative',
      }}>
        <Image
          src={post.imageUrl}
          alt={post.caption ?? 'スナップ写真'}
          fill
          sizes="(max-width: 390px) calc(100vw - 40px), 350px"
          style={{ objectFit: 'cover' }}
          priority
        />
        {positionedItems.map((item) => (
          <ItemTagOverlay
            key={item.id}
            xPct={item.xPct!}
            yPct={item.yPct!}
            brand={item.brand}
            category={item.category}
            productName={item.productName}
          />
        ))}
      </div>

      {/* オーナー・犬情報 */}
      <div style={{
        padding: '18px 20px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <Link
          href={`/users/${post.authorId}`}
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
              {post.author?.displayName && (
                <span style={{ fontSize: 11, color: T.ink50 }}>{post.author.displayName}</span>
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
            </div>
          </div>
        </Link>
        <FollowButton authorId={post.authorId} />
      </div>

      {/* キャプション */}
      {post.caption && (
        <div style={{ padding: '0 20px 18px', fontSize: 13, lineHeight: 1.6, color: T.ink }}>
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

      {/* 着用アイテム */}
      {listItems.length > 0 && (
        <div style={{
          margin: '0 20px',
          padding: '18px 16px 16px',
          borderRadius: 18,
          background: T.creamSoft,
          border: `1px solid ${T.hairline}`,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 14,
          }}>
            <div style={{
              fontSize: 10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: T.ink50,
              fontWeight: 500,
            }}>
              着用アイテム · {listItems.length}
            </div>
            <div style={{ fontSize: 11, color: T.terracotta, fontWeight: 500 }}>すべて見る →</div>
          </div>

          {listItems.map((item, i) => {
            const color = itemColors[i % itemColors.length];
            return (
              <div key={item.id}>
                {i > 0 && <div style={{ height: 1, background: T.hairline, margin: '12px 0' }} />}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {/* プロダクトサムネイル */}
                  <div style={{
                    width: 52,
                    height: 52,
                    borderRadius: 10,
                    background: T.paper,
                    border: `1px solid ${T.hairline}`,
                    flexShrink: 0,
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: `repeating-linear-gradient(45deg, ${T.ink10} 0, ${T.ink10} 4px, transparent 4px, transparent 8px)`,
                    }} />
                    <div style={{
                      position: 'absolute',
                      top: 6,
                      left: 6,
                      width: 8,
                      height: 8,
                      borderRadius: 8,
                      background: color,
                    }} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 9.5,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: T.ink50,
                      fontWeight: 600,
                    }}>
                      {item.brand ?? item.category}
                    </div>
                    {item.productName && (
                      <div style={{ fontSize: 13, fontWeight: 500, color: T.ink, marginTop: 2 }}>
                        {item.productName}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 8, marginTop: 4, fontSize: 10.5, color: T.ink70, flexWrap: 'wrap' }}>
                      {item.size && <span>{item.size}</span>}
                      {item.size && item.fitNote && <span style={{ color: T.ink30 }}>·</span>}
                      {item.fitNote && <span style={{ color }}>{item.fitNote}</span>}
                    </div>
                  </div>

                  {item.priceJpy != null && (
                    <div style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: 13,
                      fontWeight: 500,
                      color: T.ink,
                      letterSpacing: '-0.02em',
                      flexShrink: 0,
                    }}>
                      ¥{item.priceJpy.toLocaleString('ja-JP')}
                    </div>
                  )}
                </div>
                {item.purchaseUrl && (
                  <a
                    href={item.purchaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: T.terracotta,
                      textDecoration: 'none',
                      marginTop: 6,
                      display: 'inline-block',
                      paddingLeft: 64,
                    }}
                  >
                    購入ページを見る →
                  </a>
                )}
              </div>
            );
          })}
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
        <div style={{ fontSize: 11, color: T.ink50 }}>{relativeTime(post.createdAt)}</div>
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
