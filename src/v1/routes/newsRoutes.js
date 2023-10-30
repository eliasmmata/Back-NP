const express = require("express");
/* const apicache = require("apicache"); */

const newsController = require("../../controllers/newsController");

const router = express.Router();

/* const cache = apicache.middleware; */

// ----- GET --------------------------------------------------------------------

router.get('/news/count', newsController.getNewsCount);

// API CACHE
/* router.get("/", cache("2 minutes"), newsController.getNewsCount); */


router.get('/news', (req, res) => {
  const listCount = req.query.list ? parseInt(req.query.list, 10) : undefined;
  newsController.getNews(req, res, listCount);
});

// ----- POST --------------------------------------------------------------------

router.post('/news', newsController.saveSingleNews);


// ----- PUT --------------------------------------------------------------------


router.put('/news/:id', newsController.updateSingleNews);


// ----- DELETE --------------------------------------------------------------------

router.delete('/news/:id', newsController.deleteSingleNews);


module.exports = router;


