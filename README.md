# LIRI Bot

This is a node.js application that experiments with using a few node modules for interacting with some API's.
These modules include the twitter package and node-spotify-api package, and request.

## Requirements and Setup
* Install [Node.js](https://nodejs.org/en/download/) with the included npm.
* IMPORTANT make sure you have at least Node version 7.6 for [async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) to run properly.
####Create accounts at the following services to receive API keys
[Twitter Apps](https://apps.twitter.com/)
[Spotify API](https://beta.developer.spotify.com/documentation/web-api/)

## Terminal: Getting Started How to
```
git clone https://github.com/Unobtainiumrock/liri-bot.git 

cd LIRIBOT

npm install
```


#### Example Commands
Each terminal command can be called without providing your own Tweet handler, movie, or song name -They will default to provided search values. Try these commands out with/without providing your own values. Make sure to be in the app root level where liri.js resides

```
node liri.js do-what-it-says

node liri.js my-tweets

node liri.js spotify-this-song

node liri.js movie-this
```



## Built With

* [Javascript](https://eloquentjavascript.net/)
* [Node](https://nodejs.org/en/)

#### Node Modules used
* [dotenv](https://github.com/motdotla/dotenv)
* [jquery-param](https://github.com/knowledgecode/jquery-param)
* [node-spotify-api](https://github.com/ceckenrode/node-spotify-api)
* [request](https://github.com/request/request)
* [request-promise-native](https://github.com/request/request-promise-native)
* [twitter](https://github.com/desmondmorris/node-twitter)



## Authors

* **Unobtainiumrock**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Pineapple goes well on pizza
* Cats
* Trees
* Unobtainiumrock Industries ®

