const express = require('express'),
  router = express.Router(),
  routeHelpers = require('./routeHelpers');

const { common } = routeHelpers;

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('home', {
    ...common,
    title: 'World Cup Ethereum Betting',
    breadcrumb: ''
  });
});

router.get('/faq', (req, res, next) => {
  res.render('faq', {
    ...common,
    title: 'FAQ',
    breadcrumb: 'FAQ'
  });
});

router.get('/how-it-works', (req, res, next) => {
  res.render('how_it_works', {
    ...common,
    title: 'How it works',
    breadcrumb: 'How it works'
  });
});

module.exports = router;
