import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IntegrationService } from '../integrations/stores/integration.service';

@Injectable()
export class ListUappiService {
  constructor(private readonly integrationService: IntegrationService) {}

  async findAll(uappiToken: string): Promise<any> {
    try {
      return await this.integrationService.findLists(uappiToken);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }
}
