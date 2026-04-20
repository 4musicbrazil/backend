import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductInterfaceRepository } from './repository/product.interface.repository';

import { StorageService } from '../lib/storage.service';
import { CatalogService } from '../catalog/catalog.service';
import { CatalogProduct } from '../catalog/interfaces/catalog-product.interface';
import { CatalogProviderType } from '../catalog/enums/catalog-provider.enum';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productInterfaceRepository: ProductInterfaceRepository,
    private readonly storageService: StorageService,
    private readonly catalogService: CatalogService,
  ) {}

  private buildCatalogProductPayload(
    provider: string,
    catalogProduct: CatalogProduct,
  ): Partial<CreateProductDto> {
    return {
      provider,
      platformId: catalogProduct.externalId,
      referencePlatformId: catalogProduct.externalId,
      name: catalogProduct.name,
      description: catalogProduct.description,
      sku: catalogProduct.sku,
      status: catalogProduct.status,
      url: catalogProduct.productUrl,
      price: catalogProduct.price,
      externalImageUrl: catalogProduct.imageUrl,
      uappiUrlImage:
        provider === CatalogProviderType.UAPPI ? catalogProduct.imageUrl : '',
    };
  }

  async create(
    createProductDto: Partial<CreateProductDto>,
    file?: Express.Multer.File,
  ): Promise<any> {
    try {
      const productPayload = { ...createProductDto };
      if (file?.buffer && file?.originalname) {
        const uploadFile = await this.storageService.uploadFile(file);
        productPayload.galleryUrl = uploadFile?.cdnUrl ?? null;
        productPayload.galleryKey = uploadFile?.key ?? null;
      }
      if (
        productPayload.externalImageUrl &&
        !productPayload.uappiUrlImage &&
        productPayload.provider === CatalogProviderType.UAPPI
      ) {
        productPayload.uappiUrlImage = productPayload.externalImageUrl;
      }

      return await this.productInterfaceRepository.create(productPayload);
    } catch (error) {
      console.log(error);
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
    provider: string,
    platformId: string,
  ): Promise<any> {
    try {
      const normalizedProvider = this.catalogService.normalizeProvider(provider);
      const result =
        await this.productInterfaceRepository.findOneByProviderAndPlatformId(
          normalizedProvider,
          platformId,
        );
      const catalogProduct = await this.catalogService.getProductById(
        normalizedProvider,
        platformId,
      );

      if (!result) {
        if (!catalogProduct) {
          throw new HttpException('error', 404);
        }
        const newProduct = this.buildCatalogProductPayload(
          normalizedProvider,
          catalogProduct,
        );
        const createdProduct = await this.create(newProduct, null);
        return { ...createdProduct, ...catalogProduct };
      }

      const shouldSync =
        result.name !== catalogProduct.name ||
        result.description !== catalogProduct.description ||
        result.referencePlatformId !== catalogProduct.externalId ||
        result.sku !== catalogProduct.sku ||
        result.status !== catalogProduct.status ||
        result.url !== catalogProduct.productUrl ||
        result.price !== catalogProduct.price ||
        result.externalImageUrl !== catalogProduct.imageUrl;

      if (shouldSync) {
        result.name = catalogProduct.name;
        result.description = catalogProduct.description;
        result.referencePlatformId = catalogProduct.externalId;
        result.sku = catalogProduct.sku;
        result.status = catalogProduct.status;
        result.url = catalogProduct.productUrl;
        result.price = catalogProduct.price;
        result.externalImageUrl = catalogProduct.imageUrl;
        if (normalizedProvider === CatalogProviderType.UAPPI) {
          result.uappiUrlImage = catalogProduct.imageUrl;
        }
        await this.productInterfaceRepository.update(result);
      }

      return { ...result, ...catalogProduct };
    } catch (error) {
      console.log(error);
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }

  async importFromCatalog(provider: string, externalId: string): Promise<any> {
    try {
      const normalizedProvider = this.catalogService.normalizeProvider(provider);
      const current =
        await this.productInterfaceRepository.findOneByProviderAndPlatformId(
          normalizedProvider,
          externalId,
        );
      if (current) {
        return await this.findOneByPlatformId(normalizedProvider, externalId);
      }

      const catalogProduct = await this.catalogService.getProductById(
        normalizedProvider,
        externalId,
      );
      const created = await this.create(
        this.buildCatalogProductPayload(normalizedProvider, catalogProduct),
        null,
      );

      return { ...created, ...catalogProduct };
    } catch (error) {
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
    const {
      description,
      externalImageUrl,
      name,
      platformId,
      price,
      provider,
      status,
      url,
    } = updateProductDto;
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
      if (provider) {
        product.provider = provider;
      }
      if (status) {
        product.status = status;
      }
      if (url) {
        product.url = url;
      }
      if (price) {
        product.price = price;
      }
      if (externalImageUrl) {
        product.externalImageUrl = externalImageUrl;
      }
      product.updatedAt = new Date();
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
