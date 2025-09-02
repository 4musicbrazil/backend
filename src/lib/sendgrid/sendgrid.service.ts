import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MailService, MailDataRequired, ClientResponse } from '@sendgrid/mail';

@Injectable()
export class SendgridService {
  protected sendGrid: MailService;

  constructor() {
    this.sendGrid = new MailService();
    this.sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async send(mail: MailDataRequired): Promise<ClientResponse> {
    try {
      const [transport] = await this.sendGrid.send(mail);

      return transport;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
