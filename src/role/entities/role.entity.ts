import { ApiProperty } from '@nestjs/swagger';
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

import { User } from '../../users/entities/user.entity';

@Entity('roles')
export class Role {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid', { name: 'uuid' })
  uuid: string;

  @ApiProperty()
  @Column({
    name: 'name',
    type: 'varchar',
    nullable: false,
    collation: 'utf8',
    charset: 'utf8_general_ci',
  })
  name: string;

  @ApiProperty()
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: null,
  })
  updatedAt: Date;

  @ApiProperty()
  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', default: null })
  deletedAt: Date;

  @BeforeInsert()
  addId() {
    this.uuid = uuidv4();
  }

  @OneToOne(() => User, (user) => user.role)
  user: User;
}
