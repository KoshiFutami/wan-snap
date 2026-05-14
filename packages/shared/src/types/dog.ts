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
  birthYear?: number;
  weightKg?: number;
  neckCm?: number;
  chestCm?: number;
  backLengthCm?: number;
  coatColor: CoatColor;
  coatColors: CoatColor[];
  photoUrl?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}
