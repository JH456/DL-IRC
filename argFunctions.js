/*
*    Author: Jim Harris
*    Arguments functions file for PannIRC
*    Handles arguments exceptions and calling custom functions
*/

let config = require('./config')

function argumentsException (bot, messageInfo) {
    bot.say(messageInfo.channel, 'Incorrect arguments.');
}

exports.call = function (bot, messageInfo, args, command) {
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
