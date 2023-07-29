const { PeerServer } = require("peer");

class AudioServer {
    constructor(config) {
        this.config = config;
    }

    start() {
        const peerServer = PeerServer(this.config);
        peerServer.on('connection', (client) => {
            console.log(`New client connected with ID: ${client.getId()}`);
        });
        console.log('Audio Server started on ', this.config.port);
    }
}

module.exports = AudioServer