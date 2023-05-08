<template>
  <section id="mapComponent">
    <!--<input v-model="intensity" placeholder="0.4">-->
    <div id="mapContainer">
    </div>
  </section>
</template>

<script>
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
// need to be imported this way or the library will not get loaded properly
import 'leaflet.heat';

// eslint-disable-next-line no-unused-vars
import { decodePath } from '../services/graphhopper';

export default {
  name: 'Map',
  data() {
    return {
      map: null,
      polylines: null,
      waypoints: [],
      yellowThreshold: 10,
      redThreshold: 30,
      bikeLayer: null,
    };
  },
  mounted() {
    this.initMap();
    this.initLayer();
  },
  beforeDestroy() {
    this.removeMap();
  },
  methods: {
    initMap() {
      this.map = L.map('mapContainer', {
        bounds: [[51.092792, 6.653697], [50.815691, 7.205751]],
        maxZoom: 18,
        minZoom: 12,
        renderer: L.canvas(),
      })
        .setView([50.935173, 6.953101], 14);
    },
    initLayer() {
      L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
      })
        .addTo(this.map);
    },
    removeMap() {
      if (this.map) {
        this.map.remove();
      }
    },
    removePolylines() {
      if (this.polylines) {
        this.map.removeLayer(this.polylines);
        this.polylines = null;
      }
    },
    removeBikePositions() {
      if (this.bikeLayer) {
        this.map.removeLayer(this.bikeLayer);
        this.bikeLayer = null;
      }
    },
    initPolylines(waypoints) {
      console.debug('prepare polylines');
      const copyWaypoint = waypoints.slice();
      copyWaypoint.sort((a, b) => {
        if (a[0][0] !== b[0][0]) return a[0][0] - b[0][0];
        if (a[0][1] !== b[0][1]) return a[0][1] - b[0][1];
        if (a[1][0] !== b[1][0]) return a[1][0] - b[1][0];
        return a[1][1] - b[1][1];
      });
      let count = 0;
      let lastTour = copyWaypoint[0];
      const drawPrecedence = [];
      drawPrecedence.green = [];
      drawPrecedence.orange = [];
      drawPrecedence.red = [];
      copyWaypoint.forEach((tour) => {
        if (tour[0][0] === lastTour[0][0]
          && tour[0][1] === lastTour[0][1]
          && tour[1][0] === lastTour[1][0]
          && tour[1][1] === lastTour[1][1]) {
          count += 1;
        } else {
          const color = this.getColor(count);
          const polyline = L.polyline(lastTour.slice(), {
            color,
          });
          polyline.bindPopup(`Used ${count} times.`);
          drawPrecedence[color].push(polyline);
          count = 1;
        }
        // eslint-disable-next-line prefer-destructuring
        lastTour = tour;
      });
      console.debug('draw polylines');
      this.polylines = L.layerGroup(drawPrecedence.green.concat(drawPrecedence.orange)
        .concat(drawPrecedence.red));
      this.polylines.addTo(this.map);
      console.debug(`Drawn ${drawPrecedence.green.length + drawPrecedence.orange.length + drawPrecedence.red.length} polylines.`);
    },
    getColor(count) {
      if (count < this.yellowThreshold) {
        return 'green';
      }
      if (count < this.redThreshold) {
        return 'orange';
      }
      return 'red';
    },
    initBikePositions(bikes) {
      const markers = [];
      bikes.forEach((bike) => {
        const marker = L.marker([bike.lat, bike.lng])
          .bindPopup(bike.bikeId);
        markers.push(marker);
      });
      this.bikeLayer = L.layerGroup(markers);
      this.bikeLayer.addTo(this.map);
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
  width: 99vw;
  height: 95vh;
  padding: 0px;
}

</style>
