import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/database/prisma.module';
import { POST_REPOSITORY } from './domain/repositories/post.repository';
import { PrismaPostRepository } from './infrastructure/repositories/prisma-post.repository';
import { CreatePostUseCase } from './application/use-cases/create-post.use-case';
import { DeletePostUseCase } from './application/use-cases/delete-post.use-case';
import { GetPostUseCase } from './application/use-cases/get-post.use-case';
import { LikePostUseCase } from './application/use-cases/like-post.use-case';
import { ListPostsUseCase } from './application/use-cases/list-posts.use-case';
import { UnlikePostUseCase } from './application/use-cases/unlike-post.use-case';
import { UpdatePostUseCase } from './application/use-cases/update-post.use-case';
import { PostsController } from './presentation/posts.controller';
import { PostImageStorageService } from './infrastructure/services/post-image-storage.service';

@Module({
  imports: [PrismaModule],
  controllers: [PostsController],
  providers: [
    { provide: POST_REPOSITORY, useClass: PrismaPostRepository },
    CreatePostUseCase,
    GetPostUseCase,
    LikePostUseCase,
    ListPostsUseCase,
    UnlikePostUseCase,
    DeletePostUseCase,
    UpdatePostUseCase,
    PostImageStorageService,
  ],
})
export class PostsModule {}
