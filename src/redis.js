const redis = require('redis')

// Create a Redis client and configure it with your Redis server information
const client = redis.createClient({
    host: '127.0.0.1',
    port: 6379,
  });

client.on('error', err => console.error('Redis Client Error custom', err));

module.exports = client;