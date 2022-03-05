<template>
  <div id="gwr" style="position: absolute;width: 100%;height: 100%">
    <div id="MapSanJ1" style="position: absolute;width: 100%;height: 100%;z-index: 0;" />
    <div id="legend" />
    <!-- 切换 -->
    <router />
  </div>
</template>
<script>
import { loadModules } from 'esri-loader'
import Router from './router'
import eventBum from '../public/js/EvebtBus'
export default {
  name: 'Gwr',
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
        typh: '', // 患病类型
        influence: '' // 患病影响因子
      },
      // gp条件
      params: {
        mianSQL: '',
        mian: '',
        bingSQL: '',
        bing: '',
        解释变量: ['Join_Count']
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
      url: 'http://110.40.187.212:6080/arcgis/rest/services/ShaanXiDisease/service/MapServer/4',
      url12: 'http://110.40.187.212:6080/arcgis/rest/services/ShaanXiDisease/service/MapServer/5',
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
    document.getElementById('gwr').style.display = 'none'
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
      // var that = this
      this.json.timx = data.timx
      this.json.spac = data.spac
      this.json.typh = data.type
      this.json.influence = data.influence
      this.transform('制图')
    })
    this._Init()
  },
  methods: {
    mousedown(event) {
      var that = this
      const Querymodule = document.getElementById('Querymodule')
      const x = event.pageX - Querymodule.offsetLeft
      const y = event.pageY - Querymodule.offsetTop
      this.canMove = true
      document.onmouseup = function() {
        that.canMove = false
        document.onmousemove = null
        document.onmouseup = null
      }
      document.onmousemove = function(e) {
        if (that.canMove) {
          var left = e.clientX - x
          var top = e.clientY - y
          if (left < 0) left = 0
          if (top < 0) top = 0
          var maxLeft = window.innerWidth - Querymodule.offsetWidth
          var maxTop = window.innerHeight - Querymodule.offsetHeight
          if (left > maxLeft) left = maxLeft
          if (top > maxTop) top = maxTop
          Querymodule.style.left = left + 'px'
          Querymodule.style.top = top + 'px'
        }
      }
    },
    _Init: function() {
      var that = this
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
          'esri/renderers/DotDensityRenderer',
          'esri/layers/MapImageLayer',
          'esri/tasks/Geoprocessor',
          'esri/tasks/QueryTask',
          'esri/tasks/support/Query'
        ],
        option
      ).then(([TileLayer, Map, MapView, Basemap, SceneView, Camera, FeatureLayer, Legend, SketchViewModel, GraphicsLayer, OnDemandGrid, ColumnHider, Selection, DotDensityRenderer, MapImageLayer, Geoprocessor, QueryTask, Query]) => {
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
        // 新兴图层
        that.xlengre = new FeatureLayer({
          url: this.url,
          title: '街道地理加权回归分析'
        })
        // 新兴图层
        that.xianlengre = new FeatureLayer({
          url: this.url12,
          title: '区县地理加权回归分析'
        })
        that.xlengre.visible = false
        that.xianlengre.visible = false
        that.bxian.visible = false
        that.bShi.visible = false
        that.map = new Map({
          basemap: customBasemap,
          layers: [that.bSheng, that.bShi, that.bxian, that.xlengre, that.xianlengre]
        })
        that.view = new MapView({
          container: 'MapSanJ1',
          map: that.map,
          zoom: 4,
          center: [105.4251727452775, 38.033321774359486]
        })
        // 隐藏放大缩小
        that.view.ui.remove('zoom')
        const gpUrl = 'http://114.98.239.36:6080/arcgis/rest/services/ShaanXiDisease/gwrr/GPServer/%E5%9C%B0%E7%90%86%E5%8A%A0%E6%9D%83%E5%9B%9E%E5%BD%92'
        that.gp = new Geoprocessor(gpUrl)
        that.gp.outSpatialReference = {
          wkid: 102100
        }
        that.resultImglayer = new MapImageLayer({
          title: '图例'
        })
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
            that.jbwhere = "省 = '" + that.json.name + "' and "
            // 数据限制
            that.params.mianSQL = "省 = '" + that.json.name + "'"
            that.areaQuery(sqlwhere, 1, e)
          } else if (that.json.where === 2) {
            sqlwhere = "市 = '" + that.json.name + "'"
            that.bShi.definitionExpression = "市 = '" + that.json.name + "'"
            that.bxian.definitionExpression = "市 = '" + that.json.name + "'"
            that.jbwhere = "市 = '" + that.json.name + "' and "
            that.params.mianSQL = "市 = '" + that.json.name + "'"
            // 数据限制
            that.areaQuery(sqlwhere, 2, e)
          } else if (that.json.where === 3) {
            sqlwhere = "NAME = '" + that.json.name + "'"
            that.bxian.definitionExpression = "NAME = '" + that.json.name + "'"
            that.jbwhere = "县 = '" + that.json.name + "' and "
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
      that.xlengre.visible = false
      that.xianlengre.visible = false
      if (that.map.remove(that.resultImglayer)) {
        that.map.remove(that.resultImglayer)
      }
      if (that.map.remove(that.resultImglayer)) {
        that.map.remove(that.resultImglayer)
      }
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
        } else if (that.json.size === '') {
          that.$message({
            message: '请选择标准差椭圆尺寸',
            type: 'warning'
          })
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
            console.log(that.json.spac)
            if (that.json.spac === '县级') {
              that.xianlengre.visible = true
            } if (that.json.spac === '街道') {
              that.xlengre.visible = true
            }
            eventBum.$emit('gai', 1)
          }, 3000)
        }
      } else {
        eventBum.$emit('gai', 1)
      }
      // that.gp.submitJob(that.params).then((jobInfo) => {
      //   var options = {
      //     interval: 1500,
      //     statusCallback: function(j) {
      //       // console.log('Job Status: ', j.jobStatus)
      //       // console.log('返回专题地图')
      //     }
      //   }
      //   // 监听执行结束
      //   that.gp.waitForJobCompletion(jobInfo.jobId, options).then((jobInfo2) => {
      //     // 加载地图方法
      //     var mapUrl = 'http://114.98.239.36:6080/arcgis/rest/services/ShaanXiDisease/gwrr/MapServer/jobs/' + jobInfo2.jobId
      //     that.resultImglayer.url = mapUrl
      //     that.resultImglayer.sublayers = [
      //       {
      //         id: 0,
      //         visible: true,
      //         // popupTemplate: that.popupTemplate,
      //         legendEnabled: true
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
  }
}
</script>
<style scoped>
#gwr {
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
