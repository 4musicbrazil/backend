import { Gallery } from '../entities/gallery.entity';

export abstract class GalleryInterfaceRepository {
  abstract findOne(galleryUuid: string): Promise<any>;
  abstract create(gallery: Partial<Gallery>): Promise<any>;
  abstract findAll(
    type?: string,
    search?: string,
    skip?: number,
    take?: number,
  ): Promise<any>;
  abstract update(gallery: Partial<any>): Promise<any>;
  abstract remove(gallery: Gallery): Promise<any>;
}
