import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PrismaService } from '../../infrastructure/database/prisma.service';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

type NotifType = 'like' | 'comment' | 'follow';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async list(
    @CurrentUser() user: JwtPayload,
    @Query('type') type?: NotifType,
    @Query('unread') unread?: string,
    @Query('limit') limitStr?: string,
    @Query('cursor') cursor?: string,
  ) {
    const limit = Math.min(Number(limitStr) || DEFAULT_LIMIT, MAX_LIMIT);
    let cursorId: string | undefined;
    if (cursor) {
      try {
        cursorId = (
          JSON.parse(Buffer.from(cursor, 'base64url').toString('utf-8')) as {
            id: string;
          }
        ).id;
      } catch {
        throw new BadRequestException('cursor が不正です');
      }
    }

    const where = {
      recipientId: user.sub,
      ...(type && { type }),
      ...(unread === 'true' && { isRead: false }),
    };

    const [notifications, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        take: limit + 1,
        ...(cursorId && { cursor: { id: cursorId }, skip: 1 }),
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          actor: {
            select: {
              id: true,
              displayName: true,
              avatarUrl: true,
              username: true,
            },
          },
          post: { select: { id: true, imageUrl: true } },
        },
      }),
      this.prisma.notification.count({
        where: { recipientId: user.sub, isRead: false },
      }),
    ]);

    const hasNext = notifications.length > limit;
    const sliced = notifications.slice(0, limit);
    const nextCursor =
      hasNext && sliced.length > 0
        ? Buffer.from(
            JSON.stringify({ id: sliced[sliced.length - 1].id }),
          ).toString('base64url')
        : null;

    const followActorIds = sliced
      .filter((n) => n.type === 'follow')
      .map((n) => n.actor.id);

    const followingSet = new Set<string>();
    if (followActorIds.length > 0) {
      const existingFollows = await this.prisma.follow.findMany({
        where: { followerId: user.sub, followingId: { in: followActorIds } },
        select: { followingId: true },
      });
      existingFollows.forEach((f) => followingSet.add(f.followingId));
    }

    return {
      notifications: sliced.map((n) => ({
        id: n.id,
        type: n.type,
        isRead: n.isRead,
        createdAt: n.createdAt.toISOString(),
        actor: {
          ...n.actor,
          isFollowing:
            n.type === 'follow' ? followingSet.has(n.actor.id) : undefined,
        },
        post: n.post ?? null,
      })),
      unreadCount,
      nextCursor,
    };
  }

  @Patch('read-all')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async markAllRead(@CurrentUser() user: JwtPayload): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { recipientId: user.sub, isRead: false },
      data: { isRead: true },
    });
  }
}
