import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UsersService } from '../../users/users.service';
import { EncryptService } from '../encrypt.service';
import { PayloadValidateInterface } from '../interface/payload-validate.interface';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly encryptService: EncryptService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: PayloadValidateInterface) {
    try {
      const { key0, key1 } = payload;
      const [userUuid, userEmail] = await Promise.all([
        this.encryptService.decrypt(key0),
        this.encryptService.decrypt(key1),
      ]);

      const user = await this.usersService.findOneByUuidAndEmail(
        userUuid,
        userEmail,
      );
      if (!user) {
        throw new HttpException('User not exist', HttpStatus.FORBIDDEN);
      }

      return user;
    } catch (error) {
      throw new HttpException(
        error?.message ?? '',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
