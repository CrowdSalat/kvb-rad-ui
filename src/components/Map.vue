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
    const response = fetch('http://localhost:9090/bikes');
    response.then((resp) => {
      resp.json()
        .then((jsonResp) => {
          // eslint-disable-next-line no-underscore-dangle
          const { bikes } = jsonResp._embedded;
          const list = [];
          bikes.forEach((bike) => {
            list.push([bike.lat, bike.lng, intensity]);
          });
          this.initHeatmapLayer(list);
        });
    });
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
