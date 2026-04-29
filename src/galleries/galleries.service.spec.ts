import { Test, TestingModule } from '@nestjs/testing';
import { GalleriesService } from './galleries.service';
import { StorageService } from '../lib/storage.service';
import { GalleryInterfaceRepository } from './repository/gallery.interface.repository';

describe('GalleriesService', () => {
  let service: GalleriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GalleriesService,
        {
          provide: GalleryInterfaceRepository,
          useValue: {},
        },
        {
          provide: StorageService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<GalleriesService>(GalleriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
