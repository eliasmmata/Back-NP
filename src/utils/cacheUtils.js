import redisClient from '../config/redisClient.js';

import { fetchDataFromExternalAPI } from './apiUtils.js'
import { fetchDataFromDatabase, getTotalItemCountFromDatabase } from './dbUtils.js'

// Función para obtener datos de la caché o la API externa
async function getDataFromCacheOrExternalAPI(RedisKeyName, url) {
    try {
        // Intenta recuperar datos de Redis
        const cachedData = await redisClient.get(RedisKeyName);

        if (cachedData) {
            console.log('Datos en caché', cachedData);
            return JSON.parse(cachedData);
        } else {
            // Los datos no están en caché, obténlos de la fuente externa
            const responseData = await fetchDataFromExternalAPI(url);
            // Almacena los datos de respuesta en Redis para futuras solicitudes
            await redisClient.set(RedisKeyName, JSON.stringify(responseData));

            return responseData;
        }
    } catch (error) {
        throw new Error('Error en la obtención de datos');
    }
}

// Función para obtener datos de la caché o la API externa
async function getDataFromCacheOrDB(RedisKeyName, req) {

    try {
        // Try to retrieve data from Redis
        const cachedData = await redisClient.get(RedisKeyName);

        // Fetch the total count of items from the database
        const totalCount = await getTotalItemCountFromDatabase();

        if (cachedData) {

            const cachedItems = JSON.parse(cachedData);

            // Check if you need more items from the database
            if (cachedItems.length !== totalCount) {
                // Calculate how many more items you need
                const remainingItemsCount = totalCount - cachedItems.length;

                // Fetch the remaining items from the database
                const remainingItems = await fetchDataFromDatabase(req, remainingItemsCount);

                // Create a set to track the IDs that have already been added
                const addedIDs = new Set(cachedItems.map(item => item.id));

                // Merge the cached items with the remaining items
                let responseData = cachedItems.slice(); // Copy the cached items

                // Add the remaining items to responseData, avoiding repeated IDs
                for (const item of remainingItems) {
                    if (!addedIDs.has(item.id)) {
                        responseData.push(item);
                        addedIDs.add(item.id);
                    }
                }
                // Update the Redis cache with the merged data
                await redisClient.set(RedisKeyName, JSON.stringify(responseData));

                return responseData;
            } else {
                // If you already have all the items in the cache, return the cached data
                return cachedItems.slice(0, req.query.list || cachedItems.length);
            }
        } else {

            // Data is not in cache, fetch it from the database
            const responseData = await fetchDataFromDatabase(req, totalCount);

            console.log('responseData', responseData);

            // Store the response data in Redis for future requests
            await redisClient.set(RedisKeyName, JSON.stringify(responseData));

            return responseData;
        }
    } catch (error) {
        throw new Error('Error in data retrieval');
    }
}

export { getDataFromCacheOrExternalAPI, getDataFromCacheOrDB };
