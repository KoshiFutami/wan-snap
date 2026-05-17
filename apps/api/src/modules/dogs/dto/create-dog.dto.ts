import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateDogDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name: string;

  @IsUUID()
  breedId: string;

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
  @IsString()
  @IsIn(['male', 'female'])
  gender?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;
}
