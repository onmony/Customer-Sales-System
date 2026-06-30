import { Prisma } from '@prisma/client';

export interface TenantRepository {
  findById(id: string): Promise<Prisma.TenantGetPayload<null> | null>;
  findBySubdomain(subdomain: string): Promise<Prisma.TenantGetPayload<null> | null>;
  findAll(params?: { skip?: number; take?: number }): Promise<Prisma.TenantGetPayload<null>[]>;
  create(data: Prisma.TenantCreateInput): Promise<Prisma.TenantGetPayload<null>>;
  update(id: string, data: Prisma.TenantUpdateInput): Promise<Prisma.TenantGetPayload<null>>;
  delete(id: string): Promise<Prisma.TenantGetPayload<null>>;
}
