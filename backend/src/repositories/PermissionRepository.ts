import { Prisma } from '@prisma/client';

export interface PermissionRepository {
  findById(id: string): Promise<Prisma.PermissionGetPayload<null> | null>;
  findByName(name: string): Promise<Prisma.PermissionGetPayload<null> | null>;
  findByDomain(domain: string): Promise<Prisma.PermissionGetPayload<null>[]>;
  findAll(params?: { skip?: number; take?: number }): Promise<Prisma.PermissionGetPayload<null>[]>;
  create(data: Prisma.PermissionCreateInput): Promise<Prisma.PermissionGetPayload<null>>;
  update(id: string, data: Prisma.PermissionUpdateInput): Promise<Prisma.PermissionGetPayload<null>>;
  delete(id: string): Promise<Prisma.PermissionGetPayload<null>>;
}
