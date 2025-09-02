import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class EncryptService {
  private readonly SALT_OR_ROUNDS = +process.env.SALT_OR_ROUNDS;
  private readonly SALT_PASSWORD = process.env.SECRET_PASSWORD;
  private readonly ALGORITHM = process.env.ALGORITHM;
  private readonly ITERATIONS = +process.env.ITERATIONS;
  private readonly KEY_LENGTH = +process.env.KEY_LENGTH;
  private readonly SALT_PASSWORD_2 = process.env.SALT_PASSWORD_2;
  private readonly TYPE = process.env.TYPE;

  async encrypt(text: string): Promise<string> {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.ALGORITHM, this.getKey(), iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  }

  async decrypt(text: string): Promise<string> {
    const [ivHex, encryptedHex] = text.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');
    const decipher = crypto.createDecipheriv(this.ALGORITHM, this.getKey(), iv);
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);
    return decrypted.toString();
  }

  async matchData(data: string, compare: string): Promise<any> {
    return await bcrypt.compare(data, compare);
  }

  async encryptBcrypt(data: string): Promise<any> {
    return await bcrypt.hash(data, this.SALT_OR_ROUNDS);
  }

  private getKey(): Buffer {
    return crypto.pbkdf2Sync(
      this.SALT_PASSWORD_2,
      this.SALT_PASSWORD,
      this.ITERATIONS,
      this.KEY_LENGTH,
      this.TYPE,
    );
  }
}
