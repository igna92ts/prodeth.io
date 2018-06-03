const express = require('express'),
  router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('home', {
    title: "World Cup Ethereum Betting",
    breadcrumb: "",
    socketURL: "http://localhost:3000"
  });
});

router.get('/faq', (req, res, next) => {
  res.render('faq', {
    title: "FAQ",
    breadcrumb: "FAQ",
    socketURL: "http://localhost:3000"
  });
});

router.get('/how-it-works', (req, res, next) => {
  res.render('how_it_works', {
    title: "How it works",
    breadcrumb: "How it works",
    socketURL: "http://localhost:3000"
  });
});

module.exports = router;
