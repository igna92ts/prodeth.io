const io = require('socket.io')();
const http = require('http');
const Match = require('../models/match');
const etherscan = require('../services/ethscan_service');

io.on('connection', async socket => {

  const rawMatches = await getMatches(); 
  const matches = rawMatches.map(m => {
    m = m.toJSON();
    m.team1.balance = m.team1.transactions.reduce((total, t) => total + t.amount, 0);
    m.team2.balance = m.team2.transactions.reduce((total, t) => total + t.amount, 0);
    return m;
  });

  socket.emit('all-matches', matches);
});

setInterval(async () => {
  const rawMatches = await getMatches();

  const matches = await Promise.all(rawMatches.map(async m => {
    const transactions = await etherscan.getTransactions(m);
    m.team1.transactions = mergeTransactions(m.team1.toJSON().transactions, transactions.team1);
    m.team2.transactions = mergeTransactions(m.team2.toJSON().transactions, transactions.team2);
    return m;
  }));
  await matches.map(async m => await m.save());
  io.emit('all-matches', matches);
}, 60000);

const mergeTransactions = (oldTransactions, newTransactions) => {
  return oldTransactions.concat(
    newTransactions.filter(i => oldTransactions.indexOf(i) == -1)
  );
};

const getMatches = async () => {
  return await Match
  .find({}, { 'team1.privateKey': 0, 'team2.privateKey': 0 });
};

// io.emit('evento', 'esto emite a todo el mundo')

module.exports = io;
