let socket = io(socketURL);

socket.on('all-matches', function(data) {
	prodeth.renderMatches(data)
});