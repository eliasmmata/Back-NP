import axios from 'axios';
import fs from 'fs';

import { getWpSiteId } from '../utils/dbUtils.js'

// Get All Post from a WP-site
const getPostsList = (req, res) => {

    const { wpSite } = req.params;
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
    const wpUrl = req.query.wpUrl;
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

    const authHeader = req.headers['authorization'];
    const { wpSiteId } = req.params;
    const nuevaEntrada = req.body;

    let wordpressApiPostUrl = '';
    let credentials = '';
    let wpSite = '';

    getWpSiteId(wpSiteId)
        .then((result) => {
            if (!result || typeof result !== 'object') {
                console.log('No se obtuvo ningún resultado válido de getWpSiteId');
                return res.status(400).json({ error: 'Error al obtener los datos del sitio WP de la BBDD' });
            }

            wpSite = result.api_url;

            if (!wpSite || typeof wpSite !== 'string' || wpSite.trim() === '') {
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

            console.log('username', username);
            console.log('password', password);
            console.log('wordpressApiPostUrl', wordpressApiPostUrl);
            console.log('nuevaEntrada', nuevaEntrada);

            return axios.post(wordpressApiPostUrl, nuevaEntrada, {
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                    // Other headers as required by the WordPress API
                }
            })
        })
        .then((response) => {
            if (response.status === 201 || response.status === 200) {
                console.log('Nuevo post creado con éxito');
                res.status(201).json({ message: `Nuevo post subido con éxito a ${wpSite}`, post: response.data });

            } else {
                res.status(response.status).json({ error: 'Fallo al subir el post. Pruebe otra vez' });
            }
        })
        .catch((error) => {
            if (!res.headersSent) {
                res.status(500).json({ message: 'Ocurrió un error inesperado al subir el nuevo post', error: error });

            }
        });
};


export {
    getPostsList,
    getPostById,
    postPostById
};

