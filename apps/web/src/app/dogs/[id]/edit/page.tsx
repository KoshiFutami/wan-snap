'use client';

import type { CSSProperties } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getValidToken } from '../../../../lib/auth-store';
import { api, type Dog } from '../../../../lib/api';
import { BreedCombobox } from '../../../../components/breed-combobox';
import { ImageCropEditor } from '../../../../components/image-crop-editor';

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

const selectStyle: CSSProperties = {
  ...inputStyle,
  appearance: 'none',
  WebkitAppearance: 'none',
  cursor: 'pointer',
  paddingRight: 32,
};

function dogAge(
  birthYear: number | null,
  birthMonth: number | null,
  birthDay: number | null,
): string {
  if (!birthYear) return '';
  if (!birthMonth || !birthDay) {
    const diff = new Date().getFullYear() - birthYear;
    return `${diff}歳`;
  }

  const birthday = new Date(birthYear, birthMonth - 1, birthDay);
  if (
    Number.isNaN(birthday.getTime()) ||
    birthday.getFullYear() !== birthYear ||
    birthday.getMonth() !== birthMonth - 1 ||
    birthday.getDate() !== birthDay
  ) {
    return '';
  }

  const today = new Date();
  let years = today.getFullYear() - birthYear;
  let months = today.getMonth() + 1 - birthMonth;

  if (today.getDate() < birthDay) {
    months -= 1;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  if (years < 0) return '';
  if (years === 0) return `${Math.max(months, 0)}か月`;
  if (months <= 0) return `${years}歳`;
  return `${years}歳${months}か月`;
}

function formatCreatedAt(iso: string): string {
  return new Date(iso)
    .toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Tokyo' })
    .replace(/\//g, '.');
}

function genderLabel(g: string | null): string {
  if (g === 'female') return '♀';
  if (g === 'male') return '♂';
  return '';
}

export default function DogEditPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [dog, setDog] = useState<Dog | null>(null);
  const [name, setName] = useState('');
  const [breedName, setBreedName] = useState('');
  const [breedId, setBreedId] = useState('');
  const [gender, setGender] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [neckCm, setNeckCm] = useState('');
  const [chestCm, setChestCm] = useState('');
  const [backLengthCm, setBackLengthCm] = useState('');
  const [coatColors, setCoatColors] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [bio, setBio] = useState('');
  const [trimmingStyle, setTrimmingStyle] = useState('');
  const [salonUrl, setSalonUrl] = useState('');
  const [birthYearOptions] = useState(() => {
    const year = new Date().getFullYear();
    return Array.from({ length: year - 1999 }, (_, i) => year - i);
  });
  const [birthMonthOptions] = useState(() => Array.from({ length: 12 }, (_, i) => i + 1));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [showCropEditor, setShowCropEditor] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tokenRef = useRef<string | null>(null);

  useEffect(() => {
    getValidToken().then((token) => {
      if (!token) { router.replace('/auth/sign-in'); return; }
      tokenRef.current = token;
      api.dogs.get(id, token).then((d) => {
        setDog(d);
        setName(d.name);
        setBreedName(d.breed);
        setBreedId(d.breedId);
        setGender(d.gender ?? '');
        setWeightKg(d.weightKg != null ? String(d.weightKg) : '');
        setNeckCm(d.neckCm != null ? String(d.neckCm) : '');
        setChestCm(d.chestCm != null ? String(d.chestCm) : '');
        setBackLengthCm(d.backLengthCm != null ? String(d.backLengthCm) : '');
        setCoatColors(d.coatColors.join(', '));
        setBirthYear(d.birthYear != null ? String(d.birthYear) : '');
        setBirthMonth(d.birthMonth != null ? String(d.birthMonth) : '');
        setBirthDay(d.birthDay != null ? String(d.birthDay) : '');
        setBio(d.bio ?? '');
        setTrimmingStyle(d.trimmingStyle ?? '');
        setSalonUrl(d.salonUrl ?? '');
      }).catch(() => router.replace('/profile'));
    });
  }, [id, router]);

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

  const handleSave = async () => {
    if (!name.trim() || !breedId) return;
    setError(null);
    setSaving(true);
    try {
      const token = tokenRef.current ?? await getValidToken();
      if (!token) throw new Error('ログインが必要です');
      if (imageFile) {
        const uploaded = await api.dogs.uploadPhoto(id, imageFile, token);
        setDog((prev) => (prev ? { ...prev, photoUrl: uploaded.photoUrl } : prev));
        setImageFile(null);
        setImagePreview(null);
      }
      await api.dogs.update(id, {
        name: name.trim(),
        breedId,
        gender: gender || null,
        weightKg: weightKg ? parseFloat(weightKg) : undefined,
        neckCm: neckCm ? parseFloat(neckCm) : undefined,
        chestCm: chestCm ? parseFloat(chestCm) : undefined,
        backLengthCm: backLengthCm ? parseFloat(backLengthCm) : undefined,
        coatColors: coatColors ? coatColors.split(',').map((s) => s.trim()).filter(Boolean) : [],
        birthYear: birthYear ? parseInt(birthYear, 10) : undefined,
        birthMonth: birthMonth ? parseInt(birthMonth, 10) : undefined,
        birthDay: birthDay ? parseInt(birthDay, 10) : undefined,
        bio: bio.trim() || null,
        trimmingStyle: trimmingStyle.trim() || null,
        salonUrl: salonUrl.trim() || null,
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

  const birthDayOptions = useMemo(() => {
    const year = birthYear ? parseInt(birthYear, 10) : 2000;
    const month = birthMonth ? parseInt(birthMonth, 10) : 1;
    const dayCount = new Date(year, month, 0).getDate();
    return Array.from({ length: dayCount }, (_, i) => i + 1);
  }, [birthYear, birthMonth]);

  if (!dog) {
    return (
      <div style={{ padding: '64px 12px', textAlign: 'center', color: T.ink50, fontSize: 14 }}>
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

  const photoSrc = imagePreview ?? dog.photoUrl;

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
          disabled={saving || !name.trim() || !breedId}
          style={{
            padding: '7px 16px', borderRadius: 999,
            background: saving || !name.trim() || !breedId ? T.ink10 : T.ink,
            color: saving || !name.trim() || !breedId ? T.ink50 : T.cream,
            border: 'none', fontSize: 12, fontWeight: 600,
            cursor: saving || !name.trim() || !breedId ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit', flexShrink: 0, transition: 'background 0.15s',
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
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              aria-hidden
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label="プロフィール写真を変更"
              style={{
                width: 64, height: 64, borderRadius: 32,
                background: T.ink10,
                backgroundImage: photoSrc ? `url(${photoSrc})` : 'none',
                backgroundSize: 'cover', backgroundPosition: 'center',
                border: 'none', padding: 0, cursor: 'pointer',
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label="プロフィール写真を変更"
              style={{
                position: 'absolute', bottom: -4, right: -4,
                width: 24, height: 24, borderRadius: 12,
                background: T.ink, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `2px solid ${T.paper}`, cursor: 'pointer', padding: 0,
              }}
            >
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M2 4h2l1-1h2l1 1h2v6H2V4z" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: 'var(--font-serif, serif)', fontSize: 22,
              fontWeight: 500, color: T.ink, lineHeight: 1,
            }}>{dog.name}</div>
            <div style={{ fontSize: 11, color: T.ink50, marginTop: 5 }}>
              {breedName}
              {genderLabel(dog.gender) && ` · ${genderLabel(dog.gender)}`}
              {dog.birthYear ? ` · ${dogAge(dog.birthYear, dog.birthMonth, dog.birthDay)}` : ''}
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <FieldRow label="犬種" required>
              <BreedCombobox
                value={breedName}
                breedId={breedId}
                onChange={({ id: nextId, name: nextName }) => {
                  setBreedName(nextName);
                  setBreedId(nextId);
                }}
                required
              />
            </FieldRow>
            <FieldRow label="性別">
              <div style={{ position: 'relative' }}>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  style={selectStyle}
                >
                  <option value="">未設定</option>
                  <option value="female">女の子</option>
                  <option value="male">男の子</option>
                </select>
                <svg
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                  width="12" height="12" viewBox="0 0 12 12" fill="none"
                >
                  <path d="M2 4l4 4 4-4" stroke={T.ink50} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </FieldRow>
          </div>

          <FieldRow label="毛色">
            <input
              type="text"
              value={coatColors}
              onChange={(e) => setCoatColors(e.target.value)}
              placeholder="赤, クリーム"
              style={inputStyle}
            />
          </FieldRow>

          <FieldRow label="誕生日">
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 8 }}>
              <SelectWithChevron value={birthYear} onChange={setBirthYear}>
                <option value="">年</option>
                {birthYearOptions.map((y) => (
                  <option key={y} value={y}>{y}年</option>
                ))}
              </SelectWithChevron>
              <SelectWithChevron
                value={birthMonth}
                onChange={(value) => {
                  setBirthMonth(value);
                  setBirthDay((prev) => {
                    if (!prev || !value) return prev;
                    const year = birthYear ? parseInt(birthYear, 10) : 2000;
                    const dayCount = new Date(year, parseInt(value, 10), 0).getDate();
                    return parseInt(prev, 10) > dayCount ? '' : prev;
                  });
                }}
              >
                <option value="">月</option>
                {birthMonthOptions.map((m) => (
                  <option key={m} value={m}>{m}月</option>
                ))}
              </SelectWithChevron>
              <SelectWithChevron value={birthDay} onChange={setBirthDay}>
                <option value="">日</option>
                {birthDayOptions.map((d) => (
                  <option key={d} value={d}>{d}日</option>
                ))}
              </SelectWithChevron>
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

        {/* プロフィール */}
        <FormSection title="プロフィール">
          <FieldRow label="自己紹介">
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={500}
              placeholder="朝はいつも代々木公園を散歩。少しゆとりのある服が好み。"
              rows={3}
              style={{
                ...inputStyle,
                height: 'auto',
                padding: '12px 14px',
                resize: 'vertical',
                lineHeight: 1.6,
              }}
            />
          </FieldRow>
          <FieldRow label="トリミング・カット">
            <input
              type="text"
              value={trimmingStyle}
              onChange={(e) => setTrimmingStyle(e.target.value)}
              maxLength={120}
              placeholder="例: テディベアカット / 2週間ごとにトリミング"
              style={inputStyle}
            />
          </FieldRow>
          <FieldRow label="お店リンク">
            <input
              type="url"
              value={salonUrl}
              onChange={(e) => setSalonUrl(e.target.value)}
              maxLength={512}
              placeholder="https://..."
              style={inputStyle}
            />
          </FieldRow>
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
    </>
  );
}

function FormSection({ title, subtitle, children }: {
  title: string; subtitle?: string; children: React.ReactNode;
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
  label: string; required?: boolean; children: React.ReactNode;
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
  value: string; onChange: (v: string) => void; suffix: string; placeholder?: string; step?: string;
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
        fontSize: 11, color: T.ink50, fontFamily: 'var(--font-mono, monospace)', pointerEvents: 'none',
      }}>{suffix}</span>
    </div>
  );
}

function SelectWithChevron({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={selectStyle}
      >
        {children}
      </select>
      <svg
        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
        width="12" height="12" viewBox="0 0 12 12" fill="none"
      >
        <path d="M2 4l4 4 4-4" stroke={T.ink50} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
