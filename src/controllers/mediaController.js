import axios from 'axios';
import fs from 'fs';

import { getWpSiteId } from '../utils/dbUtils.js'

// AXIOS Get Media ID (feature_media) by PostID
const getMediaByPostId = (req, res) => {

    const postId = req.params.postId;

    const wpSite = req.query.wpUrl;

    const apiUrl = `https://${wpSite}/wp-json/wp/v2/posts/${postId}`;

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
                res.status(response.status).json({ message: 'Failed to retrieve the post media' });
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ message: 'An error occurred while fetching the post media', error: error.message });
        });
};

// get media details by feature_media ID
const getFeaturedMediaDetails = (req, res) => {

    const featuredMediaId = req.params.featuredMediaId;

    const wpSite = req.query.wpUrl;

    const apiUrl = `https://${wpSite}/wp-json/wp/v2/media/${featuredMediaId}`;

    axios
        .get(apiUrl)
        .then((response) => {
            if (response.status === 200) {
                const mediaDetails = response.data;
                if (mediaDetails) {
                    console.log('Featured Media Details:', mediaDetails);

                    console.log('PATH', mediaDetails.link);

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
            res.status(500).json({ message: 'An error occurred while fetching featured media details', error: error.message });
        });
};

// AXIOS Post Image to a WP Site (by its Id)
const postImageToWpSite = (req, res) => {

    const authHeader = req.headers['authorization'];
    const { wpSiteId } = req.params;
    const { image_path } = req.body;

    let wordpressApiMediaUrl = '';
    let credentials = '';
    let nombreArchivoImagen = '';
    let wpSite = '';

    getWpSiteId(wpSiteId)
        .then((result) => {
            if (!result || typeof result !== 'object') {
                console.log('No se obtuvo ningún resultado válido de getWpSiteId');
                return res.status(400).json({ error: 'Error al obtener los datos del sitio WP de la BBDD' });
            }

            wpSite = result.api_url;

            wordpressApiMediaUrl = `https://${wpSite}/wp-json/wp/v2/media`;

            if (!wpSite || typeof wpSite !== 'string' || wpSite.trim() === '') {
                console.log('No se encontró la URL válida del Sitio Wordpress');
                return res.status(400).json({ error: 'URL del Sitio Wordpress no reconocida' });
            }

            if (!authHeader) {
                console.log('No se encontró o reconoció Authorization header en la solicitud.');
                return res.status(401).json({ error: 'No se reconocieron o introdujeron credenciales correctas' });
            }

            const [username, ...passwordParts] = authHeader.split(':');
            const password = passwordParts.join(':').trim();
            credentials = Buffer.from(`${username}:${password}`).toString('base64');

            if (!image_path) {
                console.log('No se encontró url de imagen');
                return res.status(400).json({ error: 'No se encontró url de imagen' });
            }

            const partesURL = image_path.split('/');
            nombreArchivoImagen = partesURL[partesURL.length - 1];

            return axios.get(image_path, { responseType: 'arraybuffer' });
        })
        .then((response) => {
            const imageData = Buffer.from(response.data, 'binary');

            try {
                fs.writeFileSync(`${nombreArchivoImagen}`, imageData);

                return axios.post(wordpressApiMediaUrl, imageData, {
                    headers: {
                        'Authorization': `Basic ${credentials}`,
                        'Content-Type': 'image/jpeg',
                        'Accept': 'image/jpeg',
                        'Content-Disposition': `attachment; filename="${nombreArchivoImagen}"`,
                    }
                });
            } catch (error) {
                console.error('Error al escribir el archivo de imagen:', error);
                return res.status(500).json({ error: 'Error al escribir el archivo de imagen' });
            }
        })
        .then((response) => {
            if (response.status === 201 || response.status === 200) {
                console.log('Nueva imagen subida con éxito ');
                res.status(201).json({ message: `Nueva imagen ${nombreArchivoImagen} subida con éxito a ${wpSite}`, post: response.data });
            } else {
                res.status(response.status).json({ error: 'Fallo al insertar la imagen' });
            }
        })
        .catch((error) => {
            if (!res.headersSent) {
                res.status(500).json({ message: `Ocurrió un error inesperado al subir la imagen al sitio`, error: error });
            }
        })
        .finally(() => {
            if (nombreArchivoImagen) {
                fs.unlinkSync(`${nombreArchivoImagen}`);
            }
        });
};


export {
    getMediaByPostId,
    getFeaturedMediaDetails,
    postImageToWpSite
};

