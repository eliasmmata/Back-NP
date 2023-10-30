import express from 'express'

import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'

import { options } from './swaggerOptions'

const specs = swaggerJSDoc(options)

import newsRoutes from './routes/news'

const app = express()

require('dotenv').config();

// Load variables from .env.local if it exists
const result = require('dotenv').config({ path: '.env.local' });

if (result.error) {
  // Handle the error if .env.local doesn't exist, or there's an issue with it
  console.error(result.error);
}

app.use(express.json())

app.use(newsRoutes)



app.use('/docs', swaggerUI.serve, swaggerUI.setup(specs))

export default app