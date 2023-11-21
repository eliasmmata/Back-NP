import axios from 'axios';
// Worpdress api package (Not used now)
import WPCOM from 'wpcom';
const wpcom = WPCOM();

// GET ALL POSTS (Library WPCOM)
const getPostsListTest = (req, res) => {
    const site = wpcom.site('en.blog.wordpress.com');
    site.postsList((err, data) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(data);
    });
};

export {
    getPostsListTest
};


