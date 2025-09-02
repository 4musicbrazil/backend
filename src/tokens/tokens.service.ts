import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { Token } from './entities/token.entity';
import { TokenType } from './enum/token-type.dto';
import { TokenInterfaceRepository } from './repository/token.interface';

@Injectable()
export class TokensService {
  constructor(private tokenInterfaceRepository: TokenInterfaceRepository) {}

  create(accessToken: string, userUuid: string, type?: TokenType) {
    try {
      const expireIn = 120;
      const expireAt = new Date();
      expireAt.setSeconds(expireAt.getSeconds() + expireIn);
      const newToken = {
        expireAt: expireAt,
        expireIn: expireIn,
        userUuid: userUuid,
        token: accessToken,
        updatedAt: new Date(),
      };
      return this.tokenInterfaceRepository.createToken(newToken);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }

  async getByToken(accessToke: string): Promise<Token> {
    return await this.tokenInterfaceRepository.findOneByToken(accessToke);
  }

  async update(tokenUuid: string, token: string): Promise<Token> {
    try {
      const expireIn = 120;
      const expireAt = new Date();
      expireAt.setSeconds(expireAt.getSeconds() + expireIn);

      const tokenData: Partial<Token> = {
        expireAt: expireAt,
        expireIn: expireIn,
        token: token,
      };
      return await this.tokenInterfaceRepository.updateByTokenUuid(
        tokenUuid,
        tokenData,
      );
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }

  async removeByUserUuid(userUuid: string) {
    try {
      const token = await this.tokenInterfaceRepository.findOneByUserUuid(
        userUuid,
      );
      const tokenUuid = token.uuid;
      return await this.tokenInterfaceRepository.removeByTokenUuid(tokenUuid);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }

  async findByUserUuid(userUuid: string): Promise<Token> {
    try {
      return await this.tokenInterfaceRepository.findOneByUserUuid(userUuid);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }
}
