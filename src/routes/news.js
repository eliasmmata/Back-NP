import { Router } from 'express';

import {getNews, getSingleNews, getListOfNews, getNewsCount, saveSingleNews, updateSingleNews, deleteSingleNews} from '../controllers/news'

const router = Router()

/**
 * @swagger
 * tags:
 * name: news
 * description: news endpoint
 */


// ----- GET --------------------------------------------------------------------

/**
 * @swagger
 * /News:
 *  get:
 *      summary: Get all news
 *      tags: [News]
 */
router.get('/news', getNews)

/**
 * @swagger
 * /News/count:
 *  get:
 *      summary: Get total news counter
 *      tags: [News]
 */
router.get('/news/count', getNewsCount)

/**
 * @swagger
 * /news:
 *   get:
 *     summary: Get news items
 *     tags: [News]
 *     parameters:
 *       - in: query
 *         name: list
 *         schema:
 *           type: integer
 *         description: Number of news items to retrieve
 *     responses:
 *       200:
 *         description: A list of news items
 */
router.get('/news', (req, res) => {
    const listCount = req.query.list || 5; // Default to 5 if 'list' query parameter is not provided
    getNews(req, res, listCount);
  });


/**
 * @swagger
 * /News:
 *  get:
 *      summary: Get single news by id
 *      tags: [News]
 */
router.get('/news/:id', getSingleNews)



// ----- POST --------------------------------------------------------------------

/**
 * @swagger
 * /News:
 *  post:
 *      summary: save single news
 *      tags: [News]
 */
router.post('/news', saveSingleNews)


// ----- PUT --------------------------------------------------------------------

/**
 * @swagger
 * /News:
 *  put:
 *      summary: update single news by id
 *      tags: [News]
 */
router.put('/news/:id', updateSingleNews)


// ----- DELETE --------------------------------------------------------------------

/**
 * @swagger
 * /News:
 *  delete:
 *      summary: delete single news by id
 *      tags: [News]
 */
router.delete('/news/:id', deleteSingleNews)



export default router