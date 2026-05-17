import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

@Controller()
export class CommentsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('posts/:postId/comments')
  async list(
    @Param('postId') postId: string,
    @Query('limit') limitStr?: string,
    @Query('cursor') cursor?: string,
  ) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('投稿が見つかりません');

    const limit = Math.min(Number(limitStr) || DEFAULT_LIMIT, MAX_LIMIT);
    const cursorId = cursor
      ? (
          JSON.parse(Buffer.from(cursor, 'base64url').toString('utf-8')) as {
            id: string;
          }
        ).id
      : undefined;

    const comments = await this.prisma.comment.findMany({
      take: limit + 1,
      ...(cursorId && { cursor: { id: cursorId }, skip: 1 }),
      where: { postId },
      orderBy: { createdAt: 'asc' },
      include: {
        author: { select: { id: true, displayName: true, avatarUrl: true } },
      },
    });

    const hasNext = comments.length > limit;
    const sliced = comments.slice(0, limit);
    const nextCursor =
      hasNext && sliced.length > 0
        ? Buffer.from(
            JSON.stringify({ id: sliced[sliced.length - 1].id }),
          ).toString('base64url')
        : null;

    return {
      comments: sliced.map((c) => ({
        id: c.id,
        body: c.body,
        createdAt: c.createdAt.toISOString(),
        author: {
          id: c.author.id,
          displayName: c.author.displayName,
          avatarUrl: c.author.avatarUrl,
        },
      })),
      nextCursor,
    };
  }

  @Post('posts/:postId/comments')
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('postId') postId: string,
    @Body() dto: CreateCommentDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('投稿が見つかりません');

    const comment = await this.prisma.comment.create({
      data: { body: dto.body, postId, authorId: user.sub },
      include: {
        author: { select: { id: true, displayName: true, avatarUrl: true } },
      },
    });

    // コメント成功後に通知を作成（失敗してもコメント自体は成功済みのため握りつぶす）
    if (post.authorId !== user.sub) {
      await this.prisma.notification
        .create({ data: { type: 'comment', recipientId: post.authorId, actorId: user.sub, postId } })
        .catch(() => undefined);
    }

    return {
      id: comment.id,
      body: comment.body,
      createdAt: comment.createdAt.toISOString(),
      author: {
        id: comment.author.id,
        displayName: comment.author.displayName,
        avatarUrl: comment.author.avatarUrl,
      },
    };
  }

  @Delete('comments/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<void> {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException('コメントが見つかりません');
    if (comment.authorId !== user.sub)
      throw new ForbiddenException('コメントを削除する権限がありません');
    await this.prisma.comment.delete({ where: { id } });
  }
}
