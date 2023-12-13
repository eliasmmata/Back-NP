const wpSites = `
                                SELECT
                                    wordpress_id as wp_id,name as wp_name, api_url
                                FROM wordpress;
                                `;

const wpSitesWithCategories = `
                                SELECT
                                    wordpress_id as wp_id, wordpress.name as wp_name, api_url,
                                    category_id as cat_id, category.name as cat_name, category.external_id as cat_external_id,
                                    tag_id as tag_id, tags.name as tag_name, tags.external_id as tag_external_id
                                FROM wordpress
                                LEFT JOIN category ON wordpress.wordpress_id = category.wordpress_wordpress_id
                                LEFT JOIN tags ON wordpress.wordpress_id = tags.wordpress_wordpress_id;
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
    wpSites,
    wpSitesWithCategories,
    wpNewSite,
    wpUpdateName
};
