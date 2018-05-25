// import { spotify, twitter } from './keys';

// Configure environment with API keys
require('dotenv').config();

const api_keys = require('./keys.js');
const Spotify = require('node-spotify-api');
const Twitter = require('twitter');
const request = require('request-promise-native');
const param = require('jquery-param');
const fs = require('fs');
const figlet = require('figlet');


const spotify_with_keys = new Spotify(api_keys.spotify);
const twitter_with_keys = new Twitter(api_keys.twitter);
let terminalArg = process.argv[2];

const randomText = fs.readFileSync('random.txt', 'utf-8').split('');

console.log(figlet.textSync('LIRI',{
    font: 'Standard',
    horizontalLayout: 'default',
    verticalLayout: 'default'
}));

// Wrapping the core logic inside an async IIFE so that we can use the async/await syntax.
(async () => {

  if (terminalArg === 'do-what-it-says') {
    doWhatItSays();
  }

  if (terminalArg === 'my-tweets') {
    let userName = process.argv[3] || 'Oracle';
    let tweets = await getTweets(userName);
    appendFile('======= Tweets =======')
    tweets.forEach((tweet) => {
      appendFile(`${userName} tweeted "${tweet.text}" at: ${tweet.created_at}`);
    })
    userFeedback();
  }

  if (terminalArg === 'spotify-this-song') {
    let song = process.argv.slice(3).join(' ');
    let songInfo = await getSong(song);
    appendFile('======= Song =======');
    for (let key in songInfo) {
      appendFile(`${key}: ${songInfo[key]}`);
    }
    userFeedback();
  }

  if (terminalArg === 'movie-this') {
    let movie = process.argv.slice(3).join(' ');
    let movieInfo = await getMovie(movie);
    appendFile('======= Movie =======');
    for (let key in movieInfo) {
      appendFile(`${key}: ${movieInfo[key]}`);
    }
    userFeedback();
  }
})()

/**
 * @param  {string} screen_name: Is a provided user screename. I've set this up to work for checking tweets on any provided Twitter account
 * @returns a collection of tweets as an array of tweet objects
 */
async function getTweets(screen_name) {
  let params = { screen_name }
  let tweets = await twitter_with_keys.get('statuses/user_timeline',params);

  tweets = tweets.map((tweet) => {
    let { created_at, text } = tweet;
    let tweetData = {
      created_at,
      text
    };
    return tweetData;
  });
  
  return tweets;
}

/**
 * @param  {string} query: Is a requested song title
 * @returns an object containing song data
 */
async function getSong(Track /*= 'Put Me Back Together'*/) {
  Track = Track || 'Put Me Back Together';
  
  let song = await spotify_with_keys.search({type: 'track', query: Track, limit: 1 })
  let Artist = song.tracks.items[0].album.artists[0].name;
  let Preview = song.tracks.items[0].album.external_urls.spotify;
  let Album = song.tracks.items[0].album.name;

  let songData = {
    Artist,
    Album,
    Track,
    Preview
  }
  return songData;
}

/**
 * @param  {string} s: Is a movie title provided to be searched for.
 * @returns an object containing movie data
 */
async function getMovie(t) {
  t = t || 'The Matrix';
  let answer;
  let queryUrl = 'http://www.omdbapi.com/?apikey=trilogy&';

  queryUrl += param({t});

  let movie = await request(queryUrl);
  let { Title, Year, imdbRating, Country, Language, Plot, Actors, Ratings } = JSON.parse(movie);
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
  }
  return movieData;
}

/**
 * Does a lot of magic to change process.argv data to a random command pulled from random.txt
 * these changes to process.argv happen before all the other if blocks are hit in the asycn IIFE, so
 * the respective command is executed to whatver process.argv says should be executed
 */
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

/**
 * @param  {string} data: is the data we will append to our file.
 */
function appendFile(data) {
  fs.appendFileSync('log.txt','\n' + data + '\n');
}

/**
 * Displays feedback to the user in the terminal to let them know where their query results are
 * being written to
 */
function userFeedback() {
  console.log('\n==============================================\n');
  console.log("I've went ahead and query results into log.txt");
  console.log('\n==============================================\n');
}