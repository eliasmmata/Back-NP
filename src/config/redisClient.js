import redis from 'redis';

const redisHost = process.env.REDISHOST;
const redisPort = process.env.REDISPORT;
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
