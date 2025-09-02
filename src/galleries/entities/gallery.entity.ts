import { Reference } from '../../references/entities/reference.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('galleries')
export class Gallery {
  @PrimaryGeneratedColumn('uuid', { name: 'uuid' })
  uuid: string;

  @Column({
    name: 'name',
    type: 'varchar',
    nullable: true,
    collation: 'utf8',
    charset: 'utf8_general_ci',
  })
  name: string;

  @Column({
    name: 'duration',
    type: 'varchar',
    nullable: true,
    collation: 'utf8',
    charset: 'utf8_general_ci',
  })
  duration: string;

  @Column({
    name: 'description',
    type: 'varchar',
    nullable: true,
    collation: 'utf8',
    charset: 'utf8_general_ci',
  })
  description: string;

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

  @OneToOne(() => Reference, (referenceItem) => referenceItem.galleryReference)
  referenceItem: Reference;
}
