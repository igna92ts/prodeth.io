const request = require('request');


const apiKey = 'RQBPFA2V6GCPXV3RBX3R6AXKF3X78UYKP9';
const apiHost = 'http://api.etherscan.io';
const apiUrls = {
	  transactions: `${apiHost}/api?module=account&action=txlist&apikey=${apiKey}&sort=desc&address=`
};

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

exports.getTransactions = accounts => {
  return Promise.all(accounts.map(a => getTransaction(a.address)));
};

