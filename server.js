// server.js
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const { ExpressPeerServer } = require('peer');

const peerServer = ExpressPeerServer(http, {
  debug: true,
});

app.use('/peerjs', peerServer);
app.use(express.static(__dirname + '/public'));

http.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});
