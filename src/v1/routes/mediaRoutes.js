import express from 'express';
import axios from 'axios';

const router = express.Router();

// Import files
import * as mediaController from '../../controllers/mediaController.js'


// Media id attached (featured_media) by Post ID
router.get('/media/:postId', mediaController.getMediaByPostId);

// Media data by featured_media ID
router.get('/media/data/:featuredMediaId', mediaController.getFeaturedMediaDetails);


export { router };
