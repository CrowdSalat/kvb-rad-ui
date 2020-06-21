<template>
  <section id="mapComponent">
    <!--<input v-model="intensity" placeholder="0.4">-->
    <div id="mapContainer"></div>
  </section>
</template>

<script>
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
// need to be imported this way or the library will not get loaded properly
import 'leaflet.heat';

// eslint-disable-next-line no-unused-vars
import { decodePath } from './graphhopper';

export default {
  name: 'Map',
  data() {
    return {
      map: null,
      heatLayer: null,
      waypoints: [],
      precision: 5,
      yellowThreshold: 10,
      redThreshold: 30,
    };
  },
  mounted() {
    this.initMap();
    this.initLayer();
    this.loadBikeTours();
  },
  beforeDestroy() {
    this.removeMap();
  },
  methods: {
    initMap() {
      this.map = L.map('mapContainer')
        .setView([50.935173, 6.953101], 14);
    },
    initLayer() {
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      })
        .addTo(this.map);
    },
    removeMap() {
      if (this.map) {
        this.map.remove();
      }
    },

    loadBikeTours() {
      const today = new Date().toISOString();
      const yesterday = new Date(Date.now() - 86400 * 1000).toISOString();
      const url = `${process.env.VUE_APP_BACKEND}/tours?start=${yesterday}&end=${today}`;
      console.log('url', url);
      const response = fetch(url);
      response.then((resp) => {
        if (resp.ok) {
          resp.json()
            .then(this.parseJSONBikeTour);
        } else {
          console.warn(resp.status, resp.statusText);
        }
      });
    },
    parseJSONBikeTour(jsonResp) {
      const newWaypoint = [];
      // eslint-disable-next-line no-underscore-dangle
      const { tours } = jsonResp._embedded;
      tours.forEach((tour) => {
        if (tour.encodedWaypoints) {
          const path = decodePath(tour.encodedWaypoints, false);
          let prevWaypoint;
          path.forEach((waypoint) => {
            const curWaypoint = [waypoint[1].toFixed(this.precision),
              waypoint[0].toFixed(this.precision)];
            if (prevWaypoint) {
              newWaypoint.push([prevWaypoint, curWaypoint]);
            }
            prevWaypoint = curWaypoint;
          });
        }
      });
      this.waypoints = newWaypoint;
    },
    // TODO refactor
    initPolylines(waypoints) {
      const copyWaypoint = waypoints.slice();
      copyWaypoint.sort((a, b) => {
        if (a[0][0] !== b[0][0]) return a[0][0] - b[0][0];
        if (a[0][1] !== b[0][1]) return a[0][1] - b[0][1];
        if (a[1][0] !== b[1][0]) return a[1][0] - b[1][0];
        return a[1][1] - b[1][1];
      });
      let count = 0;
      let lastTour = copyWaypoint[0];
      copyWaypoint.forEach((tour) => {
        if (tour[0][0] === lastTour[0][0]
          && tour[0][1] === lastTour[0][1]
          && tour[1][0] === lastTour[1][0]
          && tour[1][1] === lastTour[1][1]) {
          count += 1;
        } else {
          let color;
          if (count < this.yellowThreshold) {
            color = 'green';
          } else if (count < this.redThreshold) {
            color = 'yellow';
          } else {
            color = 'red';
          }
          L.polyline(lastTour.slice(), { color })
            .addTo(this.map);
          count = 1;
        }
        // eslint-disable-next-line prefer-destructuring
        lastTour = tour;
      });
    },
  },
  watch: {
    waypoints(val) {
      this.initPolylines(val);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#mapContainer {
  width: 100vw;
  height: 100vh;
}
</style>
