import { Prisma } from '@prisma/client';

export interface RoleRepository {
  findById(id: string): Promise<Prisma.RoleGetPayload<null> | null>;
  findByName(name: string): Promise<Prisma.RoleGetPayload<null> | null>;
  findAll(params?: { skip?: number; take?: number }): Promise<Prisma.RoleGetPayload<null>[]>;
  create(data: Prisma.RoleCreateInput): Promise<Prisma.RoleGetPayload<null>>;
  update(id: string, data: Prisma.RoleUpdateInput): Promise<Prisma.RoleGetPayload<null>>;
  delete(id: string): Promise<Prisma.RoleGetPayload<null>>;
  addPermission(roleId: string, permissionId: string): Promise<void>;
  removePermission(roleId: string, permissionId: string): Promise<void>;
}
