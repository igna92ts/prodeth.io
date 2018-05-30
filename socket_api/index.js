const io = require('socket.io')(),
  http = require('http'),
  Match = require('../models/match'),
  etherscan = require('../services/ethscan_service');

const getMatches = async () => {
  return await Match.find({}, { 'team1.privateKey': 0, 'team2.privateKey': 0 });
};

io.on('connection', async socket => {
  const matches = await getMatches();

  socket.emit('all-matches', matchesCalculations(matches));
});

const delay = () => new Promise((resolve, reject) => setTimeout(resolve, 250));

setInterval(async () => {
  const rawMatches = await getMatches();
  let emit = false;
  const matches = await rawMatches.reduce(async (p, m) => {
    const transactions = await etherscan.getTransactions(m);
    if (
      transactions.team1.length > m.team1.transactions.length ||
        transactions.team2.length > m.team2.transactions.length
    ) {
      m.team1.transactions = transactions.team1;
      m.team2.transactions = transactions.team2;
      emit = true;
    }
    const savedMatch = await m.save();
    await delay();
    const resolvedMatches = await p;
    return [...resolvedMatches, savedMatch];
  });
  if (emit) io.emit('all-matches', matchesCalculations(matches));
}, 60000);

const matchesCalculations = rawMatches => {
  //  calculate balance and payoff
  const matches = rawMatches.map(m => {
    m = m.toJSON();
    //  balance
    m.team1.balance = m.team1.transactions.reduce((total, t) => total + t.amount, 0);
    m.team2.balance = m.team2.transactions.reduce((total, t) => total + t.amount, 0);

    //  payoff
    m.team1.payoff = 1.00;
    m.team2.payoff = 1.00;

    if (m.team1.balance > 0 || m.team2.balance > 0) {
      if(m.team1.balance <= 0){
        m.team1.payoff = m.team2.balance * 10;
      } else {
        m.team1.payoff = (m.team2.balance / m.team1.balance < 1) ? m.team2.balance / m.team1.balance + 1 : m.team2.balance / m.team1.balance;
      }

      if(m.team2.balance <= 0){
        m.team2.payoff = m.team1.balance * 10;
      } else {
        m.team2.payoff = (m.team1.balance / m.team2.balance < 1) ? m.team1.balance / m.team2.balance + 1 : m.team1.balance / m.team2.balance;
      }
    }

    return m;
  });

  return matches;
};

module.exports = io;
