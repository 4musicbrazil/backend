import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './entities/role.entity';
import { RoleInterfaceRepository } from './repository/role.interface.repository';

@Injectable()
export class RoleService {
  constructor(
    private readonly roleInterfaceRepository: RoleInterfaceRepository,
  ) {}
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      return await this.roleInterfaceRepository.createRole(createRoleDto);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }

  async findAll(): Promise<Role[]> {
    try {
      return await this.roleInterfaceRepository.findAll();
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }

  async findOne(roleId: string): Promise<Role> {
    try {
      return await this.roleInterfaceRepository.findOne(roleId);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }

  async remove(roleId: string): Promise<Role> {
    try {
      return await this.roleInterfaceRepository.remove(roleId);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }

  async getUserRole(): Promise<Role> {
    try {
      return await this.roleInterfaceRepository.getUserRole();
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }

  async getAdminRole(): Promise<Role> {
    try {
      const adminRole = await this.roleInterfaceRepository.getAdminRole();
      if (adminRole) {
        return adminRole;
      }
      return await this.create({
        name: 'admin',
      });
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }

  async getAdminOwner(): Promise<Role> {
    try {
      const adminRole = await this.roleInterfaceRepository.getAdminOwner();
      if (adminRole) {
        return adminRole;
      }
      return await this.create({
        name: 'owner',
      });
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }
}
