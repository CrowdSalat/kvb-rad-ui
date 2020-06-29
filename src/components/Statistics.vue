<template>
  <section id="statisticsComponent">

    <v-dialog
      style="z-index: 1500;"
      v-model="overlay"
    >
      <v-container>
        <v-row>
          <v-col sm="4">
            <v-card
              class="mx-auto"
              max-width="400"
              height="380px"
              padding>
              <v-icon
                size="200px"
              >mdi-bike
              </v-icon>
              <v-card-title>Available bikes</v-card-title>
              <v-card-text class="headline font-weight-bold" center>
                <div>{{nowAvailableBikes}}</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col sm="4">
            <v-card
              class="mx-auto"
              max-width="400"
              height="380px">
              <v-icon
                size="200px"
              >mdi-redo
              </v-icon>
              <v-card-title>Rented bikes in the last 24 hours</v-card-title>
              <v-card-text class="headline font-weight-bold" center>
                <div>{{rentedBikes24h}}</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col sm="4">
            <v-card
              class="mx-auto"
              max-width="400"
              height="380px">
              <v-icon
                size="200px"
              >mdi-ruler
              </v-icon>
              <v-card-title>Travelled KM in the last 24 hours</v-card-title>
              <v-card-text class="headline font-weight-bold" center>
                <div>{{riddenDistance24hKm}}</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-btn
          color="orange"
          text
          @click="toggleStatsOverlay">
          Close
        </v-btn>

      </v-container>
    </v-dialog>
  </section>
</template>

<script>
export default {
  name: 'Statistics',
  data() {
    return {
      overlay: false,
      nowAvailableBikes: 0,
      rentedBikes24h: 0,
      riddenDistance24hKm: 0,
    };
  },
  methods: {
    setData(nowAvailableBikes, rentedBikes24h, riddenDistance24hKm) {
      this.nowAvailableBikes = nowAvailableBikes;
      this.rentedBikes24h = rentedBikes24h;
      this.riddenDistance24hKm = riddenDistance24hKm;
    },
    toggleStatsOverlay() {
      this.overlay = !this.overlay;
    },
  },
};
</script>

<style scoped>

</style>
