import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DogsModule } from './modules/dogs/dogs.module';
import { PostsModule } from './modules/posts/posts.module';
import { TagsModule } from './modules/tags/tags.module';
import { LikesModule } from './modules/likes/likes.module';
import { CommentsModule } from './modules/comments/comments.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { PrismaModule } from './infrastructure/database/prisma.module';
import { StorageModule } from './infrastructure/storage/storage.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    StorageModule,
    AuthModule,
    UsersModule,
    DogsModule,
    PostsModule,
    TagsModule,
    LikesModule,
    CommentsModule,
    NotificationsModule,
    FeedbackModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
