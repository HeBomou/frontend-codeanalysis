import Vue from 'vue'
<<<<<<< HEAD
import App from './App.vue'
import vuetify from './plugins/vuetify';
=======
import App from './App'
import router from './router'
import vuetify from './plugins/vuetify'
import cytoscape from "cytoscape"
>>>>>>> d13fb5dd3fab18ba6ea211557fa6f7e99863535c

Vue.config.productionTip = false
Vue.prototype.$cytoscape = cytoscape

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
