let config = require('../../config')
var argFunctions = require('../../argFunctions');

function getFunction(name) {
    let command;
    config.botModules.forEach(moduleName => {
        let moduleCommands = require('../../bot_modules/' + moduleName).commands
        for (var i = 0; i < moduleCommands.length; i++) {
            var names = moduleCommands[i].names;
            for (var j = 0; j < names.length; j++) {
                if (names[j] == name) command = moduleCommands[i];
            }
        }
    })
    return command;
}

function handleCommand(bot, messageInfo) {
    let text = messageInfo.text
    if (text.indexOf('*') == 0 && text.length > 1 && text[1] != ' ') {

        let args = text.split(' ');
        let command = args.splice(0, 1)[0].substring(1).toLowerCase()

        var action = getFunction(command);

        if (action) {
            argFunctions.call(bot, messageInfo, args, action);
        } else {
            bot.say(messageInfo.channel, 'Command not found');
        }
    }
}

function handleResponse(bot, messageInfo) {
    for (var i = 0; i < config.responseConfig.length; i++) {
        for (var j = 0; j < config.responseConfig[i].triggers.length; j++) {
            if (messageInfo.text.toLowerCase().indexOf(
            config.responseConfig[i].triggers[j]) != -1) {
                bot.say(messageInfo.channel, config.responseConfig[i].response);
            }
        }
    }
}

module.exports = {
    handleCommand,
    handleResponse
}
