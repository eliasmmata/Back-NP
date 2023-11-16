import redis from 'redis';

const redisHost = process.env.REDISHOST;
const redisPort = process.env.REDISPORT;
const redisPassword = process.env.REDISPASSWORD;

console.log(`REDISHOST: ${process.env.REDISHOST}`);
console.log(`REDISPASSWORD: ${process.env.REDISPASSWORD}`);
console.log(`REDISPORT: ${process.env.REDISPORT}`);
console.log(`REDISUSER: ${process.env.REDISUSER}`);

let connectionAttempts = 0;
const maxAttempts = 5;

// Function to establish Redis connection
const connectToRedis = () => {
  const redisClient = redis.createClient({
    socket: {
      password: redisPassword,
      host: redisHost,
      port: redisPort,
      url: `redis://default:${process.env.REDISPASSWORD}@${process.env.REDISHOST}:${process.env.REDISPORT}`
    },
  });

  // Handle successful connection
  redisClient.on('connect', () => {
    console.log('Conexión a Redis exitosa');
    // Perform Redis database operations here
  });

  // Handle connection errors
  redisClient.on('error', (err) => {
    console.error('Error en la conexión Redis:', err);
    connectionAttempts++;
    if (connectionAttempts >= maxAttempts) {
      console.error(`Exceeded maximum connection attempts (${maxAttempts}). Exiting.`);
      process.exit(1); // Exit with a non-zero status code indicating an error
    } else {
      console.log(`Attempting reconnection. Attempt ${connectionAttempts} of ${maxAttempts}.`);
      setTimeout(connectToRedis, 2000); // Retry connection after 2 seconds
    }
  });

  // Handle unexpected connection closure
  redisClient.on('end', () => {
    console.log('Conexión a Redis cerrada inesperadamente');
  });

  return redisClient;
};

// Start the initial connection attempt
const initialRedisClient = connectToRedis();

export default initialRedisClient;
