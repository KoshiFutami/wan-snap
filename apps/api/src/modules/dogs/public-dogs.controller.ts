import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@Controller('dogs/public')
export class PublicDogsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const dog = await this.prisma.dog.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        breed: true,
        weightKg: true,
        photoUrl: true,
        owner: { select: { displayName: true } },
      },
    });
    if (!dog) throw new NotFoundException('犬プロフィールが見つかりません');

    return {
      id: dog.id,
      name: dog.name,
      breed: dog.breed,
      weightKg: dog.weightKg,
      photoUrl: dog.photoUrl,
      ownerDisplayName: dog.owner.displayName,
    };
  }
}
