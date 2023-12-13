
import { connect } from "../database/database.js"

import axios from 'axios';

import wpSitesQueries from "../database/queries/wpsitesQueries.js";

// Get All Post from a WP-site
const getWpSites = async (req, res) => {
    const connection = await connect();

    try {
        const query = wpSitesQueries.wpSites;
        const [rows] = await connection.query(query);

        const siteRequests = rows.map(async row => {
            const apiUrl = row.api_url;

            const categoriesRequest = axios.get(`https://${apiUrl}/wp-json/wp/v2/categories`);
            const tagsRequest = axios.get(`https://${apiUrl}/wp-json/wp/v2/tags`);

            try {
                const [categoriesResponse, tagsResponse] = await Promise.all([categoriesRequest, tagsRequest]);
                const categories = categoriesResponse.data.map(category => ({
                    id: category.id,
                    name: category.name,
                    slug: category.slug,
                    parent: category.parent,
                    description: category.description
                }));

                const tags = tagsResponse.data.map(tag => ({
                    id: tag.id,
                    name: tag.name,
                    slug: tag.slug,
                    parent: tag.parent,
                    description: tag.description
                }));
                return {
                    wp_id: row.wp_id,
                    wp_name: row.wp_name,
                    api_url: row.api_url,
                    categories,
                    tags
                };
            } catch (error) {
                console.error(`Error fetching data from ${apiUrl}:`, error);
                return {
                    wp_id: row.wp_id,
                    wp_name: row.wp_name,
                    api_url: row.api_url,
                    categories: [],
                    tags: []
                };
            }
        });

        const wpsites = await Promise.all(siteRequests);
        res.status(200).json(wpsites);
    } catch (error) {
        console.error('Error fetching WordPress sites:', error);
        res.status(500).json({ error: 'Error fetching WordPress sites:', error });
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
        console.error('Error updating WordPress site name:', error);
        res.status(500).json({ error: 'Error updating WordPress site name' });
    } finally {
        connection.release();
    }
};


export {
    getWpSites,
    putWpSite,
    postWpSite
};

