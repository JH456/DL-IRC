let botModule = require('./bot_modules')

let ircConfig = {
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

let slackConfig = {
    apiToken: process.env.SLACK_API_TOKEN,
    botModule: 'slack',
    commandPrefix: '+',
    userModules: [
        'youtube',
        'silly'
    ]
}

let config = process.env.BOT_MODULE === 'slack' ? slackConfig : ircConfig

let bot = botModule.create(config)
botModule.addListenersTo(bot, config)
