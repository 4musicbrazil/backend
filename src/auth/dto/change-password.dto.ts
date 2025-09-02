import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @ApiProperty({ nullable: false, default: 'Password' })
  readonly password: string;
}
