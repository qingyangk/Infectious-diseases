<template>
  <div id="signalling">
    <!-- 地图 -->
    <div id="siganMap" />
    <!-- 查询类型 -->
    <div class="type">
      <ul>
        <li class="CircleSearch" @click="DrawPolygon()"><icon-svg icon-class="icon-jihechaxun1" /><span> 几何查询</span></li>
      </ul>
    </div>
    <!-- 参数 -->
    <div id="setup">
      <!-- 标题 -->
      <div class="title">
        手机信令监测
      </div>
      <!-- 时间 -->
      <div class="fTime">
        <i class="el-icon-d-arrow-left img" style="font-size:21px" @click="ReduceTime()" />
        <el-date-picker v-model="timx" type="date" placeholder="选择日期" :picker-options="pickerOptions" :editable="false" @change="STime()" />
        <i class="el-icon-d-arrow-right img" style="font-size:21px" @click="IncreaseTime()" />
      </div>
      <!-- 监测 -->
      <div class="fMonitor">
        <el-radio v-model="x" label="24" @change="bamonitor(24)">24H</el-radio>
        <el-radio v-model="x" label="12" @change="bamonitor(12)">12H</el-radio>
      </div>
      <!-- 播放 -->
      <div id="play" class="play" @click="bofang()">
        <icon-svg :icon-class="ioc" class="img" />
        <p class="xuanfu">自动播放</p>
      </div>
    </div>
    <!-- 监测 -->
    <div id="amonitor">
      <ul>
        <li v-for="(value, item) in timAxis" :key="item" class="public">
          <div class="yuan"> <!-- 中间的点 -->
            <p class="zi">{{ value.name }}</p> <!-- 上面的数字 -->
            <i class="xian" /> <!-- 中间的线 -->
            <div class="zhong" @mousedown.prevent="m1($event)" />
          </div>
        </li>
      </ul>
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
import Router from './router'
import SelectRegion from './selectRegion'
import eventBus from '../public/js/EvebtBus'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
// import { DrawPolygon } from '@antv/l7-draw'
import { Mapbox } from '@antv/l7-maps'
import { Scene, LineLayer } from '@antv/l7'
import mapboxgl from 'mapbox-gl'

export default {
  name: 'Signalling',
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
      timx: '', // 时间
      pickerOptions: {
        disabledDate: time => {
          return time > new Date().getTime()
        }
      },
      // 数据
      x: '24',
      bfang: true,
      ioc: 'icon-zanting',
      range: '116.56691434514534 33.949998777225446,120.82082005870241 33.87706006551283,120.0473822904817 29.496303120058773,116.3032424701454 29.756064928102816,116.56691434514534 33.949998777225446',
      // 时间轴
      index: 0, // 索引
      timer: null, // 定时器
      canMove: false, // 移动
      timAxis: [],
      datas: [],
      length: 0, // 长度
      fenData: [],
      lineLayer: null,
      // 绘制
      draw: null,
      c: 0,
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
      }
    }
  },
  beforeDestroy() {
    eventBus.$off('json')
    document.getElementById('signalling').style.display = 'none'
    clearInterval(this.timer)
    this.timer = null
  },
  mounted() {
    var that = this
    // 地图
    this.int()
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
  },
  methods: {
    // 创建地图
    int() {
      mapboxgl.accessToken = 'pk.eyJ1Ijoid3VqaW5odWkwIiwiYSI6ImNrdDFoZWphNDBhaGszMXBoazZ1dWdwMWkifQ.AX5nvyCpK8yKsCqyz36rsw' // 你的accessToken
      this.map = new mapboxgl.Map({
        container: 'siganMap', // 地图容器的id
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
      this.map['doubleClickZoom'].disable()
      var that = this
      this.scene = new Scene({
        id: 'siganMap',
        map: new Mapbox({
          mapInstance: that.map
        })
      })
      this.map.on('load', () => {
        var layers = that.map.getStyle().layers
        // eslint-disable-next-line no-unused-vars
        var labelLayerId
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
            labelLayerId = layers[i].id
            break
          }
        }
        that.getbianJson(0)
        // modes.static = StaticMode
        this.draw = new MapboxDraw({
          displayControlsDefault: false,
          controls: {
            polygon: false,
            trash: false
          }
        })
        that.map.addControl(this.draw)
        that.map.on('draw.create', this.compDraw) // 创建完成时
      })
      // this.scene.on('loaded', () => {
      //   // 编辑
      //   that.draw = new DrawPolygon(this.scene, {
      //     editEnable: false,
      //     selectEnable: false
      //   })
      // })
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
    // 销毁
    // 轨迹线
    startLine(data) {
      var wayData = []
      for (let index = 0; index < data.length; index++) {
        var way = []
        const datai = data[index]
        for (let j = 0; j < datai.length; j++) {
          const element = datai[j]
          way.push([element[0] * 1, element[1] * 1])
        }
        var str = '#'
        var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']
        for (var i = 0; i < 6; i++) {
          var num = parseInt(Math.random() * 16)
          str += arr[num]
        }
        wayData.push({ color: str, path: way })
      }
      if (this.lineLayer === null) {
        this.lineLayer = new LineLayer()
          .source(wayData, {
            parser: {
              type: 'json',
              coordinates: 'path'
            }
          })
          .size(1.5)
          .shape('line')
          .color('color', v => {
            return `${v}`
          })
          .animate({
            interval: 0.6,
            trailLength: 1,
            duration: 2
          })
        this.scene.addLayer(this.lineLayer)
      } else {
        this.lineLayer.setData(wayData)
      }
    },
    compDraw(e) {
      var that = this
      setTimeout(() => {
        this.draw.deleteAll()
      }, 200)
      var geoData = []
      for (let index = 0; index < e.features[0].geometry.coordinates[0].length; index++) {
        const element = e.features[0].geometry.coordinates[0][index]
        geoData.push(element)
      }
      var data = ''
      for (let index = 0; index < geoData.length; index++) {
        const x = geoData[index][0]
        const y = geoData[index][1]
        if (index !== geoData.length - 1) {
          data += x + ' ' + y + ','
        } else {
          data += x + ' ' + y
        }
      }
      that.range = data
      this.getHJson()
      var isExistence = false
      var layers = that.map.getStyle().layers
      for (let index = 0; index < layers.length; index++) {
        const element = layers[index].id
        if (element === 'drawPolygon') {
          isExistence = true
        }
      }
      that.nullData.features[0].geometry.coordinates = [geoData]
      if (isExistence === false) {
        this.map.addSource('drawdata', {
          type: 'geojson',
          data: that.nullData })
        this.map.addLayer({
          id: 'drawPolygon',
          type: 'fill',
          source: 'drawdata',
          layout: {},
          paint: {
            'fill-color': 'rgb(4,142,188)',
            'fill-opacity': 0.3
          }
        })
        this.map.addLayer({
          id: 'drawLine',
          type: 'line',
          source: 'drawdata',
          layout: {},
          paint: {
            'line-color': '#ff7979',
            'line-width': 1,
            'line-opacity': 0.7
          }
        })
      } else {
        this.map.getSource('drawdata').setData(that.nullData)
      }
    },
    DrawPolygon() {
      if (this.json.name !== '中国') {
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
      } else {
        this.$message({
          message: '请选择城市！',
          type: 'warning',
          showClose: true
        })
      }
    },
    // X轴
    xZhou() {
      this.timAxis = []
      for (let i = 0; i < this.x * 1; i++) {
        var gong = {}
        gong.name = i + '时'
        this.timAxis.push(gong)
      }
    },
    // 切换数据
    SwitchData() {
      var that = this
      var zhongs = document.querySelectorAll('.zhong') // 当前的点
      var zhong = zhongs[0] // 第一个点
      var yuans = document.querySelectorAll('.yuan') // 中间的点
      var zis = document.querySelectorAll('.zi') // 上面的数字
      var xians = document.querySelectorAll('.xian') // 中间的线
      if (that.index < that.x * 1) {
        if (that.index > 0) {
          yuans[that.index - 1].className = 'yuan yuans'
          xians[that.index - 1].className = 'xian xuan'
          zhong.style.left = 38 * that.index + 6 + 'px'
        }
        // 没结束时
        zis[that.index].className = 'zi guo'
        if (that.index < that.x * 1) {
          xians[that.index].className = 'xian xuans'
        }
        that.Exhibition(that.index)
        that.index++
      } else {
        // 结束时
        for (let i = 0; i < yuans.length; i++) {
          yuans[i].className = 'yuan'
        }
        for (let i = 0; i < zis.length; i++) {
          zis[i].className = 'zi'
        }
        for (let i = 0; i < xians.length; i++) {
          xians[i].className = 'xian'
        }
        zhong.style.left = 6 + 'px'
        zis[0].className = 'zi guo'
        xians[0].className = 'xian xuans'
        that.Exhibition(0)
        // index为0时的值
        that.index = 1 // 为防止动画重复
      }
    },
    // 点选
    d1() {
      var that = this
      var zhongs = document.querySelectorAll('.zhong') // 当前的点
      var zhong = zhongs[0] // 第一个点
      var yuans = document.querySelectorAll('.yuan') // 中间的点
      var zis = document.querySelectorAll('.zi') // 上面的数字
      var xians = document.querySelectorAll('.xian') // 中间的线
      for (let i = 0; i < yuans.length; i++) {
        yuans[i].setAttribute('index', i)
        yuans[i].addEventListener('click', function() {
        // 获取索引
          that.index = this.getAttribute('index') * 1
          // 恢复样式
          for (let i = that.index; i < yuans.length; i++) {
            yuans[i].className = 'yuan'
          }
          for (let i = that.index; i < zis.length; i++) {
            zis[i].className = 'zi'
          }
          for (let i = that.index; i < xians.length; i++) {
            xians[i].className = 'xian'
          }
          // 赋予样式
          for (let i = 0; i < that.index; i++) {
            yuans[i].className = 'yuan yuans'
          }
          for (let i = 0; i <= that.index; i++) {
            zis[i].className = 'zi guo'
          }
          for (let i = 0; i < that.index; i++) {
            xians[i].className = 'xian xuan'
          }
          zhong.style.left = 38 * that.index + 6 + 'px'
          // 展示值
          that.Exhibition(that.index)
          // 重新赋予定时器
          clearInterval(that.timer)
          that.timer = null
          that.timer = setInterval(() => {
          // 切换数据方法
            that.SwitchData()
          }, 2000)
          that.index++ // 为防止动画重复
        })
      }
    },
    // 移动
    m1(event) {
      var that = this
      var zhongs = document.querySelectorAll('.zhong') // 当前的点
      var zhong = zhongs[0] // 第一个点
      var yuans = document.querySelectorAll('.yuan') // 中间的点
      var zis = document.querySelectorAll('.zi') // 上面的数字
      var xians = document.querySelectorAll('.xian') // 中间的线
      const x = event.pageX - zhong.offsetLeft
      this.canMove = true
      var left = 0
      document.onmousemove = function(e) {
        if (that.canMove) {
          left = e.clientX - x
          if (left < 0) left = 0
          var maxLeft = (that.x * 1 - 1) * 38 + 6
          var minLeft = 6
          if (left > maxLeft) left = maxLeft
          if (left < minLeft) left = minLeft
          zhong.style.left = left + 'px'
        }
      }
      document.onmouseup = function() {
        var zheng = Math.round(left / 38)
        zhong.style.left = zheng * 38 + 6 + 'px'
        // 获取索引
        that.index = zheng
        // 恢复样式
        for (let i = that.index; i < yuans.length; i++) {
          yuans[i].className = 'yuan'
        }
        for (let i = that.index; i < zis.length; i++) {
          zis[i].className = 'zi'
        }
        for (let i = that.index; i < xians.length; i++) {
          xians[i].className = 'xian'
        }
        // 赋予样式
        for (let i = 0; i < that.index; i++) {
          yuans[i].className = 'yuan yuans'
        }
        for (let i = 0; i <= that.index; i++) {
          zis[i].className = 'zi guo'
        }
        for (let i = 0; i < that.index; i++) {
          xians[i].className = 'xian xuan'
        }
        // 展示值
        that.Exhibition(that.index)
        // 重新赋予定时器
        clearInterval(that.timer)
        that.timer = null
        that.timer = setInterval(() => {
          // 切换数据方法
          that.SwitchData()
        }, 2000)
        that.index++ // 为防止动画重复
        // 关闭移动
        that.canMove = false
        document.onmousemove = null
        document.onmouseup = null
      }
    },
    // 展示值方法
    Exhibition(e) {
      // 点数据
      var that = this
      var result = []
      if (this.datas[e] !== undefined && this.datas[e].length !== 0) {
        const map = this.datas[e].reduce((result, item) => {
          result[item.编号] = result[item.编号] || []
          result[item.编号].push(item)
          return result
        }, {})
        // result即为所求
        result = Object.values(map)
      } else {
        that.startLine(result)
      }
      var length = result.length
      var sLength = 0
      var lineAll = []
      for (let index = 0; index < result.length; index++) {
        // var data = []
        const element = result[index]
        // for (let i = 0; i < element.length; i++) {
        //   const element2 = element[i]
        //   data.push([element2.x * 1, element2.y * 1])
        // }
        // lineAll.push(data)
        // 自动校准
        const coords = [[element[0].x * 1, element[0].y * 1],
          [element[element.length - 1].x * 1, element[element.length - 1].y * 1]]
        const newCoords = coords.join(';')
        fetch(
          'https://api.mapbox.com/directions/v5/mapbox/cycling/' + newCoords + '?steps=true&geometries=geojson&access_token=' + mapboxgl.accessToken
        )
          .then(res => res.json())
          .then(data => {
            const data1 = data.routes[0]
            if (data1 !== undefined) {
              const route = data1.geometry.coordinates
              lineAll.push(route)
              sLength++
            }
            if (sLength === length) {
              that.startLine(lineAll)
            }
          })
      }
    },
    // 请求数据
    getHJson() {
      document.getElementById('bg').style.display = 'block' // 遮罩
      var that = this
      that.c++ // 防止点击事件多次
      that.datas = [] // 重置
      var data = {}
      data.where = that.json.where
      data.name = that.json.name
      data.range = that.range
      data.timz = that.checkTime4(new Date(that.timx))
      data.timx = that.checkTime4(new Date((new Date(that.timx)).getTime() + 24 * 60 * 60 * 1000))
      that.$store.dispatch('ncity/QCStroke', data).then((datas) => {
        // 时间轴
        that.xZhou()
        for (let i = 0; i < that.x * 1; i++) {
          that.datas.push([])
        }
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
        // 定时器
        setTimeout(function() {
          that.SwitchData()
          if (that.c === 1) {
            that.d1()
          }
        }, 200)
        // 重新赋予定时器
        clearInterval(that.timer)
        that.timer = null
        that.timer = setInterval(() => {
          // 切换数据方法
          that.SwitchData()
        }, 2000)
        document.getElementById('bg').style.display = 'none' // 遮罩
      })
    },
    // 自动播放
    bofang() {
      var that = this
      if (that.json.name === '' || that.json.name === '中国') {
        that.$message({
          message: '请选择城市！',
          type: 'warning',
          showClose: true
        })
      } else {
        if (that.bfang === false) {
          that.bfang = true
          that.ioc = 'icon-zanting'
          clearInterval(that.timer)
          that.timer = null
          that.timer = setInterval(() => {
            // 切换数据方法
            that.SwitchData()
          }, 2000)
        } else {
          that.bfang = false
          that.ioc = 'icon-bofang'
          clearInterval(that.timer)
          that.timer = null
        }
      }
    },
    // 切换时间间隔
    bamonitor(e) {
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
        clearInterval(this.timer)
        this.timer = null
        this.timer = setInterval(() => {
          // 切换数据方法
          this.SwitchData()
        }, 2000)
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
        clearInterval(this.timer)
        this.timer = null
        this.timer = setInterval(() => {
          // 切换数据方法
          this.SwitchData()
        }, 2000)
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
        clearInterval(this.timer)
        this.timer = null
        this.timer = setInterval(() => {
          // 切换数据方法
          this.SwitchData()
        }, 2000)
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
#botton {
  position: absolute;
  top: 10%;
  left: 10%;
  z-index: 10;
}
/* 地图 */
#siganMap {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
}
/* L7logo */
#signalling >>> .l7-left .l7-control{
  display: none !important;
}
/* mapboxlogo */
#signalling >>>  .mapboxgl-ctrl-bottom-right{
  display: none !important;
}
#signalling {
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

/* 查询类型 */
#signalling ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
#signalling .type {
  position: absolute;
  z-index: 10;
  top: 55px;
  right: 5px;
  font-family: KuHei;
  font-size: 14px;
}
#signalling .type li {
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
#signalling .type li:hover {
  color: rgb(230, 230, 230);
}
/* 参数 */
#signalling #setup {
  position: absolute;
  width: calc(100% - 50px);
  left: 45px;
  bottom: calc(10% + 7px);
  height: 45px;
  line-height: 45px;
  font-family: KuHei;
  /* border: 1px solid rgba(25, 186, 139, 0.2);
  background: url("../public/img/bg.png") rgba(79, 133, 177, 0.3); */
  border: 1px solid #0fafeb;
  background: url("../public/img/bg.png") rgba(79, 133, 177, 0.3);
  color: #fff;
}
/* 标题 */
#signalling #setup .title {
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
#signalling #setup .fTime {
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
#signalling #setup .fTime::after {
  content: '';
  position: absolute;
  height: calc(100% - 2px);
  width: 2px;
  background-color: rgba(219, 219, 219, 0.555);
  right: 0;
  top: 0;
}
#signalling #setup .fTime >>> .el-input__prefix,
#signalling #setup .fTime >>> .el-input__suffix {
  display: none;
}
#signalling #setup .fTime >>> .el-input__inner {
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
#signalling #setup .fTime >>> .el-date-editor.el-input,
#signalling #setup .fTime >>> .el-date-editor.el-input__inner {
  width: 140px;
}
#signalling #setup .fTime .img {
  margin: 0 15px;
  height: 45px;
  line-height: 45px;
  cursor: pointer;
  color: rgb(199, 199, 199);
  transition: all 0.5s;
}
#signalling #setup .fTime .img:hover {
  color: #fff;
}
/* 监测模式 */
#signalling #setup .fMonitor {
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
#signalling #setup .fMonitor >>> .el-radio {
  color: #fff;
}
#signalling #setup .fMonitor >>> .el-radio__inner::after {
  left: 54.2%;
  top: 53.3%;
}
#signalling #setup .fMonitor >>> .el-radio__input.is-checked+.el-radio__label {
  color:#ff7979
9;
}
#signalling #setup .fMonitor >>> .el-radio__input.is-checked .el-radio__inner {
  border-color: #ff7979
;
  background: #ff7979
;
}
/* 播放 */
#signalling #setup .play {
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
#signalling #setup .play:hover {
  color: rgba(255, 255, 255, 1);
}
#signalling #setup .play .xuanfu {
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
#signalling #amonitor {
  position: absolute;
  width: calc(100% - 50px);
  left: 45px;
  height: 10%;
  bottom: 3px;
  font-family: KuHei;
  border: 1px solid #0fafeb;
  background: url("../public/img/bg.png") rgba(79, 133, 177, 0.3);
  z-index: 20;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
}
#signalling #amonitor p,
#signalling #amonitor ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
#signalling #amonitor ul {
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  margin-top: 2%;
}
/* 基础样式 */
#signalling #amonitor ul .public {
  vertical-align: top;
  height: 20px;
  line-height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
}
#signalling #amonitor ul .public .zhong {
  background-color: rgb(49, 107, 243);
  border: 2px solid #fff;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  position: absolute;
  z-index: 99;
  display: none;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
#signalling #amonitor ul .public:nth-child(1) .zhong {
  display: block;
  /* 38 * index + 6 */
  left: 6px;
}
#signalling #amonitor ul .public .yuan {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgb(164, 177, 215);
  margin: 0 13px;
  position: relative;
  cursor: pointer;
}
#signalling #amonitor ul .public .yuan .zi {
  position: absolute;
  color: rgb(164, 177, 215);
  font-family: 'element-icons';
  font-size: 1px;
  width: 35px;
  text-align: center;
  top: -30px;
  left: 50%;
  transform: translate(-50%, 0);
}
#signalling #amonitor ul .public .yuan .xian {
  position: absolute;
  width: 26px;
  height: 2.5px;
  background-color: rgb(218, 225, 245);
  left: 12px;
  top: 50%;
  transform: translate(0, -50%);
}
#signalling #amonitor ul .public:last-child .xian {
  display: none;
}
/* 过样式 */
#signalling #amonitor ul .public .yuans {
  /* 过去之后 */
  background-color: rgb(49, 107, 243);
}
#signalling #amonitor ul .public .yuan .guo {
  color: rgb(111, 119, 141);
}
#signalling #amonitor ul .public .yuan .xuans {
  /* 过去之前 */
  left: 14px;
}
#signalling #amonitor ul .public .yuan .xuan {
  /* 过去之后 */
  background-color: rgb(49, 107, 243);
}
/* 四角 */
#signalling #setup::after,
#signalling #amonitor::after {
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
#signalling #setup::before,
#signalling #amonitor::before {
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
  background-color: #ff7979
;
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
