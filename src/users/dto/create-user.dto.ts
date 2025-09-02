import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({ required: true, default: 'jhoeDue@email.com' })
  readonly email: string;

  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty({ required: true, default: 'Jhoe due' })
  readonly fullName: string;

  readonly roleUuid: string;

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
