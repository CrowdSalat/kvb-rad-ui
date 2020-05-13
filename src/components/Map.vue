<template>
  <div id="mapContainer"></div>
</template>

<script>
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

export default {
  name: 'Map',
  data() {
    return {
      map: null,
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
      this.map = L.map('mapContainer')
        .setView([50.935173, 6.953101], 12);
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
