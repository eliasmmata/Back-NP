const wpSitesWithCategories = `
                                SELECT
                                wordpress_id as wp_id, wordpress.name as wp_name, api_url,
                                category_id as cat_id, category.name as cat_name, external_id
                                FROM wordpress
                                LEFT JOIN category ON wordpress.wordpress_id = category.wordpress_wordpress_id;
                                `;

const wpNewSite = `
                    INSERT INTO
                    wordpress (name, api_url, username, password)
                    VALUES (?, ?, ?, ?)
                    `;


const wpUpdateName = `
                        UPDATE
                        wordpress SET name = ?
                        WHERE wordpress_id = ?
                    `;

export default {
    wpSitesWithCategories,
    wpNewSite,
    wpUpdateName
};
