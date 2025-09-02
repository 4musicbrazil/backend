import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './entities/token.entity';
import { TokenInterfaceRepository } from './repository/token.interface';
import { TokenRepository } from './repository/token.repository';
import { TokensService } from './tokens.service';

@Module({
  imports: [TypeOrmModule.forFeature([Token])],
  providers: [
    TokenRepository,
    TokensService,
    {
      provide: TokenInterfaceRepository,
      useExisting: TokenRepository,
    },
  ],
  exports: [TokensService],
})
export class TokensModule {}
