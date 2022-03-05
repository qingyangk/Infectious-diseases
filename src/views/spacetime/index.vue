<template>
  <div id="tian" style="position: absolute;width: 100%;height: 100%">
    <el-button class="moni" style="position: absolute;z-index: -1;display: none;" />
    <!-- 切换 -->
    <div id="Querymodule">
      <div id="top" @mousedown.prevent="mousedown"><span>≡</span></div>
      <div>
        <el-table
          :data="formdate"
          style="width: 100%"
          height="300"
        >
          <el-table-column
            prop="OBJECTID"
            label="时间"
          />
          <el-table-column
            prop="CenterX"
            label="中心点x"
          />
          <el-table-column
            prop="CenterY"
            label="中心点y"
          />
          <el-table-column
            prop="Rotation"
            label="旋转角度"
          />
          <el-table-column
            prop="XStdDist"
            label="标准距离长轴"
          />
          <el-table-column
            prop="YStdDist"
            label="标准距离短轴"
          />
        </el-table>
      </div>
    </div>
    <div id="MapSanJ1" style="position: absolute;width: 100%;height: 100%;z-index: 0;" />
    <div id="legend" style="position: absolute;z-index: 1;" />
    <router />
  </div>
</template>
<script>
import Router from './components/router'
import eventBum from './public/js/EvebtBus'
import { loadModules } from 'esri-loader'
export default {
  name: 'Tian',
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
        size: '' // 椭圆尺寸
      },
      // gp条件
      params: {
        表达式: '',
        椭圆大小: ''
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
      // graphic图层
      graphic: undefined,
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
      query: undefined,
      queryData: undefined,
      // 图例
      legend: undefined,
      // 椭圆图层
      tuoyuan: undefined,
      tuoyuan12: undefined,
      tuoyuan13: undefined,
      tuoyuan14: undefined,
      tuoyuan15: undefined,
      url: 'http://110.40.187.212:6080/arcgis/rest/services/ShaanXiDisease/service/MapServer/1',
      url12: 'http://110.40.187.212:6080/arcgis/rest/services/ShaanXiDisease/service/MapServer/0',
      url13: 'http://110.40.187.212:6080/arcgis/rest/services/ShaanXiDisease/sde3/MapServer/0',
      url14: 'http://110.40.187.212:6080/arcgis/rest/services/ShaanXiDisease/sde3/MapServer/1',
      url15: 'http://110.40.187.212:6080/arcgis/rest/services/ShaanXiDisease/sde3/MapServer/2',
      // 线集合
      lineGraphic: [],
      graphicall: [],
      linecolor: ['#FF729F', '#56CBF9', '#736CED', '#AAFAC8', '#FAA381', '#BC4B51', '#8B85C1', '#FCA17D', '#F9A620'],
      jieguo: [],
      jindu: 0,
      shijian: 0,
      fdate: [],
      formdate: [],
      times: 0
    }
  },
  beforeDestroy() {
    // 关闭传值
    eventBum.$off('typc')
    eventBum.$off('type')
    eventBum.$off('json')
    eventBum.$off('data')
    eventBum.$off('space')
    document.getElementById('tian').style.display = 'none'
  },
  mounted() {
    // 城市尺度
    eventBum.$on('space', json => {
      this.json.spac = json
    })
    this._Init()
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
      this.json.timz = data.timz
      this.json.spac = data.spac
      this.json.typh = data.type
      if (data.ellipse === '小') {
        this.json.size = '1_STANDARD_DEVIATION'
      } else if (data.ellipse === '中') {
        this.json.size = '2_STANDARD_DEVIATION'
      } else if (data.ellipse === '大') {
        this.json.size = '2_STANDARD_DEVIATION'
      }
      this.transform('制图')
      if (this.json.name === '中国') {
        that.$message({
          message: '请选择城市',
          type: 'warning'
        })
      }
    })
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
          'esri/tasks/support/Query',
          'esri/Graphic'
        ],
        option
      ).then(([TileLayer, Map, MapView, Basemap, SceneView, Camera, FeatureLayer, Legend, SketchViewModel, GraphicsLayer, OnDemandGrid, ColumnHider, Selection, DotDensityRenderer, MapImageLayer, Geoprocessor, QueryTask, Query, Graphic]) => {
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
        // 新兴图层
        that.tuoyuan = new FeatureLayer({
          url: this.url,
          title: '2012-2018年标准差椭圆分析'
        })
        // 新兴图层
        that.tuoyuan12 = new FeatureLayer({
          url: this.url12,
          title: '2012-2018年标准差椭圆范围'
        })
        // 新兴图层
        that.tuoyuan13 = new FeatureLayer({
          url: this.url13,
          // legendEnabled: false,
          title: '标准差椭圆重心'
        })
        // 新兴图层
        that.tuoyuan14 = new FeatureLayer({
          url: this.url14,
          legendEnabled: false,
          title: '2012年标准差椭圆分析'
        })
        // 新兴图层
        that.tuoyuan15 = new FeatureLayer({
          url: this.url15,
          title: '2012年标准差椭圆分析'
        })
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
        that.tuoyuan.visible = false
        that.tuoyuan12.visible = false
        that.tuoyuan13.visible = false
        that.tuoyuan14.visible = false
        that.tuoyuan15.visible = false
        that.map = new Map({
          basemap: customBasemap,
          layers: [that.bSheng, that.bShi, that.bxian, that.tuoyuan, that.tuoyuan12, that.tuoyuan14, that.tuoyuan15, that.tuoyuan13]
        })
        that.bxian.visible = false
        that.bShi.visible = false
        that.view = new MapView({
          container: 'MapSanJ1',
          map: that.map,
          zoom: 4,
          center: [105.4251727452775, 38.033321774359486]
        })
        // 隐藏放大缩小
        that.view.ui.remove('zoom')
        // gp服务
        const gpUrl = 'http://114.98.239.36:6080/arcgis/rest/services/ShaanXiDisease/StandardDeviationEllipse/GPServer/StandardDeviationEllipse'
        that.gp = new Geoprocessor(gpUrl)
        that.gp.outSpatialReference = {
          wkid: 102100
        }
        var resultImg = []
        that.view.when(function() {
          document.getElementsByClassName('moni')[0].addEventListener('click', function name(params) {
            for (let index = 0; index < resultImg.length; index++) {
              const element = resultImg[index]
              that.map.remove(element)
            }
            resultImg = []
            const datestart = new Date(that.json.timz)
            var datestarts = datestart.getFullYear()
            const dateend = new Date(that.json.timx)
            const dateends = dateend.getFullYear()
            // 时间间隔
            that.shijian = dateends - datestarts
            for (let index = 0; index < that.shijian; index++) {
              const color = that.linecolor[index]
              chaTuoYuan('editor', datestarts + '-01-01 00:00:00', datestarts + 1 + '-01-01 00:00:00', color)
              datestarts++
            }
            function chaTuoYuan(params1, i, y, color) {
              var params = {
                表达式: that.params.表达式 + 'and 发病日期 >= ' + "'" + i + "'" + ' AND 发病日期 < ' + "'" + y + "'",
                椭圆大小: that.params.椭圆大小
              }
              that.gp.submitJob(params).then((jobInfo) => {
                var options = {
                  interval: 1500,
                  statusCallback: function(j) {
                    // console.log('Job Status: ', j.jobStatus)
                  }
                }
                // 监听执行结束
                that.gp.waitForJobCompletion(jobInfo.jobId, options).then((jobInfo2) => {
                  for (let index = 0; index < that.shijian; index++) {
                    that.jindu = index
                  }
                  // 加载地图方法
                  // 添加要素
                  drawResultData(jobInfo2)
                })
              })
              var linerenderer = {
                type: 'simple', // autocasts as new SimpleRenderer()
                symbol: {
                  type: 'simple-fill', // autocasts as new SimpleFillSymbol()
                  style: 'none',
                  outline: { // autocasts as new SimpleLineSymbol()
                    type: 'simple-line',
                    width: 2,
                    color: color,
                    style: 'long-dash'
                  }
                }
              }
              function drawResultData(result) {
                var jobId = result.jobId
                var mapUrl = 'http://114.98.239.36:6080/arcgis/rest/services/ShaanXiDisease/StandardDeviationEllipse/MapServer/jobs/' + jobId
                const resultImglayer = new MapImageLayer({
                  title: '标准差椭圆',
                  url: mapUrl,
                  sublayers: [
                    {
                      id: 0,
                      title: i,
                      renderer: linerenderer,
                      visible: true,
                      outFields: ['*']
                    }
                  ]
                })
                resultImglayer.opacity = 0.7
                that.map.add(resultImglayer)
                resultImg.push(resultImglayer)
                var markerSymbol = {
                  type: 'simple-marker',
                  size: 4,
                  color: color
                }
                // 查询属性字段
                that.queryTask.url = mapUrl + '/0'
                that.query.where = 'CenterX <> 0'
                that.queryTask.execute(that.query).then(function(response) {
                  response.features[0].attributes.OBJECTID = i.substring(0, 11)
                  that.formdate.push(response.features[0].attributes)
                  that.jieguo = response.features[0].attributes
                  const point1 = response.features[0].attributes
                  const point = {
                    type: 'point', // autocasts as new Point()
                    longitude: point1.CenterX,
                    latitude: point1.CenterY,
                    spatialReference: { wkid: 3395 }
                  }
                  const graphic = new Graphic({
                    geometry: point,
                    symbol: markerSymbol
                  })
                  graphic.attributes = {
                    '开始时间': i
                  }
                  graphic.popupTemplate = {
                    title: '{开始时间}'
                  }
                  that.graphicall.push(graphic)
                  that.view.graphics.add(graphic)
                })
                if (that.graphicall.length + 1 === that.shijian) {
                  eventBum.$emit('gai', 1)
                }
              }
            }
          })
        })
        that.graphic = new Graphic({
        })
        that.queryTask = new QueryTask({
        })
        that.query = new Query({
          returnGeometry: true,
          outFields: ['*']
        })
        that.legend = new Legend({
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
      if (that.tuoyuan12.visible === true) {
        that.tuoyuan12.visible = false
      }
      if (that.tuoyuan13.visible === true) {
        that.tuoyuan13.visible = false
      }
      if (that.tuoyuan14.visible === true) {
        that.tuoyuan14.visible = false
      }
      if (that.tuoyuan15.visible === true) {
        that.tuoyuan15.visible = false
      }
      if (that.tuoyuan.visible === true) {
        that.tuoyuan.visible = false
      }
      // that.tuoyuan12.visible = false
      // that.tuoyuan.visible = false
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
      that.params.表达式 = ''
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
            that.params.表达式 = that.jbwhere + "疾病名称 = '" + that.jbtype + "'and 死亡日期 <> '.'"
          } else if (that.json.typh === '重症') {
            that.params.表达式 = that.jbwhere + "疾病名称 = '" + that.jbtype + "'and 重症患者 = '是'"
          } else if (that.json.typh === '诊断') {
            that.params.表达式 = that.jbwhere + "疾病名称 = '" + that.jbtype + "'"
          } else {
            that.params.表达式 = that.jbwhere + "疾病名称 = '" + that.jbtype + "'"
          }
          that.params.椭圆大小 = that.json.size
          that.formdate = []
          that.times = 0
          that.graphicall = []
          const datestart = new Date(that.json.timz)
          var datestarts = datestart.getFullYear()
          const dateend = new Date(that.json.timx)
          const dateends = dateend.getFullYear()
          setTimeout(() => {
            if (datestarts === 2012 && dateends === 2018) {
              that.tuoyuan14.visible = true
              that.tuoyuan13.visible = true
              that.tuoyuan15.visible = true
            } else if (datestarts === 2012) {
              // that.tuoyuan12.opacity = 0.9
              that.tuoyuan12.visible = true
            }
            eventBum.$emit('gai', 1)
          }, 3000)
        }
      } else {
        eventBum.$emit('gai', 1)
      }
    }
  }
}
</script>
<style scoped>
#tian {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url("./public/img/back.png") no-repeat center center;
  /* 背景图不平铺 */
  background-size: cover;
  /* 让背景图基于容器大小伸缩 */
  background-attachment: fixed;
  /* 当内容高度大于图片高度时，背景图像的位置相对于viewport固定 */
  background-color: #CCCCCC;
}
#MapSanJ1  {
  float: left;
  width: 100%;
  height: 100%;
}
#queding1 {
  display: none;
}
#Querymodule {
  text-align: center;
  width: 600px;
  border-radius: 5px;
  height: 310px;
  border: 1px solid rgb(39,45,57);
  background-color: rgba(40, 43, 57, 0.8);
  z-index: 100;
  top: 250px;
  position: fixed;
  user-select: none;
  left: 50px;
  top: 50px;
  display: none;
}
#top {
  background-color: rgb(40, 43, 57);
  color: rgba(255, 255, 255, 0.8);
  border-bottom: 1px solid #fff;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
  width: 100%;
  height: 22px;
  line-height: 22px;
  cursor: move;
  user-select: none;
}
#legend{
  position: absolute;
  left: 55px;
  bottom: 0;
}</style>
