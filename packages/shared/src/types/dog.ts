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
  breed: DogBreed;
  breedShortName: string;
  birthYear?: number;
  weightKg?: number;
  neckCm?: number;
  chestCm?: number;
  backLengthCm?: number;
  coatColor: CoatColor;
  coatColors: CoatColor[];
  photoUrl?: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}
