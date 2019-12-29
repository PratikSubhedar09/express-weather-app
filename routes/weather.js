var express = require('express');
var OAuth = require('oauth');
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

/* GET users listing. */
router.get('/', function(req, res, next) {
  const location = req.query.location;
  if (location) {
    return request.get(
      `${process.env.WEATHER_API_URL}?format=json&location=${location}`,
      null,
      null,
      function (err, data, result) {
        if (err) {
          return res.send(err);
        }
        const weatherData = JSON.parse(data)
        res.send(weatherData);
      }
    );
  }
  res.send('Make a request with the name of a city to get the weather for that location');
});

module.exports = router;
