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

// Función para obtener datos de la API externa
async function fetchDataFromExternalAPI() {
  try {
    const response = await axios.get("https://rickandmortyapi.com/api/character");
    return response.data;
  } catch (axiosError) {
    throw new Error('Error en la llamada a la API externa');
  }
}

// Función para obtener datos de la caché o la API externa
async function getDataFromCacheOrAPI() {
  try {
    // Intenta recuperar datos de Redis
    const cachedData = await redisClient.get('characters');

    if (cachedData) {
      console.log('Datos en caché', cachedData);
      return JSON.parse(cachedData);
    } else {
      // Los datos no están en caché, obténlos de la fuente externa
      const responseData = await fetchDataFromExternalAPI();
      // Almacena los datos de respuesta en Redis para futuras solicitudes
      await redisClient.set('characters', JSON.stringify(responseData));
      console.log('Datos de respuesta externa', responseData);
      return responseData;
    }
  } catch (error) {
    throw new Error('Error en la obtención de datos');
  }
}

router.get('/cache', async (req, res) => {
  try {
    const data = await getDataFromCacheOrAPI();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error en la ruta:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});



export { router };
