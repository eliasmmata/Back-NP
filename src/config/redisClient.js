import redis from 'redis';

const redisHost = process.env.REDISHOST;
const redisPort = process.env.REDISPORT;
const redisPassword = process.env.REDISPASSWORD;

// Create a Redis client and configure it with your Redis server information
const redisClient = redis.createClient({
  /* username: process.env.REDISUSER, */
  password: redisPassword,
  socket: {
      host: redisHost,
      port: redisPort,
      /* tls: true, */
  }
});

// Manejar errores de conexión
redisClient.on('error', (err) => {
  console.error('Error en la conexión Redis:', err);
  // Puedes agregar lógica adicional aquí, como intentar reconectar.
});

// Manejar la conexión exitosa
redisClient.on('connect', () => {
  console.log('Conexión a Redis exitosa');
  // Aquí puedes realizar operaciones en la base de datos Redis
});

export default redisClient;