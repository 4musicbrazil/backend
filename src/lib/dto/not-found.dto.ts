import { ApiProperty } from '@nestjs/swagger';

export class NotFoundDto {
  @ApiProperty({ default: 404 })
  statusCode: number;

  @ApiProperty({
    default: 'Não foi encontrado nenhum registro com o Id especificado',
  })
  message: string;
}
