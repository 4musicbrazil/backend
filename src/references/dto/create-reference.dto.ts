import { ApiProperty } from '@nestjs/swagger';

export class CreateReferenceDto {
  @ApiProperty({
    required: true,
    default: 'c0e1f218-4e0f-4c6d-a223-fa30661ff891',
  })
  readonly productId: string;

  @ApiProperty({
    required: true,
    default: 'c0e1f218-4e0f-4c6d-a223-fa30661ff891',
  })
  readonly groupId: string;

  @ApiProperty({
    required: true,
    default: 'c0e1f218-4e0f-4c6d-a223-fa30661ff891',
  })
  readonly itemReferenceId: string;

  @ApiProperty({
    required: true,
    default: 'product',
  })
  readonly type: string;
}
