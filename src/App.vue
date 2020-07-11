<template>
  <!-- necessary for vuetify -->
  <v-app id="app">

    <v-app-bar id="bar" dense dark>
      <v-toolbar-title>KVB bike</v-toolbar-title>

      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon @click="toggleBikePostitions">mdi-bike</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon @click="showStatistics">mdi-chart-bar</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon @click="reload">mdi-reload</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main id="main">
      <!-- Provides the application the proper gutter -->
      <v-container id="main" fluid>
        <v-progress-circular
          id="downloadProgress"
          class="overlay"
          indeterminate
          color="primary"
          :size="70"
          :width="7"
          v-if="loading"
        />
        <v-alert id="error"
                 type="error"
                 class="overlay"
                 :value="alert">
          Ups there went something wrong. You may want to try it later.
        </v-alert>
        <Map ref="map" waypoints="waypoints"/>
        <Statistics ref="statistics"/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import bikeService from './services/BikeService';
import Map from './components/Map.vue';
import Statistics from './components/Statistics.vue';

export default {
  name: 'App',
  components: {
    Map,
    Statistics,
  },
  data() {
    return {
      waypoints: [],
      riddenDistance24hKm: 0,
      rentedBikes24h: 0,
      rentalHours: [],
      loading: false,
      alert: false,
      showBikePositions: false,
    };
  },
  methods: {
    reload() {
      this.$refs.map.removePolylines();
      this.loading = true;
      this.waypoints = bikeService()
        .loadBikeData(this.showBikeRoutes, this.errorHandler);
      // TODO reload bike pos
    },
    showStatistics() {
      this.$refs.statistics.setData(this.rentalHours,
        this.rentedBikes24h, this.riddenDistance24hKm);
      this.$refs.statistics.toggleStatsOverlay();
    },
    downloadBikeRoutes() {
      this.loading = true;
      bikeService()
        .loadBikeData(this.showBikeRoutes, this.errorHandler.bind(this));
    },
    showBikeRoutes(bikeData) {
      this.waypoints = bikeData.waypoints;
      this.rentedBikes24h = bikeData.rentedBikes24h;
      this.riddenDistance24hKm = bikeData.riddenDistance24hKm;
      this.rentalHours = bikeData.rentalHours;
      this.$refs.map.initPolylines(this.waypoints);
      this.loading = false;
    },
    toggleBikePostitions() {
      if (this.showBikePositions) {
        this.$refs.map.removeBikePositions();
      } else {
        bikeService()
          .loadCurrentBikePositions(
            this.$refs.map.initBikePositions,
            this.errorHandler.bind(this),
          );
      }
      this.showBikePositions = !this.showBikePositions;
    },
    errorHandler() {
      this.alert = true;
      window.setInterval(() => {
        this.alert = false;
      }, 3000);
    },
  },
  mounted() {
    this.downloadBikeRoutes();
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: 100%;
  width: 100%;
  padding: 0px;
}

#main {
  padding: 0px;
}

.overlay {
  z-index: 1000;
  position: absolute;
}

#error {
  width: 99vw;
  overflow: hidden;
}

#downloadProgress {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}


</style>
