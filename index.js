
const AudioServer  = require('./audioServer')
const StaticServer = require("./staticServer")
const config = require("./config")

const as = new AudioServer(config.audioServer)
const ss = new StaticServer(config.staticServer)

as.start()
ss.start()