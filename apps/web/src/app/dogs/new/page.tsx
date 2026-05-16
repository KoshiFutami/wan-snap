'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { getValidToken } from '../../../lib/auth-store';
import { BreedCombobox } from '../../../components/breed-combobox';
import { ImageCropEditor } from '../../../components/image-crop-editor';

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
};

const inputStyle: CSSProperties = {
  width: '100%',
  background: T.paper,
  borderRadius: 12,
  border: `1px solid ${T.hairline}`,
  padding: '0 14px',
  height: 46,
  fontSize: 14,
  color: T.ink,
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
};

export default function NewDogPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [coatColors, setCoatColors] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [showCropEditor, setShowCropEditor] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setRawImageSrc(ev.target?.result as string);
      setShowCropEditor(true);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCropComplete = (blob: Blob, previewUrl: string) => {
    setImageFile(new File([blob], 'photo.jpg', { type: 'image/jpeg' }));
    setImagePreview(previewUrl);
    setShowCropEditor(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = await getValidToken();
    if (!token) { router.push('/auth/sign-in'); return; }

    setError('');
    setLoading(true);
    try {
      const dog = await api.dogs.create(
        {
          name,
          breed,
          weightKg: weightKg ? parseFloat(weightKg) : undefined,
          coatColors: coatColors ? coatColors.split(',').map((s) => s.trim()).filter(Boolean) : [],
        },
        token,
      );
      if (imageFile) {
        await api.dogs.uploadPhoto(dog.id, imageFile, token);
      }
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : '登録に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    {showCropEditor && rawImageSrc && (
      <ImageCropEditor
        imageSrc={rawImageSrc}
        defaultAspect={1}
        onComplete={handleCropComplete}
        onCancel={() => {
          setShowCropEditor(false);
          setRawImageSrc(null);
        }}
      />
    )}
    <div style={{ padding: '8px 12px 120px' }}>
      {/* ステップインジケーター */}
      <div style={{ marginBottom: 24, paddingTop: 8 }}>
        <div
          style={{
            fontSize: 10,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: T.ink50,
            fontWeight: 500,
            marginBottom: 8,
          }}
        >
          step 2 / 3 · 愛犬情報
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <div style={{ flex: 1, height: 3, borderRadius: 3, background: T.ink }} />
          <div style={{ flex: 1, height: 3, borderRadius: 3, background: T.ink }} />
          <div style={{ flex: 1, height: 3, borderRadius: 3, background: T.ink10 }} />
        </div>
      </div>

      {/* プロフィール写真 */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          aria-hidden
        />
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label="プロフィール写真を選択"
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              background: T.ink10,
              backgroundImage: imagePreview ? `url(${imagePreview})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `3px solid ${T.paper}`,
              boxShadow: `0 0 0 1px ${T.hairline}, 0 6px 16px rgba(31,26,20,0.08)`,
              padding: 0,
              cursor: 'pointer',
            }}
          >
            {!imagePreview && (
              <svg width="36" height="36" viewBox="0 0 24 24" fill={T.ink50} opacity={0.5}>
                <ellipse cx="6" cy="9" rx="2" ry="2.6" />
                <ellipse cx="11" cy="6.4" rx="2" ry="2.6" />
                <ellipse cx="16.3" cy="7.6" rx="2" ry="2.6" />
                <ellipse cx="20" cy="11.5" rx="1.8" ry="2.3" />
                <path d="M12 11c-3.5 0-6.5 2.6-6.5 5.8 0 2 1.5 3.4 3.5 3.4 1.2 0 2.2-.6 3-.6s1.8.6 3 .6c2 0 3.5-1.4 3.5-3.4 0-3.2-3-5.8-6.5-5.8z" />
              </svg>
            )}
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label="プロフィール写真を選択"
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 34,
              height: 34,
              borderRadius: 17,
              background: T.terracotta,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `3px solid ${T.cream}`,
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 5h2l1-1.5h4L11 5h2v8H3V5z" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
              <circle cx="8" cy="9" r="2.2" stroke="#fff" strokeWidth="1.4" />
            </svg>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <FieldRow label="名前" required hint="3文字以内推奨">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="エマ"
            style={inputStyle}
          />
        </FieldRow>

        <FieldRow label="犬種" required>
          <BreedCombobox value={breed} onChange={setBreed} required />
        </FieldRow>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <FieldRow label="体重">
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="200"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="9.5"
                style={{ ...inputStyle, paddingRight: 36 }}
              />
              <span
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: 11,
                  color: T.ink50,
                  fontFamily: 'var(--font-mono, monospace)',
                  pointerEvents: 'none',
                }}
              >
                kg
              </span>
            </div>
          </FieldRow>

          <FieldRow label="毛色">
            <input
              type="text"
              value={coatColors}
              onChange={(e) => setCoatColors(e.target.value)}
              placeholder="赤, クリーム"
              style={inputStyle}
            />
          </FieldRow>
        </div>

        {/* サイズ推定カード — デモ */}
        {weightKg && (
          <div
            style={{
              marginTop: 4,
              padding: '14px',
              background: T.creamSoft,
              borderRadius: 14,
              border: `1px solid ${T.hairline}`,
            }}
          >
            <div
              style={{
                fontSize: 10,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: T.ink50,
                fontWeight: 500,
                marginBottom: 8,
              }}
            >
              サイズ推定
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <div
                style={{
                  fontFamily: 'var(--font-serif, serif)',
                  fontSize: 28,
                  fontWeight: 500,
                  color: T.terracotta,
                  letterSpacing: '-0.01em',
                  lineHeight: 1,
                }}
              >
                {parseFloat(weightKg) < 4 ? 'XS' : parseFloat(weightKg) < 7 ? 'S' : parseFloat(weightKg) < 12 ? 'M' : 'L'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: T.ink }}>体重から推定したサイズ目安</div>
                <div style={{ fontSize: 10, color: T.ink50, marginTop: 3, fontFamily: 'var(--font-mono, monospace)' }}>
                  {weightKg}kg
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 10,
              background: 'rgba(185,90,61,0.08)',
              border: `1px solid rgba(185,90,61,0.2)`,
              fontSize: 12.5,
              color: T.terracotta,
            }}
          >
            {error}
          </div>
        )}

        {/* 固定CTAフッター */}
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px 12px 32px',
            background: `linear-gradient(180deg, transparent, ${T.cream} 30%)`,
          }}
        >
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              maxWidth: 350,
              display: 'flex',
              margin: '0 auto',
              padding: '14px 22px',
              borderRadius: 999,
              background: T.ink,
              color: T.cream,
              fontSize: 13.5,
              fontWeight: 600,
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
              fontFamily: 'inherit',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              letterSpacing: '0.02em',
            }}
          >
            {loading ? '登録中...' : '登録して完了'}
            {!loading && (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
    </>
  );
}

function FieldRow({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ fontSize: 11.5, fontWeight: 500, color: T.ink, letterSpacing: '0.02em' }}>
          {label}
          {required && <span style={{ color: T.terracotta, marginLeft: 4 }}>*</span>}
        </div>
        {hint && <div style={{ fontSize: 10, color: T.ink50 }}>{hint}</div>}
      </div>
      {children}
    </div>
  );
}
