import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

import { Role } from '../enum/role.enum';

export class CreateRoleDto {
  @IsString()
  @IsEnum(Role)
  @ApiProperty({ default: Role.ADMIN })
  readonly name: string;
}
