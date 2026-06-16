import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Gallery } from '../entities/gallery.entity';

@Injectable()
export class GalleryRepository {
  constructor(
    @InjectRepository(Gallery)
    private readonly galleryRepository: Repository<Gallery>,
  ) {}

  async findOne(galleryUuid: string): Promise<Gallery> {
    try {
      return this.galleryRepository.findOne({
        where: { uuid: galleryUuid },
      });
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.NOT_FOUND);
    }
  }

  async create(gallery: Partial<Gallery>): Promise<Gallery> {
    try {
      const newGallery = this.galleryRepository.create(gallery);
      return await this.galleryRepository.save(newGallery);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }

  async findAll(
    type?: string,
    search?: string,
    skip?: number,
    take?: number,
  ): Promise<any> {
    try {
      const typeFilter = type && type !== 'null' ? type : null;
      const searchFilter =
        search && search.trim() !== '' && search != 'null'
          ? search.trim()
          : null;
      const normalizedSkip = Number.isFinite(skip) && skip > 0 ? skip : 0;
      const normalizedTake =
        Number.isFinite(take) && take > 0 ? Math.min(take, 1000) : 100;

      const query = this.galleryRepository
        .createQueryBuilder('gallery')
        .select([
          'gallery.uuid',
          'gallery.name',
          'gallery.internalName',
          'gallery.duration',
          'gallery.description',
          'gallery.galleryKey',
          'gallery.galleryUrl',
          'gallery.type',
          'gallery.createdAt',
          'gallery.updatedAt',
        ])
        .orderBy('gallery.createdAt', 'DESC')
        .skip(normalizedSkip)
        .take(normalizedTake);

      if (typeFilter) {
        query.andWhere('gallery.type = :type', { type: typeFilter });
      }

      if (searchFilter) {
        query.andWhere(
          new Brackets((qb) => {
            qb.where('gallery.name ILIKE :search', {
              search: `%${searchFilter}%`,
            }).orWhere('gallery.internalName ILIKE :search', {
              search: `%${searchFilter}%`,
            });
          }),
        );
      }

      const galleries = await query.getMany();
      return { result: galleries, total: galleries.length };
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.NOT_FOUND);
    }
  }

  async update(gallery: Partial<Gallery>): Promise<Gallery> {
    try {
      const { uuid } = await this.galleryRepository.save(gallery);
      return await this.findOne(uuid);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }

  async remove(gallery: Gallery): Promise<Gallery> {
    try {
      return await this.galleryRepository.softRemove(gallery);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }
}
