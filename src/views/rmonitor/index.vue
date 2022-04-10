<template>
  <div id="rmonitor">
    <!-- 种类 -->
    <div id="type">
      <ul>
        <li>
          <!-- <span class="Tspan" style="background-color: #f4978e;" /> -->
          <p class="publis xunt" @click="qie('体温')">体温异常</p>
          <div class="numbers">
            {{ temperatureS }}<span style="font-size: 20px;font-family: 'KuHei';padding-left:5px;display: inline-block;vertical-align: top;color: rgb(180, 180, 180);">人</span>
          </div>
        </li>
        <li>
          <!-- <span class="Tspan" style="background-color: #a7cecb;" /> -->
          <p class="publis" @click="qie('心率')">心率异常</p>
          <div class="numbers">
            {{ heartrateS }}<span style="font-size: 20px;font-family: 'KuHei';padding-left:5px;display: inline-block;vertical-align: top;color: rgb(180, 180, 180);">人</span>
          </div>
        </li>
        <li>
          <!-- <span class="Tspan" style="background-color: #ffc09f;" /> -->
          <p class="publis" @click="qie('高压')">高压异常</p>
          <div class="numbers">
            {{ highpressureS }}<span style="font-size: 20px;font-family: 'KuHei';padding-left:5px;display: inline-block;vertical-align: top;color: rgb(180, 180, 180);">人</span>
          </div>
        </li>
        <li>
          <!-- <span class="Tspan" style="background-color: #f4acb7;" /> -->
          <p class="publis" @click="qie('低压')">低压异常</p>
          <div class="numbers">
            {{ lowpressureS }}<span style="font-size: 20px;font-family: 'KuHei';padding-left:5px;display: inline-block;vertical-align: top;color: rgb(180, 180, 180);">人</span>
          </div>
        </li>
        <li v-if="json.monitor === '隔离'">
          <!-- <span class="Tspan" style="background-color: #99c1de;" /> -->
          <p class="publis" @click="Quarantine()">轨迹异常<i class="el-icon-notebook-2" style="position: absolute;right: 40px;top: 50%;transform: translateY(-46.5%);font-size: 20px;" /></p>
          <div class="numbers">
            {{ trajectory }}<span style="font-size: 20px;font-family: 'KuHei';padding-left:5px;display: inline-block;vertical-align: top;color: rgb(180, 180, 180);">人</span>
          </div>
        </li>
      </ul>
    </div>
    <!-- 轨迹异常弹窗 -->
    <div id="popop">
      <div class="top" @mousedown.prevent="moveop($event)">
        <span>轨迹异常人员表</span>
        <span @click="closeP()"><i class="el-icon-close" /></span>
      </div>
      <div class="center">
        <ux-grid ref="plxTable" height="395" max-height="395" use-virtual show-body-overflow="title" :stripe="true" show-header-overflow="title">
          <!-- 索引 -->
          <ux-table-column type="index" width="80" align="center" />
          <!-- 编号 -->
          <ux-table-column field="编号" title="编号" width="110" align="center" />
          <!-- 姓名 -->
          <ux-table-column field="姓名" title="姓名" width="110" align="center" />
          <!-- 时间 -->
          <ux-table-column field="时间" title="时间" width="180" align="center" />
          <!-- 操作 -->
          <ux-table-column title="操作" width="118" align="center">
            <template v-slot="{ row }">
              <el-button @click="findT(row.编号)">查看轨迹</el-button>
            </template>
          </ux-table-column>
        </ux-grid>
      </div>
    </div>
    <!-- 地图 -->
    <div id="RMap" />
    <!-- 工具 -->
    <div id="functionBar">
      <!-- 时间 -->
      <div class="fTime">
        <i class="el-icon-d-arrow-left img" style="font-size:21px" @click="ReduceTime()" />
        <el-date-picker v-model="timx" type="date" placeholder="选择日期" :picker-options="pickerOptions" :editable="false" @change="STime()" />
        <i class="el-icon-d-arrow-right img" style="font-size:21px" @click="IncreaseTime()" />
      </div>
      <!-- 模式 -->
      <div class="pattern">
        <el-radio v-model="json.monitor" label="隔离" @change="pattern('全部')">隔离监测</el-radio>
        <el-radio v-model="json.monitor" label="全部" @change="pattern('隔离')">全部监测</el-radio>
      </div>
      <!-- 标题 -->
      <div class="title">手环监测</div>
      <!-- 帮助 -->
      <div class="help">
        <ul>
          <li @click="setUP()"><i class="el-icon-setting img" style="font-size:20px" /><span style="padding: 0 2px;font-size:15px;margin-left: 32px;"> 设置</span></li>
          <li @click="refresh()"><i class="el-icon-refresh img" style="font-size:22px" /><span style="padding: 0 2px;font-size:15px;margin-left: 32px;"> 刷新</span></li>
        </ul>
      </div>
    </div>
    <!-- 工具-设置 -->
    <div id="setup">
      <div class="top" @mousedown.prevent="moveos($event)">
        <span>≡</span>
        <span @click="closeS()"><i class="el-icon-close" /></span>
      </div>
      <div class="center">
        <ul>
          <li>
            <div class="neibu">
              <p class="NTop">体温设置</p>
              <div class="neirong">
                <p>上阈值：<span><el-input v-model="wendu.ga" placeholder="0" clearable /></span></p>
                <p>下阈值：<span><el-input v-model="wendu.di" placeholder="0" clearable /></span></p>
              </div>
            </div>
          </li>
          <li>
            <div class="neibu">
              <p class="NTop">心率设置</p>
              <div class="neirong">
                <p>上阈值：<span><el-input v-model="xinlv.ga" placeholder="0" clearable /></span></p>
                <p>下阈值：<span><el-input v-model="xinlv.di" placeholder="0" clearable /></span></p>
              </div>
            </div>
          </li>
          <li>
            <div class="neibu">
              <p class="NTop">高压设置</p>
              <div class="neirong">
                <p>上阈值：<span><el-input v-model="xueyg.ga" placeholder="0" clearable /></span></p>
                <p>下阈值：<span><el-input v-model="xueyg.di" placeholder="0" clearable /></span></p>
              </div>
            </div>
          </li>
          <li>
            <div class="neibu">
              <p class="NTop">低压设置</p>
              <div class="neirong">
                <p>上阈值：<span><el-input v-model="xueyd.ga" placeholder="0" clearable /></span></p>
                <p>下阈值：<span><el-input v-model="xueyd.di" placeholder="0" clearable /></span></p>
              </div>
            </div>
          </li>
          <li>
            <div class="neibu">
              <p class="NTop">时间间隔</p>
              <div class="neirong">
                <p><el-radio v-model="time" label="10">10分钟</el-radio></p>
                <p><el-radio v-model="time" label="60">60分钟</el-radio></p>
              </div>
            </div>
          </li>
          <li>
            <div class="neibu neibu2">
              <p @click="close()"><i class="el-icon-circle-close" />取消</p>
              <p @click="submit()"><i class="el-icon-circle-check" />保存</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 监测 -->
    <div id="monitor">
      <div id="monitors" style="height: 100%;width: 100%;z-index: 10;" />
    </div>
    <!-- 滚动 -->
    <rollIndex />
    <!-- 城市选择 -->
    <selectRegion />
    <!-- 路由 -->
    <router />
    <!-- 加载动画 -->
    <div id="bg">
      <div id="xuan">
        <span /><span /><span /><span />
      </div>
    </div>
  </div>
</template>
<script>
import Router from './components/router'
import SelectRegion from './components/selectRegion'
import RollIndex from './components/rollIndex'
import eventBus from './public/js/EvebtBus'
import * as echarts from 'echarts'
import mapboxgl from 'mapbox-gl'
import { Mapbox } from '@antv/l7-maps'
// import { Control } from '@antv/l7'
import { Scene, LineLayer, PointLayer, PolygonLayer } from '@antv/l7'

export default {
  name: 'Rmonitor',
  components: {
    Router,
    SelectRegion,
    RollIndex
  },
  data() {
    return {
      json: {
        name: '中国',
        where: 0,
        monitor: '隔离',
        type: '体温'
      },
      timx: '', // 今日时间
      pickerOptions: {
        disabledDate: time => {
          return time > new Date().getTime()
        }
      },
      canMove: false, // 移动
      // 阈值
      time: '10',
      storage: [], // 设置的缓存
      wendu: { ga: 37, di: 36 },
      xinlv: { ga: 90, di: 60 },
      xueyg: { ga: 140, di: 90 },
      xueyd: { ga: 90, di: 60 },
      temperatureS: 0, // 体温
      heartrateS: 0, // 心率
      highpressureS: 0, // 高压
      lowpressureS: 0, // 低压
      trajectory: 0, // 轨迹
      entry: [], // 轨迹异常列表
      Ptrajectory: [], // 个人轨迹
      myChart: null,
      // 地图
      map: null, // mapbox
      scene: null, // scene
      // 地图图层
      heatlayer: null, // 热力图
      pathAlllayer: null, // 轨迹图
      pointAllLayer: null, // 轨迹点图
      Rangelayer: null, // 隔离范围
      rangeLinelayer: null, // 隔离边框范围
      // 地图数据
      mapData: {
        temperature: [], // 体温
        heartrate: [], // 心率
        highpressure: [], // 高压
        lowpressure: [] // 低压
      },
      pathAll: [] // 路径
    }
  },
  beforeDestroy() {
    eventBus.$off('json')
  },
  mounted() {
    var that = this
    // 接收城市数据
    eventBus.$on('json', json => {
      that.json.name = json.name
      that.json.where = json.where
      that.getJson()
      // 地图定位
      that.getbianJson(1)
    })
    // 地图
    this.int()
    // 今日时间
    that.timx = that.checkTime2(new Date())
    // 切换时间是否展示
    if ((new Date((new Date(this.timx)).getTime() + 24 * 60 * 60 * 1000)) < (new Date()).getTime()) {
      document.querySelectorAll('.fTime .img')[1].style.zIndex = 0
      document.querySelectorAll('.fTime .img')[1].style.opacity = 1
    } else {
      document.querySelectorAll('.fTime .img')[1].style.zIndex = -10
      document.querySelectorAll('.fTime .img')[1].style.opacity = 0
    }
    // 切换类型
    var publis = document.querySelectorAll('.publis')
    for (var i = 0; i < 4; i++) {
      publis[i].setAttribute('index', i)
      publis[i].addEventListener('click', function() {
        for (var j = 0; j < 4; j++) {
          publis[j].classList.remove('xunt')
        }
        that.index = this.getAttribute('index') * 1
        this.className = this.className + ' ' + 'xunt'
      })
    }
  },
  methods: {
    // 地图
    int() {
      var that = this
      mapboxgl.accessToken = 'pk.eyJ1Ijoid3VqaW5odWkwIiwiYSI6ImNrdDFoZWphNDBhaGszMXBoazZ1dWdwMWkifQ.AX5nvyCpK8yKsCqyz36rsw' // 你的accessToken
      this.map = new mapboxgl.Map({
        container: 'RMap', // 地图容器的id
        center: [107.01292828127248, 34.12077517311424], // 中心点
        zoom: 4, // 地图初始化时的层级
        maxZoom: 22,
        pitch: 45,
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
      that.map.on('click', function(e) {
        // var s = JSON.parse(JSON.stringify(e.lngLat))
        // console.log(that.map)
      })
      that.map.on('load', function() {
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
            // Update this image's data with data from the canvas.
            this.data = context.getImageData(0, 0, this.width, this.height).data
            that.map.triggerRepaint()
            return true
          }
        }
        that.map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 }) // 动态点
        that.getbianJson(0)
      })
      this.scene = new Scene({
        id: 'RMap',
        map: new Mapbox({
          mapInstance: that.map
        })
      })
      that.scene.addImage(
        'star',
        '/img/star.png'
      )
      that.scene.addImage(
        'end',
        '/img/end.png'
      )
      that.scene.addImage(
        'after',
        '/img/midline.png'
      )
      that.scene.addImage(
        'mi',
        '/img/mi.png'
      )
    },
    // 热力聚合
    addMapLayer() {
      var that = this
      var data = []
      if (this.json.type === '体温') {
        data = that.mapData.temperature
      } else if (this.json.type === '心率') {
        data = that.mapData.heartrate
      } else if (this.json.type === '高压') {
        data = that.mapData.highpressure
      } else if (this.json.type === '低压') {
        data = that.mapData.lowpressure
      }
      that.pointFeature = []
      for (let index = 0; index < data.length; index++) {
        const element = data[index]
        that.pointFeature.push({
          'type': 'Feature',
          'properties': { name: element.姓名, tel: element.体温, 心率: element.心率, 高压: element.高压, 低压: element.低压, time: element.时间,
            'description': '<p class="wenben">姓名：' + element.姓名 + '</p><p class="wenben">时间：' + element.时间 +
            '<p class="laiyuan">体温：' + element.体温 + '℃</p><p class="laiyuan">心率：' + element.心率 + '次</p><p class="laiyuan">血压：' + element.高压 + '-' + element.低压 + 'mmHg</p>'
          },
          'geometry': {
            'type': 'Point',
            'coordinates': [element.经度, element.纬度]
          }
        })
      }
      that.busWayStation = {
        'type': 'FeatureCollection',
        'crs': { 'type': 'name', 'properties': { 'name': 'urn:ogc:def:crs:OGC:1.3:CRS84' }}, 'features': that.pointFeature
      }

      var isExistence = false
      var layers = that.map.getStyle().layers
      for (let index = 0; index < layers.length; index++) {
        const element = layers[index].id
        if (element === 'earthquakes-heat') {
          isExistence = true
        }
      }
      document.getElementById('bg').style.display = 'none'
      if (isExistence === false) {
      // 聚合数据
      // 加载聚合数据
        that.map.addSource('clusterspoint', {
          type: 'geojson',
          data: that.busWayStation,
          cluster: true,
          clusterMaxZoom: 15, // 最大缩放到聚集点
          clusterRadius: 50 // 聚类点时每个簇的半径(默认为 50)
        })
        // 热力数据
        that.map.addSource('earthquakes', {
          'type': 'geojson',
          'data': that.busWayStation
        })
        // 热力图
        that.map.addLayer({
          'id': 'earthquakes-heat',
          'type': 'heatmap',
          'source': 'earthquakes',
          // 'maxzoom': 16,
          'paint': {
            'heatmap-weight': [
              'interpolate',
              ['linear'],
              ['get', 'tel'],
              0, 0,
              100, 1
            ],
            'heatmap-intensity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0, 1,
              9, 1.1,
              10, 1.2,
              11, 1.5,
              12, 2,
              13, 2.5
            ],
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0, 'rgba(33,102,172,0)',
              0.2, 'rgb(103,169,207)',
              0.4, 'rgb(209,229,240)',
              0.7, 'rgb(253,219,199)',
              0.9, 'rgb(239,138,98)',
              1, 'rgb(178,24,43)'
            ],
            // Adjust the heatmap radius by zoom level
            'heatmap-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0, 2,
              9, 10,
              10, 12,
              11, 14,
              12, 16,
              13, 18,
              14, 20
            ],
            // Transition from heatmap to circle layer by zoom level
            'heatmap-opacity': 0.8
          }
        })
        // 聚合的圆圈
        that.map.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'clusterspoint',
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
            ],
            'circle-opacity': 0.95
          }
        })
        // 聚合的文字
        that.map.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'clusterspoint',
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
          source: 'clusterspoint',
          filter: ['!', ['has', 'point_count']],
          'layout': {
            'icon-image': 'pulsing-dot'
          }
        })
        that.map.on('click', 'unclustered-point', function(e) {
          var coordinates = e.features[0].geometry.coordinates.slice()
          var description = e.features[0].properties.description
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
          }
          // eslint-disable-next-line no-unused-vars
          var popup = new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(that.map)
        })
      } else {
        that.map.getSource('earthquakes').setData(that.busWayStation)
        that.map.getSource('clusterspoint').setData(that.busWayStation)
        if (that.pathAlllayer !== null) {
          that.pathAlllayer.hide()
          that.pointAllLayer.hide()
          that.Rangelayer.hide()
          that.rangeLinelayer.hide()
        }
        that.map.setLayoutProperty('unclustered-point', 'visibility', 'visible')
        that.map.setLayoutProperty('cluster-count', 'visibility', 'visible')
        that.map.setLayoutProperty('clusters', 'visibility', 'visible')
        that.map.setLayoutProperty('earthquakes-heat', 'visibility', 'visible')
      }
    },
    // 轨迹
    addLine(data) {
      var that = this
      var pointAll = []
      const fanwei = JSON.parse(data[0].范围)
      fanwei.push(fanwei[0])
      fanwei.push(fanwei[1])
      var Range = []
      for (let j = 0; j < fanwei.length; j++) {
        const lng = fanwei[j]
        const lat = fanwei[j + 1]
        Range.push([lng, lat])
        j++
      }
      // const a = Range[2]
      // Range[2] = Range[3]
      // Range[3] = a
      var Rangedata = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: [
                Range
              ]
            }
          }
        ]
      }
      if (that.Rangelayer === null) {
        that.Rangelayer = new PolygonLayer({})
          .source(Rangedata)
          .color('rgb(12,44,132)')
          .shape('fill')
          .style({
            opacity: 0.8
          })
        that.rangeLinelayer = new LineLayer({
          zIndex: 2
        })
          .source(Rangedata)
          .color('#fff')
          .active(true)
          .size(1)
          .style({
            lineType: 'dash',
            dashArray: [2, 2],
            opacity: 1
          })
        that.scene.addLayer(that.Rangelayer)
        that.scene.addLayer(that.rangeLinelayer)
      } else {
        that.Rangelayer.show()
        that.rangeLinelayer.show()
        that.rangeLinelayer.setData(Rangedata)
        that.Rangelayer.setData(Rangedata)
      }
      pointAll.push({ x: data[0].经度, y: data[0].纬度, icon: 'star', id: data[0].编号, time: data[0].时间 })
      that.map.setLayoutProperty('unclustered-point', 'visibility', 'none')
      that.map.setLayoutProperty('cluster-count', 'visibility', 'none')
      that.map.setLayoutProperty('clusters', 'visibility', 'none')
      that.map.setLayoutProperty('earthquakes-heat', 'visibility', 'none')
      var waypoints = ''
      that.pathAll = []
      for (let x = 1; x < data.length - 1; x++) {
        const element2 = data[x]
        pointAll.push({ x: element2.经度, y: element2.纬度, icon: 'after', id: element2.编号, time: element2.时间 })
        if (x > 1) {
          waypoints += ';' + element2.经度 + ',' + element2.纬度
        } else {
          waypoints += element2.经度 + ',' + element2.纬度
        }
      }
      if (data.length > 1) {
        pointAll.push({ x: data[data.length - 1].经度, y: data[data.length - 1].纬度, icon: 'end', id: data[data.length - 1].编号, time: data[data.length - 1].时间 })
      }
      fetch(
        'https://restapi.amap.com/v3/direction/driving?origin=' + data[0].经度 + ',' + data[0].纬度 + '&waypoints=' + waypoints + '&destination=' + data[data.length - 1].经度 + ',' + data[data.length - 1].纬度 + '&output=JSON&key=49b3d756d1c570298d8b75eedf308f88'
      )
        .then(res => res.json())
        .then(datas => {
          var path = ''
          if (datas.status === '1') {
            for (let index = 0; index < datas.route.paths[0].steps.length; index++) {
              const element = datas.route.paths[0].steps[index]
              if (index !== datas.route.paths[0].steps.length - 1) {
                path += element.polyline + ';'
              } else {
                path += element.polyline
              }
            }
          }
          // 以;分数组将数组中在以,划分将内容转为数值
          var point = path.split(';').map(s => s.split(',').map(e => e * 1))
          that.pathAll.push({ information: data[0], path: point })
          if (data.length > 2) {
            if (that.pathAlllayer === null) {
              that.pathAlllayer = new LineLayer({
                zIndex: 5,
                autoFit: true })
                .source(that.pathAll, {
                  parser: {
                    type: 'json',
                    coordinates: 'path'
                  }
                })
                .size(1.5)
                .shape('line')
                .color('#E3170D')
                .animate({
                  interval: 0.6,
                  trailLength: 1.5,
                  duration: 6
                })
              this.pathAlllayer.zIndex = -100
              that.scene.addLayer(that.pathAlllayer)
            } else {
              that.pathAlllayer.show()
              this.pathAlllayer.zIndex = -100
              that.pathAlllayer.setData(that.pathAll)
            }
            // 标记点
            if (that.pointAllLayer === null) {
              this.pointAllLayer = new PointLayer({ autoFit: true })
                .source(pointAll, {
                  parser: {
                    type: 'json',
                    x: 'x',
                    y: 'y'
                  }
                })
                .shape('icon', ['star', 'after', 'end', 'mi'])
                .size(20)
                .style({
                })
              this.pointAllLayer.zIndex = 1
              that.scene.addLayer(that.pointAllLayer)
            } else {
              that.pointAllLayer.show()
              this.pointAllLayer.zIndex = 1
              that.pointAllLayer.setData(pointAll)
            }
          }
        })
    },
    getbianJson(e) {
      var that = this
      that.$store.dispatch('ndatapanel/QJson', that.json.name).then((dataz) => {
        that.boundary = dataz
        // 数据
        if (e === 0) {
          that.bian(dataz, 0)
        } else if (e === 1) {
          that.bian(that.boundary, 1) // 清除原始边界
        }
      })
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
            })
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
          // console.log(china_con)
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
          })
          that.length = 1
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
      // console.log(that.length)
    },
    // 播报传值
    Byval() {
      var that = this
      var data = {}
      data.where = that.json.where
      data.name = that.json.name
      data.monitor = that.json.monitor
      data.timx = that.timx
      data.wendu = that.wendu
      data.xinlv = that.xinlv
      data.xueyg = that.xueyg
      data.xueyd = that.xueyd
      eventBus.$emit('data', data)
    },
    // 请求数据
    getJson() {
      var that = this
      if (that.json.name === '') {
        this.$message({
          message: '请选择城市！',
          type: 'warning',
          showClose: true
        })
      } else {
        if (that.json.name === '中国') {
          document.getElementById('bg').style.display = 'none'
        }
        // 传值
        that.Byval()
        // 值
        var data = {}
        data.where = that.json.where
        data.name = that.json.name
        data.monitor = that.json.monitor
        data.type = that.json.type
        data.timx = that.checkTime3(new Date((new Date(that.timx)).getTime() + 24 * 60 * 60 * 1000))
        data.timz = that.checkTime3(new Date(that.timx))
        data.wenduga = that.wendu.ga
        data.wendudi = that.wendu.di
        data.xinlvga = that.xinlv.ga
        data.xinlvdi = that.xinlv.di
        data.xueygga = that.xueyg.ga
        data.xueygdi = that.xueyg.di
        data.xueydga = that.xueyd.ga
        data.xueyddi = that.xueyd.di
        document.getElementById('bg').style.display = 'block'
        that.temperatureS = 0
        that.heartrateS = 0
        that.highpressureS = 0
        that.lowpressureS = 0
        that.trajectory = 0
        that.entry = []
        that.$store.dispatch('ncity/QPCondition', data).then((datas) => {
          that.$store.dispatch('ncity/QHCondition', data).then((dataz) => {
            that.mapData.temperature = []
            that.mapData.lowpressure = []
            that.mapData.highpressure = []
            that.mapData.heartrate = []
            // 展示数据
            for (let i = 0; i < datas.length; i++) {
              datas[i].时间 = that.checkTime4(new Date(datas[i].时间))
              // 其它异常人数
              if (datas[i].体温 > that.wendu.ga || datas[i].体温 < that.wendu.di) {
                that.temperatureS++
                that.mapData.temperature.push(datas[i])
              }
              if (datas[i].心率 > that.xinlv.ga || datas[i].心率 < that.xinlv.di) {
                that.heartrateS++
                that.mapData.heartrate.push(datas[i])
              }
              if (datas[i].高压 > that.xueyg.ga || datas[i].高压 < that.xueyg.di) {
                that.highpressureS++
                that.mapData.highpressure.push(datas[i])
              }
              if (datas[i].低压 > that.xueyd.ga || datas[i].低压 < that.xueyd.di) {
                that.lowpressureS++
                that.mapData.lowpressure.push(datas[i])
              }
              // 轨迹异常人数
              if (that.json.monitor === '隔离') {
                that.ContainsPoint(JSON.parse(datas[i].范围), datas[i].经度, datas[i].纬度, datas[i])
              }
            }
            // 异常人员表
            that.entry.sort(function(a, b) {
              return (new Date(a.时间)).getTime() - (new Date(b.时间)).getTime()
            })
            that.$refs.plxTable.reloadData(that.entry)
            // 处理数据
            that.temperatureS = that.format(that.temperatureS)
            that.highpressureS = that.format(that.highpressureS)
            that.lowpressureS = that.format(that.lowpressureS)
            that.heartrateS = that.format(that.heartrateS)
            if (that.json.monitor === '隔离') {
              that.lowpressureS = that.format(that.lowpressureS)
            }
            // 类型数据
            dataz.sort(function(a, b) {
              return a.时间 - b.时间
            })
            var time = that.checkTime3(new Date(that.timx)) // 起始时间
            var Times = [] // 时间集
            var BoxWr = [] // 盒须图
            var Guodu = [] // 过渡值
            var ZheXi = [] // 折线图-平均值
            var quency = Math.ceil((((new Date(time)).getTime() + 24 * 60 * 60 * 1000) - (new Date(time)).getTime()) / (that.time * 1 * 60 * 1000))
            // 时间列表
            for (let i = 0; i <= quency; i++) {
              Times.push(time)
              time = that.checkTime4(new Date((new Date(time)).getTime() + that.time * 1 * 60 * 1000))
            }
            // 空数据集
            for (let i = 0; i < Times.length - 1; i++) {
              const add = []
              BoxWr.push(add)
              Guodu.push(add)
            }
            // 初步处理数据
            for (let i = 0; i < Times.length - 1; i++) {
              for (let j = 0; j < dataz.length; j++) {
                if ((new Date(dataz[j].时间)).getTime() >= (new Date(Times[i])).getTime() && (new Date(dataz[j].时间)).getTime() <= (new Date(Times[i + 1])).getTime()) {
                  Guodu[i].push(dataz[j].value * 1) // 值
                }
              }
            }
            // 进阶处理数据
            for (let i = 0; i < Guodu.length; i++) {
              var gong = []
              // 判断长度是否为0
              if (Guodu[i].length > 0) {
                Guodu[i].sort(function(a, b) {
                  return a - b
                })
                var ping = 0
                for (let j = 0; j < Guodu[i].length; j++) {
                  ping = ping + Guodu[i][j]
                }
                if (that.json.type === '体温') {
                  gong[0] = Guodu[i][0]
                  gong[1] = that.wendu.di
                  gong[2] = (ping / Guodu[i].length).toFixed(1) * 1
                  gong[3] = that.wendu.ga
                  gong[4] = Guodu[i][Guodu[i].length - 1]
                } else if (that.json.type === '心率') {
                  gong[0] = Guodu[i][0]
                  gong[1] = that.xinlv.di
                  gong[2] = (ping / Guodu[i].length).toFixed(1) * 1
                  gong[3] = that.xinlv.ga
                  gong[4] = Guodu[i][Guodu[i].length - 1]
                } else if (that.json.type === '高压') {
                  gong[0] = Guodu[i][0]
                  gong[1] = that.xueyg.di
                  gong[2] = (ping / Guodu[i].length).toFixed(1) * 1
                  gong[3] = that.xueyg.ga
                  gong[4] = Guodu[i][Guodu[i].length - 1]
                } else if (that.json.type === '低压') {
                  gong[0] = Guodu[i][0]
                  gong[1] = that.xueyd.di
                  gong[2] = (ping / Guodu[i].length).toFixed(1) * 1
                  gong[3] = that.xueyd.ga
                  gong[4] = Guodu[i][Guodu[i].length - 1]
                }
              } else {
                if (that.json.type === '体温') {
                  gong[0] = that.wendu.di
                  gong[1] = that.wendu.di
                  gong[2] = (that.wendu.di + that.wendu.ga) / 2
                  gong[3] = that.wendu.ga
                  gong[4] = that.wendu.ga
                } else if (that.json.type === '心率') {
                  gong[0] = that.xinlv.di
                  gong[1] = that.xinlv.di
                  gong[2] = (that.xinlv.di + that.xinlv.ga) / 2
                  gong[3] = that.xinlv.ga
                  gong[4] = that.xinlv.ga
                } else if (that.json.type === '高压') {
                  gong[0] = that.xueyg.di
                  gong[1] = that.xueyg.di
                  gong[2] = (that.xueyg.di + that.xueyg.ga) / 2
                  gong[3] = that.xueyg.ga
                  gong[4] = that.xueyg.ga
                } else if (that.json.type === '低压') {
                  gong[0] = that.xueyd.di
                  gong[1] = that.xueyd.di
                  gong[2] = (that.xueyd.di + that.xueyd.ga) / 2
                  gong[3] = that.xueyd.ga
                  gong[4] = that.xueyd.ga
                }
              }

              // gong.sort(function(a, b) {
              //   return a - b
              // })
              ZheXi.push(gong[2])
              BoxWr[i] = gong
            }
            that.CAdestroy()
            that.initCharts(Times, BoxWr, ZheXi)
            that.addMapLayer()
          })
        })
      }
    },
    // 切换监测类型
    qie(e) {
      this.json.type = e
      this.getJson()
    },
    // 切换模式
    pattern(e) {
      var that = this
      if (that.json.name === '') {
        that.json.monitor = e
      }
      this.getJson()
    },
    // 打开轨迹异常表
    Quarantine() {
      document.getElementById('popop').style.display = 'block'
    },
    // 查看轨迹
    findT(id) {
      var that = this
      that.Ptrajectory = []
      var date = {}
      date.where = this.json.where
      date.name = this.json.name
      date.timx = this.checkTime3(new Date((new Date(that.timx)).getTime() + 24 * 60 * 60 * 1000))
      date.timz = this.checkTime3(new Date(that.timx))
      date.id = id
      that.$store.dispatch('ncity/QTrajectory', date).then((datas) => {
        datas.sort(function(a, b) {
          return a.时间 - b.时间
        })
        for (let i = 0; i < datas.length; i++) {
          datas[i].时间 = that.checkTime2(new Date(datas[i].时间))
        }
        that.Ptrajectory = datas
        this.addLine(datas)
      })
    },
    // 关闭轨迹异常表
    closeP() {
      document.getElementById('popop').style.display = 'none'
    },
    // 刷新
    refresh() {
      this.getJson()
    },
    // 打开设置
    setUP() {
      document.getElementById('setup').style.display = 'block'
      this.storage[0] = this.wendu
      this.storage[1] = this.xinlv
      this.storage[2] = this.xueyg
      this.storage[3] = this.xueyd
    },
    // 保存设置
    submit() {
      document.getElementById('setup').style.display = 'none'
      this.getJson()
    },
    // 关闭设置
    closeS() {
      document.getElementById('setup').style.display = 'none'
      this.$message({
        message: '设置未保存！',
        type: 'warning',
        showClose: true
      })
      this.wendu = this.storage[0]
      this.xinlv = this.storage[1]
      this.xueyg = this.storage[2]
      this.xueyd = this.storage[3]
    },
    // 图表
    initCharts(Times, BoxWr, ZheXi) {
      var that = this
      that.myChart = echarts.init(document.getElementById('monitors'))
      const option = {
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '45',
          right: '25',
          top: '15',
          bottom: '50'
        },
        xAxis: {
          type: 'category',
          data: Times,
          axisLabel: {
            color: 'rgba(201, 201, 201)',
            textStyle: {
              fontSize: '13'
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#333333'
            }
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          scale: true,
          axisLabel: {
            color: 'rgba(201, 201, 201)',
            formatter: function(value, index) {
              return value.toFixed(1)
            }
          },
          splitLine: {
            show: false
          }
        },
        dataZoom: [
          {
            type: 'slider',
            show: true,
            height: 20,
            start: 0,
            end: 20,
            bottom: '5%',
            xAxisIndex: 0,
            showDetail: false
          },
          {
            type: 'inside',
            show: true,
            start: 0,
            end: 100,
            yAxisIndex: 0,
            showDetail: false
          }
        ],
        series: [
          {
            name: 'boxplot',
            type: 'boxplot',
            data: BoxWr,
            itemStyle: {
              normal: {
                borderColor: '#ff7979',
                borderWidth: 2,
                color: '#D9EAFF'
              }
            },
            tooltip: {
              formatter: function(param) {
                return [
                  '最大值: ' + param.data[5],
                  '上阈值: ' + param.data[4],
                  '平均数: ' + param.data[3],
                  '下阈值: ' + param.data[2],
                  '最小值: ' + param.data[1]
                ].join('<br/>')
              }
            }
          },
          {
            name: '平均数',
            type: 'line',
            data: ZheXi,
            symbolSize: 0,
            lineStyle: {
              color: 'rgba(201, 201, 201)',
              width: 1
            },
            z: 10
          }
        ]
      }
      window.addEventListener('resize', function() {
        var chart = echarts.init(document.getElementById('monitors'))
        if (chart) {
          chart.resize() // 不报错
        }
      })
      that.myChart.setOption(option)
      // 点击事件
      that.myChart.on('click', function(params) {
      })
    },
    // 创建与销毁盒子
    CAdestroy() {
      if (this.myChart !== null) {
        this.myChart.clear()
        this.myChart.dispose()
      }
    },
    // 判断点是否在范围内 polygon---组成多边形的点 [x1, y1, x2, y2, x3, y3, ...]
    // pointX: 目标点x pointY：目标点y
    ContainsPoint(polygon, pointX, pointY, data) {
      var that = this
      const n = polygon.length >> 1
      let ax, lup
      let ay = polygon[2 * n - 3] - pointY
      let bx = polygon[2 * n - 2] - pointX
      let by = polygon[2 * n - 1] - pointY
      if (bx === 0 && by === 0) return false // point on edge
      // let lup = by > ay;
      for (let ii = 0; ii < n; ii++) {
        ax = bx
        ay = by
        bx = polygon[2 * ii] - pointX
        by = polygon[2 * ii + 1] - pointY
        if (bx === 0 && by === 0) return false // point on edge
        if (ay === by) continue
        lup = by > ay
      }
      let depth = 0
      for (let i = 0; i < n; i++) {
        ax = bx
        ay = by
        bx = polygon[2 * i] - pointX
        by = polygon[2 * i + 1] - pointY
        if (ay < 0 && by < 0) continue // both 'up' or both 'down'
        if (ay > 0 && by > 0) continue // both 'up' or both 'down'
        if (ax < 0 && bx < 0) continue // both points on the left
        if (ay === by && Math.min(ax, bx) < 0) return true
        if (ay === by) continue
        const lx = ax + ((bx - ax) * -ay) / (by - ay)
        if (lx === 0) return false // point on edge
        if (lx > 0) depth++
        if (ay === 0 && lup && by > ay) depth-- // hit vertex, both up
        if (ay === 0 && !lup && by < ay) depth-- // hit vertex, both down
        lup = by > ay
      }
      if (depth & 1) {
        that.trajectory++
        // 将异常值加入列表
        data.时间 = that.checkTime4(new Date(data.时间))
        that.entry.push(data)
      }
    },
    // 众数
    Mode(nums) {
      var arr = {}; var val; var max_val = 0; var max_key = 0
      for (var i = 0; i < nums.length; i++) {
        val = nums[i]
        if (arr[val]) {
          arr[val] = arr[val] + 1
        } else {
          arr[val] = 1
        }
      }
      // eslint-disable-next-line no-redeclare
      for (var i in arr) {
        if (arr[i] > max_val) {
          max_val = arr[i]
          max_key = i
        }
      }
      return parseInt(max_key)
    },
    // 移动
    moveop(event) {
      var that = this
      const popop = document.getElementById('popop')
      const x = event.pageX - popop.offsetLeft
      const y = event.pageY - popop.offsetTop
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
          if (left < 340) left = popop.offsetWidth / 2 + 40
          if (top < 220) top = popop.offsetHeight / 2
          var maxLeft = window.innerWidth - popop.offsetWidth / 2 - 305
          var maxTop = window.innerHeight / 2 + popop.offsetHeight
          if (left > maxLeft) left = maxLeft
          if (top > maxTop) top = maxTop
          popop.style.left = left + 'px'
          popop.style.top = top + 'px'
        }
      }
    },
    moveos(event) {
      var that = this
      const setup = document.getElementById('setup')
      const x = event.pageX - setup.offsetLeft
      const y = event.pageY - setup.offsetTop
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
          if (left < 310) left = setup.offsetWidth / 2 + 40
          if (top < 220) top = setup.offsetHeight / 2
          var maxLeft = window.innerWidth - setup.offsetWidth / 2 - 305
          var maxTop = window.innerHeight / 2 + setup.offsetHeight
          if (left > maxLeft) left = maxLeft
          if (top > maxTop) top = maxTop
          setup.style.left = left + 'px'
          setup.style.top = top + 'px'
        }
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
        // 请求数据
        this.getJson()
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
        // 请求数据
        this.getJson()
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
        // 请求数据
        this.getJson()
      }
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
      return i.getFullYear() + '-' + that.checkTime(i.getMonth() + 1) + '-' + that.checkTime(i.getDate()) + ' ' + '00' + ':' + '00'
    },
    // 时间处理4
    checkTime4(i) {
      var that = this
      return i.getFullYear() + '-' + that.checkTime(i.getMonth() + 1) + '-' + that.checkTime(i.getDate()) + ' ' + that.checkTime(i.getHours()) + ':' + that.checkTime(i.getMinutes()) + ':' + that.checkTime(i.getSeconds())
    },
    // 数字处理
    format(number) {
      var str = parseInt(number).toString()
      var len = str.length
      if (len <= 3) { return str }
      var r = len % 3
      return r > 0 ? str.slice(0, r) + ',' + str.slice(r, len).match(/\d{3}/g).join(',') : str.slice(r, len).match(/\d{3}/g).join(',')
    }
  }
}
</script>
<style scoped>
@font-face {
  src: url("./public/font/KuHei.ttf");
  font-family: "KuHei";
}
#rmonitor {
  position: absolute;
  height: 100%;
  width: 100%;
  background: url("./public/img/back.png") no-repeat center center;
  /* 背景图不平铺 */
  background-size: cover;
  /* 让背景图基于容器大小伸缩 */
  background-attachment: fixed;
  /* 当内容高度大于图片高度时，背景图像的位置相对于viewport固定 */
  background-color: #CCCCCC;
}
/* 屏蔽logo */
#rmonitor >>> .l7-ctrl-logo {
  display: none;
}
#rmonitor #RMap{
  position: absolute;
  height: 100%;
  width: 100%;
}
#rmonitor ul,
#rmonitor p {
  padding: 0;
  margin: 0;
  list-style-type: none;
}
/* 种类 */
#rmonitor #type {
  position: absolute;
  left: 45px;
  top: 5px;
  color: rgb(180, 180, 180);
  width: 200px;
  height: 480px;
  text-align: center;
  z-index: 10;
}
#rmonitor #type li {
  /* background-color: rgba(79, 133, 177, 0.3); */
  background-image: url("./public/img/ba.png");
  background-size: 100% 100%;
  height: 90px;
  margin: 5px 0;
  position: relative;
}
#rmonitor #type li .Tspan {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 10px;
}
#rmonitor #type li .publis {
  position: absolute;
  width: 100%;
  top: 10px;
  margin: 0;
  padding: 0;
  height: 25px;
  line-height: 25px;
  letter-spacing: 2px;
  font-family: KuHei;
  cursor: pointer;
  transition: all 1s;
  font-size: 15px;
}
#rmonitor #type li .publis:hover {
  color: rgb(230, 230, 230);
}
#rmonitor #type li .xunt {
  position: relative;
  color: rgb(230, 230, 230);
}
#rmonitor #type li .xunt::before {
  position: absolute;
  content: '▶';
  width: 20px;
  height: 20px;
  color: #ff7979;
  left: 15%;
  top: 0;
  animation: fade-in2 1s linear infinite; /* 调用动画 */
}
#rmonitor #type li .xunt::after {
  position: absolute;
  content: '◀';
  width: 20px;
  height: 20px;
  color: #ff7979;
  right: 15%;
  top: 0;
  animation: fade-in1 1s linear infinite; /* 调用动画 */
}
@keyframes fade-in1 {
  0% {
    right: 8%;
  }
  50% {
    right: 15%;
  }
  100% {
    right: 8%;
  }
}
@keyframes fade-in2 {
  0% {
    left: 8%;
  }
  50% {
    left: 15%;
  }
  100% {
    left: 8%;
  }
}
#rmonitor #type li .numbers {
  position: absolute;
  top: 35px;
  height: 55px;
  line-height: 55px;
  width: 100%;
  font-family: DIGIT;
  font-size: 28px;
  color: #fff;
}
/* 轨迹异常弹窗 */
#rmonitor #popop {
  display: none;
  position: absolute;
  width: 600px;
  height: 430px;
  border-radius: 3px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid #0fafeb;
  background-color: rgb(21 62 109);
  z-index: 11;
}
#rmonitor #popop .top {
  height: 35px;
  line-height: 35px;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: KuHei;
  font-size: 15px;
  border-bottom: 2px solid rgb(148, 150, 153);
  letter-spacing: 2px;
  position: relative;
  cursor: move;
}
#rmonitor #popop .top span:nth-child(2) {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(calc(-50% + 3px));
}
#rmonitor #popop .top span:nth-child(2) >>> i {
  transform: 2s;
  font-size: 20px;
  transition: all 1.5s;
  color: rgba(255, 255, 255, 0.65);
  cursor: pointer !important;
}
#rmonitor #popop .top span:nth-child(2) >>> i:hover {
  color: rgba(255, 255, 255, 1);
  transform: rotate(360deg);
}
#rmonitor #popop .center {
  width: 100%;
  height: 395px;
}
#rmonitor #popop .center >>> .elx-table {
  color: rgb(200, 200, 200);
  font-family: KuHei;
  height: 395px;
  overflow: hidden;
}
#rmonitor #popop .center >>> .elx-table.border--default .elx-table--header-wrapper,
#rmonitor #popop .center >>> .elx-table.border--full .elx-table--header-wrapper,
#rmonitor #popop .center >>> .elx-table.border--outer .elx-table--header-wrapper,
#rmonitor #popop .center >>> .elx-table .elx-table--body-wrapper,
#rmonitor #popop .center >>> .elx-table .elx-table--footer-wrapper {
  background-color: #ff000000;
}
#rmonitor #popop .center >>> .elx-table .elx-body--row.row--checked,
#rmonitor #popop .center >>> .elx-table .elx-body--row.row--current,
#rmonitor #popop .center >>> .elx-table .elx-body--row.row--radio {
  background-color: rgba(40, 43, 57, 0.4) !important;
}
#rmonitor #popop .center >>> .row--hover {
  background-color: rgb(35, 35, 35, 0.6) !important;
}
/* 单数行 */
#rmonitor #popop .center >>> .row--stripe {
  background-color: rgba(65, 70, 92, 0.4);
}
/* 框 */
#rmonitor #popop .center >>> .elx-table .elx-table--border-line {
  border: none;
}
#rmonitor #popop .center >>> .elx-table .elx-table--header-wrapper .elx-table--header-border-line {
  border: none;
}
#rmonitor #popop .center >>> .elx-table.border--full .elx-body--column,
#rmonitor #popop .center >>> .elx-table.border--full .elx-footer--column,
#rmonitor #popop .center >>> .elx-table.border--full .elx-header--column {
  background: rgba(255, 255, 255, 0);
}
#rmonitor #popop .center >>> .elx-table.border--default .elx-table--header-wrapper,
#rmonitor #popop .center >>> .elx-table.border--full .elx-table--header-wrapper,
#rmonitor #popop .center >>> .elx-table.border--outer .elx-table--header-wrapper {
  border-bottom: 2px solid rgb(148, 150, 153) !important;
}
#rmonitor #popop .center >>> .el-button {
  border: none;
  background-color: #ff000000;
  color: rgba(200, 200, 200, 0.75);
  font-family: KuHei;
  transition: all 0.5s;
}
#rmonitor #popop .center >>> .el-button:hover {
  color: #fff;
}
/* 工具 */
#rmonitor #functionBar {
  position: absolute;
  width: calc((100% - 20%) - 42px);
  left: 42px;
  bottom: calc(20% + 7.5px);
  height: 45px;
  line-height: 45px;
  font-family: KuHei;
  border: 1px solid #0fafeb;
  /* background: url("./public/img/bg.png") rgba(255, 255, 255, 0.1); */
  background: url("./public/img/bg.png") rgba(79, 133, 177, 0.3);
}
#rmonitor #functionBar .fTime {
  position: absolute;
  width: 250px;
  height: 45px;
  line-height: 45px;
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
  position: relative;
}
#rmonitor #functionBar .fTime::after {
  content: '';
  right: 0;
  top: -1px;
  height: 100%;
  width: 2px;
  background-color: rgba(219, 219, 219, 0.555);
  position: absolute;
}
#rmonitor #functionBar .fTime >>> .el-input__prefix,
#rmonitor #functionBar .fTime >>> .el-input__suffix {
  display: none;
}
#rmonitor #functionBar .fTime >>> .el-input__inner {
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
#rmonitor #functionBar .fTime >>> .el-date-editor.el-input,
#rmonitor #functionBar .fTime >>> .el-date-editor.el-input__inner {
  width: 140px;
}
#rmonitor #functionBar .fTime .img {
  margin: 0 15px;
  height: 45px;
  line-height: 45px;
  cursor: pointer;
  color: rgb(199, 199, 199);
  transition: all 0.5s;
}
#rmonitor #functionBar .fTime .img:hover {
  color: #fff;
}
#rmonitor #functionBar .pattern {
  position: absolute;
  left: 250px;
  top: 0;
  width: 200px;
  height: 45px;
  line-height: 45px;
  text-align: center;
  justify-content: space-around;
  align-items: center;
  display: flex;
}
#rmonitor #functionBar .pattern::after {
  content: '';
  right: 0;
  top: -1px;
  height: 100%;
  width: 2px;
  background-color: rgba(219, 219, 219, 0.555);
  position: absolute;
}
#rmonitor #functionBar .pattern >>> .el-radio {
  margin: 0;
  padding: 0;
  color: #fff;
}
#rmonitor #functionBar .pattern >>> .el-radio__input.is-checked+.el-radio__label {
  color: #ff7979;
}
#rmonitor #functionBar .pattern >>> .el-radio__input.is-checked .el-radio__inner {
  border-color: #ff7979;
  background: #ff7979;
}
#rmonitor #functionBar .title {
  position: absolute;
  height: 45px;
  line-height: 45px;
  width: calc(100% - 600px);
  left: 450px;
  top: 0;
  text-align: center;
  font-family: KuHei;
  color: #fff;
  font-size: 18px;
  letter-spacing: 5px;
}
#rmonitor #functionBar{
  background-image: url("./public/img/bn.png");
  background-size: 100% 100%;
}
#rmonitor #functionBar .help {
  position: absolute;
  width: 150px;
  height: 45px;
  line-height: 45px;
  top: 0;
  right: 0;
}
#rmonitor #functionBar .help::after {
  content: '';
  left: 0;
  top: -1px;
  height: 100%;
  width: 1px;
  background-color: rgba(219, 219, 219, 0.555);
  position: absolute;
}
#rmonitor #functionBar .help li {
  display: inline-block;
  vertical-align: top;
  width: calc(100% / 2);
  text-align: center;
  position: relative;
  color: rgba(255, 255, 255, 0.75);
  cursor: pointer;
  transition: all 1s;
}
#rmonitor #functionBar .help li:hover {
  color: rgba(255, 255, 255, 1);
}
#rmonitor #functionBar .help li .img {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
}
#rmonitor #functionBar .help li:nth-child(1)::after {
  content: none;
}
#rmonitor #functionBar .help li::after {
  content: '';
  left: 0;
  top: -1px;
  height: 100%;
  border-right: 2px dashed rgba(219, 219, 219, 0.555);
  position: absolute;
}
/* 工具-设置 */
#rmonitor #setup {
  display: none;
  position: absolute;
  width: 550px;
  height: 435px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 11;
  background-color: rgba(40, 43, 57, 0.8);
  border: 1px solid #0fafeb;
  border-radius: 3px;
}
#rmonitor #setup .top {
  background-color: rgb(40, 43, 57);
  color: rgba(255, 255, 255, 0.8);
  border-bottom: 1px solid #fff;
  width: 100%;
  height: 35px;
  line-height: 35px;
  text-align: center;
  cursor: move;
  user-select: none;
  position: relative;
}
#rmonitor #setup .top span:nth-child(2) {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(calc(-50% + 3px));
}
#rmonitor #setup .top span:nth-child(2) >>> i {
  transform: 2s;
  font-size: 20px;
  transition: all 1.5s;
  color: rgba(255, 255, 255, 0.65);
  cursor: pointer !important;
}
#rmonitor #setup .top span:nth-child(2) >>> i:hover {
  color: rgba(255, 255, 255, 1);
  transform: rotate(360deg);
}
#rmonitor #setup .center {
  height: 400px;
  width: 100%;
}
#rmonitor #setup .center li {
  vertical-align: top;
  display: inline-block;
  text-align: center;
  width: calc(100% / 2);
  height: calc(400px / 3);
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
  padding: 2.5px 5px;
}
#rmonitor #setup .center li:nth-child(n) {
  float: left;
}
#rmonitor #setup .center li:nth-child(2n) {
  float: right;
}
#rmonitor #setup .center li .neibu {
  width: calc(100%);
  height: calc(400px / 3 - 10px);
  border: 1px dashed rgba(148, 150, 153, 0.6);
}
#rmonitor #setup .center li .neibu .NTop {
  height: 35px;
  line-height: 35px;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: KuHei;
}
#rmonitor #setup .center li .neibu .neirong {
  width: 100%;
  height: calc(400px / 3 - 45px);
}
#rmonitor #setup .center li .neibu .neirong p {
  width: 100%;
  height: calc((400px / 3 - 45px) / 2);
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
  color: rgba(209, 209, 209, 0.8);
  font-family: KuHei;
  font-size: 14px;
}
#rmonitor #setup .center li .neibu .neirong p >>> .el-input__inner {
  background-color: rgba(255, 0, 0, 0);
  border: none;
  border-radius: 0;
  text-align: center;
  border-bottom: 2px solid rgb(148, 150, 153);
  color: rgb(230, 230, 230);
  font-family: DIGIT;
  font-size: 24px;
  width: 100px;
  height: 25px;
  line-height: 25px;
}
#rmonitor #setup .center li .neibu >>> .el-radio {
  margin: 0;
  padding: 0;
  color: #fff;
}
#rmonitor #setup .center li .neibu >>> .el-radio__input.is-checked+.el-radio__label {
  color: #ff7979;
}
#rmonitor #setup .center li .neibu >>> .el-radio__input.is-checked .el-radio__inner {
  border-color: #ff7979;
  background: #ff7979;
}
#rmonitor #setup .center li .neibu .neirong p >>> .el-input__suffix {
  margin-top: -7px;
}
#rmonitor #setup .center li .neibu2 p {
  height: calc((calc(400px / 3 - 10px)) / 2);
  width: 100%;
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
  color: rgba(230, 230, 230, 0.8);
  font-family: KuHei;
  font-size: 17px;
  cursor: pointer;
  transition: all 1s;
}
#rmonitor #setup .center li .neibu2 p:hover {
  color: #fff;
}
#rmonitor #setup .center li .neibu2 p >>> i {
  margin-right: 10px;
  margin-top: 1px;
  font-size: 22px;
}
/* 监测 */
#rmonitor #monitor {
  position: absolute;
  width: calc((100% - 20%) - 42px);
  left: 42px;
  bottom: 5px;
  height: 20%;
  font-family: KuHei;
  /* border: 2.1px solid #0fafeb; */
  background: url("./public/img/bg.png") ;
  background-image: url("./public/img/bn.png");
  background-size: 100% 100%;
}
/* 修饰 */
#rmonitor #functionBar::after,
#rmonitor #monitor::after {
  position: absolute;
  content: "";
  bottom: -1px;
  right: -1px;
  height: 10px;
  width: 10px;
  /* border-bottom: 2px solid #02a6b5;
  border-right: 2px solid #02a6b5; */
  transition: all 1.5s;
  z-index: 0;
}
#rmonitor #functionBar::before,
#rmonitor #monitor::before {
  position: absolute;
  content: "";
  top: -2px;
  left: -2px;
  height: 10px;
  width: 10px;
  /* border-top: 2px solid #02a6b5;
  border-left: 2px solid #02a6b5; */
  transition: all 1.5s;
  z-index: 0;
}
/**===== xuan =====*/
#bg {
  display: none;
  position: absolute;
  width: calc(100% - 40px);
  height: 100%;
  background-color: rgba(140, 140, 140, 0.4);
  z-index: 999;
  right: 0;
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
