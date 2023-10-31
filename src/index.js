import express from 'express'
import apicache from 'apicache'
import redis from 'redis'

require('dotenv').config();

import './database/database';
import newsRoutes from './v1/routes/newsRoutes';
const {swaggerDocs: V1SwaggerDocs} = require("./v1/swagger")

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json())
//if redisClient option is defined, apicache will use redis client instead of built-in memory store
let cacheWithRedis = apicache.options({ redisClient: redis.createClient() }).middleware
app.use("/api/v1/", newsRoutes);


app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
  V1SwaggerDocs(app, PORT)
});