const express = require('express'),
  router = express.Router(),
  matchService = require('../services/matches'),
  errors = require('../errors');

/* GET home page. */
router.post('/match', async (req, res, next) => {
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

router.delete('/match', async (req, res, next) => {
  const { countryCode1, countryCode2, date, timezone } = req.query;
  if (countryCode1 && countryCode2 && date && timezone) {
    try {
      const result = await matchService.deleteMatch(countryCode1, countryCode2, date, timezone);
      res.send(result);
    } catch (err) {
      res.send(errors.badRequest(err));
    }
  } else {
    res.send(errors.badRequest('Wrong parameters'));
  }
});

router.post('/pay', async (req, res, next) => {
  const { countryCode1, countryCode2, date, timezone, winnerCode } = req.body;
  if (countryCode1 && countryCode2 && date && winnerCode) {
    try {
      const result = await matchService.payMatch(countryCode1, countryCode2, date, timezone, winnerCode);
      res.send(result);
    } catch (err) {
      res.send(errors.badRequest(err));
    }
  } else {
    res.send(errors.badRequest('Wrong parameters'));
  }
});

module.exports = router;
