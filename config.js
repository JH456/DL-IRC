/*
*    Author: Jim Harris
*    Config file for PannIRC
*    Includes all modules and bot info (responses, server and channel info, command info)
*/

var youTube = require('./youTubeModule.js');

exports.data = {
    modules: {
        youTube: youTube
    },
    runTime: {}
}

exports.config = {
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
    responseConfig: [
        {
            triggers: ['oman'],
            response: 'yemen'
        }
    ],
    commands: [
        {
            names: ['download'],
            functions: [
                {
                    argsCode: ['i'],
                    funcRef: youTube.getByNumber
                },
                {
                    argsCode: ['a'],
                    funcRef: youTube.getByName
                }
            ],
            allowedUsers: [
                process.env.IRC_DOWNLOAD_USER
            ],
            desc: 'Prints information about the given command in chat. It first'
                + ' prints all argument types in order. Then, it prints all of'
                + ' the commands names. If the command has no other names, it'
                + ' will print nothing. All names will be lowercase, but case'
                + ' does not matter in the call. It then prints a description'
                + ' of the function. The description should print the purposes'
                + ' of all arguments, and mention the arguments in the order'
                + ' that they are needed in the function call.'
        },
        {
            names: ['lookup'],
            functions: [
                {
                    argsCode: ['i', 'a'],
                    funcRef: youTube.lookupMultiple
                },
                {
                    argsCode: ['a'],
                    funcRef: youTube.lookupOne
                }
            ],
            allowedUsers: 'ALL',
            desc: 'Prints information about the given command in chat. It first'
                + ' prints all argument types in order. Then, it prints all of'
                + ' the commands names. If the command has no other names, it'
                + ' will print nothing. All names will be lowercase, but case'
                + ' does not matter in the call. It then prints a description'
                + ' of the function. The description should print the purposes'
                + ' of all arguments, and mention the arguments in the order'
                + ' that they are needed in the function call.'
        }
    ]
};

