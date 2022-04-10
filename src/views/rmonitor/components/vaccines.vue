<template>
  <div id="vaccines">
    <!-- 地图 -->
    <div id="vaccMap" />
    <!-- 展示信息 -->
    <div class="exhibition">
      <ul>
        <li>
          <!-- <span class="Tspan" style="background-color: #C2C459;" /> -->
          <p class="publis">接种人数</p>
          <div class="numbers">
            {{ number }}<span style="font-size: 20px;font-family: 'KuHei';padding-left:5px;display: inline-block;vertical-align: top;color: rgb(180, 180, 180);">人</span>
          </div>
        </li>
        <li>
          <!-- <span class="Tspan" style="background-color: #b8f2e6;" /> -->
          <p class="publis">接种率</p>
          <div class="numbers">
            {{ numberLv }}<span style="font-size: 20px;font-family: 'KuHei';padding-left:5px;display: inline-block;vertical-align: top;color: rgb(180, 180, 180);" />
          </div>
        </li>
      </ul>
    </div>
    <!-- 疾病选择 -->
    <div class="condition">
      <div class="top">
        <i v-if="j === 1" class="el-icon-arrow-left" @click="huan(0)" />
        <listDiseases class="s" />
        <transmission class="x" />
        <i v-if="j === 0" class="el-icon-arrow-right" @click="huan(1)" />
      </div>
    </div>
    <!-- 参数 -->
    <div id="setup">
      <!-- 标题 -->
      <div class="title">
        疫苗接种监测
      </div>
      <!-- 时间 -->
      <div class="fTime">
        <i class="el-icon-d-arrow-left img" style="font-size:21px" @click="ReduceTime()" />
        <el-date-picker v-model="timx" type="date" placeholder="选择日期" :picker-options="pickerOptions" :editable="false" @change="STime()" />
        <i class="el-icon-d-arrow-right img" style="font-size:21px" @click="IncreaseTime()" />
      </div>
      <!-- 监测 -->
      <div class="fMonitor">
        <el-radio v-model="x" label="7" @change="bmonitor(7)">7天</el-radio>
        <el-radio v-model="x" label="14" @change="bmonitor(14)">14天</el-radio>
      </div>
      <!-- 播放 -->
      <div id="play" class="play" @click="bofang()">
        <icon-svg :icon-class="ioc" class="img" />
        <p class="xuanfu">自动播放</p>
      </div>
    </div>
    <!-- 监测 -->
    <div id="monitors">
      <div class="left">
        <el-carousel arrow="never" :interval="5000">
          <el-carousel-item v-for="item in 2" :key="item">
            <div v-if="item === 1" style="height: 100%;width: 100%;position: absolute;">
              <div id="chart" style="height: 100%;width: 100%;z-index: 1;" />
            </div>
            <div v-if="item === 2" style="height: 100%;width: 100%;position: absolute;">
              <div id="chart1" style="height: 100%;width: 100%;z-index: 1;" />
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="right">
        <el-carousel arrow="never">
          <el-carousel-item v-for="item in 2" :key="item">
            <div v-if="item === 1">
              <div id="yiyuan" style="height: 100%;width: 100%;z-index: 1;position: absolute;" />
            </div>
            <div v-if="item === 2">
              <div id="yimiao" style="height: 100%;width: 100%;z-index: 1;position: absolute;" />
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
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
import * as echarts from 'echarts'
import Router from './router'
import SelectRegion from './selectRegion'
import eventBus from '../public/js/EvebtBus'
import ListDiseases from './listDiseases' // 疾病选择
import Transmission from './transmission' // 传播途径
import { Mapbox } from '@antv/l7-maps'
import { Scene, Marker } from '@antv/l7'
import mapboxgl from 'mapbox-gl'

export default {
  name: 'Vaccines',
  components: {
    Router,
    SelectRegion,
    ListDiseases,
    Transmission
  },
  data() {
    return {
      json: {
        table: '', // 表名
        name: '中国',
        where: '',
        code: ''
      },
      j: 0, // 右上角左右切换
      timx: '', // 时间
      timM: '',
      pickerOptions: {
        disabledDate: time => {
          return time > new Date().getTime()
        }
      },
      // 数据
      datas: [],
      x: '7',
      xValue: [],
      myChart: null,
      myChart1: null,
      myChart2: null,
      myChart3: null,
      option: null,
      option3: null,
      bfang: true,
      ioc: 'icon-zanting',
      number: 0, // 接种数
      numberLv: 0, // 接种率
      // map
      map: null,
      // antv
      scene: null,
      // 定位图层
      countryLayer: null, // 国家
      provinceLayer: null, // 省
      cityLayer: null, // 市
      countyLayer: null, // 县
      // 地图数据
      allMapData: [],
      // 饼图集合
      charts: [],
      // 疫苗数据
      cities: [],
      // 图表盒子
      chArr: []
    }
  },
  beforeDestroy() {
    eventBus.$off('json')
    document.getElementById('vaccines').style.display = 'none'
    this.CAdestroy()
    this.CAdestroy2()
  },
  mounted() {
    var that = this
    this.CAdestroy()
    this.CAdestroy2()
    // 城市选择
    eventBus.$on('json', json => {
      that.json.name = json.name
      that.json.where = json.where
      that.json.code = json.code
      if (that.json.name !== '中国') {
        that.xZhou()
        // 地图定位
        that.getbianJson(1)
        if (that.json.table === '') {
          this.$message({
            message: '请选择疾病！',
            type: 'warning',
            showClose: true
          })
        }
      }
    })
    // 疾病名称
    eventBus.$on('type', type => {
      this.json.table = type
      if (that.json.table !== '' && that.json.name !== '中国') {
        that.xZhou()
      } else {
        this.$message({
          message: '请选择城市！',
          type: 'warning',
          showClose: true
        })
      }
    })
    // 传播名称
    eventBus.$on('typc', typc => {
      this.json.table = typc
      if (that.json.table !== '' && that.json.name !== '中国') {
        that.xZhou()
      } else {
        this.$message({
          message: '请选择城市！',
          type: 'warning',
          showClose: true
        })
      }
    })
    // 今日时间
    that.timx = that.checkTime2(new Date())
    // 截止时间
    that.timM = that.checkTime4(new Date((new Date(that.timx)).getTime() + 24 * 60 * 60 * 1000))
    // X轴
    that.xZhou()
    // 切换时间是否展示
    if ((new Date((new Date(this.timx)).getTime() + 24 * 60 * 60 * 1000)) < (new Date()).getTime()) {
      document.querySelectorAll('.fTime .img')[1].style.zIndex = 0
    } else {
      document.querySelectorAll('.fTime .img')[1].style.zIndex = -10
    }
    // 动画
    document.getElementById('play').addEventListener('mouseover', function() {
      document.querySelector('.xuanfu').style.opacity = 1
    })
    document.getElementById('play').addEventListener('mouseout', function() {
      document.querySelector('.xuanfu').style.opacity = 0
    })
    // 地图
    this.int()
  },
  methods: {
    // 创建地图
    int() {
      mapboxgl.accessToken = 'pk.eyJ1Ijoid3VqaW5odWkwIiwiYSI6ImNrdDFoZWphNDBhaGszMXBoazZ1dWdwMWkifQ.AX5nvyCpK8yKsCqyz36rsw' // 你的accessToken
      this.map = new mapboxgl.Map({
        container: 'vaccMap', // 地图容器的id
        center: [107.01292828127248, 34.12077517311424], // 中心点
        zoom: 3, // 地图初始化时的层级
        maxZoom: 22,
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
      var that = this
      this.scene = new Scene({
        id: 'vaccMap',
        map: new Mapbox({
          mapInstance: that.map
        })
      })
      this.map.on('load', () => {
        that.getbianJson(0)
      })
    },
    getbianJson(e) {
      var that = this
      var data = {}
      data.timx = that.checkTime4(new Date((new Date(that.json.timx)).getTime() + 24 * 60 * 60 * 1000))
      data.timz = that.checkTime4(new Date((new Date(that.json.timz)).getTime() + 24 * 60 * 60 * 1000))
      that.$store.dispatch('ndatapanel/QJson', that.json.name).then((dataz) => {
        that.boundary = dataz
        // 数据
        if (e === 0) {
          console.log(that.json.name)
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
      console.log(that.length)
    },
    // 处理数据
    diaoyong(index) {
      var that = this
      var json1 = []
      for (let i = 0; i < that.cities[index].length; i++) {
        const element = that.cities[index][i]
        json1.push({ 'type': 'Feature', 'properties':
        { 'mag': element.value, 'time': element.day, 'name': element.name,
          'description': '<p class="wenben">小区名：' + element.name + '</p><p class="time">' +
          '时间：' + that.checkTime2(new Date(element.day)) + '</p>' + '<p class="laiyuan">今日疫苗：' + element.value + '</p>' },
        'geometry': {
          'type': 'Point', 'coordinates': [element.x * 1, element.y * 1, 0.0] }})
      }
      var geojson = {
        'type': 'FeatureCollection',
        'crs': { 'type': 'name', 'properties': { 'name': 'urn:ogc:def:crs:OGC:1.3:CRS84' }},
        'features': json1
      }
      // 过滤器(通过获取mag的值定义聚合等分级)
      var mag1 = ['<', ['get', 'mag'], 4]
      var mag2 = ['all', ['>=', ['get', 'mag'], 2], ['<', ['get', 'mag'], 8]]
      var mag3 = ['all', ['>=', ['get', 'mag'], 3], ['<', ['get', 'mag'], 12]]
      var mag4 = ['all', ['>=', ['get', 'mag'], 3], ['<', ['get', 'mag'], 16]]
      var mag5 = ['all', ['>=', ['get', 'mag'], 4], ['<', ['get', 'mag'], 20]]
      var mag6 = ['>=', ['get', 'mag'], 24]
      // 颜色
      // var colors = ['#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c']
      var colors = ['#80ffdb', '#64dfdf', '#48bfe3', '#5390d9', '#6930c3', '#ff7979']
      var isExistence = false
      var layers = that.map.getStyle().layers
      for (let index = 0; index < layers.length; index++) {
        const element = layers[index].id
        if (element === 'earthquake_circle') {
          isExistence = true
        }
      }
      if (isExistence === false) {
        that.map.addSource('earthquakes', {
          'type': 'geojson',
          'data': geojson,
          'cluster': true,
          'clusterRadius': 80,
          'clusterProperties': { // keep separate counts for each magnitude category in a cluster 为集群中的每个震级类别保留单独的计数
            'mag1': ['+', ['case', mag1, 1, 0]],
            'mag2': ['+', ['case', mag2, 1, 0]],
            'mag3': ['+', ['case', mag3, 1, 0]],
            'mag4': ['+', ['case', mag4, 1, 0]],
            'mag5': ['+', ['case', mag5, 1, 0]],
            'mag6': ['+', ['case', mag6, 1, 0]]
          }
        })
        // 点图层
        that.map.addLayer({
          'id': 'earthquake_circle',
          'type': 'circle',
          'source': 'earthquakes',
          'filter': ['!=', 'cluster', true],
          'paint': {
            'circle-color': ['case',
            // 定义不同层次数据颜色
              mag1, colors[0],
              mag2, colors[1],
              mag3, colors[2],
              mag4, colors[3],
              mag5, colors[4],
              mag6, colors[5],
              colors[4]],
            'circle-opacity': 0.6,
            'circle-radius': ['case',
            // 定义不同层次数据颜色
              mag1, 6,
              mag2, 7,
              mag3, 8,
              mag4, 9,
              mag5, 10,
              mag6, 12,
              14]
          // 12
          }
        })
        // 不聚合点上的标注图层
        that.map.addLayer({
          'id': 'earthquake_label',
          'type': 'symbol',
          'source': 'earthquakes',
          // 不聚合时展示
          'filter': ['!=', 'cluster', true],
          'layout': {
          // 获取mag
            'text-field': ['number-format', ['get', 'mag'], { 'min-fraction-digits': 1, 'max-fraction-digits': 1 }],
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
            'text-size': 10
          },
          'paint': {
            'text-color': ['case', ['<', ['get', 'mag'], 3], 'black', 'white']
          }
        })
        // 点击时出现弹窗
        that.map.on('click', 'earthquake_circle', function(e) {
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
        // 当鼠标悬停在地点图层上时，将光标更改为指针。
        that.map.on('mouseenter', 'earthquake_circle', function() {
          that.map.getCanvas().style.cursor = 'pointer'
        })
        // 当它离开时将其改回指针。
        that.map.on('mouseleave', 'earthquake_circle', function() {
          that.map.getCanvas().style.cursor = ''
        })
      } else {
        this.map.getSource('earthquakes').setData(geojson)
      }
      // objects for caching and keeping track of HTML marker objects (for performance)
      // 用于缓存和跟踪HTML标记对象的对象（用于性能）
      var markers = {}
      var markersOnScreen = {}

      function updateMarkers() {
        var newMarkers = {}
        var features = that.map.querySourceFeatures('earthquakes')
        // for every cluster on the screen, create an HTML marker for it (if we didn't yet),
        // and add it to the map if it's not there already
        for (var i = 0; i < features.length; i++) {
          var coords = features[i].geometry.coordinates
          var props = features[i].properties
          // 如果不是聚合进入下一轮
          if (!props.cluster) continue
          var id = props.cluster_id

          var marker = markers[id]
          if (!marker) {
            var el = createDonutChart(props)
            marker = markers[id] = new mapboxgl.Marker({ element: el }).setLngLat(coords)
          }
          newMarkers[id] = marker

          if (!markersOnScreen[id]) { marker.addTo(that.map) }
        }
        // for every marker we've added previously, remove those that are no longer visible
        for (id in markersOnScreen) {
          if (!newMarkers[id]) { markersOnScreen[id].remove() }
        }
        markersOnScreen = newMarkers
      }
      // after the GeoJSON data is loaded, update markers on the screen and do so on every map move/moveend
      that.map.on('data', function(e) {
        if (e.sourceId !== 'earthquakes' || !e.isSourceLoaded) return

        that.map.on('move', updateMarkers)
        that.map.on('moveend', updateMarkers)
        updateMarkers()
      })
      // 用于从要素属性创建SVG圆环图的代码
      // code for creating an SVG donut chart from feature properties
      function createDonutChart(props) {
        var offsets = []
        var counts = [props.mag1, props.mag2, props.mag3, props.mag4, props.mag5, props.mag6]
        var total = 0
        for (var i = 0; i < counts.length; i++) {
          offsets.push(total)
          total += counts[i]
        }
        var fontSize = total >= 1000 ? 22 : total >= 100 ? 20 : total >= 10 ? 18 : 16
        var r = total >= 1000 ? 50 : total >= 100 ? 32 : total >= 10 ? 24 : 18
        var r0 = Math.round(r * 0.6)
        var w = r * 2
        // 创建HTML svg标签
        var html = '<svg width="' + w + '" height="' + w + '" viewbox="0 0 ' + w + ' ' + w +
                    '" text-anchor="middle" style="font: ' + fontSize + 'px sans-serif">'
        // 外边框占比
        for (i = 0; i < counts.length; i++) {
          html += donutSegment(offsets[i] / total, (offsets[i] + counts[i]) / total, r, r0, colors[i])
        }
        // cx 和 cy 属性定义圆点的 x 和 y 坐标
        // 内圆标注数字及白底
        html += '<circle cx="' + r + '" cy="' + r + '" r="' + r0 +
                '" fill="white" /><text dominant-baseline="central" transform="translate(' +
                r + ', ' + r + ')">' + total.toLocaleString() + '</text></svg>'
        var el = document.createElement('div')
        el.innerHTML = html
        return el.firstChild
      }
      function donutSegment(start, end, r, r0, color) {
        if (end - start === 1) end -= 0.00001
        var a0 = 2 * Math.PI * (start - 0.25)
        var a1 = 2 * Math.PI * (end - 0.25)
        var x0 = Math.cos(a0); var y0 = Math.sin(a0)
        var x1 = Math.cos(a1); var y1 = Math.sin(a1)
        var largeArc = end - start > 0.5 ? 1 : 0
        return ['<path d="M', r + r0 * x0, r + r0 * y0, 'L', r + r * x0, r + r * y0,
          'A', r, r, 0, largeArc, 1, r + r * x1, r + r * y1,
          'L', r + r0 * x1, r + r0 * y1, 'A',
          r0, r0, 0, largeArc, 0, r + r0 * x0, r + r0 * y0,
          '" fill="' + color + '" />'].join(' ')
      }
      // this.clearEcharts()
      // this.addMarkers(this.cities[index])
    },
    // 添加图表
    addMarkers(chaetData) {
      var that = this
      for (let i = 0; i < chaetData.length; i++) {
        const citiesdata = chaetData[i]
        const data = [
          { name: '未接种数', value: citiesdata.pop * 1 - citiesdata.value },
          { name: '接种数', value: citiesdata.value }
        ]
        const el = document.createElement('div')
        el.className = 'echartsClass'
        el.style.width = 50 + 'px'
        el.style.height = 50 + 'px'
        const option = {
          dataZoom: [
            {
              type: 'slider',
              show: true,
              height: 20,
              start: 80,
              end: 100,
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
              name: citiesdata.name,
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
              },
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: false,
                  // fontSize: citiesdata.value * 100,
                  fontSize: 10,
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: data
            }
          ]
        }
        setTimeout(() => {
          that.charts[i] = echarts.init(el)
          that.charts[i].setOption(option)
        }, 500)
        const marker = new Marker({
          element: el
        }).setLnglat({ lng: citiesdata.x * 1, lat: citiesdata.y * 1 })
        that.scene.addMarker(marker)
      }
    },
    // 清空图表
    clearEcharts() {
      var that = this
      that.chArr = document.querySelectorAll('.echartsClass')
      for (let i = 0; i < that.chArr.length; i++) {
        that.charts[i].clear()
        that.charts[i].dispose()
        that.chArr[i].remove()
      }
      this.charts = []
    },
    // echarts
    initCharts(options) {
      var that = this
      this.myChart = echarts.init(document.getElementById('chart'))
      this.option = {
        baseOption: {
          timeline: {
          // loop: true,
            axisType: 'category',
            show: true,
            symbol: 'emptyCircle',
            progress: {
              itemStyle: {
                color: '#ff7979'
              },
              lineStyle: {
                color: '#ff7979'
              }
            },
            autoPlay: true, // 自动播放
            playInterval: 2000,
            data: that.xValue,
            // 默认颜色
            lineStyle: {
              color: '#ff7979'
            },
            itemStyle: {
              color: '#ff7979'
            },
            // 选择颜色
            checkpointStyle: {
              color: '#ff7979'
            },
            controlStyle: {
              show: false
            },
            top: '5px'
          },
          xAxis: {
            axisLabel: {
              show: true,
              color: '#fff'
            }
          },
          yAxis: {
            type: 'value',
            scale: true,
            splitLine: false,
            name: '次',
            axisLabel: {
              show: true,
              color: '#fff'
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            top: '60px',
            left: '10px',
            right: '10px',
            bottom: '40px',
            containLabel: true
          },
          dataZoom: [
            {
              type: 'slider',
              show: true,
              height: 15,
              start: 1,
              end: 30,
              bottom: '6%',
              showDetail: false
            }
          ]
        },
        options: options
      }
      window.addEventListener('resize', function() {
        this.myChart = echarts.init(document.getElementById('chart'))
        if (this.myChart) {
          this.myChart.resize() // 不报错
        }
      })
      // 监听时间轴
      this.myChart.on('timelinechanged', function(timeLineIndex) {
        const index = timeLineIndex.currentIndex
        that.diaoyong(index)
      })
      this.myChart.setOption(this.option)
      // 点击事件
      this.myChart.on('click', function(params) {
        // that.stop()
        // if (that.scene !== null) {
        //   that.scene.setZoomAndCenter(15, params.data.lnglat)
        // }
      })
    },
    // echarts
    initCharts1(options) {
      var that = this
      this.myChart3 = echarts.init(document.getElementById('chart1'))
      this.option3 = {
        baseOption: {
          timeline: {
          // loop: true,
            axisType: 'category',
            show: true,
            symbol: 'emptyCircle',
            progress: {
              itemStyle: {
                color: '#ff7979'
              },
              lineStyle: {
                color: '#ff7979'
              }
            },
            autoPlay: true, // 自动播放
            playInterval: 2000,
            data: that.xValue,
            lineStyle: {
              color: '#ff7979'
            },
            itemStyle: {
              color: '#ff7979'
            },
            // 选择颜色
            checkpointStyle: {
              color: '#ff7979'
            },
            controlStyle: {
              show: false
            },
            top: '5px'
          },
          color: '#ff7979',
          yAxis: {
            type: 'value',
            scale: true,
            splitLine: false,
            name: '%',
            axisLabel: {
              show: true,
              color: '#fff'
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            top: '60px',
            left: '10px',
            right: '10px',
            bottom: '40px',
            containLabel: true
          },
          dataZoom: [
            {
              type: 'slider',
              show: true,
              height: 15,
              start: 50,
              end: 65,
              bottom: '6%',
              showDetail: false
            }
          ]
        },
        options: options
      }
      window.addEventListener('resize', function() {
        this.myChart3 = echarts.init(document.getElementById('chart1'))
        if (this.myChart3) {
          this.myChart3.resize() // 不报错
        }
      })
      // 监听时间轴
      this.myChart3.on('timelinechanged', function(timeLineIndex) {
        // const index = timeLineIndex.currentIndex
        // that.diaoyong(index)
      })
      this.myChart3.setOption(this.option3)
      // 点击事件
      this.myChart3.on('click', function(params) {
      })
    },
    // X轴
    xZhou() {
      var that = this
      that.xValue = []
      for (let i = 0; i < that.x * 1; i++) {
        that.xValue.push(that.checkTime5(new Date(new Date(that.timM).getTime() - (that.x * 1 - i) * 24 * 60 * 60 * 1000)))
      }
      if (that.json.name !== '' && that.json.name !== '中国' && that.json.table !== '') {
        var x = 0
        var options = []
        that.CAdestroy()
        that.CAdestroy2()
        document.getElementById('bg').style.display = 'block' // 遮罩
        for (let i = 0; i < that.xValue.length; i++) {
          var data = {}
          data.where = that.json.where
          data.name = that.json.name
          data.type = that.json.table
          data.timx = that.checkTime4(new Date(that.xValue[i]))
          that.$store.dispatch('ncity/QCVRate', data).then((datas) => {
            x++
            var name = []
            var way = []
            for (let i = 0; i < datas.length; i++) {
              name.push(datas[i].name)
              way.push(datas[i].value)
            }
            options.push({ xAxis: { type: 'category', data: name }, series: { type: 'line', data: way }})
            if (x === that.xValue.length - 1) {
              that.initCharts1(options)
              that.getHJson()
            }
          })
        }
      }
    },
    // 切换时间间隔
    bmonitor(e) {
      if (this.json.name === '' || this.json.name === '中国') {
        this.$message({
          message: '请选择城市！',
          type: 'warning',
          showClose: true
        })
        if (e * 1 === 7) {
          this.x = '14'
        } else {
          this.x = '7'
        }
      } else {
        this.x = e + ''
        this.xZhou()
      }
    },
    // 自动播放
    bofang() {
      if (this.json.name === '' || this.json.name === '中国') {
        this.$message({
          message: '请选择城市！',
          type: 'warning',
          showClose: true
        })
      } else {
        if (this.bfang === false) {
          this.option.baseOption.timeline.autoPlay = true
          this.option3.baseOption.timeline.autoPlay = true
          this.myChart.setOption(this.option)
          this.myChart3.setOption(this.option3)
          this.bfang = true
          this.ioc = 'icon-zanting'
        } else {
          this.option.baseOption.timeline.autoPlay = false
          this.option3.baseOption.timeline.autoPlay = false
          this.myChart.setOption(this.option)
          this.myChart3.setOption(this.option3)
          this.bfang = false
          this.ioc = 'icon-bofang'
        }
      }
    },
    // 请求数据
    getHJson() {
      if (this.json.table === '') {
        this.$message({
          message: '请选择疾病！',
          type: 'warning',
          showClose: true
        })
      } else {
        var that = this
        that.getVaccines() // 查询疫苗人数
        var data = {}
        data.where = that.json.where
        data.name = that.json.name
        data.type = that.json.table
        data.timz = that.checkTime4(new Date((new Date(that.timM)).getTime() - this.x * 1 * 24 * 60 * 60 * 1000))
        data.timx = that.checkTime4(new Date(that.timM))
        // 重置
        that.datas = []
        for (let i = 0; i < this.x * 1; i++) {
          var shu = []
          that.datas.push(shu)
        }
        that.$store.dispatch('ncity/NOVaccinations', data).then((datas) => {
          for (let i = 0; i < datas.length; i++) {
            that.datas[that.xValue.indexOf(that.checkTime5(new Date(datas[i].day)))].push(datas[i])
          }
          for (let i = 0; i < that.datas.length; i++) {
            that.datas[i].sort(function(a, b) {
              return b.value - a.value
            })
          }
          // 时间值
          that.cities = that.datas
          that.diaoyong(0)
          var options = []
          for (let i = 0; i < that.datas.length; i++) {
          // 为echarts
            var name = []
            var way = []
            for (let j = 0; j < that.datas[i].length; j++) {
              name.push(that.datas[i][j].name)
              way.push(that.datas[i][j].value)
            }
            options.push({ xAxis: { type: 'category', axisLabel: {
              show: true,
              color: '#fff'
            }, data: name }, series: { type: 'bar', itemStyle: {
              color: '#ff7979'
            }, data: way }})
          // 为地图
          }
          that.initCharts(options)
          document.getElementById('bg').style.display = 'none' // 遮罩
        })
      }
    },
    // 接种数/接种率
    getVaccines() {
      var that = this
      var data = {}
      data.where = that.json.where
      data.name = that.json.name
      data.type = that.json.table
      that.number = 0 // 接种数
      that.numberLv = 0 // 接种率
      that.getHospital() // 图表-饼图
      that.getVType() // 图表-雷达图
      that.$store.dispatch('ncity/QTVaccinations', data).then((datas) => { // 查询小区总人口
        that.$store.dispatch('ncity/QTPopulation', data).then((dataz) => { // 查询小区总接种疫苗数
          that.number = that.format(dataz[0].value)
          var zhi = dataz[0].value / datas[0].value
          zhi = zhi.toFixed(4) * 1 * 100
          that.numberLv = that.format(zhi) + '%'
        })
      })
    },
    // 医院接种比例
    getHospital() {
      var that = this
      var data = {}
      data.where = that.json.where
      data.name = that.json.name
      data.type = that.json.table
      that.$store.dispatch('ncity/QNOHVaccinations', data).then((datas) => { // 查询医院接种数
        var data = []
        var zong = 0
        // 求总数
        for (let i = 0; i < datas.length; i++) {
          zong = zong + datas[i].value
        }
        // 求比例
        for (let i = 0; i < datas.length; i++) {
          var gong = {}
          gong.name = datas[i].name
          gong.value = ((datas[i].value / zong).toFixed(4) * 1 * 100).toFixed(2)
          data.push(gong)
        }
        that.pieChart(data)
      })
    },
    // 疫苗占比
    getVType() {
      var that = this
      var data = {}
      data.where = that.json.where
      data.name = that.json.name
      data.type = that.json.table
      that.$store.dispatch('ncity/QVType', data).then((datas) => { // 查询医院接种数
        var data = []
        var indicator = []
        var zong = 0
        // 求总数
        for (let i = 0; i < datas.length; i++) {
          zong = zong + datas[i].value
        }
        // 求比例
        for (let i = 0; i < datas.length; i++) {
          var gong = {}
          gong.text = datas[i].name
          gong.max = 100
          indicator.push(gong)
          var zhi = ((datas[i].value / zong).toFixed(4) * 1 * 100).toFixed(2)
          data.push(zhi)
        }
        that.leida(indicator, data)
      })
    },
    // 饼图
    pieChart(data) {
      var that = this
      that.myChart1 = echarts.init(document.getElementById('yiyuan'))
      const option = {
        title: {
          text: '疫苗接种医院占比',
          left: 'center',
          padding: 10,
          textStyle: {
            color: 'rgb(210, 210, 210)',
            fontFamily: 'KuHei',
            fontWeight: 'bolder',
            fontSize: '14px'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            var rez = params.seriesName + '<br/>' + params.marker + params.name + ' ' + '<span style="font-weight: bold">' + params.percent + '%' + '</span>'
            return rez
          }
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          bottom: 0,
          textStyle: {
            color: 'rgba(255, 255, 255, 1)'
          }
        },
        series: [
          {
            name: '医院名称',
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            data: data,
            label: {
              color: 'rgba(255, 255, 255, 0.9)'
            },
            labelLine: {
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.6)'
              },
              smooth: 0.2,
              length: 10,
              length2: 20
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      window.addEventListener('resize', function() {
        var chart = echarts.init(document.getElementById('yiyuan'))
        if (chart) {
          chart.resize() // 不报错
        }
      })
      that.myChart1.setOption(option)
      // 点击事件
      that.myChart1.on('click', function(params) {
      })
    },
    // 雷达图
    leida(indicator, data) {
      var that = this
      that.myChart2 = echarts.init(document.getElementById('yimiao'))
      const option = {
        title: {
          text: '疫苗种类占比',
          left: 'center',
          padding: 10,
          textStyle: {
            color: 'rgb(210, 210, 210)',
            fontFamily: 'KuHei',
            fontWeight: 'bolder',
            fontSize: '14px'
          }
        },
        tooltip: {
          trigger: 'axis',
          confine: true,
          formatter: function(params) {
            var rez = params.data.name + '<br/>'
            for (let i = 0; i < params.data.value.length; i++) {
              rez = rez + params.marker + indicator[i].text + ' ' + '<span style="font-weight: bold">' + params.data.value[i] + '%' + '<br/>' + '</span>'
            }
            return rez
          }
        },
        radar: [
          {
            indicator: indicator,
            center: ['50%', '70%'],
            name: {
              textStyle: {
                color: '#fff'
              }
            }
          }
        ],
        series: [
          {
            type: 'radar',
            tooltip: {
              trigger: 'item'
            },
            itemStyle: {
              color: '#ff7979'
            },
            areaStyle: {},
            data: [
              {
                value: data,
                name: '疫苗分类'
              }
            ]
          }
        ]
      }
      window.addEventListener('resize', function() {
        var chart = echarts.init(document.getElementById('yimiao'))
        if (chart) {
          chart.resize() // 不报错
        }
      })
      that.myChart2.setOption(option)
      // 点击事件
      that.myChart2.on('click', function(params) {
      })
    },
    // 选择时间时触发
    STime() {
      if (this.json.name === '' || this.json.name === '中国') {
        this.$message({
          message: '请选择城市！',
          type: 'warning',
          showClose: true
        })
        this.timx = this.checkTime2(new Date())
      } else {
        if ((new Date((new Date(this.timx)).getTime() + 24 * 60 * 60 * 1000)) < (new Date()).getTime()) {
          document.querySelectorAll('.fTime .img')[1].style.zIndex = 0
        } else {
          document.querySelectorAll('.fTime .img')[1].style.zIndex = -10
        }
        this.timM = this.checkTime4(new Date((new Date(this.timx)).getTime() + 24 * 60 * 60 * 1000))
        this.xZhou()
      }
    },
    // 减少时间
    ReduceTime() {
      if (this.json.name === '' || this.json.name === '中国') {
        this.$message({
          message: '请选择城市！',
          type: 'warning',
          showClose: true
        })
      } else {
        this.timx = this.checkTime2(new Date((new Date(this.timx)).getTime() - 24 * 60 * 60 * 1000))
        this.timM = this.checkTime4(new Date((new Date(this.timx)).getTime() + 24 * 60 * 60 * 1000))
        document.querySelectorAll('.fTime .img')[1].style.zIndex = 0
        this.xZhou()
      }
    },
    // 增加时间
    IncreaseTime() {
      if (this.json.name === '' || this.json.name === '中国') {
        this.$message({
          message: '请选择城市！',
          type: 'warning',
          showClose: true
        })
      } else {
        this.timx = this.checkTime2(new Date((new Date(this.timx)).getTime() + 24 * 60 * 60 * 1000))
        this.timM = this.checkTime4(new Date((new Date(this.timx)).getTime() + 24 * 60 * 60 * 1000))
        if ((new Date((new Date(this.timx)).getTime() + 24 * 60 * 60 * 1000)) < (new Date()).getTime()) {
          document.querySelectorAll('.fTime .img')[1].style.zIndex = 0
        } else {
          document.querySelectorAll('.fTime .img')[1].style.zIndex = -10
        }
        this.xZhou()
      }
    },
    huan(e) {
      this.j = e
      var s = document.getElementsByClassName('s')[0]
      var x = document.getElementsByClassName('x')[0]
      if (e === 1) {
        s.style.display = 'none'
        x.style.display = 'block'
      } else {
        x.style.display = 'none'
        s.style.display = 'block'
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
    // 数字处理
    format(number) {
      var str = parseInt(number).toString()
      var len = str.length
      if (len <= 3) { return str }
      var r = len % 3
      return r > 0 ? str.slice(0, r) + ',' + str.slice(r, len).match(/\d{3}/g).join(',') : str.slice(r, len).match(/\d{3}/g).join(',')
    },
    // 创建与销毁盒子
    CAdestroy() {
      if (this.myChart1 !== null && this.myChart2 !== null && this.myChart3 !== null) {
        this.myChart1.clear()
        this.myChart1.dispose()
        this.myChart2.clear()
        this.myChart2.dispose()
      }
    },
    CAdestroy2() {
      if (this.myChart !== null && this.myChart3 !== null) {
        this.myChart.clear()
        this.myChart.dispose()
        this.myChart3.clear()
        this.myChart3.dispose()
      }
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
/* 地图 */
#vaccMap {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
}
/* L7logo */
#vaccines >>> .l7-left .l7-control{
  display: none !important;
}
/* mapboxlogo */
#vaccines >>>  .mapboxgl-ctrl-bottom-right{
  display: none !important;
}
#vaccines {
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
#vaccines ul,
#vaccines p {
  margin: 0;
  padding: 0;
  list-style-type: none;
  width: 100%;
    height: 100%;
}
/* 展示 */
#vaccines .exhibition {
  position: absolute;
  left: 45px;
  top: 5px;
  color: rgb(180, 180, 180);
  width: 220px;
  height: 156px;
  text-align: center;
}
#vaccines .exhibition li {
  background-color: rgba(79, 133, 177, 0.3);
  background: url("../public/img/ba.png");
  background-size: 100%,100%;
    background-position-y: 100%;
    width: 72%;
    height: 62%;
    /* margin-bottom: 15px; */
    position: relative;
}
#vaccines .exhibition li .Tspan {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 10px;
}
#vaccines .exhibition li .publis {
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
#vaccines .exhibition li .publis:hover {
  color: rgb(230, 230, 230);
}
#vaccines .exhibition li .numbers {
  position: absolute;
  top: 35px;
  height: 55px;
  line-height: 55px;
  width: 100%;
  font-family: DIGIT;
  font-size: 28px;
  color: #fff;
}
/* 条件 */
#vaccines .condition .top {
  position: absolute;
  width: 400px;
  right: 5px;
  top: 5px;
  height: calc(40% - 5px);
  /* border: 2px solid rgba(25, 186, 139, 0.2); */
  background: url("../public/img/bn.png") rgba(79, 133, 177, 0.3);
  background-size: 100% 100%;
}
/* 参数 */
#vaccines #setup {
  position: absolute;
  width: calc(100% - 50px);
  left: 45px;
  bottom: calc(35% + 7px);
  height: 45px;
  line-height: 45px;
  font-family: KuHei;
  border: 1px solid #0fafeb;
  background: url("../public/img/bg.png") rgba(79, 133, 177, 0.3);
  color: #fff;
}
/* 标题 */
#vaccines #setup .title {
  position: absolute;
  font-family: KuHei;
  color: #fff;
  font-size: 18px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  letter-spacing: 5px;
}
/* 时间范围 */
#vaccines #setup .fTime {
  position: absolute;
  left: 0;
  width: 260px;
  height: 45px;
  line-height: 45px;
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
}
#vaccines #setup .fTime::after {
  content: '';
  position: absolute;
  height: calc(100% - 2px);
  width: 2px;
  background-color: rgba(219, 219, 219, 0.555);
  right: 0;
  top: 0;
}
#vaccines #setup .fTime >>> .el-input__prefix,
#vaccines #setup .fTime >>> .el-input__suffix {
  display: none;
}
#vaccines #setup .fTime >>> .el-input__inner {
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
#vaccines #setup .fTime >>> .el-date-editor.el-input,
#vaccines #setup .fTime >>> .el-date-editor.el-input__inner {
  width: 140px;
}
#vaccines #setup .fTime .img {
  margin: 0 15px;
  height: 45px;
  line-height: 45px;
  cursor: pointer;
  color: rgb(199, 199, 199);
  transition: all 0.5s;
}
#vaccines #setup .fTime .img:hover {
  color: #fff;
}
/* 监测模式 */
#vaccines #setup .fMonitor {
  position: absolute;
  left: 260px;
  width: 260px;
  height: 45px;
  line-height: 45px;
  text-align: center;
  border-right: 2px solid rgba(219, 219, 219, 0.555);
  justify-content: center;
  align-items: center;
  display: flex;
}
#vaccines #setup .fMonitor >>> .el-radio {
  color: #fff;
}
#vaccines #setup .fMonitor >>> .el-radio__inner::after {
  left: 54.2%;
  top: 53.3%;
}
#vaccines #setup .fMonitor >>> .el-radio__input.is-checked+.el-radio__label {
  color: #ff7979;
}
#vaccines #setup .fMonitor >>> .el-radio__input.is-checked .el-radio__inner {
  border-color: #ff7979;
  background: #ff7979;
}
/* 播放 */
#vaccines #setup .play {
  position: absolute;
  cursor: pointer;
  font-size: 25px;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.5s;
  height: 100%;
  width: 35px;
  right: 0;
  text-align: center;
}
#vaccines #setup .play:hover {
  color: rgba(255, 255, 255, 1);
}
#vaccines #setup .play .xuanfu {
  color: #fff;
  font-family: KuHei;
  margin: 0;
  padding: 0;
  position: absolute;
  text-align: center;
  background-color: rgba(40, 43, 57, 0.8) !important;
  letter-spacing: 3px;
  border: 1px solid rgba(219, 219, 219, 0.555);
  width: 85px;
  border-radius: 4px;
  font-size: 12px;
  height: 35px;
  line-height: 35px;
  right: 35px;
  top: 50%;
  transform: translate(0, -50%);
  opacity: 0;
  transition: all 0.5s;
}
/* 监测 */
#vaccines #monitors {
  position: absolute;
  width: calc(100% - 50px);
  left: 45px;
  height: 35%;
  bottom: 3px;
  font-family: KuHei;
  color: #fff;
}
#vaccines #monitors .left {
  position: absolute;
  height: 100%;
  left: 0;
  width: calc(100% - 405px);
  /* border: 1px solid #0fafeb; */
  background: url("../public/img/bn.png") rgba(79, 133, 177, 0.3);
  background-size: 100% 100%;
  z-index: 20;
}
#vaccines #monitors .left >>> .el-carousel {
  position: absolute;
  width: 100%;
  height: 100%;
}
#vaccines #monitors .left >>> .el-carousel__container {
  position: absolute;
  width: 100%;
  height: 100%;
}
#vaccines #monitors .right {
  position: absolute;
  height: 100%;
  right: 0;
  width: 400px;
  background: url("../public/img/bn.png") rgba(79, 133, 177, 0.3);
  background-size: 100% 100%;
  z-index: 20;
}
#vaccines #monitors .right >>> .el-carousel {
  position: absolute;
  width: 100%;
  height: 100%;
}
#vaccines #monitors .right >>> .el-carousel__container {
  position: absolute;
  width: 100%;
  height: 100%;
}
/* 四角 */
/* #vaccines .condition .top::after, */
#vaccines #setup::after {
  position: absolute;
  content: "";
  bottom: -1px;
  right: -1px;
  height: 10px;
  width: 10px;
  border-bottom: 2px solid #02a6b5;
  border-right: 2px solid #02a6b5;
  transition: all 1.5s;
  z-index: 0;
}
/* #vaccines .condition .top::before, */
#vaccines #setup::before{
  position: absolute;
  content: "";
  top: -1px;
  left: -1px;
  height: 10px;
  width: 10px;
  border-top: 2px solid #02a6b5;
  border-left: 2px solid #02a6b5;
  transition: all 1.5s;
  z-index: 0;
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
/* 切换 */
#vaccines .condition .top >>> .el-icon-arrow-left {
  position: absolute;
  color: #fff;
  font-size: 18px;
  z-index: 10;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 50%;
  background-color: rgba(204, 204, 204, 0.3);
  top: 5px;
  cursor: pointer;
  transition: all 0.5s;
  left: 5px;
  animation: fade-in;
  animation-duration: 1s;
  -webkit-animation: fade-in 1s;
}
#vaccines .condition .top >>> .el-icon-arrow-right {
  position: absolute;
  color: #fff;
  font-size: 18px;
  z-index: 10;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 50%;
  background-color: rgba(204, 204, 204, 0.3);
  top: 5px;
  cursor: pointer;
  transition: all 0.5s;
  right: 5px;
  animation: fade-in;
  animation-duration: 1s;
  -webkit-animation: fade-in 1s;
}
.x {
  display: none;
}
</style>
