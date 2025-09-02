import { Token } from '../entities/token.entity';

export abstract class TokenInterfaceRepository {
  abstract findOneByUserUuid(userUuid: string): Promise<Token>;
  abstract findOneByTokenUuid(tokenUuid: string): Promise<Token>;
  abstract createToken(token: Partial<Token>): Promise<Token>;
  abstract updateByTokenUuid(
    tokenUuid: string,
    token: Partial<Token>,
  ): Promise<Token>;
  abstract removeByTokenUuid(tokenUuid: string): Promise<Token>;
  abstract findOneByToken(token: string): Promise<Token>;
}
