const express = require('express'),
  router = express.Router(),
  routeHelpers = require('./routeHelpers'),
  jwt = require('jsonwebtoken'),
  moment = require('moment'),
  airdropService = require('../services/airdrop'),
  errors = require('../errors'),
  mailerService = require('../services/mailer');

const { common } = routeHelpers;

router.get('/', (req, res, next) => {
  res.render('airdrop', {
    ...common,
    title: 'Register for Airdrop',
    breadcrumb: 'Airdrop'
  });
});

const createToken = (email, address) => {
  return jwt.sign(
    {
      participant: {
        email,
        address
      },
      created_at: moment.now()
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d'
    }
  );
};

router.post('/register', async (req, res, next) => {
  try {
    if (req.body.email && req.body.address) {
      const existingParticipant = await airdropService.findParticipant(req.body.email);
      if (existingParticipant && existingParticipant.verified)
        throw errors.badRequest('You are already registered');
      else if (existingParticipant) await existingParticipant.remove();

      const token = createToken(req.body.email, req.body.address);
      await airdropService.createParticipant(req.body.email, req.body.address, token);
      await mailerService.sendAirdropRegistrationEmail(req.body.email, token);
      res.send(200);
    } else {
      throw errors.badRequest('Wrong Parameters');
    }
  } catch (err) {
    res.send(err.message);
  }
});

router.patch('/register', async (req, res, next) => {
  try {
    if (req.body.token) {
      const participant = await airdropService.findByToken(req.body.token);
      if (!participant || participant.verified) throw errors.badRequest('Invalid Token');

      jwt.verify(req.body.token, process.env.JWT_SECRET, (err, decoded) => {
        if (err || participant.address !== decoded.participant.address) {
          throw errors.badRequest('Invalid Token');
        } else {
          participant.verified = true;
          return participant
            .save()
            .then(() => res.send(200))
            .catch(dbErr => {
              throw dbErr;
            });
        }
      });
    } else {
      throw errors.badRequest('Wrong Parameters');
    }
  } catch (err) {
    res.send(err.message);
  }
});

module.exports = router;
