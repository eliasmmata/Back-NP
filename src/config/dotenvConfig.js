// dotenvConfig.js
import { config as dotenv } from 'dotenv';

if (process.env.NODE_ENV === 'production') {
    dotenv({ path: '.env' }); // Load the production environment file
} else {
    dotenv({ path: '.env.local' }); // Load the local/development environment file
}
