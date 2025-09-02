import { Module } from '@nestjs/common';
import { GalleriesService } from './galleries.service';
import { GalleriesController } from './galleries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from '../lib/cloudinary/cloudinary.module';
import { Gallery } from './entities/gallery.entity';
import { GalleryInterfaceRepository } from './repository/gallery.interface.repository';
import { GalleryRepository } from './repository/gallery.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Gallery]), CloudinaryModule],
  controllers: [GalleriesController],
  providers: [
    GalleriesService,
    GalleryRepository,
    {
      provide: GalleryInterfaceRepository,
      useExisting: GalleryRepository,
    },
  ],
})
export class GalleriesModule {}
