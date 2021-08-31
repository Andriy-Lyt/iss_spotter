const request = require('request');


//Function detects IP address ------------------
const fetchMyIP = function(callback) { 
  const url = "https://api.ipify.org?format=json";

  request(url, (error, response, body) => {
    //wrong url
    if (error) {
      return callback(`\ninvalif URL \n${error}`, null);
    }

    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const data = JSON.parse(body);
    // console.log(data);

    //empty - not empty data object received
    if (data) {
      callback(null, data.ip);
    } else {
      callback("No data received", null);
    }
  }); // request()
} //  fetchMyIP()

//Function detects Geo location ------------------
const fetchCoordsByIP = function(ip, callback) {
  request(`https://freegeoip.app/json/${ip}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching Coordinates for IP: ${body}`), null);
      return;
    }

    const { latitude, longitude } = JSON.parse(body);

    callback(null, { latitude, longitude });
  });
};

// Space Station passing time function ------------------
const fetchISSFlyOverTimes = function(coords, callback) {
  const lat = coords.latitude;
  const long = coords.longitude;
  const url = `http://api.open-notify.org/iss-pass.json?lat=${lat}&lon=${long}`;

  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching Coordinates for IP: ${body}`), null);
      return;
    }

    const flyTimes = JSON.parse(body).response;

    callback(null, flyTimes);
  });
};

 //Main rubnner function ---------
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);

      }); // closing fetchISSFlyOverTimes()
    }); // closing fetchCoordsByIP()
  }); // closing fetchMyIP()
};
module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation }

//Spase station pass JSON
/* JSON
http://api.open-notify.org/iss-pass.json?lat=LAT&lon=LON

{
  "message": "success",
  "request": {
    "latitude": LATITUE,
    "longitude": LONGITUDE, 
    "altitude": ALTITUDE,
    "passes": NUMBER_OF_PASSES,
    "datetime": REQUEST_TIMESTAMP
  },
  "response": [
    {"risetime": TIMESTAMP, "duration": DURATION},
    ...
  ]
}
 */