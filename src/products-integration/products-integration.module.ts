import { Module } from '@nestjs/common';
import { ProductsIntegrationService } from './products-integration.service';
import { ProductsIntegrationController } from './products-integration.controller';
import { IntegrationsModule } from 'src/integrations/integrations.module';

@Module({
  imports: [IntegrationsModule],
  controllers: [ProductsIntegrationController],
  providers: [ProductsIntegrationService],
})
export class ProductsIntegrationModule {}
