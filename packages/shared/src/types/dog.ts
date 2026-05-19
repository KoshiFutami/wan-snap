export type DogBreed = string;

export type CoatColor =
  | 'black'
  | 'white'
  | 'brown'
  | 'cream'
  | 'golden'
  | 'gray'
  | 'merle'
  | 'spotted'
  | 'other';

export interface DogProfile {
  id: string;
  name: string;
  breedId: string;
  breed: DogBreed;
  breedShortName: string;
  birthYear?: number;
  birthMonth?: number;
  birthDay?: number;
  weightKg?: number;
  neckCm?: number;
  chestCm?: number;
  backLengthCm?: number;
  gender?: 'male' | 'female' | null;
  bio?: string | null;
  instagramUsername?: string | null;
  coatColors: CoatColor[];
  photoUrl?: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}
