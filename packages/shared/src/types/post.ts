import type { DogProfile } from './dog.js';
import type { PostItem } from './item.js';
import type { UserPublic } from './user.js';

export interface Post {
  id: string;
  imageUrl: string;
  caption?: string;
  dog: DogProfile;
  items: PostItem[];
  author: UserPublic;
  likeCount: number;
  isLiked?: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PostsFilter {
  breed?: string;
  coatColor?: string;
  itemCategory?: string;
  brand?: string;
  minWeightKg?: number;
  maxWeightKg?: number;
  cursor?: string;
  limit?: number;
}

export interface PostsPage {
  posts: Post[];
  nextCursor?: string;
  hasMore: boolean;
}
