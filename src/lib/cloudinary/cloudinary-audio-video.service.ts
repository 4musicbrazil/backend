import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import toStream = require('buffer-to-stream');
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class CloudinaryAudioVideoService {
  OPTIONS = null;
  constructor() {
    v2.config({
      secure: true,
      api_key: process.env.CLOUDINARY_API_KEY,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    // Log the configuration
    this.OPTIONS = {
      public_id: uuidv4(),
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      upload_preset: process.env.CLOUDINARY_PRESET,
      resource_type: 'video',
      chunk_size: 90000000,
    };
  }
  async uploadFile(
    dataBuffer: Buffer,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    try {
      return new Promise((resolve, reject) => {
        const upload = v2.uploader.upload_stream(
          this.OPTIONS,
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );

        toStream(dataBuffer).pipe(upload);
      });
    } catch {
      throw new HttpException(
        'Error uploading',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async bulkUploadFile(dataBuffer: Buffer[]): Promise<any> {
    try {
      const imagesArray: any[] = [];
      dataBuffer.forEach(async (buffer) => {
        const imageUpload = await this.uploadFile(buffer);
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

  async deleteFile(imageId: string): Promise<void> {
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
  async callUploadFile(file: Express.Multer.File): Promise<any> {
    const dataBuffer = file?.buffer ?? false;
    const fileName = file?.originalname ?? false;
    if (dataBuffer && fileName) {
      return await this.uploadFile(dataBuffer);
    }
    return null;
  }
}
