import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from '../entities/token.entity';

@Injectable()
export class TokenRepository {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {}
  async findOneByUserUuid(userUuid: string): Promise<Token> {
    try {
      return await this.tokenRepository.findOne({
        where: {
          userUuid: userUuid,
        },
      });
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.NOT_FOUND);
    }
  }
  async findOneByTokenUuid(tokenUuid: string): Promise<Token> {
    try {
      return await this.tokenRepository.findOne({
        where: {
          uuid: tokenUuid,
        },
      });
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.NOT_FOUND);
    }
  }
  async createToken(token: Partial<Token>): Promise<Token> {
    try {
      const newToken = this.tokenRepository.create(token);
      const { uuid } = await this.tokenRepository.save(newToken);
      return await this.findOneByTokenUuid(uuid);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }
  async updateByTokenUuid(
    tokenUuid: string,
    token: Partial<Token>,
  ): Promise<Token> {
    try {
      await this.tokenRepository.update({ uuid: tokenUuid }, token);
      return await this.findOneByTokenUuid(tokenUuid);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }
  async removeByTokenUuid(tokenUuid: string): Promise<Token> {
    try {
      await this.tokenRepository.softDelete({ uuid: tokenUuid });
      return await this.findOneByTokenUuid(tokenUuid);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }
  async findOneByToken(token: string): Promise<Token> {
    try {
      return await this.tokenRepository.findOne({
        where: {
          token: token,
        },
      });
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.NOT_FOUND);
    }
  }
}
