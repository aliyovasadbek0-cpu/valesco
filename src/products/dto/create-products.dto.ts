import { IsString, IsOptional, IsArray, IsNumber, ValidateNested, IsNotEmpty } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { toStringArray, toPackingArray } from 'src/common/utils/parser.util';

export class PackingDto {
  @IsString()
  @IsNotEmpty()
  volume: string;

  @IsString()
  @IsNotEmpty()
  article: string;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description_ru?: string;

  @IsOptional()
  @IsString()
  description_en?: string;

  @IsOptional()
  @Transform(({ value }) => toStringArray(value))
  @IsArray()
  specifications?: string[];

  @IsOptional()
  @Transform(({ value }) => toStringArray(value))
  @IsArray()
  image?: string[];

  @IsOptional()
  @Transform(({ value }) => toStringArray(value))
  @IsArray()
  sae?: string[];

  @IsOptional()
  @Transform(({ value }) => toStringArray(value))
  @IsArray()
  density?: string[];

  @IsOptional()
  @Transform(({ value }) => toStringArray(value))
  @IsArray()
  kinematic_one?: string[];

  @IsOptional()
  @Transform(({ value }) => toStringArray(value))
  @IsArray()
  kinematic_two?: string[];

  @IsOptional()
  @Transform(({ value }) => toStringArray(value))
  @IsArray()
  viscosity?: string[];

  @IsOptional()
  @Transform(({ value }) => toStringArray(value))
  @IsArray()
  flash?: string[];

  @IsOptional()
  @Transform(({ value }) => toStringArray(value))
  @IsArray()
  temperature?: string[];

  @IsOptional()
  @Transform(({ value }) => toStringArray(value))
  @IsArray()
  base?: string[];

  @IsOptional()
  @Transform(({ value }) => toStringArray(value))
  @IsArray()
  info?: string[];

  @IsOptional()
  @Transform(({ value }) => toPackingArray(value))
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PackingDto)
  packing?: PackingDto[];

  @Transform(({ value }) => (typeof value === 'string' ? parseInt(value, 10) : value))
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;
}