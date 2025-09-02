import { Module } from '@nestjs/common';
import { ReferencesService } from './references.service';
import { ReferencesController } from './references.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReferenceRepository } from './repository/reference.repository';
import { ReferenceInterfaceRepository } from './repository/reference.interface.repository';
import { Reference } from './entities/reference.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reference])],
  controllers: [ReferencesController],
  providers: [
    ReferenceRepository,
    ReferencesService,
    {
      provide: ReferenceInterfaceRepository,
      useExisting: ReferenceRepository,
    },
  ],
})
export class ReferencesModule {}
