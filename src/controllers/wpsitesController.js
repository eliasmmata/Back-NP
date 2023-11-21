
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

export { getWpSites };

