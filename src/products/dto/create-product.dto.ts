import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  galleryKey: string;

  galleryUrl: string;

  @ApiProperty({ required: false, default: 'file', type: 'file' })
  readonly file: Express.Multer.File;

  @ApiProperty({ required: false, default: 'SHD-5asdASDH-asd' })
  readonly platformId: string;

  @ApiProperty({ required: false, default: 'SHD-5asdASDH-asd' })
  readonly price: string;

  @ApiProperty({ required: false, default: 'SHD-5asdASDH-asd' })
  readonly referencePlatformId: string;

  @ApiProperty({ required: true, default: 'Nome do produto' })
  readonly name: string;

  @ApiProperty({ required: true, default: 'Descrição do produto' })
  readonly description: string;

  @ApiProperty({ required: true, default: 'SKU' })
  readonly sku: string;

  @ApiProperty({ required: true, default: 'category do produto' })
  readonly category: string;

  @ApiProperty({ required: true, default: true })
  readonly status: string;

  @ApiProperty({
    required: true,
    default: 'https://www.product.com.br/sku=123',
  })
  readonly url: string;

  @ApiProperty({
    required: true,
    default: 'https://www.product.com.br/sku=123',
  })
  readonly uappiUrlImage?: string;
}
