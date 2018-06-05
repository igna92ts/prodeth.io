const express = require('express'),
  router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('home', {
    title: "World Cup Ethereum Betting",
    breadcrumb: "",
    socketURL: process.env.API_BASE_URL
  });
});

router.get('/faq', (req, res, next) => {
  res.render('faq', {
    title: "FAQ",
    breadcrumb: "FAQ",
    socketURL: process.env.API_BASE_URL
  });
});

router.get('/how-it-works', (req, res, next) => {
  res.render('how_it_works', {
    title: "How it works",
    breadcrumb: "How it works",
    socketURL: process.env.API_BASE_URL
  });
});

module.exports = router;
