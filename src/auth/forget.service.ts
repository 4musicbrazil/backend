import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailDataRequired } from '@sendgrid/mail';
import * as bcrypt from 'bcrypt';
import handlebars from 'handlebars';
import { join } from 'path';

import { SendgridService } from '../lib/sendgrid/sendgrid.service';
import { TokensService } from '../tokens/tokens.service';
import { UsersService } from '../users/users.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgetPasswordDto } from './dto/forgot-password.dto';
import { EncryptService } from './encrypt.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
@Injectable()
export class ForgetService {
  private readonly SALT_OR_ROUNDS = +process.env.SALT_OR_ROUNDS;

  constructor(
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
    private jwtService: JwtService,
    private sendgridService: SendgridService,
    private readonly encryptService: EncryptService,
  ) {}

  async forgetPassword(forgetPassword: ForgetPasswordDto) {
    try {
      const user = await this.usersService.findOneByEmail(
        forgetPassword?.email,
        true,
      );

      if (!user) {
        throw new HttpException('Invalid email', HttpStatus.BAD_REQUEST);
      }

      const userUuid = await this.encryptService.encrypt(user?.uuid);
      const userEmail = await this.encryptService.encrypt(user.email);

      const match = await bcrypt.hash('true', this.SALT_OR_ROUNDS);
      const payload = {
        key0: userUuid,
        key1: userEmail,
        match: match,
      };

      const token = await this.tokensService.findByUserUuid(user.uuid);
      const accessToken = this.jwtService.sign(payload);

      if (!token) {
        this.tokensService.create(accessToken, user.uuid);
      } else {
        this.tokensService.update(token.uuid, accessToken);
      }

      const source = fs.readFileSync(
        join(__dirname, '..', '..', 'views/forget-password.hbs'),
        'utf8',
      );

      const template = handlebars.compile(source);

      const forgetLink = `${process.env.FORGET_URL_FRONT}?token=${accessToken}`;
      const context = {
        forgetLink: forgetLink,
      };

      const html = template(context);
      const mailData: MailDataRequired = {
        to: user.email,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: 'Fergot Password',
        html: html,
      };

      await this.sendgridService.send(mailData);
      return true;
    } catch (error) {
      throw new HttpException(
        error?.message ?? error,
        error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async changePassword(
    userUuid: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<boolean> {
    try {
      await this.usersService.update(userUuid, {
        password: changePasswordDto.password,
      });
      await this.tokensService.removeByUserUuid(userUuid);
      return true;
    } catch (error) {
      throw new HttpException(
        error?.message ?? error,
        error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
