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
      intensity: 0.5,
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
    initHeatmapLayer(positions) {
      if (this.heatLayer) {
        this.map.removeLayer(this.heatLayer);
      }
      this.heatLayer = L.heatLayer(positions, { radius: 25 });
      this.heatLayer.addTo(this.map);
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
      this.waypoints = [];
      // eslint-disable-next-line no-underscore-dangle
      const { tours } = jsonResp._embedded;
      tours.forEach((tour) => {
        const tourList = [];
        if (tour.encodedWaypoints) {
          const path = decodePath(tour.encodedWaypoints, false);
          path.forEach((waypoint) => {
            tourList.push([waypoint[1], waypoint[0]]);
          });
          this.waypoints.push(tourList);
        }
      });
    },
    initPolylines(waypoints) {
      waypoints.forEach((tour) => {
        L.polyline(tour, { color: 'red' }).addTo(this.map);
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
