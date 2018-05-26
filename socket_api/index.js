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

setInterval(() => {
  const matches = await getMatches();
  
  //TODO: trae las transacciones de la API, y guarda solo las nuevas en la base de datos.
  //Tambien si es que hay nuevas, hacer un  io.emit para avisarle a todos los clientes que hay
  //transacciones nuevas.

  await etherscan.getTransactions(matches);
},60000)

const getMatches = async () => {
  return await Match
  .find({}, { 'team1.privateKey': 0, 'team2.privateKey': 0 });
}

// io.emit('evento', 'esto emite a todo el mundo')

module.exports = io;
