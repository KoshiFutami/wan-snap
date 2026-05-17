import Image from 'next/image';
import Link from 'next/link';
import { api } from '../../../lib/api';

type Props = {
  params: Promise<{ tag: string }>;
};

const T = {
  ink: '#1F1A14',
  ink70: '#4A4239',
  ink50: '#7E7567',
  ink10: '#E8E0D0',
  paper: '#FFFEFB',
  hairline: 'rgba(31,26,20,0.08)',
};

export default async function TagFeedPage({ params }: Props) {
  const { tag: rawTag } = await params;
  const tag = decodeTagParam(rawTag);
  const response = await api.posts.list({ tag, limit: 40 }).catch(() => ({ posts: [], nextCursor: null }));

  return (
    <div style={{ padding: '16px 12px 28px' }}>
      <div
        style={{
          padding: '18px 16px',
          borderRadius: 24,
          background: 'linear-gradient(135deg, rgba(255,254,251,0.94), rgba(232,224,208,0.92))',
          border: `1px solid ${T.hairline}`,
        }}
      >
        <Link
          href="/search"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: T.ink50,
            textDecoration: 'none',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M14 5l-7 7 7 7" stroke={T.ink50} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          タグ検索へ戻る
        </Link>
        <div style={{ marginTop: 14, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.ink50, fontWeight: 600 }}>
          Tag Feed
        </div>
        <h1 style={{ marginTop: 10, fontSize: 30, lineHeight: 1.1, color: T.ink, fontFamily: 'var(--font-serif, serif)', fontWeight: 600 }}>
          #{tag}
        </h1>
        <p style={{ marginTop: 10, fontSize: 13, color: T.ink70, lineHeight: 1.6 }}>
          このタグが付いたスナップをまとめて見られます。
        </p>
        <div style={{ marginTop: 14, fontSize: 12, color: T.ink50 }}>
          {response.posts.length}件のスナップ
        </div>
      </div>

      {response.posts.length === 0 ? (
        <div
          style={{
            marginTop: 18,
            padding: '44px 18px',
            borderRadius: 24,
            background: 'rgba(255,254,251,0.68)',
            border: `1px solid ${T.hairline}`,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 600, color: T.ink }}>
            まだこのタグの投稿がありません
          </div>
          <p style={{ marginTop: 8, fontSize: 12, color: T.ink50, lineHeight: 1.6 }}>
            最初の1枚を投稿して、同じ好みのオーナーに見つけてもらいましょう。
          </p>
        </div>
      ) : (
        <div
          style={{
            marginTop: 18,
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 10,
          }}
        >
          {response.posts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              style={{
                textDecoration: 'none',
                color: T.ink,
              }}
            >
              <article
                style={{
                  background: T.paper,
                  borderRadius: 18,
                  overflow: 'hidden',
                  border: `1px solid ${T.hairline}`,
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: post.imageWidth && post.imageHeight ? `${post.imageWidth}/${post.imageHeight}` : '4 / 5',
                    background: T.ink10,
                  }}
                >
                  <Image
                    src={post.imageUrl}
                    alt={post.caption ?? `#${tag} のスナップ`}
                    fill
                    sizes="(max-width: 390px) 50vw, 190px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '10px 11px 12px' }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: T.ink }}>
                    {post.dog?.name ?? 'わんこ'}
                  </div>
                  <div style={{ marginTop: 4, fontSize: 11.5, color: T.ink50, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {post.dog?.breed ?? '犬種未設定'}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function decodeTagParam(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
