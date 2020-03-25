// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import vuetify from './plugins/vuetify'
import cytoscape from "cytoscape"

Vue.config.productionTip = false
Vue.prototype.$cytoscape = cytoscape

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  vuetify,
  template: '<App/>'
})
