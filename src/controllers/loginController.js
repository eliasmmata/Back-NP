import axios from 'axios';
import jwt from 'jsonwebtoken';

import { connect } from "../database/database.js"

// import { getWpSiteId } from '../utils/dbUtils.js'

const logIn = async (req, res) => {
    const { username, password } = req.body;

    try {
        const connection = await connect(); // Establish database connection

        // Fetch user data from the database based on username
        const [rows] = await connection.execute('SELECT password FROM wordpress WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'User not found' });
        }

        const user = rows[0];
        const storedPassword = user.password; // Retrieve hashed password from the database

        if (password === storedPassword) {
            // Passwords match, generate JWT token
            const token = generateToken(username);
            res.json({ token });
        } else {
            // Invalid credentials
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error authenticating user' });
    }
};

function generateToken(username) {
    // Generate JWT token
    return jwt.sign({ username }, 'yourSecretKey', { expiresIn: '24h' });
}
export {
    logIn,
    generateToken

};
