import { CreateRoleDto } from '../dto/create-role.dto';
import { Role } from '../entities/role.entity';

export abstract class RoleInterfaceRepository {
  abstract createRole(createRoleDto: CreateRoleDto): Promise<Role>;
  abstract findAll(): Promise<Role[]>;
  abstract findOne(roleId: string): Promise<Role>;
  abstract remove(roleId: string): Promise<Role>;
  abstract getUserRole(): Promise<Role>;
  abstract getAdminRole(): Promise<Role>;
  abstract getAdminOwner(): Promise<Role>;
}
