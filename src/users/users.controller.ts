import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/auth/enum/role.enum';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';

import { Roles } from '../auth/decorator/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll(
    @Query('search') search: string,
    @Query('orderBy') orderBy: string,
    @Query('skip') skip: string,
    @Query('take') take: string,
  ) {
    return this.usersService.findAll(search, orderBy, skip, take);
  }

  @Get(':userUuid')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findOne(@Param('userUuid') userUuid: string) {
    return this.usersService.findOne(userUuid);
  }

  @Patch(':userUuid')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(
    @Param('userUuid') userUuid: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(userUuid, updateUserDto);
  }

  @Delete(':userUuid')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('userUuid') userUuid: string) {
    return this.usersService.remove(userUuid);
  }
}
