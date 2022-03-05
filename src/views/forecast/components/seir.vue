<template>
  <div>
    <div style="position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;">
      <div id="map" style="position: absolute;top: 0px;left: 0px;width: 100%;height: 100%" />
    </div>
    <div>
      <iframe ref="iframe" class="SEIRWarning" src="/html/serirwarning/SEIRWarning.html" />
    </div>
    <router />
    <selectRegion />
  </div>
</template>

<script>
import Router from './router'
import { loadModules } from 'esri-loader'
import SelectRegion from './selectRegion' // 城市选择
import eventBuq from '../public/js/EvebtBus'
export default {
  name: 'SEIRWarning',
  components: {
    Router,
    SelectRegion
  },
  data() {
    return {
      // 地名
      json: {
        table: '', // 表名
        name: '南京市',
        where: 2
      },
      view: undefined,
      map: undefined,
      bShi: undefined,
      query1: undefined,
      datalayer: undefined,
      bSheng: undefined,
      bxian: undefined,
      arearsLayer: undefined,
      backSheng: 'http://114.98.239.36:6080/arcgis/rest/services/ShaanXiDisease/lk/MapServer/2',
      backShi: 'http://114.98.239.36:6080/arcgis/rest/services/ShaanXiDisease/lk/MapServer/1',
      backxian: 'http://114.98.239.36:6080/arcgis/rest/services/ShaanXiDisease/lk/MapServer/0',
      peakResults: undefined
      // SEIR: './SEIRModel/SEIRWarning.html'
    }
  },
  beforeDestroy() {
    eventBuq.$off('json')
  },
  mounted() {
    // 地名
    var that = this
    eventBuq.$on('json', Tiao => {
      that.json.where = Tiao.where
      that.json.name = Tiao.name
      that.dw()
    })
    that.int()
  },
  methods: {
    // 定位
    dw() {
      var that = this
      var sqlwhere = ''
      var sqlwhereurl = ''
      if (that.json.where === 1) {
        that.bSheng.visible = true
        that.bShi.visible = false
        that.bxian.visible = false
        sqlwhere = "省 = '" + that.json.name + "'"
        sqlwhereurl = that.bSheng
        that.bSheng.definitionExpression = "省 = '" + that.json.name + "'"
        // that.datalayer.definitionExpression = "省 = '" + that.json.name + "'"
        that.bSheng.refresh()
        // that.datalayer.refresh()
      } else if (that.json.where === 2) {
        that.bSheng.visible = false
        that.bShi.visible = true
        that.bxian.visible = false
        sqlwhere = "市 = '" + that.json.name + "'"
        sqlwhereurl = that.bShi
        that.bShi.definitionExpression = "市 = '" + that.json.name + "'"
        // that.datalayer.definitionExpression = "市 = '" + that.json.name + "'"
        // that.datalayer.refresh()
        that.bShi.refresh()
      } else if (that.json.where === 3) {
        that.bSheng.visible = false
        that.bShi.visible = false
        that.bxian.visible = true
        sqlwhere = "NAME = '" + that.json.name + "'"
        sqlwhereurl = that.bxian
        that.bxian.definitionExpression = "NAME = '" + that.json.name + "'"
        that.bxian.refresh()
      }
      this.areaQuery(sqlwhere, sqlwhereurl)
    },
    areaQuery(sqlwhere, sqlwhereurl) {
      var that = this
      // var areaLayer = new FeatureLayer(sqlwhereurl)
      that.arearsLayer.removeAll()
      that.map.add(that.arearsLayer)
      that.query1.where = sqlwhere
      sqlwhereurl.queryFeatures(that.query1).then(function(response) {
        if (response.features.length !== 0) {
          that.getAreaResults(response)
        } else {
          // promiseRejected()
        }
      })
    },
    getAreaResults(response) {
      var that = this
      that.peakResults = response.features.map(function(feature) {
        return feature
      })
      that.view.goTo(that.peakResults).then(function name(params) {
      })
    },
    // 地图
    int() {
      const option = {
      // 定义一个包含有JS API中js开发包和css样式文件的对象
        url: 'http://js.arcgis.com/4.16/dojo/dojo.js',
        css: 'https://js.arcgis.com/4.16/esri/themes/dark-blue/main.css'
      }
      // 通过loadModules来做衔接
      loadModules(
        [
          'esri/Map',
          'esri/Basemap',
          'esri/layers/TileLayer',
          'esri/views/SceneView',
          'esri/views/MapView',
          'esri/layers/FeatureLayer',
          'esri/layers/GraphicsLayer',
          'esri/tasks/support/Query',
          'esri/Camera'
        ],
        option
      ).then(([Map, Basemap, TileLayer, SceneView, MapView, FeatureLayer, GraphicsLayer, Query, Camera]) => {
        var that = this
        // 底图
        const backrenderer = {
          type: 'simple', // autocasts as new SimpleRenderer()
          symbol: {
            type: 'simple-fill',
            color: 'rgba(0,136,136,0.2)',
            outline: {
              type: 'simple-line',
              width: 1,
              color: 'rgb(69,96,97)'
            }
          }
        }
        that.arearsLayer = new GraphicsLayer()
        // 省
        that.bSheng = new FeatureLayer({
          url: that.backSheng,
          renderer: backrenderer,
          legendEnabled: false,
          title: '省际'
        })
        // 市
        that.bShi = new FeatureLayer({
          url: that.backShi,
          renderer: backrenderer,
          legendEnabled: false,
          title: '市际'
        })
        // 县区地图
        that.bxian = new FeatureLayer({
          url: that.backxian,
          title: '陕西省',
          renderer: backrenderer,
          legendEnabled: false
        })
        const layer = new TileLayer({
          url:
            'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer'
        })
        const customBasemap = new Basemap({
          baseLayers: [layer],
          title: 'Custom Basemap',
          id: 'myBasemap'
        })
        that.query1 = new Query({
          returnGeometry: true,
          outFields: ['*']
        })
        that.map = new Map({
          basemap: customBasemap
        // layers: [featureLayer]
        })
        // eslint-disable-next-line no-unused-vars
        that.view = new MapView({
          zoom: 4,
          center: [113.37048202663054, 33.52942318538481],
          container: 'map',
          map: that.map
        })
        // 隐藏放大缩小
        that.view.ui.remove('zoom')
        that.dw()
      })
    }
  }
}
</script>

<style scoped>
.SEIRWarning{
  position: absolute;
  width: calc(100% - 40px);
  height: 110%;
  top: -68px;
  left: 40px;
  margin: 0;
  padding: 0;
  border: none;
}
</style>
