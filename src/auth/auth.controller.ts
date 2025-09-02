import {
  Body,
  Controller,
  Get,
  Headers,
  Patch,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgetPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { ForgetService } from './forget.service';
import { RefreshTokenService } from './refresh-token.service';

@ApiTags('Authentication')
@ApiBearerAuth()
@Controller('authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly forgetService: ForgetService,
  ) {}

  @Post('/simple-login')
  @ApiOperation({ summary: 'Traditional login using email and password' })
  normalAuth(@Body() userData: LoginDto) {
    return this.authService.login(userData);
  }

  @Get('refresh-token-uappi')
  refreshToken() {
    return this.authService.uappiRefresh();
  }
}
