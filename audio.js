
const AudioServer = require('./Server/audioServer')
const config = require("./config")

const as = new AudioServer(config.audioServer)

as.start()