import { Inject, Injectable } from '@nestjs/common';
import type {
  FindAllWithRelationsResult,
  IPostRepository,
} from '../../domain/repositories/post.repository';
import { POST_REPOSITORY } from '../../domain/repositories/post.repository';

export interface ListPostsInput {
  limit?: number;
  cursor?: string;
  tags?: string[];
  authorId?: string;
  dogId?: string;
  followingUserId?: string;
}

@Injectable()
export class ListPostsUseCase {
  constructor(
    @Inject(POST_REPOSITORY) private readonly postRepo: IPostRepository,
  ) {}

  async execute(input: ListPostsInput): Promise<FindAllWithRelationsResult> {
    return this.postRepo.findAllWithRelations({
      limit: input.limit,
      cursor: input.cursor,
      tags: input.tags,
      authorId: input.authorId,
      dogId: input.dogId,
      followingUserId: input.followingUserId,
    });
  }
}
