import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

// import '@/components/flexible'

import IconSvg from '@/components/icon-components'
Vue.component('icon-svg', IconSvg)

import UmyUi from 'umy-ui'
import 'umy-ui/lib/theme-chalk/index.css' // 引入样式
Vue.use(UmyUi)

// import { DrawPolygon } from '@antv/l7-draw'
// Vue.use(DrawPolygon)
// import Cesium from 'cesium/Cesium'
// import 'cesium/Widgets/widgets.css'

// Vue.prototype.Cesium = Cesium
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// 注释掉mock数据的生成--与vue.config.js呼应 同时注释
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }
import BaiduMap from 'vue-baidu-map'
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥
  ak: '0lPULNZ5PmrFVg76kFuRjezF'
})

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
