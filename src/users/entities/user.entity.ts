import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Role } from '../../role/entities/role.entity';
import { BaseEntity } from '../../database/base.entity';
@Entity('users')
export class User extends BaseEntity {
  @Column({
    name: 'role_uuid',
    type: 'varchar',
    nullable: true,
    collation: 'utf8',
    charset: 'utf8_general_ci',
  })
  roleUuid: string;

  @Column({
    name: 'email',
    type: 'varchar',
    nullable: false,
    unique: true,
    collation: 'utf8',
    charset: 'utf8_general_ci',
  })
  email: string;

  @Column({
    name: 'full_name',
    type: 'varchar',
    nullable: false,
    unique: true,
    collation: 'utf8',
    charset: 'utf8_general_ci',
  })
  fullName: string;

  @Column({
    name: 'password',
    type: 'varchar',
    nullable: false,
    collation: 'utf8',
    charset: 'utf8_general_ci',
  })
  password: string;

  @OneToOne(() => Role, (role) => role.user, { eager: true })
  @JoinColumn({ name: 'role_uuid' })
  role: Role;
}
