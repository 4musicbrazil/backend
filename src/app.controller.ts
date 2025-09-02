import { Controller, Get, Post, Render, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiExcludeController } from '@nestjs/swagger';

import { AppService } from './app.service';
import { Roles } from './auth/decorator/roles.decorator';
import { Role } from './auth/enum/role.enum';

@ApiExcludeController()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  homePage() {
    return {
      API_NAME: process.env.API_NAME,
      API_VERSION: process.env.API_VERSION,
      API_YEAR: process.env.API_YEAR,
      ENVIRONMENT: process.env.ENVIRONMENT,
    };
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'))
  exempleRoutWithGuard() {
    console.log('This route is only a example how use Guards');
  }
}
