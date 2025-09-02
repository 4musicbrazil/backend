import { ApiProperty } from '@nestjs/swagger';

export class CreateGalleryDto {
  @ApiProperty({ required: false, default: 'file', type: 'file' })
  readonly file: Express.Multer.File;

  readonly galleryKey: string;

  @ApiProperty({ required: false, default: 'video' })
  readonly type: string;

  readonly galleryUrl: string;

  @ApiProperty({ required: false, default: 'Nome' })
  readonly name: string;

  @ApiProperty({ required: false, default: '0:14' })
  readonly duration: string;

  @ApiProperty({ required: false, default: '0:14' })
  readonly description: string;
}
