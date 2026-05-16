import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { api } from '../../../lib/api';

type Props = {
  params: Promise<{ id: string }>;
};

const T = {
  ink: '#1F1A14',
  ink70: '#4D453A',
  ink50: '#7E7567',
  ink10: '#E8E0D0',
  paper: '#FFFEFB',
  cream: '#F4EDE0',
  creamSoft: '#FAF5EA',
  forest: '#6A7D4D',
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

const DOG_CODE_LENGTH = 3;

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
  const compactDogId = dog.id.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const dogCode = `#${(compactDogId || 'DOG').slice(0, DOG_CODE_LENGTH).padEnd(DOG_CODE_LENGTH, 'X')}`;

  return (
    <div style={{ background: T.cream, minHeight: '100dvh', paddingBottom: 28, position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          top: 54,
          left: 0,
          right: 0,
          zIndex: 10,
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
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
        <button
          type="button"
          aria-label="メニュー"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 38,
            height: 38,
            borderRadius: 19,
            background: T.paper,
            border: `1px solid ${T.hairline}`,
            color: T.ink,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <circle cx="4" cy="10" r="1.4" fill="currentColor" />
            <circle cx="10" cy="10" r="1.4" fill="currentColor" />
            <circle cx="16" cy="10" r="1.4" fill="currentColor" />
          </svg>
        </button>
      </div>

      <div style={{ paddingTop: 102 }}>
        <div style={{ position: 'relative', width: '100%', height: 340, padding: '0 20px' }}>
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 24,
              background: T.ink10,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {dogPhotoUrl ? (
              <Image src={dogPhotoUrl} alt={`${dogName}の写真`} fill sizes="(max-width: 768px) 100vw, 390px" style={{ objectFit: 'cover' }} priority />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: T.ink50, fontSize: 12 }}>no image</div>
            )}
            <div
              style={{
                position: 'absolute',
                top: 14,
                left: 14,
                padding: '6px 10px',
                borderRadius: 999,
                background: 'rgba(255,254,251,0.92)',
                fontSize: 10.5,
                fontWeight: 500,
                color: T.ink,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span style={{ width: 5, height: 5, borderRadius: 5, background: T.forest }} />
              アクティブ
            </div>
          </div>
        </div>

        <div style={{ padding: '20px 20px 0' }}>
          <div
            style={{
              fontSize: 10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: T.ink50,
              fontWeight: 500,
              marginBottom: 6,
            }}
          >
            {authorName}の愛犬 · {dogCode}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <div style={{ fontFamily: 'var(--font-serif, serif)', fontSize: 42, fontWeight: 500, color: T.ink, letterSpacing: '-0.02em', lineHeight: 0.95 }}>
              {dogName}
            </div>
          </div>
          <div style={{ fontSize: 12.5, color: T.ink70, marginTop: 8, lineHeight: 1.55 }}>
            {breed}
            {weightKg != null ? ` · ${weightKg}kg` : ''}
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 20px 0' }}>
        <div
          style={{
            borderRadius: 18,
            border: `1px solid ${T.hairline}`,
            background: T.paper,
            padding: '16px 4px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
          }}
        >
          <div style={{ textAlign: 'center', padding: '4px 8px' }}>
            <div style={{ fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.ink50, fontWeight: 500, marginBottom: 4 }}>犬種</div>
            <div style={{ fontFamily: 'var(--font-serif, serif)', fontSize: 20, fontWeight: 500, color: T.ink, lineHeight: 1 }}>{breed}</div>
          </div>
          <div style={{ textAlign: 'center', padding: '4px 8px', borderLeft: `1px solid ${T.hairline}` }}>
            <div style={{ fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.ink50, fontWeight: 500, marginBottom: 4 }}>体重</div>
            <div style={{ fontFamily: 'var(--font-serif, serif)', fontSize: 20, fontWeight: 500, color: T.ink, lineHeight: 1 }}>
              {weightKg != null ? weightKg : '-'}
            </div>
            <div style={{ fontSize: 10, color: T.ink50, fontFamily: 'var(--font-mono, monospace)' }}>kg</div>
          </div>
          <div style={{ textAlign: 'center', padding: '4px 8px', borderLeft: `1px solid ${T.hairline}` }}>
            <div style={{ fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.ink50, fontWeight: 500, marginBottom: 4 }}>投稿</div>
            <div style={{ fontFamily: 'var(--font-serif, serif)', fontSize: 20, fontWeight: 500, color: T.ink, lineHeight: 1 }}>{posts.length}</div>
            <div style={{ fontSize: 10, color: T.ink50, fontFamily: 'var(--font-mono, monospace)' }}>snaps</div>
          </div>
        </div>

        <div style={{ marginTop: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-serif, serif)', fontSize: 20, color: T.ink, lineHeight: 1 }}>
                これまでのスナップ
              </div>
              <div style={{ fontSize: 11, color: T.ink50, marginTop: 4 }}>
                <span style={{ fontFamily: 'var(--font-mono, monospace)' }}>{posts.length}</span>枚
              </div>
            </div>
            <div style={{ padding: 6, borderRadius: 8, background: T.ink, color: T.cream }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="5" width="5" height="5" rx="1" fill="currentColor" />
                <rect x="14" y="5" width="5" height="5" rx="1" fill="currentColor" />
                <rect x="5" y="14" width="5" height="5" rx="1" fill="currentColor" />
                <rect x="14" y="14" width="5" height="5" rx="1" fill="currentColor" />
              </svg>
            </div>
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
