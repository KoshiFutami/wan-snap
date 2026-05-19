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
        breed: { select: { name: true, shortName: true } },
        gender: true,
        weightKg: true,
        chestCm: true,
        coatColors: true,
        photoUrl: true,
        bio: true,
        instagramUsername: true,
        birthYear: true,
        birthMonth: true,
        owner: { select: { displayName: true, instagramUsername: true } },
      },
    });
    if (!dog) return null;

    return {
      id: dog.id,
      name: dog.name,
      breed: dog.breed.name,
      breedShortName: dog.breed.shortName,
      gender: dog.gender,
      weightKg: dog.weightKg ? dog.weightKg.toNumber() : null,
      chestCm: dog.chestCm ? dog.chestCm.toNumber() : null,
      coatColors: Array.isArray(dog.coatColors)
        ? dog.coatColors.filter((c): c is string => typeof c === 'string')
        : [],
      photoUrl: dog.photoUrl,
      ownerDisplayName: dog.owner.displayName,
      ownerInstagramUsername: dog.owner.instagramUsername ?? null,
      bio: dog.bio ?? null,
      instagramUsername: dog.instagramUsername ?? null,
      birthYear: dog.birthYear ?? null,
      birthMonth: dog.birthMonth ?? null,
    };
  }
}
