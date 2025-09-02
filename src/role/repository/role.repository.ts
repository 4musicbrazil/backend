import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateRoleDto } from '../dto/create-role.dto';
import { Role } from '../entities/role.entity';

@Injectable()
export class RoleRepository {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}
  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const { name } = createRoleDto;
    const exists = await this.finByRole(name);
    if (exists) {
      throw new HttpException('Role already exists', 404);
    }
    try {
      const newRole = this.roleRepository.create(createRoleDto);
      return await this.roleRepository.save(newRole);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }

  async findAll(): Promise<Role[]> {
    try {
      return this.roleRepository.find();
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }

  async findOne(roleId: string): Promise<Role> {
    try {
      return await this.roleRepository.findOne({
        where: {
          uuid: roleId,
        },
      });
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }

  async remove(roleId: string): Promise<Role> {
    try {
      const role = await this.findOne(roleId);
      return await this.roleRepository.softRemove(role);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }
  async finByRole(role: string): Promise<Role> {
    try {
      return await this.roleRepository.findOne({
        where: {
          name: role,
        },
      });
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }

  async getUserRole(): Promise<Role> {
    try {
      return await this.roleRepository.findOne({
        where: {
          name: 'user',
        },
      });
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }

  async getAdminRole(): Promise<Role> {
    try {
      return await this.roleRepository.findOne({
        where: {
          name: 'admin',
        },
      });
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }
  async getAdminOwner(): Promise<Role> {
    try {
      return await this.roleRepository.findOne({
        where: {
          name: 'owner',
        },
      });
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }
}
