'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { getAccessToken } from '../../../lib/auth-store';

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
    const token = getAccessToken();
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

  return (
    <div className="mx-auto max-w-sm py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">愛犬を登録する</h1>
        <p className="mt-1 text-sm text-gray-500">まず愛犬のプロフィールを作りましょう</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">名前 *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-gray-400 focus:outline-none"
            placeholder="むぎ"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">犬種 *</label>
          <input
            type="text"
            required
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-gray-400 focus:outline-none"
            placeholder="柴犬"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">体重（kg）</label>
          <input
            type="number"
            step="0.1"
            min="0.1"
            max="200"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-gray-400 focus:outline-none"
            placeholder="8.5"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">毛色（カンマ区切り）</label>
          <input
            type="text"
            value={coatColors}
            onChange={(e) => setCoatColors(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-gray-400 focus:outline-none"
            placeholder="赤, クリーム"
          />
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gray-900 py-2.5 text-sm font-medium text-white hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {loading ? '登録中...' : '登録する'}
        </button>
      </form>
    </div>
  );
}
