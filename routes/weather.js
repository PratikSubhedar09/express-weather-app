var express = require('express');
var OAuth = require('oauth');
var async = require('async');
require('dotenv').config()

var router = express.Router();

var header = {
    "X-Yahoo-App-Id": process.env.YAHOO_APP_ID
};

var request = new OAuth.OAuth(
    null,
    null,
    process.env.YAHOO_APP_CLIENT_ID,
    process.env.YAHOO_APP_CLIENT_SECRET,
    '1.0',
    null,
    'HMAC-SHA1',
    null,
    header
);

router.get('/', async function(req, res, next) {
  const location = req.query.location;
  if (location && typeof location === 'string') {
    const weatherData = await getLocationWeatherAsync(location).catch((err) => {
      res.status(400).send(err);
    })
    return res.send(weatherData);
  }
  if (location && typeof location === 'object') {
    const weatherData = await async.map(location, (loc, cb) => {
      getLocationWeatherAsync(loc)
        .then((data) => {
          cb(null, data);
        })
        .catch((err) => {
          cb(err);
        })
    }).catch((err) => {
      res.status(400).send(err);
    })
    
    return res.send(weatherData);
  }
  res.send('Make a request with the name of a city to get the weather for that location');
});

function getLocationWeatherAsync(location) {
  return new Promise(function(resolve, reject) {
    request.get(
      `${process.env.WEATHER_API_URL}?format=json&location=${location}`,
      null,
      null,
      function (err, data, result) {
        if (err) {
          reject(err);
        } else {
          const weatherData = JSON.parse(data)
          resolve(weatherData);
        }
      }
    );
  })
}

module.exports = router;
