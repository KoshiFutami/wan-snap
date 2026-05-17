import {
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
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../../common/guards/optional-jwt-auth.guard';
import { imageFileInterceptor } from '../../../common/interceptors/image-file.interceptor';
import type { JwtPayload } from '../../../common/decorators/current-user.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { CreatePostUseCase } from '../application/use-cases/create-post.use-case';
import { DeletePostUseCase } from '../application/use-cases/delete-post.use-case';
import { GetPostUseCase } from '../application/use-cases/get-post.use-case';
import { LikePostUseCase } from '../application/use-cases/like-post.use-case';
import { ListPostsUseCase } from '../application/use-cases/list-posts.use-case';
import { UnlikePostUseCase } from '../application/use-cases/unlike-post.use-case';
import { UpdatePostUseCase } from '../application/use-cases/update-post.use-case';
import { PostImageStorageService } from '../infrastructure/services/post-image-storage.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ListPostsQueryDto } from './dto/list-posts-query.dto';
import { ListPostsResponseDto, PostResponseDto } from './dto/post-response.dto';
import { UploadPostImageResponseDto } from './dto/upload-post-image-response.dto';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly createPost: CreatePostUseCase,
    private readonly getPost: GetPostUseCase,
    private readonly likePost: LikePostUseCase,
    private readonly listPosts: ListPostsUseCase,
    private readonly unlikePost: UnlikePostUseCase,
    private readonly deletePost: DeletePostUseCase,
    private readonly updatePost: UpdatePostUseCase,
    private readonly postImageStorage: PostImageStorageService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  async list(
    @Query() query: ListPostsQueryDto,
    @CurrentUser() me: JwtPayload | null,
  ): Promise<ListPostsResponseDto> {
    const result = await this.listPosts.execute({
      ...query,
      tags: this.normalizeTags(query),
      requesterId: me?.sub,
      followingUserId: query.followingOnly && me ? me.sub : undefined,
    });
    return {
      posts: result.posts.map(({ post, relations }) =>
        PostResponseDto.from(post, relations),
      ),
      nextCursor: result.nextCursor,
    };
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user?: JwtPayload | null,
  ): Promise<PostResponseDto> {
    const { post, relations } = await this.getPost.execute(id, user?.sub);
    return PostResponseDto.from(post, relations ?? undefined);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() dto: CreatePostDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<PostResponseDto> {
    const post = await this.createPost.execute({ ...dto, authorId: user.sub });
    return PostResponseDto.from(post);
  }

  @Post('images')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(imageFileInterceptor)
  async uploadImage(
    @UploadedFile() file?: { buffer: Buffer },
  ): Promise<UploadPostImageResponseDto> {
    if (!file) {
      throw new BadRequestException('画像ファイルを選択してください');
    }
    const { imageUrl, imageWidth, imageHeight } =
      await this.postImageStorage.uploadPostImage(file.buffer);
    return { imageUrl, imageWidth, imageHeight };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<PostResponseDto> {
    const post = await this.updatePost.execute({
      id,
      requesterId: user.sub,
      ...dto,
    });
    return PostResponseDto.from(post);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<void> {
    await this.deletePost.execute(id, user.sub);
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async like(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<void> {
    await this.likePost.execute(id, user.sub);
  }

  @Delete(':id/like')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async unlike(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<void> {
    await this.unlikePost.execute(id, user.sub);
  }

  @Post(':id/bookmark')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async bookmark(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<void> {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('投稿が見つかりません');
    try {
      await this.prisma.bookmark.create({
        data: { userId: user.sub, postId: id },
      });
    } catch (err: unknown) {
      // P2002: ユニーク制約違反（重複ブックマーク）
      if (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        (err as { code: string }).code === 'P2002'
      ) {
        throw new ConflictException('すでにブックマーク済みです');
      }
      throw err;
    }
  }

  @Delete(':id/bookmark')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async unbookmark(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<void> {
    const deleted = await this.prisma.bookmark.deleteMany({
      where: { userId: user.sub, postId: id },
    });
    if (deleted.count === 0) {
      throw new NotFoundException('ブックマークが見つかりません');
    }
  }

  private normalizeTags(query: ListPostsQueryDto): string[] | undefined {
    const tags = [...(query.tag ? [query.tag] : []), ...(query.tags ?? [])]
      .map((tag) => tag.trim())
      .filter(Boolean);

    return tags.length > 0 ? [...new Set(tags)] : undefined;
  }
}
