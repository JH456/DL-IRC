let botModule = require('./bot_modules')

let config = {
    botName: process.env.IRC_BOT_NAME,
    nickservMessage: 'identify ' + process.env.IRC_NICKSERV_PASS,
    servers: [
        {
            serverName: process.env.IRC_SERVER_NAME,
            channels: [
                process.env.IRC_CHANNEL_NAME
            ]
        }
    ],
    botModule: 'irc',
    commandPrefix: '*',
    userModules: [
        'youtube',
        'silly'
    ]
}

let bot = botModule.create(config)
botModule.addListenersTo(bot, config)
