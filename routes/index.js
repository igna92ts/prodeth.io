const express = require('express'),
  router = express.Router();

const common = {
  ropstenProvider: process.env.ROPSTEN_PROVIDER || '',
  socketURL: process.env.API_BASE_URL
}

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

router.get('/airdrop', (req, res, next) => {
  res.render('airdrop', {
    ...common,
    title: 'Register for Airdrop',
    breadcrumb: 'Airdrop'
  });
});

module.exports = router;
