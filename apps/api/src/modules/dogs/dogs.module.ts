import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/database/prisma.module';
import { DogsController } from './dogs.controller';
import { BreedsController } from './breeds.controller';

@Module({
  imports: [PrismaModule],
  controllers: [DogsController, BreedsController],
})
export class DogsModule {}
