import express from 'express';
import responseTime from 'response-time';

// Import middleware to JWT Authentication
import { authenticateToken, attachHeaders } from './middleware/authenticate.js';


// Import the dotenvConfig module for environment configuration
import './config/dotenvConfig.js';

// Swagger file
import { swaggerDocs as V1SwaggerDocs } from './v1/swagger.js';

// Cache file
import redisClient from './config/redisClient.js'

// Database connection file
import './database/database.js'

// Routes Files
import { router as loginRoutes } from './v1/routes/loginRoutes.js';
import { router as wpsitesRoutes } from './v1/routes/wpsitesRoutes.js';
import { router as postsRoutes } from './v1/routes/postsRoutes.js';
import { router as mediaRoutes } from './v1/routes/mediaRoutes.js';
import { router as newsRoutes } from './v1/routes/newsRoutes.js';


// Express
const app = express();
const PORT = process.env.PORT || 3001

app.use(responseTime())
app.use(express.json())

// Login route without authentication middleware
app.use("/api/v1", loginRoutes);

// Using authenticateToken middleware for protected routes
// Protected routes with token authentication and header attachment middleware
app.use("/api/v1", authenticateToken, (req, res, next) => {
  attachHeaders(req, res, next);
}, wpsitesRoutes);

app.use("/api/v1", authenticateToken, (req, res, next) => {
  attachHeaders(req, res, next);
}, postsRoutes);

app.use("/api/v1", authenticateToken, (req, res, next) => {
  attachHeaders(req, res, next);
}, mediaRoutes);

app.use("/api/v1", authenticateToken, (req, res, next) => {
  attachHeaders(req, res, next);
}, newsRoutes);


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
      V1SwaggerDocs(app, PORT)
    });
  })
  .catch((err) => {
    // Handle any errors that occur during the Redis connection
    console.error('INDEX Error connecting to Redis:', err);
  })
