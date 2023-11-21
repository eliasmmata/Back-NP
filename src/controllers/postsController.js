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
    const { wpSite } = req.params || 'bangstudio.es';
    const apiUrl = `https://${wpSite}/wp-json/wp/v2/posts`;

    axios
        .get(apiUrl)
        .then((response) => {
            if (response.status === 200) {
                res.status(200).json(response.data);
            } else {
                res.status(response.status).json({ error: 'Failed to retrieve the post' });
            }
        })
        .catch((error) => {
            res.status(500).json({ message: 'An error occurred while fetching the post', error: error.message });
        });
};

// AXIOS Get single post by Id
const getPostById = (req, res) => {
    const postId = req.params.postId;
    const wpUrl = req.query.wpUrl || 'bangstudio.es';
    const apiUrl = `https://${wpUrl}/wp-json/wp/v2/posts/${postId}`;

    axios
        .get(apiUrl)
        .then((response) => {
            if (response.status === 200) {
                res.status(200).json(response.data);
            } else {
                res.status(response.status).json({ error: 'Failed to retrieve the post' });
            }
        })
        .catch((error) => {
            res.status(500).json({ message: 'An error occurred while fetching the post', error: error.message });
        });
};

// Insertar noticia en un wpSite
const postPostById = (req, res) => {

    const { wpSite } = req.params;
    const apiUrl = `https://${wpSite}/wp-json/wp/v2/posts`;

    // Detalles de la entrada del blog a crear
    const nuevaEntrada = {
        title: 'Título de la entrada',
        content: 'Contenido de la entrada',
        status: 'draft', // Cambia el estado según lo necesites: 'publish', 'draft', etc.
    };

    axios.post(apiUrl, nuevaEntrada, {
        auth: {
            username: 'eliasmmata',
            password: 'V0fo zSAG yi25 bmyB ET09 QhCm',
        },
    })
        .then((response) => {
            if (response.status === 201 || response.status === 200) {
                res.status(201).json({ message: 'Post created successfully', post: response.data });
            } else {
                res.status(response.status).json({ error: 'Failed to insert the post' });
            }
        })
        .catch((error) => {
            console.log('ENTRA O ERROR TEST POST??')
            res.status(500).json({ message: 'An error occurred while posting the post', error: error });
        });
};


export {
    getPostsList,
    getPostById,
    postPostById
};

