import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';

export type PublicDog = {
  id: string;
  name: string;
  breed: string;
  weightKg: number | null;
  photoUrl: string | null;
  ownerDisplayName: string;
};

@Injectable()
export class GetPublicDogUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string): Promise<PublicDog | null> {
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

    return {
      id: dog.id,
      name: dog.name,
      breed: dog.breed,
      weightKg: dog.weightKg ? dog.weightKg.toNumber() : null,
      photoUrl: dog.photoUrl,
      ownerDisplayName: dog.owner.displayName,
    };
  }
}
