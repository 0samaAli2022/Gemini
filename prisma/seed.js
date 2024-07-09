import { PrismaClient } from '@prisma/client';
import uuid4 from 'uuid4';
import { hashPassword } from '../src/utils/hashingPassword.js';
const prisma = new PrismaClient();

const seed = async () => {
  const hashedPassword = await hashPassword('12345678');

  const users = [
    {
      id: uuid4(),
      name: 'osamaAli',
      email: 'osama.ali.dev@gmail.com',
      role: 'ADMIN',
      password: hashedPassword,
      emailVerified: true,
      profile: {
        create: {
          id: uuid4(),
        },
      },
    },
    {
      id: uuid4(),
      name: 'osamaAli2',
      email: 'semsem26621867@gmail.com',
      role: 'ADMIN',
      password: hashedPassword,
      emailVerified: true,
      profile: {
        create: {
          id: uuid4(),
        },
      },
    },
    {
      id: uuid4(),
      name: 'osamaAli',
      email: 'osamaali31121999@gmail.com',
      role: 'USER',
      password: hashedPassword,
      emailVerified: true,
      profile: {
        create: {
          id: uuid4(),
        },
      },
    },
  ];

  for (const userData of users) {
    await prisma.user.create({
      data: userData,
    });
  }
};

seed();
// console.log('Seeding...');
// console.log('Seed done.');
