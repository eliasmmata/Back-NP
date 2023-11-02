import { connect } from "../database"

const getNews = async () => {
    const connection = await connect();
    try {
        let query = 'SELECT * FROM news';
        const [rows] = await connection.query(query);
        res.json(rows);
        /* return DB.workouts; */
    } catch (error) {
        throw { status: 500, message: error };
    }
};

const saveSingleNews = async (newSingleNews) => {
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

        const isAlreadyAdded =
            results.findIndex((news) => news.name === newSingleNews.name) > -1;
        if (isAlreadyAdded) {
            throw {
                status: 400,
                message: `News with the name '${newSingleNews.name}' already exists`,
            };
        }
        /* results.push(newSingleNews);
        return newSingleNews; */
    } catch (error) {
        throw { status: error?.status || 500, message: error?.message || error };
    }
};

module.exports = { getNews, saveSingleNews };