import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@Controller('breeds')
export class BreedsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  search(@Query('q') q?: string) {
    return this.prisma.breed.findMany({
      where: q ? { name: { contains: q } } : {},
      orderBy: { name: 'asc' },
      take: 20,
      select: { id: true, name: true },
    });
  }
}
