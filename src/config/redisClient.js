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
  console.error('Error en la conexión Redis:', err);
});

// Realiza operaciones de Redis después de conectarte
redisClient.on('connect', () => {
  // Ejemplo: SET clave-valor
  redisClient.set('mi_clave', 'mi_valor', (error, reply) => {
    if (error) {
      console.error('Error en la operación SET:', error);
    } else {
      console.log('Operación SET exitosa:', reply);
    }

    // Cierra la conexión después de la operación
    redisClient.quit();
  });
});

export default redisClient;
