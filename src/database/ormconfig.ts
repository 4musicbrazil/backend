import 'reflect-metadata';

import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

import { Role } from '../role/entities/role.entity';
import { User } from '../users/entities/user.entity';
import { MainSeeder } from './seeds/main-seeder';
import { Product } from '../products/entities/product.entity';
import { Gallery } from '../galleries/entities/gallery.entity';
import { Reference } from '../references/entities/reference.entity';

dotenv.config({ path: './vars/.development.env' });
interface DataSourceOptions {
  type: 'postgres';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  entities: any;
  migrations: string[];
  seeds: any;
  synchronize: boolean;
  logging: boolean;
  ssl: any;
}
console.log(process.env);
const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Role, Product, Reference, Gallery],
  migrations: [`${__dirname}/migrations/**/*{.ts,.js}`],
  seeds: [MainSeeder],
  synchronize: process.env.SYNCHRONIZE == 'TRUE' ? true : false,
  logging: process.env.LOGGING == 'TRUE' ? true : false,
  ssl: {
    rejectUnauthorized: false,
  },
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
