// Packages
const express = require('express')
const axios = require('axios')
const responseTime = require('response-time')
require('dotenv').config();


// Files
const {swaggerDocs: V1SwaggerDocs} = require("./v1/swagger")
import redisClient from './redisClient'
import './database/database'
import newsRoutes from './v1/routes/newsRoutes'
import postsRoutes from './v1/routes/postsRoutes'
import mediaRoutes from './v1/routes/mediaRoutes'


// Express
const app = express();
const PORT = process.env.PORT || 3000

app.use(responseTime())
app.use(express.json())

// Routes
app.use("/api/v1/", newsRoutes)
app.use("/api/v1/", postsRoutes)
app.use("/api/v1/", mediaRoutes)


// Coonection (Assuming redis.connect() returns a Promise)
redisClient
  .connect()
  .then(() => {
    // This code will execute after the Redis connection is established
    app.listen(PORT, () => {
      console.log(`API is listening on port ${PORT}`)
      V1SwaggerDocs(app, PORT)
    });
  })
  .catch((err) => {
    // Handle any errors that occur during the Redis connection
    console.error('Error connecting to Redis:', err);
  })
