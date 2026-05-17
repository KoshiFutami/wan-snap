import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreatePostItemDto {
  @IsString()
  @MaxLength(50)
  category: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  brand?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  productName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  size?: string;

  @IsOptional()
  @IsUrl()
  purchaseUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  priceJpy?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  fitNote?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  xPct?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  yPct?: number;
}

export class CreatePostDto {
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  imageUrl: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  imageWidth?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  imageHeight?: number;

  @IsString()
  dogId: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  caption?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(50, { each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePostItemDto)
  items?: CreatePostItemDto[];
}
