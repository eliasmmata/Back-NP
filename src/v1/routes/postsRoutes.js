const express = require('express')
const router = express.Router();
const axios = require('axios')

// Import files
import redisClient from '../../redisClient'
import postsController from '../../controllers/postsController'


// All Posts
router.get('/posts', postsController.getPostsList);

// Single Post by ID
router.get('/posts/:postId', postsController.getPostById);

// Media id attached (featured_media) by Post ID
router.get('/media/:postId', postsController.getMediaByPostId);

// Media data by featured_media ID
router.get('/media/data/:featuredMediaId', postsController.getFeaturedMediaDetails);


// TEST ROUTE TO FETCH DATA FROM URL NOT DATABASE DIRECTLY
router.get('/cache', async (req, res) => {
  try {
    // Attempt to retrieve data from Redis
    const cachedData = await redisClient.get('characters');
    if (cachedData) {
      // Data is cached in Redis, return it
      res.json(JSON.parse(cachedData));
    } else {
      // Data is not in cache, fetch it from the source
      const response = await axios.get("https://rickandmortyapi.com/api/character");
      // Store the response data in Redis for future requests
      redisClient.set('characters', JSON.stringify(response.data), (err, reply) => {
        if (err) {
          console.error(err);
        }
        // Return the fetched data to the client
        res.json(response.data);
      });
    }
  } catch (error) {
    // Handle errors
    console.error('Error in route handler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
