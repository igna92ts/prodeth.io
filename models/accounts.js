const mongoose, { Schema } = require('mongoose');

const accountSchema = new Schema({
  address: { type: String, required: true },
  privateKey: { type: String, required: true },
  transactions: [{
    id: { type: String, required: true },
    amount: { type: Number, required: true },
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    time: { type: Date },
    isError: { type: Number }
  }]
});

module.exports = mongoose.model('Account', accountSchema);
