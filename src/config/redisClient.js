import net from 'net';
import redis from 'redis';

const redisHost = process.env.REDISHOST;
const redisPort = process.env.REDISPORT;
const redisPassword = process.env.REDISPASSWORD;
const proxyPort = 35634;

console.log(`REDISHOST: ${process.env.REDISHOST}`);
console.log(`REDISPASSWORD: ${process.env.REDISPASSWORD}`);
console.log(`REDISPORT: ${process.env.REDISPORT}`);
console.log(`PORT: ${process.env.PORT}`);

const proxySocket = net.connect(proxyPort, redisPort, () => {
  console.log('Connected to Railway TCP proxy');

  const redisClient = redis.createClient({
    stream: proxySocket,
    password: redisPassword,
    host: redisHost,
  });

  redisClient.on('connect', () => {
    console.log('Connected to Redis server via TCP proxy');

    // Example usage - set and get values from Redis
    redisClient.set('exampleKey', 'exampleValue', (err, reply) => {
      if (err) {
        console.error('Error setting value in Redis:', err);
      } else {
        console.log('Value set in Redis:', reply);

        // Retrieve the value from Redis
        redisClient.get('exampleKey', (error, value) => {
          if (error) {
            console.error('Error getting value from Redis:', error);
          } else {
            console.log('Retrieved value from Redis:', value);
          }

          // Close the Redis connection when done
          redisClient.quit(() => {
            console.log('Disconnected from Redis');
          });
        });
      }
    });
  });

  redisClient.on('error', (error) => {
    console.error('Error connecting to Redis:', error);
  });
});

proxySocket.on('error', (err) => {
  console.error('Proxy connection error:', err);
});


// Export the Redis client to be used in other modules
export default redisClient;