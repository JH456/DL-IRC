'use strict'

let fs = require('fs');
let youtubedl = require('youtube-dl');
let YouTube = require('youtube-node');
let youTube = new YouTube();
youTube.setKey(process.env.IRC_YOUTUBE_API_KEY);

function search (bot, messageInfo, query, numResults, callback)
{
    youTube.search(query, numResults, function(error, result) {
        let videoResults = []
        if (error) {
            console.log(error);
            callback(videoResults);
        }
        else {
            for (let i = 0; i < result.items.length; i++) {
                if (result.items[i].id.kind === "youtube#video") {
                    let url = "https://www.youtube.com/watch?v=" +
                        result.items[i].id.videoId;

                    let title = result.items[i].snippet.title;
                    videoResults.push(
                        {
                            url: url,
                            title: title
                        }
                    );
                }
            }
        }

        callback(videoResults)
    });
}

function getVideo (bot, messageInfo, videoObject) {
    bot.say(messageInfo.channel, "Getting " + videoObject.title);
    let video = youtubedl(videoObject.url,
        // Optional arguments passed to youtube-dl.
        ['--format=18'],
        { cwd: './' }
    );

    // Will be called when the download starts.
    video.on('info', function() {
        let title = videoObject.title.replace('/', '');
        video.pipe(fs.createWriteStream(title + '.mp4'));
    });
    video.on('end', () => {
        bot.say(messageInfo.channel, 'Finished Downloading ' +
            videoObject.title)
    })
}

function lookupCallback (bot, messageInfo, videoResults) {
    bot.say(messageInfo.channel, "Here are your options:");
    videoResults.forEach(videoResult => {
        bot.say(messageInfo.channel, "- " + videoResult.title + ': ' + videoResult.url)
    })
}

exports.getByName = function (bot, messageInfo, args)
{
    search(bot, messageInfo, args[0], 1, function (videoResults) {

        if (videoResults.length === 0) {
            return
        }

        getVideo(bot, messageInfo, videoResults[0]);
        });
}

exports.lookupOne = function (bot, messageInfo, args) {
    search(bot, messageInfo, args[0], 1, function (videoResults) {
        lookupCallback(bot, messageInfo, videoResults);
    });
}

exports.lookupMultiple = function (bot, messageInfo, args) {
    search(bot, messageInfo, args[1], args[0], function (videoResults) {
        lookupCallback(bot, messageInfo, videoResults);
    });
}
