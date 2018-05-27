const express = require('express'),
  router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('home');
});

router.get('/faq', (req, res, next) => {
  res.render('faq');
});

router.get('/how-it-works', (req, res, next) => {
  res.render('how_it_works');
});

module.exports = router;
