import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MailService, MailDataRequired, ClientResponse } from '@sendgrid/mail';

@Injectable()
export class SendgridService {
  protected sendGrid: MailService;
  private readonly apiKey = process.env.SENDGRID_API_KEY;

  constructor() {
    this.sendGrid = new MailService();

    // Local development does not need email delivery to boot the API.
    if (this.apiKey?.startsWith('SG.')) {
      this.sendGrid.setApiKey(this.apiKey);
    }
  }

  async send(mail: MailDataRequired): Promise<ClientResponse> {
    try {
      if (!this.apiKey?.startsWith('SG.')) {
        throw new HttpException(
          'SendGrid is not configured for this environment',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      const [transport] = await this.sendGrid.send(mail);

      return transport;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
