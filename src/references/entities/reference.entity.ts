import {
  BeforeInsert,
  BeforeSoftRemove,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Product } from '../../products/entities/product.entity';
import { Gallery } from '../../galleries/entities/gallery.entity';
@Entity('references')
export class Reference {
  @PrimaryGeneratedColumn('uuid', { name: 'uuid' })
  uuid: string;

  @Column({
    name: 'product_id',
    type: 'varchar',
    nullable: true,
    collation: 'utf8',
    charset: 'utf8_general_ci',
  })
  productId: string;

  @Column({
    name: 'group_id',
    type: 'varchar',
    nullable: true,
    collation: 'utf8',
    charset: 'utf8_general_ci',
  })
  groupId: string;

  @Column({
    name: 'item_reference_id',
    type: 'uuid',
    nullable: true,
    collation: 'utf8',
    charset: 'utf8_general_ci',
  })
  itemReferenceId: string;

  @Column({
    name: 'type',
    type: 'varchar',
    nullable: true,
    collation: 'utf8',
    charset: 'utf8_general_ci',
  })
  type: string;

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

  @ManyToOne(() => Product, (product) => product.reference)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @OneToOne(
    () => Product,
    (productReference) => productReference.referenceItem,
    { cascade: ['soft-remove'], onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'item_reference_id' })
  productReference: Product;

  @OneToOne(
    () => Gallery,
    (galleryReference) => galleryReference.referenceItem,
    { cascade: ['soft-remove'], onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'item_reference_id' })
  galleryReference: Gallery;
}
