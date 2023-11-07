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
