import redis from 'redis';

const redisHost = process.env.REDIS_HOST || '127.0.0.1';
const redisPort = process.env.REDIS_PORT || 6379;

// Create a Redis client and configure it with your Redis server information
const redisClient = redis.createClient({
  host: redisHost,
  port: redisPort,
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error custom', err);
});

export default redisClient;