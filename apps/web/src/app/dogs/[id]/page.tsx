import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { api } from '../../../lib/api';

type Props = {
  params: Promise<{ id: string }>;
};

const T = {
  ink: '#1F1A14',
  ink50: '#7E7567',
  ink10: '#E8E0D0',
  paper: '#FFFEFB',
  cream: '#F4EDE0',
  creamSoft: '#FAF5EA',
  hairline: 'rgba(31,26,20,0.08)',
};

async function getDogPosts(dogId: string) {
  const MAX_POSTS = 120;
  const MAX_ITERATIONS = 6;
  const posts: Awaited<ReturnType<typeof api.posts.list>>['posts'] = [];
  let cursor: string | undefined;
  let iterations = 0;

  while (iterations < MAX_ITERATIONS) {
    const response = await api.posts.list({ limit: 30, cursor, dogId });
    posts.push(...response.posts);
    if (!response.nextCursor || posts.length >= MAX_POSTS) break;
    cursor = response.nextCursor;
    iterations += 1;
  }

  return posts.slice(0, MAX_POSTS);
}

export default async function DogDetailPage({ params }: Props) {
  const { id } = await params;
  const dog = await api.dogs.getPublic(id).catch(() => null);
  if (!dog) notFound();
  const posts = await getDogPosts(id);
  const dogName = dog.name;
  const dogPhotoUrl = dog.photoUrl;
  const breed = dog.breed;
  const weightKg = dog.weightKg;
  const authorName = dog.ownerDisplayName;

  return (
    <div style={{ background: T.creamSoft, minHeight: '100dvh', paddingBottom: 28 }}>
      <div style={{ padding: '12px 12px 8px' }}>
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
          }}
          aria-label="戻る"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M14 5l-7 7 7 7" stroke={T.ink} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      <div style={{ padding: '0 12px' }}>
        <div
          style={{
            borderRadius: 18,
            border: `1px solid ${T.hairline}`,
            background: T.paper,
            padding: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              background: T.ink10,
              overflow: 'hidden',
              position: 'relative',
              flexShrink: 0,
            }}
          >
            {dogPhotoUrl ? (
              <Image src={dogPhotoUrl} alt={`${dogName}の写真`} fill sizes="64px" style={{ objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: T.ink50, fontSize: 11 }}>
                no image
              </div>
            )}
          </div>

          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-serif, serif)', fontSize: 28, lineHeight: 1, color: T.ink }}>{dogName}</div>
            <div style={{ marginTop: 8, fontSize: 11, color: T.ink50 }}>
              {authorName ? `${authorName} の愛犬` : '愛犬プロフィール'}
            </div>
            <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              {breed && (
                <span style={{ padding: '2px 7px', borderRadius: 4, background: T.cream, fontSize: 10, color: T.ink }}>
                  {breed}
                </span>
              )}
              {weightKg != null && (
                <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 10.5, color: T.ink }}>
                  {weightKg}kg
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 22 }}>
          <div style={{ fontFamily: 'var(--font-serif, serif)', fontSize: 18, color: T.ink, marginBottom: 10 }}>
            これまでのスナップ
          </div>
          {posts.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 4 }}>
              {posts.map((post) => (
                <Link key={post.id} href={`/posts/${post.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: 6, overflow: 'hidden', background: T.ink10 }}>
                    <Image src={post.imageUrl} alt={post.caption ?? `${dogName}の投稿`} fill sizes="33vw" style={{ objectFit: 'cover' }} />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div
              style={{
                borderRadius: 12,
                border: `1px solid ${T.hairline}`,
                background: T.paper,
                color: T.ink50,
                fontSize: 12.5,
                padding: '16px 14px',
              }}
            >
              まだ投稿がありません
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
