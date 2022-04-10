<template>
  <div id="sentiment">
    <div id="passMap" />
    <!-- 查询类型 -->
    <div class="type">
      <ul>
        <li class="CircleSearch" @click="heatmap()"><icon-svg icon-class="icon-relitu2" /><span> 热力图</span></li>
        <li class="CircleSearch" @click="line()"><icon-svg icon-class="icon-luxian" /><span> 路线图</span></li>
        <li class="CircleSearch" @click="point()"><icon-svg icon-class="icon-ditiezhandian" /><span> 站点图</span></li>
        <li class="CircleSearch" @click="bus()"><icon-svg icon-class="icon-gongjiaoche" /><span> 公交图</span></li>
      </ul>
    </div>
    <!-- 参数 -->
    <div id="setup">
      <!-- 标题 -->
      <div class="title">
        城市关口监测
      </div>
      <!-- 时间 -->
      <div class="fTime">
        <i class="el-icon-d-arrow-left img" style="font-size:21px" @click="ReduceTime()" />
        <el-date-picker v-model="timx" type="date" placeholder="选择日期" :picker-options="pickerOptions" :editable="false" @change="STime()" />
        <i class="el-icon-d-arrow-right img" style="font-size:21px" @click="IncreaseTime()" />
      </div>
      <!-- 监测 -->
      <div class="fMonitor">
        <el-radio v-model="x" label="24" @change="bmonitor(24)">24H</el-radio>
        <el-radio v-model="x" label="12" @change="bmonitor(12)">12H</el-radio>
      </div>
      <!-- 播放 -->
      <div id="play" class="play" @click="bofang()">
        <icon-svg :icon-class="ioc" class="img" />
        <p class="xuanfu">自动播放</p>
      </div>
    </div>
    <!-- 监测 -->
    <div id="monitor">
      <div id="chart" style="height: 100%;width: 100%;z-index: 1;" />
    </div>
    <router />
    <!-- 城市选择 -->
    <selectRegion />
    <!-- 加载动画 -->
    <div id="bg">
      <div id="xuan">
        <span /><span /><span /><span />
      </div>
    </div>
  </div>
</template>

<script>
import Router from './router'
import mapboxgl from 'mapbox-gl'
import SelectRegion from './selectRegion'
import * as echarts from 'echarts'
import eventBus from '../public/js/EvebtBus'
import { Mapbox } from '@antv/l7-maps'
import { Scene, LineLayer } from '@antv/l7'
import station from '../public/js/station.json' // 地铁车站数据
import stationLine from '../public/js/stationLine.json' // 地铁轨迹数据
import busStation from '../public/js/busStation.json' // 公交车站数据
import busLine from '../public/js/busLine.json' // 公交车轨迹数据
// import Router from ''
export default {
  name: 'Sentiment',
  components: {
    Router,
    SelectRegion
  },
  data() {
    return {
      json: {
        name: '中国',
        where: '',
        code: ''
      },
      length: 0, // 长度
      timx: '', // 时间
      pickerOptions: {
        disabledDate: time => {
          return time > new Date().getTime()
        }
      },
      // 数据
      datas: [],
      x: '24',
      xValue: [],
      myChart: null,
      option: null,
      bfang: true,
      ioc: 'icon-zanting',
      // 地图
      map: null,
      scene: null,
      allMapData: [], // 地铁数据
      busWay: [], // 公交数据
      busWayStation: [], // 公交车站数据
      type: 'metro'
      // type: 'bus'
    }
  },
  beforeDestroy() {
    eventBus.$off('json')
    document.getElementById('sentiment').style.display = 'none'
    this.CAdestroy()
  },
  mounted() {
    var that = this
    this.int()
    // X轴
    that.xZhou()
    // 今日时间
    that.timx = that.checkTime2(new Date())
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
    // 城市选择
    eventBus.$on('json', json => {
      that.json.name = json.name
      that.json.where = json.where
      that.json.code = json.code
      if (that.json.name !== '中国') {
        that.getHJson()
        // 地图定位
        that.getbianJson(1)
      }
    })
  },
  methods: {
    int() {
      var that = this
      mapboxgl.accessToken = 'pk.eyJ1Ijoid3VqaW5odWkwIiwiYSI6ImNrdDFoZWphNDBhaGszMXBoazZ1dWdwMWkifQ.AX5nvyCpK8yKsCqyz36rsw' // 你的accessToken
      this.map = new mapboxgl.Map({
        container: 'passMap', // 地图容器的id
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
      this.scene = new Scene({
        id: 'passMap',
        map: new Mapbox({
          mapInstance: that.map
        })
      })
      this.map.on('load', () => {
        that.getbianJson(0)
        // 箭头-右
        var svgXML =
            `<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"> 
                <path d="M529.6128 512L239.9232 222.4128 384.7168 77.5168 819.2 512 384.7168 946.4832 239.9232 801.5872z" p-id="9085" fill="#ffffff"></path> 
            </svg>
            `
        // 给图片对象写入base64编码的svg流
        var svgBase64 = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svgXML)))
        const arrowIcon = new Image(20, 20)
        arrowIcon.src = svgBase64
        that.map.addImage('arrowIcon', arrowIcon)
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
    // 添加图层
    addlayer(pointFeature) {
      var that = this
      // 数据处理
      // 轨迹数据
      var isExistence = false
      var layers = that.map.getStyle().layers
      for (let index = 0; index < layers.length; index++) {
        const element = layers[index].id
        if (element === 'earthquakes-heat') {
          isExistence = true
        }
      }
      if (isExistence === false) {
        var lineWay = []
        for (let index = 0; index < stationLine.length; index++) {
          const element = stationLine[index]
          lineWay.push({ 'type': 'Feature', 'properties': { id: element.id, name: element.name }, 'geometry': {
            'type': 'LineString', // 线
            'coordinates': element.line
          }})
        }
        // 点数据
        that.map.addSource('point', {
          'type': 'geojson',
          'data': pointFeature
        })
        // 面数据
        var lineGeojson = {
          'type': 'FeatureCollection',
          'crs': { 'type': 'name', 'properties': { 'name': 'urn:ogc:def:crs:OGC:1.3:CRS84' }},
          'features': lineWay
        }
        that.map.addSource('line1', {
          'type': 'geojson',
          'data': lineGeojson
        })
        that.map.on('click', 'points', function(e) {
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
        // 路线数据
        that.map.addLayer({
          'id': 'line',
          'type': 'line',
          'source': 'line1',
          // 描边
          'layout': {
            'line-cap': 'round',
            'line-join': 'round'
          },
          'paint': {
            'line-color': [
              'match', ['get', 'id'],
              '1', 'rgb(92,184,229)',
              '2', 'rgb(214,53,66)',
              '3', 'rgb(76,154,70)',
              '4', 'rgb(146,72,204)',
              '10', 'rgb(172,135,86)',
              's1', 'rgb(38,132,132)',
              's3', 'rgb(221,100,180)',
              's7', 'rgb(224,108,136)',
              's8', 'rgb(231,94,0)',
              's9', '#CB9173',
              '#cf45cf'
            ],
            'line-width': 10
          }
        })
        // 站点数据
        that.map.addLayer({
          'id': 'points',
          'type': 'circle',
          'source': 'point',
          'paint': {
            'circle-color': '#fff',
            'circle-radius': 4,
            'circle-stroke-width': 3,
            'circle-stroke-color': [
              'match', ['get', 'name'],
              '1', 'rgb(92,184,229)',
              '2', 'rgb(214,53,66)',
              '3', 'rgb(76,154,70)',
              '4', 'rgb(146,72,204)',
              '10', 'rgb(172,135,86)',
              's1', 'rgb(38,132,132)',
              's3', 'rgb(221,100,180)',
              's7', 'rgb(224,108,136)',
              's8', 'rgb(231,94,0)',
              's9', '#CB9173',
              '#cf45cf'
            ]
          }
        })
        // 箭头
        // that.map.addLayer({
        //   'id': 'arrowLayer',
        //   'type': 'symbol',
        //   'source': 'line1',
        //   'layout': {
        //     'symbol-placement': 'line1',
        //     'symbol-spacing': 50, // 图标间隔，默认为250
        //     'icon-image': 'arrowIcon', // 箭头图标
        //     'icon-size': 0.5
        //   }
        // })
        // 热力图
        that.map.addLayer({
          'id': 'earthquakes-heat',
          'type': 'heatmap',
          'source': 'point',
          'maxzoom': 16,
          'paint': {
            'heatmap-weight': [
              'interpolate',
              ['linear'],
              ['get', 'people'],
              0, 0,
              1, 1
            ],
            'heatmap-intensity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0, 1,
              9, 3
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
              9, 20
            ],
            // Transition from heatmap to circle layer by zoom level
            'heatmap-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              10, 0.9,
              11, 0.8,
              12, 0.7,
              13, 0.6,
              14, 0.5,
              15, 0
            ]
          }
        })
      } else {
        // console.log(pointFeature)
        that.map.getSource('point').setData(pointFeature)
      }
    },
    // 图层控制
    heatmap() {
      var that = this
      var visibility = that.map.getLayoutProperty('earthquakes-heat', 'visibility')
      if (visibility === 'visible' || visibility === undefined) {
        that.map.setLayoutProperty('earthquakes-heat', 'visibility', 'none')
      } else {
        that.map.setLayoutProperty('earthquakes-heat', 'visibility', 'visible')
      }
    },
    line() {
      var that = this
      var visibility = that.map.getLayoutProperty('line', 'visibility')
      if (visibility === 'visible' || visibility === undefined) {
        that.map.setLayoutProperty('line', 'visibility', 'none')
      } else {
        that.map.setLayoutProperty('line', 'visibility', 'visible')
      }
    },
    point() {
      var that = this
      var visibility = that.map.getLayoutProperty('points', 'visibility')
      if (visibility === 'visible' || visibility === undefined) {
        that.map.setLayoutProperty('points', 'visibility', 'none')
      } else {
        that.map.setLayoutProperty('points', 'visibility', 'visible')
      }
    },
    // 时间图表
    initCharts(options) {
      var that = this
      this.myChart = echarts.init(document.getElementById('chart'))
      this.option = {
        baseOption: {
          timeline: {
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
            name: '万人',
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
              start: 0,
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
      this.myChart.setOption(this.option)
      // 监听时间轴
      this.myChart.on('timelinechanged', function(timeLineIndex) {
        const index = timeLineIndex.currentIndex
        if (that.type === 'metro') {
          that.addlayer(that.allMapData[index])
        } else if (that.type === 'bus') {
          that.addAntvLayer(that.busWay[index])
          that.addlayer(that.busWayStation[index])
        }
      })
      // 点击事件
      this.myChart.on('click', function(params) {
      })
    },
    // X轴
    xZhou() {
      this.xValue = []
      for (let i = 0; i < this.x * 1; i++) {
        this.xValue.push(i + '时')
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
          this.myChart.setOption(this.option)
          this.bfang = true
          this.ioc = 'icon-zanting'
        } else {
          this.option.baseOption.timeline.autoPlay = false
          this.myChart.setOption(this.option)
          this.bfang = false
          this.ioc = 'icon-bofang'
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
        if (e * 1 === 12) {
          this.x = '24'
        } else {
          this.x = '12'
        }
      } else {
        this.x = e + ''
        this.xZhou()
        this.getHJson()
      }
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
        this.getHJson()
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
        document.querySelectorAll('.fTime .img')[1].style.zIndex = 0
        this.getHJson()
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
        if ((new Date((new Date(this.timx)).getTime() + 24 * 60 * 60 * 1000)) < (new Date()).getTime()) {
          document.querySelectorAll('.fTime .img')[1].style.zIndex = 0
        } else {
          document.querySelectorAll('.fTime .img')[1].style.zIndex = -10
        }
        this.getHJson()
      }
    },
    bus() {
      this.type = 'bus'
      this.getHJson()
    },
    // 请求数据
    getHJson() {
      document.getElementById('bg').style.display = 'block' // 遮罩
      var that = this
      that.CAdestroy()
      var data = {}
      data.where = that.json.where
      data.name = that.json.name
      data.timz = that.checkTime4(new Date(that.timx))
      data.timx = that.checkTime4(new Date((new Date(data.timz)).getTime() + 24 * 60 * 60 * 1000))
      // 重置
      that.datas = []
      for (let i = 0; i < this.x * 1; i++) {
        var shu = []
        that.datas.push(shu)
      }
      that.$store.dispatch('ncity/RQuarters', data).then((datas) => {
        for (let i = 0; i < datas.length; i++) {
          if (that.x * 1 === 24) {
            that.datas[datas[i].hour].push(datas[i])
          } else {
            if (datas[i].hour % 2 === 0) {
              that.datas[datas[i].hour / 2].push(datas[i])
            } else {
              that.datas[(datas[i].hour - 1) / 2].push(datas[i])
            }
          }
        }
        for (let i = 0; i < that.datas.length; i++) {
          that.datas[i].sort(function(a, b) {
            return b.value - a.value
          })
        }
        document.getElementById('bg').style.display = 'none' // 遮罩
        that.allMapData = []
        // 时间值
        var options = []
        if (that.type === 'metro') {
          for (let i = 0; i < that.datas.length; i++) {
          // 为echarts
            const name = []
            const way = []
            // 地铁车站数据
            const pointFeature = []
            for (let index = 0; index < station.length; index++) {
              const element = station[index]
              const aNumber = (1 - 0.2) * Math.random() + 0.2
              const result = aNumber.toFixed(2) * 1
              name.push(element.station)
              way.push(result)
              // mapdata.push({ 'type': 'Feature', 'properties': { 'name': that.datas[i][j].name, 'value': that.datas[i][j].value * 1 }, 'geometry': { 'type': 'Point', 'coordinates': [that.datas[i][j].x * 1, that.datas[i][j].y * 1] }})
              pointFeature.push({
                'type': 'Feature',
                'properties': { name: element.name, station: element.station, people: result,
                  'description': '<p class="wenben">南京' + element.name + '号线</p><p class="wenben">车站名：' + element.station +
            '<p class="laiyuan">今日：' + result + '万人次</p>'
                },
                'geometry': {
                  'type': 'Point',
                  'coordinates': [element.lng, element.lat]
                }
              })
            }
            pointFeature.sort(function(a, b) { return a.properties.people - b.properties.people })
            that.allMapData.push({
              'type': 'FeatureCollection',
              'crs': { 'type': 'name', 'properties': { 'name': 'urn:ogc:def:crs:OGC:1.3:CRS84' }}, 'features': pointFeature
            })
            options.push({ xAxis: { type: 'category', axisLabel: {
              show: true,
              color: '#fff'
            }, data: name }, series: { type: 'bar',
              itemStyle: {
                color: '#ff7979'
              }, data: way }})
            // console.log(options)
          }
          that.addlayer(that.allMapData[0])
        } else if (that.type === 'bus') {
          that.busWay = []
          that.busWayStation = []
          for (let i = 0; i < that.datas.length; i++) {
          // 为echarts
            const name = []
            const pointFeature = []
            const way = []
            for (let index = 0; index < busStation.length; index++) {
              const element = busStation[index]
              const aNumber = (1 - 0.2) * Math.random() + 0.2
              const result = aNumber.toFixed(2) * 1
              name.push(element.station)
              way.push(result)
              // mapdata.push({ 'type': 'Feature', 'properties': { 'name': that.datas[i][j].name, 'value': that.datas[i][j].value * 1 }, 'geometry': { 'type': 'Point', 'coordinates': [that.datas[i][j].x * 1, that.datas[i][j].y * 1] }})
              pointFeature.push({
                'type': 'Feature',
                'properties': { name: element.name, station: element.station, people: result,
                  'description': '<p class="wenben">南京' + element.name + '号线</p><p class="wenben">车站名：' + element.station +
            '<p class="laiyuan">今日：' + result + '万人次</p>'
                },
                'geometry': {
                  'type': 'Point',
                  'coordinates': [element.lng, element.lat]
                }
              })
            }
            pointFeature.sort(function(a, b) { return a.properties.people - b.properties.people })
            that.busWayStation.push({
              'type': 'FeatureCollection',
              'crs': { 'type': 'name', 'properties': { 'name': 'urn:ogc:def:crs:OGC:1.3:CRS84' }}, 'features': pointFeature
            })
            options.push({ xAxis: { type: 'category', axisLabel: {
              show: true,
              color: '#fff'
            }, data: name }, series: { type: 'bar',
              itemStyle: {
                color: '#ff7979'
              }, data: way }})
            const path = []
            // 地铁车站数据
            for (let index = 0; index < busLine.length; index++) {
              const element = busLine[index]
              const aNumber = (500 - 200) * Math.random() + 200
              const result = Math.floor(aNumber)
              var level = 1
              if (result <= 300) {
                level = 1
              } else if (result <= 400) {
                level = 2
              } else if (result <= 500) {
                level = 3
              } else if (result <= 600) {
                level = 4
              } else if (result <= 700) {
                level = 5
              } else if (result <= 800) {
                level = 6
              } else if (result <= 900) {
                level = 7
              } else if (result <= 1000) {
                level = 8
              }
              path.push({ level: level, path: element.line, name: element.line.name })
            }
            that.busWay.push(path)
          }
          that.addAntvLayer(that.busWay[0])
          that.addlayer(that.busWayStation[0])
        }
        that.initCharts(options)
      })
    },
    addAntvLayer(data) {
      var that = this
      var visibility = that.map.getLayoutProperty('line', 'visibility')
      if (visibility === 'visible' || visibility === undefined) {
        that.map.setLayoutProperty('line', 'visibility', 'none')
      }
      const layer = new LineLayer({})
        .source(data, {
          parser: {
            type: 'json',
            coordinates: 'path'
          }
        })
        .size('level', level => {
          return [0.8, level * 1]
        })
        .shape('line')
        .color(
          'level',
          [
            '#312B60',
            '#4A457E',
            '#615C99',
            '#816CAD',
            '#A67FB5',
            '#C997C7',
            '#DEB8D4',
            '#F5D4E6',
            '#FAE4F1',
            '#FFF3FC'
          ].slice(0, 8)
        )
      that.scene.addLayer(layer)
      // })
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
      if (this.myChart !== null) {
        this.myChart.clear()
        this.myChart.dispose()
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
#sentiment {
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
/* L7logo */
#sentiment >>> .l7-left .l7-control{
  display: none !important;
}
/* mapboxlogo */
#sentiment >>>  .mapboxgl-ctrl-bottom-right{
  display: none !important;
}
/* 地图 */
#passMap {
  position: absolute;
  width: 100%;
  height: 100%;
}
/* 参数 */
#sentiment #setup {
  position: absolute;
  width: calc(100% - 50px);
  left: 45px;
  bottom: calc(35% + 7px);
  height: 45px;
  line-height: 45px;
  font-family: KuHei;
  border: 1px solid #0fafeb;
  background: url("../public/img/bg.png") rgba(79, 133, 177, 0.3);
  /* z-index: 20; */
}
/* 标题 */
#sentiment #setup .title {
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
#sentiment #setup .fTime {
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
#sentiment #setup .fTime::after {
  content: '';
  position: absolute;
  height: calc(100% - 2px);
  width: 2px;
  background-color: rgba(219, 219, 219, 0.555);
  right: 0;
  top: 0;
}
#sentiment #setup .fTime >>> .el-input__prefix,
#sentiment #setup .fTime >>> .el-input__suffix {
  display: none;
}
#sentiment #setup .fTime >>> .el-input__inner {
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
#sentiment #setup .fTime >>> .el-date-editor.el-input,
#sentiment #setup .fTime >>> .el-date-editor.el-input__inner {
  width: 140px;
}
#sentiment #setup .fTime .img {
  margin: 0 15px;
  height: 45px;
  line-height: 45px;
  cursor: pointer;
  color: rgb(199, 199, 199);
  transition: all 0.5s;
}
#sentiment #setup .fTime .img:hover {
  color: #fff;
}
/* 监测模式 */
#sentiment #setup .fMonitor {
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
#sentiment #setup .fMonitor >>> .el-radio {
  color: #fff;
}
#sentiment #setup .fMonitor >>> .el-radio__inner::after {
  left: 54.2%;
  top: 53.3%;
}
#sentiment #setup .fMonitor >>> .el-radio__input.is-checked+.el-radio__label {
  color: #ff7979;
}
#sentiment #setup .fMonitor >>> .el-radio__input.is-checked .el-radio__inner {
  border-color: #ff7979;
  background: #ff7979;
}
/* 播放 */
#sentiment #setup .play {
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
#sentiment #setup .play:hover {
  color: rgba(255, 255, 255, 1);
}
#sentiment #setup .play .xuanfu {
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
#sentiment #monitor {
  position: absolute;
  width: calc(100% - 50px);
  left: 45px;
  height: 35%;
  bottom: 3px;
  font-family: KuHei;
  border: 1px solid #0fafeb;
  background: url("../public/img/bg.png") rgba(79, 133, 177, 0.3);
  z-index: 20;
}
/* 四角 */
#sentiment #setup::after,
#sentiment #monitor::after {
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
#sentiment #setup::before,
#sentiment #monitor::before {
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
/* 查询类型 */
#sentiment ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
#sentiment .type {
  position: absolute;
  z-index: 10;
  top: 55px;
  right: 5px;
  font-family: KuHei;
  font-size: 14px;
}
#sentiment .type li {
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
#sentiment .type li:hover {
  color: rgb(230, 230, 230);
}
</style>
