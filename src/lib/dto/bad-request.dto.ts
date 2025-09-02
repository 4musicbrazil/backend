import { ApiProperty } from '@nestjs/swagger';

export class BadRequestDto {
  @ApiProperty({ default: 400 })
  statusCode: number;

  @ApiProperty({ default: ['the field ${name} must be an ${this type}'] })
  message: string[];

  @ApiProperty({ default: 'Bad Request' })
  error: string;
}
