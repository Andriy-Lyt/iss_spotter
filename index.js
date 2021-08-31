// const { fetchMyIP } = require('./iss');
// const { fetchCoordsByIP } = require('./iss');
// const { fetchISSFlyOverTimes } = require('./iss');
const { nextISSTimesForMyLocation } = require('./iss');

/*  fetchMyIP((error, ip) => {
  if (error) {
    console.log("IP not detected!" , error);
    return;
  } 
  console.log('IP detected! IP:' , ip);
  // console.log(typeof ip);
});
 */

/*  let coordsFetched = {};
 fetchCoordsByIP('162.245.144.188', (error, coordinates) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }

  console.log('It worked! Returned coordinates:' , coordinates);
  coordsFetched = coordinates;
});
 */ 

/* //Call SS overhead, pass in 
 fetchISSFlyOverTimes({ latitude: 49.2643, longitude: -123.0961 }, (error, flyTimes) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }
  console.log('It worked! Returned SS passing time:', flyTimes);
});
 */

const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

//Main runner function ---------
nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  printPassTimes(passTimes);
});