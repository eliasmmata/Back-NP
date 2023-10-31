/* const express = require("express");
const bodyParser = require("body-parser");
const apicache = require("apicache");

import newsRoutes from './v1/routes/newsRoutes';

const {swaggerDocs: V1SwaggerDocs} = require("./v1/swagger")
import swaggerUI from 'swagger-ui-express';
import swaggerSpec from './v1/swagger';

const app = express();
const cache = apicache.middleware;

app.use(bodyParser.json());
app.use(cache("2 minutes"));

require('dotenv').config();

app.use(express.json())

app.use("/api/v1/", newsRoutes);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

export default app */