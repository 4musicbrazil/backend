import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return api metadata for the home page', () => {
      expect(appController.homePage()).toEqual({
        API_NAME: process.env.API_NAME,
        API_VERSION: process.env.API_VERSION,
        API_YEAR: process.env.API_YEAR,
        ENVIRONMENT: process.env.ENVIRONMENT,
      });
    });
  });
});
