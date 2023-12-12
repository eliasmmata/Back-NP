import axios from 'axios';

import { getWpSiteId } from '../utils/dbUtils.js'

// Get All Post from a WP-site
const getPostsList = (req, res) => {

    const { wpSiteId } = req.params;

    let wordpressApiPostUrl = '';
    let wpSite = '';

    getWpSiteId(wpSiteId)
        .then((result) => {
            if (!result || typeof result !== 'object') {
                console.log('No se obtuvo ningún resultado válido de getWpSiteId');
                return res.status(400).json({ error: 'Error al obtener los datos del sitio WP de la BBDD' });
            }

            wpSite = result.api_url;

            wordpressApiPostUrl = `https://${wpSite}/wp-json/wp/v2/posts`;

            if (!wpSite || typeof wpSite !== 'string' || wpSite.trim() === '') {
                console.log('No se encontró la URL válida del Sitio Wordpress');
                return res.status(400).json({ error: 'URL del Sitio Wordpress no reconocida' });
            }

            return axios.get(wordpressApiPostUrl)
        })
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

// Get single post by Id from a WP-site Id
const getPostById = (req, res) => {

    const postId = req.params.postId;
    const wp_site_id = req.query.wp_site_id;

    let wordpressApiPostUrl = '';
    let wpSite = '';

    getWpSiteId(wp_site_id)
        .then((result) => {
            if (!result || typeof result !== 'object') {
                console.log('No se obtuvo ningún resultado válido de getWpSiteId');
                return res.status(400).json({ error: 'Error al obtener los datos del sitio WP de la BBDD' });
            }
            wpSite = result.api_url;

            wordpressApiPostUrl = `https://${wpSite}/wp-json/wp/v2/posts/${postId}`;

            if (!wpSite || typeof wpSite !== 'string' || wpSite.trim() === '') {
                console.log('No se encontró la URL válida del Sitio Wordpress');
                return res.status(400).json({ error: 'URL del Sitio Wordpress no reconocida' });
            }

            return axios.get(wordpressApiPostUrl)
        })
        .then((response) => {
            if (response.status === 200) {
                res.status(200).json(response.data);
            } else {
                res.status(response.status).json({ error: 'Fallo al recuperar el post' });
            }
        })
        .catch((error) => {
            res.status(500).json({ message: `Ocurrió un error mientras se hacía el fetch del post en ${wpSite}`, error: error.message });
        });
};

// Insert new Entry Post in a WP-site
const postPostById = (req, res) => {

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

            wordpressApiPostUrl = `https://${wpSite}/wp-json/wp/v2/posts`;

            const { username, password } = result; // Assuming these fields exist in your result object

            credentials = Buffer.from(`${username}:${password}`).toString('base64');

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
            res.status(500).json({ message: 'Ocurrió un error inesperado al subir el nuevo post', error: error });
        });
};


export {
    getPostsList,
    getPostById,
    postPostById
};

