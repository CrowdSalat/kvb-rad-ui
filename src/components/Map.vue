<template>
  <div id="mapContainer"></div>
</template>

<script>
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
// need to be imported this way or the library will not get loaded properly
import 'leaflet.heat';

export default {
  name: 'Map',
  data() {
    return {
      map: null,
      heatLayer: null,
    };
  },
  mounted() {
    this.initMap();
    this.initLayer();
    const intensity = 1.0;
    this.initHeatmapLayer([
      [50.935173, 6.953101, intensity],
      [50.915173, 6.953102, intensity],
      [50.935173, 6.953103, intensity],
      [50.925173, 6.953104, intensity],
      [50.935173, 6.953105, intensity],
      [50.935173, 6.953106, intensity],
      [50.935173, 6.953107, intensity],
      [50.935173, 6.953108, intensity],
      [50.945173, 6.953109, intensity],
      [50.935173, 6.953100, intensity],
      [50.935171, 6.953101, intensity],
    ]);
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
