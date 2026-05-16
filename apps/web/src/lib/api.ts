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
  weightKg: number | null;
  coatColors: string[];
  photoUrl: string | null;
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
  avatarUrl?: string;
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
  return res.json() as Promise<T>;
}

export const api = {
  posts: {
    list: (params?: { limit?: number; cursor?: string; tags?: string[] }) => {
      const qs = new URLSearchParams();
      if (params?.limit) qs.set('limit', String(params.limit));
      if (params?.cursor) qs.set('cursor', params.cursor);
      params?.tags?.forEach((t) => qs.append('tags', t));
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
    delete: (id: string, token: string) =>
      request<void>(`/posts/${id}`, { method: 'DELETE', token }),
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
  },
  dogs: {
    list: (token: string) => request<Dog[]>('/dogs', { token }),
    create: (
      body: {
        name: string;
        breed: string;
        weightKg?: number;
        coatColors?: string[];
      },
      token: string,
    ) => request<Dog>('/dogs', { method: 'POST', body: JSON.stringify(body), token }),
  },
};
