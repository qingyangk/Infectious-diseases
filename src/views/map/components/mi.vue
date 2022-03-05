<template>
  <div id="mi" style="position: absolute;width: 100%;height: 100%">
    <div id="MapSanJ1" style="position: absolute;width: 100%;height: 100%;z-index: 0;" />
    <div id="legend" />
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
      json: {
        type: '', // 疾病种类
        name: '中国', // 城市名称
        where: '', // 层级
        timz: '', // 开始时间
        timx: '', // 结束时间
        spac: '', // 城市尺度
        typh: '' // 患病类型
      },
      // gp条件
      params: {
        mianSQL: '',
        mian: '',
        bingSQL: '',
        bing: ''
      },
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
      // 背景底图
      bShi: undefined,
      bSheng: undefined,
      bxian: undefined,
      backSheng: 'http://114.98.239.36:6080/arcgis/rest/services/ShaanXiDisease/lk/MapServer/2',
      backShi: 'http://114.98.239.36:6080/arcgis/rest/services/ShaanXiDisease/lk/MapServer/1',
      backxian: 'http://114.98.239.36:6080/arcgis/rest/services/ShaanXiDisease/lk/MapServer/0',
      xlengre: undefined,
      xianlengre: undefined,
      url: 'http://110.40.187.212:6080/arcgis/rest/services/ShaanXiDisease/ztt/MapServer/4',
      url12: 'http://110.40.187.212:6080/arcgis/rest/services/ShaanXiDisease/ztt/MapServer/5',
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
    document.getElementById('mi').style.display = 'none'
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
          'esri/tasks/support/Query'
        ],
        option
      ).then(([FeatureSet, TileLayer, Map, MapView, Basemap, SceneView, Camera, FeatureLayer, Legend, SketchViewModel, GraphicsLayer, OnDemandGrid, ColumnHider, Selection, DotDensityRenderer, MapImageLayer, Geoprocessor, QueryTask, Query]) => {
        const customBasemap = new Basemap({
          portalItem: {
            id: 'a14ba2b66c284ce4bd1c11a335760f70' // WGS84 Streets Vector webmap
          }
        })
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
        // 密度

        const dotDensityRenderer = new DotDensityRenderer({
          dotValue: 100,
          outline: null,
          referenceScale: 5777900, // 1:577,790 view scale
          legendOptions: {
            unit: '人'
          },
          attributes: [
            {
              field: '散居儿童',
              color: '#f23c3f',
              label: '散居儿童'
            },
            {
              field: '幼托儿童',
              color: '#e8ca0d',
              label: '幼托儿童'
            },
            {
              field: '学生',
              color: '#00b6f1',
              label: '学生'
            }
          ]
        })
        that.shiLayer = new FeatureLayer({
          url: 'http://110.40.187.212:6080/arcgis/rest/services/ShaanXiDisease/server/MapServer/0',
          renderer: dotDensityRenderer,
          outFields: ['*'],
          title: ''
        })
        that.xianLayer = new FeatureLayer({
          url: 'http://110.40.187.212:6080/arcgis/rest/services/ShaanXiDisease/server/MapServer/1',
          renderer: dotDensityRenderer,
          outFields: ['*'],
          title: ''
        })
        that.shiLayer.visible = false
        that.xianLayer.visible = false
        that.bxian.visible = false
        that.bShi.visible = false
        that.map = new Map({
          basemap: customBasemap,
          layers: [that.bSheng, that.bShi, that.bxian, that.shiLayer, that.xianLayer]
        })
        that.view = new MapView({
          container: 'MapSanJ1',
          map: that.map,
          zoom: 4,
          center: [105.4251727452775, 38.033321774359486]
        })
        // 隐藏放大缩小
        that.view.ui.remove('zoom')
        that.resultImglayer = new MapImageLayer({
          title: '图例'
        })
        const gpUrl = 'http://114.98.239.36:6080/arcgis/rest/services/ShaanXiDisease/ThematicMap/GPServer/%E4%B8%93%E9%A2%98%E5%9B%BE'
        that.gp = new Geoprocessor(gpUrl)
        that.gp.outSpatialReference = {
          wkid: 102100
        }
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
      that.view.when(function() {
        if (that.json.name !== '中国') {
          eventBum.$emit('gai', 0)
          if (that.json.type === '陕西手足口点') {
            that.jbtype = '手足口病'
          } else {
            that.jbtype = that.json.type
          }
          that.params.mian = ''
          if (that.json.spac === '市级') {
            that.bSheng.visible = false
            that.bShi.visible = true
            that.bxian.visible = false
            that.popName = '市'
            that.params.mian = 'ShaanXiDisease.DBO.市'
          } else if (that.json.spac === '县级') {
            that.bSheng.visible = false
            that.bShi.visible = false
            that.bxian.visible = true
            that.popName = '县'
            that.params.mian = 'ShaanXiDisease.DBO.县'
          }
          that.params.mianSQL = ''
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
            that.params.mianSQL = "省 = '" + that.json.name + "'"
            that.areaQuery(sqlwhere, 1, e)
          } else if (that.json.where === 2) {
            sqlwhere = "市 = '" + that.json.name + "'"
            that.bShi.definitionExpression = "市 = '" + that.json.name + "'"
            that.bxian.definitionExpression = "市 = '" + that.json.name + "'"
            that.jbwhere = "市 = '" + that.json.name + "' and "
            that.shiLayer.definitionExpression = "市 = '" + that.json.name + "'"
            that.xianLayer.definitionExpression = "市 = '" + that.json.name + "'"
            that.params.mianSQL = "市 = '" + that.json.name + "'"
            // 数据限制
            that.areaQuery(sqlwhere, 2, e)
          } else if (that.json.where === 3) {
            sqlwhere = "NAME = '" + that.json.name + "'"
            that.bxian.definitionExpression = "NAME = '" + that.json.name + "'"
            that.jbwhere = "县 = '" + that.json.name + "' and "
            that.xianLayer.definitionExpression = "NAME = '" + that.json.name + "'"
            that.params.mianSQL = "NAME = '" + that.json.name + "'"
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
          // console.log(response)
          if (response.features.length !== 0) {
            peakResults = response.features.map(function(feature) {
              return feature
            })
            that.view.goTo(peakResults)
          }
        })
      }
      that.popupTemplate = {
        title: '{' + that.popName + '} -' + that.jbtype, // 全国矢量（省、市、县）
        content: [
          {
            type: 'fields',
            fieldInfos: [
              { fieldName: 'Join_Count', label: '累计人数' }
            ]
          }
        ]
      }
      that.params.bingSQL = ''
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
        } else if (that.json.spac === '') {
          that.$message({
            message: '请选择城市尺度',
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
          }, 2500)
          if (that.json.spac === '县级') {
            that.shiLayer.visible = false
            that.xianLayer.visible = true
          } else if (that.json.spac === '市级') {
            that.shiLayer.visible = true
            that.xianLayer.visible = false
          }
          // that.gp.submitJob(that.params).then((jobInfo) => {
          //   var options = {
          //     interval: 1500,
          //     statusCallback: function(j) {
          //       console.log('Job Status: ', j.jobStatus)
          //       // console.log('返回专题地图')
          //     }
          //   }
          //   // 监听执行结束
          //   that.gp.waitForJobCompletion(jobInfo.jobId, options).then((jobInfo2) => {
          //     // 加载地图方法
          //     var mapUrl = 'http://114.98.239.36:6080/arcgis/rest/services/ShaanXiDisease/ThematicMap/MapServer/jobs/' + jobInfo2.jobId
          //     that.resultImglayer.url = mapUrl
          //     that.resultImglayer.sublayers = [
          //       {
          //         id: 0,
          //         visible: false,
          //         popupTemplate: that.popupTemplate,
          //         legendEnabled: false
          //       },
          //       {
          //         id: 1,
          //         legendEnabled: true,
          //         visible: true
          //       },
          //       {
          //         id: 2,
          //         legendEnabled: false,
          //         popupTemplate: that.popupTemplate,
          //         visible: false
          //       }
          //     ]
          //     that.queryData.where = ''
          //     that.queryTask.url = mapUrl + '/0'
          //     that.queryTask.execute(that.queryData).then(function(response) {
          //       // console.log(response)
          //       eventBum.$emit('gai', 1)
          //       that.map.add(that.resultImglayer)
          //     })
          //   })
          // })
        }
      } else {
        eventBum.$emit('gai', 1)
      }
    }
  }
}
</script>

<style scoped>
#mi {
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
