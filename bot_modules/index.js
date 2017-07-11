function start(config) {
    const botModule = require("./" + config.botModule)
    return botModule.start(config)
}

module.exports = {
    start
}
