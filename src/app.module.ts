import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './auth/guard/roles.guard';
import { CronModule } from './cron/cron.module';
import { HealthModule } from './health/health.module';
import { Role } from './role/entities/role.entity';
import { RoleModule } from './role/role.module';
import { Token } from './tokens/entities/token.entity';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { GalleriesModule } from './galleries/galleries.module';
import { ProductsModule } from './products/products.module';
import { ReferencesModule } from './references/references.module';
import { Product } from './products/entities/product.entity';
import { Reference } from './references/entities/reference.entity';
import { Gallery } from './galleries/entities/gallery.entity';
import { ProductsIntegrationModule } from './products-integration/products-integration.module';
import { ListUappiModule } from './list-uappi/list-uappi.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './vars/.development.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Token, Role, Product, Reference, Gallery],
      migrations: [__dirname + '/database/migrations'],
      synchronize: process.env.SYNCHRONIZE == 'TRUE' ? true : false,
      logging: process.env.LOGGING == 'TRUE' ? true : false,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    AuthModule,
    UsersModule,
    CronModule,
    HealthModule,
    RoleModule,
    GalleriesModule,
    ProductsModule,
    ReferencesModule,
    ProductsIntegrationModule,
    ListUappiModule,
  ],
  controllers: [AppController],
  providers: [AppService, RolesGuard],
})
export class AppModule {}
