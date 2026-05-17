export type PublicDogProfile = {
  id: string;
  name: string;
  breed: string;
  breedShortName: string;
  weightKg: number | null;
  photoUrl: string | null;
  ownerDisplayName: string;
};

export const PUBLIC_DOG_REPOSITORY = Symbol('PUBLIC_DOG_REPOSITORY');

export interface IPublicDogRepository {
  findById(id: string): Promise<PublicDogProfile | null>;
}
