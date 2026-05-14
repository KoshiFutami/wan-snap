import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/database/prisma.module';
import { DogsController } from './dogs.controller';

@Module({
  imports: [PrismaModule],
  controllers: [DogsController],
})
export class DogsModule {}
