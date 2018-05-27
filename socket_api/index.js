const io = require('socket.io')();
const http = require('http');
const Match = require('../models/match');
const etherscan = require('../services/ethscan_service');

const getMatches = async () => {
  return Match.find({}, { 'team1.privateKey': 0, 'team2.privateKey': 0 });
};

io.on('connection', async socket => {
  const rawMatches = await getMatches();
  //  calculate balance and payoff
  const matches = rawMatches.map(m => {
    m = m.toJSON();
    //  balance
    m.team1.balance = m.team1.transactions.reduce((total, t) => total + t.amount, 0);
    m.team2.balance = m.team2.transactions.reduce((total, t) => total + t.amount, 0);

    //  payoff
    m.team1.payoff = 1.00;
    m.team2.payoff = 1.00;

    if (m.team1.balance !== 0 && m.team2.balance !== 0) {
      m.team1.payoff = (m.team2.balance / m.team1.balance < 1) ? m.team2.balance / m.team1.balance + 1 : m.team2.balance / m.team1.balance;
      m.team2.payoff = (m.team1.balance / m.team2.balance < 1) ? m.team1.balance / m.team2.balance + 1 : m.team1.balance / m.team2.balance;
    }

    return m;
  });

  socket.emit('all-matches', matches);
});

setInterval(async () => {
  const rawMatches = await getMatches();
  let emit = false;
  const matches = await Promise.all(
    rawMatches.map(async m => {
      const transactions = await etherscan.getTransactions(m);
      if (
        transactions.team1.length > m.team1.transactions.length ||
        transactions.team2.length > m.team2.transactions.length
      ) {
        m.team1.transactions = transactions.team1;
        m.team2.transactions = transactions.team2;
        emit = true;
      }
      return m.save();
    })
  );
  await matches.map(async m => m.save());
  if (emit) io.emit('all-matches', matches);
}, 60000);

// io.emit('evento', 'esto emite a todo el mundo')

module.exports = io;
