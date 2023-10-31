const express = require('express')
const axios = require('axios')
const responseTime = require('response-time')
require('dotenv').config();

import redisClient from './redisClient'
import './database/database'
import newsRoutes from './v1/routes/newsRoutes'
const {swaggerDocs: V1SwaggerDocs} = require("./v1/swagger")

const app = express();
const PORT = process.env.PORT || 3000

app.use(responseTime())
app.use(express.json())

app.use("/api/v1/", newsRoutes)

// Assuming redis.connect() returns a Promise
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
