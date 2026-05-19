export type PublicDogProfile = {
  id: string;
  name: string;
  breed: string;
  breedShortName: string;
  gender: string | null;
  weightKg: number | null;
  chestCm: number | null;
  coatColors: string[];
  photoUrl: string | null;
  ownerDisplayName: string;
  ownerInstagramUsername: string | null;
  bio: string | null;
  instagramUsername: string | null;
  birthYear: number | null;
  birthMonth: number | null;
};

export const PUBLIC_DOG_REPOSITORY = Symbol('PUBLIC_DOG_REPOSITORY');

export interface IPublicDogRepository {
  findById(id: string): Promise<PublicDogProfile | null>;
}
