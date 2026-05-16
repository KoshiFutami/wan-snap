import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { imageFileInterceptor } from '../../../common/interceptors/image-file.interceptor';
import type { JwtPayload } from '../../../common/decorators/current-user.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { CreatePostUseCase } from '../application/use-cases/create-post.use-case';
import { DeletePostUseCase } from '../application/use-cases/delete-post.use-case';
import { GetPostUseCase } from '../application/use-cases/get-post.use-case';
import { ListPostsUseCase } from '../application/use-cases/list-posts.use-case';
import { PostImageStorageService } from '../infrastructure/services/post-image-storage.service';
import { CreatePostDto } from './dto/create-post.dto';
import { ListPostsQueryDto } from './dto/list-posts-query.dto';
import { ListPostsResponseDto, PostResponseDto } from './dto/post-response.dto';
import { UploadPostImageResponseDto } from './dto/upload-post-image-response.dto';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly createPost: CreatePostUseCase,
    private readonly getPost: GetPostUseCase,
    private readonly listPosts: ListPostsUseCase,
    private readonly deletePost: DeletePostUseCase,
    private readonly postImageStorage: PostImageStorageService,
  ) {}

  @Get()
  async list(@Query() query: ListPostsQueryDto): Promise<ListPostsResponseDto> {
    const result = await this.listPosts.execute(query);
    return {
      posts: result.posts.map(({ post, relations }) =>
        PostResponseDto.from(post, relations),
      ),
      nextCursor: result.nextCursor,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PostResponseDto> {
    const { post, relations } = await this.getPost.execute(id);
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
    const imageUrl = await this.postImageStorage.uploadPostImage(file.buffer);
    return { imageUrl };
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
}
