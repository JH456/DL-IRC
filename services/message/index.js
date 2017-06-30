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

function tokenizeCommand(text) {
    let rawArgs = text.split(' ');
    let commandName = rawArgs.splice(0, 1)[0].substring(1).toLowerCase()

    let args = []
    let arg = ''
    let pop = true
    rawArgs.forEach(rawArg => {
        if (rawArg.startsWith('"')) {
            pop = !pop
            arg += rawArg.substring(1)
        } else if (rawArg.endsWith('"')) {
            pop = !pop
            arg += rawArg.substring(0, rawArg.length - 1)
        } else {
            arg += rawArg
        }

        if (!pop) {
            arg += " "
        } else {
            args.push(arg)
            arg = ''
        }
    })

    return {
        name: commandName,
        args
    }
}

function handleCommand(bot, messageInfo) {
    let text = messageInfo.text
    if (text.indexOf('*') == 0 && text.length > 1 && text[1] != ' ') {

        let command = tokenizeCommand(text)

        var commandFunction = getFunction(command.name);

        if (commandFunction) {
            argFunctions.call(bot, messageInfo, command.args, commandFunction);
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
