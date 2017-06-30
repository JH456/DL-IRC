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
                    argsCode: ['i', 's'],
                    funcRef: youtube.lookupMultiple
                },
                {
                    argsCode: ['s'],
                    funcRef: youtube.lookupOne
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

}
