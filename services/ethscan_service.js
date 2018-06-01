const request = require('request'),
  Match = require('../models/match'),
  Web3 = require('web3'),
  web3 = new Web3(),
  helpers = require('../helpers');

const apiKey = 'RQBPFA2V6GCPXV3RBX3R6AXKF3X78UYKP9';
const apiHost = 'http://api.etherscan.io';
const apiUrls = {
  transactions: `${apiHost}/api?module=account&action=txlist&startblock=5694716&apikey=${apiKey}&sort=desc&address=`
};

const getTransaction = address => {
  return new Promise((resolve, reject) => {
    request.get(
      {
        url: `${apiUrls.transactions}${address}`,
        json: true
      },
      (err, res, body) => {
        if (err) return reject(err);
        else if (!body.result) return reject(body);
        const results = body.result.filter(t => t.from !== address && parseInt(t.isError) === 0);
        return resolve(
          results.map(r => {
            return {
              id: r.hash,
              amount: web3.utils.fromWei(r.value, 'ether'),
              sender: r.from,
              time: new Date(r.timeStamp * 1000)
            };
          })
        );
      }
    );
  });
};

exports.getTransactions = async match => {
  const transactions = await Promise.all([
    getTransaction(match.team1.address),
    getTransaction(match.team2.address)
  ]);
  return {
    team1: transactions[0],
    team2: transactions[1]
  };
};
