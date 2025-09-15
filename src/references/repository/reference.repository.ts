import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reference } from '../entities/reference.entity';
import { CreateReferenceDto } from '../dto/create-reference.dto';
import { Gallery } from '../../galleries/entities/gallery.entity';
import { Product } from '../../products/entities/product.entity';

@Injectable()
export class ReferenceRepository {
  constructor(
    @InjectRepository(Reference)
    private readonly referenceRepository: Repository<Reference>,
  ) {}

  async getOne(productId: string): Promise<any> {
    try {
      return await this.referenceRepository.find({
        where: {
          uuid: productId,
        },
        relations: {
          galleryReference: true,
          productReference: true,
        },
      });
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.NOT_FOUND);
    }
  }
  async listReference1(productId: string): Promise<any> {
    try {


      return await this.referenceRepository.find({
        where: {
          product: {
            platformId: productId,
          },
        },
        relations: {
          galleryReference: true,
          productReference: true,
        },
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(error?.message, HttpStatus.NOT_FOUND);
    }
  }
  async listReference(productId: string): Promise<any> {
    try {
      const result = await this.referenceRepository
        .createQueryBuilder('r')
        .select([
          'r.type AS referencia',
          'r.productId AS product_id',
          'g.gallery_url AS url',
          'r.type AS type',
          'g.duration AS duration',
          'g.description AS description',
          'g.name AS name',
        ])
        .leftJoin(Gallery, 'g', 'g.uuid = r.item_reference_id')
        .leftJoin(Reference, 'ref', 'ref.group_id = g.uuid')
        .leftJoin(Product, 'p', 'p.uuid = ref.item_reference_id')
        .leftJoin(Product, 'p1', 'p1.uuid = ref.productId')
        .where('r.type = :type', { type: 'audio' })
        .andWhere('p1.platform_id = :platformID', { platformID: productId })

        .addSelect(
          `json_agg(
        json_build_object(
          'name', p.name,
          'id', p.reference_platform_id,
          'img', p.uappi_url_image,
          'price', p.price,
           'img2', p.gallery_url,
            'description', p.description
        )
      ) FILTER (WHERE p.uuid IS NOT NULL)`, // Evita produtos nulos
          'produtos',
        )
        .groupBy(
          'r.type, g.gallery_url, g.duration, g.description, g.name, r.productId',
        )
        .getRawMany();
      return result;
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.NOT_FOUND);
    }
  }

  async addReference(createReferenceDto: CreateReferenceDto): Promise<any> {
    try {
      console.log(createReferenceDto);
      return await this.referenceRepository.save(createReferenceDto);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.NOT_FOUND);
    }
  }

  async removeItem(referenceUuid: string): Promise<any> {
    try {
      const reference = await this.referenceRepository.findOne({
        where: {
          uuid: referenceUuid,
        },
        relations: {
          galleryReference: true,
          productReference: true,
        },
      });
      return await this.referenceRepository.softRemove(reference);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.NOT_FOUND);
    }
  }
}
