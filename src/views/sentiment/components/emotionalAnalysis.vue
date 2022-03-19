<template>
  <div id="emotional">
    <!-- 左侧 -->
    <div id="left">
      <ul>
        <li class="public">
          <ul>
            <li class="xuanz zhong" @click="curLayer()">
              <p>聚合图</p>
            </li>
            <li class="xuanz" @click="fhLayer()">
              <p>符号图</p>
            </li>
            <li class="xuanz" @click="heatLayer()">
              <p>热力图</p>
            </li>
            <li class="xuanz" @click="fwLayer()">
              <p>蜂窝图</p>
            </li>
          </ul>
        </li>
        <li class="public publiz">
          <p class="tittles">正向词云</p>
          <div id="Forward" style="height: 100%;width: 100%;z-index: 1;" />
        </li>
        <li class="public publiz">
          <p class="tittles">正负占比</p>
          <div id="PMinus" style="height: 100%;width: 100%;z-index: 1;" />
        </li>
      </ul>
    </div>
    <!-- 右侧 -->
    <div id="right">
      <ul>
        <li class="public">
          <p>时间范围</p>
          <div class="fTime">
            <i class="el-icon-d-arrow-left img" style="font-size:21px" @click="ReduceTime()" />
            <el-date-picker v-model="timx" type="date" placeholder="选择日期" :picker-options="pickerOptions" :editable="false" @change="STime()" />
            <i class="el-icon-d-arrow-right img" style="font-size:21px" @click="IncreaseTime()" />
          </div>
          <p><span>{{ json.timz }}</span> 至 <span>{{ json.timx }}</span></p>
        </li>
        <li class="public publiz">
          <p class="tittles">负向词云</p>
          <div id="Negative" style="height: 100%;width: 100%;z-index: 1;" />
        </li>
        <li class="public publiz">
          <p class="tittles">情感占比</p>
          <div id="Emotion" style="height: 100%;width: 100%;z-index: 1;" />
        </li>
      </ul>
    </div>
    <!-- 城市选择器 -->
    <selectRegion />
    <!-- 地图筛选 -->
    <div class="type">
      <ul>
        <li class="clearSearch" @click="draws()"><icon-svg icon-class="icon-yijianshaixuan" /><span> 地图筛选</span></li>
        <li class="clearSearch" @click="sequential()"><icon-svg icon-class="icon-shijian" /><span> 时序统计</span></li>
        <li class="clearSearch" @click="DAnalysis()"><icon-svg icon-class="icon-RectangleCopy" /><span> 数据分析</span></li>
      </ul>
    </div>
    <!-- 时序统计 -->
    <div id="sequential">
      <!-- 工具 -->
      <div class="tool">
        <ul>
          <li @click="fengxi2()">数据分析</li>
          <!-- <li>1</li>
          <li>1</li> -->
        </ul>
      </div>
      <span @click="close4()"><i class="el-icon-close" /></span>
      <div id="sequentials" style="height: 100%;width: 100%;z-index: 10;position: absolute;top: 0px;left: 0px;" />
    </div>
    <!-- 数据表 -->
    <div id="table">
      <!-- 工具 -->
      <div class="tool">
        <ul>
          <li @click="fengxi()">文本分析</li>
          <!-- <li>1</li>
          <li>1</li> -->
        </ul>
      </div>
      <div class="toor">
        <ul>
          <li @click="tagging()">词性标注</li>
          <!-- <li>1</li>
          <li>1</li> -->
        </ul>
      </div>
      <!-- 头部 -->
      <div class="top" @mousedown.prevent="m1($event)">
        ≡<span style="position: absolute;right: 5px;font-size: 18px;cursor: pointer;" @click="close1()"><i class="el-icon-close" /></span>
      </div>
      <!-- 底部 -->
      <div class="bottom">
        <u-table ref="plTable" :data="tDate" height="100px" use-virtual show-body-overflow="title" show-header-overflow="title" :row-height="rowHeight">
          <u-table-column type="selection" width="50" align="center" />
          <u-table-column prop="title" width="150" label="标签" align="center" show-overflow="tooltip" />
          <u-table-column prop="summary" label="简介" align="center" show-overflow="tooltip" />
          <u-table-column prop="place" label="尺度" width="80" align="center" />
          <u-table-column prop="time" label="时间" width="140" align="center" />
          <u-table-column label="操作" width="90" align="center">
            <template slot-scope="scope">
              <a @click="location(scope.row)">定位 </a>
              <a :href="scope.row.sourceUrl" target="_blank">跳转</a>
            </template>
          </u-table-column>
        </u-table>
      </div>
    </div>
    <!-- 地图 -->
    <div id="EMap" />
    <!-- 路由 -->
    <router />
    <!-- 词云窗口 -->
    <div id="ciyun">
      <div class="top" @mousedown.prevent="m2($event)">
        ≡<span style="position: absolute;right: 5px;font-size: 18px;cursor: pointer;" @click="close2()"><i class="el-icon-close" /></span>
      </div>
      <el-carousel arrow="never" :interval="3000">
        <el-carousel-item v-for="item in 4" :key="item">
          <div v-if="item === 1">
            <p class="tittles">正向词云</p>
            <div id="TForward" style="height: 100%;width: 100%;z-index: 1;position: absolute;" />
          </div>
          <div v-if="item === 2">
            <p class="tittles">负向词云</p>
            <div id="TNegative" style="height: 100%;width: 100%;z-index: 1;position: absolute;" />
          </div>
          <div v-if="item === 3">
            <p class="tittles">正负占比</p>
            <div id="TPMinus" style="height: 100%;width: 100%;z-index: 1;position: absolute;" />
          </div>
          <div v-if="item === 4">
            <p class="tittles">情感占比</p>
            <div id="TEmotion" style="height: 100%;width: 100%;z-index: 1;position: absolute;" />
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 标注集窗口 -->
    <div id="speech">
      <div class="top" @mousedown.prevent="m3($event)">
        ≡<span style="position: absolute;right: 5px;font-size: 18px;cursor: pointer;" @click="close3()"><i class="el-icon-close" /></span>
      </div>
      <div class="body">
        <u-table ref="plTable2" :data="sSate" height="325px" use-virtual show-body-overflow="title" show-header-overflow="title" :row-height="rowHeight">
          <u-table-column type="selection" width="50" align="center" />
          <u-table-column prop="标注" width="60" label="标注" align="center" show-overflow="tooltip" />
          <u-table-column prop="词性" width="80" label="词性" align="center" show-overflow="tooltip" />
          <u-table-column prop="解释" label="解释" align="center" show-overflow="tooltip" />
        </u-table>
      </div>
      <div class="bottom" @click="PAnalysis()">
        <i class="el-icon-s-promotion" />分析
      </div>
    </div>
    <!-- 图例 -->
    <div id="legend">
      <table>
        <tr>
          <td width="40">
            <p><img src="../../../../public/img/emotion/calm.png"></p>
          </td>
          <td>平静</td>
        </tr>
        <tr>
          <td>
            <p><img src="../../../../public/img/emotion/happy1.png"></p>
          </td>
          <td>高兴</td>
        </tr>
        <tr>
          <td>
            <p><img src="../../../../public/img/emotion/happy2.png"></p>
          </td>
          <td>快乐</td>
        </tr>
        <tr>
          <td>
            <p><img src="../../../../public/img/emotion/Sad1.png"></p>
          </td>
          <td>伤心</td>
        </tr>
        <tr>
          <td>
            <p><img src="../../../../public/img/emotion/Sad2.png"></p>
          </td>
          <td>痛苦</td>
        </tr>
      </table>
    </div>
    <!-- 加载动画 -->
    <div id="bg">
      <div id="xuan">
        <span /><span /><span /><span />
      </div>
    </div>
  </div>
</template>
<script>
import evebtBus from '../public/js/EvebtBus'
import speech from '../public/js/词性.json'
import router from './router'
import SelectRegion from './selectRegion'
import mapboxgl from 'mapbox-gl'
import { Scene, HeatmapLayer } from '@antv/l7'
import { Mapbox } from '@antv/l7-maps'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import StaticMode from '@mapbox/mapbox-gl-draw-static-mode'
import * as echarts from 'echarts'
import 'echarts-wordcloud'

export default {
  name: 'EmotionalAnalysis',
  components: {
    router,
    SelectRegion
  },
  data() {
    return {
      // 数据
      json: {
        name: '中国',
        where: 0,
        timx: '',
        timz: ''
      },
      timx: '', // 今日时间
      boundary: null, // 边界
      range: '', // 范围
      length: 0, // 长度
      tDate: [], // 表单数据
      sSate: [], // 词性数据
      rowHeight: 55, // 单元格高度
      canMove: false, // 窗口移动
      // 地图参数
      map: null, // 地图
      scene: null, // scene地图
      draw: null, // 绘制
      honeycomb: null, // 蜂窝图层
      timename: '', // 时序分析判断切换条件
      BubblePoint: null, // 时序分析判断切换条件
      pickerOptions: {
        disabledDate: time => {
          return time > new Date().getTime()
        }
      },
      nullData: {
        'type': 'FeatureCollection',
        'features': [
          {
            'type': 'Feature',
            'properties': {},
            'geometry': {
              'type': 'Polygon',
              'coordinates': [
              ]
            }
          }
        ]
      },
      zhong: 0,
      myChart: null, // 时序分析
      myChart1: null, // 正向词云
      myChart2: null, // 负向词云
      myChart3: null, // 正负比例
      myChart4: null, // 情感占比
      myChartT1: null, // 正向词云
      myChartT2: null, // 负向词云
      myChartT3: null, // 正负比例
      myChartT4: null, // 情感占比
      times: [], // 时序数据
      guodu: [] // 过渡数据
    }
  },
  beforeDestroy() {
    document.getElementById('emotional').style.display = 'none'
    evebtBus.$off('json')
    // this.map = null
    this.map.remove()
  },
  mounted() {
    var that = this
    // 今日时间
    that.timx = that.checkTime2(new Date())
    that.json.timx = that.checkTime5(new Date(this.timx))
    that.json.timz = that.checkTime5(new Date((new Date(that.timx)).getTime() - 31 * 24 * 60 * 60 * 1000))
    // 切换时间是否展示
    if ((new Date((new Date(that.timx)).getTime() + 24 * 60 * 60 * 1000)) < (new Date()).getTime()) {
      document.querySelectorAll('.fTime .img')[1].style.zIndex = 0
      document.querySelectorAll('.fTime .img')[1].style.opacity = 1
    } else {
      document.querySelectorAll('.fTime .img')[1].style.zIndex = -10
      document.querySelectorAll('.fTime .img')[1].style.opacity = 0
    }
    that.getJson(0)
    // 接收城市
    evebtBus.$on('json', json => {
      that.json.name = json.name
      that.json.where = json.where

      var isExistence = false
      var layers = that.map.getStyle().layers
      for (let index = 0; index < layers.length; index++) {
        const element = layers[index].id
        if (element === 'draw') {
          isExistence = true
        }
      }
      if (isExistence === true) {
        that.nullData.features[0].geometry.coordinates = []
        that.map.getSource('draw').setData(that.nullData)
      }
      that.getJson(1)
    })
    // 切换
    var xuanzs = document.querySelectorAll('.xuanz')
    for (let i = 0; i < xuanzs.length; i++) {
      xuanzs[i].setAttribute('index', i)
      xuanzs[i].addEventListener('click', function() {
        for (let j = 0; j < xuanzs.length; j++) {
          xuanzs[j].classList.remove('zhong')
        }
        document.getElementById('legend').style.display = 'none'
        this.className = this.className + ' ' + 'zhong'
        if (i === 1) {
          document.getElementById('legend').style.display = 'block'
        }
      })
    }
  },
  methods: {
    curLayer() {
      this.map.setLayoutProperty('unclustered-point', 'visibility', 'visible')
      this.map.setLayoutProperty('cluster-count', 'visibility', 'visible')
      this.map.setLayoutProperty('clusters', 'visibility', 'visible')
      this.map.setLayoutProperty('symbolpoints', 'visibility', 'none')
      this.map.setLayoutProperty('earthquakes-heat', 'visibility', 'none')
      this.honeycomb.hide()
      if (this.BubblePoint !== null) {
        this.map.setLayoutProperty('Bubbpoints', 'visibility', 'none')
      }
      this.map.flyTo({
        center: [107.01292828127248, 34.12077517311424],
        zoom: 2.75,
        speed: 2,
        curve: 1,
        pitch: 0,
        easing(t) {
          return t
        }
      })
    },
    heatLayer() {
      this.map.setLayoutProperty('unclustered-point', 'visibility', 'none')
      this.map.setLayoutProperty('cluster-count', 'visibility', 'none')
      this.map.setLayoutProperty('clusters', 'visibility', 'none')
      this.map.setLayoutProperty('symbolpoints', 'visibility', 'none')
      this.honeycomb.hide()
      this.map.setLayoutProperty('earthquakes-heat', 'visibility', 'visible')
      if (this.BubblePoint !== null) {
        this.map.setLayoutProperty('Bubbpoints', 'visibility', 'none')
      }
    },
    fwLayer() {
      this.map.setLayoutProperty('unclustered-point', 'visibility', 'none')
      this.map.setLayoutProperty('cluster-count', 'visibility', 'none')
      this.map.setLayoutProperty('clusters', 'visibility', 'none')
      this.map.setLayoutProperty('symbolpoints', 'visibility', 'none')
      this.map.setLayoutProperty('earthquakes-heat', 'visibility', 'none')
      this.honeycomb.show()
      if (this.BubblePoint !== null) {
        this.map.setLayoutProperty('Bubbpoints', 'visibility', 'none')
      }
    },
    fhLayer() {
      this.map.setLayoutProperty('unclustered-point', 'visibility', 'none')
      this.map.setLayoutProperty('cluster-count', 'visibility', 'none')
      this.map.setLayoutProperty('clusters', 'visibility', 'none')
      this.map.setLayoutProperty('earthquakes-heat', 'visibility', 'none')
      this.honeycomb.hide()
      this.map.setLayoutProperty('symbolpoints', 'visibility', 'visible')
      if (this.BubblePoint !== null) {
        this.map.setLayoutProperty('Bubbpoints', 'visibility', 'none')
      }
    },
    // 请求数据
    getJson(e) {
      var that = this
      document.getElementById('bg').style.display = 'block' // 遮罩
      var data = {}
      data.where = that.json.where
      data.name = that.json.name
      data.timx = that.checkTime4(new Date((new Date(that.json.timx)).getTime() + 24 * 60 * 60 * 1000))
      data.timz = that.checkTime4(new Date((new Date(that.json.timz)).getTime() + 24 * 60 * 60 * 1000))
      that.$store.dispatch('ndatapanel/QJson', that.json.name).then((dataz) => {
        that.boundary = dataz
        // 判断是否是切换城市
        that.$store.dispatch('sentiment/POTQuery', data).then((datas) => {
          that.CAdestroy()
          var box = [that.myChart1, that.myChart2, that.myChart3, that.myChart4]
          var chart = ['Forward', 'Negative', 'PMinus', 'Emotion']
          that.Nlp(datas.datez, box, chart) // NLP数据
          datas = datas.dates // 点数据
          for (let i = 0; i < datas.length; i++) {
            datas[i].time = that.checkTime2(new Date(datas[i].time))
          }
          // 处理数据
          that.tDate = []
          that.tDate = datas
          that.$refs.plTable.toggleAllSelection()
          var TFeatures = [] // 点击弹窗数据
          var type = 0
          // 数据
          for (let i = 0; i < datas.length; i++) {
            var v = 1 * Math.random() - 0.5
            if (datas[i].emotion == null) {
              datas[i].emotion = v
            }
            if (datas[i].emotion * 1 > 0.4) {
              type = 4
            } else if (datas[i].emotion * 1 > 0.2) {
              type = 3
            } else if (datas[i].emotion * 1 > -0.2) {
              type = 2
            } else if (datas[i].emotion * 1 > -0.4) {
              type = 1
            } else {
              type = 0
            }
            // 聚合图的数据/点击弹窗数据
            var TGong = {
              'type': 'Feature',
              'properties': {
                'id': datas[i].id,
                'time': datas[i].time,
                'emotion': datas[i].emotion,
                'description': '<p><a href="' + datas[i].sourceUrl + '" target="_blank">' +
                datas[i].title.slice(0, 12) + '...' + '</a></p><p class="wenben">' + datas[i].summary + '</p><p class="time">' +
                '时间：' + that.checkTime2(new Date(datas[i].time)) + '</p>' + '<p class="laiyuan">来源：' + datas[i].infoSource + '</p><span id="dian" class="qinggan">情感分析</span>',
                'place': datas[i].place,
                'type': type
              },
              'geometry': {
                'type': 'Point',
                'coordinates': JSON.parse('[' + datas[i].x + ', ' + datas[i].y + ']')
              }
            }
            TFeatures.push(TGong)
          }
          var TDate = {
            'type': 'FeatureCollection',
            'crs': { 'type': 'name', 'properties': { 'name': 'urn:ogc:def:crs:OGC:1.3:CRS84' }},
            'features': TFeatures
          }
          // console.log(TDate)
          var fwHeat = []
          for (let index = 0; index < TDate.features.length; index++) {
            const lng = TDate.features[index].geometry.coordinates[0]
            const lat = TDate.features[index].geometry.coordinates[1]
            const id = TDate.features[index].properties.id
            // var v = (125 - 25) * Math.random() + 25
            if (TDate.features[index].properties.emotion !== null) {
              v = TDate.features[index].properties.emotion * 1 > 0 ? TDate.features[index].properties.emotion * 250 : TDate.features[index].properties.emotion * -250
            }
            fwHeat.push({ id: id, lng: lng, lat: lat, v: v })
          }
          if (e === 0) {
            that.creatmap(dataz, TDate)
          } else if (e === 1) {
            that.map.getSource('earthquakes').setData(TDate)
            that.map.getSource('heatmap').setData(TDate)
            that.honeycomb.setData(fwHeat)
            that.bian(that.boundary, 1) // 清除原始边界
          } else if (e === 2) {
            that.map.getSource('earthquakes').setData(TDate)
            that.map.getSource('heatmap').setData(TDate)
            that.honeycomb.setData(fwHeat)
          }
          document.getElementById('bg').style.display = 'none' // 遮罩
        })
      })
    },
    // 创建地图
    creatmap(dataz, TDate) {
      var that = this
      mapboxgl.accessToken = 'pk.eyJ1Ijoid3VqaW5odWkwIiwiYSI6ImNrdDFoZWphNDBhaGszMXBoazZ1dWdwMWkifQ.AX5nvyCpK8yKsCqyz36rsw' // 你的accessToken
      that.map = new mapboxgl.Map({
        container: 'EMap', // 找盒子
        center: [107.01292828127248, 34.12077517311424], // 中心点
        zoom: 2.75, // 地图初始化时的层级
        style: {
          'version': 8,
          'sources': {
            'raster-tiles': {
              'type': 'raster',
              'tiles': [
                'https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}'
              ],
              'tileSize': 256
            }
          },
          'layers': [
            {
              'id': 'simple-tiles',
              'type': 'raster',
              'source': 'raster-tiles',
              'minzoom': 0,
              'maxzoom': 22
            }
          ],
          'glyphs': 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf'
        }
      })
      this.scene = new Scene({
        id: 'EMap',
        map: new Mapbox({
          mapInstance: that.map
        })
      })
      var fwHeat = []
      var leng = TDate.features.length
      for (let index = 0; index < TDate.features.length; index++) {
        const lng = TDate.features[index].geometry.coordinates[0]
        const lat = TDate.features[index].geometry.coordinates[1]
        const id = TDate.features[index].properties.id
        var v = (125 - 25) * Math.random() + 25
        if (TDate.features[index].properties.emotion !== null) {
          v = TDate.features[index].properties.emotion * 1 > 0 ? TDate.features[index].properties.emotion * 250 : TDate.features[index].properties.emotion * -250
        }
        fwHeat.push({ id: id, lng: lng, lat: lat, v: v })
        leng--
        if (leng === 0) {
          that.honeycomb = new HeatmapLayer({})
            .source(fwHeat, {
              parser: {
                type: 'json',
                x: 'lng',
                y: 'lat'
              },
              transforms: [
                {
                  type: 'hexagon',
                  size: 25000,
                  field: 'v',
                  method: 'sum'
                }
              ]
            })
            .size('sum', sum => {
              return sum * 400
            })
            .shape('hexagonColumn')
            .style({
              coverage: 1,
              angle: 0,
              opacity: 1.0
            })
            .color('sum', [
              // #b397b3|#bd84bd|#c672c6|#d05fd0|#d94cd9|#e339e3|#ec26ec|#f613f6|#ff00ff|#ff3bbf|#ff7580|#ffb040|#ffea00
              '#b397b3', '#bd84bd', '#c672c6', '#d05fd0', '#d94cd9', '#e339e3', '#ec26ec', '#f613f6', '#ff00ff', '#ff3bbf', '#ff7580', '#ffb040', '#ffea00'
              // '#74add1', '#abd9e9', '#e0f3f8', '#fee090', '#fdae61', '#f46d43', '#d73027'
            ])
          that.honeycomb.hide()
          that.scene.addLayer(that.honeycomb)
        }
      }
      that.scene.on('loaded', () => {
      })
      // 动态点
      const size = 65
      const pulsingDot = {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),
        // 当图层被添加到地图时
        // 获取地图画布的渲染上下文
        onAdd: function() {
          const canvas = document.createElement('canvas')
          canvas.width = this.width
          canvas.height = this.height
          this.context = canvas.getContext('2d')
        },
        // 调用动画
        render: function() {
          const duration = 1200
          const t = (performance.now() % duration) / duration
          const radius = (size / 2) * 0.4
          const outerRadius = (size / 2) * 0.6 * t + radius
          const context = this.context
          // 外圆
          context.clearRect(0, 0, this.width, this.height)
          context.beginPath()
          context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2)
          context.fillStyle = `rgba(255, 121, 121, ${1 - t})`
          context.fill()
          // 内圆
          context.beginPath()
          context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2)
          context.fillStyle = 'rgba(76, 201, 240, 1)'
          context.strokeStyle = 'white'
          context.lineWidth = 0.5 + 2.5 * (1 - t)
          context.fill()
          context.stroke()
          this.data = context.getImageData(0, 0, this.width, this.height).data
          return true
        }
      }
      // 坐标
      // that.map.on('click', function(e) {
      //   var s = JSON.parse(JSON.stringify(e.lngLat))
      //   console.log('lng：' + s.lng + '\nlat：' + s.lat)
      // })
      // 聚合
      that.map.on('load', function() {
        that.map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 }) // 动态点
        // eslint-disable-next-line handle-callback-err
        that.map.loadImage('/img/emotion/happy1.png', function(error, image) {
          that.map.addImage('mood3', image)
        })
        // eslint-disable-next-line handle-callback-err
        that.map.loadImage('/img/emotion/happy2.png', function(error, image) {
          that.map.addImage('mood4', image)
        })
        // eslint-disable-next-line handle-callback-err
        that.map.loadImage('/img/emotion/sad1.png', function(error, image) {
          that.map.addImage('mood1', image)
        })
        // eslint-disable-next-line handle-callback-err
        that.map.loadImage('/img/emotion/sad2.png', function(error, image) {
          that.map.addImage('mood0', image)
        })
        // eslint-disable-next-line handle-callback-err
        that.map.loadImage('/img/emotion/calm.png', function(error, image) {
          that.map.addImage('mood2', image)
        })
        that.map.addSource('heatmap', {
          'type': 'geojson',
          'data': TDate
        })
        that.map.addLayer({
          'id': 'symbolpoints',
          'type': 'symbol',
          'source': 'heatmap',
          'layout': {
            'icon-image': ['concat', 'mood', ['get', 'type']],
            'icon-size': 0.1
          }
        })
        that.map.setLayoutProperty('symbolpoints', 'visibility', 'none')
        // 热力图
        that.map.addLayer({
          'id': 'earthquakes-heat',
          'type': 'heatmap',
          'source': 'heatmap',
          // 'maxzoom': 9,
          'paint': {
            // Increase the heatmap weight based on frequency and property magnitude
            'heatmap-weight': 1,
            // Increase the heatmap color weight weight by zoom level
            // heatmap-intensity is a multiplier on top of heatmap-weight
            'heatmap-intensity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0, 1,
              9, 3
            ],
            // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
            // Begin color ramp at 0-stop with a 0-transparancy color
            // to create a blur-like effect.
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0, 'rgba(33,102,172,0)',
              0.2, 'rgb(103,169,207)',
              0.4, 'rgb(209,229,240)',
              0.6, 'rgb(253,219,199)',
              0.8, 'rgb(239,138,98)',
              1, 'rgb(178,24,43)'
            ],
            // Adjust the heatmap radius by zoom level
            'heatmap-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0, 2,
              9, 20
            ],
            // Transition from heatmap to circle layer by zoom level
            'heatmap-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              7, 1,
              20, 0
            ]
          }
        })
        that.map.setLayoutProperty('earthquakes-heat', 'visibility', 'none')
        // 加载聚合数据
        that.map.addSource('earthquakes', {
          type: 'geojson',
          data: TDate,
          cluster: true,
          clusterMaxZoom: 15, // 最大缩放到聚集点
          clusterRadius: 25 // 聚类点时每个簇的半径(默认为 50)
        })
        // 聚合的圆圈
        that.map.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'earthquakes',
          filter: ['has', 'point_count'],
          paint: {
            // 圆圈颜色
            'circle-color': [
              'step',
              ['get', 'point_count'],
              '#4cc9f0',
              20,
              '#4895ef',
              40,
              '#4361ee',
              60,
              '#3f37c9',
              80,
              '#3a0ca3',
              100,
              '#480ca8',
              120,
              '#560bad',
              150,
              '#7209b7',
              170,
              '#b5179e',
              190,
              '#f72585'
            ],
            // 圆圈半径
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              25,
              50,
              30,
              100,
              35
            ],
            // 这个是外边框的颜色 circle-stroke-color这个对应了上面circle-color
            'circle-stroke-color': [
              'step',
              ['get', 'point_count'],
              'rgba(76, 201, 240, 0.2)',
              20,
              'rgba(72, 149, 239, 0.2)',
              40,
              'rgba(67, 97, 238, 0.2)',
              60,
              'rgba(63, 55, 201, 0.2)',
              80,
              'rgba(58, 12, 163, 0.2)',
              100,
              'rgba(72, 12, 168, 0.2)',
              120,
              'rgba(86, 11, 173, 0.2)',
              150,
              'rgba(114, 9, 183, 0.2)',
              170,
              'rgba(181, 23, 158, 0.2)',
              190,
              'rgba(247, 37, 133, 0.2)'
            ],
            // 这个是外边框晕染的范围
            'circle-stroke-width': [
              'step',
              ['get', 'point_count'],
              5, // 蓝色晕染长度，当点数小于100时为5px晕染
              50, // 对应上面circle-color 数字，意思为100以内
              10, // 点计数在100到750之间时为黄色，6px晕染
              100, // 对应上面circle-color 数字，意思为750以内
              15 // 点计数大于或等于750时为7px像素的粉红色晕染
            ]
          }
        })
        // 聚合的文字
        that.map.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'earthquakes',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
          },
          // 添加这个就可以改变圆圈内字样式，这里我改变了他的颜色
          paint: {
            'text-color': '#fff',
            'text-opacity': 1
          }
        })
        // 聚合的点
        that.map.addLayer({
          id: 'unclustered-point',
          type: 'symbol',
          source: 'earthquakes',
          filter: ['!', ['has', 'point_count']],
          'layout': {
            'icon-image': 'pulsing-dot'
          }
        })
        // 聚合移入
        that.map.on('mouseenter', 'clusters', function() {
          that.map.getCanvas().style.cursor = 'pointer'
        })
        // 聚合移除
        that.map.on('mouseleave', 'clusters', function() {
          that.map.getCanvas().style.cursor = ''
        })
        // 边界
        that.bian(dataz, 0)
      })
      // 点击时出现弹窗
      that.map.on('click', 'unclustered-point', function(e) {
        var coordinates = e.features[0].geometry.coordinates.slice()
        var description = e.features[0].properties.description
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
        }
        var popup = new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(that.map)
        that.zhong = 0
        that.close2() // 关闭词云弹窗
        var dian = document.getElementById('dian')
        // 情感分析-词云
        dian.addEventListener('click', function() {
          // 获取标签内容
          var wenbeng = document.getElementsByClassName('wenben')[0].innerHTML
          wenbeng = wenbeng.replace(/&nbsp;/g, '')
          var wen = [{
            'summary': wenbeng
          }]
          document.getElementById('bg').style.display = 'block' // 遮罩
          that.$store.dispatch('sentiment/TAnalysis', wen).then((datas) => {
            that.CAdestroy2()
            var box = [that.myChartT1, that.myChartT2, that.myChartT3, that.myChartT4]
            var chart = ['TForward', 'TNegative', 'TPMinus', 'TEmotion']
            that.Nlp(datas, box, chart)
          })
          // 样式
          document.getElementById('ciyun').style.transition = 'all 1s'
          document.getElementById('ciyun').style.top = '50%'
          document.getElementById('ciyun').style.left = '50%'
          document.getElementById('ciyun').style.transform = 'translate(-50%, -50%)'
          setTimeout(function() {
            document.getElementById('ciyun').style.transition = 'all 0s ease 0s'
          }, 1000)
          document.getElementById('bg').style.display = 'none' // 遮罩
          popup.remove()
        })
      })
      // 当鼠标悬停在地点图层上时，将光标更改为指针。
      that.map.on('mouseenter', 'unclustered-point', function() {
        that.map.getCanvas().style.cursor = 'pointer'
      })
      // 当它离开时将其改回指针。
      that.map.on('mouseleave', 'unclustered-point', function() {
        that.map.getCanvas().style.cursor = ''
      })
      // 编辑
      var modes = MapboxDraw.modes
      modes.static = StaticMode
      this.draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          // polygon: true, // 画范围
          // trash: true // 清空
        },
        modes: modes
      })
      that.map.addControl(this.draw)
      that.map.on('draw.create', this.getZJson) // 创建时
      // 漫游过去
    },
    // 绘制查询范围
    draws() {
      this.close4()
      this.curLayer()
      this.draw.deleteAll()
      this.draw.changeMode('draw_polygon')
      // 判断是否存在，存在设置值为空
      this.nullData.features[0].geometry.coordinates = []
      var layers = this.map.getStyle().layers
      for (let index = 0; index < layers.length; index++) {
        const element = layers[index].id
        if (element === 'draw') {
          this.map.getSource('draw').setData(this.nullData)
        }
      }
    },
    // 输出查询边界并查询
    getZJson(e) {
      var that = this
      setTimeout(() => {
        // this.draw.changeMode('static')
      // var that = this
        var geoData = []
        for (let index = 0; index < e.features[0].geometry.coordinates[0].length; index++) {
          const element = e.features[0].geometry.coordinates[0][index]
          geoData.push(element)
        }
        setTimeout(() => {
          this.draw.deleteAll()
        }, 200)
        var isExistence = false
        var layers = that.map.getStyle().layers
        for (let index = 0; index < layers.length; index++) {
          const element = layers[index].id
          if (element === 'draw') {
            isExistence = true
          }
        }
        that.nullData.features[0].geometry.coordinates = [geoData]
        if (isExistence === false) {
          this.map.addSource('draw', {
            type: 'geojson',
            data: that.nullData })
          this.map.addLayer({
            id: 'draw',
            type: 'fill',
            source: 'draw',
            layout: {},
            paint: {
            // 'fill-color': '#1e32c9',
              'fill-color': 'rgb(4,142,188)',
              'fill-opacity': 0.3
            }
          })
          this.map.addLayer({
            id: 'draw_line',
            type: 'line',
            source: 'draw',
            layout: {},
            paint: {
              'line-color': '#ff7979',
              'line-width': 1,
              'line-opacity': 0.7
            }
          })
        } else {
          this.map.getSource('draw').setData(that.nullData)
        }
        document.getElementById('bg').style.display = 'block'
        that.range = ''
        var date = e.features[0].geometry.coordinates[0]
        for (let i = 0; i < date.length; i++) {
          that.range = that.range + date[i][0] + ' ' + date[i][1] + ', '
        }
        that.range = that.range + date[0][0] + ' ' + date[0][1]
        var data = {}
        data.timx = that.json.timx
        data.timz = that.json.timz
        data.range = that.range
        data.where = that.json.where
        data.name = that.json.name
        that.$store.dispatch('sentiment/POAQuery', data).then((datas) => {
          that.CAdestroy()
          var box = [that.myChart1, that.myChart2, that.myChart3, that.myChart4]
          var chart = ['Forward', 'Negative', 'PMinus', 'Emotion']
          that.Nlp(datas.datez, box, chart) // NLP数据
          datas = datas.dates // 点数据
          for (let i = 0; i < datas.length; i++) {
            datas[i].time = that.checkTime2(new Date(datas[i].time))
          }
          // 处理数据
          that.tDate = []
          that.tDate = datas
          that.$refs.plTable.toggleAllSelection()
          var TFeatures = [] // 点击弹窗数据
          // 数据
          var type = 0
          for (let i = 0; i < datas.length; i++) {
            if (datas[i].emotion * 1 > 0.4) {
              type = 4
            } else if (datas[i].emotion * 1 > 0.2) {
              type = 3
            } else if (datas[i].emotion * 1 > -0.2) {
              type = 2
            } else if (datas[i].emotion * 1 > -0.4) {
              type = 1
            } else {
              type = 0
            }
            // 聚合图的数据/点击弹窗数据
            var TGong = {
              'type': 'Feature',
              'properties': {
                'id': datas[i].id,
                'time': datas[i].time,
                'description': '<p><a href="' + datas[i].sourceUrl + '" target="_blank">' +
              datas[i].title.slice(0, 12) + '...' + '</a></p><p class="wenben">' + datas[i].summary + '</p><p class="time">' +
              '时间：' + that.checkTime2(new Date(datas[i].time)) + '</p>' + '<p class="laiyuan">来源：' + datas[i].infoSource + '</p><span id="dian" class="qinggan">情感分析</span>',
                'place': datas[i].place,
                'emotion': datas[i].emotion,
                'type': type
              },
              'geometry': {
                'type': 'Point',
                'coordinates': JSON.parse('[' + datas[i].x + ', ' + datas[i].y + ']')
              }
            }
            TFeatures.push(TGong)
          }
          var TDate = {
            'type': 'FeatureCollection',
            'crs': { 'type': 'name', 'properties': { 'name': 'urn:ogc:def:crs:OGC:1.3:CRS84' }},
            'features': TFeatures
          }
          this.map.getSource('earthquakes').setData(TDate)
          this.map.getSource('heatmap').setData(TDate)
          var fwHeat = []
          for (let index = 0; index < TDate.features.length; index++) {
            const lng = TDate.features[index].geometry.coordinates[0]
            const lat = TDate.features[index].geometry.coordinates[1]
            const id = TDate.features[index].properties.id
            var v = (125 - 25) * Math.random() + 25
            if (TDate.features[index].properties.emotion !== null) {
              v = TDate.features[index].properties.emotion * 1 > 0 ? TDate.features[index].properties.emotion * 250 : TDate.features[index].properties.emotion * -250
            }
            fwHeat.push({ id: id, lng: lng, lat: lat, v: v })
          }
          that.honeycomb.setData(fwHeat)
          this.bian(that.boundary, 1)
          document.getElementById('bg').style.display = 'none' // 遮罩
        })
      }, 200)
    },
    // 边界
    bian(dataz, e) {
      var that = this
      var bound = []
      if (e === 1) {
        if (that.length !== undefined) {
          for (let i = 0; i < that.length; i++) {
            that.map.removeLayer('maine' + i) // 清除范围
            that.map.removeSource('maine' + i)
          }
        } else {
          that.map.removeLayer('maine') // 清除范围
          that.map.removeSource('maine')
        }
      }
      if (dataz.json.features.length !== undefined) {
        if (that.json.name !== '中国') {
          for (let i = 0; i < dataz.json.features.length; i++) {
            const ele = dataz.json.features[i].geometry.coordinates
            for (let j = 0; j < ele.length; j++) {
              const element = ele[j][0]
              for (let z = 0; z < element.length; z++) {
                const element3 = element[z]
                bound.push(element3)
              }
            }
            that.map.addLayer({
              'id': 'maine' + i,
              'type': 'fill',
              'source': {
                'type': 'geojson',
                'data': dataz.json.features[i].geometry
              },
              'layout': {},
              'paint': {
                'fill-color': '#088',
                'fill-opacity': 0.2
              }
            }, 'symbolpoints')
          }
          // eslint-disable-next-line no-undef
          var line = turf.lineString(bound)
          // eslint-disable-next-line no-undef
          var bbox = turf.bbox(line)
          that.map.fitBounds(bbox, {
            padding: { bottom: 60 }
          })
          that.length = dataz.json.features.length
        } else {
          var hball = []
          var features = []
          const hbfeatures = [[dataz.json.features[2].geometry.coordinates[0][0]], [dataz.json.features[2].geometry.coordinates[0][1]], dataz.json.features[2].geometry.coordinates[1]]
          for (let index = 0; index < hbfeatures.length; index++) {
            const element = hbfeatures[index]
            hball.push({ id: 33 + index, type: 'Feature', properties: { name: '河北省' }, geometry: { coordinates: element, type: 'Polygon' }})
          }
          for (let index = 0; index < dataz.json.features.length; index++) {
            const element = dataz.json.features[index]
            if (index === 2) {
              features.push(hball[0])
              features.push(hball[1])
              features.push(hball[2])
            } else {
              features.push(element)
            }
          }
          var qtbian = {
            'type': 'FeatureCollection',
            'features': features
          }
          that.map.addLayer({
            'id': 'maine0',
            'type': 'fill',
            'source': {
              'type': 'geojson',
              'data': qtbian
            },
            'layout': {},
            'paint': {
              'fill-color': '#088',
              'fill-opacity': 0.2
            }
          }, 'symbolpoints')
          that.length = 1
          that.map.flyTo({
            center: [107.01292828127248, 34.12077517311424],
            zoom: 2.75,
            speed: 3
          })
        }
      } else {
        that.map.addLayer({
          'id': 'maine',
          'type': 'fill',
          'source': {
            'type': 'geojson',
            'data': dataz.json.features.geometry
          },
          'layout': {},
          'paint': {
            'fill-color': '#088',
            'fill-opacity': 0.2
          }
        })
        // eslint-disable-next-line no-undef
        const line1 = turf.lineString(dataz.json.features.geometry.coordinates[0][0])
        // eslint-disable-next-line no-undef
        const bbox1 = turf.bbox(line1)
        that.map.fitBounds(bbox1, {
          padding: { bottom: 60 }
        })
        that.length = dataz.json.features.length
      }
    },
    // 文本情感分析
    Nlp(e, box, chart) {
      // 词云
      var zx, fx
      if (e[0].length > 150) {
        zx = e[0] // 正向
        zx.sort(function(a, b) {
          return a - b
        })
        zx = zx.slice(0, 150) // 正向
      } else {
        zx = e[0] // 正向
        zx.sort(function(a, b) {
          return a - b
        })
      }
      if (e[1].length > 150) {
        fx = e[1] // 正向
        fx.sort(function(a, b) {
          return a - b
        })
        fx = fx.slice(0, 150) // 正向
      } else {
        fx = e[1] // 正向
        fx.sort(function(a, b) {
          return a - b
        })
      }
      // 占比
      var zxS = 0
      var fxS = 0
      var xxS = 0
      for (let i = 0; i < zx.length; i++) {
        zxS = zxS + zx[i].emotion
      }
      for (let i = 0; i < fx.length; i++) {
        fxS = fxS + fx[i].emotion
      }
      xxS = zxS + fxS
      var z = zxS / xxS
      var f = fxS / xxS
      // 情感
      var emotion = [0, 0, 0, 0, 0] // 喜 怒 哀 乐 忧
      for (let i = 0; i < e[0].length; i++) {
        if (e[0][i].type === '喜') {
          emotion[0]++
        } else if (e[0][i].type === '怒') {
          emotion[1]++
        } else if (e[0][i].type === '哀') {
          emotion[2]++
        } else if (e[0][i].type === '乐') {
          emotion[3]++
        } else if (e[0][i].type === '忧') {
          emotion[4]++
        }
      }
      for (let i = 0; i < e[1].length; i++) {
        if (e[1][i].type === '喜') {
          emotion[0]++
        } else if (e[1][i].type === '怒') {
          emotion[1]++
        } else if (e[1][i].type === '哀') {
          emotion[2]++
        } else if (e[1][i].type === '乐') {
          emotion[3]++
        } else if (e[1][i].type === '忧') {
          emotion[4]++
        }
      }
      var zong = emotion[0] + emotion[1] + emotion[2] + emotion[3] + emotion[4]
      for (let i = 0; i < emotion.length; i++) {
        emotion[i] = (emotion[i] / zong * 100).toFixed(2) * 1
      }
      // 触发
      this.Forwards(zx, box[0], chart[0])
      this.Negatives(fx, box[1], chart[1])
      this.PANegative((z * 100).toFixed(2) * 1, (f * 100).toFixed(2) * 1, box[2], chart[2])
      this.Emotions(emotion, box[3], chart[3])
    },
    // 正向词云
    Forwards(data, he, e) {
      var that = this
      he = echarts.init(document.getElementById(e))
      const option = {
        series: [{
          type: 'wordCloud',
          shape: 'circle',
          left: 'center',
          top: 'center',
          width: '100%',
          height: '100%',
          right: null,
          bottom: null,
          sizeRange: [0, 40], // 画布范围
          rotationRange: [-45, 45], // 数据翻转范围,
          rotationStep: 25,
          gridSize: 8,
          drawOutOfBound: true, // 设置为true以允许在画布外部部分绘制单词,允许绘制大于画布大小的单词
          layoutAnimation: true,
          textStyle: {
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            color: function() {
              var colc = 0
              for (var i = 0; i < 1; i++) {
                var ret = that.randomHsl()
                // 颜色相邻颜色差异须大于 0.25
                if (i > 0 && Math.abs(ret[0] - colc) < 0.25) {
                  i--
                  continue // 重新获取随机色
                }
                ret[1] = 0.7 + (ret[1] * 0.2) // [0.7 - 0.9] 排除过灰颜色
                ret[2] = 0.4 + (ret[2] * 0.4) // [0.4 - 0.8] 排除过亮过暗色
                // 数据转化到小数点后两位
                ret = ret.map(function(item) {
                  return parseFloat(item.toFixed(2))
                })
                colc = ret
              }
              var zhong = that.hslToRgb(colc[0], colc[1], colc[2])
              return 'rgb(' + zhong[0] + ', ' + zhong[1] + ', ' + zhong[2] + ')'
            }
          },
          data: data
        }]
      }
      window.addEventListener('resize', function() {
        var chart = echarts.init(document.getElementById(e))
        if (chart) {
          chart.resize() // 不报错
        }
      })
      he.setOption(option)
      // 点击事件
      he.on('click', function(params) {})
    },
    // 负向词云
    Negatives(data, he, e) {
      var that = this
      he = echarts.init(document.getElementById(e))
      const option = {
        series: [{
          type: 'wordCloud',
          shape: 'circle',
          left: 'center',
          top: 'center',
          width: '100%',
          height: '100%',
          right: null,
          bottom: null,
          sizeRange: [0, 40], // 画布范围
          rotationRange: [-45, 45], // 数据翻转范围,
          rotationStep: 25,
          gridSize: 8,
          drawOutOfBound: true, // 设置为true以允许在画布外部部分绘制单词,允许绘制大于画布大小的单词
          layoutAnimation: true,
          textStyle: {
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            color: function() {
              var colc = 0
              for (var i = 0; i < 1; i++) {
                var ret = that.randomHsl()
                // 颜色相邻颜色差异须大于 0.25
                if (i > 0 && Math.abs(ret[0] - colc) < 0.25) {
                  i--
                  continue // 重新获取随机色
                }
                ret[1] = 0.7 + (ret[1] * 0.2) // [0.7 - 0.9] 排除过灰颜色
                ret[2] = 0.4 + (ret[2] * 0.4) // [0.4 - 0.8] 排除过亮过暗色
                // 数据转化到小数点后两位
                ret = ret.map(function(item) {
                  return parseFloat(item.toFixed(2))
                })
                colc = ret
              }
              var zhong = that.hslToRgb(colc[0], colc[1], colc[2])
              return 'rgb(' + zhong[0] + ', ' + zhong[1] + ', ' + zhong[2] + ')'
            }
          },
          data: data
        }]
      }
      window.addEventListener('resize', function() {
        var chart = echarts.init(document.getElementById(e))
        if (chart) {
          chart.resize() // 不报错
        }
      })
      he.setOption(option)
      // 点击事件
      he.on('click', function(params) {})
    },
    // 正负比例
    PANegative(z, f, he, e) {
      // var that = this
      he = echarts.init(document.getElementById(e))
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} %',
          textStyle: {
            fontWeight: 'bold',
            fontSize: 14,
            fontFamily: 'KuHei'
          },
          confine: true
        },
        legend: {
          top: '10%',
          left: 'center',
          textStyle: { fontSize: 13, color: 'rgba(243,243,243,.9)', fontFamily: 'KuHei' },
          data: ['正向', '负向']
        },
        series: [
          {
            name: '情感正负向',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '60%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 12,
                  fontFamily: 'KuHei'
                }
              },
              emphasis: { show: true }
            },
            labelLine: {
              normal: {
                show: true,
                length: 10
              },
              emphasis: {
                show: true
              }
            },
            data: [
              {
                value: z,
                name: '正向',
                itemStyle: {
                  normal: {
                    color: 'rgb(254, 122, 125)'
                  }
                }
              },
              {
                value: f,
                name: '负向',
                itemStyle: {
                  normal: {
                    color: 'rgb(51, 175, 249)'
                  }
                }}
            ]
          }
        ]
      }
      window.addEventListener('resize', function() {
        var chart = echarts.init(document.getElementById(e))
        if (chart) {
          chart.resize() // 不报错
        }
      })
      he.setOption(option)
      // 点击事件
      he.on('click', function(params) {
      })
    },
    // 情感占比
    Emotions(data, he, e) {
      // var that = this
      he = echarts.init(document.getElementById(e))
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} %',
          textStyle: {
            fontWeight: 'bold',
            fontSize: 14,
            fontFamily: 'KuHei'
          },
          confine: true
        },
        legend: {
          top: '10%',
          left: 'center',
          textStyle: { fontSize: 13, color: 'rgba(243,243,243,.9)', fontFamily: 'KuHei' },
          data: ['喜', '怒', '哀', '乐', '忧']
        },
        series: [
          {
            name: '情感正负向',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '60%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 12,
                  fontFamily: 'KuHei'
                }
              },
              emphasis: { show: true }
            },
            labelLine: {
              normal: {
                show: true,
                length: 10
              },
              emphasis: {
                show: true
              }
            },
            data: [
              {
                value: data[0],
                name: '喜',
                itemStyle: {
                  normal: {
                    color: 'rgb(250, 159, 57)'
                  }
                }
              },
              {
                value: data[1],
                name: '怒',
                itemStyle: {
                  normal: {
                    color: 'rgb(187, 121, 208)'
                  }
                }
              },
              {
                value: data[2],
                name: '哀',
                itemStyle: {
                  normal: {
                    color: 'rgb(14, 200, 205)'
                  }
                }
              },
              {
                value: data[3],
                name: '乐',
                itemStyle: {
                  normal: {
                    color: 'rgb(254, 122, 125)'
                  }
                }
              },
              {
                value: data[4],
                name: '忧',
                itemStyle: {
                  normal: {
                    color: 'rgb(33, 183, 103)'
                  }
                }
              }
            ]
          }
        ]
      }
      window.addEventListener('resize', function() {
        var chart = echarts.init(document.getElementById(e))
        if (chart) {
          chart.resize() // 不报错
        }
      })
      he.setOption(option)
      // 点击事件
      he.on('click', function(params) {
      })
    },
    // 创建与销毁盒子
    CAdestroy() {
      if (this.myChart1 !== null && this.myChart2 !== null && this.myChart3 !== null && this.myChart4 !== null) {
        this.myChart1.clear()
        this.myChart1.dispose()
        this.myChart2.clear()
        this.myChart2.dispose()
        this.myChart3.clear()
        this.myChart3.dispose()
        this.myChart4.clear()
        this.myChart4.dispose()
      }
    },
    CAdestroy2() {
      if (this.myChartT1 !== null && this.myChartT2 !== null && this.myChartT3 !== null && this.myChartT4 !== null) {
        this.myChartT1.clear()
        this.myChartT1.dispose()
        this.myChartT2.clear()
        this.myChartT2.dispose()
        this.myChartT3.clear()
        this.myChartT3.dispose()
        this.myChartT4.clear()
        this.myChartT4.dispose()
      }
    },
    // 选择时间时触发
    STime() {
      if (this.json.name === '') {
        this.$message({
          message: '请选择城市！',
          type: 'warning',
          showClose: true
        })
        this.timx = this.checkTime2(new Date())
      } else {
        if ((new Date((new Date(this.timx)).getTime() + 24 * 60 * 60 * 1000)) < (new Date()).getTime()) {
          document.querySelectorAll('.fTime .img')[1].style.zIndex = 0
          document.querySelectorAll('.fTime .img')[1].style.opacity = 1
        } else {
          document.querySelectorAll('.fTime .img')[1].style.zIndex = -10
          document.querySelectorAll('.fTime .img')[1].style.opacity = 0
        }
        this.json.timx = this.checkTime5(new Date(this.timx))
        this.json.timz = this.checkTime5(new Date((new Date(this.timx)).getTime() - 31 * 24 * 60 * 60 * 1000))
        this.getJson(2)
      }
    },
    // 减少时间
    ReduceTime() {
      if (this.json.name === '') {
        this.$message({
          message: '请选择城市！',
          type: 'warning',
          showClose: true
        })
      } else {
        this.timx = this.checkTime2(new Date((new Date(this.timx)).getTime() - 24 * 60 * 60 * 1000))
        document.querySelectorAll('.fTime .img')[1].style.zIndex = 0
        document.querySelectorAll('.fTime .img')[1].style.opacity = 1
        this.json.timx = this.checkTime5(new Date(this.timx))
        this.json.timz = this.checkTime5(new Date((new Date(this.timx)).getTime() - 31 * 24 * 60 * 60 * 1000))
        this.getJson(2)
      }
    },
    // 增加时间
    IncreaseTime() {
      if (this.json.name === '') {
        this.$message({
          message: '请选择城市！',
          type: 'warning',
          showClose: true
        })
      } else {
        this.timx = this.checkTime2(new Date((new Date(this.timx)).getTime() + 24 * 60 * 60 * 1000))
        if ((new Date((new Date(this.timx)).getTime() + 24 * 60 * 60 * 1000)) < (new Date()).getTime()) {
          document.querySelectorAll('.fTime .img')[1].style.zIndex = 0
          document.querySelectorAll('.fTime .img')[1].style.opacity = 1
        } else {
          document.querySelectorAll('.fTime .img')[1].style.zIndex = -10
          document.querySelectorAll('.fTime .img')[1].style.opacity = 0
        }
        this.json.timx = this.checkTime5(new Date(this.timx))
        this.json.timz = this.checkTime5(new Date((new Date(this.timx)).getTime() - 31 * 24 * 60 * 60 * 1000))
        this.getJson(2)
      }
    },
    // 移动
    m1(event) {
      var that = this
      const table = document.getElementById('table')
      const y = event.pageY - table.offsetTop
      this.canMove = true
      document.onmouseup = function() {
        that.canMove = false
        document.onmousemove = null
        document.onmouseup = null
      }
      document.onmousemove = function(e) {
        if (that.canMove) {
          document.getElementById('table').style.transition = 'all 0s ease 0s'
          var top = e.clientY - y
          if (top < 0) top = 0
          var maxTop = window.innerHeight - table.offsetHeight / 2 + 40
          var minTop = 175
          if (top > maxTop) top = maxTop
          if (top < minTop) top = minTop
          table.style.top = top + 'px'
        }
      }
    },
    m2(event) {
      var that = this
      const ciyun = document.getElementById('ciyun')
      const x = event.pageX - ciyun.offsetLeft
      const y = event.pageY - ciyun.offsetTop
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
          var maxLeft = window.innerWidth - 310 - ciyun.offsetWidth / 2
          var minLeft = 350 + ciyun.offsetWidth / 2
          var maxTop = window.innerHeight - ciyun.offsetHeight / 2 + 240
          var minTop = ciyun.offsetHeight - 165
          if (left > maxLeft) left = maxLeft
          if (left < minLeft) left = minLeft
          if (top > maxTop) top = maxTop
          if (top < minTop) top = minTop
          ciyun.style.left = left + 'px'
          ciyun.style.top = top + 'px'
        }
      }
    },
    m3(event) {
      var that = this
      const speech = document.getElementById('speech')
      const x = event.pageX - speech.offsetLeft
      const y = event.pageY - speech.offsetTop
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
          var maxLeft = window.innerWidth - 310 - speech.offsetWidth / 2
          var minLeft = 350 + speech.offsetWidth / 2
          var maxTop = window.innerHeight - speech.offsetHeight / 2 + 300
          var minTop = speech.offsetHeight - 200
          if (left > maxLeft) left = maxLeft
          if (left < minLeft) left = minLeft
          if (top > maxTop) top = maxTop
          if (top < minTop) top = minTop
          speech.style.left = left + 'px'
          speech.style.top = top + 'px'
        }
      }
    },
    // 定位
    location(e) {
      this.map.flyTo({
        center: [e.x * 1, e.y * 1],
        zoom: 12
      })
    },
    // 时序分析
    sequential() {
      var that = this
      if (that.json.name === '') {
        this.$message({
          message: '请选择城市！',
          type: 'warning',
          showClose: true
        })
      } else {
        var xuanzs = document.querySelectorAll('.xuanz')
        for (let j = 0; j < xuanzs.length; j++) {
          xuanzs[j].classList.remove('zhong')
        }
        this.map.setLayoutProperty('earthquakes-heat', 'visibility', 'none')
        that.close1()
        document.getElementById('sequential').style.transition = 'all 1s'
        document.getElementById('sequential').style.top = 'calc(65% - 40px)'
        setTimeout(function() {
          document.getElementById('sequential').style.transition = 'all 0s ease 0s'
        }, 1000)
        var data = {}
        data.where = that.json.where
        data.name = that.json.name
        data.timx = that.checkTime4((new Date(new Date(that.timx).getTime() - 24 * 60 * 60 * 1000)))
        data.timz = that.checkTime4((new Date(new Date(data.timx).getTime() - 30 * 24 * 60 * 60 * 1000)))
        var times = []
        var timex = []
        var timez = []
        that.guodu = []
        var ci = ((new Date(data.timx)).getTime() - (new Date(data.timz)).getTime()) / (24 * 60 * 60 * 1000)
        for (let i = 0; i < ci; i++) {
          times.push([])
          timex.push(0)
          timez.push(that.checkTime5((new Date(new Date(data.timz).getTime() + i * 24 * 60 * 60 * 1000))))
        }
        document.getElementById('bg').style.display = 'block' // 遮罩
        that.$store.dispatch('sentiment/Sequential', data).then((datas) => {
          for (let i = 0; i < datas.length; i++) {
            datas[i].time = that.checkTime5(new Date(datas[i].time))
            times[timez.indexOf(datas[i].time)].push(datas[i])
            timex[timez.indexOf(datas[i].time)]++
          }
          that.times = times
          document.getElementById('bg').style.display = 'none' // 遮罩
          if (that.myChart !== null) {
            that.myChart.clear()
            that.myChart.dispose()
          }
          that.myChart = echarts.init(document.getElementById('sequentials'))
          const option = {
            visualMap: [
              {
                show: false,
                type: 'continuous',
                seriesIndex: 0,
                min: 5,
                max: 88,
                inRange: {
                  color: ['#acdcff', '#e4a5ff']
                }
              }
            ],
            title: {
              text: '舆情数量',
              left: 'center',
              padding: 10,
              textStyle: {
                color: 'rgb(210, 210, 210)',
                fontFamily: 'KuHei',
                fontWeight: 'bolder',
                fontSize: '16px'
              }
            },
            tooltip: {
              trigger: 'axis',
              formatter: function(params) {
                // console.log(params[0].name)
                // 地图数据
                that.guodu = that.times[params[0].dataIndex]
                that.sequentialPoint(params[0].name)
                // console.log(that.guodu)
                var rez = params[0].name + '   条数: <span style="font-weight: bold">' + params[0].data + '</span>'
                return rez
              },
              textStyle: {
                fontWeight: 'bold',
                fontSize: 14,
                fontFamily: 'KuHei'
              },
              confine: true,
              transitionDuration: 0
            },
            xAxis: {
              type: 'category',
              data: timez,
              axisLabel: {
                show: true,
                color: '#fff'
              }
            },
            yAxis: {
              type: 'value',
              // scale: true,
              splitLine: false,
              name: '条',
              axisLabel: {
                show: true,
                color: '#fff'
              }
            },
            grid: {
              left: '3%',
              right: '3%',
              bottom: '18%',
              top: '15%',
              containLabel: true
            },
            dataZoom: [
              {
                show: true,
                type: 'slider',
                height: '25px',
                bottom: '5%',
                start: 0,
                end: 100
              }
            ],
            series: [
              {
                type: 'bar',
                barWidth: 20,
                showSymbol: false,
                data: timex
              }
            ]
          }
          window.addEventListener('resize', function() {
            var chart = echarts.init(document.getElementById('sequentials'))
            if (chart) {
              chart.resize() // 不报错
            }
          })
          that.myChart.setOption(option)
          // 点击事件
          that.myChart.on('click', function(params) {
          })
        })
      }
    },
    // 判断时序分析是否切换
    sequentialPoint(name) {
      var that = this
      if (this.timename !== name) {
        that.timename = name
        this.map.setLayoutProperty('unclustered-point', 'visibility', 'none')
        this.map.setLayoutProperty('cluster-count', 'visibility', 'none')
        this.map.setLayoutProperty('clusters', 'visibility', 'none')
        this.map.setLayoutProperty('symbolpoints', 'visibility', 'none')
        this.map.setLayoutProperty('Bubbpoints', 'visibility', 'visible')
        this.honeycomb.hide()
        // console.log('切换')
        // console.log(that.guodu)
        var TFeatures = []
        var type = 0
        var v = 0
        for (let index = 0; index < that.guodu.length; index++) {
          v = 1 * Math.random() - 0.5
          if (that.guodu[index].emotion == null) {
            that.guodu[index].emotion = v
          }
          if (that.guodu[index].emotion * 1 > 0.4) {
            type = 4
          } else if (that.guodu[index].emotion * 1 > 0.2) {
            type = 3
          } else if (that.guodu[index].emotion * 1 > -0.2) {
            type = 2
          } else if (that.guodu[index].emotion * 1 > -0.4) {
            type = 1
          } else {
            type = 0
          }
          var TGong = {
            'type': 'Feature',
            'properties': {
              'id': that.guodu[index].id,
              'time': that.guodu[index].time,
              'emotion': that.guodu[index].emotion,
              'description': '<p><a href="' + that.guodu[index].sourceUrl + '" target="_blank">' +
                that.guodu[index].title.slice(0, 12) + '...' + '</a></p><p class="wenben">' + that.guodu[index].summary + '</p><p class="time">' +
                '时间：' + that.checkTime2(new Date(that.guodu[index].time)) + '</p>' + '<p class="laiyuan">来源：' + that.guodu[index].infoSource + '</p><span id="dian" class="qinggan">情感分析</span>',
              'place': that.guodu[index].place,
              'type': type
            },
            'geometry': {
              'type': 'Point',
              'coordinates': JSON.parse('[' + that.guodu[index].x + ', ' + that.guodu[index].y + ']')
            }
          }
          TFeatures.push(TGong)
        }
        var TDate = {
          'type': 'FeatureCollection',
          'crs': { 'type': 'name', 'properties': { 'name': 'urn:ogc:def:crs:OGC:1.3:CRS84' }},
          'features': TFeatures
        }
        if (that.BubblePoint === null) {
          that.BubblePoint = 1
          that.map.addSource('Bubbmap', {
            'type': 'geojson',
            'data': TDate
          })
          that.map.addLayer({
            'id': 'Bubbpoints',
            'type': 'circle',
            'source': 'Bubbmap',
            'paint': {
              // make circles larger as the user zooms from z12 to z22
              'circle-radius': [
                'match',
                ['get', 'type'],
                0, 20,
                1, 15,
                2, 10,
                3, 15,
                /* other */ 20
              ],
              'circle-color': [
                'match',
                ['get', 'type'],
                0, 'rgba(213,6,33,0.8)',
                1, 'rgba(176,38,38,0.8)',
                2, 'rgba(64,60,53,0.8)',
                3, 'rgba(23,166,125,0.8)',
                /* other */ 'rgba(0,255,170,0.8)'
              ],

              // 这个是外边框的颜色 circle-stroke-color这个对应了上面circle-color
              'circle-stroke-color': [
                'match',
                ['get', 'type'],
                0, 'rgba(213,6,33,0.2)',
                1, 'rgba(176,38,38,0.2)',
                2, 'rgba(64,60,53,0.2)',
                3, 'rgba(23,166,125,0.2)',
                /* other */ 'rgba(0,255,170,0.2)'
              ],
              // 这个是外边框晕染的范围
              'circle-stroke-width': [
                'match',
                ['get', 'type'],
                0, // 蓝色晕染长度，当点数小于100时为5px晕染
                5,
                1, // 对应上面circle-color 数字，意思为100以内
                7,
                2, // 点计数在100到750之间时为黄色，6px晕染
                9,
                3, // 对应上面circle-color 数字，意思为750以内
                10,
                5
              ]
              // 'circle-opacity': 0.2
            }
          })
        } else {
          that.map.getSource('Bubbmap').setData(TDate)
        }
      }
    },
    // 数据分析-时序
    fengxi2() {
      var that = this
      if (that.guodu.length === 0) {
        this.$message({
          message: '请选择要分析的时间！',
          type: 'warning',
          showClose: true
        })
      } else {
        that.zhong = 1
        document.getElementById('bg').style.display = 'block' // 遮罩
        that.$store.dispatch('sentiment/TAnalysis', that.guodu).then((datas) => {
          that.CAdestroy2()
          var box = [that.myChartT1, that.myChartT2, that.myChartT3, that.myChartT4]
          var chart = ['TForward', 'TNegative', 'TPMinus', 'TEmotion']
          that.Nlp(datas, box, chart)
          // 样式
          document.getElementById('ciyun').style.transition = 'all 1s'
          document.getElementById('ciyun').style.top = '50%'
          document.getElementById('ciyun').style.left = '50%'
          document.getElementById('ciyun').style.transform = 'translate(-50%, -50%)'
          setTimeout(function() {
            document.getElementById('ciyun').style.transition = 'all 0s ease 0s'
          }, 1000)
          document.getElementById('sequential').style.transition = 'all 1s'
          document.getElementById('sequential').style.top = 'calc(100% + 40px)'
          setTimeout(function() {
            document.getElementById('sequential').style.transition = 'all 0s ease 0s'
          }, 1000)
          document.getElementById('bg').style.display = 'none' // 遮罩
        })
      }
    },
    // 数据分析
    fengxi() {
      var that = this
      var length = this.$refs.plTable.getCheckboxRecords().length
      if (length <= 0) {
        this.$message({
          message: '请选择要分析的文本！',
          type: 'warning',
          showClose: true
        })
      } else {
        that.zhong = 2
        document.getElementById('bg').style.display = 'block' // 遮罩
        that.$store.dispatch('sentiment/TAnalysis', this.$refs.plTable.getCheckboxRecords()).then((datas) => {
          that.CAdestroy2()
          var box = [that.myChartT1, that.myChartT2, that.myChartT3, that.myChartT4]
          var chart = ['TForward', 'TNegative', 'TPMinus', 'TEmotion']
          that.Nlp(datas, box, chart)
          // 样式
          document.getElementById('ciyun').style.transition = 'all 1s'
          document.getElementById('ciyun').style.top = '50%'
          document.getElementById('ciyun').style.left = '50%'
          document.getElementById('ciyun').style.transform = 'translate(-50%, -50%)'
          setTimeout(function() {
            document.getElementById('ciyun').style.transition = 'all 0s ease 0s'
          }, 1000)
          document.getElementById('table').style.transition = 'all 1s'
          document.getElementById('table').style.top = 'calc(100% - 70px)'
          setTimeout(function() {
            document.getElementById('table').style.transition = 'all 0s ease 0s'
          }, 1000)
          document.getElementById('bg').style.display = 'none' // 遮罩
        })
      }
    },
    // 打开数据分析
    DAnalysis() {
      this.close4()
      document.getElementById('table').style.transition = 'all 1s'
      document.getElementById('table').style.top = 'calc(65% - 40px)'
      setTimeout(function() {
        document.getElementById('table').style.transition = 'all 0s ease 0s'
      }, 1000)
    },
    // 词性标注
    tagging() {
      var that = this
      var length = this.$refs.plTable.getCheckboxRecords().length
      if (length <= 0) {
        this.$message({
          message: '请选择要分析的文本！',
          type: 'warning',
          showClose: true
        })
      } else {
        that.zhong = 2
        that.close2() // 关闭词云弹窗
        // 弹出标注集
        that.sSate = speech
        document.getElementById('speech').style.transition = 'all 1s'
        document.getElementById('speech').style.top = 'calc(50%)'
        document.getElementById('speech').style.left = 'calc(50%)'
        document.getElementById('speech').style.transform = 'translate(-50%, -50%)'
        setTimeout(function() {
          document.getElementById('speech').style.transition = 'all 0s ease 0s'
        }, 1000)
        document.getElementById('table').style.transition = 'all 1s'
        document.getElementById('table').style.top = 'calc(100% - 70px)'
        setTimeout(function() {
          document.getElementById('table').style.transition = 'all 0s ease 0s'
        }, 1000)
      }
    },
    // 词性标注-词性分析
    PAnalysis() {
      if (this.$refs.plTable2.getCheckboxRecords().length <= 0) {
        this.$message({
          message: '请选择标注！',
          type: 'warning',
          showClose: true
        })
      } else {
        var that = this
        var ci = []
        for (let i = 0; i < this.$refs.plTable2.getCheckboxRecords().length; i++) {
          ci.push(this.$refs.plTable2.getCheckboxRecords()[i].标注)
        }
        var data = [{
          'cx': ci,
          'data': this.$refs.plTable.getCheckboxRecords()
        }]
        document.getElementById('bg').style.display = 'block' // 遮罩
        that.$store.dispatch('sentiment/PAnalysis', data).then((datas) => {
          that.CAdestroy2()
          var box = [that.myChartT1, that.myChartT2, that.myChartT3, that.myChartT4]
          var chart = ['TForward', 'TNegative', 'TPMinus', 'TEmotion']
          that.Nlp(datas, box, chart)
          document.getElementById('speech').style.transition = 'all 1s'
          document.getElementById('speech').style.top = '100%'
          document.getElementById('speech').style.left = '50%'
          document.getElementById('speech').style.transform = 'translateX(-50%)'
          setTimeout(function() {
            document.getElementById('speech').style.transition = 'all 0s ease 0s'
          }, 1000)
          // 样式
          document.getElementById('ciyun').style.transition = 'all 1s'
          document.getElementById('ciyun').style.top = '50%'
          document.getElementById('ciyun').style.left = '50%'
          document.getElementById('ciyun').style.transform = 'translate(-50%, -50%)'
          setTimeout(function() {
            document.getElementById('ciyun').style.transition = 'all 0s ease 0s'
          }, 1000)
          document.getElementById('bg').style.display = 'none' // 遮罩
        })
      }
    },
    // 关闭数据分析
    close1() {
      document.getElementById('table').style.transition = 'all 1s'
      document.getElementById('table').style.top = 'calc(100% + 40px)'
      setTimeout(function() {
        document.getElementById('table').style.transition = 'all 0s ease 0s'
      }, 1000)
    },
    // 关闭词云
    close2() {
      this.CAdestroy2()
      document.getElementById('ciyun').style.transition = 'all 1s'
      document.getElementById('ciyun').style.top = '100%'
      document.getElementById('ciyun').style.left = '50%'
      document.getElementById('ciyun').style.transform = 'translateX(-50%)'
      setTimeout(function() {
        document.getElementById('ciyun').style.transition = 'all 0s ease 0s'
      }, 1000)
      if (this.zhong === 2) {
        this.DAnalysis()
      } else if (this.zhong === 1) {
        document.getElementById('sequential').style.transition = 'all 1s'
        document.getElementById('sequential').style.top = 'calc(65% - 40px)'
        setTimeout(function() {
          document.getElementById('sequential').style.transition = 'all 0s ease 0s'
        }, 1000)
      }
    },
    // 关闭词性标注
    close3() {
      this.CAdestroy2()
      document.getElementById('speech').style.transition = 'all 1s'
      document.getElementById('speech').style.top = '100%'
      document.getElementById('speech').style.left = '50%'
      document.getElementById('speech').style.transform = 'translateX(-50%)'
      setTimeout(function() {
        document.getElementById('speech').style.transition = 'all 0s ease 0s'
      }, 1000)
      this.DAnalysis()
    },
    // 关闭时序统计
    close4() {
      document.getElementById('sequential').style.transition = 'all 1s'
      document.getElementById('sequential').style.top = 'calc(100% + 40px)'
      setTimeout(function() {
        document.getElementById('sequential').style.transition = 'all 0s ease 0s'
      }, 1000)
    },
    // 时间处理
    checkTime(i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
    },
    // 时间处理2
    checkTime2(i) {
      var that = this
      return i.getFullYear() + '-' + that.checkTime(i.getMonth() + 1) + '-' + that.checkTime(i.getDate()) + ' ' + that.checkTime(i.getHours()) + ':' + that.checkTime(i.getMinutes())
    },
    // 时间处理3
    checkTime3(i) {
      var that = this
      return that.checkTime(i.getHours()) + ':' + that.checkTime(i.getMinutes())
    },
    // 时间处理4
    checkTime4(i) {
      var that = this
      return i.getFullYear() + '-' + that.checkTime(i.getMonth() + 1) + '-' + that.checkTime(i.getDate()) + ' ' + '00' + ':' + '00'
    },
    // 时间处理5
    checkTime5(i) {
      var that = this
      return i.getFullYear() + '-' + that.checkTime(i.getMonth() + 1) + '-' + that.checkTime(i.getDate())
    },
    // 随机颜色
    hslToRgb(H, S, L) {
      var R, G, B
      if (+S === 0) {
        R = G = B = L // 饱和度为0 为灰色
      } else {
        var hue2Rgb = function(p, q, t) {
          if (t < 0) t += 1
          if (t > 1) t -= 1
          if (t < 1 / 6) return p + (q - p) * 6 * t
          if (t < 1 / 2) return q
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
          return p
        }
        var Q = L < 0.5 ? L * (1 + S) : L + S - L * S
        var P = 2 * L - Q
        R = hue2Rgb(P, Q, H + 1 / 3)
        G = hue2Rgb(P, Q, H)
        B = hue2Rgb(P, Q, H - 1 / 3)
      }
      return [Math.round(R * 255), Math.round(G * 255), Math.round(B * 255)]
    },
    // 获取随机HSL
    randomHsl() {
      var H = Math.random()
      var S = Math.random()
      var L = Math.random()
      return [H, S, L]
    }
  }
}
</script>
<style scoped>
@font-face {
  src: url("../public/font/KuHei.ttf");
  font-family: "KuHei";
}
@font-face {
  src: url("../public/font/Microsoft-YaHei.ttf");
  font-family: "YaHei";
}
@font-face {
  src: url("../public/font/DS-DIGIT.ttf");
  font-family: "DIGIT";
}
#emotional {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url("../public/img/back.png") no-repeat center center;
}
.tittles {
  background-color: rgba(40, 43, 57, 0.8);
  position: absolute;
  width: 100%;
  z-index: 10;
  height: 25px;
  line-height: 25px;
  text-align: center;
  letter-spacing: 5px;
  font-size: 16px;
  font-family: KuHei;
  color: #fff;
}
#emotional #EMap {
  position: fixed;
  width: 100%;
  height: 100%;
}
#emotional ul,
#emotional p {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
/* 工具 */
#emotional .type {
  position: absolute;
  z-index: 10;
  top: 50px;
  right: 310px;
  font-family: KuHei;
  font-size: 14px;
}
#emotional .type li {
  width: 100px;
  height: 35px;
  text-align: center;
  padding: 5px 0;
  cursor: pointer;
  border-radius: 2px;
  color: rgb(202, 202, 202);
  /* background-color: rgba(79, 133, 177, 0.3); */
  background-color: rgba(79, 133, 177, 0.3);
  border: 1.5px solid #0fafeb;
  transition: all 0.5s;
  margin-bottom: 5px;
}
#emotional .type li:hover {
  color: rgb(230, 230, 230);
}
/* 左侧样式 */
#emotional #left {
  position: absolute;
  bottom: 5px;
  left: 45px;
  z-index: 10;
  padding: 5px;
  /* background-color: rgba(40, 43, 57, 0.1); */
  /* border: 1.5px solid #0fafeb; */
  width: 300px;
  height: calc(100% - 5px);
  color: #fff;
  font-family: KuHei;
  font-size: 14px;
  border-radius: 2px;
}
#emotional #left .public {
  position: absolute;
  width: calc(100% - 10px);
  /* border: 1.5px solid #0fafeb; */
  background: url("../public/img/bn.png") ;
  background-size: 100% 100%;
  height: 140px;
}
#emotional #left .publiz {
  height: calc(((100% - 150px) / 2) - 5px);
}
#emotional #left .publiz:nth-child(2) {
  top: 150px;
}
#emotional #left .publiz:nth-child(3) {
  bottom: 5px;
}
#emotional #left .public .xuanz {
  position: absolute;
  height: calc(50% - 10px);
  width: calc(100% / 2 - 7.5px);
  text-align: center;
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
  padding: 10px;
}
#emotional #left .public .xuanz:nth-child(1) {
  left: 5px;
  top: 5px;
}
#emotional #left .public .xuanz:nth-child(2) {
  right: 5px;
  top: 5px;
}
#emotional #left .public .xuanz:nth-child(3) {
  left: 5px;
  bottom: 5px;
}
#emotional #left .public .xuanz:nth-child(4) {
  right: 5px;
  bottom: 5px;
}
#emotional #left .public .xuanz p {
  width: 120px;
  height: 40px;
  line-height: 40px;
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  background-color: #ff797998;
  border: 1px solid rgba(255, 255, 255, 0.8);
  transition: all 0.5s;
  cursor: pointer;
  letter-spacing: 5px;
}
#emotional #left .public .zhong p {
  background-color: #ff7979;
}
#emotional #left .public .xuanz p:hover {
  background-color: #ff7979;
}
/* 右侧样式 */
#emotional #right {
  position: absolute;
  bottom: 5px;
  right: 5px;
  z-index: 1;
  padding: 5px;
  background-color: rgba(40, 43, 57, 0.1);
  /* border: 1.5px solid #0fafeb; */
  width: 300px;
  height: calc(100% - 5px);
  color: #fff;
  font-family: KuHei;
  font-size: 14px;
  border-radius: 2px;
}
#emotional #right .public {
  position: absolute;
  width: calc(100% - 10px);
  /* border: 1.5px solid #0fafeb; */
  background: url("../public/img/bn.png") ;
  background-size: 100% 100%;
  height: 140px;
}
#emotional #right .public:nth-child(1) {
  text-align: center;
}
#emotional #right .public:nth-child(1) p:nth-child(1) {
  letter-spacing: 5px;
  height: 35px;
  line-height: 35px;
  border-bottom: 2px dashed rgba(219, 219, 219, 0.555);
}
#emotional #right .public:nth-child(1) p:nth-child(3) {
  position: absolute;
  width: 100%;
  left: 0;
  height: 45px;
  line-height: 45px;
  border-top: 2px dashed rgba(219, 219, 219, 0.555);
  bottom: 0;
}
#emotional #right .publiz {
  height: calc(((100% - 150px) / 2) - 5px);
}
#emotional #right .publiz:nth-child(2) {
  top: 150px;
}
#emotional #right .publiz:nth-child(3) {
  bottom: 5px;
}
/* 时间范围 */
#emotional #right .public:nth-child(1) .fTime {
  position: absolute;
  left: 0;
  width: 285px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
}
#emotional #right .public:nth-child(1) .fTime >>> .el-input__prefix,
#emotional #right .public:nth-child(1) .fTime >>> .el-input__suffix {
  display: none;
}
#emotional #right .public:nth-child(1) .fTime >>> .el-input__inner {
  background-color: rgba(255, 255, 255, 0) ;
  border: none;
  font-family: KuHei;
  color: #fff;
  text-align: center;
  width: 140px;
  border-bottom: 2px solid rgba(219, 219, 219, 0.555);
  height: 30px;
  border-radius: 0;
  cursor: pointer;
  user-select: none;
  padding: 0 10px;
}
#emotional #right .public:nth-child(1) .fTime >>> .el-date-editor.el-input,
#emotional #right .public:nth-child(1) .fTime >>> .el-date-editor.el-input__inner {
  width: 140px;
}
#emotional #right .public:nth-child(1) .fTime .img {
  margin: 0 15px;
  height: 45px;
  line-height: 45px;
  cursor: pointer;
  color: rgb(199, 199, 199);
  transition: all 0.5s;
}
#emotional #right .public:nth-child(1) .fTime .img:hover {
  color: #fff;
}
/* 时序统计 */
#emotional #sequential {
  position: absolute;
  width: calc(100% - 660px);
  height: calc(35% + 35px);
  top: calc(100% + 40px);
  right: 50%;
  transform: translateX(calc(50% + 20px));
  /* border: 1.5px solid #0fafeb; */
  background: url("../public/img/bg.png") ;
  z-index: 10;
}
#emotional #sequential .tool ul {
  position: absolute;
  top: -40px;
  left: -2px;
}
#emotional #sequential .tool li {
  display: inline-block;
  vertical-align: top;
  /* background-color: rgba(79, 133, 177, 0.3); */
  /* border: 1.5px solid #0fafeb; */
  width: 100px;
  height: 35px;
  text-align: center;
  padding: 5px 0;
  cursor: pointer;
  border-radius: 2px;
  color: rgb(202, 202, 202);
  margin-right: 5px;
  font-family: KuHei;
  letter-spacing: 1px;
  font-size: 14px;
}
#emotional #sequential span {
  position: absolute;
  right: 5px;
  top: 5px;
  z-index: 11;
  cursor: pointer;
}
#emotional #sequential span i {
  color: #fff;
  font-size: 22px;
}
/* 表 */
#emotional #table {
  position: absolute;
  width: calc(100% - 660px);
  height: calc(35% + 35px);
  /* top: calc(100% - 40px - 35%); */
  top: calc(100% + 40px);
  right: 50%;
  transform: translateX(calc(50% + 20px));
  /* border: 1.5px solid #0fafeb; */
  background: url("../public/img/bg.png") ;
  z-index: 10;
}
#emotional #table .tool ul {
  position: absolute;
  top: -40px;
  left: -2px;
}
#emotional #table .tool li {
  display: inline-block;
  vertical-align: top;
  /* background-color: rgba(79, 133, 177, 0.3);
  border: 1.5px solid #0fafeb; */
  width: 100px;
  height: 35px;
  text-align: center;
  padding: 5px 0;
  cursor: pointer;
  border-radius: 2px;
  color: rgb(202, 202, 202);
  margin-right: 5px;
  font-family: KuHei;
  letter-spacing: 1px;
  font-size: 14px;
}
#emotional #table .toor ul {
  position: absolute;
  top: -40px;
  right: -7px;
}
#emotional #table .toor li {
  display: inline-block;
  vertical-align: top;
  /* background-color: rgba(79, 133, 177, 0.3); */
  /* border: 1.5px solid #0fafeb; */
  width: 100px;
  height: 35px;
  text-align: center;
  padding: 5px 0;
  cursor: pointer;
  border-radius: 2px;
  color: rgb(202, 202, 202);
  margin-right: 5px;
  font-family: KuHei;
  letter-spacing: 1px;
  font-size: 14px;
}
#emotional #table .top {
  height: 30px;
  line-height: 30px;
  text-align: center;
  width: 100%;
  color: #fff;
  border-bottom: 1px solid #fff;
  background: rgba(18, 18, 18, 0.3);
  cursor: move;
}
#emotional #table .bottom {
  height: calc(100% - 30px);
  text-align: center;
  width: 100%;
  color: #fff;
}
#emotional #table .bottom >>> .plTableBox {
  position: absolute;
  height: calc(100% - 30px) !important;
}
#emotional #table .bottom >>> .plTableBox .el-table--border {
  position: absolute;
  height: calc(100%) !important;
  background: #fff0 !important;
  border: none !important;
  color: rgba(255, 255, 255, 0.8);
  font-family: KuHei;
  font-size: 12px;
}
#emotional #table .bottom >>> .plTableBox tr {
  background: #fff0 !important;
}
#emotional #table .bottom >>> .plTableBox th {
  background: #fff0 !important;
  border: none;
  border-bottom: 1px solid #fff;
  color: rgb(255, 255, 255);
  letter-spacing: 5px;
  background: rgba(18, 18, 18, 0.3) !important;
  font-size: 14px;
}
#emotional #table .bottom >>> .plTableBox td {
  background: #fff0 !important;
  border: none;
}
#emotional #table .bottom >>> .plTableBox .el-table--border::after,
#emotional #table .bottom >>> .plTableBox .el-table::before {
  background: #fff0 !important;
}
#emotional #table .bottom >>> .el-table__row:hover {
  background: rgba(146, 146, 146, 0.5) !important;
}
#emotional #table .bottom >>> .el-table-column--selection {
  padding-right: 5px;
}
#emotional #table .bottom a {
  transition: all 0.5s;
}
#emotional #table .bottom a:hover {
  color: #ff7979;
}
/* 标注集窗口 */
#emotional #speech {
  position: absolute;
  width: 550px;
  height: 400px;
  border: 1px solid #0fafeb;
  background: url("../public/img/bg.png") rgba(79, 133, 177, 0.3);
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 95;
}
#emotional #speech .top {
  height: 30px;
  line-height: 30px;
  text-align: center;
  width: 100%;
  color: #fff;
  border-bottom: 1px solid #fff;
  background: rgba(18, 18, 18, 0.3);
  cursor: move;
}
#emotional #speech .body {
  height: 325px;
  text-align: center;
  width: 100%;
  color: #fff;
}
#emotional #speech .body >>> .plTableBox .el-table--border {
  background: #fff0 !important;
  border: none !important;
  color: rgba(255, 255, 255, 0.8);
  font-family: KuHei;
  font-size: 12px;
}
#emotional #speech .body >>> .plTableBox tr {
  background: #fff0 !important;
}
#emotional #speech .body >>> .plTableBox th {
  background: #fff0 !important;
  border: none;
  border-bottom: 1px solid #fff;
  color: rgb(255, 255, 255);
  letter-spacing: 5px;
  background: rgba(18, 18, 18, 0.3) !important;
  font-size: 14px;
}
#emotional #speech .body >>> .plTableBox td {
  background: #fff0 !important;
  border: none;
}
#emotional #speech .body >>> .plTableBox .el-table--border::after,
#emotional #speech .body >>> .plTableBox .el-table::before {
  background: #fff0 !important;
}
#emotional #speech .body >>> .el-table__row:hover {
  background: rgba(146, 146, 146, 0.5) !important;
}
#emotional #speech .body >>> .el-table-column--selection {
  padding-right: 5px;
}
#emotional #speech .bottom {
  height: 45px;
  line-height: 45px;
  text-align: center;
  width: 100%;
  color: rgba(255, 255, 255, 0.8);
  border-top: 1px solid #fff;
  background: rgba(18, 18, 18, 0.3);
  cursor: pointer;
  transition: all 0.5s;
  letter-spacing: 5px;
  font-family: KuHei;
}
#emotional #speech .bottom:hover {
  color: rgba(255, 255, 255, 1);
}
/* 地图弹框样式 */
#EMap >>> .mapboxgl-popup-content {
  padding: 10px;
  text-align: center;
  border: 1px solid #0fafeb;
  background: url("../public/img/bg.png") rgba(79, 133, 177, 0.3);
  color: #fff;
}
#EMap >>> .mapboxgl-popup-content a::before {
  position: absolute;
  content: '▶';
  width: 20px;
  height: 20px;
  color: #fff;
  animation: fade-in2 1.5s linear infinite; /* 调用动画 */
}
#EMap >>> .mapboxgl-popup-content a::after {
  position: absolute;
  content: '◀';
  width: 20px;
  height: 20px;
  color: #fff;
  animation: fade-in1 1.5s linear infinite; /* 调用动画 */
}
@keyframes fade-in1 {
  0% {
    right: 5%;
  }
  50% {
    right: 10%;
  }
  100% {
    right: 5%;
  }
}
@keyframes fade-in2 {
  0% {
    left: 5%;
  }
  50% {
    left: 10%;
  }
  100% {
    left: 5%;
  }
}
#EMap >>> .wenben {
  text-indent: 2em;
  text-align: left;
}
#EMap >>> .mapboxgl-popup-close-button {
  font-size: 25px;
  color: #fff;
}
#EMap >>> .time {
  text-align: left;
}
#EMap >>> .laiyuan {
  position: absolute;
  bottom: -10px;
}
#EMap >>> .qinggan {
  position: absolute;
  right: 10px;
  bottom: 2px;
  cursor: pointer;
}
#emotional #ciyun {
  position: absolute;
  width: 350px;
  height: 335px;
  /* border: 1px solid #0fafeb;
  background: url("../public/img/bg.png") rgba(79, 133, 177, 0.3); */
  z-index: 91;
  left: 50%;
  transform: translateX(calc(-50%));
  top: calc(100%);
}
#emotional #ciyun .top {
  height: 30px;
  line-height: 30px;
  text-align: center;
  width: 100%;
  color: #fff;
  border-bottom: 1px solid #fff;
  background: rgba(18, 18, 18, 0.3);
  cursor: move;
}
#emotional #ciyun >>> .el-carousel {
  position: absolute;
  width: 100%;
  height: calc(100% - 30px);
}
#emotional #ciyun >>> .el-carousel__container {
  position: absolute;
  width: 100%;
  height: 100%;
}
/* 修饰 */
#emotional #sequential::after,
#emotional #left .public::after,
#emotional #right .public::after {
  position: absolute;
  content: "";
  bottom: -2px;
  right: -2px;
  height: 10px;
  width: 10px;
  /* border-bottom: 2px solid #02a6b5;
  border-right: 2px solid #02a6b5; */
  transition: all 1.5s;
  z-index: 0;
}
#emotional #sequential::before,
#emotional #left .public::before,
#emotional #right .public::before {
  position: absolute;
  content: "";
  top: -2px;
  left: -2px;
  height: 10px;
  /* width: 10px;
  border-top: 2px solid #02a6b5;
  border-left: 2px solid #02a6b5; */
  transition: all 1.5s;
  z-index: 0;
}
#emotional #legend {
  display: none;
  position: absolute;
  width: 180px;
  left: 350px;
  top: 0;
  height: 200px;
  border-radius: 3px;
  /* background-color: #0fafeb;
  border: 1px solid rgba(79, 133, 177, 0.3); */
  color: #fff;
}
#emotional #legend table {
  text-align: center;
  width: 180px;
  height: 200px;
}
#emotional #legend table td {
  text-align: center;
  position: relative;
  font-size: 13px;
  font-family: KuHei;
}
#emotional #legend table p {
  margin: 0;
  padding: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
}
#emotional #legend table td img {
  width: 25px;
}
/**===== xuan =====*/
#bg {
  display: none;
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(140, 140, 140, 0.4);
  z-index: 999;
}
#bg #xuan {
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  height: 50px;
  width: 70px;
  margin: -25px 0 0 -25px;
}
#bg #xuan span {
  width: 25px;
  height: 25px;
  background-color: #ff7979;
  display: inline-block;
  -webkit-animation: square3 1.7s infinite ease-in-out both;
  animation: square3 1.7s infinite ease-in-out both;
}
#bg #xuan span:nth-child(1) {
  left: 0px;
  -webkit-animation-delay: 0.1s;
  animation-delay: 0.1s;
}
#bg #xuan span:nth-child(2) {
  left: 15px;
  -webkit-animation-delay: 0.6s;
  animation-delay: 0.6s;
}
#bg #xuan span:nth-child(3) {
  left: 30px;
  -webkit-animation-delay: 1.1s;
  animation-delay: 1.1s;
}
#bg #xuan span:nth-child(4) {
  left: 45px;
  -webkit-animation-delay: 1.5s;
  animation-delay: 1.5s;
}
@keyframes square3 {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
    opacity: 0;
  }
  50% {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 1;
  }
  100% {
    -webkit-transform: rotate(60deg);
    transform: rotate(60deg);
    opacity: .5;
  }
}
@-webkit-keyframes square3 {
  0% {
    -webkit-transform: scale(0);
    opacity: 0;
  }
  50% {
    -webkit-transform: scale(1);
    opacity: 1;
  }
  100% {
    -webkit-transform: rotate(60deg);
    opacity: .5;
  }
}
/** END of xuan */
</style>
