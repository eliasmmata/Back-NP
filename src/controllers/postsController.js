import axios from 'axios';
import fs from 'fs';


// Get All Post from a WP-site
const getPostsList = (req, res) => {
    const { wpSite } = req.params || 'bangstudio.es';
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
    const wpUrl = req.query.wpUrl || 'bangstudio.es';
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

    const wordpressApiMediaUrl = `https://${wpSite}/wp-json/wp/v2/media`;
    const wordpressApiPostUrl = `https://${wpSite}/wp-json/wp/v2/posts`;

    const username = 'Elias Moreno';
    const password = 'V0fo zSAG yi25 bmyB ET09 QhCm';
    const credentials = Buffer.from(`${username}:${password}`).toString('base64');

    /* const imageUrl = 'https://bangstudio.es/wp-json/wp/v2/media/262481'; */
    const imageUrl = 'https://bangstudio.es/wp-content/uploads/2021/07/tecnicas-personalizar-zapatillas-entrada.jpeg'; // Replace with your image URL

    axios
        .get(imageUrl, { responseType: 'arraybuffer' })
        .then((response) => {
            // Convert image to buffer
            const imageData = Buffer.from(response.data, 'binary');
             fs.writeFileSync('Z-image.jpeg', imageData);

            // Upload the image to WordPress media library
            return axios.post(wordpressApiMediaUrl, imageData, {
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'image/jpeg',
                    'Accept': 'image/jpeg',
                    'Content-Disposition': 'attachment; filename="Z-image.jpeg"',
                }
            });
        })
        .then((uploadResponse) => {

            const featuredMediaId = uploadResponse.data.id;

            const nuevaEntrada = {
                /* date:	"2023-12-05T21:20:40", */
                /* date_gmt:	"2023-12-05T19:20:40", */
                /* slug:	"test-imagen-3-titulo-de-la-entrada", */
                // status choose -> publish, future, draft, pending, private
                status: "publish",
                title: "Test IMAGEN 3 Título de la entrada",
                content: "Test Contenido de la entrada",
                excerpt:	"Resumen breve del post.",
                /* author:	1, */
                featured_media: featuredMediaId,
                // comment_status choose -> open, close
                comment_status:	"open",
                // ping_status choose -> open, close
                /* ping_status: "closed", */
                /* sticky:	false, */
                // template: The theme file to use to display the post,
                /* template: "", */
                // format choose -> standard, aside, chat, gallery, link, image, quote, status, video, audio
                format:	"standard",
                /* password:	"A password to protect access to the content and excerpt.", */
                /* meta:	"Meta fields", */
                categories:	[1],
                tags: []
            };

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
                res.status(201).json({ message: 'New post created with the uploaded image as the featured image', post: response.data });
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

