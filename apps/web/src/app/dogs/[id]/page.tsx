'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getValidToken } from '../../../lib/auth-store';
import { api, type Dog } from '../../../lib/api';

const T = {
  ink: '#1F1A14',
  ink50: '#7E7567',
  ink10: '#E8E0D0',
  paper: '#FFFEFB',
  creamSoft: '#FAF5EA',
  terracotta: '#B95A3D',
  hairline: 'rgba(31,26,20,0.08)',
  hairlineStrong: 'rgba(31,26,20,0.18)',
};

function dogAge(birthYear: number | null): string | null {
  if (!birthYear) return null;
  return `${new Date().getFullYear() - birthYear}歳`;
}

export default function DogDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [dog, setDog] = useState<Dog | null>(null);

  useEffect(() => {
    getValidToken().then((token) => {
      if (!token) {
        router.replace('/auth/sign-in');
        return;
      }
      api.dogs.get(id, token).then(setDog).catch(() => router.replace('/profile'));
    });
  }, [id, router]);

  if (!dog) {
    return (
      <div style={{ padding: '64px 12px', textAlign: 'center', color: T.ink50, fontSize: 14 }}>
        読み込み中…
      </div>
    );
  }

  const age = dogAge(dog.birthYear);

  return (
    <div style={{ minHeight: '100dvh', background: T.creamSoft, paddingBottom: 28 }}>
      <div style={{
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `1px solid ${T.hairline}`,
      }}>
        <button
          onClick={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            background: T.paper,
            border: `1px solid ${T.hairline}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          aria-label="戻る"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M14 5l-7 7 7 7" stroke={T.ink} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div style={{ fontSize: 14, fontWeight: 600, color: T.ink }}>{dog.name}の詳細</div>
        <Link
          href={`/dogs/${dog.id}/edit`}
          style={{
            padding: '7px 14px',
            borderRadius: 999,
            background: T.ink,
            color: T.paper,
            fontSize: 12,
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          編集
        </Link>
      </div>

      <div style={{ padding: '20px 12px 0' }}>
        <div style={{
          background: T.paper,
          borderRadius: 16,
          border: `1px solid ${T.hairline}`,
          padding: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              background: T.ink10,
              backgroundImage: dog.photoUrl ? `url(${dog.photoUrl})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              flexShrink: 0,
            }}
          />
          <div>
            <div style={{ fontFamily: 'var(--font-serif, serif)', fontSize: 24, color: T.ink, fontWeight: 500 }}>
              {dog.name}
            </div>
            <div style={{ marginTop: 4, fontSize: 12, color: T.ink50 }}>
              {dog.breed}{age ? ` · ${age}` : ''}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
          <Metric label="体重" value={dog.weightKg != null ? `${dog.weightKg}kg` : '—'} />
          <Metric label="首囲" value={dog.neckCm != null ? `${dog.neckCm}cm` : '—'} />
          <Metric label="胴囲" value={dog.chestCm != null ? `${dog.chestCm}cm` : '—'} />
          <Metric label="着丈" value={dog.backLengthCm != null ? `${dog.backLengthCm}cm` : '—'} />
        </div>

        <div style={{
          marginTop: 10,
          background: T.paper,
          border: `1px solid ${T.hairline}`,
          borderRadius: 12,
          padding: '12px 14px',
        }}>
          <div style={{ fontSize: 11, color: T.ink50, marginBottom: 6 }}>毛色</div>
          <div style={{ fontSize: 13, color: T.ink }}>
            {dog.coatColors.length > 0 ? dog.coatColors.join(' / ') : '未設定'}
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      background: T.paper,
      border: `1px solid ${T.hairlineStrong}`,
      borderRadius: 12,
      padding: '10px 12px',
    }}>
      <div style={{ fontSize: 11, color: T.ink50 }}>{label}</div>
      <div style={{ marginTop: 4, fontSize: 15, color: T.ink, fontWeight: 600 }}>{value}</div>
    </div>
  );
}
