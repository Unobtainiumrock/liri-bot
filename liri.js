// import { spotify, twitter } from './keys';

// Configure environment with API keys
require('dotenv').config();
// Pull in modules
const api_keys = require('./keys.js');
const Spotify = require('node-spotify-api');
const Twitter = require('twitter');
const request = require('request');

// Store API keys
const spotify_with_keys = new Spotify(api_keys.spotify);
const twitter_with_keys = new Twitter(api_keys.twitter);

const terminalArg = process.argv[2];
// * `spotify-this-song`
// * `movie-this`
// * `do-what-it-says`



if (terminalArg === 'my-tweets') {
  let userName = process.argv[3];
  getTweets(userName);
}

if (terminalArg === 'spotify-this-song') {
  let song = process.argv.slice(3).join(' ');
  getSong(song);
}

if (terminalArg === 'movie-this') {
  let movie = process.argv.slice(3).join(' ');
  getMovie(movie);
}





// FUNCTIONS
function getTweets(screen_name) {

  let params = { screen_name };

  twitter_with_keys.get('statuses/user_timeline', params, function (error, tweets, response) {
    if (!error) {
      console.log(tweets);
    }
  });

}

function getSong() {
  spotify_with_keys.search({ type: 'track', query: 'All the Small Things' })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    })
}

function getMovie() {

}

function doWhatItSays() {

}