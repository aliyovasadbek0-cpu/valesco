import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty} from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  username: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  password: string;
}