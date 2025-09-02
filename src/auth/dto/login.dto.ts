import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ required: true, default: 'jhoeDue@email.com' })
  readonly email: string;

  @MinLength(8, {
    message: 'Your password needs to contain at least 8 characters',
  })
  @MaxLength(16, {
    message: 'Your password needs to contain at most 16 characters',
  })
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true, default: 'jhoeDuePassword' })
  readonly password: string;
}
