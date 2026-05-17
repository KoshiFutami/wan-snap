import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CreateBreedDto } from './dto/create-breed.dto';

@Controller('breeds')
export class BreedsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  search(@Query('q') q?: string) {
    return this.prisma.breed.findMany({
      where: q ? { name: { contains: q } } : {},
      orderBy: { name: 'asc' },
      take: 20,
      select: { id: true, name: true, shortName: true },
    });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateBreedDto) {
    const name = dto.name.trim();

    return this.prisma.breed.upsert({
      where: { name },
      update: {},
      create: { name, shortName: name },
      select: { id: true, name: true, shortName: true },
    });
  }
}
