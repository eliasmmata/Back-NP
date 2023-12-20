import axios from 'axios';
import jwt from 'jsonwebtoken';

import { connect } from "../database/database.js"

// import { getWpSiteId } from '../utils/dbUtils.js'

function generateToken(username) {
    // Generate JWT token
    return jwt.sign({ username }, 'yourSecretKey', { expiresIn: '24h' });
}


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

const allUsers = async (req, res) => {
    const connection = await connect();
    try {
        let query = 'SELECT id, user_name, email, role, fb_userid, google_userid FROM users';

        const [rows] = await connection.query(query);

        res.json(rows); // Sending the fetched users as a JSON response to the client
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Error fetching users' }); // Sending an error response in case of failure
    } finally {
        connection.release();
    }
};


export {
    generateToken,
    logIn,
    allUsers

};
