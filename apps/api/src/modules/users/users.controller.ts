import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../common/guards/optional-jwt-auth.guard';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { imageFileInterceptor } from '../../common/interceptors/image-file.interceptor';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { ProfileImageStorageService } from '../../infrastructure/storage/profile-image-storage.service';
import { UpdateUserDto } from './dto/update-user.dto';

const userSelect = {
  id: true,
  username: true,
  displayName: true,
  avatarUrl: true,
  bio: true,
  location: true,
  instagramUsername: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Controller('users')
export class UsersController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly profileImageStorage: ProfileImageStorageService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: JwtPayload) {
    const [me, followerCount, followingCount] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: user.sub },
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          bio: true,
          location: true,
          instagramUsername: true,
          createdAt: true,
        },
      }),
      this.prisma.follow.count({ where: { followingId: user.sub } }),
      this.prisma.follow.count({ where: { followerId: user.sub } }),
    ]);
    if (!me) throw new NotFoundException('ユーザーが見つかりません');
    return { ...me, followerCount, followingCount };
  }

  @Post('me/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(imageFileInterceptor)
  async uploadAvatar(
    @CurrentUser() user: JwtPayload,
    @UploadedFile() file?: { buffer: Buffer },
  ) {
    if (!file) {
      throw new BadRequestException('画像ファイルを選択してください');
    }

    const current = await this.prisma.user.findUnique({
      where: { id: user.sub },
      select: { avatarUrl: true },
    });
    if (!current) throw new NotFoundException('ユーザーが見つかりません');

    const avatarUrl = await this.profileImageStorage.uploadAvatar(
      user.sub,
      file.buffer,
    );

    const updated = await this.prisma.user.update({
      where: { id: user.sub },
      data: { avatarUrl },
      select: userSelect,
    });

    await this.profileImageStorage.deleteImage(current.avatarUrl);

    return { avatarUrl: updated.avatarUrl };
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateMe(@CurrentUser() user: JwtPayload, @Body() dto: UpdateUserDto) {
    const current = await this.prisma.user.findUnique({
      where: { id: user.sub },
      select: { avatarUrl: true },
    });
    try {
      const updated = await this.prisma.user.update({
        where: { id: user.sub },
        data: dto,
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          bio: true,
          location: true,
          instagramUsername: true,
          updatedAt: true,
        },
      });
      if (
        dto.avatarUrl !== undefined &&
        current?.avatarUrl &&
        dto.avatarUrl !== current.avatarUrl
      ) {
        await this.profileImageStorage.deleteImage(current.avatarUrl);
      }
      return updated;
    } catch (err: unknown) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        (err as { code: string }).code === 'P2002'
      ) {
        throw new ConflictException(
          'このユーザーネームはすでに使用されています',
        );
      }
      throw err;
    }
  }

  @Get('me/bookmarks')
  @UseGuards(JwtAuthGuard)
  async getMyBookmarks(
    @CurrentUser() user: JwtPayload,
    @Query('cursor') cursor?: string,
    @Query('limit') limitStr?: string,
  ) {
    const limit = Math.min(Number(limitStr) || 20, 100);
    const cursorId = cursor
      ? (
          JSON.parse(Buffer.from(cursor, 'base64url').toString('utf-8')) as {
            id: string;
          }
        ).id
      : undefined;

    const bookmarks = await this.prisma.bookmark.findMany({
      take: limit + 1,
      ...(cursorId && {
        cursor: { userId_postId: { userId: user.sub, postId: cursorId } },
        skip: 1,
      }),
      where: { userId: user.sub },
      orderBy: { createdAt: 'desc' },
      include: {
        post: {
          include: {
            items: true,
            postTags: true,
            dog: {
              select: {
                name: true,
                breed: {
                  select: {
                    name: true,
                    shortName: true,
                  },
                },
                weightKg: true,
                photoUrl: true,
              },
            },
            author: { select: { displayName: true, username: true } },
            _count: { select: { likes: true, bookmarks: true } },
          },
        },
      },
    });

    const hasNext = bookmarks.length > limit;
    const sliced = bookmarks.slice(0, limit);

    const posts = sliced.map(({ post }) => ({
      id: post.id,
      authorId: post.authorId,
      dogId: post.dogId,
      imageUrl: post.imageUrl,
      caption: post.caption,
      tags: post.postTags.map((postTag) => postTag.tag),
      items: post.items,
      likeCount: post._count.likes,
      bookmarkCount: post._count.bookmarks,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      dog: {
        name: post.dog.name,
        breed: post.dog.breed.name,
        breedShortName: post.dog.breed.shortName,
        weightKg: post.dog.weightKg ? Number(post.dog.weightKg) : null,
        photoUrl: post.dog.photoUrl,
      },
      author: {
        displayName: post.author.displayName,
        username: post.author.username,
      },
    }));

    const nextCursor =
      hasNext && sliced.length > 0
        ? Buffer.from(
            JSON.stringify({ id: sliced[sliced.length - 1].postId }),
          ).toString('base64url')
        : null;

    return { posts, nextCursor };
  }

  // username前方一致検索（@メンション補完用）
  @Get('search')
  async searchUsers(@Query('q') q?: string) {
    if (!q || q.trim().length === 0) return [];
    const term = q.trim().slice(0, 30);
    const users = await this.prisma.user.findMany({
      where: {
        username: { startsWith: term },
      },
      select: { id: true, username: true, displayName: true, avatarUrl: true },
      take: 10,
      orderBy: { username: 'asc' },
    });
    return users;
  }

  // usernameでユーザーを取得
  @Get('by-username/:username')
  @UseGuards(OptionalJwtAuthGuard)
  async findByUsername(
    @Param('username') username: string,
    @CurrentUser() me: JwtPayload | null,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        location: true,
        instagramUsername: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundException('ユーザーが見つかりません');

    const [followerCount, followingCount, isFollowingRecord] =
      await Promise.all([
        this.prisma.follow.count({ where: { followingId: user.id } }),
        this.prisma.follow.count({ where: { followerId: user.id } }),
        me
          ? this.prisma.follow.findUnique({
              where: {
                followerId_followingId: {
                  followerId: me.sub,
                  followingId: user.id,
                },
              },
              select: { followerId: true },
            })
          : Promise.resolve(null),
      ]);

    return {
      ...user,
      followerCount,
      followingCount,
      isFollowing: !!isFollowingRecord,
    };
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  async findOne(@Param('id') id: string, @CurrentUser() me: JwtPayload | null) {
    const [user, followerCount, followingCount, isFollowingRecord] =
      await Promise.all([
        this.prisma.user.findUnique({
          where: { id },
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            bio: true,
            location: true,
            instagramUsername: true,
            createdAt: true,
          },
        }),
        this.prisma.follow.count({ where: { followingId: id } }),
        this.prisma.follow.count({ where: { followerId: id } }),
        me
          ? this.prisma.follow.findUnique({
              where: {
                followerId_followingId: { followerId: me.sub, followingId: id },
              },
              select: { followerId: true },
            })
          : Promise.resolve(null),
      ]);
    if (!user) throw new NotFoundException('ユーザーが見つかりません');
    return {
      ...user,
      followerCount,
      followingCount,
      isFollowing: !!isFollowingRecord,
    };
  }

  @Post(':id/follow')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async follow(
    @Param('id') id: string,
    @CurrentUser() me: JwtPayload,
  ): Promise<void> {
    if (me.sub === id) {
      throw new BadRequestException('自分自身をフォローできません');
    }
    const target = await this.prisma.user.findUnique({ where: { id } });
    if (!target) throw new NotFoundException('ユーザーが見つかりません');
    try {
      await this.prisma.follow.create({
        data: { followerId: me.sub, followingId: id },
      });
    } catch (err: unknown) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        (err as { code: string }).code === 'P2002'
      ) {
        throw new ConflictException('すでにフォロー済みです');
      }
      throw err;
    }
    // フォロー成功後に通知を作成（失敗してもフォロー自体は成功済みのため握りつぶす）
    await this.prisma.notification
      .create({ data: { type: 'follow', recipientId: id, actorId: me.sub } })
      .catch(() => undefined);
  }

  @Delete(':id/follow')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async unfollow(
    @Param('id') id: string,
    @CurrentUser() me: JwtPayload,
  ): Promise<void> {
    const deleted = await this.prisma.follow.deleteMany({
      where: { followerId: me.sub, followingId: id },
    });
    if (deleted.count === 0) {
      throw new NotFoundException('フォロー関係が見つかりません');
    }
  }

  @Get(':id/followers')
  async getFollowers(@Param('id') id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('ユーザーが見つかりません');
    const follows = await this.prisma.follow.findMany({
      where: { followingId: id },
      orderBy: { createdAt: 'desc' },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    });
    return follows.map((f) => f.follower);
  }

  @Get(':id/following')
  async getFollowing(@Param('id') id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('ユーザーが見つかりません');
    const follows = await this.prisma.follow.findMany({
      where: { followerId: id },
      orderBy: { createdAt: 'desc' },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    });
    return follows.map((f) => f.following);
  }
}
