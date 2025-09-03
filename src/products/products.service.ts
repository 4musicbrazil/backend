import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductInterfaceRepository } from './repository/product.interface.repository';
import { IntegrationService } from '../integrations/stores/integration.service';

import { StorageService } from '../lib/storage.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productInterfaceRepository: ProductInterfaceRepository,
    private readonly storageService: StorageService,
    private readonly integrationService: IntegrationService,
  ) {}
  async create(
    createProductDto: Partial<CreateProductDto>,
    file?: Express.Multer.File,
  ): Promise<any> {
    try {
      if (file?.buffer && file?.originalname) {
        const uploadFile = await this.storageService.uploadFile(file);
        createProductDto.galleryUrl = uploadFile?.cdnUrl ?? null;
        createProductDto.galleryKey = uploadFile?.key ?? null;
      }
      return await this.productInterfaceRepository.create(createProductDto);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }

  async findAll(): Promise<any> {
    try {
      return await this.productInterfaceRepository.findAll();
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }

  async findOneByPlatformId(
    platformId: string,
    uappiToken: string,
  ): Promise<any> {
    try {
      const result = await this.productInterfaceRepository.findOneByPlatformId(
        platformId,
      );
      const uappiResult = await this.integrationService.findOne(
        platformId,
        uappiToken,
      );

      if (!result) {
        if (!uappiResult) {
          throw new HttpException('error', 404);
        }
        const newProduct: Partial<CreateProductDto> = {
          platformId: uappiResult?.id,
          name: uappiResult?.nome,
          description: uappiResult?.descricao,
          sku: uappiResult?.sku,
          status: uappiResult?.ativo ? 'ACTIVE' : 'INACTIVE',
          url: uappiResult?.url,
          uappiUrlImage: uappiResult?.midias?.imagens[0]?.url ?? '',
        };
        await this.create(newProduct, null);
        return uappiResult;
      }

      return { ...result, ...uappiResult };
    } catch (error) {
      console.log(error);
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }

  async findOne(productUuid: string): Promise<any> {
    try {
      return await this.productInterfaceRepository.findOne(productUuid);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }

  async update(
    productUuid: string,
    updateProductDto: UpdateProductDto,
  ): Promise<any> {
    const { description, name, platformId, status, url } = updateProductDto;
    try {
      const product = await this.findOne(productUuid);
      if (!product) {
        throw new HttpException('error?.message', HttpStatus.CONFLICT);
      }
      if (description) {
        product.description = description;
      }

      if (name) {
        product.name = name;
      }
      if (platformId) {
        product.platformId = platformId;
      }
      if (status) {
        product.platformId = platformId;
      }
      if (url) {
        product.url = url;
      }
      product.update = new Date();
      return await this.productInterfaceRepository.update(product);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }

  async remove(productUuid: string): Promise<any> {
    try {
      const product = await this.findOne(productUuid);
      if (!product) {
        throw new HttpException('error?.message', HttpStatus.CONFLICT);
      }
      return await this.productInterfaceRepository.remove(productUuid);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }
}
