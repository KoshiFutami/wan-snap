import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import type {
  IPublicDogRepository,
  PublicDogProfile,
} from '../../domain/repositories/public-dog.repository';

@Injectable()
export class PrismaPublicDogRepository implements IPublicDogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<PublicDogProfile | null> {
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
    if (!dog) return null;
    const breed = await this.prisma.breed.findUnique({
      where: { name: dog.breed },
      select: { shortName: true },
    });

    return {
      id: dog.id,
      name: dog.name,
      breed: dog.breed,
      breedShortName: breed?.shortName ?? dog.breed,
      weightKg: dog.weightKg ? dog.weightKg.toNumber() : null,
      photoUrl: dog.photoUrl,
      ownerDisplayName: dog.owner.displayName,
    };
  }
}
