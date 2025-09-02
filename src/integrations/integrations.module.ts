import { Module } from '@nestjs/common';

import { IntegrationService } from './stores/integration.service';

@Module({
  providers: [IntegrationService],
  exports: [IntegrationService],
})
export class IntegrationsModule {}
