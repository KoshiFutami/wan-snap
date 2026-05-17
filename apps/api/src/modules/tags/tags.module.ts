import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/database/prisma.module';
import { TagsController } from './tags.controller';

@Module({
  imports: [PrismaModule],
  controllers: [TagsController],
})
export class TagsModule {}
