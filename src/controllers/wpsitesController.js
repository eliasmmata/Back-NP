
import bcrypt from 'bcrypt';

import { connect } from "../database/database.js"
import wpSitesQueries from "../database/queries/wpsitesQueries.js";

// Get All Post from a WP-site
const getWpSites = async (req, res) => {
    const connection = await connect();

    try {
        const query = wpSitesQueries.wpSitesWithCategories;

        const [rows] = await connection.query(query);

        const wpsites = [];

        rows.forEach(item => {
            const existingItem = wpsites.find(i => i.wp_id === item.wp_id);
            const { wp_id, wp_name, api_url, ...rest } = item;
            const categoryData = { ...rest };

            if (existingItem) {
                existingItem.categories.push(categoryData);
            } else {
                wpsites.push({
                    wp_id,
                    wp_name,
                    api_url,
                    categories: [categoryData]
                });
            }
        });

        res.status(200).json(wpsites);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching wordpress sites' });
        throw error;
    } finally {
        connection.release();
    }
};

// Create new WP-site
const postWpSite = async (req, res) => {
    const connection = await connect();

    try {
        const { wp_name: name, api_url, username, password } = req.body;

        if (!name || !api_url) {
            return res.status(400).json({ error: 'Name or API URL not provided' });
        }

        if (!name || !api_url || !username || !password) {
            return res.status(400).json({ error: 'Name, API URL, username, or password not provided' });
        }

        const query = wpSitesQueries.wpNewSite
            .replace('?', `"${name}"`)
            .replace('?', `"${api_url}"`)
            .replace('?', `"${username}"`)
            .replace('?', `"${password}"`)

        await connection.query(query);

        res.status(201).json({ message: 'WordPress site created successfully' });
    } catch (error) {
        console.error('Error creating new WordPress site:', error);
        res.status(500).json({ error: 'Error creating new WordPress site' });
    } finally {
        connection.release();
    }
};

// AXIOS Modify name to a existent WP-site
const putWpSite = async (req, res) => {

    const connection = await connect();

    try {
        const wp_id = req.params.wpSiteId; // Assuming the ID of the WordPress site to update is in the URL parameter
        const { wp_name } = req.body; // New name for the WordPress site from the request body

        // Ensure that wp_name exists in the request body
        if (!wp_name || !wp_id) {
            return res.status(400).json({ error: 'wp_id or New wp_name not provided' });
        }

        const query = wpSitesQueries.wpUpdateName
            .replace('?', `"${wp_name}"`) // Replace the first placeholder with wp_name
            .replace('?', wp_id); // Replace the second placeholder with wp_id

        await connection.query(query);

        res.status(200).json({ message: 'Wp site name updated' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating WordPress site name' });
        throw error;
    } finally {
        connection.release();
    }
};


export {
    getWpSites,
    putWpSite,
    postWpSite
};

