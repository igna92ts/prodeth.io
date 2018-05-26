const mongoose = require('mongoose');

const account =   {
  address: { type: String, required: true, unique: true },
  privateKey: { type: String, required: true, unique: true },
  transactions: [{
    id: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    sender: { type: String, required: true },
    time: { type: Date, required: true  }
  }],
  country: {
    name: { type: String, required: true },
	  code: { type: String, required: true },
	  flag: { type: String, required: true }
  }
};

const matchSquema = mongoose.Schema({
  team1: account,
  team2: account,
  date: { type: Date, required: true },
  payed: { type: Boolean, required: true },
});

module.exports = mongoose.model('Match', matchSquema);
