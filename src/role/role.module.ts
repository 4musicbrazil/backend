import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Role } from './entities/role.entity';
import { RoleInterfaceRepository } from './repository/role.interface.repository';
import { RoleRepository } from './repository/role.repository';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RoleController],
  providers: [
    RoleService,
    RoleRepository,
    {
      provide: RoleInterfaceRepository,
      useExisting: RoleRepository,
    },
  ],
  exports: [RoleService],
})
export class RoleModule {}
