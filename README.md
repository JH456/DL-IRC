# DL-IRC
An extensible JavaScript IRC bot developed with several node packages that can download videos off of YouTube.

## Dependences
### NPM
* irc
	* Used to interface with IRC.
* youtube-node
	* Used to interface with the YouTube API to perform searches based on keyword.

### Other
* libicu-dev
* youtube-dl (for downloading the videos)
* ffmpeg for audio extraction

## Setup
* npm install
* Edit config for bot information in obivous places.
* Go into the youtube module and add your API key

## Extending
* You can add custom commands by editing the config. See the examples in the
file for how to do this.
* Commands can be restricted to specific users if you so choose.
