import { api } from '../lib/api';
import { PostCard } from '../components/post-card';

export const revalidate = 30;

const T = {
  ink: '#1F1A14',
  ink50: '#7E7567',
  ink10: '#E8E0D0',
  cream: '#F4EDE0',
  terracotta: '#B95A3D',
  hairlineStrong: 'rgba(31,26,20,0.14)',
};

const FILTERS = ['すべて', 'フォロー中', '似たサイズ', '近所', '新着'];

export default async function HomePage() {
  const { posts } = await api.posts.list({ limit: 20 }).catch(() => ({ posts: [], nextCursor: null }));

  if (posts.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '96px 24px',
          textAlign: 'center',
        }}
      >
        <svg width="48" height="48" viewBox="0 0 24 24" fill={T.ink10}>
          <ellipse cx="6" cy="9" rx="2" ry="2.6" />
          <ellipse cx="11" cy="6.4" rx="2" ry="2.6" />
          <ellipse cx="16.3" cy="7.6" rx="2" ry="2.6" />
          <ellipse cx="20" cy="11.5" rx="1.8" ry="2.3" />
          <path d="M12 11c-3.5 0-6.5 2.6-6.5 5.8 0 2 1.5 3.4 3.5 3.4 1.2 0 2.2-.6 3-.6s1.8.6 3 .6c2 0 3.5-1.4 3.5-3.4 0-3.2-3-5.8-6.5-5.8z" />
        </svg>
        <p style={{ marginTop: 16, fontSize: 15, fontWeight: 600, color: T.ink50 }}>まだスナップがありません</p>
        <p style={{ marginTop: 4, fontSize: 12, color: T.ink50, opacity: 0.7 }}>最初のスナップを投稿してみましょう</p>
      </div>
    );
  }

  return (
    <div>
      {/* フィルターレール */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          padding: '14px 20px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {FILTERS.map((label, i) => (
          <button
            key={label}
            style={{
              padding: '7px 13px',
              borderRadius: 999,
              border: `1px solid ${i === 0 ? T.ink : T.hairlineStrong}`,
              background: i === 0 ? T.ink : 'transparent',
              color: i === 0 ? '#FAF5EA' : T.ink,
              fontSize: 12.5,
              fontWeight: 500,
              lineHeight: 1.2,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: 'inherit',
            }}
          >
            {i === 2 && (
              <span style={{ width: 6, height: 6, borderRadius: 6, background: T.terracotta, flexShrink: 0 }} />
            )}
            {label}
          </button>
        ))}
      </div>

      {/* フィード */}
      <div style={{ padding: '0 20px 24px' }}>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
