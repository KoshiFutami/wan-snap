'use client';

import type { CSSProperties } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getValidToken } from '../../../../lib/auth-store';
import { api, type Dog } from '../../../../lib/api';
import { BreedCombobox } from '../../../../components/breed-combobox';

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
  hairlineStrong: 'rgba(31,26,20,0.18)',
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

function dogAge(birthYear: number | null): string {
  if (!birthYear) return '';
  const diff = new Date().getFullYear() - birthYear;
  return `${diff}歳`;
}

function formatCreatedAt(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default function DogEditPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [dog, setDog] = useState<Dog | null>(null);
  const [name, setName] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [neckCm, setNeckCm] = useState('');
  const [chestCm, setChestCm] = useState('');
  const [backLengthCm, setBackLengthCm] = useState('');
  const [coatColors, setCoatColors] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const tokenRef = useRef<string | null>(null);

  useEffect(() => {
    getValidToken().then((token) => {
      if (!token) { router.replace('/auth/sign-in'); return; }
      tokenRef.current = token;
      api.dogs.get(id, token).then((d) => {
        setDog(d);
        setName(d.name);
        setWeightKg(d.weightKg != null ? String(d.weightKg) : '');
        setNeckCm(d.neckCm != null ? String(d.neckCm) : '');
        setChestCm(d.chestCm != null ? String(d.chestCm) : '');
        setBackLengthCm(d.backLengthCm != null ? String(d.backLengthCm) : '');
        setCoatColors(d.coatColors.join(', '));
        setBirthYear(d.birthYear != null ? String(d.birthYear) : '');
      }).catch(() => router.replace('/profile'));
    });
  }, [id, router]);

  const handleSave = async () => {
    if (!name.trim()) return;
    setError(null);
    setSaving(true);
    try {
      const token = tokenRef.current ?? await getValidToken();
      if (!token) throw new Error('ログインが必要です');
      await api.dogs.update(id, {
        name: name.trim(),
        weightKg: weightKg ? parseFloat(weightKg) : undefined,
        neckCm: neckCm ? parseFloat(neckCm) : undefined,
        chestCm: chestCm ? parseFloat(chestCm) : undefined,
        backLengthCm: backLengthCm ? parseFloat(backLengthCm) : undefined,
        coatColors: coatColors ? coatColors.split(',').map((s) => s.trim()).filter(Boolean) : [],
        birthYear: birthYear ? parseInt(birthYear, 10) : undefined,
      }, token);
      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const token = tokenRef.current ?? await getValidToken();
      if (!token) throw new Error('ログインが必要です');
      await api.dogs.delete(id, token);
      router.replace('/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : '削除に失敗しました');
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (!dog) {
    return (
      <div style={{ padding: '64px 20px', textAlign: 'center', color: T.ink50, fontSize: 14 }}>
        読み込み中…
      </div>
    );
  }

  const sizeLabel = (() => {
    const w = parseFloat(weightKg);
    if (!w) return null;
    if (w < 4) return 'XS';
    if (w < 7) return 'S';
    if (w < 12) return 'M';
    return 'L';
  })();

  return (
    <div style={{ background: T.creamSoft, minHeight: '100dvh' }}>
      {/* AppBar */}
      <div style={{
        padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
        background: T.creamSoft,
        position: 'sticky', top: 0, zIndex: 10,
        borderBottom: `1px solid ${T.hairline}`,
      }}>
        <button
          onClick={() => router.back()}
          style={{
            width: 40, height: 40, borderRadius: 20,
            background: T.paper, border: `1px solid ${T.hairline}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
          }}
          aria-label="戻る"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M14 5l-7 7 7 7" stroke={T.ink} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 14, fontWeight: 600, color: T.ink }}>
          {dog.name}のプロフィール
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !name.trim()}
          style={{
            padding: '7px 16px', borderRadius: 999,
            background: saving || !name.trim() ? T.ink10 : T.ink,
            color: saving || !name.trim() ? T.ink50 : T.cream,
            border: 'none', fontSize: 12, fontWeight: 600,
            cursor: saving || !name.trim() ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit', flexShrink: 0,
            transition: 'background 0.15s',
          }}
        >
          {saving ? '保存中…' : '保存'}
        </button>
      </div>

      <div style={{ padding: '0 20px 40px' }}>
        {/* Avatar + info banner */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '16px', borderRadius: 16,
          background: T.paper, border: `1px solid ${T.hairline}`,
          marginTop: 20, marginBottom: 24,
        }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 32,
              background: T.ink10,
              backgroundImage: dog.photoUrl ? `url(${dog.photoUrl})` : 'none',
              backgroundSize: 'cover', backgroundPosition: 'center',
            }} />
            <div style={{
              position: 'absolute', bottom: -4, right: -4,
              width: 24, height: 24, borderRadius: 12,
              background: T.ink, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `2px solid ${T.paper}`, cursor: 'pointer',
            }}>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M2 4h2l1-1h2l1 1h2v6H2V4z" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: 'var(--font-serif, serif)', fontSize: 22,
              fontWeight: 500, color: T.ink, lineHeight: 1,
            }}>{dog.name}</div>
            <div style={{ fontSize: 11, color: T.ink50, marginTop: 5 }}>
              {dog.breed}{dog.birthYear ? ` · ${dogAge(dog.birthYear)}` : ''}
            </div>
            <div style={{
              fontSize: 10, color: T.ink50, marginTop: 4,
              fontFamily: 'var(--font-mono, monospace)',
            }}>
              登録: {formatCreatedAt(dog.createdAt)}
            </div>
          </div>
        </div>

        {/* 基本情報 */}
        <FormSection title="基本情報">
          <FieldRow label="名前" required>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              placeholder="エマ"
              style={inputStyle}
            />
          </FieldRow>

          <FieldRow label="犬種">
            <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', height: 46, cursor: 'default' }}>
              <span style={{ color: T.ink50, fontSize: 14 }}>{dog.breed}</span>
              <span style={{ marginLeft: 'auto', fontSize: 10, color: T.ink50 }}>変更不可</span>
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

          <FieldRow label="誕生年">
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                min={2000}
                max={new Date().getFullYear()}
                placeholder="2023"
                style={{ ...inputStyle, paddingRight: 36 }}
              />
              <span style={{
                position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                fontSize: 11, color: T.ink50,
                fontFamily: 'var(--font-mono, monospace)',
                pointerEvents: 'none',
              }}>年</span>
            </div>
          </FieldRow>
        </FormSection>

        {/* サイズ */}
        <FormSection title="サイズ" subtitle="服選びに使用">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <FieldRow label="体重">
              <SuffixInput value={weightKg} onChange={setWeightKg} suffix="kg" placeholder="9.5" step="0.1" />
            </FieldRow>
            <FieldRow label="胴囲">
              <SuffixInput value={chestCm} onChange={setChestCm} suffix="cm" placeholder="48" />
            </FieldRow>
            <FieldRow label="着丈">
              <SuffixInput value={backLengthCm} onChange={setBackLengthCm} suffix="cm" placeholder="35" />
            </FieldRow>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <FieldRow label="首囲">
              <SuffixInput value={neckCm} onChange={setNeckCm} suffix="cm" placeholder="32" />
            </FieldRow>
            <FieldRow label="サイズ目安">
              <div style={{
                ...inputStyle, display: 'flex', alignItems: 'center', height: 46,
                color: sizeLabel ? T.terracotta : T.ink50,
                fontFamily: 'var(--font-serif, serif)',
                fontSize: sizeLabel ? 20 : 14, fontWeight: 500,
              }}>
                {sizeLabel ?? '—'}
              </div>
            </FieldRow>
          </div>
        </FormSection>

        {error && (
          <div style={{
            padding: '12px 14px', borderRadius: 10,
            background: 'rgba(185,90,61,0.08)',
            border: `1px solid rgba(185,90,61,0.2)`,
            color: T.terracotta, fontSize: 13, marginBottom: 16,
          }}>
            {error}
          </div>
        )}

        {/* 削除 */}
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            style={{
              width: '100%', padding: '14px', borderRadius: 12,
              background: 'transparent', color: T.terracotta,
              border: `1px solid ${T.terracotta}`,
              fontSize: 12.5, fontWeight: 500, fontFamily: 'inherit',
              cursor: 'pointer', marginTop: 8,
            }}
          >
            {dog.name}のプロフィールを削除
          </button>
        ) : (
          <div style={{
            padding: '16px', borderRadius: 12,
            background: 'rgba(185,90,61,0.06)',
            border: `1px solid rgba(185,90,61,0.2)`,
            marginTop: 8,
          }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: T.ink, marginBottom: 4 }}>
              {dog.name}のプロフィールを削除しますか？
            </div>
            <div style={{ fontSize: 11.5, color: T.ink50, marginBottom: 16 }}>
              投稿に紐付いたデータも失われます。この操作は元に戻せません。
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  flex: 1, padding: '10px', borderRadius: 10,
                  background: T.paper, color: T.ink,
                  border: `1px solid ${T.hairlineStrong}`,
                  fontSize: 12.5, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer',
                }}
              >
                キャンセル
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  flex: 1, padding: '10px', borderRadius: 10,
                  background: T.terracotta, color: '#fff',
                  border: 'none',
                  fontSize: 12.5, fontWeight: 600, fontFamily: 'inherit',
                  cursor: deleting ? 'not-allowed' : 'pointer',
                  opacity: deleting ? 0.6 : 1,
                }}
              >
                {deleting ? '削除中…' : '削除する'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FormSection({ title, subtitle, children }: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
        <div style={{
          fontFamily: 'var(--font-serif, serif)', fontSize: 16, fontWeight: 500,
          color: T.ink, lineHeight: 1,
        }}>{title}</div>
        {subtitle && <div style={{ fontSize: 10.5, color: T.ink50 }}>{subtitle}</div>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {children}
      </div>
    </div>
  );
}

function FieldRow({ label, required, children }: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div style={{ fontSize: 11.5, fontWeight: 500, color: T.ink, letterSpacing: '0.02em', marginBottom: 6 }}>
        {label}
        {required && <span style={{ color: T.terracotta, marginLeft: 4 }}>*</span>}
      </div>
      {children}
    </div>
  );
}

function SuffixInput({ value, onChange, suffix, placeholder, step }: {
  value: string;
  onChange: (v: string) => void;
  suffix: string;
  placeholder?: string;
  step?: string;
}) {
  return (
    <div style={{ position: 'relative' }}>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        step={step ?? '1'}
        min="0"
        style={{ ...inputStyle, paddingRight: suffix.length > 2 ? 42 : 36 }}
      />
      <span style={{
        position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
        fontSize: 11, color: T.ink50,
        fontFamily: 'var(--font-mono, monospace)',
        pointerEvents: 'none',
      }}>{suffix}</span>
    </div>
  );
}
