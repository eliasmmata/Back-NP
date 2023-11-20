
import axios from 'axios';

// Worpdress api package (Not used now)
import WPCOM from 'wpcom';
const wpcom = WPCOM();

// Get all posts (Library WPCOM)
/* const getPostsListTest = (req, res) => {
    const site = wpcom.site('en.blog.wordpress.com');
    site.postsList((err, data) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(data);
    });
}; */

// AXIOS Get All Post from a WP-site
const getPostsList = (req, res) => {
    const { wpSite } = req.params || 'bangstudio.es';
    const apiUrl = `https://${wpSite}/wp-json/wp/v2/posts`;

    axios
        .get(apiUrl)
        .then((response) => {
            // Check if the request was successful (status code 200)
            if (response.status === 200) {
                res.json(response.data); // Send the post data in the response
            } else {
                res.status(response.status).json({ error: 'Failed to retrieve the post' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'An error occurred while fetching the post' });
        });
};


// AXIOS Get single post by Id
const getPostById = (req, res) => {
    const postId = req.params.postId;
    /* const apiUrl = `https://public-api.wordpress.com/rest/v1.1/sites/en.blog.wordpress.com/posts/${postId}`; */
    const wpUrl = req.query.wpUrl || 'bangstudio.es';
    const apiUrl = `https://${wpUrl}/wp-json/wp/v2/posts/${postId}`;

    axios
        .get(apiUrl)
        .then((response) => {
            // Check if the request was successful (status code 200)
            if (response.status === 200) {
                res.json(response.data); // Send the post data in the response
            } else {
                res.status(response.status).json({ error: 'Failed to retrieve the post' });
            }
        })
        .catch((error) => {
            console.log('ENTRA O QUE ERROR??')
            res.status(500).json({ error: 'An error occurred while fetching the post' });
        });
};


export { getPostsList, getPostById };

