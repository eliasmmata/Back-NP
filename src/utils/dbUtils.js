import { connect } from "../database/database.js"

import { getNews } from "../controllers/newsController.js"

// Function to fetch data from the database
async function fetchDataFromDatabase(req, totalCount) {
    try {
        // Call the getNews function to fetch data from the database
        const data = await getNews(req);
        return data;

    } catch (error) {
        throw new Error('Error fetching news from the database');
    }
}

// Function to fetch the total count of news from the database
async function getTotalItemCountFromDatabase() {
    const connection = await connect();
    try {
        const query = 'SELECT COUNT(*) AS total FROM news';
        const [rows] = await connection.query(query);

        return rows[0].total;
    } catch (error) {
        throw new Error('Error fetching total news count from the database');
    }
}

// Function to fetch the total count of news from the database
async function getWpSiteId(wordpress_id) {
    const connection = await connect();
    try {
        const query = `SELECT wordpress_id, name, api_url, username, password FROM wordpress WHERE wordpress_id = "${wordpress_id}"`;

        const [rows] = await connection.query(query);

        return rows[0];
    } catch (error) {
        throw new Error('Error fetching Wp Site Id from the database');
    }
}

export { fetchDataFromDatabase, getTotalItemCountFromDatabase, getWpSiteId };
