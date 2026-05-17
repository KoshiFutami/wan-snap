import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Max,
  MaxLength,
  Min,
  ValidateIf,
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
  @IsInt()
  @Min(1)
  @Max(12)
  birthMonth?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(31)
  birthDay?: number;

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

  @IsOptional()
  @ValidateIf((o: UpdateDogDto) => o.gender !== null)
  @IsString()
  @IsIn(['male', 'female'])
  gender?: string | null;

  @IsOptional()
  @ValidateIf((o: UpdateDogDto) => o.bio !== null)
  @IsString()
  @MaxLength(500)
  bio?: string | null;
}
