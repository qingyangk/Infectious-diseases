<template>
  <div id="shi" style="position: absolute;width: 100%;height: 100%">
    <div id="legend" style="position: absolute;z-index: 1;" />
    <div id="timeSlider" class="esri-widget" />
    <div id="MapSanJ1" style="position: absolute;width: 100%;height: 100%;z-index: 0;" />    <!-- 切换 -->
    <router />
  </div>
</template>
<script>
import { loadModules } from 'esri-loader'
import Router from './router'
import eventBum from '../public/js/EvebtBus'
export default {
  name: 'Shi',
  components: {
    Router
  },
  data() {
    return {
      msg: {},
      json: {
        type: '', // 疾病种类
        name: '中国', // 城市名称
        where: '', // 层级a
        timz: '', // 开始时间
        timx: '', // 结束时间
        spac: '', // 城市尺度
        typh: '' // 患病类型
      },
      // 疾病类型
      jbtype: '',
      // 疾病类型
      jbwhere: '',
      // 聚合图
      shijian: undefined,
      // 时间滑块
      times: undefined,
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
    document.getElementById('shi').style.display = 'none'
  },
  mounted() {
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
      this.json.timz = data.timz
      this.json.timx = data.timx
      this.json.spac = data.spac
      this.json.typh = data.type
      this.transform('制图')
    })
    this._Init()
  },
  methods: {
    _Init() {
      // eslint-disable-next-line no-unused-vars
      const that = this
      const option = {
        url: 'http://js.arcgis.com/4.18/dojo/dojo.js',
        css: 'https://js.arcgis.com/4.18/esri/themes/dark-blue/main.css'
      }

      // 通过loadModules来做衔接
      loadModules(
        [
          'esri/tasks/support/Query',
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
          'esri/widgets/TimeSlider',
          'esri/layers/MapImageLayer'
        ],
        option
      ).then(([Query, TileLayer, Map, MapView, Basemap, SceneView, Camera, FeatureLayer, Legend, SketchViewModel, GraphicsLayer, OnDemandGrid, ColumnHider, Selection, TimeSlider, MapImageLayer]) => {
        const customBasemap = new Basemap({
          portalItem: {
            id: 'a14ba2b66c284ce4bd1c11a335760f70' // WGS84 Streets Vector webmap
          }
        })
        const popupTemplate = {
          title: '{疾病名称}--{性别}', // 全国矢量（省、市、县）
          content: [
            {
              type: 'fields',
              fieldInfos: [
                { fieldName: '卡片编号', label: '卡片编号' },
                { fieldName: '疾病名称', label: '疾病名称' },
                { fieldName: '人群分类', label: '人群分类' },
                { fieldName: '病例分类', label: '病例分类' },
                { fieldName: '发病日期', label: '发病日期' },
                { fieldName: '诊断时间', label: '诊断时间' },
                { fieldName: '报告单位', label: '报告单位' },
                { fieldName: '性别', label: '性别' },
                { fieldName: '出生日期', label: '出生日期' },
                { fieldName: '现住地址国标', label: '现住地址国标' },
                { fieldName: '现住详细地址', label: '现住详细地址' },
                { fieldName: '年龄', label: '年龄' },
                { fieldName: '实验室结果', label: '实验室结果' },
                { fieldName: '死亡日期', label: '死亡日期' }
              ]
            }
          ]
        }
        const norrender = {
          type: 'simple',
          field: 'mag',
          symbol: {
            type: 'simple-marker',
            size: 4,
            color: '#69dcff',
            outline: {
              color: 'rgba(0, 139, 174, 0.5)',
              width: 5
            }
          }
        }
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
        that.shijian = new FeatureLayer({
          url: 'http://114.98.239.36:6080/arcgis/rest/services/ShaanXiDisease/ShaanXiPts/MapServer  ',
          renderer: norrender,
          title: '陕西省手足口病患者',
          popupTemplate: popupTemplate
        })
        const clusterConfig = {
          type: 'cluster',
          clusterRadius: '100px',
          // {cluster_count} is an aggregate field containing
          // the number of features comprised by the cluster
          popupTemplate: {
            title: 'Cluster summary',
            content: '共{cluster_count}人',
            fieldInfos: [{
              fieldName: 'cluster_count',
              format: {
                places: 0,
                digitSeparator: true
              }
            }]
          },
          clusterMinSize: '24px',
          clusterMaxSize: '60px',
          labelingInfo: [{
            labelExpressionInfo: {
              expression: "Text($feature.cluster_count, '#,###')"
            },
            symbol: {
              type: 'text',
              color: '#004a5d',
              font: {
                weight: 'bold',
                family: 'Noto Sans',
                size: '12px'
              }
            },
            labelPlacement: 'center-center'
          }]
        }
        that.shijian.featureReduction = clusterConfig
        that.bxian.visible = false
        that.bShi.visible = false
        that.shijian.visible = false
        const map = new Map({
          basemap: customBasemap,
          layers: [that.bSheng, that.bShi, that.bxian, that.shijian]
        })
        that.view = new MapView({
          container: 'MapSanJ1',
          map: map,
          zoom: 4,
          center: [105.4251727452775, 38.033321774359486]
        })
        // 隐藏放大缩小
        that.view.ui.remove('zoom')
        that.times = new TimeSlider({
          container: 'timeSlider',
          view: that.view,
          // 调整样式
          // mode: 'cumulative-from-end',
          timeVisible: true, // show the time stamps on the timeslider
          loop: true,
          stops: {
            interval: {
              value: 1,
              unit: 'years'
            }
          },
          mode: 'time-window',
          labelFormatFunction: (value, type, element, layout) => {
            const normal = new Intl.DateTimeFormat('en-us')
            switch (type) {
              case 'min':
              case 'max':
                element.setAttribute('style', "font-family: 'Orbitron', sans-serif; font-size: 16px; color: magenta;")
                element.innerText = normal.format(value)
                break
            }
          }
        })
        that.times.set({
          loop: true,
          playRate: 1000
        })
        // document.getElementById('timeSlider').style.display = 'none'
        that.times.visible = false
        // eslint-disable-next-line no-unused-vars
        const legend = new Legend({
          view: that.view
        }, document.getElementById('legend'))
        this.transform('定位')
      })
    },
    transform(e) {
      var that = this
      var sqlwhere = ''
      that.jbtype = ''
      that.shijian.visible = false
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
      document.getElementById('timeSlider').style.display = 'none'
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
      } else if (that.json.spac === '') {
        that.$message({
          message: '请选择城市尺度',
          type: 'warning'
        })
        eventBum.$emit('gai', 1)
      } else {
        if (that.json.typh === '死亡') {
          that.shijian.definitionExpression = that.jbwhere + "疾病名称 = '" + that.jbtype + "' and 发病日期 > '" + that.json.timz + "' and 发病日期 < '" + that.json.timx + "'and 死亡日期 <> '.'"
        } else if (that.json.typh === '重症') {
          that.shijian.definitionExpression = that.jbwhere + "疾病名称 = '" + that.jbtype + "' and 发病日期 > '" + that.json.timz + "' and 发病日期 < '" + that.json.timx + "'and 重症患者 = '是'"
        } else if (that.json.typh === '诊断') {
          that.shijian.definitionExpression = that.jbwhere + "疾病名称 = '" + that.jbtype + "' and 发病日期 > '" + that.json.timz + "' and 发病日期 < '" + that.json.timx + "'"
        } else {
          that.shijian.definitionExpression = that.jbwhere + "疾病名称 = '" + that.jbtype + "' and 发病日期 > '" + that.json.timz + "' and 发病日期 < '" + that.json.timx + "'"
        }
        document.getElementById('timeSlider').style.display = 'block'
        that.shijian.visible = true
        // that.times.layout = 'compact'
        that.view.whenLayerView(that.shijian).then(function(lv) {
          setTimeout(() => {
            eventBum.$emit('gai', 1)
          }, 5000)
          // 时间滑块范围
          that.times.fullTimeExtent = that.shijian.timeInfo.fullTimeExtent
          that.times.fullTimeExtent.start = new Date(that.json.timz)
          that.times.fullTimeExtent.end = new Date(that.json.timx)
          that.times.stops = {
            interval: {
              value: 1,
              unit: 'year'
            }
          }
        })
        that.times.visible = true
      }
    }
  }
}
</script>
<style scoped>
#select{
  display: none;
}
#timeSlider {
  z-index: 999;
  position: fixed;
  left: 20%;
  right: 28%;
  height: 19%;
  bottom: 0;
  background: #303030;
  display: none;
}
#legend{
  position: absolute;
  left: 55px;
  bottom: 0;
}</style>
