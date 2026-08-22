import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const adapter = new PrismaMariaDb(
  process.env.DATABASE_URL ?? 'mysql://root:root@localhost:3306/tonic_store'
);

export const prisma = new PrismaClient({ adapter });
