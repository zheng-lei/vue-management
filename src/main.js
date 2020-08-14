import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import instance from './network/request'
import { Menu, Submenu, Row, Col, MenuItemGroup, MenuItem, } from 'element-ui'

Vue.config.productionTip = false
Vue.prototype.$axios = instance
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(Row)
Vue.use(Col)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
