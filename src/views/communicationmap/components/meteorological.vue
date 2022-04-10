<template>
  <div id="GraphMovie">
    <!-- 查询类型 -->
    <div class="type">
      <ul>
        <li class="CircleSearch" @click="add()"><span> 传播演示</span></li>
        <li class="CircleSearch" @click="Range()"><span> 危害预测</span></li>
        <li class="CircleSearch" @click="fanwei()"><span> 范围图</span></li>
        <li class="CircleSearch" @click="heatmap()"><span> 热力图</span></li>
      </ul>
    </div>
    <!-- 地图 -->
    <div id="map1" />
    <!-- 路由 -->
    <router />
    <selectRegion />
  </div>
</template>
<script>
import Router from './router'
import SelectRegion from './selectRegion'
import eventBum from '../public/js/EvebtBus'

export default {
  name: 'GraphMovie',
  components: {
    Router,
    SelectRegion
  },
  data() {
    return {
      json: {
        type: '', // 疾病种类
        name: '中国', // 城市名称
        where: '', // 层级
        timz: '', // 开始时间
        timx: '', // 结束时间
        spac: '市级', // 城市尺度
        typh: '' // 患病类型
      },
      // 地图
      map: null,
      scene: null, // antv
      allMapData: [],
      mapdata: [],
      point: [{
        properties: {
          id: '0',
          direction: '西',
          power: 5
        },
        coordinates: [118.615366, 32.045713]
      }, {
        properties: {
          id: '1',
          direction: '东',
          power: 6
        },
        coordinates: [118.315366, 32.445713]
      }, {
        properties: {
          id: '2',
          direction: '南',
          power: 3
        },
        coordinates: [118.615366, 32.245713]
      }, {
        properties: {
          id: '3',
          direction: '北',
          power: 4
        },
        coordinates: [118.615366, 32.145713]
      }, {
        properties: {
          id: '5',
          direction: '东北',
          power: 4
        },
        coordinates: [115, 32]
      }, {
        properties: {
          id: '4',
          direction: '西北',
          power: 4
        },
        coordinates: [115, 33]
      }, {
        properties: {
          id: '6',
          direction: '西南',
          power: 4
        },
        coordinates: [114, 32]
      }, {
        properties: {
          id: '7',
          direction: '东南',
          power: 4
        },
        coordinates: [113, 32.145713]
      }],
      // 热力图数据
      heatPoint: [],
      // 范围面数据
      mianData: [],
      // 范围线数据
      nullData: {
        'type': 'FeatureCollection',
        'features': [
        ]
      },
      spreaddata: null,
      isRegionExistence: false,
      isExistence: false
    }
  },
  beforeDestroy() {
    // 关闭传值
    eventBum.$off('json')
    document.getElementById('GraphMovie').style.display = 'none'
  },
  mounted() {
    // 城市名称
    eventBum.$on('json', json => {
      this.json.name = json.name
      this.json.where = json.where
      // 地图定位
      this.getbianJson(1)
      this.addRegion()
    })
    this.int()
  },
  methods: {
    // 地图
    int() {
      var that = this
      // eslint-disable-next-line no-undef
      mapboxgl.accessToken = 'pk.eyJ1Ijoid3VqaW5odWkwIiwiYSI6ImNrdDFoZWphNDBhaGszMXBoazZ1dWdwMWkifQ.AX5nvyCpK8yKsCqyz36rsw' // 你的accessToken
      // eslint-disable-next-line no-undef
      this.map = new mapboxgl.Map({
        container: 'map1', // 地图容器的id
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
      that.map.on('load', function() {
        that.getbianJson(0)
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
        } else if (that.map.getSource('maine') !== undefined) {
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
          var line = turf.lineString(bound)
          var bbox = turf.bbox(line)
          that.map.fitBounds(bbox, {
            padding: { bottom: 30 }
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
        const line1 = turf.lineString(dataz.json.features.geometry.coordinates[0][0])
        const bbox1 = turf.bbox(line1)
        that.map.fitBounds(bbox1, {
          padding: { bottom: 30 }
        })
        that.length = dataz.json.features.length
      }
    },
    addRegion() {
      var that = this
      if (this.isRegionExistence === false) {
        for (let index = 0; index < this.point.length; index++) {
          const element = this.point[index]
          that.mapdata.push({ 'type': 'Feature', 'properties': element.properties, 'geometry': { 'type': 'Point', 'coordinates': element.coordinates }})
        }
        that.allMapData.push({
          'type': 'FeatureCollection',
          'crs': { 'type': 'name', 'properties': { 'name': 'urn:ogc:def:crs:OGC:1.3:CRS84' }}, 'features': that.mapdata
        })
        that.map.addSource('earthquakes', {
          type: 'geojson',
          data: that.allMapData[0]
        })
        that.map.addLayer({
          id: 'unclustered-point',
          type: 'circle',
          source: 'earthquakes',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': '#11b4da',
            'circle-radius': 4,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
          }
        })
      } else {
        that.map.getSource('earthquakes').setData(that.allMapData[0])
      }
    },
    // 通过添加点方向判断经纬度
    add() {
      var that = this
      const data = that.map.getSource('earthquakes')._data.features
      var coordinatesData = [] // 获取风传播点
      for (let index = 0; index < data.length; index++) {
        const element = data[index]
        // 根据方向判断经纬度加减
        if (element.properties.direction === '西南') {
          coordinatesData.push({ properties: element.properties, geometry: element.geometry, frist: -1, second: -1, midfrist: 1, midsecond: 1 })
        } else if (element.properties.direction === '东北') {
          coordinatesData.push({ properties: element.properties, geometry: element.geometry, frist: 1, second: 1, midfrist: 1, midsecond: 1 })
        } else if (element.properties.direction === '东南') {
          coordinatesData.push({ properties: element.properties, geometry: element.geometry, frist: 1, second: -1, midfrist: 1, midsecond: 1 }) // 东南为什么是-+
        } else if (element.properties.direction === '西北') {
          coordinatesData.push({ properties: element.properties, geometry: element.geometry, frist: -1, second: 1, midfrist: 1, midsecond: 1 })
        } else if (element.properties.direction === '东') {
          coordinatesData.push({ properties: element.properties, geometry: element.geometry, frist: 1, second: -1, midfrist: 1, midsecond: 0 })
        } else if (element.properties.direction === '西') {
          coordinatesData.push({ properties: element.properties, geometry: element.geometry, frist: -1, second: 1, midfrist: 1, midsecond: 0 })
        } else if (element.properties.direction === '南') {
          coordinatesData.push({ properties: element.properties, geometry: element.geometry, frist: 1, second: -1, midfrist: 0, midsecond: 1 })
        } else if (element.properties.direction === '北') {
          coordinatesData.push({ properties: element.properties, geometry: element.geometry, frist: -1, second: 1, midfrist: 0, midsecond: 1 })
        }
      }
      // 添加扩散数据
      this.dire(coordinatesData)
    },
    // 预测动画
    // (-1,0)
    // --------
    //      / |
    //     /  |
    //    /   |
    //   /    |(0,-1)
    // (-√2/2,-√2/2)
    dire(coordinatesData) {
      var that = this
      var speed = 0.01
      var Side = Math.sqrt(3) / 3
      var midData = []
      for (let index = 0; index < coordinatesData.length; index++) {
        const frist = coordinatesData[index].frist
        const second = coordinatesData[index].second
        const midfrist = coordinatesData[index].midfrist
        const midsecond = coordinatesData[index].midsecond
        const center = coordinatesData[index].geometry.coordinates
        const power = coordinatesData[index].properties.power
        const direction = coordinatesData[index].properties.direction
        const id = coordinatesData[index].properties.id
        const aNumberx = (0.01 - 0.004) * Math.random() + 0.004
        const aNumbery = (0.01 - 0.005) * Math.random() + 0.005
        if (direction === '北' || direction === '南') {
          // 根据风速判断传播距离
          for (let i = 0; i < power; i++) {
            midData.push({ 'type': 'Feature', 'properties': { 'i': i + '上', 'id': id, 'center': center, 'color': i, 'size': i }, 'geometry': { 'type': 'Point', 'coordinates': [center[0] - frist * (i + 1) * aNumberx * Side, center[1] + second * (i + 1) * aNumberx] }})
            midData.push({ 'type': 'Feature', 'properties': { 'i': i + '中', 'id': id, 'center': center, 'color': i, 'size': i }, 'geometry': { 'type': 'Point', 'coordinates': [center[0] + midfrist * frist * (i + 1) * speed, center[1] + midsecond * second * (i + 1) * speed] }})
            midData.push({ 'type': 'Feature', 'properties': { 'i': i + '下', 'id': id, 'center': center, 'color': i, 'size': i }, 'geometry': { 'type': 'Point', 'coordinates': [center[0] + frist * (i + 1) * aNumbery * Side, center[1] + second * (i + 1) * aNumbery] }})
          }
        } else if (direction === '东' || direction === '西') {
          // 根据风速判断传播距离
          for (let i = 0; i < power; i++) {
            midData.push({ 'type': 'Feature', 'properties': { 'i': i + '上', 'id': id, 'center': center, 'color': i, 'size': i }, 'geometry': { 'type': 'Point', 'coordinates': [center[0] + frist * (i + 1) * aNumberx, center[1] + second * (i + 1) * aNumberx * Side] }})
            midData.push({ 'type': 'Feature', 'properties': { 'i': i + '中', 'id': id, 'center': center, 'color': i, 'size': i }, 'geometry': { 'type': 'Point', 'coordinates': [center[0] + midfrist * frist * (i + 1) * speed, center[1] + midsecond * second * (i + 1) * speed] }})
            midData.push({ 'type': 'Feature', 'properties': { 'i': i + '下', 'id': id, 'center': center, 'color': i, 'size': i }, 'geometry': { 'type': 'Point', 'coordinates': [center[0] + frist * (i + 1) * aNumbery, center[1] - second * (i + 1) * aNumbery * Side] }})
          }
        } else {
          for (let i = 0; i < power; i++) {
            midData.push({ 'type': 'Feature', 'properties': { 'i': i + '上', 'id': id, 'center': center, 'color': i, 'size': i }, 'geometry': { 'type': 'Point', 'coordinates': [center[0] + frist * (i + 1) * aNumberx, center[1] + second * (i + 1) * aNumberx * Side] }})
            midData.push({ 'type': 'Feature', 'properties': { 'i': i + '中', 'id': id, 'center': center, 'color': i, 'size': i }, 'geometry': { 'type': 'Point', 'coordinates': [center[0] + midfrist * frist * (i + 1) * speed, center[1] + midsecond * second * (i + 1) * speed] }})
            midData.push({ 'type': 'Feature', 'properties': { 'i': i + '下', 'id': id, 'center': center, 'color': i, 'size': i }, 'geometry': { 'type': 'Point', 'coordinates': [center[0] + frist * (i + 1) * aNumbery * Side, center[1] + second * (i + 1) * aNumbery] }})
          }
        }
      }
      that.spreaddata = {
        'type': 'FeatureCollection',
        'crs': { 'type': 'name', 'properties': { 'name': 'urn:ogc:def:crs:OGC:1.3:CRS84' }}, 'features': midData
      }
      var isExistence = false
      var layers = that.map.getStyle().layers
      for (let index = 0; index < layers.length; index++) {
        const element = layers[index].id
        if (element === 'spread-point') {
          isExistence = true
        }
      }
      if (isExistence === false) {
        that.map.addSource('spread', {
          type: 'geojson',
          data: that.spreaddata
        })
        that.map.addLayer({
          id: 'spread-point',
          type: 'circle',
          source: 'spread',
          filter: ['<=', 'color', 0],
          paint: {
            'circle-color': [
              'interpolate',
              ['linear'],
              ['get', 'color'],
              0, '#D00000',
              1, '#D50000',
              2, '#FF0A0A',
              3, '#FF1F1F',
              4, '#FF3333',
              5, '#FF4747',
              6, '#FF5C5C'
            ],
            'circle-opacity': 0.75,
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['get', 'size'],
              1, 4,
              2, 6,
              3, 8,
              4, 10,
              5, 12,
              6, 14,
              7, 16,
              8, 18,
              9, 20,
              10, 22,
              11, 24,
              12, 26
            ]
          }
        })
      } else {
        that.map.setLayoutProperty('spread-point', 'visibility', 'visible')
        that.map.getSource('spread').setData(that.spreaddata)
      }
      clearInterval(that.ding)
      this.time()
    },
    // 动画播放
    time(params) {
      var that = this
      var colorsize = 0
      that.ding = setInterval(() => {
        that.map.setFilter('spread-point', ['<=', 'color', colorsize])
        colorsize++
        if (colorsize > 6) {
          colorsize = 0
        }
      }, 200)
    },
    // 添加范围
    Range() {
      var that = this
      that.mianData = []
      clearInterval(that.ding)
      that.map.setLayoutProperty('spread-point', 'visibility', 'none')
      const data = that.map.getSource('spread')._data.features
      const map1 = data.reduce((result, item) => {
        result[item.properties.id] = result[item.properties.id] || []
        result[item.properties.id].push(item)
        return result
      }, {})
      // result即为所求
      const result = Object.values(map1)
      // 线范围数据
      var rangeMian = []
      // 面范围数据
      var rangeData = []
      // 热力图数据
      var heatData = []
      for (let index = 0; index < result.length; index++) {
        const element = result[index]
        var element1, element2, element3
        const properties = result[index][0].properties
        const element0 = element[0].properties.center
        for (let i = 0; i < element.length; i++) {
          const ele1 = element[i]
          if (ele1.properties.i === element.length / 3 - 1 + '上') {
            element1 = ele1.geometry.coordinates
          } else if (ele1.properties.i === element.length / 3 - 1 + '中') {
            element2 = ele1.geometry.coordinates
          } else if (ele1.properties.i === element.length / 3 - 1 + '下') {
            element3 = ele1.geometry.coordinates
          }
        }
        const originline = turf.lineString([element0, element1, element2, element3, element0])
        const bezierline = turf.bezierSpline(originline)
        const coordinates = bezierline.geometry.coordinates
        var mian3 = []
        var mian0 = []
        var mian1 = []
        var mian2 = []
        mian3.push(element0)
        mian0.push(element0)
        mian1.push(element0)
        mian2.push(element0)
        // 热力图和面数据
        for (let index = 1; index < coordinates.length; index++) {
          const element = coordinates[index]
          const x0 = (3 * coordinates[0][0] + element[0]) / 4
          const y0 = (3 * coordinates[0][1] + element[1]) / 4
          const x1 = (coordinates[0][0] + element[0]) / 2
          const y1 = (coordinates[0][1] + element[1]) / 2
          const x2 = (coordinates[0][0] + element[0] * 3) / 4
          const y2 = (coordinates[0][1] + element[1] * 3) / 4
          mian3.push(coordinates[index])
          mian0.push([x0, y0])
          mian1.push([x1, y1])
          mian2.push([x2, y2])
        }
        mian3.push(element0)
        mian0.push(element0)
        mian1.push(element0)
        mian2.push(element0)
        const mianALL = [mian0, mian1, mian2, mian3]
        for (let i = 0; i < mianALL.length; i++) {
          const element = mianALL[i]
          const line = turf.lineString(element)
          const bbox = turf.bbox(line)
          for (let index = 0; index < 100; index++) {
            const x = (bbox[2] - bbox[0]) * Math.random() + bbox[0]
            const y = (bbox[3] - bbox[1]) * Math.random() + bbox[1]
            const pt = turf.point([x, y])
            const poly = turf.polygon([element])
            const is = turf.booleanPointInPolygon(pt, poly)
            if (is) {
              const aNumber = (6 - i) * Math.random() + 0
              heatData.push({
                'type': 'Feature',
                'properties': { 'mag': aNumber * 1 },
                'geometry': {
                  'type': 'Point',
                  'coordinates': [x, y]
                }
              })
            }
          }
        }
        rangeMian.push({ 'type': 'Feature',
          'properties': { color: 3 },
          'geometry': {
            'type': 'Polygon',
            'coordinates': [mian3]
          }
        })
        rangeMian.push({ 'type': 'Feature',
          'properties': { color: 2 },
          'geometry': {
            'type': 'Polygon',
            'coordinates': [mian2]
          }
        })
        rangeMian.push({ 'type': 'Feature',
          'properties': { color: 1 },
          'geometry': {
            'type': 'Polygon',
            'coordinates': [mian1]
          }
        })
        rangeMian.push({ 'type': 'Feature',
          'properties': { color: 0 },
          'geometry': {
            'type': 'Polygon',
            'coordinates': [mian0]
          }
        })
        // 边界线
        rangeData.push({ 'type': 'Feature', 'properties': properties,
          'geometry': {
            'type': 'LineString',
            'coordinates': coordinates }
        })
        // 边界面
      }
      that.heatPoint = {
        'type': 'FeatureCollection',
        'crs': { 'type': 'name', 'properties': { 'name': 'urn:ogc:def:crs:OGC:1.3:CRS84' }}, 'features': heatData
      }
      that.mianData = {
        'type': 'FeatureCollection',
        'crs': { 'type': 'name', 'properties': { 'name': 'urn:ogc:def:crs:OGC:1.3:CRS84' }}, 'features': rangeMian
      }
      that.nullData.features = rangeData
      if (that.isExistence === false) {
        that.isExistence = true
        // 点数据
        that.map.addSource('mianData', {
          'type': 'geojson',
          'data': that.mianData
        })
        that.map.addLayer({
          'id': 'fillmaine',
          'type': 'fill',
          'source': 'mianData',
          'layout': {},
          'paint': {
            'fill-color': [
              'match',
              ['get', 'color'],
              0, 'rgba(213,6,33,0.8)',
              1, 'rgba(176,38,38,0.8)',
              2, 'rgba(64,60,53,0.8)',
              3, 'rgba(23,166,125,0.8)',
              /* other */ 'rgba(0,255,170,0.8)'
            ],
            'fill-opacity': 0.8
          }
        })
        // 点数据
        that.map.addSource('point', {
          'type': 'geojson',
          'data': that.heatPoint
        })
        // 热力图
        that.map.addLayer({
          'id': 'earthquakes-heat',
          'type': 'heatmap',
          'source': 'point',
          'paint': {
            'heatmap-weight': [
              'interpolate',
              ['linear'],
              ['get', 'mag'],
              0, 0,
              6, 1
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
            'heatmap-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0, 2,
              9, 4,
              10, 6,
              12, 8,
              14, 10,
              16, 12
            ],
            'heatmap-opacity': 1
          }
        })
        // 范围线
        // this.map.addSource('draw', {
        //   type: 'geojson',
        //   data: that.nullData })
        // this.map.addLayer({
        //   id: 'draw',
        //   type: 'line',
        //   source: 'draw',
        //   layout: {},
        //   paint: {
        //     // 'fill-color': '#1e32c9',
        //     'line-color': 'rgb(4,142,188)'
        //     // 'fill-opacity': 0.3
        //   }
        // })
      } else {
        that.map.getSource('point').setData(that.heatPoint)
        that.map.setLayoutProperty('fillmaine', 'visibility', 'visible')
        that.map.setLayoutProperty('earthquakes-heat', 'visibility', 'visible')
        that.map.getSource('mianData').setData(that.mianData)
      }
    },
    fanwei() {
      if (this.isExistence === true) {
        if (this.map.getLayoutProperty('fillmaine', 'visibility') === 'visible') {
          this.map.setLayoutProperty('fillmaine', 'visibility', 'none')
        } else {
          this.map.setLayoutProperty('fillmaine', 'visibility', 'visible')
        }
      } else {
        this.$message({
          message: '请先进行危害预测！',
          type: 'warning',
          showClose: true
        })
      }
    },
    heatmap() {
      if (this.isExistence === true) {
        if (this.map.getLayoutProperty('earthquakes-heat', 'visibility') === 'visible') {
          this.map.setLayoutProperty('earthquakes-heat', 'visibility', 'none')
        } else {
          this.map.setLayoutProperty('earthquakes-heat', 'visibility', 'visible')
        }
      } else {
        this.$message({
          message: '请先进行危害预测！',
          type: 'warning',
          showClose: true
        })
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
#GraphMovie {
  position: absolute;
  height: 100%;
  width: 100%;
  /* background: url("../public/img/back.png") no-repeat center center; */
  /* 背景图不平铺 */
  background-size: cover;
  /* 让背景图基于容器大小伸缩 */
  background-attachment: fixed;
  /* 当内容高度大于图片高度时，背景图像的位置相对于viewport固定 */
  background-color: #CCCCCC;
}
/* 地图 */
#map1 {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 0;
}
#GraphMovie ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
#GraphMovie .type {
  position: absolute;
  z-index: 10;
  top: 55px;
  right: 5px;
  font-family: KuHei;
  font-size: 14px;
}
#GraphMovie .type li {
  width: 100px;
  height: 35px;
  text-align: center;
  padding: 5px 0;
  cursor: pointer;
  border-radius: 2px;
  color: rgb(202, 202, 202);
  background-color: rgba(79, 133, 177, 0.3);
  border: 1.5px solid #0fafeb;
  transition: all 0.5s;
  margin-bottom: 5px;
}
#GraphMovie .type li:hover {
  color: rgb(230, 230, 230);
}
</style>
