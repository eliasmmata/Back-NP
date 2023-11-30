
import { connect } from "../database/database.js"
import wpSitesQueries from "../database/queries/wpsitesQueries.js";

// AXIOS Get All Post from a WP-site
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

// AXIOS Modify name to a existent WP-site
const putWpSite = async (req, res) => {

    const connection = await connect();

    try {
        const wp_id  = req.params.wpSite; // Assuming the ID of the WordPress site to update is in the URL parameter
        const { wp_name } = req.body; // New name for the WordPress site from the request body

        console.log('wp_id', wp_id);
        console.log('wp_name', wp_name);

        // Ensure that wp_name exists in the request body
        if (!wp_name || !wp_id) {
            return res.status(400).json({ error: 'wp_id or New wp_name not provided' });
        }

        // AÑADIR Y QUITAR LA QUERY DE AQUÍ
        /* const query = wpSitesQueries.wpupdateName; */

        const updateQuery = `UPDATE wordpress SET name = "${wp_name}" WHERE wordpress_id = ${wp_id}`;
        const updateParams = [wp_name, wp_id]; // Assuming wp_id is used for identifying the site

        await connection.query(updateQuery, updateParams);

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
    putWpSite
};

