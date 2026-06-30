import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

const prisma = new PrismaClient();

interface RoleConfig {
  name: string;
  description: string;
  is_system: boolean;
  is_enabled: boolean;
  permissions: string[];
}

interface PermissionConfig {
  name: string;
  description: string;
  domain: string;
}

interface FeatureFlagConfig {
  name: string;
  description: string;
  is_enabled: boolean;
  is_system: boolean;
}

interface StatusConfig {
  code: string;
  name: string;
  description: string;
  is_initial: boolean;
  is_terminal: boolean;
  color: string;
}

interface ConfigFile {
  roles?: RoleConfig[];
  permissions?: PermissionConfig[];
  feature_flags?: FeatureFlagConfig[];
  order_statuses?: StatusConfig[];
  invoice_statuses?: StatusConfig[];
  customer_statuses?: StatusConfig[];
  pricing_statuses?: StatusConfig[];
}

async function loadYamlFile<T>(filename: string): Promise<T | null> {
  try {
    const filePath = path.join(__dirname, '../../config', filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return yaml.load(fileContents) as T;
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    return null;
  }
}

async function seedPermissions() {
  console.log('Seeding permissions...');
  const config = await loadYamlFile<ConfigFile>('seed/permissions.yaml');
  
  if (!config || !config.permissions) {
    console.log('No permissions found in config, skipping...');
    return;
  }

  for (const perm of config.permissions) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      update: {
        description: perm.description,
        domain: perm.domain,
      },
      create: {
        name: perm.name,
        description: perm.description,
        domain: perm.domain,
      },
    });
  }

  console.log(`Seeded ${config.permissions.length} permissions`);
}

async function seedRoles() {
  console.log('Seeding roles...');
  const config = await loadYamlFile<ConfigFile>('seed/roles.yaml');
  
  if (!config || !config.roles) {
    console.log('No roles found in config, skipping...');
    return;
  }

  for (const roleConfig of config.roles) {
    const role = await prisma.role.upsert({
      where: { name: roleConfig.name },
      update: {
        description: roleConfig.description,
        isSystem: roleConfig.is_system,
        isEnabled: roleConfig.is_enabled,
      },
      create: {
        name: roleConfig.name,
        description: roleConfig.description,
        isSystem: roleConfig.is_system,
        isEnabled: roleConfig.is_enabled,
      },
    });

    // Handle permissions
    for (const permName of roleConfig.permissions) {
      if (permName === '*') {
        // Global wildcard - grant all permissions
        const allPermissions = await prisma.permission.findMany();
        for (const perm of allPermissions) {
          await prisma.rolePermission.upsert({
            where: {
              roleId_permissionId: {
                roleId: role.id,
                permissionId: perm.id,
              },
            },
            update: {},
            create: {
              roleId: role.id,
              permissionId: perm.id,
            },
          });
        }
      } else {
        const permission = await prisma.permission.findUnique({
          where: { name: permName },
        });

        if (permission) {
          await prisma.rolePermission.upsert({
            where: {
              roleId_permissionId: {
                roleId: role.id,
                permissionId: permission.id,
              },
            },
            update: {},
            create: {
              roleId: role.id,
              permissionId: permission.id,
            },
          });
        } else if (permName.includes('*')) {
          // Wildcard pattern (e.g., "customer.*")
          const pattern = permName.replace('*', '');
          const matchingPermissions = await prisma.permission.findMany({
            where: {
              name: {
                startsWith: pattern,
              },
            },
          });

          for (const perm of matchingPermissions) {
            await prisma.rolePermission.upsert({
              where: {
                roleId_permissionId: {
                  roleId: role.id,
                  permissionId: perm.id,
                },
              },
              update: {},
              create: {
                roleId: role.id,
                permissionId: perm.id,
              },
            });
          }
        }
      }
    }
  }

  console.log(`Seeded ${config.roles.length} roles`);
}

async function seedFeatureFlags() {
  console.log('Seeding feature flags...');
  const config = await loadYamlFile<ConfigFile>('feature-flags.yaml');
  
  if (!config || !config.feature_flags) {
    console.log('No feature flags found in config, skipping...');
    return;
  }

  for (const flag of config.feature_flags) {
    await prisma.featureFlag.upsert({
      where: { name: flag.name },
      update: {
        description: flag.description,
        isEnabled: flag.is_enabled,
        isSystem: flag.is_system,
      },
      create: {
        name: flag.name,
        description: flag.description,
        isEnabled: flag.is_enabled,
        isSystem: flag.is_system,
      },
    });
  }

  console.log(`Seeded ${config.feature_flags.length} feature flags`);
}

async function seedStatuses() {
  console.log('Seeding statuses...');
  
  // Order statuses
  const orderStatusConfig = await loadYamlFile<ConfigFile>('order-statuses.yaml');
  if (orderStatusConfig?.order_statuses) {
    for (const status of orderStatusConfig.order_statuses) {
      await prisma.orderStatus.upsert({
        where: { code: status.code },
        update: {
          name: status.name,
          description: status.description,
          isInitial: status.is_initial,
          isTerminal: status.is_terminal,
          color: status.color,
        },
        create: {
          code: status.code,
          name: status.name,
          description: status.description,
          isInitial: status.is_initial,
          isTerminal: status.is_terminal,
          color: status.color,
        },
      });
    }
    console.log(`Seeded ${orderStatusConfig.order_statuses.length} order statuses`);
  }

  // Invoice statuses
  const invoiceStatusConfig = await loadYamlFile<ConfigFile>('invoice-statuses.yaml');
  if (invoiceStatusConfig?.invoice_statuses) {
    for (const status of invoiceStatusConfig.invoice_statuses) {
      await prisma.invoiceStatus.upsert({
        where: { code: status.code },
        update: {
          name: status.name,
          description: status.description,
          isInitial: status.is_initial,
          isTerminal: status.is_terminal,
          color: status.color,
        },
        create: {
          code: status.code,
          name: status.name,
          description: status.description,
          isInitial: status.is_initial,
          isTerminal: status.is_terminal,
          color: status.color,
        },
      });
    }
    console.log(`Seeded ${invoiceStatusConfig.invoice_statuses.length} invoice statuses`);
  }

  // Customer statuses
  const customerStatusConfig = await loadYamlFile<ConfigFile>('customer-statuses.yaml');
  if (customerStatusConfig?.customer_statuses) {
    for (const status of customerStatusConfig.customer_statuses) {
      await prisma.customerStatus.upsert({
        where: { code: status.code },
        update: {
          name: status.name,
          description: status.description,
          isInitial: status.is_initial,
          isTerminal: status.is_terminal,
          color: status.color,
        },
        create: {
          code: status.code,
          name: status.name,
          description: status.description,
          isInitial: status.is_initial,
          isTerminal: status.is_terminal,
          color: status.color,
        },
      });
    }
    console.log(`Seeded ${customerStatusConfig.customer_statuses.length} customer statuses`);
  }

  // Pricing statuses
  const pricingStatusConfig = await loadYamlFile<ConfigFile>('pricing-statuses.yaml');
  if (pricingStatusConfig?.pricing_statuses) {
    for (const status of pricingStatusConfig.pricing_statuses) {
      await prisma.pricingStatus.upsert({
        where: { code: status.code },
        update: {
          name: status.name,
          description: status.description,
          isInitial: status.is_initial,
          isTerminal: status.is_terminal,
          color: status.color,
        },
        create: {
          code: status.code,
          name: status.name,
          description: status.description,
          isInitial: status.is_initial,
          isTerminal: status.is_terminal,
          color: status.color,
        },
      });
    }
    console.log(`Seeded ${pricingStatusConfig.pricing_statuses.length} pricing statuses`);
  }
}

async function seedSystemConfig() {
  console.log('Seeding system config...');
  
  await prisma.systemConfig.upsert({
    where: { key: 'bootstrap_completed' },
    update: { value: 'true' },
    create: {
      key: 'bootstrap_completed',
      value: 'true',
    },
  });

  console.log('Seeded system config');
}

async function main() {
  console.log('Starting database seed...');
  
  try {
    // Check if bootstrap has already been completed
    const bootstrapConfig = await prisma.systemConfig.findUnique({
      where: { key: 'bootstrap_completed' },
    });

    if (bootstrapConfig && bootstrapConfig.value === 'true') {
      console.log('Bootstrap already completed. Skipping seed.');
      return;
    }

    await seedPermissions();
    await seedRoles();
    await seedFeatureFlags();
    await seedStatuses();
    await seedSystemConfig();
    
    console.log('Database seed completed successfully!');
  } catch (error) {
    console.error('Error during seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
