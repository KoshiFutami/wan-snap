'use client';

import { useState } from 'react';

const T = {
  ink: '#1F1A14',
  ink70: '#4A4239',
  ink50: '#7E7567',
  ink30: '#B8AE9E',
  ink10: '#E8E0D0',
  paper: '#FFFEFB',
  cream: '#F4EDE0',
  terracotta: '#B95A3D',
  forest: '#3D7A4B',
  hairline: 'rgba(31,26,20,0.08)',
  hairlineStrong: 'rgba(31,26,20,0.14)',
};

const CATEGORIES = [
  { value: 'tops', label: 'トップス' },
  { value: 'bottoms', label: 'ボトムス' },
  { value: 'dress', label: 'ワンピース' },
  { value: 'outerwear', label: 'アウター' },
  { value: 'collar', label: '首輪' },
  { value: 'harness', label: 'ハーネス' },
  { value: 'leash', label: 'リード' },
  { value: 'bandana', label: 'バンダナ' },
  { value: 'hat', label: '帽子' },
  { value: 'shoes', label: 'シューズ' },
  { value: 'other', label: 'その他' },
] as const;

type CategoryValue = typeof CATEGORIES[number]['value'];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'フリー', 'カスタム'];

export function generateItemKey(): string {
  return Math.random().toString(36).slice(2);
}

export type EditableItem = {
  _key: string;
  category: CategoryValue;
  brand: string | null;
  productName: string | null;
  size: string | null;
  purchaseUrl: string | null;
  priceJpy: number | null;
  fitNote: string | null;
};

export function newEditableItem(): EditableItem {
  return {
    _key: generateItemKey(),
    category: 'other',
    brand: null,
    productName: null,
    size: null,
    purchaseUrl: null,
    priceJpy: null,
    fitNote: null,
  };
}

function categoryLabel(value: string): string {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

export function validateItems(items: EditableItem[]): string | null {
  for (const item of items) {
    if (item.purchaseUrl) {
      try {
        new URL(item.purchaseUrl);
      } catch {
        const name = item.productName ?? item.brand ?? categoryLabel(item.category);
        return `「${name}」の購入URLの形式が正しくありません`;
      }
    }
  }
  return null;
}

type ItemEditorRowProps = {
  item: EditableItem;
  index: number;
  initiallyOpen?: boolean;
  onUpdate: (key: string, patch: Partial<EditableItem>) => void;
  onRemove: (key: string) => void;
};

function ItemEditorRow({ item, index, initiallyOpen = false, onUpdate, onRemove }: ItemEditorRowProps) {
  const [open, setOpen] = useState(initiallyOpen);
  const accent = index % 2 === 0 ? T.terracotta : T.forest;

  const fieldStyle: React.CSSProperties = {
    width: '100%',
    background: T.cream,
    borderRadius: 8,
    border: `1px solid ${T.hairline}`,
    padding: '0 10px',
    height: 38,
    fontSize: 13,
    color: T.ink,
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 10,
    fontWeight: 500,
    color: T.ink50,
    letterSpacing: '0.06em',
    marginBottom: 4,
  };

  const handlePriceChange = (raw: string) => {
    if (raw === '') { onUpdate(item._key, { priceJpy: null }); return; }
    const n = Math.trunc(Number(raw));
    if (!Number.isNaN(n) && n >= 0) onUpdate(item._key, { priceJpy: n });
  };

  return (
    <div style={{
      background: T.paper,
      borderRadius: 12,
      border: `1px solid ${T.hairline}`,
      marginBottom: 8,
      overflow: 'hidden',
    }}>
      {/* Summary row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: 12,
          cursor: 'pointer',
        }}
        onClick={() => setOpen((v) => !v)}
      >
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          background: T.cream,
          flexShrink: 0,
          border: `1px solid ${T.hairline}`,
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            top: 6,
            left: 6,
            width: 6,
            height: 6,
            borderRadius: 6,
            background: accent,
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
            {item.brand || categoryLabel(item.category)}
          </div>
          <div style={{ fontSize: 12.5, fontWeight: 500, color: T.ink, marginTop: 2 }}>
            {item.productName || '（商品名未入力）'}
          </div>
          {(item.size || item.fitNote) && (
            <div style={{ display: 'flex', gap: 6, marginTop: 3, fontSize: 10, color: T.ink70 }}>
              {item.size && <span>{item.size}</span>}
              {item.size && item.fitNote && <span style={{ color: T.ink30 }}>·</span>}
              {item.fitNote && <span style={{ color: accent }}>{item.fitNote}</span>}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <div style={{
            width: 22,
            height: 22,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: T.ink50,
            transition: 'transform 0.15s',
            transform: open ? 'rotate(180deg)' : 'none',
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(item._key); }}
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: 'transparent',
              border: `1px solid ${T.hairlineStrong}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: T.ink50,
              cursor: 'pointer',
              flexShrink: 0,
            }}
            aria-label="削除"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 3h10M4 3V1.5h4V3M3 3l.8 8h4.4l.8-8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Expanded form */}
      {open && (
        <div style={{
          padding: '0 12px 14px',
          borderTop: `1px solid ${T.hairline}`,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}>
          <div style={{ paddingTop: 12, display: 'flex', gap: 8 }}>
            {/* Category */}
            <div style={{ flex: 1 }}>
              <div style={labelStyle}>カテゴリー</div>
              <select
                value={item.category}
                onChange={(e) => onUpdate(item._key, { category: e.target.value as CategoryValue })}
                style={{ ...fieldStyle, paddingLeft: 8 }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            {/* Size */}
            <div style={{ width: 90 }}>
              <div style={labelStyle}>サイズ</div>
              <select
                value={item.size ?? ''}
                onChange={(e) => onUpdate(item._key, { size: e.target.value || null })}
                style={{ ...fieldStyle, paddingLeft: 8, width: '100%' }}
              >
                <option value="">—</option>
                {SIZES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Brand */}
          <div>
            <div style={labelStyle}>ブランド</div>
            <input
              type="text"
              value={item.brand ?? ''}
              onChange={(e) => onUpdate(item._key, { brand: e.target.value || null })}
              placeholder="例: Mandarine Bros."
              maxLength={100}
              style={fieldStyle}
            />
          </div>

          {/* Product name */}
          <div>
            <div style={labelStyle}>商品名</div>
            <input
              type="text"
              value={item.productName ?? ''}
              onChange={(e) => onUpdate(item._key, { productName: e.target.value || null })}
              placeholder="例: ライトパピーハーネス"
              maxLength={200}
              style={fieldStyle}
            />
          </div>

          {/* Fit note */}
          <div>
            <div style={labelStyle}>フィット感</div>
            <input
              type="text"
              value={item.fitNote ?? ''}
              onChange={(e) => onUpdate(item._key, { fitNote: e.target.value || null })}
              placeholder="例: 少しゆとり / ジャスト / きつめ"
              maxLength={100}
              style={fieldStyle}
            />
          </div>

          {/* Purchase URL */}
          <div>
            <div style={labelStyle}>購入URL（任意）</div>
            <input
              type="url"
              value={item.purchaseUrl ?? ''}
              onChange={(e) => onUpdate(item._key, { purchaseUrl: e.target.value || null })}
              placeholder="https://..."
              maxLength={500}
              style={fieldStyle}
            />
          </div>

          {/* Price */}
          <div>
            <div style={labelStyle}>価格（円・任意）</div>
            <input
              type="number"
              min={0}
              step={1}
              value={item.priceJpy ?? ''}
              onChange={(e) => handlePriceChange(e.target.value)}
              placeholder="例: 3980"
              style={fieldStyle}
            />
          </div>
        </div>
      )}
    </div>
  );
}

type ItemEditorSectionProps = {
  items: EditableItem[];
  onChange: (items: EditableItem[]) => void;
};

export function ItemEditorSection({ items, onChange }: ItemEditorSectionProps) {
  const [newKeys, setNewKeys] = useState<Set<string>>(new Set());

  const addItem = () => {
    const item = newEditableItem();
    setNewKeys((prev) => new Set(prev).add(item._key));
    onChange([...items, item]);
  };

  const removeItem = (key: string) => {
    setNewKeys((prev) => { const s = new Set(prev); s.delete(key); return s; });
    onChange(items.filter((i) => i._key !== key));
  };

  const updateItem = (key: string, patch: Partial<EditableItem>) => {
    onChange(items.map((i) => i._key === key ? { ...i, ...patch } : i));
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
      }}>
        <div style={{ fontSize: 11.5, fontWeight: 500, color: T.ink, letterSpacing: '0.02em' }}>
          着用アイテム{' '}
          {items.length > 0 && (
            <span style={{ color: T.ink50, fontWeight: 400 }}>· {items.length}</span>
          )}
        </div>
        <button
          type="button"
          onClick={addItem}
          style={{
            background: 'transparent',
            border: 'none',
            color: T.terracotta,
            fontSize: 11,
            fontWeight: 500,
            padding: 0,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          + 追加
        </button>
      </div>

      {items.map((item, i) => (
        <ItemEditorRow
          key={item._key}
          item={item}
          index={i}
          initiallyOpen={newKeys.has(item._key)}
          onUpdate={updateItem}
          onRemove={removeItem}
        />
      ))}
    </div>
  );
}
