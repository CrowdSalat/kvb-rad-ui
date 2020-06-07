import Vue from 'vue';
import App from './App.vue';
// eslint-disable-next-line import/extensions
import vuetify from './plugins/vuetify.js';

Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
