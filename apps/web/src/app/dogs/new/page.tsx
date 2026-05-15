'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { getValidToken } from '../../../lib/auth-store';

export default function NewDogPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [coatColors, setCoatColors] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = await getValidToken();
    if (!token) { router.push('/auth/sign-in'); return; }

    setError('');
    setLoading(true);
    try {
      await api.dogs.create(
        {
          name,
          breed,
          weightKg: weightKg ? parseFloat(weightKg) : undefined,
          coatColors: coatColors ? coatColors.split(',').map((s) => s.trim()).filter(Boolean) : [],
        },
        token,
      );
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : '登録に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-2xl border-2 border-border-warm bg-white px-4 py-3 text-sm font-medium text-text-main placeholder:text-text-muted focus:border-primary focus:outline-none transition-colors";

  return (
    <div className="mx-auto max-w-sm py-12">
      <div className="mb-8">
        <span className="text-4xl">🐾</span>
        <h1 className="mt-3 text-2xl font-black tracking-tight text-text-main">愛犬を登録する</h1>
        <p className="mt-1 text-sm text-text-sub">まず愛犬のプロフィールを作りましょう</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-black text-text-sub uppercase tracking-widest mb-1.5">名前 *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="むぎ"
          />
        </div>
        <div>
          <label className="block text-xs font-black text-text-sub uppercase tracking-widest mb-1.5">犬種 *</label>
          <input
            type="text"
            required
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            className={inputClass}
            placeholder="柴犬"
          />
        </div>
        <div>
          <label className="block text-xs font-black text-text-sub uppercase tracking-widest mb-1.5">体重（kg）</label>
          <input
            type="number"
            step="0.1"
            min="0.1"
            max="200"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            className={inputClass}
            placeholder="8.5"
          />
        </div>
        <div>
          <label className="block text-xs font-black text-text-sub uppercase tracking-widest mb-1.5">毛色（カンマ区切り）</label>
          <input
            type="text"
            value={coatColors}
            onChange={(e) => setCoatColors(e.target.value)}
            className={inputClass}
            placeholder="赤, クリーム"
          />
        </div>

        {error && (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl py-3 text-sm font-black text-white transition-all hover:opacity-90 hover:-translate-y-px disabled:opacity-50 disabled:translate-y-0"
          style={{ background: 'linear-gradient(135deg, #FF6B35, #EF476F)', boxShadow: '0 6px 20px rgba(255,107,53,0.4)' }}
        >
          {loading ? '登録中...' : '登録する'}
        </button>
      </form>
    </div>
  );
}
