const silly = require('./service')

module.exports = {
    commands: [
        {
            names: ['count', 'c'],
            functions: [
                {
                    argsCode: 0,
                    funcRef: silly.printCount
                }
            ],
            allowedUsers: 'ALL',
            desc: 'Prints out how many messages had yo in them'
        },
    ],
    responses: [
        {
            triggers: ['oman'],
            response: 'yemen'
        },
        {
            triggers: ['if you know what i mean'],
            response: 'hey yo!'
        }
    ],
    messageHandler: silly.yoHandler
}
