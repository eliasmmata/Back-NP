import express from 'express';
import axios from 'axios';

const router = express.Router();

// Import files
import * as mediaController from '../../controllers/mediaController.js'

// ----- GET --------------------------------------------------------------------

// Get Media id attached (featured_media) by Post ID

/**
 * @openapi
 * /api/v1/media/{postId}?wp_site_id=:
 *   get:
 *     summary: Get media ID (featured_media) attached to a post by Post ID and wp_site_id
 *     tags:
 *       - Media
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the post for which to retrieve attached media
 *       - in: query
 *         name: wp_site_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: WordPress site ID from DB
 *     responses:
 *       200:
 *         description: Successful response with the media attached to the specified post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 featured_media_id:
 *                   type: integer
 *       404:
 *         description: Media not found for the specified post
 */

router.get('/media/:postId', mediaController.getMediaByPostId);

// Get Media data by featured_media ID

/**
 * @openapi
 * /api/v1/media/data/{featuredMediaId}?wp_site_id=:
 *   get:
 *     summary: Get media data by featured_media ID and and wp_site_id
 *     tags:
 *       - Media
 *     parameters:
 *       - in: path
 *         name: featuredMediaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the featured_media item for which to retrieve details
 *       - in: query
 *         name: wp_site_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: WordPress site ID from DB
 *     responses:
 *       200:
 *         description: Successful response with the details of the specified featured_media item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 media_details:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     date:
 *                       type: string
 *                     date_gmt:
 *                       type: string
 *                     guid:
 *                       type: object
 *                       properties:
 *                         rendered:
 *                           type: string
 *                     modified:
 *                       type: string
 *                     modified_gmt:
 *                       type: string
 *                     slug:
 *                       type: string
 *                     status:
 *                       type: string
 *                     type:
 *                       type: string
 *                     link:
 *                       type: string
 *                     title:
 *                       type: object
 *                       properties:
 *                         rendered:
 *                           type: string
 *                     author:
 *                       type: integer
 *                     comment_status:
 *                       type: string
 *                     ping_status:
 *                       type: string
 *                     template:
 *                       type: string
 *                     meta:
 *                       type: object
 *                     acf:
 *                       type: array
 *                       items: {}
 *                     description:
 *                       type: object
 *                       properties:
 *                         rendered:
 *                           type: string
 *                     caption:
 *                       type: object
 *                       properties:
 *                         rendered:
 *                           type: string
 *                     alt_text:
 *                       type: string
 *                     media_type:
 *                       type: string
 *                     mime_type:
 *                       type: string
 *                     media_details:
 *                       type: object
 *                       properties:
 *                         width:
 *                           type: integer
 *                         height:
 *                           type: integer
 *                         file:
 *                           type: string
 *                         sizes:
 *                           type: object
 *                     image_meta:
 *                       type: object
 *                       properties:
 *                         aperture:
 *                           type: string
 *                         credit:
 *                           type: string
 *                         camera:
 *                           type: string
 *                         caption:
 *                           type: string
 *                         created_timestamp:
 *                           type: string
 *                         copyright:
 *                           type: string
 *                         focal_length:
 *                           type: string
 *                         iso:
 *                           type: string
 *                         shutter_speed:
 *                           type: string
 *                         title:
 *                           type: string
 *                         orientation:
 *                           type: string
 *                         keywords:
 *                           type: array
 *                           items: {}
 *                 post:
 *                   type: null
 *                 source_url:
 *                   type: string
 *                 _links:
 *                   type: object
 *                   properties:
 *                     self:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           href:
 *                             type: string
 *                     collection:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           href:
 *                             type: string
 *                     about:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           href:
 *                             type: string
 *                     author:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           embeddable:
 *                             type: boolean
 *                           href:
 *                             type: string
 *                     replies:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           embeddable:
 *                             type: boolean
 *                           href:
 *                             type: string
 *       404:
 *         description: Featured_media item not found
 */

router.get('/media/data/:featuredMediaId', mediaController.getFeaturedMediaDetails);

// ----- POST --------------------------------------------------------------------

// Post new Image to a Wordpress Site by its DB id

/**
 * @openapi
 * /api/v1/media/{wpSiteId}:
 *   post:
 *     summary: Upload an image to a WordPress site
 *     tags:
 *       - Media
 *     parameters:
 *       - in: path
 *         name: wpSiteId
 *         required: true
 *         schema:
 *           type: number
 *         description: The identifier of the WordPress site
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               image_path:
 *                 type: string
 *                 format: uri
 *                 description: The path to the image file to upload
 *     responses:
 *       200:
 *         description: Image uploaded successfully to the WordPress site
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 date:
 *                   type: string
 *                   example: The date the post was published, in the site's timezone
 *                 date_gmt:
 *                   type: string
 *                   example: The date the post was published, as GMT
 *                 slug:
 *                   type: string
 *                   example: An alphanumeric identifier for the post unique to its type
 *                 status:
 *                   type: string
 *                   example: A named status for the post ... publish, future, draft, pending, private
 *                   enum: [publish, future, draft, pending, private]
 *                 title:
 *                   type: string
 *                   example: The title for the post
 *                 author:
 *                   type: integer
 *                   example: TYPE INT... The ID for the author of the post
 *                 comment_status:
 *                   type: string
 *                   example: Whether or not comments are open on the post... open, close
 *                   enum: [open, closed]
 *                 ping_status:
 *                   type: string
 *                   example: Whether or not the post can be pinged...open, close
 *                   enum: [open, closed]
 *                 meta:
 *                   type: object
 *                   example: Meta fields
 *                 template:
 *                   type: string
 *                   example: The theme file to use to display the post
 *                 alt_text:
 *                   type: string
 *                   example: Alternative text to display when attachment is not displayed
 *                 caption:
 *                   type: string
 *                   example: The attachment caption
 *                 description:
 *                   type: string
 *                   example: The attachment description
 *                 post:
 *                   type: integer
 *                   example: TYPE INT... The ID for the associated post of the attachment
 *       400:
 *         description: Bad request. The image upload failed
 */

router.post('/media/:wpSiteId', mediaController.postImageToWpSite);


export { router };
