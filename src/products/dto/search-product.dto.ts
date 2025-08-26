import { IsOptional, IsString } from 'class-validator';

export class SearchProductsDto {
  @IsOptional()
  @IsString()
  title?: string;
}