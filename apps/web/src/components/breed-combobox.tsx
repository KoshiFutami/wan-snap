'use client';

import type { CSSProperties, KeyboardEvent } from 'react';
import { useState, useEffect, useRef } from 'react';
import { api } from '../lib/api';
import { getValidToken } from '../lib/auth-store';

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
  breedId: string;
  onChange: (value: { id: string; name: string }) => void;
  required?: boolean;
  allowCreate?: boolean;
}

type BreedOption = {
  id: string;
  name: string;
};

export function BreedCombobox({
  value,
  breedId,
  onChange,
  required,
  allowCreate = true,
}: BreedComboboxProps) {
  const hasResolvedBreed = Boolean(breedId);
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<BreedOption[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isNew, setIsNew] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
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
        setSuggestions(results);
        setIsNew(
          allowCreate &&
            (results.length === 0 ||
              !results.some((breed) => breed.name === inputValue.trim())),
        );
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
  }, [allowCreate, inputValue]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const select = (breed: BreedOption) => {
    setInputValue(breed.name);
    onChange(breed);
    setOpen(false);
    setActiveIndex(-1);
  };

  const createBreed = async () => {
    const name = inputValue.trim();
    if (!name || isCreating) return;

    setIsCreating(true);
    try {
      const token = await getValidToken();
      if (!token) return;
      const breed = await api.breeds.create(name, token);
      setSuggestions((current) => {
        const next = current.filter((item) => item.id !== breed.id);
        next.unshift(breed);
        return next;
      });
      setIsNew(false);
      select(breed);
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    const items = isNew ? [...suggestions, { id: '__new__', name: inputValue.trim() }] : suggestions;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      if (items[activeIndex]?.id === '__new__') {
        void createBreed();
      } else {
        select(items[activeIndex] as BreedOption);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const inputStyle: CSSProperties = {
    width: '100%',
    background: T.paper,
    borderRadius: 12,
    border: `1px solid ${open ? T.ink30 : inputValue.trim() && !hasResolvedBreed ? T.ink30 : T.hairline}`,
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
          const nextValue = e.target.value;
          setInputValue(nextValue);
          onChange({ id: '', name: nextValue });
        }}
        onFocus={() => {
          if (suggestions.length > 0 || isNew) setOpen(true);
        }}
        onKeyDown={handleKeyDown}
        style={inputStyle}
      />
      {open && hasItems && (
        <div style={dropdownStyle}>
          {suggestions.map((breed, i) => (
            <button
              key={breed.id}
              type="button"
              onMouseDown={() => select(breed)}
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
              {breed.name}
            </button>
          ))}
          {showNew && (
            <button
              type="button"
              onMouseDown={() => {
                void createBreed();
              }}
              disabled={isCreating}
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
                opacity: isCreating ? 0.6 : 1,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              {isCreating
                ? '犬種を登録中...'
                : `「${inputValue.trim()}」を新しい犬種として登録`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
