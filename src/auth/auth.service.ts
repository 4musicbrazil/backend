import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { TokensService } from '../tokens/tokens.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { EncryptService } from './encrypt.service';
import { IntegrationService } from '../integrations/stores/integration.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly integrationService: IntegrationService,
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
    private readonly encryptService: EncryptService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findOneByEmail(email, true);

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const match = await this.encryptService.matchData(
        password,
        user?.password,
      );

      if (!match) {
        throw new HttpException('Invalid credentiais', HttpStatus.UNAUTHORIZED);
      }

      const userUuid = await this.encryptService.encrypt(user?.uuid.toString());
      const userEmail = await this.encryptService.encrypt(user.email);

      delete user.password;
      return {
        key0: userUuid,
        key1: userEmail,
        match: match,
        user: user,
      };
    } catch (error) {
      throw new HttpException(
        error?.message ?? error?.response ?? '',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async login(login: LoginDto): Promise<any> {
    try {
      const validateUser = await this.validateUser(
        login?.email,
        login?.password,
      );

      if (!validateUser.match) {
        throw new HttpException('Invalid credentiais', HttpStatus.UNAUTHORIZED);
      }

      validateUser.match = await this.encryptService.encryptBcrypt(
        validateUser.match.toString(),
      );
      const data = {
        key0: validateUser.key0,
        key1: validateUser.key1,
        match: validateUser.match,
      };

      const userUuid = validateUser?.user?.uuid;
      const token = await this.tokensService.findByUserUuid(userUuid);
      const accessToken = this.jwtService.sign(data);
      const uappiToken = await this.integrationService.getToken();
      if (!token) {
        this.tokensService.create(accessToken, userUuid);
      } else {
        const tokenUuid = token?.uuid;
        this.tokensService.update(tokenUuid, accessToken);
      }
      return {
        user: validateUser.user,
        access_token: accessToken,
        uappi_token: uappiToken?.token,
        return: true,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async uappiRefresh(): Promise<any> {
    try {
      const uappiToken = await this.integrationService.getToken();
      return { uappi_token: uappiToken?.token };
    } catch (error) {
      console.log(error);
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
