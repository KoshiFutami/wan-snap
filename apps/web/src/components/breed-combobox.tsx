'use client';

import type { CSSProperties, KeyboardEvent } from 'react';
import { useState, useEffect, useRef } from 'react';
import { api } from '../lib/api';

const T = {
  ink: '#1F1A14',
  ink70: '#4A4239',
  ink50: '#7E7567',
  ink30: '#B8AE9E',
  ink10: '#E8E0D0',
  paper: '#FFFEFB',
  cream: '#F4EDE0',
  hairline: 'rgba(31,26,20,0.08)',
  hairlineStrong: 'rgba(31,26,20,0.14)',
};

interface BreedComboboxProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export function BreedCombobox({ value, onChange, required }: BreedComboboxProps) {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isNew, setIsNew] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!inputValue.trim()) {
      setSuggestions([]);
      setOpen(false);
      setIsNew(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await api.breeds.search(inputValue.trim());
        const names = results.map((r) => r.name);
        setSuggestions(names);
        setIsNew(names.length === 0 || !names.some((n) => n === inputValue.trim()));
        setOpen(true);
        setActiveIndex(-1);
      } catch {
        setSuggestions([]);
        setOpen(false);
      }
    }, 200);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputValue]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const select = (name: string) => {
    setInputValue(name);
    onChange(name);
    setOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    const items = isNew ? [...suggestions, inputValue.trim()] : suggestions;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      select(items[activeIndex]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const inputStyle: CSSProperties = {
    width: '100%',
    background: T.paper,
    borderRadius: 12,
    border: `1px solid ${open ? T.ink30 : T.hairline}`,
    padding: '0 14px',
    height: 46,
    fontSize: 14,
    color: T.ink,
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  };

  const dropdownStyle: CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 4,
    background: T.paper,
    borderRadius: 12,
    border: `1px solid ${T.hairlineStrong}`,
    boxShadow: '0 8px 24px rgba(31,26,20,0.10)',
    zIndex: 50,
    overflow: 'hidden',
    maxHeight: 240,
    overflowY: 'auto',
  };

  const showNew = isNew && inputValue.trim().length > 0;
  const hasItems = suggestions.length > 0 || showNew;

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <input
        type="text"
        required={required}
        value={inputValue}
        placeholder="柴犬"
        autoComplete="off"
        onChange={(e) => {
          setInputValue(e.target.value);
          onChange(e.target.value);
        }}
        onFocus={() => {
          if (suggestions.length > 0 || isNew) setOpen(true);
        }}
        onKeyDown={handleKeyDown}
        style={inputStyle}
      />
      {open && hasItems && (
        <div style={dropdownStyle}>
          {suggestions.map((name, i) => (
            <button
              key={name}
              type="button"
              onMouseDown={() => select(name)}
              style={{
                width: '100%',
                padding: '11px 14px',
                textAlign: 'left',
                background: activeIndex === i ? T.cream : 'transparent',
                border: 'none',
                borderBottom: `1px solid ${T.hairline}`,
                fontSize: 14,
                color: T.ink,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {name}
            </button>
          ))}
          {showNew && (
            <button
              type="button"
              onMouseDown={() => select(inputValue.trim())}
              style={{
                width: '100%',
                padding: '11px 14px',
                textAlign: 'left',
                background: activeIndex === suggestions.length ? T.cream : 'transparent',
                border: 'none',
                fontSize: 13.5,
                color: T.ink50,
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              「{inputValue.trim()}」を新しい犬種として登録
            </button>
          )}
        </div>
      )}
    </div>
  );
}
