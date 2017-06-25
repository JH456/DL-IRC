// remember to install ffmpeg

var fs = require('fs');
var youtubedl = require('youtube-dl');
var YouTube = require('youtube-node');
var youTube = new YouTube();
youTube.setKey(process.env.IRC_YOUTUBE_API_KEY);

function search (data, query, numResults, callback)
{
    // First argument is the search query, the second is the number of results.
    // Gets the titles and urls of the results and stores them into an array that
    // it passes to the callback.
    youTube.search(query, numResults, function(error, result) {
        var videoResults = new Array();
        if (error) {
            console.log(error);
            callback(videoResults);
        }
        else {
            for (var i = 0; i < result.items.length; i++) {
                if (result.items[i].id.kind == "youtube#video") {
                    var url = "https://www.youtube.com/watch?v="
                    + result.items[i].id.videoId;

                    var title = result.items[i].snippet.title;
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

function getVideo (data, videoObject) {
    data.bot.say(data.runTime.channel, "Getting " + videoObject.title);
    var video = youtubedl(videoObject.url,
        // Optional arguments passed to youtube-dl.
        ['--format=18'],
        { cwd: './' }
    );

    // Will be called when the download starts.
    video.on('info', function(info) {
        var title = videoObject.title.replace('/', '');
        video.pipe(fs.createWriteStream(title + '.mp4'));
    });
}

function lookupCallback (data, videoResults) {
    data.runTime.videoOptions = [];
    data.bot.say(data.runTime.channel, "Here are your options:");
    for (var i = 0; i < videoResults.length; i++) {
        data.runTime.videoOptions.push({
            url: videoResults[i].url,
            title: videoResults[i].title
        });
        data.bot.say(data.runTime.channel,
            (i + 1) + ": " + videoResults[i].title);
    }
}

exports.getByName = function (data, args)
{
    search(data, args[0], 1, function (videoResults) {

        if (videoResults.length == 0) return;

        getVideo(data, videoResults[0]);
        });
}

exports.getByNumber = function (data, args)
{
    if (args[0] > data.runTime.videoOptions.length || args[0] < 1) {
        data.bot.say(data.runTime.channel,
            "Sorry, but there is no video listed under that number...");
    }
    else getVideo(data, data.runTime.videoOptions[args[0]-1]);
}

exports.lookupOne = function (data, args) {
    search(data, args[0], 1, function (videoResults) {
        lookupCallback(data, videoResults);
    });
}

exports.lookupMultiple = function (data, args) {
    search(data, args[1], args[0], function (videoResults) {
        lookupCallback(data, videoResults);
    });
}
