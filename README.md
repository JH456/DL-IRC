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
* build-essential
* libicu-dev
* youtube-dl (for downloading the videos)
* ffmpeg for audio extraction

## Setup
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
* You can install dependencies by running:
`$ npm install`

* You can run the code by running:
`$ npm start`

## Extending
* You can edit the config in server.js to add your user modules.
* Take a look at the provided user modules for examples of how they should be
set up.
* Commands can be restricted to specific users if you so choose.
