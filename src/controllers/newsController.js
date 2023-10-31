import { connect } from "../database/database"


// Contador de noticias
const getNewsCount = async (req, res) => {
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

/* const newsService = require("../services/newsService"); */

// Seleccionar las noticias  (query list=X para seleccionar un número determinado)
const getNews = async (req, res) => {

   /*  const getNews = newsService.getNews(); */
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
      res.json(rows);
    } catch (error) {
      console.error('Error fetching news:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      connection.release();
    }
  };

// Lista de noticias aleatorias (query ?list=X)
const getListOfNews = async (req, res, listCount) => {
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
const getSingleNews = async (req, res) => {
    const connection = await connect();

    console.log('HOLA getSingleNews!!');
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

// Insertar noticia en base de datos
const saveSingleNews = async (req, res) => {
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
const updateSingleNews = async (req, res) => {
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
const deleteSingleNews = async (req, res) => {
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

module.exports = {
    getNews,
    getListOfNews,
    getSingleNews,
    getNewsCount,
    saveSingleNews,
    updateSingleNews,
    deleteSingleNews
  };