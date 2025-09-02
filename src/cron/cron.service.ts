import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CronService {
  @Cron('*/80 * * * * *')
  async handleCron() {
    console.log('Cron service is running ❤️‍🔥');
  }
}
