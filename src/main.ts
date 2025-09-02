import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { join } from 'path';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  app.enableCors({
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
  });

  app.use(helmet());

  const environment = process.env.ENVIRONMENT;

  if (environment != 'production') {
    const config = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('Theme Documentation')
      .setDescription('Theme Documentation')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        filter: true,
        docExpansion: 'none',
        operationsSorter: 'unsorted',
        tagsSorter: 'alpha',
        showRequestDuration: true,
        displayOperationId: false,
        defaultModelsExpandDepth: 0,
        defaultModelExpandDepth: 1,
      },
    });
  }
  await app.listen(3000);
}
bootstrap();
