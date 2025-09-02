import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import toStream = require('buffer-to-stream');
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';

@Injectable()
export class CloudinaryImageService {
  constructor() {
    v2.config({
      secure: true,
      api_key: process.env.CLOUDINARY_API_KEY,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }
  async uploadImage(
    dataBuffer: Buffer,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    try {
      return new Promise((resolve, reject) => {
        const upload = v2.uploader.upload_stream((error, result) => {
          if (error) return reject(error);
          resolve(result);
        });

        toStream(dataBuffer).pipe(upload);
      });
    } catch {
      throw new HttpException(
        'Error uploading',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async bulkUploadImage(dataBuffer: Buffer[]): Promise<any> {
    try {
      const imagesArray: any[] = [];
      dataBuffer.forEach(async (buffer) => {
        const imageUpload = await this.uploadImage(buffer);
        imagesArray.push(imageUpload);
      });
      return imagesArray;
    } catch {
      throw new HttpException(
        'Error uploading',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteImage(imageId: string): Promise<any> {
    try {
      await v2.uploader.destroy(imageId, function (error, result) {
        console.log(result, error);
      });
    } catch {
      throw new HttpException(
        'Error deleting',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async callUploadImage(file: Express.Multer.File): Promise<any> {
    const dataBuffer = file?.buffer ?? false;
    const fileName = file?.originalname ?? false;
    if (dataBuffer && fileName) {
      return await this.uploadImage(dataBuffer);
    }
    return null;
  }
}
