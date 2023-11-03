const express = require('express')
const router = express.Router();

// Import files
import mediaController from '../../controllers/mediaController'



console.log('MEDIA ROUTES');

// Media id attached (featured_media) by Post ID
router.get('/media/:postId', mediaController.getMediaByPostId);

// Media data by featured_media ID
router.get('/media/data/:featuredMediaId', mediaController.getFeaturedMediaDetails);


module.exports = router;
