import { Prisma } from '@prisma/client';

export interface UserRepository {
  findById(id: string): Promise<Prisma.UserGetPayload<null> | null>;
  findByEmail(tenantId: string, email: string): Promise<Prisma.UserGetPayload<null> | null>;
  findByTenantId(tenantId: string, params?: { skip?: number; take?: number }): Promise<Prisma.UserGetPayload<null>[]>;
  create(data: Prisma.UserCreateInput): Promise<Prisma.UserGetPayload<null>>;
  update(id: string, data: Prisma.UserUpdateInput): Promise<Prisma.UserGetPayload<null>>;
  delete(id: string): Promise<Prisma.UserGetPayload<null>>;
  softDelete(id: string): Promise<Prisma.UserGetPayload<null>>;
  assignRole(userId: string, roleId: string, tenantId: string): Promise<void>;
  removeRole(userId: string, roleId: string, tenantId: string): Promise<void>;
}
