import { Module } from '@nestjs/common';
import { CloudinaryImageService } from './cloudinary-image.service';
import { CloudinaryAudioVideoService } from './cloudinary-audio-video.service';

@Module({
  providers: [CloudinaryImageService, CloudinaryAudioVideoService],
  exports: [CloudinaryImageService, CloudinaryAudioVideoService],
})
export class CloudinaryModule {}
