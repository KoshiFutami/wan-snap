'use client';

import Link from 'next/link';
import { startTransition, useDeferredValue, useEffect, useState } from 'react';
import { api, type TagSummary } from '../../lib/api';

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

function TagLink({ tag, postCount, emphasized = false }: TagSummary & { emphasized?: boolean }) {
  return (
    <Link
      href={`/tags/${encodeURIComponent(tag)}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: '14px 16px',
        borderRadius: 18,
        border: `1px solid ${T.hairline}`,
        background: emphasized ? T.paper : 'rgba(255,254,251,0.6)',
        textDecoration: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <span
          style={{
            width: 34,
            height: 34,
            borderRadius: 17,
            background: emphasized ? T.cream : T.paper,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: T.terracotta,
            fontSize: 16,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          #
        </span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {tag}
          </div>
          <div style={{ marginTop: 3, fontSize: 11.5, color: T.ink50 }}>
            {postCount}件のスナップ
          </div>
        </div>
      </div>

      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
        <path d="M9 5l7 7-7 7" stroke={T.ink30} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [popularTags, setPopularTags] = useState<TagSummary[]>([]);
  const [results, setResults] = useState<TagSummary[]>([]);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [searching, setSearching] = useState(false);
  const deferredQuery = useDeferredValue(query.trim());

  useEffect(() => {
    let cancelled = false;

    void api.tags.popular(12)
      .then((tags) => {
        if (!cancelled) {
          setPopularTags(tags);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingPopular(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!deferredQuery) {
      setResults([]);
      setSearching(false);
      return;
    }

    let cancelled = false;
    setSearching(true);

    const timeoutId = window.setTimeout(() => {
      void api.tags.search(deferredQuery)
        .then((tags) => {
          if (!cancelled) {
            startTransition(() => {
              setResults(tags);
            });
          }
        })
        .finally(() => {
          if (!cancelled) {
            setSearching(false);
          }
        });
    }, 180);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [deferredQuery]);

  const showingSearch = deferredQuery.length > 0;

  return (
    <div style={{ padding: '18px 12px 32px' }}>
      <div
        style={{
          padding: '18px 16px',
          borderRadius: 24,
          background: 'linear-gradient(135deg, rgba(255,254,251,0.92), rgba(244,237,224,0.96))',
          border: `1px solid ${T.hairline}`,
          boxShadow: '0 18px 40px rgba(31,26,20,0.06)',
        }}
      >
        <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.ink50, fontWeight: 600 }}>
          Tag Search
        </div>
        <h1 style={{ marginTop: 10, fontSize: 26, lineHeight: 1.2, color: T.ink, fontFamily: 'var(--font-serif, serif)', fontWeight: 600 }}>
          犬種も、カットも、
          <br />
          タグから探す
        </h1>
        <p style={{ marginTop: 10, fontSize: 13, color: T.ink70, lineHeight: 1.6 }}>
          気になるタグを入力すると、同じ雰囲気のスナップにすぐ辿れます。
        </p>

        <label
          htmlFor="tag-search-input"
          style={{
            marginTop: 18,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '0 14px',
            height: 52,
            borderRadius: 16,
            background: T.paper,
            border: `1px solid ${T.hairline}`,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="6" stroke={T.ink50} strokeWidth="1.6" />
            <path d="M13.5 13.5L17 17" stroke={T.ink50} strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            id="tag-search-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="例: トイプードル / テディベアカット"
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              outline: 'none',
              color: T.ink,
              fontSize: 14,
              fontFamily: 'inherit',
            }}
          />
        </label>
      </div>

      <section style={{ marginTop: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>
            {showingSearch ? '検索結果' : '人気タグ'}
          </h2>
          {showingSearch && searching && (
            <span style={{ fontSize: 11.5, color: T.ink50 }}>検索中…</span>
          )}
        </div>

        {showingSearch ? (
          results.length > 0 ? (
            <div style={{ display: 'grid', gap: 10 }}>
              {results.map((tag) => (
                <TagLink key={tag.tag} {...tag} emphasized />
              ))}
            </div>
          ) : searching ? (
            <div style={{ padding: '32px 0', textAlign: 'center', fontSize: 13, color: T.ink50 }}>
              タグを探しています…
            </div>
          ) : (
            <div
              style={{
                padding: '32px 18px',
                borderRadius: 20,
                background: 'rgba(255,254,251,0.6)',
                border: `1px solid ${T.hairline}`,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600, color: T.ink }}>
                一致するタグが見つかりません
              </div>
              <p style={{ marginTop: 8, fontSize: 12, color: T.ink50, lineHeight: 1.6 }}>
                別の犬種名やグルーミング名でも試してみてください。
              </p>
            </div>
          )
        ) : loadingPopular ? (
          <div style={{ padding: '32px 0', textAlign: 'center', fontSize: 13, color: T.ink50 }}>
            人気タグを集めています…
          </div>
        ) : popularTags.length > 0 ? (
          <>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {popularTags.map((tag, index) => (
                <Link
                  key={tag.tag}
                  href={`/tags/${encodeURIComponent(tag.tag)}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 14px',
                    borderRadius: 999,
                    background: index < 3 ? T.paper : 'rgba(255,254,251,0.68)',
                    border: `1px solid ${T.hairline}`,
                    color: T.ink,
                    textDecoration: 'none',
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600 }}>#{tag.tag}</span>
                  <span style={{ fontSize: 11.5, color: T.ink50 }}>{tag.postCount}</span>
                </Link>
              ))}
            </div>
            <div style={{ marginTop: 18, display: 'grid', gap: 10 }}>
              {popularTags.slice(0, 4).map((tag) => (
                <TagLink key={tag.tag} {...tag} />
              ))}
            </div>
          </>
        ) : (
          <div style={{ padding: '32px 0', textAlign: 'center', fontSize: 13, color: T.ink50 }}>
            まだタグ付きのスナップがありません。
          </div>
        )}
      </section>
    </div>
  );
}
