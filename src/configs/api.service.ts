import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
    });
  }

  public async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.post(
        url,
        data,
        config,
      );

      return response.data;
    } catch (error) {
      const message = {
        message:
          error?.response?.data?.message ??
          error?.message ??
          'Não foi possivel identificar a falha',
        errors: error?.response?.data?.errors,
      };
      console.log(message);
    }
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.get(
      url,
      config,
    );

    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.delete(
        url,
        config,
      );

      return response.data;
    } catch (error) {
      const message = {
        message:
          error?.response?.data?.message ??
          error?.message ??
          'Não foi possível identificar a falha',
        errors: error?.response?.data?.errors,
      };
      console.log(message);
    }
  }

  public async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.patch(
        url,
        data,
        config,
      );

      return response.data;
    } catch (error) {
      const message = {
        message:
          error?.response?.data?.message ??
          error?.message ??
          'Não foi possível identificar a falha',
        errors: error?.response?.data?.errors,
      };
      console.log(message);
    }
  }

  public async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.put(
        url,
        data,
        config,
      );

      return response.data;
    } catch (error) {
      const message = {
        message:
          error?.response?.data?.message ??
          error?.message ??
          'Não foi possível identificar a falha',
        errors: error?.response?.data?.errors,
      };
      console.log(message);
    }
  }
}

export default ApiService;
