const io = require('socket.io')();
const http = require('http');

const apiKey = "RQBPFA2V6GCPXV3RBX3R6AXKF3X78UYKP9";
const apiHost = "http://api.etherscan.io";
const apiUrls = {
	transactions: apiHost+"/api?module=account&action=txlist&apikey="+apiKey+"&sort=desc&address="
}

let accounts = [
	{
		private_key:"randomrandomrandomrandomrandomrandomrandomrandomrandomrandom",
		address:"0x5c4bbb9c71cdbe4036c8e152950cfedfc487d103",
		transactions:[],
	},
	{
		private_key:"randomraomaosmfropiewoifawsoifsoidjsjijfjijfejoliwesjfoifjoi",
		address:"0x869a0e39f995422e5863b7690ab9b89c68e86bcf",
		transactions:[]
	}
]

for(let i = 0; i< accounts.length; i++){
		let result = await doRequest(apiUrls.transactions + accounts[i].address)
		//LO QUE SACAS DEL RESULT, LO METES EN address[i].transactions
}


// HACELO SI QUERES TODO BIEN VILLERO ACA Y YO DESPUES LO ORDENO UN POCO
io.on('connection', socket => {
  console.log('user connected');
  socket.emit('nombredelevento', { aca_va: 'lo que queres emitir' });
});

// io.emit('evento', 'esto emite a todo el mundo')

module.exports = io;