import express from 'express';
import axios from 'axios';

const router = express.Router();

// Import files
import * as loginController from '../../controllers/loginController.js'

// ----- POST --------------------------------------------------------------------

// Post login credentials

/**
 * @openapi
 * /api/v1/login:
 *   post:
 *     summary: Authenticate user and generate token
 *     description: Endpoint to authenticate user and generate JWT token
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful login, returns JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       '401':
 *         description: Invalid credentials
 */

router.post('/login', loginController.logIn);

router.get('/listusers', loginController.allUsers);


export { router };