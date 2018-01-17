'use strict'

function getFunction(name, userModules) {
    let command;
    userModules.forEach(module => {
        let moduleCommands = module.commands
        for (let i = 0; i < moduleCommands.length; i++) {
            let names = moduleCommands[i].names;
            for (let j = 0; j < names.length; j++) {
                if (names[j] === name) {
                    command = moduleCommands[i];
                }
            }
        }
    })
    return command;
}

function argumentsException (bot, messageInfo) {
    bot.say(messageInfo.channel, 'Incorrect arguments.');
}

function executeCommand(bot, messageInfo, args, command) {
    let called = false;
    let functions = command.functions;

    if (command.allowedUsers !== 'ALL' &&
        command.allowedUsers.indexOf(
        messageInfo.from) === -1) {
        bot.say(messageInfo.channel, "Permission denied.");
        return;
    }

    for (let i = 0; i < functions.length && !called; i++) {

        let argsCode = functions[i].argsCode;

        let convertedArgs = []

        let invalid = false;
        if (argsCode === 0 && args.length !== 0 ||
            argsCode.length > args.length ||
            argsCode.length < args.length && argsCode[argsCode.length - 1] !== 's') {
            invalid = true
        }

        for (let j = 0; !invalid && j < argsCode.length; j++) {
            if (argsCode[j] === 'n') {
                convertedArgs.push(parseFloat(args[j]))
                invalid = isNaN(convertedArgs[j])
            } else if (argsCode[j] === 'i') {
                convertedArgs.push(parseInt(args[j]))
                invalid = isNaN(convertedArgs[j])
            } else {
                convertedArgs.push(args[j])
            }
        }

        for (let j = argsCode.length; !invalid && j < args.length; j++) {
            convertedArgs[argsCode.length - 1] += " " + args[j]
        }

        if (!invalid) {
            called = true;
            functions[i].funcRef(bot, messageInfo, convertedArgs);
        }
    }

    if (!called) {
        argumentsException(bot, messageInfo);
    }
}

function tokenizeCommand(text, commandPrefix) {
    if (!text) {
        return;
    }
    let rawArgs = text.split(' ');
    let commandName = rawArgs.splice(0, 1)[0]
        .substring(commandPrefix.length).toLowerCase()

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

function createHandler(bot, userModuleNames, commandPrefix) {

    let userModules = []

    userModuleNames.forEach(moduleName => {
        userModules.push(require('../../user_modules/' + moduleName))
    })

    function handleCommand(messageInfo) {
        let text = messageInfo.text
        if (text && text.indexOf(commandPrefix) === 0 &&
            text.length > commandPrefix.length &&
            text[commandPrefix.length] !==  ' ') {

            let command = tokenizeCommand(text, commandPrefix)

            let commandFunction = getFunction(command.name, userModules);

            if (commandFunction) {
                executeCommand(bot, messageInfo, command.args, commandFunction);
            } else {
                bot.say(messageInfo.channel, 'Command not found');
            }
        }
    }

    function handleResponse(messageInfo) {
        userModules.map(module => module.responses).forEach((responses) => {
            if (responses) {
                for (let i = 0; i < responses.length; i++) {
                    for (let j = 0; j < responses[i].triggers.length; j++) {
                        if (messageInfo.text && messageInfo.text.toLowerCase().indexOf(
                        responses[i].triggers[j]) !== -1) {
                            bot.say(messageInfo.channel, responses[i].response);
                        }
                    }
                }
            }
        })
    }

    function handleMessage(messageInfo, commandTriggered, responseTriggered) {
        userModules.map(module => module.messageHandler).forEach((handler) => {
            if (handler) {
                handler(messageInfo, commandTriggered, responseTriggered)
            }
        })
    }

    function handle(messageInfo) {
        let commandTriggered = handleCommand(messageInfo)
        let responseTriggered = handleResponse(messageInfo)
        handleMessage(bot, messageInfo, commandTriggered, responseTriggered)
    }

    return {
        handle
    }
}

module.exports = {
    createHandler
}
