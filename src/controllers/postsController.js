
// Worpdress api package
const WPCOM = require('wpcom');
var wpcom = WPCOM();
const site = wpcom.site('en.blog.wordpress.com');
const axios = require('axios');

// Get all posts (Library WPCOM)
const getPostsList = (req, res) => {
    site.postsList((err, data) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(data);
    });
};

// AXIOS Get single post by Id
const getPostById = (req, res) => {
    const postId = req.params.postId;
    /* const apiUrl = `https://public-api.wordpress.com/rest/v1.1/sites/en.blog.wordpress.com/posts/${postId}`; */
    const apiUrl = `https://bangstudio.es/wp-json/wp/v2/posts/${postId}`;

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

// AXIOS Get Post Media by PostID
const getMediaByPostId = (req, res) => {
    const postId = req.params.postId;
    /* const apiUrl = `https://public-api.wordpress.com/rest/v1.1/sites/en.blog.wordpress.com/posts/${postId}`; */
    const apiUrl = `https://bangstudio.es/wp-json/wp/v2/media/parent=${postId}`;

    axios
        .get(apiUrl)
        .then((response) => {
            // Check if the request was successful (status code 200)
            if (response.status === 200) {
                console.log('Medios adjuntos:', response.data);
                res.json(response.data); // Send the post data in the response
            } else {
                res.status(response.status).json({ error: 'Failed to retrieve the post media' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'An error occurred while fetching the post media' });
        });
};



module.exports = {
    getPostsList,
    getPostById,
    getMediaByPostId
};

