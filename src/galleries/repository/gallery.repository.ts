import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
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
      const where: Array<object> = [];
      const typeFilter = type && type != null && type != 'null' ? type : null;
      const searchFilter =
        search && search.trim() !== '' && search != 'null'
          ? search.trim()
          : null;

      if (typeFilter && searchFilter) {
        where.push({ type: typeFilter, name: ILike(`%${searchFilter}%`) });
        where.push({
          type: typeFilter,
          internalName: ILike(`%${searchFilter}%`),
        });
      } else if (typeFilter) {
        where.push({ type: typeFilter });
      } else if (searchFilter) {
        where.push({ name: ILike(`%${searchFilter}%`) });
        where.push({ internalName: ILike(`%${searchFilter}%`) });
      }

      const [galleries, total] = await this.galleryRepository.findAndCount({
        where,
        skip: skip ?? 0,
        take: take ?? 0,
      });
      return { result: galleries, total: total };
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
