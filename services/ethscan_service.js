const request = require('request');
const Match = require('../models/match');
const Web3 = require('web3');
const web3 = new Web3();
const moment = require('moment-timezone');

const apiKey = 'RQBPFA2V6GCPXV3RBX3R6AXKF3X78UYKP9';
const apiHost = 'http://api.etherscan.io';
const apiUrls = {
  transactions: `${apiHost}/api?module=account&action=txlist&apikey=${apiKey}&sort=desc&address=`
};

exports.createMatch = () => {
	const account1 = web3.eth.accounts.create();
	const account2 = web3.eth.accounts.create();

	const match = new Match({
	  team1: {
		  address: account1.address,
      privateKey: account1.privateKey,
      transactions: [],
      country: {
        name: "Russia",
	      code: "RUS",
        flag: "russia"
		  }
	  },
    team2: {
		  address: account2.address,
      privateKey: account2.privateKey,
      transactions: [],
      country: {
        name: "Saudi Arabia",
	      code: "KSA",
        flag: "saudi-arabia"
	    }
	  },
    date: moment.tz("2018-06-14 18:00", "Europe/Moscow").valueOf(),
    payed: false
	});
	
	match.save();
}

const getTransaction = address => { 
  return new Promise((resolve, reject) => {
    request.get({
      url: `${apiUrls.transactions}${address}`,
      json: true
    }, (err, res, body) => {
      if (err) return reject(err);
      return resolve(body);
    });
  });
};

exports.getTransactions = match => {
  const transactions = await Promise.all([getTransaction(match.team1.account), getTransaction(match.team2.account)]);
  return { team1: transactions[0], team2:transactions[1] };
};

