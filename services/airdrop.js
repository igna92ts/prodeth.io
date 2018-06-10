const AirdropParticipant = require('../models/airdrop_participant');

exports.findParticipant = email => {
  return AirdropParticipant.findOne({ email });
};

exports.createParticipant = (email, address, token) => {
  const participant = new AirdropParticipant({
    email,
    address,
    verificationHash: token
  });
  return participant.save();
};

exports.findByToken = token => {
  return AirdropParticipant.findOne({ verificationHash: token });
};
