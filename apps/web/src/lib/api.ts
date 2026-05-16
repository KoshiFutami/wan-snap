const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export type PostItem = {
  id: string;
  category: string;
  brand: string | null;
  productName: string | null;
  size: string | null;
  purchaseUrl: string | null;
  priceJpy: number | null;
  fitNote: string | null;
};

export type PostDog = {
  name: string;
  breed: string;
  weightKg: number | null;
  photoUrl: string | null;
};

export type PostAuthor = {
  displayName: string;
};

export type Post = {
  id: string;
  authorId: string;
  dogId: string;
  imageUrl: string;
  caption: string | null;
  tags: string[];
  items: PostItem[];
  likeCount: number;
  bookmarkCount: number;
  createdAt: string;
  updatedAt: string;
  dog: PostDog | null;
  author: PostAuthor | null;
};

export type ListPostsResponse = {
  posts: Post[];
  nextCursor: string | null;
};

export type Dog = {
  id: string;
  name: string;
  breed: string;
  birthYear: number | null;
  weightKg: number | null;
  neckCm: number | null;
  chestCm: number | null;
  backLengthCm: number | null;
  coatColors: string[];
  photoUrl: string | null;
  createdAt: string;
};

export type PublicDog = {
  id: string;
  name: string;
  breed: string;
  weightKg: number | null;
  photoUrl: string | null;
  ownerDisplayName: string;
};

export type UpdateDogInput = {
  name?: string;
  birthYear?: number;
  weightKg?: number;
  neckCm?: number;
  chestCm?: number;
  backLengthCm?: number;
  coatColors?: string[];
  photoUrl?: string | null;
};

export type User = {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
  createdAt: string;
};

export type UpdateUserInput = {
  displayName?: string;
  avatarUrl?: string | null;
  bio?: string;
  location?: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

async function request<T>(
  path: string,
  init?: RequestInit & { token?: string },
): Promise<T> {
  const { token, ...rest } = init ?? {};
  const isFormData = rest.body instanceof FormData;
  const res = await fetch(`${API_BASE}/api/v1${path}`, {
    ...rest,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...rest.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message ?? `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;

  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

export const api = {
  posts: {
    list: (params?: { limit?: number; cursor?: string; tags?: string[]; authorId?: string; dogId?: string }) => {
      const qs = new URLSearchParams();
      if (params?.limit) qs.set('limit', String(params.limit));
      if (params?.cursor) qs.set('cursor', params.cursor);
      params?.tags?.forEach((t) => qs.append('tags', t));
      if (params?.authorId) qs.set('authorId', params.authorId);
      if (params?.dogId) qs.set('dogId', params.dogId);
      return request<ListPostsResponse>(`/posts?${qs.toString()}`);
    },
    get: (id: string) => request<Post>(`/posts/${id}`),
    create: (
      body: {
        dogId: string;
        imageUrl: string;
        caption?: string;
        tags?: string[];
        items?: Omit<PostItem, 'id'>[];
      },
      token: string,
    ) => request<Post>('/posts', { method: 'POST', body: JSON.stringify(body), token }),
    uploadImage: (file: File, token: string) => {
      const formData = new FormData();
      formData.append('file', file);
      return request<{ imageUrl: string }>('/posts/images', {
        method: 'POST',
        body: formData,
        token,
      });
    },
    update: (
      id: string,
      body: { imageUrl?: string; caption?: string; items?: Omit<PostItem, 'id'>[] },
      token: string,
    ) => request<Post>(`/posts/${id}`, { method: 'PATCH', body: JSON.stringify(body), token }),
    delete: (id: string, token: string) =>
      request<void>(`/posts/${id}`, { method: 'DELETE', token }),
    bookmark: (id: string, token: string) =>
      request<void>(`/posts/${id}/bookmark`, { method: 'POST', token }),
    unbookmark: (id: string, token: string) =>
      request<void>(`/posts/${id}/bookmark`, { method: 'DELETE', token }),
  },
  auth: {
    signUp: (body: { email: string; password: string; displayName: string }) =>
      request<AuthTokens>('/auth/sign-up', { method: 'POST', body: JSON.stringify(body) }),
    signIn: (body: { email: string; password: string }) =>
      request<AuthTokens>('/auth/sign-in', { method: 'POST', body: JSON.stringify(body) }),
    refresh: (refreshToken: string) =>
      request<AuthTokens>('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      }),
  },
  breeds: {
    search: (q: string) =>
      request<{ id: string; name: string }[]>(`/breeds?q=${encodeURIComponent(q)}`),
  },
  users: {
    getMe: (token: string) => request<User>('/users/me', { token }),
    updateMe: (body: UpdateUserInput, token: string) =>
      request<User>('/users/me', { method: 'PATCH', body: JSON.stringify(body), token }),
    uploadAvatar: (file: File, token: string) => {
      const formData = new FormData();
      formData.append('file', file);
      return request<{ avatarUrl: string }>('/users/me/avatar', {
        method: 'POST',
        body: formData,
        token,
      });
    },
    getMyBookmarks: (token: string, params?: { limit?: number; cursor?: string }) => {
      const qs = new URLSearchParams();
      if (params?.limit) qs.set('limit', String(params.limit));
      if (params?.cursor) qs.set('cursor', params.cursor);
      return request<ListPostsResponse>(`/users/me/bookmarks?${qs.toString()}`, { token });
    },
  },
  dogs: {
    list: (token: string) => request<Dog[]>('/dogs', { token }),
    get: (id: string, token: string) => request<Dog>(`/dogs/${id}`, { token }),
    getPublic: (id: string) => request<PublicDog>(`/dogs/public/${id}`),
    create: (
      body: {
        name: string;
        breed: string;
        weightKg?: number;
        coatColors?: string[];
      },
      token: string,
    ) => request<Dog>('/dogs', { method: 'POST', body: JSON.stringify(body), token }),
    update: (id: string, body: UpdateDogInput, token: string) =>
      request<Dog>(`/dogs/${id}`, { method: 'PATCH', body: JSON.stringify(body), token }),
    uploadPhoto: (id: string, file: File, token: string) => {
      const formData = new FormData();
      formData.append('file', file);
      return request<{ photoUrl: string }>(`/dogs/${id}/photo`, {
        method: 'POST',
        body: formData,
        token,
      });
    },
    delete: (id: string, token: string) =>
      request<void>(`/dogs/${id}`, { method: 'DELETE', token }),
  },
};
