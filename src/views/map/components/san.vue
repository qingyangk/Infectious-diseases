<template>
  <div id="san" style="position: absolute;width: 100%;height: 100%">
    <div id="MapSanJ1" style="position: absolute;width: 100%;height: 100%;z-index: 0;" />
    <div id="legend" style="position: absolute;z-index: 1;" />
    <!-- 切换 -->
    <router />
  </div>
</template>
<script>
import { loadModules } from 'esri-loader'
import Router from './router'
import eventBum from '../public/js/EvebtBus'
// import town from '../public/js/Township.json'
export default {
  name: 'San',
  components: {
    Router
  },
  data() {
    return {
      json: {
        type: '', // 疾病种类
        name: '中国', // 城市名称
        where: '', // 层级
        timz: '', // 开始时间
        timx: '', // 结束时间
        spac: '', // 城市尺度
        typh: '' // 患病类型
      },
      series: [],
      // gp条件
      params: {
        mianSQL: '',
        mian: '',
        bingSQL: '',
        bing: ''
      },
      // echarts
      echarts: {},
      // 弹窗
      popupTemplate: {},
      popName: '',
      // 疾病类型
      jbtype: '',
      // 疾病类型
      jbwhere: '',
      // 聚合图
      resultImglayer: undefined,
      // view
      view: undefined,
      map: undefined,
      // gp服务
      gp: undefined,
      // 要素图层
      xianLayer: undefined,
      shiLayer: undefined,
      // 背景底图
      bShi: undefined,
      bSheng: undefined,
      bxian: undefined,
      backSheng: 'http://114.98.239.36:6080/arcgis/rest/services/ShaanXiDisease/lk/MapServer/2',
      backShi: 'http://114.98.239.36:6080/arcgis/rest/services/ShaanXiDisease/lk/MapServer/1',
      backxian: 'http://114.98.239.36:6080/arcgis/rest/services/ShaanXiDisease/lk/MapServer/0',
      // 查询底图
      queryWhere: undefined,
      queryTask: undefined,
      queryData: undefined
    }
  },
  beforeDestroy() {
    // 关闭传值
    eventBum.$off('typc')
    eventBum.$off('type')
    eventBum.$off('json')
    eventBum.$off('data')
    eventBum.$off('space')
    document.getElementById('san').style.display = 'none'
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
      // eslint-disable-next-line no-unused-vars
      var that = this
      this.json.timz = data.timz
      this.json.timx = data.timx
      this.json.spac = data.spac
      this.json.typh = data.type
      this.transform('制图')
      // if (this.json.name === '中国') {
      //   that.$message({
      //     message: '请选择城市',
      //     type: 'warning'
      //   })
      // }
    })
    this._Init()
  },
  methods: {
    _Init: function() {
      var that = this
      const option = {
        url: 'http://js.arcgis.com/4.18/dojo/dojo.js',
        css: 'https://js.arcgis.com/4.18/esri/themes/dark-blue/main.css'
      }
      // 通过loadModules来做衔接
      loadModules(
        [
          'esri/tasks/support/FeatureSet',
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
          'esri/renderers/DotDensityRenderer',
          'esri/layers/MapImageLayer',
          'esri/tasks/Geoprocessor',
          'esri/tasks/QueryTask',
          'esri/tasks/support/Query',
          '/js/echartsLayer.js',
          'esri/layers/GeoJSONLayer'
        ],
        option
      ).then(([FeatureSet, TileLayer, Map, MapView, Basemap, SceneView, Camera, FeatureLayer, Legend, SketchViewModel, GraphicsLayer, OnDemandGrid, ColumnHider, Selection, DotDensityRenderer, MapImageLayer, Geoprocessor, QueryTask, Query, echartsLayer, GeoJSONLayer]) => {
        const customBasemap = new Basemap({
          portalItem: {
            id: 'a14ba2b66c284ce4bd1c11a335760f70' // WGS84 Streets Vector webmap
          }
        })
        // console.log(Object.values(map))
        // 查询地址
        that.queryWhere = new Query({
          returnGeometry: true,
          outFields: ['*']
        })
        // 查询数据
        that.queryData = new Query({
          returnGeometry: true,
          outFields: ['*']
        })
        that.queryTask = new QueryTask({
        })
        // eslint-disable-next-line no-unused-vars
        const renderer = {
          type: 'simple', // autocasts as new SimpleRenderer()
          symbol: {
            type: 'polygon-3d', // autocasts as new PolygonSymbol3D()
            symbolLayers: [
              {
                type: 'extrude' // autocasts as new ExtrudeSymbol3DLayer()
              }
            ]
          },
          visualVariables: [
            {
              type: 'size',
              field: 'Join_Count',
              legendOptions: {
                title: ''
              },
              stops: [
                {
                  value: 100,
                  size: 10000,
                  label: '<100'
                },
                {
                  value: 200,
                  size: 20000,
                  label: '<200'
                },
                {
                  value: 300,
                  size: 30000,
                  label: '<300'
                },
                {
                  value: 10000,
                  size: 40000,
                  label: '>300'
                }
              ]
            },
            {
              type: 'color',
              field: 'Join_Count',
              legendOptions: {
                title: ''
              },
              stops: [
                {
                  value: 100,
                  color: '#FFFCD4',
                  label: '<100'
                },
                {
                  value: 200,
                  color: '#f7f7f7',
                  label: '<200'
                },
                {
                  value: 300,
                  color: '#92c5de',
                  label: '<300'
                },
                {
                  value: 10000,
                  color: '#f4a582',
                  label: '>300'
                }
              ]
            }
          ]
        }
        const renderer1 = {
          type: 'simple', // autocasts as new SimpleRenderer()
          symbol: {
            type: 'polygon-3d', // autocasts as new PolygonSymbol3D()
            symbolLayers: [
              {
                type: 'extrude' // autocasts as new ExtrudeSymbol3DLayer()
              }
            ]
          },
          visualVariables: [
            {
              type: 'size',
              field: 'Join_Count',
              legendOptions: {
                title: ''
              },
              stops: [
                {
                  value: 10000,
                  size: 10000,
                  label: '<10000'
                },
                {
                  value: 20000,
                  size: 20000,
                  label: '<20000'
                },
                {
                  value: 50000,
                  size: 30000,
                  label: '<50000'
                },
                {
                  value: 100000,
                  size: 40000,
                  label: '>100000'
                }
              ]
            },
            {
              type: 'color',
              field: 'Join_Count',
              legendOptions: {
                title: ''
              },
              stops: [
                {
                  value: 10000,
                  color: '#FFFCD4',
                  label: '<10000'
                },
                {
                  value: 20000,
                  color: '#f7f7f7',
                  label: '<20000'
                },
                {
                  value: 50000,
                  color: '#92c5de',
                  label: '<50000'
                },
                {
                  value: 100000,
                  color: '#f4a582',
                  label: '>100000'
                }
              ]
            }
          ]
        }
        that.shiLayer = new FeatureLayer({
          url: 'http://110.40.187.212:6080/arcgis/rest/services/ShaanXiDisease/server/MapServer/0',
          renderer: renderer1,
          outFields: ['*'],
          title: ''
        })
        that.xianLayer = new FeatureLayer({
          url: 'http://110.40.187.212:6080/arcgis/rest/services/ShaanXiDisease/server/MapServer/1',
          renderer: renderer,
          outFields: ['*'],
          title: ''
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
        that.bxian.visible = false
        that.bShi.visible = false
        that.shiLayer.visible = false
        that.xianLayer.visible = false
        that.shiLayer.visible = false
        that.map = new Map({
          basemap: customBasemap,
          layers: [that.bSheng, that.bShi, that.bxian, that.shiLayer, that.xianLayer]
        })
        that.view = new SceneView({
          container: 'MapSanJ1',
          map: that.map,
          camera: {
            position: {
              x: 12200653.753618324,
              y: 1493831.276642229,
              z: 6363167.387148462,
              spatialReference: {
                wkid: 102100
              }
            },
            fov: 55,
            heading: 358.87895262122663,
            tilt: 16.33151720739944
          }
        })
        // 隐藏放大缩小
        that.view.ui.remove('zoom')
        that.view.ui.components = []// 清空所有ESRI自带的组件
        that.resultImglayer = new MapImageLayer({
          title: '图例'
        })
        if (document.getElementById('echartsData') !== null) {
          document.getElementById('echartsData').remove()
        }
        const gpUrl = 'http://114.98.239.36:6080/arcgis/rest/services/ShaanXiDisease/map/GPServer/%E4%B8%93%E9%A2%98%E5%9B%BE'
        that.gp = new Geoprocessor(gpUrl)
        that.gp.outSpatialReference = {
          wkid: 102100
        }
        that.view.when(function() {
          // eslint-disable-next-line new-cap
          // that.echarts = new echartsLayer(that.view)
          // eslint-disable-next-line no-unused-vars
          const legend = new Legend({
            view: that.view
          }, document.getElementById('legend'))
        })
        this.transform('定位')
      })
    },
    transform(e) {
      var that = this
      var sqlwhere = ''
      that.jbtype = ''
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
            that.xianLayer.definitionExpression = "省 = '" + that.json.name + "'"
            that.shiLayer.definitionExpression = "省 = '" + that.json.name + "'"
            that.jbwhere = "省 = '" + that.json.name + "' and "
            // 数据限制
            that.areaQuery(sqlwhere, 1, e)
          } else if (that.json.where === 2) {
            sqlwhere = "市 = '" + that.json.name + "'"
            that.bShi.definitionExpression = "市 = '" + that.json.name + "'"
            that.bxian.definitionExpression = "市 = '" + that.json.name + "'"
            that.shiLayer.definitionExpression = "市 = '" + that.json.name + "'"
            that.xianLayer.definitionExpression = "市 = '" + that.json.name + "'"
            that.jbwhere = "市 = '" + that.json.name + "' and "
            // 数据限制
            that.areaQuery(sqlwhere, 2, e)
          } else if (that.json.where === 3) {
            sqlwhere = "NAME = '" + that.json.name + "'"
            that.bxian.definitionExpression = "NAME = '" + that.json.name + "'"
            that.xianLayer.definitionExpression = "NAME = '" + that.json.name + "'"
            that.jbwhere = "县 = '" + that.json.name + "' and "
            that.areaQuery(sqlwhere, 3, e)
          }
        }
      })
    },
    areaQuery(sqlwhere, sqlwhereurl, e) {
      var that = this
      var peakResults
      that.queryWhere.where = sqlwhere
      // 查询总值
      const colors = ['#ca0020', '#f4a582', '#f7f7f7', '#92c5de', '#0571b0']
      function sumData(params, num, num2) {
        var a = 0
        var b = []
        var c = []
        for (let index = 0; index < params.features.length; index++) {
          const element = params.features[index]
          a += element.attributes.Join_Count
        }
        for (let index = 0; index < num; index++) {
          const element = Math.ceil(a / num * (index + 1) / num2)
          b.push(
            {
              value: element,
              size: 10000 * (index + 1),
              label: element
            })
          c.push({
            value: element,
            color: colors[(num - 1 - index)],
            label: element
          })
        }
        // console.log([b, c])
        return [b, c]
      }
      if (sqlwhereurl === 1) {
        that.bSheng.queryFeatures(that.queryWhere).then(function(response) {
          if (response.features.length !== 0) {
            peakResults = response.features.map(function(feature) {
              return feature
            })
            that.view.goTo(peakResults)
          }
        })
        // 数据
        that.shiLayer.queryFeatures(that.queryWhere).then(function(response) {
          if (that.json.spac === '市级') {
            addlayer(sumData(response, 5), 1, e)
          }
        })
        that.xianLayer.queryFeatures(that.queryWhere).then(function(response) {
          if (that.json.spac === '县级') {
            addlayer(sumData(response, 7, 10), 2, e)
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
        // 数据
        that.shiLayer.queryFeatures(that.queryWhere).then(function(response) {
          if (that.json.spac === '市级') {
            addlayer(sumData(response, 5), 1, e)
          }
        })
        that.xianLayer.queryFeatures(that.queryWhere).then(function(response) {
          if (that.json.spac === '县级') {
            addlayer(sumData(response, 7), 2, e)
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
        // 数据
        that.xianLayer.queryFeatures(that.queryWhere).then(function(response) {
          if (that.json.spac === '县级') {
            addlayer(sumData(response, 1), 2, e)
          }
        })
      }
      // that.xianLayer.renderer = xianRenderer
      function addlayer(params, e, name) {
        that.params.bingSQL = ''
        if (name === '制图') {
          console.log(11111111)
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
              that.params.bingSQL = that.jbwhere + "疾病名称 = '" + that.jbtype + "' and 发病日期 > '" + that.json.timz + "' and 发病日期 < '" + that.json.timx + "'and 死亡日期 <> '.'"
            } else if (that.json.typh === '重症') {
              that.params.bingSQL = that.jbwhere + "疾病名称 = '" + that.jbtype + "' and 发病日期 > '" + that.json.timz + "' and 发病日期 < '" + that.json.timx + "'and 重症患者 = '是'"
            } else if (that.json.typh === '诊断') {
              that.params.bingSQL = that.jbwhere + "疾病名称 = '" + that.jbtype + "' and 发病日期 > '" + that.json.timz + "' and 发病日期 < '" + that.json.timx + "'"
            } else {
              that.params.bingSQL = that.jbwhere + "疾病名称 = '" + that.jbtype + "' and 发病日期 > '" + that.json.timz + "' and 发病日期 < '" + that.json.timx + "'"
            }
            that.params.bing = 'ShaanXiDisease.DBO.陕西手足口点'
            setTimeout(() => {
              eventBum.$emit('gai', 1)
            }, 3000)
            if (e === 2) {
              that.shiLayer.visible = false
              that.xianLayer.visible = true
            } else if (e === 1) {
              that.shiLayer.visible = true
              that.xianLayer.visible = false
            }
          }
        } else {
          eventBum.$emit('gai', 1)
        }
      }
    }
  }
}
</script>
<style scoped>
#san {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url("../public/img/back.png") no-repeat center center;
  /* 背景图不平铺 */
  background-size: cover;
  /* 让背景图基于容器大小伸缩 */
  background-attachment: fixed;
  /* 当内容高度大于图片高度时，背景图像的位置相对于viewport固定 */
  background-color: #CCCCCC;
}
#legend{
  position: absolute;
  left: 55px;
  bottom: 0;
}
</style>
