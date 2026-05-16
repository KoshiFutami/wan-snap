import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/database/prisma.module';
import { ProfileImageStorageService } from '../../infrastructure/storage/profile-image-storage.service';
import { DogsController } from './dogs.controller';
import { BreedsController } from './breeds.controller';

@Module({
  imports: [PrismaModule],
  controllers: [DogsController, BreedsController],
  providers: [ProfileImageStorageService],
})
export class DogsModule {}
