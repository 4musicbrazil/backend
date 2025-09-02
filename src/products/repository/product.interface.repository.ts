import { Product } from '../entities/product.entity';

export abstract class ProductInterfaceRepository {
  abstract findOne(productUuid: string): Promise<Product>;
  abstract findOneByPlatformId(platformId: string): Promise<Product>;
  abstract create(product: Partial<Product>): Promise<Product>;
  abstract findAll(): Promise<Product[]>;
  abstract update(product: Partial<Product>): Promise<Product>;
  abstract remove(productUuid: string): Promise<Product>;
}
