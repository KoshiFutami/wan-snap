import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IPostRepository } from '../../domain/repositories/post.repository';
import { POST_REPOSITORY } from '../../domain/repositories/post.repository';
import { Post } from '../../domain/entities/post.entity';
import { PostId } from '../../domain/value-objects/post-id.vo';

@Injectable()
export class GetPostUseCase {
  constructor(
    @Inject(POST_REPOSITORY) private readonly postRepo: IPostRepository,
  ) {}

  async execute(id: string): Promise<Post> {
    const post = await this.postRepo.findById(PostId.of(id));
    if (!post) throw new NotFoundException('投稿が見つかりません');
    return post;
  }
}
