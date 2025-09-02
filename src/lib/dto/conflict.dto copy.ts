import { ApiProperty } from '@nestjs/swagger';

export class ConflictDto {
  @ApiProperty({ default: 409 })
  statusCode: number;

  @ApiProperty({ default: 'Error information' })
  message: string;
}
