import { connect } from "../database/database.js"

/* import newsService from '../services/newsService.js';  */

// Seleccionar las noticias  (query list=X para seleccionar un número determinado)
export async function getNews(req) {
    const connection = await connect();
    try {
      let query = 'SELECT * FROM news';
      if (req.query.list) {
        const listCount = parseInt(req.query.list, 10);
        if (!isNaN(listCount) && listCount > 0) {
          query += ` ORDER BY RAND() LIMIT ${listCount}`;
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

// Lista de noticias aleatorias (query ?list=X)
export async function getListOfNews(req, res, listCount) {
    const connection = await connect();

    try {
        const query = `SELECT * FROM news ORDER BY RAND() LIMIT ${listCount}`;
        const [rows] = await connection.query(query);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching random news:', error);
        res.status(500).json({ error: 'Internal Server Error' });
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


// Modifica la función saveSingleNews para que sea saveAllNews
export async function saveAllNews(req, res) {
    const connection = await connect();

    try {
        // Los datos de las noticias a insertar (reemplaza esto con tus datos)
        const newsData = [
            { id: 1, titular: 'Algo pasó en Estepona', descripcion: 'Explicación de lo que sucedió en Estepona. Detalles impactantes.', noticia: 'Cultura', redactor: 'Javier', provincia: 'Estepona' },
            { id: 2, titular: 'Noticias tecnológicas en Malaga', descripcion: 'Las últimas noticias tecnológicas en Malaga, ¡mantente informado!', noticia: 'Tecnología', redactor: 'Carlos', provincia: 'Malaga' },
            { id: 3, titular: 'Últimas novedades de salud en Rincón de la Victoria', descripcion: 'Mantente al tanto de las novedades de salud en Rincón de la Victoria.', noticia: 'Salud', redactor: 'Isabel', provincia: 'Rincón de la Victoria' },
            { id: 4, titular: 'Deportes en Fuengirola', descripcion: 'Noticias deportivas en Fuengirola. Resultados, eventos y más.', noticia: 'Deportes', redactor: 'Ana', provincia: 'Fuengirola' },
            { id: 5, titular: 'Economía en Benalmádena', descripcion: 'Actualidad económica en Benalmádena. Información financiera clave.', noticia: 'Economía', redactor: 'Laura', provincia: 'Benalmádena' },
            { id: 6, titular: 'Noticias internacionales en Mijas', descripcion: 'Últimas noticias internacionales en Mijas. Cobertura global.', noticia: 'Internacional', redactor: 'Sergio', provincia: 'Mijas' },
            { id: 7, titular: 'Política en Álora', descripcion: 'Política en Álora: Análisis, debates y decisiones gubernamentales.', noticia: 'Política', redactor: 'Luis', provincia: 'Álora' },
            { id: 8, titular: 'Entretenimiento en Marbella', descripcion: 'Entretenimiento en Marbella: ¡Diversión asegurada para todos!', noticia: 'Entretenimiento', redactor: 'Marta', provincia: 'Marbella' },
            { id: 9, titular: 'Avances científicos en Campillos', descripcion: 'Los avances científicos en Campillos te sorprenderán. Descúbrelos aquí.', noticia: 'Ciencia', redactor: 'Diego', provincia: 'Campillos' },
            { id: 10, titular: 'Medio Ambiente en Torremolinos', descripcion: 'Medio Ambiente en Torremolinos: Cuida nuestro planeta y mantente informado.', noticia: 'Medio Ambiente', redactor: 'Elena', provincia: 'Torremolinos' }
        ];

        // Consulta SQL para insertar los datos
        const query = `INSERT INTO news (id, titular, descripcion, noticia, redactor, provincia) VALUES ?`;

        console.log('Database connection successful'); // Agregar este log
        console.log(query);
        // Ejecuta la consulta
        const [results] = await connection.query(query, [newsData.map(news => [news.id, news.titular, news.descripcion, news.noticia, news.redactor, news.provincia])]);

        res.json({
            message: 'News inserted successfully',
            insertedCount: results.affectedRows
        });
    } catch (error) {
        console.error('Error inserting news:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        connection.release();
    }
};
