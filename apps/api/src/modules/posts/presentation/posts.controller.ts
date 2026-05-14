import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import type { JwtPayload } from '../../../common/decorators/current-user.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { CreatePostUseCase } from '../application/use-cases/create-post.use-case';
import { DeletePostUseCase } from '../application/use-cases/delete-post.use-case';
import { GetPostUseCase } from '../application/use-cases/get-post.use-case';
import { ListPostsUseCase } from '../application/use-cases/list-posts.use-case';
import { CreatePostDto } from './dto/create-post.dto';
import { ListPostsQueryDto } from './dto/list-posts-query.dto';
import { ListPostsResponseDto, PostResponseDto } from './dto/post-response.dto';

@Controller('api/v1/posts')
export class PostsController {
  constructor(
    private readonly createPost: CreatePostUseCase,
    private readonly getPost: GetPostUseCase,
    private readonly listPosts: ListPostsUseCase,
    private readonly deletePost: DeletePostUseCase,
  ) {}

  @Get()
  async list(@Query() query: ListPostsQueryDto): Promise<ListPostsResponseDto> {
    const result = await this.listPosts.execute(query);
    return {
      posts: result.posts.map(PostResponseDto.from),
      nextCursor: result.nextCursor,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PostResponseDto> {
    const post = await this.getPost.execute(id);
    return PostResponseDto.from(post);
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
