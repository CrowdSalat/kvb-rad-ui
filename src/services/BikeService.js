import { decodePath } from './graphhopper';

// decimal places for the longitude and the latitude
const precision = 5;

function parseJSONBikeTour(jsonResp) {
  const waypoints = [];
  // eslint-disable-next-line no-underscore-dangle
  const { tours } = jsonResp._embedded;
  tours.forEach((tour) => {
    if (tour.encodedWaypoints) {
      const path = decodePath(tour.encodedWaypoints, false);
      let prevWaypoint;
      path.forEach((waypoint) => {
        const curWaypoint = [waypoint[1].toFixed(precision),
          waypoint[0].toFixed(precision)];
        if (prevWaypoint) {
          waypoints.push([prevWaypoint, curWaypoint]);
        }
        prevWaypoint = curWaypoint;
      });
    }
  });
  return waypoints;
}


function loadBikeTours(successHandler, errorHandler, jsonParser) {
  const today = new Date().toISOString();
  const yesterday = new Date(Date.now() - 86400 * 1000).toISOString();
  const url = `${process.env.VUE_APP_BACKEND}/tours?start=${yesterday}&end=${today}`;
  console.debug('url', url);
  const response = fetch(url);
  response.then((resp) => {
    if (resp.ok) {
      resp.json()
        .then(jsonParser)
        .then(successHandler);
    } else {
      console.warn(resp.status, resp.statusText);
      errorHandler();
    }
  });
}

function loadBikeData(successHandler, errorHandler) {
  console.debug('BikeService#loadBikeData');
  loadBikeTours(successHandler, errorHandler, parseJSONBikeTour);
}

export default loadBikeData;
