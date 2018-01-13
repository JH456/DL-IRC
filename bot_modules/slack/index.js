'use strict'

const slack = require('@slack/client')

function create(config) {
    let token = config.apiToken
    const rtm = new slack.RtmClient(token, {
        dataStore: false,
        useRtmConnect: true
    })
    const appData = {}
    rtm.on(slack.CLIENT_EVENTS.RTM.AUTHENTICATED, (connectData) => {
        appData.selfId = connectData.self.id
        console.log('Logged in')
    })
    rtm.start()

    let say = (to, text) => {
        rtm.sendMessage(text, to)
    }

    return {
        say,
        rtm,
        appData
    }
}

function addListenersTo(bot, handler/*, config*/) {
    bot.rtm.on(slack.RTM_EVENTS.MESSAGE, (message) => {
        if ((message.subtype && message.subtype === 'bot_message') ||
            (!message.subtype && message.user === bot.appData.selfId)) {
            return;
        } else {
            let isPm = false // TODO, make this work
            let messageInfo = {
                from: message.user,
                text: message.text,
                message,
                channel: message.channel,
                isPm
            }
            handler.handle(messageInfo)
        }
    })
}

module.exports = {
    create,
    addListenersTo
}
