import express from 'express';
import responseTime from 'response-time';

// Import the dotenvConfig module for environment configuration
import './config/dotenvConfig.js';

// Swagger file
import { swaggerDocs as V1SwaggerDocs } from './v1/swagger.js';

// Cache file
import redisClient from './config/redisClient.js'

// Database connection file
import './database/database.js'

// Routes Files
import { router as newsRoutes } from './v1/routes/newsRoutes.js';
import { router as postsRoutes } from './v1/routes/postsRoutes.js';
import { router as mediaRoutes } from './v1/routes/mediaRoutes.js';


// Express
const app = express();
const PORT = process.env.RAILWAY_PORT || 3001

app.use(responseTime())
app.use(express.json())

// Routes
app.use("/api/v1", newsRoutes)
app.use("/api/v1", postsRoutes)
app.use("/api/v1", mediaRoutes)


// Connection (Assuming redis.connect() returns a Promise)
redisClient
  .connect()
  .then(() => {
    // This code will execute after the Redis connection is established
    app.listen(PORT, () => {
      console.log(`API is listening on port ${PORT}`)
      /* console.log('mysql host:', process.env.MYSQLHOST)
      console.log('mysql port:', process.env.MYSQLPORT)
      console.log('mysql user:', process.env.MYSQLUSER)
      console.log('mysql password:', process.env.MYSQLPASSWORD)
      console.log('mysql database:', process.env.MYSQLDATABASE)
      console.log('redis host:', process.env.REDISHOST)
      console.log('redis port:', process.env.REDISPORT)
      console.log('redis password:', process.env.REDISPASSWORD) */
      V1SwaggerDocs(app, PORT)
    });
  })
  .catch((err) => {
    // Handle any errors that occur during the Redis connection
    console.error('INDEX Error connecting to Redis:', err);
  })
