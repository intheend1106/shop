import Vue from 'vue'
import App from './App.vue'
import router from './router'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// 导入全局样式
import 'assets/css/normalize.css'
// 引入字体图标
import 'assets/fonts/iconfont.css'

// 全局导入则不用这样写
// import {
//   Message
// } from 'element-ui'

// Vue.prototype.$message = Message

// 引入axios
import axios from 'axios'

axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
// 添加请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  console.log(config);
  return config
})

Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')