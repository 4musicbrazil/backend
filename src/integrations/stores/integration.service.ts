import { Injectable } from '@nestjs/common';

import ApiService from '../../configs/api.service';

@Injectable()
export class IntegrationService {
  private apiService: ApiService;
  private url: string = process.env.URL_UAPPI_API;
  private secretKey: string = process.env.SECRET_KEY;
  private apiKey: string = process.env.API_KEY;
  private appToken: string = process.env.APP_TOKEN;

  setApiService() {
    this.apiService = new ApiService(`${this.url}`);
  }
  async getToken(): Promise<any> {
    this.setApiService();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
          'App-Token': this.appToken,
        },
      };
      const data = {
        apiKey: this.apiKey,
        secretKey: this.secretKey,
      };

      const response: any = await this.apiService.post(
        `/v2/auth`,
        data,
        config,
      );
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(platformId: string, uappiToken: string): Promise<any> {
    this.setApiService();
    let token = uappiToken;
    if (!uappiToken) {
      token = await this.getToken();
    }
    const config = {
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        'App-Token': this.appToken,
        Authorization: `Bearer ${token}`,
      },
    };

    const response: any = await this.apiService.get(
      `/v2/products/${platformId}`,
      config,
    );

    return response;
  }

  async brands() {
    const { token } = await this.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        'App-Token': this.appToken,
        Authorization: `Bearer ${token}`,
      },
    };
    const response: any = await this.apiService.get(
      `/v2/brands?offset=0&limit=100`,
      config,
    );

    return response;
  }

  async findOneByIdSkuProduto(uappiToken: string, idSkuProduto: string) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        'App-Token': this.appToken,
        Authorization: `Bearer ${uappiToken}`,
      },
    };
    const response: any = await this.apiService.get(
      `/v2/products/${idSkuProduto}`,
      config,
    );

    return response;
  }

  async findLists(uappiToken: string): Promise<any> {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        'App-Token': this.appToken,
        Authorization: `Bearer ${uappiToken}`,
      },
    };

    const response: any = await this.apiService.get(
      `/v2/lists?offset=0&limit=100`,
      config,
    );
    return response;
  }
}
