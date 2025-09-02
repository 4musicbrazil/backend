import { Controller, Get, Headers, UseGuards } from '@nestjs/common';
import { ListUappiService } from './list-uappi.service';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from '../auth/enum/role.enum';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';

@ApiTags('List uappi')
@Controller('list-uappi')
export class ListUappiController {
  constructor(private readonly listUappiService: ListUappiService) {}

  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll(@Headers('Uappi-Token') uappiToken: string) {
    return this.listUappiService.findAll(uappiToken);
  }
}
