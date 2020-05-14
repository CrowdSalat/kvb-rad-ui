/* eslint-disable */
// source: https://github.com/graphhopper/graphhopper/blob/d70b63660ac5200b03c38ba3406b8f93976628a6/web/src/main/webapp/js/ghrequest.js#L139
export function decodePath(encoded, is3D) {
  // var start = new Date().getTime();
  var len = encoded.length;
  var index = 0;
  var array = [];
  var lat = 0;
  var lng = 0;
  var ele = 0;

  while (index < len) {
    var b;
    var shift = 0;
    var result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    var deltaLat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += deltaLat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    var deltaLon = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += deltaLon;

    if (is3D) {
      // elevation
      shift = 0;
      result = 0;
      do
      {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      var deltaEle = ((result & 1) ? ~(result >> 1) : (result >> 1));
      ele += deltaEle;
      array.push([lng * 1e-5, lat * 1e-5, ele / 100]);
    } else
      array.push([lng * 1e-5, lat * 1e-5]);
  }
  // var end = new Date().getTime();
  // console.log("decoded " + len + " coordinates in " + ((end - start) / 1000) + "s");
  return array;
}
