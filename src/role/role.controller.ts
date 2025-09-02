import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { BadRequestDto } from '../lib/dto/bad-request.dto';
import { ConflictDto } from '../lib/dto/conflict.dto copy';
import { ForbiddenDto } from '../lib/dto/forbidden.dto';
import { NotFoundDto } from '../lib/dto/not-found.dto';
import { UnauthorizedDto } from '../lib/dto/unauthorized.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role as RoleEntity } from './entities/role.entity';
import { RoleService } from './role.service';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from './enum/role.enum';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@ApiTags('Roles')
@ApiBearerAuth()
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiOkResponse({
    type: RoleEntity,
  })
  @ApiForbiddenResponse({
    type: ForbiddenDto,
  })
  @ApiBadRequestResponse({
    type: BadRequestDto,
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedDto,
  })
  @ApiNotFoundResponse({
    type: NotFoundDto,
  })
  @ApiConflictResponse({
    type: ConflictDto,
  })
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @ApiOkResponse({
    type: [RoleEntity],
  })
  @ApiForbiddenResponse({
    type: ForbiddenDto,
  })
  @ApiBadRequestResponse({
    type: BadRequestDto,
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedDto,
  })
  @ApiNotFoundResponse({
    type: NotFoundDto,
  })
  @ApiConflictResponse({
    type: ConflictDto,
  })
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':roleId')
  @ApiOkResponse({
    type: RoleEntity,
  })
  @ApiForbiddenResponse({
    type: ForbiddenDto,
  })
  @ApiBadRequestResponse({
    type: BadRequestDto,
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedDto,
  })
  @ApiNotFoundResponse({
    type: NotFoundDto,
  })
  @ApiConflictResponse({
    type: ConflictDto,
  })
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findOne(@Param('roleId') roleId: string) {
    return this.roleService.findOne(roleId);
  }

  @Delete(':roleId')
  @ApiOkResponse({
    type: RoleEntity,
  })
  @ApiForbiddenResponse({
    type: ForbiddenDto,
  })
  @ApiBadRequestResponse({
    type: BadRequestDto,
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedDto,
  })
  @ApiNotFoundResponse({
    type: NotFoundDto,
  })
  @ApiConflictResponse({
    type: ConflictDto,
  })
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('roleId') roleId: string) {
    return this.roleService.remove(roleId);
  }
}
