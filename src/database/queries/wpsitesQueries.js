const wpSitesWithCategories = `
                                SELECT
                                wordpress_id as wp_id, wordpress.name as wp_name, api_url,
                                category_id as cat_id, category.name as cat_name, external_id
                                FROM wordpress
                                INNER JOIN category ON wordpress.wordpress_id = category.wordpress_wordpress_id;
                                `;

// Other queries related to WordPress sites can be added here

export default {
    wpSitesWithCategories,
};
