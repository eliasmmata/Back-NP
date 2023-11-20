import express from 'express';
import axios from 'axios';

const router = express.Router();

// Import files
import * as wpsitesController from '../../controllers/wpsitesController.js'

// Todos los Sitios WP activos en BBDD con sus categorías

/**
 * @openapi
 * /api/v1/wpsites:
 *   get:
 *     summary: Get a list of all WordPress sites with categories from DB
 *     tags:
 *       - WordPress Sites
 *     responses:
 *       200:
 *         description: Successful response with a list of WordPress sites and categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   wp_id:
 *                     type: integer
 *                     description: WordPress site ID
 *                   wp_name:
 *                     type: string
 *                     description: WordPress site name
 *                   api_url:
 *                     type: string
 *                     description: API URL of the site
 *                   categories:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         cat_id:
 *                           type: integer
 *                           description: Category ID
 *                         cat_name:
 *                           type: string
 *                           description: Category name
 *                         external_id:
 *                           type: integer
 *                           description: External ID
 */

router.get('/wpsites/', wpsitesController.getWpSites);


export { router };
