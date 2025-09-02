import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { User } from '../../users/entities/user.entity';

@Entity('tokens')
export class Token {
  @PrimaryGeneratedColumn('uuid', { name: 'uuid' })
  uuid: string;

  @Column({ name: 'user_uuid', nullable: false, type: 'uuid' })
  userUuid: string;

  @Column({
    name: 'token',
    nullable: false,
    collation: 'utf8',
    charset: 'utf8_general_ci',
  })
  token: string;

  @Column({
    name: 'expire_in',
    nullable: false,
  })
  expireIn: number;

  @Column({ name: 'expire_at', type: 'timestamptz' })
  expireAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    nullable: true,
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @OneToOne(() => User, () => Token)
  @JoinColumn({ name: 'user_uuid' })
  user: User;

  @BeforeInsert()
  addId() {
    this.uuid = uuidv4();
  }
}
