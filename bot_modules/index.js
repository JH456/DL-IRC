'use strict'

const messageService = require('../services/message')

function create(config) {
    const botModule = require("./" + config.botModule)
    return botModule.create(config)
}

function addListenersTo(bot, config) {
    const botModule = require("./" + config.botModule)
    let handler = messageService.createHandler(bot, config.userModules,
        config.commandPrefix)
    return botModule.addListenersTo(bot, handler, config)
}

module.exports = {
    create,
    addListenersTo
}
