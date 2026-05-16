import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/database/prisma.module';
import { ProfileImageStorageService } from '../../infrastructure/storage/profile-image-storage.service';
import { DogsController } from './dogs.controller';
import { BreedsController } from './breeds.controller';
import { PublicDogsController } from './public-dogs.controller';
import { GetPublicDogUseCase } from './application/use-cases/get-public-dog.use-case';

@Module({
  imports: [PrismaModule],
  controllers: [DogsController, BreedsController, PublicDogsController],
  providers: [ProfileImageStorageService, GetPublicDogUseCase],
})
export class DogsModule {}
