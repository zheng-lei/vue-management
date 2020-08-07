import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import instance from './network/request'

Vue.config.productionTip = false
Vue.prototype.$axios = instance

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
