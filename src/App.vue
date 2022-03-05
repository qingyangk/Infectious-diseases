<template>
  <div v-cloak id="app">
    <router-view />
  </div>
</template>

<script>
import { mapState } from 'vuex'
// import { removeToken } from '@/utils/auth'
// import { resetRouter } from '@/router'

export default {
  name: 'App',
  computed: {
    ...mapState({
      mapdata: state => state.mapdata, // 想获取到的值
      spacetimedata: state => state.spacetimedata // 想获取到的值
    })
  },
  watch: {
    $route(to, from) {
      var that = this
      var path = to.path.slice(1, to.path.lastIndexOf('/')) // 到哪去
      if (path !== 'map') {
        setTimeout(function() {
          that.mapdata.name = '中国' // 地名
          that.mapdata.where = 0 // 层级
          that.mapdata.activeName = '乙类' // 疾病类别
          that.mapdata.Bname = '' // 疾病类型
          that.mapdata.STime = '' // 开始时间
          that.mapdata.ETime = '' // 结束时间
          that.mapdata.space = '市级' // 尺度
          that.mapdata.type = '诊断' // 类型
        }, 600)
      }
      if (path !== 'spacetime') {
        setTimeout(function() {
          that.spacetimedata.name = '中国' // 地名
          that.spacetimedata.where = 0 // 层级
          that.spacetimedata.activeName = '乙类' // 疾病类别
          that.spacetimedata.Bname = '' // 疾病类型
          that.spacetimedata.STime = '' // 开始时间
          that.spacetimedata.ETime = '' // 结束时间
          that.spacetimedata.space = '市级' // 尺度
          that.spacetimedata.type = '诊断' // 类型
        }, 600)
      }
    }
  },
  mounted() {
    let beginTime = 0 // 开始时间
    let differTime = 0 // 时间差
    window.onunload = function() {
      differTime = new Date().getTime() - beginTime
      if (differTime <= 5) {
        // 这是关闭
        // removeToken()
        // resetRouter()
        // window.sessionStorage.clear()
        // window.localStorage.removeItem('city') // 清除值
        // var storage = window.localStorage
        // storage.clear()
      } else {
        console.log('这是刷新')
      }
    }
    window.onbeforeunload = function() {
      beginTime = new Date().getTime()
    }
  }
}
</script>
<style>
html, body, #app{
  height: 100%;
  min-width: 1450px;
  min-height: 550px;
  overflow: hidden;
}
.esri-view .esri-view-surface--inset-outline:focus::after {
  outline: auto 0px Highlight !important;
  outline: auto 0px -webkit-focus-ring-color !important;
}
/* .esri-attribution {
  display: none !important;
} */
[v-cloak]{
  display: none !important;
}
</style>
