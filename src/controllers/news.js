import { connect } from "../config/database"

// Seleccionar todas las noticias
export const getNews = async (req, res) => {
    const connection = await connect();

    try {
      const [rows] = await connection.query('SELECT * FROM news');
      res.json(rows);
    } catch (error) {
      console.error('Error fetching news:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      connection.release();
    }
  };

// Seleccionar noticia por Id
export const getSingleNews = async (req, res) => {
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
export const getNewsCount = async (req, res) => {
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

// Lista de 5 noticias aleatorias
export const getListOfNews = async (req, res) => {
    const connection = await connect();

    try {
      const [rows] = await connection.query('SELECT * FROM news ORDER BY RAND() LIMIT 5');
      res.json(rows);
    } catch (error) {
      console.error('Error fetching random news:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      connection.release();
    }
  };

// Insertar noticia en base de datos
export const saveSingleNews = async (req, res) => {
    const connection = await connect();
    const [results] = await connection.query('INSERT INTO news(titular, descripcion, noticia, redactor, provincia) VALUES (?,?,?,?,?)',
    [req.body.titular,req.body.descripcion, req.body.noticia, req.body.redactor, req.body.provincia]
    )

    res.json({
        id: results.insertId,
        ...req.body
    })
}

export const updateSingleNews = async (req, res) => {
    const connection = await connect();
    await connection.query('UPDATE news SET ? WHERE id = ?', [
        req.body,
        req.params.id
    ])
    res.sendStatus(204)
}

export const deleteSingleNews = async (req, res) => {
    const connection = await connect();
    await connection.query('DELETE FROM news WHERE id = ?', [
        req.params.id
    ])
     res.sendStatus(204)
}