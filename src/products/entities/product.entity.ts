import { Reference } from '../../references/entities/reference.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid', { name: 'uuid' })
  uuid: string;

  @Column({
    name: 'gallery_key',
    type: 'varchar',
    nullable: true,
    collation: 'utf8',
    charset: 'utf8_general_ci',
  })
  galleryKey: string;

  @Column({
    name: 'gallery_url',
    type: 'varchar',
    nullable: true,
    collation: 'utf8',
    charset: 'utf8_general_ci',
  })
  galleryUrl: string;

  @Column({
    name: 'price',
    type: 'varchar',
    collation: 'utf8',
    charset: 'utf8_general_ci',
    nullable: true,
  })
  price: string;

  @Column({
    name: 'platform_id',
    type: 'varchar',
    collation: 'utf8',
    charset: 'utf8_general_ci',
    nullable: true,
  })
  platformId: string;

  @Column({
    name: 'reference_platform_id',
    type: 'varchar',
    collation: 'utf8',
    charset: 'utf8_general_ci',
  })
  referencePlatformId: string;

  @Column({
    name: 'name',
    type: 'varchar',
    collation: 'utf8',
    charset: 'utf8_general_ci',
  })
  name: string;

  @Column({
    name: 'description',
    type: 'varchar',
    collation: 'utf8',
    charset: 'utf8_general_ci',
  })
  description: string;

  @Column({
    name: 'sku',
    type: 'varchar',
    collation: 'utf8',
    charset: 'utf8_general_ci',
  })
  readonly sku: string;

  @Column({
    name: 'category',
    type: 'varchar',
    collation: 'utf8',
    charset: 'utf8_general_ci',
  })
  readonly category: string;

  @Column({
    name: 'status',
    type: 'varchar',
    collation: 'utf8',
    default: true,
    charset: 'utf8_general_ci',
  })
  status: string;

  @Column({
    name: 'url',
    type: 'varchar',
    collation: 'utf8',
    charset: 'utf8_general_ci',
  })
  url: string;

  @Column({
    name: 'uappi_url_image',
    type: 'varchar',
    collation: 'utf8',
    charset: 'utf8_general_ci',
  })
  uappiUrlImage: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: null,
  })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', default: null })
  deletedAt: Date;

  @BeforeInsert()
  addId() {
    this.uuid = uuidv4();
  }

  @OneToMany(() => Reference, (reference) => reference.product)
  reference: Reference[];

  @OneToOne(() => Reference, (referenceItem) => referenceItem.productReference)
  referenceItem: Reference;
}
