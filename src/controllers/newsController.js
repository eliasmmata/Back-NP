import { connect } from "../database/database.js"

// Seleccionar las noticias  (query list=X para seleccionar un número determinado)
export async function getNews(req) {
    const connection = await connect();
    try {
        let query = 'SELECT * FROM news';

        if (typeof req.query.list !== 'undefined') {
            const listCount = parseInt(req.query.list, 10);
            if (!isNaN(listCount) && listCount > 0) {
                query += ` LIMIT ${listCount}`;
            }
        }

        const [rows] = await connection.query(query);
        return rows;
    } catch (error) {
        console.error('Error fetching news:', error);
        throw error;
    } finally {
        connection.release();
    }
};

// Seleccionar noticia por Id
export async function getSingleNews(req, res) {
    const connection = await connect();
    try {
        const [rows] = await connection.query('SELECT * FROM news WHERE id = ?', [
            req.params.id
        ]);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching single news:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        connection.release();
    }
};

// Contador de noticias
export async function getNewsCount(req, res) {
    const connection = await connect();

    try {
        const [rows] = await connection.query('SELECT COUNT(*) FROM news');

        res.json(rows[0]["COUNT(*)"]);
    } catch (error) {
        console.error('Error fetching news count:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        connection.release();
    }
};


// Insertar noticia en base de datos
export async function saveSingleNews(req, res) {
    const connection = await connect();

    try {
        const [results] = await connection.query(
            'INSERT INTO news(titular, descripcion, noticia, redactor, provincia) VALUES (?,?,?,?,?)',
            [req.body.titular, req.body.descripcion, req.body.noticia, req.body.redactor, req.body.provincia]
        );

        res.json({
            id: results.insertId,
            ...req.body
        });
    } catch (error) {
        console.error('Error inserting news:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        connection.release();
    }
};

// Actualizar noticia por Id
export async function updateSingleNews(req, res) {
    const connection = await connect();

    try {
        const query = 'UPDATE news SET ? WHERE id = ?';
        await connection.query(query, [req.body, req.params.id]);
        res.sendStatus(204);
    } catch (error) {
        console.error('Error updating news:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        connection.release();
    }
};

// Borrar noticia por Id
export async function deleteSingleNews(req, res) {
    const connection = await connect();

    try {
        const query = 'DELETE FROM news WHERE id = ?';
        await connection.query(query, [req.params.id]);
        res.sendStatus(204);
    } catch (error) {
        console.error('Error deleting news:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        connection.release();
    }
};


// AÑADE A LA BASE DE DATOS UNA NOTICIA
export async function saveAllNews(req, res) {

    const connection = await connect();

    console.log('connection:', connection);


    try {
        // Los datos de las noticias a insertar (reemplaza esto con tus datos)
        const newsData = [
            { titular: 'Añadir titular noticia default', descripcion: 'Añadir descripción noticia default', noticia: 'Categoría Noticia', redactor: 'Nombre redactor', provincia: 'Comarca de Málaga' },
        ]
        // Consulta SQL para insertar los datos
        const query = `INSERT INTO news (titular, descripcion, noticia, redactor, provincia) VALUES ?`;

        // Ejecuta la consulta
        const [results] = await connection.query(query, [newsData.map(news => [news.titular, news.descripcion, news.noticia, news.redactor, news.provincia])]);

        res.json({
            message: 'Noticia añadida correctamente a BD',
            insertedCount: results.affectedRows
        });
    } catch (error) {
        console.error('Error al insertar la noticia:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        connection.release();
    }
};
