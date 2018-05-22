// import { spotify, twitter } from './keys';

// Configure environment with API keys
require('dotenv').config();

const api_keys = require('./keys.js');
const Spotify = require('node-spotify-api');
const Twitter = require('twitter');
const request = require('request-promise-native');
const param = require('jquery-param');
const fs = require('fs');

const randomTextFile = fs.readdirSync(__dirname).filter(file => file === 'random.txt')[0];
const randomText = fs.readFileSync(randomTextFile, 'utf-8').split('');


const spotify_with_keys = new Spotify(api_keys.spotify);
const twitter_with_keys = new Twitter(api_keys.twitter);
let terminalArg = process.argv[2];

// Wrapping the core logic inside an async IIFE so that we can use the async/await syntax.
(async () => {

  if (terminalArg === 'do-what-it-says') {
    doWhatItSays();
  }

  if (terminalArg === 'my-tweets') {
    let userName = process.argv[3];
    let tweets = await getTweets(userName);
    tweets.forEach((tweet) => {
      console.log(`${userName} tweeted "${tweet.text}" at: ${tweet.created_at}`);
    })
  }

  if (terminalArg === 'spotify-this-song') {
    let song = process.argv.slice(3).join(' ');
    let songInfo = await getSong(song);
    let { artist, preview, album, query } = songInfo;
    console.log(`${query} is a song from ${artist}'s album --${album}. Have a listen at ${preview}`);
  }

  if (terminalArg === 'movie-this') {
    let movie = process.argv.slice(3).join(' ');
    let movieInfo = await getMovie(movie);
    for (let key in movieInfo) {
      console.log(`${key}: ${movieInfo[key]}`);
    }
  }
})()

/**
 * @param  {string} screen_name: Is a provided user screename. I've set this up to work for checking
 * tweets on any provided Twitter account
 */
function getTweets(screen_name) {
  let params = { screen_name };
  let answer;

  answer = twitter_with_keys.get('statuses/user_timeline', params)
    .then((tweets) => {
      tweets = tweets.slice(0, 20);
      let tweetCollection = tweets.map((tweet) => {
        let { created_at, text } = tweet;
        let tweetData = {
          created_at,
          text
        };
        return tweetData;
      });
      return tweetCollection;
    })
  return answer;
}

/**
 * @param  {string} query: Is a requested song title
 */
function getSong(query /*= 'Put Me Back Together'*/) {
  query = query || 'Put Me Back Together';
  let answer;

  answer = spotify_with_keys.search({ type: 'track', query, limit: 1 })
    .then((res) => {
      let artist = res.tracks.items[0].album.artists[0].name;
      let preview = res.tracks.items[0].album.external_urls.spotify;
      let album = res.tracks.items[0].album.name;

      let songData = {
        artist,
        preview,
        album,
        query
      }
      return songData;
    })
    .catch((err) => {
      console.log(err);
    })
  return answer;
}
/**
 * @param  {string} s: Is a movie title provided to be searched for.
 */
function getMovie(t) {
  t = t || 'Mr. Nobody';
  let answer;
  let queryUrl = 'http://www.omdbapi.com/?apikey=trilogy&';

  queryUrl += param({
    t
  })

  answer = request(queryUrl)
    .then((res) => {
      let { Title, Year, imdbRating, Country, Language, Plot, Actors, Ratings } = JSON.parse(res);
      let rottenTomatoes = `Rotten Tomatoes rating: ${Ratings[1].Value}`;
      let movieData = {
        Title,
        Year,
        imdbRating,
        Country,
        Language,
        Plot,
        Actors,
        rottenTomatoes
      };
      return movieData;
    })
    .catch((err) => {
      console.log(err);
    })
  return answer;
}

function doWhatItSays() {
  let commands = [];
  let command = '';
  let arg = '';
  let key = true;

  for (let i = 0; i < randomText.length; i++) {
    if (randomText[i] !== '\n' && randomText[i] !== ' ' && key) {
      command += randomText[i];
    } else {
        arg += randomText[i];
    }

    if (randomText[i] === ' ') {
      key = false;
    }

    if (randomText[i] === '\n') {
      commands.push({
        command,
        arg: arg.slice(1,-1)
      })
      command = '';
      arg = '';
      key = true;
    }

  }
  let randomTask = commands[randomizer(0,commands.length)];
  terminalArg = randomTask.command;
  let words = randomTask.arg.split(' ');

  words.forEach((word) => {
    process.argv.push(word);
  })

}

/**
 * @param  {number} lowerBound: is the lower range for a ranomdly generated number
 * @param  {number} upperBound: is the upper range for a randomly generated number
 */
function randomizer(lowerBound, upperBound) {
  return Math.floor(Math.random() * upperBound + lowerBound);
}