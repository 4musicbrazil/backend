import { ApiProperty } from '@nestjs/swagger';

export class ForbiddenDto {
  @ApiProperty({ default: 403 })
  statusCode: number;

  @ApiProperty({ default: 'Message error' })
  message: string;
}
