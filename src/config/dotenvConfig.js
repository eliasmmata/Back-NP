// dotenvConfig.js
import { config as dotenv } from 'dotenv';

if (process.env.NODE_ENV === 'production') {
    console.log('Cargando archivo .env en producción');
    dotenv({ path: '.env' }); // Load the production environment file
} else {
    console.log('Cargando archivo .env.local en desarrollo local');
    dotenv({ path: '.env.local' }); // Load the local/development environment file
}
