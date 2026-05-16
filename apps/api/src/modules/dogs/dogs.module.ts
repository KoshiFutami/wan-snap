import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/database/prisma.module';
import { ProfileImageStorageService } from '../../infrastructure/storage/profile-image-storage.service';
import { DogsController } from './dogs.controller';
import { BreedsController } from './breeds.controller';
import { PublicDogsController } from './public-dogs.controller';

@Module({
  imports: [PrismaModule],
  controllers: [DogsController, BreedsController, PublicDogsController],
  providers: [ProfileImageStorageService],
})
export class DogsModule {}
