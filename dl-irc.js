/*
*	Author: Jim Harris
*	Main file for DJ Dango
*	Creates listeners and handles messages
*/


//Include some files
var irc = require("irc");
var argFunctions = require('./argFunctions.js');
var rootConfig = require('./config.js');
var config = rootConfig.config;
var data = rootConfig.data;

//Declare and initialize the bot
var bot = new irc.Client(config.servers[0].serverName, config.botName, {
	channels: config.servers[0].channels,
	userName: config.botName.toLowerCase(),
	port: 6697,
	secure: true,
	selfSigned: true,
	realName: config.botName
});

//Create a data object to pass into custom bot functions
data.bot = bot;
data.config = config;

//Register nick upon connection to the network
bot.addListener("registered", function(message) {
	//Use this to register your bot's nick.
    bot.say("nickserv", 'command to nickserv');
});

//Function that handles message to the bot, or to a channel the bot sits in
function handleMessage (from, to, text, message, pm) {

	//Nick that sent the message
	data.runTime.from = from;
	//Where the message was sent
	data.runTime.to = to;
	//The text within the message
	data.runTime.text = text;
	//The message itself
	data.runTime.message = message;
	//The channel the message passed through. If it was a pm, it is just the
	//user who it was from. Otherwise, it is an element of message.args.
	data.runTime.channel = pm ? from : message.args[0];

	var runTime = data.runTime;
	
	//If the message is a command
	if (text.indexOf('*') == 0 && text.length > 1 && text[1] != ' ') {
		
		//Declare the variables for the command's name, and the command's
		//arguments
		var command = 'UNKNOWN';
		var args = new Array(0);

		//Set the command, and the arguments
		if (text.length > 1) {
			//Set the command
			command = text.indexOf(' ') == -1 
			? text.substring(1, text.length).toLowerCase() 
			: text.substring(1, text.indexOf(' ')).toLowerCase();
			
			//Set arguments
			args = text.split(' ');
			//Splice the command from the arguments
			args.splice(0, 1);
		}

		//The function that the command name refers to in config
		var action = getFunction(command);

		//If the action is valid
		if (action != -1) {
			//Call the function with the arguments, and pass it data
			argFunctions.call(data, args, action);
		}
		//If the action does not exist, return an error instead
		else bot.say(runTime.channel, '404: Command not found');
	}
	
	//Determine if any trigger words were said
	for (var i = 0; i < config.responseConfig.length; i++) {
		for (var j = 0; j < config.responseConfig[i].triggers.length; j++) {
			if (text.toLowerCase().indexOf(
			config.responseConfig[i].triggers[j]) != -1) {
				//Say the response
				bot.say(runTime.channel, config.responseConfig[i].response);
			}
		}
	}

}

//Create a listener to handle messages to a channel
bot.addListener("message", function (from, to, text, message) {

	handleMessage(from, to, text, message, to === config.botName);

});

//Get the function associated with the given name
function getFunction (name) {
	for (var i = 0; i < config.commands.length; i++) {
		var names = config.commands[i].names;
		for (var j = 0; j < names.length; j++) {
			if (names[j] == name) return i;
		}
	}
	return -1;
}