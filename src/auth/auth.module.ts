import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { SendgridService } from '../lib/sendgrid/sendgrid.service';
import { TokensModule } from '../tokens/tokens.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EncryptService } from './encrypt.service';
import { ForgetService } from './forget.service';
import { RefreshTokenService } from './refresh-token.service';
import { jwtConstants } from './strategy/constants';
import { JwtStrategy } from './strategy/jwt.strategy';
import { IntegrationsModule } from '../integrations/integrations.module';

@Module({
  imports: [
    IntegrationsModule,
    PassportModule,
    UsersModule,
    TokensModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60000s' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    SendgridService,
    EncryptService,
    ForgetService,
    RefreshTokenService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
