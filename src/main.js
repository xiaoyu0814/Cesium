// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/router.js'
import iView from 'iview'
import 'iview/dist/styles/iview.css' 
import './common/css/common.css'
import './common/less/common.less'
import './common/less/index.less'
import api from './api/index.js';
import store from './store/index'
import echarts from 'echarts'
import map from '@/utils/map.js'
import './components/global/index'
import vuescroll from 'vuescroll';
import path from '@/api/path'
import 'jquery'
import  'jquery.nicescroll'
Vue.use(vuescroll, {
  ops: {}, // 在这里设置全局默认配置
  name: 'vueScroll' // 在这里自定义组件名字，默认是vueScroll
});

Vue.config.productionTip = false

Vue.prototype.$api = api

Vue.prototype.$echarts = echarts

Vue.prototype.$interfacePath = path
Vue.use(map)
Vue.use(iView)
//Vue.use(ElementUI)
 
/* eslint-disable no-new */
const vm = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
})

export default vm;
