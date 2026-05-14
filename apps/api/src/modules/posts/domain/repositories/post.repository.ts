import { Post } from '../entities/post.entity';
import { PostId } from '../value-objects/post-id.vo';

export interface FindAllOptions {
  limit?: number;
  cursor?: string;
  tags?: string[];
}

export interface FindAllResult {
  posts: Post[];
  nextCursor: string | null;
}

export const POST_REPOSITORY = Symbol('POST_REPOSITORY');

export interface IPostRepository {
  findById(id: PostId): Promise<Post | null>;
  findAll(options?: FindAllOptions): Promise<FindAllResult>;
  save(post: Post): Promise<void>;
  delete(id: PostId): Promise<void>;
}
