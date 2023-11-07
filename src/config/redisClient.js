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

// Realiza operaciones de Redis después de conectarte
redisClient.on('error', (err) => {
  console.error('Error en la conexión Redis:', err);
});

redisClient.on('connect', () => {
  console.log('Conexión a Redis exitosa');
  // Aquí puedes realizar operaciones en la base de datos Redis
});

export default redisClient;
