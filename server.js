let botModule = require('./bot_modules')

let configs = {
    "irc": {
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
    },
    "slack": {
        apiToken: process.env.SLACK_API_TOKEN,
        botModule: 'slack',
        commandPrefix: '+',
        userModules: [
            'youtube',
            'silly'
        ]
    }
}

let configName = process.env.BOT_MODULE
let config = configs[configName]
if (config) {
    console.log("Starting a(n) " + configName + " bot.")
    let bot = botModule.create(config)
    botModule.addListenersTo(bot, config)
} else {
    console.log("Error! Invalid bot module!")
}
