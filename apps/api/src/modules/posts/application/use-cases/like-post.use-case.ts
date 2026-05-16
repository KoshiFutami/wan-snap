import {
  Inject,
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import type { IPostRepository } from '../../domain/repositories/post.repository';
import { POST_REPOSITORY } from '../../domain/repositories/post.repository';
import { PostId } from '../../domain/value-objects/post-id.vo';

@Injectable()
export class LikePostUseCase {
  constructor(
    @Inject(POST_REPOSITORY) private readonly postRepo: IPostRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(postId: string, userId: string): Promise<void> {
    const post = await this.postRepo.findById(PostId.of(postId));
    if (!post) throw new NotFoundException('投稿が見つかりません');
    try {
      await this.prisma.like.create({
        data: { userId, postId },
      });
    } catch (err: unknown) {
      // P2002: ユニーク制約違反（重複いいね）
      if (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        (err as { code: string }).code === 'P2002'
      ) {
        throw new ConflictException('すでにいいね済みです');
      }
      throw err;
    }
  }
}
