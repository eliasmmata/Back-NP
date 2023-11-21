import axios from 'axios';

const fetchImageDetails = async (wpSiteOfImage, featureMediaId) => {
    try {
        const imageUrl = `https://${wpSiteOfImage}/wp-json/wp/v2/media/${featureMediaId}`;

        const response = await axios.get(imageUrl);
        const imageData = response.data; // This will contain image details

        console.log(imageData);
        return;
        return imageData;
    } catch (error) {
        console.error('Error fetching image details:', error);
        throw error;
    }
};

export { fetchImageDetails };
