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

// Manejar la conexión exitosa
redisClient.on('connect', () => {
  console.log('Conexión a Redis exitosa');
  // Aquí puedes realizar operaciones en la base de datos Redis
  // No recomendado: Borrar una clave en Redis inmediatamente después de la conexión
  /* const keyToDelete = 'characters';
  redisClient.del(keyToDelete, (err, reply) => {
    if (err) {
      console.error('Error al borrar la clave:', err);
    } else {
      console.log(`Clave ${keyToDelete} borrada con éxito.`);
    }
  }); */
});


// Manejar errores de conexión
redisClient.on('error', (err) => {
  console.error('Error en la conexión Redis:', err);
  // Puedes agregar lógica adicional aquí, como intentar reconectar.
});

// Evitar errores de cierre inesperados
redisClient.on('end', () => {
  console.log('Conexión a Redis cerrada inesperadamente');
});

export default redisClient;