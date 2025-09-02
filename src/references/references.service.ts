import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReferenceDto } from './dto/create-reference.dto';
import { ReferenceInterfaceRepository } from './repository/reference.interface.repository';

@Injectable()
export class ReferencesService {
  constructor(
    private readonly referenceInterfaceRepository: ReferenceInterfaceRepository,
  ) {}

  async getOne(referenceId: string): Promise<any> {
    try {
      return await this.referenceInterfaceRepository.getOne(referenceId);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }

  async listReference(productId: string): Promise<any> {
    try {
      return await this.referenceInterfaceRepository.listReference(productId);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }

  async listReference1(productId: string): Promise<any> {
    try {
      return await this.referenceInterfaceRepository.listReference1(productId);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }

  async addReference(createReferenceDto: CreateReferenceDto): Promise<any> {
    try {
      return await this.referenceInterfaceRepository.addReference(
        createReferenceDto,
      );
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }

  async removeItem(referenceUuid: string): Promise<any> {
    try {
      return await this.referenceInterfaceRepository.removeItem(referenceUuid);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }
}
