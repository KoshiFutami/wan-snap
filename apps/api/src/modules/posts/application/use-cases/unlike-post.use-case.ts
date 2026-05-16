import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import type { IPostRepository } from '../../domain/repositories/post.repository';
import { POST_REPOSITORY } from '../../domain/repositories/post.repository';
import { PostId } from '../../domain/value-objects/post-id.vo';

@Injectable()
export class UnlikePostUseCase {
  constructor(
    @Inject(POST_REPOSITORY) private readonly postRepo: IPostRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(postId: string, userId: string): Promise<void> {
    const post = await this.postRepo.findById(PostId.of(postId));
    if (!post) throw new NotFoundException('投稿が見つかりません');
    const deleted = await this.prisma.like.deleteMany({
      where: { userId, postId },
    });
    if (deleted.count === 0) {
      throw new NotFoundException('いいねが見つかりません');
    }
  }
}
