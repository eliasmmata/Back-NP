import redis from 'redis';

const redisHost = process.env.REDISHOST || '127.0.0.1';
const redisPort = process.env.REDISPORT || 6379;
const redisPassword = process.env.REDISPASSWORD;

// Create a Redis client and configure it with your Redis server information
const redisClient = redis.createClient({
  host: redisHost,
  port: redisPort,
  password: redisPassword,
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error custom', err);
});

export default redisClient;
