import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/database/prisma.module';
import { ProfileImageStorageService } from '../../infrastructure/storage/profile-image-storage.service';
import { UsersController } from './users.controller';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [ProfileImageStorageService],
})
export class UsersModule {}
