import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const saltRounds = 12;

  const superAdminPassword = await bcrypt.hash('SuperAdmin@123', saltRounds);
  await prisma.user.upsert({
    where: { email: 'superadmin@acwad.com' },
    update: {},
    create: {
      email: 'superadmin@acwad.com',
      passwordHash: superAdminPassword,
      fullName: 'Acwad Super Admin',
      role: UserRole.SUPER_ADMIN,
      isActive: true,
      isEmailVerified: true,
    },
  });

  const adminPassword = await bcrypt.hash('Admin@123', saltRounds);
  await prisma.user.upsert({
    where: { email: 'admin@acwad.com' },
    update: {},
    create: {
      email: 'admin@acwad.com',
      passwordHash: adminPassword,
      fullName: 'Acwad Admin',
      role: UserRole.ADMIN,
      isActive: true,
      isEmailVerified: true,
    },
  });

  const instructorPassword = await bcrypt.hash('Instructor@123', saltRounds);
  await prisma.user.upsert({
    where: { email: 'instructor@acwad.com' },
    update: {},
    create: {
      email: 'instructor@acwad.com',
      passwordHash: instructorPassword,
      fullName: 'Jane Instructor',
      role: UserRole.INSTRUCTOR,
      isActive: true,
      isEmailVerified: true,
      bio: 'Senior software engineer and educator with 10 years of experience.',
    },
  });

  const studentPassword = await bcrypt.hash('Student@123', saltRounds);
  await prisma.user.upsert({
    where: { email: 'student@acwad.com' },
    update: {},
    create: {
      email: 'student@acwad.com',
      passwordHash: studentPassword,
      fullName: 'John Student',
      role: UserRole.STUDENT,
      isActive: true,
      isEmailVerified: true,
    },
  });

  console.log('Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
