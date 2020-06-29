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
              <v-sparkline
                :value="rentalHours"
                :labels="rentalHoursLabel"
                color="black"
                line-width="2"
                padding="16"
                size="200px"
              ></v-sparkline>
              <v-card-title>Rented bikes per hour.</v-card-title>
              <v-simple-table dense
                              height="170px">
                <template v-slot:default>
                  <thead>
                  <tr>
                    <th class="text-left">Hour</th>
                    <th class="text-left">Rented bikes</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(item, index) in rentalHours" :key="index">
                    <td>{{ index }}</td>
                    <td>{{ item }}</td>
                  </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>
          </v-col>
          <v-col sm="4">
            <v-card
              class="mx-auto"
              max-width="400"
              height="380px">
              <v-icon
                size="200px"
              >mdi-bike
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
      rentalHours: [],
      rentalHoursLabel: [...Array(24)
        .keys()],
      rentedBikes24h: 0,
      riddenDistance24hKm: 0,
    };
  },
  methods: {
    setData(rentalHours, rentedBikes24h, riddenDistance24hKm) {
      this.rentalHours = rentalHours;
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
