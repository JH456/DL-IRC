var config = require('./config.js');
let botModule = require('./bot_modules/' + config.botModule)
let messageService = require('./services/message')

let bot = botModule.create()
