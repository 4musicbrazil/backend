import { Module } from '@nestjs/common';
import { GalleriesService } from './galleries.service';
import { GalleriesController } from './galleries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Gallery } from './entities/gallery.entity';
import { GalleryInterfaceRepository } from './repository/gallery.interface.repository';
import { GalleryRepository } from './repository/gallery.repository';
import { StorageService } from '../lib/storage.service';

@Module({
  imports: [TypeOrmModule.forFeature([Gallery])],
  controllers: [GalleriesController],
  providers: [
    GalleriesService,
    GalleryRepository,
    StorageService,
    {
      provide: GalleryInterfaceRepository,
      useExisting: GalleryRepository,
    },
  ],
})
export class GalleriesModule {}
