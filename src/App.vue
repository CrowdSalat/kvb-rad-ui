<template>
  <!-- necessary for vuetify -->
  <v-app id="app">

    <v-app-bar id="bar" dense dark>
      <v-toolbar-title>KVB bike</v-toolbar-title>

      <v-spacer></v-spacer>

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
        <Map ref="map"/>
        <Statistics ref="statistics"/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Map from './components/Map.vue';
import Statistics from './components/Statistics.vue';

export default {
  name: 'App',
  components: {
    Map,
    Statistics,
  },
  methods: {
    reload() {
      this.$refs.map.removePolylines();
      this.$refs.map.loadBikeTours();
    },
    showStatistics() {
      console.debug('stats clicked');
      this.$refs.statistics.toggleStatsOverlay();
    },
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
</style>
