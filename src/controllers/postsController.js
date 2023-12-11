import axios from 'axios';

// Get All Post from a WP-site
const getPostsList = (req, res) => {

    const { wpSite } = req.params || "bangstudio.es";
    const wordpressApiUrl = `https://${wpSite}/wp-json/wp/v2/posts`;

    axios
        .get(wordpressApiUrl)
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

// Get single post by Id from a WP-site
const getPostById = (req, res) => {

    const postId = req.params.postId;
    const wpUrl = req.query.wpUrl || "bangstudio.es";
    const wordpressApiUrl = `https://${wpUrl}/wp-json/wp/v2/posts/${postId}`;

    axios
        .get(wordpressApiUrl)
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

// Insert new Entry Post in a WP-site
const postPostById = (req, res) => {
    const { wpSite } = req.params;
    const nuevaEntrada = req.body;
    const authHeader = req.headers['authorization'];

    let wordpressApiPostUrl = '';
    let credentials = '';

    if (!wpSite) {
        console.log('No se encontró la url del Sitio Wordpress');
        return res.status(400).json({ error: 'No se reconoció la url del Sitio Wordpress' });
    }

    if (!authHeader) {
        console.log('No se encontró o reconoció Authorization header en la solicitud.');
        return res.status(401).json({ error: 'No se reconocieron o introdujeron credenciales correctas' });
    }

    wordpressApiPostUrl = `https://${wpSite}/wp-json/wp/v2/posts`;

    const [username, ...passwordParts] = authHeader.split(':');
    const password = passwordParts.join(':').trim();
    credentials = Buffer.from(`${username}:${password}`).toString('base64');

    axios.post(wordpressApiPostUrl, nuevaEntrada, {
        headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            // Other headers as required by the WordPress API
        }
    })
    .then((response) => {
        if (response.status === 201 || response.status === 200) {
            console.log('Nuevo post creado con éxito');
            res.status(201).json({ message: 'Nuevo post creado con éxito', post: response.data });
        } else {
            res.status(response.status).json({ error: 'Failed to insert the post' });
        }
    })
    .catch((error) => {
        res.status(500).json({ message: 'An error occurred while posting the post', error: error });
    });
};


export {
    getPostsList,
    getPostById,
    postPostById
};

