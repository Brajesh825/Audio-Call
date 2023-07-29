// server.js
const express = require('express');
const app = express();
const http = require('http')
const server = http.createServer()
const { ExpressPeerServer } = require('peer');

const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.use('/peerjs', peerServer);
app.use(express.static(__dirname + '/public'));

http.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});
