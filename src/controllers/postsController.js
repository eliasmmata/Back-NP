
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

// AXIOS Get Media ID (feature_media) by PostID
const getMediaByPostId = (req, res) => {
    const postId = req.params.postId;
    const apiUrl = `https://bangstudio.es/wp-json/wp/v2/posts/${postId}`;

    axios
        .get(apiUrl)
        .then((response) => {
            if (response.status === 200) {
                // Check if media attachments exist
                const featuredMediaId = response.data.featured_media;
                if (featuredMediaId) {
                    console.log('This post has media attached.');
                } else {
                    console.log('This post does not have any attached media.');
                }
                res.json({ featured_media_id: featuredMediaId });

            } else {
                res.status(response.status).json({ error: 'Failed to retrieve the post media' });
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ error: 'An error occurred while fetching the post media' });
        });
};

// get media details by feature_media ID
const getFeaturedMediaDetails = (req, res) => {
    const featuredMediaId = req.params.featuredMediaId;

    console.log('featuredMediaId', featuredMediaId);
    const apiUrl = `https://bangstudio.es/wp-json/wp/v2/media/${featuredMediaId}`;

    axios
        .get(apiUrl)
        .then((response) => {
            if (response.status === 200) {
                const mediaDetails = response.data;
                if (mediaDetails) {
                    console.log('Featured Media Details:', mediaDetails);
                } else {
                    console.log('This post does not have any attached media.');
                }
                res.json({ media_details: mediaDetails });

            } else {
                res.status(response.status).json({ error: 'Failed to retrieve featured media details' });
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ error: 'An error occurred while fetching featured media details' });
        });
};



module.exports = {
    getPostsList,
    getPostById,
    getMediaByPostId,
    getFeaturedMediaDetails
};

