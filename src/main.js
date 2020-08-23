import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import instance from './network/request'
import {
  Menu,
  Submenu,
  Row,
  Col,
  MenuItemGroup,
  MenuItem,
  Upload,
  Button,
  Table,
  TableColumn,
  MessageBox,
  Message,
  Dialog,
  Form,
  FormItem,
  Input,
  Radio
} from 'element-ui'
import { joinUrl } from '@/common/util';

Vue.config.productionTip = false
Vue.prototype.$axios = instance
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(Row)
Vue.use(Col)
Vue.use(Radio)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Upload)
Vue.use(Button)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Dialog)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$msgBox = MessageBox
Vue.prototype.joinUrl = joinUrl
Vue.prototype.$message = Message

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')