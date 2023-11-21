import express from 'express';
const router = express.Router();

import { getDataFromCacheOrExternalAPI } from '../../utils/cacheUtils.js';

// TEST ROUTE TO FETCH DATA FROM URL NOT DATABASE DIRECTLY

/**
 * @openapi
 * /api/v1/cache:
 *   get:
 *     summary: Test route to fetch data from URL (not database) directly
 *     tags:
 *       - Posts
 * responses:
 *       200:
 *         description: Successful response with the requested data fetched
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */

router.get('/cache', async (req, res) => {
  try {
    const data = await getDataFromCacheOrExternalAPI('characters', "https://rickandmortyapi.com/api/character");
    res.status(200).json(data);
  } catch (error) {
    console.error('Error en la ruta:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


export { router };
