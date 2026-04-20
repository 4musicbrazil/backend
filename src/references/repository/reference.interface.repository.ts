import { CreateReferenceDto } from '../dto/create-reference.dto';

export abstract class ReferenceInterfaceRepository {
  abstract addReference(createReferenceDto: CreateReferenceDto): Promise<any>;
  abstract removeItem(referenceUuid: string): Promise<any>;
  abstract listReference(productId: string, provider?: string): Promise<any>;
  abstract listReference1(productId: string, provider?: string): Promise<any>;
  abstract getOne(productId: string): Promise<any>;
}
