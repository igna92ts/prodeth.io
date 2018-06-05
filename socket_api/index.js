const io = require('socket.io')(),
  http = require('http'),
  Match = require('../models/match'),
  etherscan = require('../services/ethscan_service'),
  matchService = require('../services/matches'),
  helpers = require('../helpers');

io.on('connection', async socket => {
  const matches = await matchService.getMatches();
  socket.emit('all-matches', matchService.matchesCalculations(matches));
});

setInterval(async () => {
  try {
    const rawMatches = await matchService.getMatches();
    let emit = false;
    const matches = await rawMatches.reduce(async (p, m) => {
      if(new Date(m.date) > new Date()){
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
        await helpers.delay(250);
        const resolvedMatches = await p;
        return [...resolvedMatches, savedMatch];
      }
    }, []);
    if (emit) io.emit('all-matches', matchService.matchesCalculations(matches));
  } catch (err) {
    console.log(err);
  }
}, 60000);

module.exports = io;
