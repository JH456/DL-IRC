const youtube = require('./service')

module.exports = {
    commands: [
        {
            names: ['download'],
            functions: [
                {
                    argsCode: ['s'],
                    funcRef: youtube.getByName
                }
            ],
            allowedUsers: [
                process.env.IRC_DOWNLOAD_USER
            ],
            desc: 'Downloads a Youtube video by name.'
        },
        {
            names: ['lookup'],
            functions: [
                {
                    argsCode: ['i', 's'],
                    funcRef: youtube.lookupMultiple
                },
                {
                    argsCode: ['s'],
                    funcRef: youtube.lookupOne
                }
            ],
            allowedUsers: 'ALL',
            desc: 'Looks up a Youtube video by name.'
        }
    ],
    responses: [],
    messageHandler: null
}
