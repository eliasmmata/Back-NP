
// Worpdress api package
const WPCOM = require('wpcom');
var wpcom = WPCOM();
const axios = require('axios');


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
    getMediaByPostId,
    getFeaturedMediaDetails
};

