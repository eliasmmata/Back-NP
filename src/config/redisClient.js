import redis from 'redis';

const redisHost = process.env.REDISHOST;
const redisPort = process.env.REDISPORT;
const redisPassword = process.env.REDISPASSWORD;


console.log(`REDISHOST: ${process.env.REDISHOST}`)
console.log(`REDISPASSWORD: ${process.env.REDISPASSWORD}`)
console.log(`REDISPORT: ${process.env.REDISPORT}`)

let connectionAttempts = 0;
const maxAttempts = 20;

// Create a Redis client and configure it with your Redis server information
// Function to establish Redis connection
const connectToRedis = () => {
  const redisClient = redis.createClient({
    /* username: process.env.REDISUSER || 'default', */
    host: redisHost,
    port: redisPort,
    password: redisPassword,
    tls: { servername: redisHost }
  });

  // Manejar la conexión exitosa
  redisClient.on('connect', () => {
    console.log('Conexión a Redis exitosa');

  });

  // Manejar errores de conexión
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

  // Evitar errores de cierre inesperados
  redisClient.on('end', () => {
    console.log('Conexión a Redis cerrada inesperadamente');
  });

  return redisClient;

}

// Start the initial connection attempt
const initialRedisClient = connectToRedis();

export default initialRedisClient;
