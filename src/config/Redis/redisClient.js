import { createClient } from 'redis';

const redisClient = createClient({
  //url: 'redis://localhost:6379', // or 'redis://yourpassword@remote-hostname:6379' for remote Redis with authentication
  socket: {
    host: 'redis',
    port: 6379,
  },
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

await redisClient.connect();

const scanAsync = async (cursor, pattern, count) => {
  const reply = await redisClient.scan(cursor, {
    MATCH: pattern,
    COUNT: count,
  });
  return reply;
};

const getAsync = async (key) => {
  const value = await redisClient.get(key);
  return value;
};

const delAsync = async (key) => {
  const res = await redisClient.del(key);
  return res;
};

const deleteTokensForUser = async (userId) => {
  let cursor = '0';
  const pattern = '*'; // Use a more specific pattern if possible
  const count = 100; // Adjust the count as needed

  do {
    console.log(`Scanning with cursor: ${cursor}`);
    const { keys } = await scanAsync(cursor, pattern, count);

    console.log(keys);
    console.log(`Found keys: ${keys.length}`);
    for (const key of keys) {
      const value = await getAsync(key);
      if (value === userId) {
        console.log(`Deleting key: ${key}`);
        await delAsync(key);
      }
    }
  } while (cursor !== '0');
};

// Example usage in your change password controller

export { redisClient, deleteTokensForUser };
