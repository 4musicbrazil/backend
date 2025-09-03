import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { extname } from 'path';

@Injectable()
export class StorageService {
  private s3: S3Client;
  private bucket: string;
  private cdn: string;

  constructor() {
    this.s3 = new S3Client({
      region: 'us-east-1',
      endpoint: process.env.DO_SPACES_ENDPOINT,
      credentials: {
        accessKeyId: process.env.DO_SPACES_KEY,
        secretAccessKey: process.env.DO_SPACES_SECRET,
      },
    });

    this.bucket = process.env.DO_SPACES_BUCKET;
    this.cdn = process.env.DO_SPACES_CDN;
  }

  async uploadFile(file: Express.Multer.File) {
    try {
      const fileName = `${Date.now()}-${Math.round(
        Math.random() * 1e9,
      )}${extname(file?.originalname)}`;

      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: fileName,
        Body: file.buffer,
        ACL: 'public-read',
        ContentType: file.mimetype,
      });

      await this.s3.send(command);

      return {
        cdnUrl: `${this.cdn}/${fileName}`,
        bucketUrl: `${process.env.DO_SPACES_ENDPOINT}/${this.bucket}/${fileName}`,
        key: fileName,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async deleteFile(key: string) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.s3.send(command);

      return { message: `Arquivo ${key} deletado com sucesso` };
    } catch (error) {
      console.log(error);
    }
  }
}
