const io = require('socket.io')();
const http = require('http');


// HACELO SI QUERES TODO BIEN VILLERO ACA Y YO DESPUES LO ORDENO UN POCO
io.on('connection', socket => {
  console.log('user connected');
  socket.emit('nombredelevento', { aca_va: 'lo que queres emitir' });
});

// io.emit('evento', 'esto emite a todo el mundo')

module.exports = io;
