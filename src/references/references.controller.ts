import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ReferencesService } from './references.service';
import { CreateReferenceDto } from './dto/create-reference.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Role } from '../auth/enum/role.enum';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';

@ApiTags('References')
@ApiBearerAuth()
@Controller('references')
export class ReferencesController {
  constructor(private readonly referencesService: ReferencesService) {}

  @Get('get-one/:referenceId')
  getOne(@Param('referenceId') referenceId: string) {
    return this.referencesService.getOne(referenceId);
  }

  @Get(':productId')
  listReference(@Param('productId') productId: string) {
    return this.referencesService.listReference(productId);
  }

  @Get('list/old-model/:productId')
  listReference1(@Param('productId') productId: string) {
    return this.referencesService.listReference1(productId);
  }

  @Post('add-reference')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  addReference(@Body() createReferenceDto: CreateReferenceDto) {
    return this.referencesService.addReference(createReferenceDto);
  }

  @Delete('remove-item/:referenceUuid')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  removeItem(@Param('referenceUuid') referenceUuid: string) {
    return this.referencesService.removeItem(referenceUuid);
  }
}
