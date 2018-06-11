const mongoose = require('mongoose');

const airdropParticipants = mongoose.Schema({
  address: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  verificationHash: { type: String, required: true, unique: true },
  verified: { type: Boolean, required: true, default: false }
});

module.exports = mongoose.model('AirdropParticipants', airdropParticipants);
