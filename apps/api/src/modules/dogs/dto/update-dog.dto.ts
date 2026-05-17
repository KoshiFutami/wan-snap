import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateDogDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @IsOptional()
  @IsUUID()
  breedId?: string;

  @IsOptional()
  @IsInt()
  @Min(2000)
  @Max(2100)
  birthYear?: number;

  @IsOptional()
  @IsNumber()
  @Min(0.1)
  @Max(200)
  weightKg?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(200)
  neckCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(300)
  chestCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(200)
  backLengthCm?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  coatColors?: string[];

  @IsOptional()
  @IsUrl()
  photoUrl?: string | null;
}
