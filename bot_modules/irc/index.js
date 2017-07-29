const irc = require('irc')

function create(config) {
    var bot = new irc.Client(config.servers[0].serverName, config.botName, {
        channels: config.servers[0].channels,
        userName: config.botName.toLowerCase(),
        port: 6697,
        secure: true,
        selfSigned: true,
        realName: config.botName
    });

    bot.addListener("registered", function(message) {
        bot.say("nickserv", config.nickservMessage);
    });

    bot.config = config

    return bot
}

function addListenersTo(bot, handler, config) {
    bot.addListener("message", function (from, to, text, message) {
        let isPm = to === config.botName

        let messageInfo = {
            from,
            text,
            message,
            channel: isPm ? from : message.args[0],
            isPm
        }

        handler.handle(messageInfo)
    });
}

module.exports = {
    create,
    addListenersTo
}
