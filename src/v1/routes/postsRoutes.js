import express from 'express';
const router = express.Router();

// Import files
import * as postsController from '../../controllers/postsController.js'

import { getDataFromCacheOrExternalAPI } from '../../utils/cacheUtils.js';

// All Posts from a wpSite

/**
 * @openapi
 * /api/v1/posts/{wpSite}:
 *   get:
 *     summary: Get a list of all posts from a specific url WordPress site
 *     tags:
 *       - Posts
 *     parameters:
 *       - name: wpSite
 *         in: path
 *         description: WordPress site identifier
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response with a list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 found:
 *                   type: integer
 *                   description: The number of posts found
 *                 posts:
 *                   type: array
 *                   description: List of posts
 *                 meta:
 *                   type: object
 *                   description: Metadata about the posts
 *       404:
 *         description: No posts found for the specified site
 */

router.get('/posts/:wpSite', postsController.getPostsList);

// Single Post by ID

/**
 * @openapi
 * /api/v1/post/{postId}:
 *   get:
 *     summary: Get a single post by its ID
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the post to retrieve
 *       - in: query
 *         name: wpUrl
 *         required: false
 *     responses:
 *       200:
 *         description: Successful response of a single post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the post
 *                   example: 1
 *                 title:
 *                   type: string
 *                   description: The title of the post
 *                   example: 'Sample Post Title'
 *                 featured_media:
 *                   type: integer
 *                   description: The ID of the featured media
 *                   example: 123
 *                 content:
 *                   type: object
 *                   description: The content of the post
 *                   example: { body: 'This is the content of the post' }
 *                 date:
 *                   type: string
 *                   description: The date of the post
 *                   example: '2023-11-08'
 *                 date_gmt:
 *                   type: string
 *                   description: The GMT date of the post
 *                   example: '2023-11-08'
 *                 guid:
 *                   type: object
 *                   description: The GUID of the post
 *                   example: { url: 'https://example.com/post/1' }
 *                 modified:
 *                   type: string
 *                   description: The modified date of the post
 *                   example: '2023-11-08'
 *                 modified_gmt:
 *                   type: string
 *                   description: The GMT modified date of the post
 *                   example: '2023-11-08'
 *                 slug:
 *                   type: string
 *                   description: The post slug
 *                   example: 'sample-post-slug'
 *                 status:
 *                   type: string
 *                   description: The post status
 *                   example: 'publish'
 *                 type:
 *                   type: string
 *                   description: The post type
 *                   example: 'post'
 *                 link:
 *                   type: string
 *                   description: The post link
 *                   example: 'https://example.com/post/1'
 *                 excerpt:
 *                   type: object
 *                   description: The excerpt of the post
 *                   example: { brief: 'A short excerpt' }
 *                 author:
 *                   type: integer
 *                   description: The author of the post
 *                   example: 1
 *                 comment_status:
 *                   type: string
 *                   description: The comment status
 *                   example: 'open'
 *                 ping_status:
 *                   type: string
 *                   description: The ping status
 *                   example: 'closed'
 *                 sticky:
 *                   type: boolean
 *                   description: Indicates if the post is sticky
 *                   example: false
 *                 template:
 *                   type: string
 *                   description: The post template
 *                   example: 'default'
 *                 format:
 *                   type: string
 *                   description: The post format
 *                   example: 'standard'
 *                 meta:
 *                   type: object
 *                   description: The meta information of the post
 *                   example: { key1: 'value1', key2: 'value2' }
 *                 categories:
 *                   type: array
 *                   description: The post categories
 *                   example: ['Category 1', 'Category 2']
 *                 tags:
 *                   type: array
 *                   description: The post tags
 *                   example: ['Tag 1', 'Tag 2']
 *                 acf:
 *                   type: array
 *                   description: The post Advanced Custom Fields
 *                   example: [{ field1: 'value1' }, { field2: 'value2' }]
 *                 yoast_head_json:
 *                   type: object
 *                   description: The Yoast SEO JSON data
 *                   example: { title: 'Sample Title', description: 'Sample Description' }
 *                 _links:
 *                   type: object
 *                   description: Links related to the post
 *                   example: { self: 'https://example.com/post/1' }
 *       404:
 *         description: Post not found
 */

router.get('/post/:postId', postsController.getPostById);


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
