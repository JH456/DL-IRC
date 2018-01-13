# DL-IRC
An extensible JavaScript IRC bot developed with several node packages that can download videos off of YouTube.

## Dependences
### NPM
* irc
	* Used to interface with IRC.
* youtube-node
	* Used to interface with the YouTube API to perform searches based on keyword.
* youtube-dl
    * A wrapper around youtube-dl to make the calls a little easier
* nodemon
    * For restarting on code updates

### Other
* libicu-dev
* youtube-dl (for downloading the videos)
* ffmpeg for audio extraction

## Setup
* npm install
* All user configuration information is grabbed from environment variables
right now. Make a file like this and source it.
```bash
#!/bin/bash

export IRC_YOUTUBE_API_KEY=YOUR-API-KEY
export IRC_BOT_NAME=Botname
export IRC_NICKSERV_PASS=NickservPassForYourBot
export IRC_SERVER_NAME=irc.whatever.net
export IRC_CHANNEL_NAME=#channel
export IRC_DOWNLOAD_USER=UserAllowedToDownloadThings
export BOT_MODULE=slack|irc
export SLACK_API_TOKEN=slackAPIToken
```
* node dl-irc.js

## Extending
* You can add custom commands by editing the config. See the examples in the
file for how to do this.
* Commands can be restricted to specific users if you so choose.
