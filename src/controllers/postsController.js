import axios from 'axios';
import fs from 'fs';


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

// Insert Post with Image in a WP-site
const postPostById = (req, res) => {

    const { wpSite } = req.params;

    const nuevaEntrada = req.body;
    const imageUrl = req.body.imageUrl;

    const authHeader = req.headers['authorization'];

    let wordpressApiMediaUrl = '';
    let wordpressApiPostUrl = '';
    let credentials = '';
    let nombreArchivoImagen = ''

    if (wpSite) {
        wordpressApiMediaUrl = `https://${wpSite}/wp-json/wp/v2/media`;
        wordpressApiPostUrl = `https://${wpSite}/wp-json/wp/v2/posts`;
    } else {
        console.log('No se encontró la url del Sitio Wordpress');
        return res.status(400).json({ error: 'No se reconoció la url del Sitio Wordpress' });
    }

    if (authHeader) {
        const [username, ...passwordParts] = authHeader.split(':');
        const password = passwordParts.join(':').trim();
        credentials = Buffer.from(`${username}:${password}`).toString('base64');
      } else {
        console.log('No se encontró o reconoció Authorization header en la solicitud.');
        return res.status(401).json({ error: 'No se reconocieron o introdujeron credenciales correctas' });
      }


    if (imageUrl) {
        const partesURL = imageUrl.split('/');
        nombreArchivoImagen = partesURL[partesURL.length - 1]
        // Remove the 'imageUrl' property from the object (no lo queremos añadir al post)
        delete nuevaEntrada.imageUrl;
    } else {
        console.log('No se encontró url de imagen para adjuntar');
        return res.status(400).json({ error: 'No se encontró url de imagen para adjuntar' });
    }

    axios
        .get(imageUrl, { responseType: 'arraybuffer' })
        .then((response) => {
            // Convert image to buffer
            const imageData = Buffer.from(response.data, 'binary');
            fs.writeFileSync(`${nombreArchivoImagen}`, imageData);

            // Upload the image to WordPress media library
            return axios.post(wordpressApiMediaUrl, imageData, {
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'image/jpeg',
                    'Accept': 'image/jpeg',
                    'Content-Disposition': `attachment; filename="${nombreArchivoImagen}"`,
                }
            });
        })
        .then((uploadResponse) => {

            // Eliminar el archivo de imagen descargado después de haberlo subido al sitio wp
            fs.unlinkSync(`${nombreArchivoImagen}`);

            // Id de la imagen asociada al post
            const featuredMediaId = uploadResponse.data.id;

            // Añadir featuredMediaId en el objeto nuevaEntrada
            nuevaEntrada.featured_media = featuredMediaId;

            return axios.post(wordpressApiPostUrl, nuevaEntrada, {
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                    // Other headers as required by the WordPress API
                }
            });
        })
        .then((response) => {
            if (response.status === 201 || response.status === 200) {
                console.log('Nuevo post creado con éxito con imagen adjunta subida al sitio');
                res.status(201).json({ message: 'Nuevo post creado con éxito con imagen adjunta subida al sitio', post: response.data });
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

