import { Post } from '../entities/post.entity';
import { PostId } from '../value-objects/post-id.vo';

export interface FindAllOptions {
  limit?: number;
  cursor?: string;
  tags?: string[];
  authorId?: string;
}

export interface FindAllResult {
  posts: Post[];
  nextCursor: string | null;
}

export interface PostRelations {
  dogName: string;
  dogBreed: string;
  dogWeightKg: number | null;
  dogPhotoUrl: string | null;
  authorDisplayName: string;
}

export interface FindAllWithRelationsResult {
  posts: Array<{ post: Post; relations: PostRelations }>;
  nextCursor: string | null;
}

export const POST_REPOSITORY = Symbol('POST_REPOSITORY');

export interface IPostRepository {
  findById(id: PostId): Promise<Post | null>;
  findByIdWithRelations(
    id: PostId,
  ): Promise<{ post: Post; relations: PostRelations } | null>;
  findAll(options?: FindAllOptions): Promise<FindAllResult>;
  findAllWithRelations(
    options?: FindAllOptions,
  ): Promise<FindAllWithRelationsResult>;
  save(post: Post): Promise<void>;
  delete(id: PostId): Promise<void>;
}
