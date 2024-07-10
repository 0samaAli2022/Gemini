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
export { redisClient };
