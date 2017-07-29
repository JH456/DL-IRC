function create(config) {
    const botModule = require("./" + config.botModule)
    return botModule.create(config)
}

function addListenersTo(bot, config) {
    const botModule = require("./" + config.botModule)
    return botModule.addListenersTo(bot, config)
}

module.exports = {
    create,
    addListenersTo
}
