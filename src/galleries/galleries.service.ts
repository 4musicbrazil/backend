import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';

import { GalleryInterfaceRepository } from './repository/gallery.interface.repository';
import { StorageService } from '../lib/storage.service';

@Injectable()
export class GalleriesService {
  constructor(
    private readonly galleryInterfaceRepository: GalleryInterfaceRepository,
    private readonly storageService: StorageService,
  ) {}
  async create(
    file: Express.Multer.File,
    createGalleryDto: CreateGalleryDto,
  ): Promise<any> {
    try {
      let uploadFile: any = null;

      if (
        createGalleryDto.type == 'video' ||
        createGalleryDto.type == 'audio'
      ) {
        uploadFile = await this.storageService.uploadFile(file);
      }
      if (createGalleryDto.type == 'image') {
        uploadFile = await this.storageService.uploadFile(file);
      }

      const galeryData = {
        ...createGalleryDto,
        galleryUrl: uploadFile?.cdnUrl ?? null,
        galleryKey: uploadFile?.key ?? null,
      };
      return await this.galleryInterfaceRepository.create(galeryData);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONTINUE);
    }
  }

  async findAll(
    type: string,
    search: string,
    skip?: number,
    take?: number,
  ): Promise<any> {
    try {
      return await this.galleryInterfaceRepository.findAll(
        type,
        search,
        skip,
        take,
      );
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONTINUE);
    }
  }

  async findOne(galleriesUuid: string): Promise<any> {
    try {
      return await this.galleryInterfaceRepository.findOne(galleriesUuid);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONTINUE);
    }
  }

  async update(
    galleriesUuid: string,
    file: Express.Multer.File,
    updateGalleryDto: UpdateGalleryDto,
  ): Promise<any> {
    const { name, description } = updateGalleryDto;
    try {
      const gallery = await this.galleryInterfaceRepository.findOne(
        galleriesUuid,
      );

      if (!gallery) {
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }

      if (file?.buffer && file?.originalname) {
        const uploadFile = await this.storageService.uploadFile(file);
        // await this.cloudinaryVideoService.callUploadFile(file);
        gallery.galleryUrl = uploadFile?.cdnUrl ?? null;
        gallery.galleryKey = uploadFile?.key ?? null;
      }

      if (name) {
        gallery.name = name;
      }

      if (description) {
        gallery.description = description;
      }

      return await this.galleryInterfaceRepository.update(gallery);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONTINUE);
    }
  }
  async remove(galleriesUuid: string): Promise<any> {
    try {
      const gallery = await this.galleryInterfaceRepository.findOne(
        galleriesUuid,
      );

      if (!gallery) {
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }
      await this.storageService.deleteFile(gallery.galleryKey);
      return await this.galleryInterfaceRepository.remove(gallery);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONTINUE);
    }
  }
}
