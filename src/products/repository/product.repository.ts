import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findOne(productUuid: string): Promise<Product> {
    try {
      return this.productRepository.findOne({
        where: { uuid: productUuid },
      });
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.NOT_FOUND);
    }
  }

  async findOneByPlatformId(platformId: string): Promise<Product> {
    try {
      return this.productRepository.findOne({
        where: { platformId: platformId },
        relations: {
          reference: {
            galleryReference: true,
            productReference: true,
          },
        },
      });
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.NOT_FOUND);
    }
  }

  async create(product: Partial<Product>): Promise<Product> {
    try {
      const newProduct = this.productRepository.create(product);
      return await this.productRepository.save(newProduct);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      return await this.productRepository.find({});
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.NOT_FOUND);
    }
  }

  async update(product: Partial<Product>): Promise<Product> {
    try {
      const { uuid } = await this.productRepository.save(product);
      return await this.findOne(uuid);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }

  async remove(productUuid: string): Promise<Product> {
    try {
      await this.productRepository.softDelete({ uuid: productUuid });
      return await this.productRepository.findOne({
        where: {
          uuid: productUuid,
        },
        withDeleted: true,
      });
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }
}
