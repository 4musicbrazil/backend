import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { TokensService } from '../tokens/tokens.service';
import { UsersService } from '../users/users.service';
import { EncryptService } from './encrypt.service';

@Injectable()
export class RefreshTokenService {
  private readonly SALT_OR_ROUNDS = +process.env.SALT_OR_ROUNDS;

  constructor(
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
    private readonly encryptService: EncryptService,
    private jwtService: JwtService,
  ) {}

  async sanitizeToken(authorization: string) {
    try {
      const accessToken = authorization.replace('Bearer ', '');

      const newAccessToken = await this.refreshToken(accessToken);

      return {
        message: 'Generate new token with success',
        accessToken: newAccessToken,
        status: 200,
      };
    } catch {
      throw new HttpException('Unauthorized1', HttpStatus.UNAUTHORIZED);
    }
  }

  async refreshToken(accessToken: string) {
    const accessTokenData = await this.tokensService.getByToken(accessToken);

    if (!accessTokenData) {
      throw new HttpException('Unauthorized2', HttpStatus.UNAUTHORIZED);
    }

    if (accessTokenData.token !== accessToken) {
      throw new HttpException('Unauthorized3', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.usersService.findOne(accessTokenData.userUuid);

    if (!user) {
      throw new HttpException('Unauthorized4', HttpStatus.UNAUTHORIZED);
    }
    const userUuid = await this.encryptService.encrypt(user?.uuid);
    const userEmail = await this.encryptService.encrypt(user.email);

    const match = await bcrypt.hash('true', this.SALT_OR_ROUNDS);
    const payload = {
      key0: userUuid,
      key1: userEmail,
      match: match,
    };

    const newAccessToken = this.jwtService.sign(payload);

    const tokenUuid = accessTokenData?.uuid;

    this.tokensService.update(tokenUuid, newAccessToken);

    return newAccessToken;
  }
}
