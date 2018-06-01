const express = require('express'),
  router = express.Router(),
  matchService = require('../services/matches'),
  errors = require('../errors');

/* GET home page. */
router.post('/', async (req, res, next) => {
  const { countryCode1, countryCode2, date, timezone } = req.body;
  if (countryCode1 && countryCode2 && date && timezone) {
    try {
      const result = await matchService.createMatch(countryCode1, countryCode2, date, timezone);
      res.send(result);
    } catch (err) {
      res.send(errors.badRequest(err));
    }
  } else {
    res.send(errors.badRequest('Wrong parameters'));
  }
});

module.exports = router;
