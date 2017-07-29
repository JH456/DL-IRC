function getFunction(name, userModules) {
    let command;
    userModules.forEach(module => {
        let moduleCommands = module.commands
        for (var i = 0; i < moduleCommands.length; i++) {
            var names = moduleCommands[i].names;
            for (var j = 0; j < names.length; j++) {
                if (names[j] == name) command = moduleCommands[i];
            }
        }
    })
    return command;
}

function argumentsException (bot, messageInfo) {
    bot.say(messageInfo.channel, 'Incorrect arguments.');
}

function executeCommand(bot, messageInfo, args, command) {
    var called = false;
    var functions = command.functions;

    if (command.allowedUsers != 'ALL'
    && command.allowedUsers.indexOf(
    messageInfo.from) == -1) {
        bot.say(messageInfo.channel, "Permission denied.");
        return;
    }

    for (var i = 0; i < functions.length && !called; i++) {

        var argsCode = functions[i].argsCode;

        // If argscode is just a number rather than an array, make r an array
        //of length 0, otherwise make it an array of argscode's length
        var r = typeof argsCode == 'number'
        ? new Array(0)
        : new Array(argsCode.length);

        if ( !(argsCode == 0 && args.length == 0)
        && (argsCode.length != args.length)
        && (argsCode[argsCode.length-1] != 'a') ) {
            continue;
        }
        var invalid = false;
        for (var j = 0; j < argsCode.length; j++) {
            if (argsCode[j] == 'n') {
                r[j] = parseFloat(args[j]);
                if (isNaN(r[j])) {
                    invalid = true;
                    break;
                }
            } else if (argsCode[j] == 'i') {
                r[j] = parseInt(args[j]);
                if (isNaN(r[j])) {
                    invalid = true;
                    break;
                }
            } else r[j] = args[j];
        }

        for (var j = 0; j < r.length; j++) {
            if (r[j] == undefined) {
                invalid = true;
                break;
            }
        }
        if (invalid) continue;
        called = true;
        functions[i].funcRef(bot, messageInfo, r);
    }

    if (!called) argumentsException(bot, messageInfo);
}

function tokenizeCommand(text, commandPrefix) {
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
        if (text.indexOf(commandPrefix) == 0
            && text.length > commandPrefix.length
            && text[commandPrefix.length] != ' ') {

            let command = tokenizeCommand(text, commandPrefix)

            var commandFunction = getFunction(command.name, userModules);

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
                for (var i = 0; i < responses.length; i++) {
                    for (var j = 0; j < responses[i].triggers.length; j++) {
                        if (messageInfo.text.toLowerCase().indexOf(
                        responses[i].triggers[j]) != -1) {
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
        handleMessage(messageInfo, commandTriggered, responseTriggered)
    }

    return {
        handle
    }
}

module.exports = {
    createHandler
}
