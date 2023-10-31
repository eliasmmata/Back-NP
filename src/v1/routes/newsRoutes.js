import express from 'express'
import apicache from 'apicache'
import redis from 'redis'

const newsController = require("../../controllers/newsController");

const router = express.Router();

let cacheWithRedis = apicache.options({ redisClient: redis.createClient() }).middleware

// ----- GET --------------------------------------------------------------------

/**
 * @openapi
 * /api/v1/news/count:
 *   get:
 *     summary: Get total news counter
 *     tags:
 *       - News
 *     responses:
 *       200:
 *         description: Successful response with the total news counter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: The total count of news items
 */
router.get("/news/count", cacheWithRedis('5 minutes'), newsController.getNewsCount);

/**
 * @openapi
 * /api/v1/news:
 *   get:
 *     summary: Get news items
 *     tags:
 *       - News
 *     parameters:
 *       - in: query
 *         name: list
 *         type: integer
 *         description: Number of news items to retrieve
 *     responses:
 *       200:
 *         description: A list of news items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   titular:
 *                     type: string
 *                   descripcion:
 *                     type: string
 *                   noticia:
 *                     type: string
 *                   redactor:
 *                     type: string
 *                   provincia:
 *                     type: string
 */
router.get('/news', (req, res) => {
  const listCount = req.query.list ? parseInt(req.query.list, 10) : undefined;
  newsController.getNews(req, res, listCount);
});

/**
 * @openapi
 * /api/v1/news/{id}:
 *   get:
 *     summary: Get single news by ID
 *     tags:
 *       - News
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the news item to retrieve
 *     responses:
 *       200:
 *         description: Successful response with the requested news item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the news item
 *                 titular:
 *                   type: string
 *                   description: The title of the news
 *                 descripcion:
 *                   type: string
 *                   description: The description of the news
 *                 noticia:
 *                   type: string
 *                   description: The news content
 *                 redactor:
 *                   type: string
 *                   description: The author of the news
 *                 provincia:
 *                   type: string
 *                   description: The province of the news
 *       404:
 *         description: News item not found
 */

router.get('/news/:id', newsController.getSingleNews);


// ----- POST --------------------------------------------------------------------
/**
 * @openapi
 * /api/v1/news:
 *   post:
 *     summary: Save a single news item
 *     tags:
 *       - News
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     parameters:
 *       - in: formData
 *         name: titular
 *         type: string
 *         description: The title of the news
 *       - in: formData
 *         name: descripcion
 *         type: string
 *         description: The description of the news
 *       - in: formData
 *         name: noticia
 *         type: string
 *         description: The news content
 *       - in: formData
 *         name: redactor
 *         type: string
 *         description: The author of the news
 *       - in: formData
 *         name: provincia
 *         type: string
 *         description: The province of the news
 *     responses:
 *       201:
 *         description: News item created successfully
 *       400:
 *         description: Bad request
 */
router.post('/news', newsController.saveSingleNews);


// ----- PUT --------------------------------------------------------------------

/**
 * @openapi
 * /api/v1/news/{id}:
 *   put:
 *     summary: Update a single news item by ID
 *     tags:
 *       - News
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the news item to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titular:
 *                 type: string
 *                 description: The updated title of the news
 *               descripcion:
 *                 type: string
 *                 description: The updated description of the news
 *               noticia:
 *                 type: string
 *                 description: The updated news content
 *               redactor:
 *                 type: string
 *                 description: The updated author of the news
 *               provincia:
 *                 type: string
 *                 description: The updated province of the news
 *     responses:
 *       204:
 *         description: News item updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: News item not found
 */
router.put('/news/:id', newsController.updateSingleNews);


// ----- DELETE --------------------------------------------------------------------

/**
 * @openapi
 * /api/v1/news/{id}:
 *   delete:
 *     summary: Delete a single news item by ID
 *     tags:
 *       - News
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the news item to delete
 *     responses:
 *       204:
 *         description: News item deleted successfully
 *       404:
 *         description: News item not found
 */
router.delete('/news/:id', newsController.deleteSingleNews);


module.exports = router;


