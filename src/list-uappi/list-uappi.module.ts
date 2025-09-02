import { Module } from '@nestjs/common';
import { ListUappiService } from './list-uappi.service';
import { ListUappiController } from './list-uappi.controller';
import { IntegrationsModule } from 'src/integrations/integrations.module';

@Module({
  imports: [IntegrationsModule],
  controllers: [ListUappiController],
  providers: [ListUappiService],
})
export class ListUappiModule {}
