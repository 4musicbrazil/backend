import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgetPasswordDto {
  @IsEmail()
  @ApiProperty({ nullable: false, default: 'JhoeDue@example.com' })
  readonly email: string;
}
