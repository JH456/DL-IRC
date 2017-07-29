let yoCount = 0

function yoHandler(messageInfo, commandTriggered, responseTriggered) {
    if (messageInfo.text.toLowerCase().indexOf('yo') > -1) {
        yoCount++
    }
}

function printCount(bot, messageInfo) {
    bot.say(messageInfo.channel, 'This many:' + yoCount)
}

module.exports = {
    yoHandler,
    printCount
}
