import { PrismaClient } from '@prisma/client';
import uuid4 from 'uuid4';
import { hashPassword } from '../src/utils/hashingPassword.js';
import { faker } from '@faker-js/faker';
const prisma = new PrismaClient();

const seed = async () => {
  const hashedPassword = await hashPassword('12345678');

  const usersObj = [
    {
      id: uuid4(),
      name: 'Osama',
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
      name: 'OsamaAli',
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
      name: 'OsamaBenAli',
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
    {
      id: uuid4(),
      name: 'Monica',
      email: 'monica@gmail.com',
      role: 'USER',
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
      name: 'Ryan',
      email: 'ryan@gmail.com',
      role: 'USER',
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
      name: 'Jackson',
      email: 'jackson@gmail.com',
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
  const posts = [];
  const privacy = ['PUBLIC', 'FOLLOWERS', 'PRIVATE'];
  for (let i = 0; i < 14; i++) {
    await prisma.user.create({
      data: {
        id: uuid4(),
        name: faker.person.firstName(),
        email: faker.internet.email(),
        role: 'USER',
        password: hashedPassword,
        emailVerified: true,
        profile: {
          create: {
            id: uuid4(),
          },
        },
      },
    });
  }
  for (const userData of usersObj) {
    await prisma.user.create({
      data: userData,
    });
  }

  const users = await prisma.user.findMany();

  for (let i = 0; i < 100; i++) {
    const randomUserIndex = Math.floor(Math.random() * users.length);
    const randomPrivacyIndex = Math.floor(Math.random() * privacy.length);
    const post = await prisma.post.create({
      data: {
        id: uuid4(),
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(3),
        author: { connect: { id: users[randomUserIndex].id } },
        privacy: privacy[randomPrivacyIndex],
      },
    });
    posts.push(post);
  }

  for (let i = 0; i < 1000; i++) {
    const randomUserIndex = Math.floor(Math.random() * users.length);
    const randomPostIndex = Math.floor(Math.random() * posts.length);
    await prisma.comment.create({
      data: {
        id: uuid4(),
        content: faker.lorem.sentence(),
        author: { connect: { id: users[randomUserIndex].id } },
        post: { connect: { id: posts[randomPostIndex].id } },
      },
    });
  }

  for (const user of users) {
    const numFollowers = Math.floor(Math.random() * (users.length - 1)) + 1; // Random number of followers
    const followers = [];
    while (followers.length < numFollowers) {
      const randomFollower = users[Math.floor(Math.random() * users.length)];
      if (
        randomFollower.id !== user.id &&
        !followers.includes(randomFollower.id)
      ) {
        followers.push(randomFollower.id);
      }
    }
    for (const followerId of followers) {
      await prisma.followRelation.create({
        data: {
          id: uuid4(),
          follower: { connect: { id: followerId } },
          followed: { connect: { id: user.id } },
        },
      });
    }
  }

  console.log('Seeding done.');
};

seed();
