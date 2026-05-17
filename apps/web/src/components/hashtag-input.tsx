'use client';

import { useRef, useState, KeyboardEvent } from 'react';

const MAX_TAGS = 5;

const T = {
  ink: '#1F1A14',
  ink50: '#7E7567',
  ink30: '#B8AE9E',
  paper: '#FFFEFB',
  terracotta: '#B95A3D',
  hairline: 'rgba(31,26,20,0.08)',
  hairlineStrong: 'rgba(31,26,20,0.14)',
};

interface HashtagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

export function HashtagInput({ value, onChange }: HashtagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (raw: string) => {
    const tag = raw.replace(/^#+/, '').trim();
    if (!tag || value.length >= MAX_TAGS || value.includes(tag)) return;
    onChange([...value, tag]);
    setInputValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const canAddMore = value.length < MAX_TAGS;

  return (
    <div>
      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 6,
          background: T.paper,
          borderRadius: 12,
          border: `1px solid ${T.hairline}`,
          padding: '8px 12px',
          minHeight: 46,
          cursor: 'text',
          boxSizing: 'border-box',
        }}
      >
        {value.map((tag, i) => (
          <span
            key={tag}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '3px 10px 3px 8px',
              borderRadius: 999,
              background: 'rgba(185,90,61,0.10)',
              color: T.terracotta,
              fontSize: 13,
              fontWeight: 500,
              whiteSpace: 'nowrap',
            }}
          >
            #{tag}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(i); }}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                color: T.terracotta,
                opacity: 0.6,
                fontSize: 14,
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center',
              }}
              aria-label={`#${tag} を削除`}
            >
              ×
            </button>
          </span>
        ))}
        {canAddMore && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => { if (inputValue) addTag(inputValue); }}
            placeholder={value.length === 0 ? '#春コーデ #柴犬…' : ''}
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: 14,
              color: T.ink,
              fontFamily: 'inherit',
              minWidth: 120,
              flex: 1,
              padding: 0,
            }}
          />
        )}
      </div>
      <div style={{ marginTop: 4, fontSize: 10, color: T.ink30, textAlign: 'right' }}>
        {value.length} / {MAX_TAGS}
      </div>
    </div>
  );
}
