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
import { router as wpsitesRoutes } from './v1/routes/wpsitesRoutes.js';
import { router as postsRoutes } from './v1/routes/postsRoutes.js';
import { router as mediaRoutes } from './v1/routes/mediaRoutes.js';
import { router as newsRoutes } from './v1/routes/newsRoutes.js';


// Express
const app = express();
const PORT = process.env.PORT || 3001

app.use(responseTime())
app.use(express.json())

// Routes
app.use("/api/v1", wpsitesRoutes)
app.use("/api/v1", postsRoutes)
app.use("/api/v1", mediaRoutes)
app.use("/api/v1", newsRoutes)


// Redirect from '/' to '/api/v1/docs' when root path is accessed
app.get('/', (req, res) => {
  res.redirect('/api/v1/docs');
});

// Connection (Assuming redis.connect() returns a Promise)
redisClient
  .connect()
  .then(() => {
    // This code will execute after the Redis connection is established
    app.listen(PORT, "0.0.0.0",  () => {
      console.log(`API is listening on port ${PORT}`)
      /* console.log(`MYSQLDATABASE: ${process.env.MYSQLDATABASE}`)
      console.log(`MYSQLHOST: ${process.env.MYSQLHOST}`)
      console.log(`MYSQLPASSWORD: ${process.env.MYSQLPASSWORD}`)
      console.log(`MYSQLUSER: ${process.env.MYSQLUSER}`)
      console.log(`MYSQLPORT: ${process.env.MYSQLPORT}`) */
      V1SwaggerDocs(app, PORT)
    });
  })
  .catch((err) => {
    // Handle any errors that occur during the Redis connection
    console.error('INDEX Error connecting to Redis:', err);
  })
