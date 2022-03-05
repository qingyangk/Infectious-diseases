<template>
  <div id="re" style="position: absolute;width: 100%;height: 100%">
    <div id="MapSanJ1" style="position: absolute;width: 100%;height: 100%;" />
    <div id="legend" style="position: absolute;z-index: 1;" />
    <!-- 切换 -->
    <router />
  </div>
</template>
<script>
import { loadModules } from 'esri-loader'
import Router from './router'
import eventBum from '../public/js/EvebtBus'

export default {
  name: 'Re',
  components: {
    Router
  },
  data() {
    return {
      msg: {},
      json: {
        type: '', // 疾病种类
        name: '中国', // 城市名称
        where: '', // 层级
        timz: '', // 开始时间
        timx: '', // 结束时间
        spac: '', // 城市尺度
        typh: '' // 患病类型
      },
      // 疾病类型
      jbtype: '',
      // 疾病类型
      jbwhere: '',
      // 热力图
      heat: undefined,
      // view
      view: undefined,
      // 背景底图
      bShi: undefined,
      bSheng: undefined,
      bxian: undefined,
      backSheng: 'http://114.98.239.36:6080/arcgis/rest/services/ShaanXiDisease/lk/MapServer/2',
      backShi: 'http://114.98.239.36:6080/arcgis/rest/services/ShaanXiDisease/lk/MapServer/1',
      backxian: 'http://114.98.239.36:6080/arcgis/rest/services/ShaanXiDisease/lk/MapServer/0',
      // 查询底图
      queryWhere: undefined
    }
  },
  beforeDestroy() {
    // 关闭传值
    eventBum.$off('typc')
    eventBum.$off('type')
    eventBum.$off('json')
    eventBum.$off('data')
    eventBum.$off('space')
    document.getElementById('re').style.display = 'none'
  },
  mounted() {
    // 城市尺度
    eventBum.$on('space', json => {
      this.json.spac = json
    })
    // 疾病名称
    eventBum.$on('typc', typc => {
      this.json.type = typc
    })
    eventBum.$on('type', type => {
      this.json.type = type
    })
    // 城市名称
    eventBum.$on('json', json => {
      this.json.name = json.name
      this.json.where = json.where
    })
    // 制图条件
    eventBum.$on('data', data => {
      var that = this
      this.json.timz = data.timz
      this.json.timx = data.timx
      this.json.spac = data.spac
      this.json.typh = data.type
      this.transform('制图')
      if (this.json.name === '中国') {
        that.$message({
          message: '请选择城市',
          type: 'warning'
        })
      }
    })
    this._Init()
  },
  methods: {
    _Init: function() {
      // eslint-disable-next-line no-unused-vars
      const that = this
      const option = {
        url: 'http://js.arcgis.com/4.18/dojo/dojo.js',
        css: 'https://js.arcgis.com/4.18/esri/themes/dark-blue/main.css'
      }
      // 通过loadModules来做衔接
      loadModules(
        [
          'esri/layers/TileLayer',
          'esri/Map',
          'esri/views/MapView',
          'esri/Basemap',
          'esri/views/SceneView',
          'esri/Camera',
          'esri/layers/FeatureLayer',
          'esri/widgets/Legend',
          'esri/widgets/Sketch/SketchViewModel',
          'esri/layers/GraphicsLayer',
          'dgrid/OnDemandGrid',
          'dgrid/extensions/ColumnHider',
          'dgrid/Selection',
          'esri/renderers/HeatmapRenderer',
          'esri/layers/MapImageLayer',
          'esri/tasks/support/Query'
        ],
        option
      ).then(([TileLayer, Map, MapView, Basemap, SceneView, Camera, FeatureLayer, Legend, SketchViewModel, GraphicsLayer, OnDemandGrid, ColumnHider, Selection, HeatmapRenderer, MapImageLayer, Query]) => {
        const customBasemap = new Basemap({
          portalItem: {
            id: 'a14ba2b66c284ce4bd1c11a335760f70' // WGS84 Streets Vector webmap
          }
        })
        // 查询
        that.queryWhere = new Query({
          returnGeometry: true,
          outFields: ['*']
        })
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
        // 底图
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
        var heatmapRenderer = new HeatmapRenderer({
          blurRadius: 4,
          colorStops: [
            { color: 'rgba(0,0,0,0)', ratio: 0 },
            { color: '#90a1be', ratio: 0.083 },
            { color: '#9c8184', ratio: 0.166 },
            { color: '#a761aa', ratio: 0.249 },
            { color: '#af4980', ratio: 0.332 },
            { color: '#b83055', ratio: 0.415 },
            { color: '#c0182a', ratio: 0.498 },
            { color: '#c80000', ratio: 0.571 },
            { color: '#d33300', ratio: 0.654 },
            { color: '#de6600', ratio: 0.737 },
            { color: '#e99900', ratio: 0.82 },
            { color: '#f4cc00', ratio: 0.903 },
            { color: '#ffff00', ratio: 1 }
          ],
          maxPixelIntensity: 25,
          minPixelIntensity: 0
        })
        that.heat = new FeatureLayer({
          url: 'http://114.98.239.36:6080/arcgis/rest/services/ShaanXiDisease/ShaanXiPts/MapServer',
          title: '热力图'
        })
        that.heat.renderer = heatmapRenderer
        that.bxian.visible = false
        that.bShi.visible = false
        that.heat.visible = false
        // WH_Water.definitionExpression = "发病日期 > '2018-01-01' and 发病日期 < '2019-01-01'"
        const map = new Map({
          basemap: customBasemap,
          layers: [that.bSheng, that.bShi, that.bxian, that.heat]
        })
        that.view = new MapView({
          container: 'MapSanJ1',
          map: map,
          zoom: 4,
          center: [105.4251727452775, 38.033321774359486]
        })
        that.view.ui.remove('zoom')
        // eslint-disable-next-line no-unused-vars
        const legend = new Legend({
          view: that.view
        }, document.getElementById('legend'))
        this.transform('定位')
        // console.log(that.json.spac)
      })
    },
    transform(e) {
      var that = this
      var sqlwhere = ''
      that.jbtype = ''
      that.heat.visible = false
      that.view.when(function() {
        if (that.json.name !== '中国') {
          eventBum.$emit('gai', 0)
          if (that.json.type === '陕西手足口点') {
            that.jbtype = '手足口病'
          } else {
            that.jbtype = that.json.type
          }
          if (that.json.spac === '市级') {
            that.bSheng.visible = false
            that.bShi.visible = true
            that.bxian.visible = false
          } else if (that.json.spac === '县级') {
            that.bSheng.visible = false
            that.bShi.visible = false
            that.bxian.visible = true
          }
          if (that.json.where === 1) {
            sqlwhere = "省 = '" + that.json.name + "'"
            // 面图层限制
            that.bSheng.definitionExpression = "省 = '" + that.json.name + "'"
            that.bShi.definitionExpression = "省 = '" + that.json.name + "'"
            that.bxian.definitionExpression = "省 = '" + that.json.name + "'"
            that.jbwhere = "省 = '" + that.json.name + "' and "
            // 数据限制
            that.areaQuery(sqlwhere, 1, e)
          } else if (that.json.where === 2) {
            sqlwhere = "市 = '" + that.json.name + "'"
            that.bShi.definitionExpression = "市 = '" + that.json.name + "'"
            that.bxian.definitionExpression = "市 = '" + that.json.name + "'"
            that.jbwhere = "市 = '" + that.json.name + "' and "
            // 数据限制
            that.areaQuery(sqlwhere, 2, e)
          } else if (that.json.where === 3) {
            sqlwhere = "NAME = '" + that.json.name + "'"
            that.bxian.definitionExpression = "NAME = '" + that.json.name + "'"
            that.jbwhere = "县 = '" + that.json.name + "' and "
            that.areaQuery(sqlwhere, 3, e)
          } else {
            that.$message({
              message: '请选择城市',
              type: 'warning'
            })
          }
        }
      })
    },
    areaQuery(sqlwhere, sqlwhereurl, e) {
      var that = this
      var peakResults
      that.queryWhere.where = sqlwhere
      if (sqlwhereurl === 1) {
        that.bSheng.queryFeatures(that.queryWhere).then(function(response) {
          if (response.features.length !== 0) {
            peakResults = response.features.map(function(feature) {
              return feature
            })
            that.view.goTo(peakResults)
          }
        })
      } else if (sqlwhereurl === 2) {
        that.bShi.queryFeatures(that.queryWhere).then(function(response) {
          if (response.features.length !== 0) {
            peakResults = response.features.map(function(feature) {
              return feature
            })
            that.view.goTo(peakResults)
          }
        })
      } else if (sqlwhereurl === 3) {
        that.bxian.queryFeatures(that.queryWhere).then(function(response) {
          if (response.features.length !== 0) {
            peakResults = response.features.map(function(feature) {
              return feature
            })
            that.view.goTo(peakResults)
          }
        })
      }
      if (e === '制图') {
        if (that.json.timz === 'NaN-NaN-NaN') {
          that.$message({
            message: '请选择开始时间',
            type: 'warning'
          })
          eventBum.$emit('gai', 1)
        } else if (that.json.timx === 'NaN-NaN-NaN') {
          that.$message({
            message: '请选择结束时间',
            type: 'warning'
          })
          eventBum.$emit('gai', 1)
        } else if (that.json.type === '') {
          that.$message({
            message: '请选择疾病',
            type: 'warning'
          })
          eventBum.$emit('gai', 1)
        } else if (that.json.name === '') {
          that.$message({
            message: '请选择城市',
            type: 'warning'
          })
          eventBum.$emit('gai', 1)
        } else {
          if (that.json.typh === '死亡') {
            that.heat.definitionExpression = that.jbwhere + "疾病名称 = '" + that.jbtype + "' and 发病日期 > '" + that.json.timz + "' and 发病日期 < '" + that.json.timx + "'and 死亡日期 <> '.'"
          } else if (that.json.typh === '重症') {
            that.heat.definitionExpression = that.jbwhere + "疾病名称 = '" + that.jbtype + "' and 发病日期 > '" + that.json.timz + "' and 发病日期 < '" + that.json.timx + "'and 重症患者 = '是'"
          } else if (that.json.typh === '诊断') {
            that.heat.definitionExpression = that.jbwhere + "疾病名称 = '" + that.jbtype + "' and 发病日期 > '" + that.json.timz + "' and 发病日期 < '" + that.json.timx + "'"
          } else {
            that.heat.definitionExpression = that.jbwhere + "疾病名称 = '" + that.jbtype + "' and 发病日期 > '" + that.json.timz + "' and 发病日期 < '" + that.json.timx + "'"
          }
          that.heat.visible = true
        }

        setTimeout(() => {
          eventBum.$emit('gai', 1)
        }, 10000)
      } else {
        eventBum.$emit('gai', 1)
      }
    }
  }
}
</script>
<style scoped>

#legend{
  position: absolute;
  left: 55px;
  bottom: 0;
}</style>
