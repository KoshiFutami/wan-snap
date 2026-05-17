import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type {
  IPostRepository,
  PostRelations,
} from '../../domain/repositories/post.repository';
import { POST_REPOSITORY } from '../../domain/repositories/post.repository';
import { Post } from '../../domain/entities/post.entity';
import { PostId } from '../../domain/value-objects/post-id.vo';

@Injectable()
export class GetPostUseCase {
  constructor(
    @Inject(POST_REPOSITORY) private readonly postRepo: IPostRepository,
  ) {}

  async execute(
    id: string,
    requesterId?: string,
  ): Promise<{ post: Post; relations: PostRelations | null }> {
    const result = await this.postRepo.findByIdWithRelations(
      PostId.of(id),
      requesterId,
    );
    if (!result) throw new NotFoundException('投稿が見つかりません');
    return result;
  }
}
