const io = require('socket.io')();
const http = require('http');
const Match = require('../models/match');

io.on('connection', async socket => {

  const rawMatches = await Match
    .find({}, { 'team1.privateKey': 0, 'team2.privateKey': 0 });
  
  const matches = rawMatches.map(m => {
    m = m.toJSON();
    m.team1.balance = m.team1.transactions.reduce((total, t) => total + t.amount, 0);
    m.team2.balance = m.team2.transactions.reduce((total, t) => total + t.amount, 0);
    return m;
  });

  socket.emit('all-matches', matches);
});

// io.emit('evento', 'esto emite a todo el mundo')

module.exports = io;
