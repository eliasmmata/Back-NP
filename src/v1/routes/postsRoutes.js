import express from 'express';
const router = express.Router();
import axios from 'axios';

// Import files
import redisClient from '../../config/redisClient.js'
import * as postsController from '../../controllers/postsController.js'


// All Posts
router.get('/posts', postsController.getPostsList);

// Single Post by ID
router.get('/posts/:postId', postsController.getPostById);


// TEST ROUTE TO FETCH DATA FROM URL NOT DATABASE DIRECTLY
router.get('/cache', async (req, res) => {

  console.log('HOLA???');
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


export { router };
