import {
  Inject,
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
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
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new ConflictException('すでにいいね済みです');
      }
      throw err;
    }
    // いいね成功後に通知を作成（失敗してもいいね自体は成功済みのため握りつぶす）
    if (post.authorId !== userId) {
      await this.prisma.notification
        .create({
          data: {
            type: 'like',
            recipientId: post.authorId,
            actorId: userId,
            postId,
          },
        })
        .catch(() => undefined);
    }
  }
}
