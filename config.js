module.exports = {
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
    botModules: [
        'youtube'
    ],
    responseConfig: [
        {
            triggers: ['oman'],
            response: 'yemen'
        }
    ]
};

