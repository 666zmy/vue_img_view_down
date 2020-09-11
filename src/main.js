import Vue from 'vue'
import App from './App'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import './lib/ant-design-import'
import axios from 'axios'
Vue.prototype.$axios = axios
Vue.use(Antd)
Vue.config.productionTip = false
new Vue({
  render: h => h(App)
}).$mount('#app')
