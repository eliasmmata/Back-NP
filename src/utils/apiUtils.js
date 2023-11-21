import axios from 'axios';

// Función para obtener datos de la API externa
async function fetchDataFromExternalAPI(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (axiosError) {
        throw new Error('Error en la llamada a la API externa');
    }
}

export { fetchDataFromExternalAPI };

