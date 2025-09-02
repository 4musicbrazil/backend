import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CloudinaryModule } from '../lib/cloudinary/cloudinary.module';
import { User } from './entities/user.entity';
import { UserRepository } from './repository/user.repository';
import { UserInterfaceRepository } from './repository/user.interface.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CloudinaryModule, RoleModule],
  controllers: [UsersController],
  providers: [
    UserRepository,
    UsersService,
    {
      provide: UserInterfaceRepository,
      useExisting: UserRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
