const mongoose = require('mongoose');

const airdropRegistrationSchema = mongoose.Schema(
  {
    address: { type: String, required: true },
    email: { type: String, required: true },
    verificationHash: { type: String, required: true },
    verified: { type: Boolean, required: true }
  },
  { autoIndex: false }
);

module.exports = mongoose.model('AirdropRegistration', airdropRegistrationSchema);
