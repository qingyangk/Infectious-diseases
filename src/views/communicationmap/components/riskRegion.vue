<template>
  <div id="risk">
    <div id="allmap" />
    <div id="goTip" />
    <!-- 参数 -->
    <div class="Mapwaper">
      <!-- 头 -->
      <div class="top">风险地域分析</div>
      <!-- 身子 -->
      <div class="body">
        <div class="Btop">时间选择</div>
        <div class="Bbody">
          <div class="fTime">
            <i class="el-icon-d-arrow-left img" style="font-size:21px" @click="ReduceTime()" />
            <el-date-picker v-model="timx" type="date" placeholder="选择日期" :picker-options="pickerOptions" :editable="false" @change="STime()" />
            <i class="el-icon-d-arrow-right img" style="font-size:21px" @click="IncreaseTime()" />
          </div>
        </div>
        <div class="Bbotton" @click="trafficchange"><i class="el-icon-s-promotion" />开始分析</div>
      </div>
      <!-- 尾巴 -->
      <div class="bottom">
        <div class="Mtop">位置选择</div>
        <div class="Mbody">
          <el-input id="suggestId" v-model="searchpoint" placeholder="请输入搜索点" />
          <div id="searchResultPanel" style="display: none" />
        </div>
        <div class="Mbotton" @click="dangNum"><i class="el-icon-message-solid" />风险计算</div>
      </div>
      <!-- 图表 -->
      <div class="BottomNTool">
        <div class="NumHo">居住地危险系数</div>
        <div id="CircleChart1" />
      </div>
    </div>
    <!-- 路由 -->
    <router />
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
// import axios from 'axios'
import inMap from 'inmap'
import Router from './router'
import * as echarts from 'echarts'
import jsdata from '../public/js/02.json'
import SelectRegion from './selectRegion'
import eventBuq from '../public/js/EvebtBus'
export default {
  components: {
    Router,
    SelectRegion
  },
  data() {
    return {
      json: {
        name: '中国'
      },
      mapmark: false,
      onecount: 0,
      threecount: 0,
      fivecount: 0,
      onenum: 0,
      threenum: 0,
      fivenum: 0,
      onedgIndex: '',
      threedgIndex: '',
      fivedgIndex: '',
      timedata: [],
      searchpoint: '',
      searchlng: '',
      pickerOptions: {
        disabledDate: time => {
          return time > new Date().getTime()
        }
      },
      searchlat: '',
      gtData: [],
      timx: '',
      nowtool: '',
      trfmap: {},
      lineData: [],
      A: [],
      localpoint: [],
      dangercount: [],
      inmap: null,
      center: [111.972287, 37.146389],
      zoom: 5
    }
  },
  mounted() {
    var that = this
    // 地名
    eventBuq.$on('json', Tiao => {
      this.json.where = Tiao.where
      this.json.name = Tiao.name
      that.dw()
    })
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
    this.getdata()
  },
  beforeDestroy() {
    eventBuq.$off('json')
  },
  methods: {
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
      }
    },
    initChart1() {
      document.getElementById('goTip').style.display = 'block'
      if (this.dangercount[2] < 3000) {
        document.getElementById('goTip').innerHTML = '周边风险较低'
        document.getElementById('goTip').style.color = 'rgba(34,139,34, 0.8)'
      } else if (this.dangercount[2] > 3000 && this.dangercount[2] < 6000) {
        document.getElementById('goTip').innerHTML = '周边风险中等'
        document.getElementById('goTip').style.color = 'rgba(255,140,0, 0.8)'
      } else if (this.dangercount[2] > 6000) {
        document.getElementById('goTip').innerHTML = '周边风险较高'
        document.getElementById('goTip').style.color = 'rgba(255, 62, 33, 0.9)'
      }
      echarts.init(document.getElementById('CircleChart1')).dispose()
      // 基于准备好的dom，初始化echarts实例
      var myChart1 = echarts.init(document.getElementById('CircleChart1'))
      var itemData = ['1', '3', '5']
      var seriesData = this.dangercount
      var color = [
        '#00b9f6',
        '#38a97d',
        '#ffb247',
        '#e75647',
        '#ea6d75',
        '#ea3b3b'
      ]
      var xAxisData = []
      var dataArr = []
      for (var i = 0; i < itemData.length; i++) {
        xAxisData.push(itemData[i])
        dataArr.push(seriesData[i])
      }
      function translateColor(index) {
        if (index > 5) {
          return translateColor(index - 5)
        }
        return index
      }

      // 使用刚指定的配置项和数据显示图表。
      myChart1.setOption({
        backgroundColor: '',
        grid: {
          top: '25%',
          left: '9%',
          right: '12%',
          bottom: '8%',
          containLabel: true
        },
        textStyle: {
          fontFamily: 'Orbitron'
        },
        tooltip: {
          // 提示信息
          show: 'true',
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
            shadowStyle: {
              color: 'rgba(112,112,112,0)'
            }
          },
          formatter: function(params) {
            // var unit = params[0].name.substring(params[0].name.indexOf('(') + 1, params[0].name.indexOf(')'))
            return params[0].name + '公里内：' + '危险系数为' + params[0].value
          },
          padding: [8, 10], // 内边距
          extraCssText: 'box-shadow: 0 0 3px rgba(255, 255, 255, 0.4);' // 添加阴影
        },
        xAxis: [
          {
            // x轴相关设置
            show: true,
            name: '公里',
            nameTextStyle: {
              fontSize: 15,
              fontWeight: 'bold',
              fontFamily: 'Microsoft YaHei',
              color: 'rgba(255,255,255,.7)'
            },
            type: 'category',
            nameLocation: 'end',
            nameGap: 8,
            axisLabel: {
              show: true,
              fontSize: 12,
              fontFamily: 'Microsoft YaHei',
              color: 'rgba(255,255,255,.7)',
              fontWeight: 'bold',
              interval: 0,
              margin: 16,
              formatter: function(params) {
                if (params.length > 6) {
                  params = params.substr(0, 6) + '...'
                } else {
                  // eslint-disable-next-line no-self-assign
                  params = params
                }
                return params
              }
            },
            axisLine: {
              show: true,
              symbol: ['none', 'arrow'],
              lineStyle: {
                color: 'rgba(255,255,255,.7)'
              }
            },
            data: xAxisData
          },
          {
            type: 'category',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            },
            splitArea: {
              show: false
            },
            splitLine: {
              show: false
            },
            data: xAxisData
          },
          {
            type: 'category',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false,
              fontSize: 16,
              fontFamily: 'Microsoft YaHei',
              color: 'rgba(255,255,255,.7)',
              fontWeight: 'bold',
              interval: 0,
              margin: 16,
              formatter: function(params) {
                if (params.length > 6) {
                  params = params.substr(0, 6) + '...'
                } else {
                  // eslint-disable-next-line no-self-assign
                  params = params
                }
                return params
              }
            },
            splitArea: {
              show: false
            },
            splitLine: {
              show: false
            },
            data: xAxisData
          }
        ],
        yAxis: {
          type: 'value',
          name: '系数',
          nameTextStyle: {
            fontSize: 15,
            fontFamily: 'Microsoft YaHei',
            fontWeight: 'bold',
            color: 'rgba(255,255,255,.7)'
          },
          minInterval: 20,
          nameLocation: 'end',
          nameGap: 10,
          splitLine: {
            show: false
          },
          axisLabel: {
            show: true,
            fontSize: 12,
            fontFamily: 'Orbitron',
            color: 'rgba(255,255,255,.7)'
          },
          axisLine: {
            show: true,
            symbol: ['none', 'arrow'],
            lineStyle: {
              color: '#05edfc'
            }
          }
        },
        series: [
          {
            // 中间的细柱条
            type: 'bar',
            stack: 1,
            xAxisIndex: 0,
            barWidth: 10,
            barGap: 5,
            z: 2,
            data: (function() {
              var itemArr = []
              for (var i = 1; i < dataArr.length + 1; i++) {
                var item = {
                  value: dataArr[i - 1],
                  itemStyle: {
                    normal: {
                      barBorderRadius: [50, 50, 0, 0],
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                          offset: 0,
                          color: color[translateColor(i) * 2 - 2]
                        },
                        {
                          offset: 1,
                          color: color[translateColor(i) * 2 - 1]
                        }
                      ])
                    }
                  }
                }
                itemArr.push(item)
              }
              return itemArr
            })()
          },
          {
            // 顶部的圆点
            type: 'scatter',
            stack: 1,
            symbolOffset: [0, 0], // 相对于原本位置的偏移量
            label: {
              normal: {
                show: false
              }
            },
            xAxisIndex: 2,
            symbolSize: 10,
            z: 2,
            data: (function() {
              var itemArr = []
              for (var i = 1; i < dataArr.length + 1; i++) {
                var item = {
                  value: 0,
                  itemStyle: {
                    normal: {
                      borderColor: '#fff',
                      borderWidth: 2,
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                          offset: 0,
                          color: color[translateColor(i) * 2 - 2]
                        },
                        {
                          offset: 1,
                          color: color[translateColor(i) * 2 - 1]
                        }
                      ])
                    }
                  }
                }
                itemArr.push(item)
              }
              return itemArr
            })()
          },
          {
            // 圆柱中的空隙部分
            type: 'bar',
            xAxisIndex: 1,
            barGap: '140%',
            data: dataArr,
            barWidth: 22,
            itemStyle: {
              normal: {
                barBorderRadius: [50, 50, 0, 0],
                color: '#0e2147'
              }
            },
            z: 1
          },
          {
            // 柱状图的外层边框
            type: 'bar',
            xAxisIndex: 2,
            barWidth: 25,
            barGap: 1,
            z: 0,
            data: (function() {
              var itemArr = []
              for (var i = 1; i < dataArr.length + 1; i++) {
                var item = {
                  value: dataArr[i - 1],
                  itemStyle: {
                    normal: {
                      barBorderRadius: [50, 50, 0, 0],
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                          offset: 0,
                          color: color[translateColor(i) * 2 - 2]
                        },
                        {
                          offset: 1,
                          color: color[translateColor(i) * 2 - 1]
                        }
                      ])
                    }
                  }
                }
                itemArr.push(item)
              }
              return itemArr
            })()
          }
        ]
      })
      window.addEventListener('resize', function() {
        var chart = echarts.init(document.getElementById('CircleChart1'))
        if (chart) {
          chart.resize() // 不报错
        }
      })
      myChart1
      // 使用刚指定的配置项和数据显示图表。
    },
    dw() {
      var that = this
      that.inmap.getMap().centerAndZoom(that.json.name)
      setTimeout(() => {
        console.log(that.inmap.getMap().getCenter())
        that.center = [that.inmap.getMap().getCenter().lng, that.inmap.getMap().getCenter().lat]
        that.zoom = that.inmap.getMap().getZoom()
        console.log(that.zoom)
      }, 1000)
    },
    crMape() {
      var that = this
      var data = this.gtData
      that.inmap = new inMap.Map({
        id: 'allmap',
        skin: 'WhiteLover',
        center: that.center,
        zoom: {
          value: that.zoom,
          show: false
        }
      })

      that.inmap.getMap().setMapStyle({
        style: 'dark'
      })

      // inmap.getMap().setMapType(BMAP_SATELLITE_MAP);

      var overlay = new inMap.GriddingOverlay({
        tooltip: {
          show: false,
          formatter: function(val) {
            return val.count
          }
        },
        style: {
          type: 'avg',
          normal: {
            size: 8,
            unit: 'px', // 单位像素
            padding: 1
          },
          mouseOver: {
            shadowColor: 'rgba(255, 250, 255, 1)',
            shadowBlur: 20
          },
          selected: {
            backgroundColor: 'rgba(184,0,0,1)'
          },
          colors: [
            'rgba(31,98,1,1)', // 绿
            'rgba(95,154,4,1)', // #5F9A04
            'rgba(139,227,7,1)', // #8BE307
            'rgba(218,134,9,1)', // #DA8609
            'rgba(220,54,6,1)', // #DC3606
            'rgba(218,2,8,1)', // #DA0208
            'rgba(148,1,2,1)', // #940102
            'rgba(92,1,0,1)' // #5C0100
          ]
        },
        data: data,
        event: {
          onState(state) {},
          onMouseClick(data, event) {}
        }
      })
      that.inmap.add(overlay)
      this.trfmap = that.inmap
      this.searchmap(that.inmap)
    },
    getdata() {
      this.crMape()
    },
    trafficchange() {
      if (this.json.name === '中国') {
        this.$message({
          message: '请选择城市！',
          type: 'warning',
          showClose: true
        })
      } else {
        document.getElementById('bg').style.display = 'block'
        setTimeout(() => {
          document.getElementById('bg').style.display = 'none'
        }, 5000)
        var data = []
        for (let index = 0; index < jsdata.length; index++) {
          const element = jsdata[index]
          const aNumber = (100 - 20) * Math.random() + 20
          const result = Math.floor(aNumber)
          data.push({
            count: result,
            geometry: { type: 'Point', coordinates: [element.lng, element.lat] }
          })
        }
        this.gtData = data
        this.getdata()
      }
    },
    searchmap(inmap) {
      var map = inmap.getMap()
      const that = this
      function G(id) {
        return document.getElementById(id)
      }
      // eslint-disable-next-line no-undef
      var ac = new BMap.Autocomplete({ // 建立一个自动完成的对象
        input: 'suggestId',
        location: map
      })
      ac.addEventListener('onhighlight', function(e) {
        // 鼠标放在下拉列表上的事件
        var str = ''
        var _value = e.fromitem.value
        var value = ''
        if (e.fromitem.index > -1) {
          value =
            _value.province +
            _value.city +
            _value.district +
            _value.street +
            _value.business
        }
        str =
          'FromItem<br />index = ' +
          e.fromitem.index +
          '<br />value = ' +
          value
        value = ''
        if (e.toitem.index > -1) {
          _value = e.toitem.value
          value =
            _value.province +
            _value.city +
            _value.district +
            _value.street +
            _value.business
        }
        str +=
          '<br />ToItem<br />index = ' +
          e.toitem.index +
          '<br />value = ' +
          value
        G('searchResultPanel').innerHTML = str
      })
      var myValue
      ac.addEventListener('onconfirm', function(e) {
        // 鼠标点击下拉列表后的事件
        var _value = e.item.value
        myValue =
          _value.province +
          _value.city +
          _value.district +
          _value.street +
          _value.business
        G('searchResultPanel').innerHTML =
          'onconfirm<br />index = ' +
          e.item.index +
          '<br />myValue = ' +
          myValue
        setPlace()
      })
      function setPlace() {
        function myFun() {
          var pp = local.getResults().getPoi(0).point // 获取第一个智能搜索的结果
          that.searchlng = pp.lng
          that.searchlat = pp.lat
          that.localpoint = pp
          map.centerAndZoom(pp, 15)
          // eslint-disable-next-line no-undef
          map.addOverlay(new BMap.Marker(pp))
          if (that.mapmark === true) {
            var allOverlay = map.getOverlays()
            map.removeOverlay(allOverlay[0])
          }
          if (that.mapmark === false) {
            that.mapmark = true
          }
        }
        // eslint-disable-next-line no-undef
        var local = new BMap.LocalSearch(map, {
          // 智能搜索
          onSearchComplete: myFun
        })
        local.search(myValue)
      }
    },
    dangNum() {
      const inmap = this.trfmap
      var map = inmap.getMap()
      const layerlen = map.getOverlays().length
      if (layerlen > 2) {
        var allOverlay = map.getOverlays()
        map.removeOverlay(allOverlay[0])
        map.removeOverlay(allOverlay[1])
        map.removeOverlay(allOverlay[2])
      }
      const that = this
      function rad(d) {
        return (d * Math.PI) / 180.0
      }

      function deg(x) {
        return (x * 180) / Math.PI
      }

      //  * @param {*} lng 经度 113.3960698
      //  * @param {*} lat 纬度 22.941386
      //  * @param {*} brng 方位角 45   ---- 正北方：000°或360°  正东方：090° 正南方：180°  正西方：270°
      //  * @param {*} dist 距离 9000
      function getLonAndLat(lng, lat, brng, dist) {
        // 大地坐标系资料WGS-84 长半径a=6378137 短半径b=6356752.3142 扁率f=1/298.2572236
        var a = 6378137
        var b = 6356752.3142
        var f = 1 / 298.257223563

        var lon1 = lng * 1
        var lat1 = lat * 1
        var s = dist
        var alpha1 = rad(brng)
        var sinAlpha1 = Math.sin(alpha1)
        var cosAlpha1 = Math.cos(alpha1)

        var tanU1 = (1 - f) * Math.tan(rad(lat1))
        var cosU1 = 1 / Math.sqrt(1 + tanU1 * tanU1)
        var sinU1 = tanU1 * cosU1
        var sigma1 = Math.atan2(tanU1, cosAlpha1)
        var sinAlpha = cosU1 * sinAlpha1
        var cosSqAlpha = 1 - sinAlpha * sinAlpha
        var uSq = (cosSqAlpha * (a * a - b * b)) / (b * b)
        var A =
          1 + (uSq / 16384) * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)))
        var B = (uSq / 1024) * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)))

        var sigma = s / (b * A)
        var sigmaP = 2 * Math.PI
        while (Math.abs(sigma - sigmaP) > 1e-12) {
          var cos2SigmaM = Math.cos(2 * sigma1 + sigma)
          var sinSigma = Math.sin(sigma)
          var cosSigma = Math.cos(sigma)
          var deltaSigma =
            B *
            sinSigma *
            (cos2SigmaM +
              (B / 4) *
                (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
                  (B / 6) *
                    cos2SigmaM *
                    (-3 + 4 * sinSigma * sinSigma) *
                    (-3 + 4 * cos2SigmaM * cos2SigmaM)))
          sigmaP = sigma
          sigma = s / (b * A) + deltaSigma
        }

        var tmp = sinU1 * sinSigma - cosU1 * cosSigma * cosAlpha1
        var lat2 = Math.atan2(
          sinU1 * cosSigma + cosU1 * sinSigma * cosAlpha1,
          (1 - f) * Math.sqrt(sinAlpha * sinAlpha + tmp * tmp)
        )
        var lambda = Math.atan2(
          sinSigma * sinAlpha1,
          cosU1 * cosSigma - sinU1 * sinSigma * cosAlpha1
        )
        var C = (f / 16) * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha))
        var L =
          lambda -
          (1 - C) *
            f *
            sinAlpha *
            (sigma +
              C *
                sinSigma *
                (cos2SigmaM +
                  C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)))

        // var revAz = Math.atan2(sinAlpha, -tmp) // final bearing
        var lngLatObj = [lon1 + deg(L), deg(lat2)]
        that.A = lngLatObj
        return lngLatObj
      }

      const j = this.searchlng
      const w = this.searchlat

      // 调用
      var b1
      var d1
      var n1
      var x1
      var b2
      var d2
      var n2
      var x2
      var b3
      var d3
      var n3
      var x3 = []
      getLonAndLat(j, w, 0, 500)
      b1 = JSON.parse(JSON.stringify(this.A))
      getLonAndLat(j, w, 90, 500)
      d1 = JSON.parse(JSON.stringify(this.A))
      getLonAndLat(j, w, 180, 500)
      n1 = JSON.parse(JSON.stringify(this.A))
      getLonAndLat(j, w, 270, 500)
      x1 = JSON.parse(JSON.stringify(this.A))

      getLonAndLat(j, w, 0, 1000)
      b2 = JSON.parse(JSON.stringify(this.A))
      getLonAndLat(j, w, 90, 1000)
      d2 = JSON.parse(JSON.stringify(this.A))
      getLonAndLat(j, w, 180, 1000)
      n2 = JSON.parse(JSON.stringify(this.A))
      getLonAndLat(j, w, 270, 1000)
      x2 = JSON.parse(JSON.stringify(this.A))

      getLonAndLat(j, w, 0, 1500)
      b3 = JSON.parse(JSON.stringify(this.A))
      getLonAndLat(j, w, 90, 1500)
      d3 = JSON.parse(JSON.stringify(this.A))
      getLonAndLat(j, w, 180, 1500)
      n3 = JSON.parse(JSON.stringify(this.A))
      getLonAndLat(j, w, 270, 1500)
      x3 = JSON.parse(JSON.stringify(this.A))

      const A1 = [x1[0], b1[1]]
      const B1 = [x1[0], n1[1]]
      const C1 = [d1[0], b1[1]]

      const A2 = [x2[0], b2[1]]
      const B2 = [x2[0], n2[1]]
      const C2 = [d2[0], b2[1]]

      const A3 = [x3[0], b3[1]]
      const B3 = [x3[0], n3[1]]
      const C3 = [d3[0], b3[1]]

      const len = this.gtData.length
      for (let i = 0; i < len; i++) {
        // 1公里
        if (
          A1[0] < this.gtData[i].geometry.coordinates[0] &&
          this.gtData[i].geometry.coordinates[0] < C1[0]
        ) {
          if (
            B1[1] < this.gtData[i].geometry.coordinates[1] &&
            this.gtData[i].geometry.coordinates[1] < A1[1]
          ) {
            this.onecount = this.onecount + this.gtData[i].count
            this.onenum++
          }
        }
        // 3公里
        if (
          A2[0] < this.gtData[i].geometry.coordinates[0] &&
          this.gtData[i].geometry.coordinates[0] < C2[0]
        ) {
          if (
            B2[1] < this.gtData[i].geometry.coordinates[1] &&
            this.gtData[i].geometry.coordinates[1] < A2[1]
          ) {
            this.threecount = this.threecount + this.gtData[i].count
            this.threenum++
          }
        }
        // 5公里
        if (
          A3[0] < this.gtData[i].geometry.coordinates[0] &&
          this.gtData[i].geometry.coordinates[0] < C3[0]
        ) {
          if (
            B3[1] < this.gtData[i].geometry.coordinates[1] &&
            this.gtData[i].geometry.coordinates[1] < A3[1]
          ) {
            this.fivecount = this.fivecount + this.gtData[i].count
            this.fivenum++
          }
        }
      }
      this.onedgIndex = parseInt(this.onecount / this.onenum)
      this.threedgIndex = parseInt(this.threecount / this.threenum)
      this.dangercount = []
      this.fivedgIndex = parseInt(this.fivecount / this.fivenum)
      const pp = this.localpoint
      // eslint-disable-next-line no-undef
      var circle1 = new BMap.Circle(pp, 500, {
        strokeColor: 'white',
        fillColor: 'rgba(252,71,3,0.42)',
        strokeWeight: 0,
        strokeOpacity: 0.01
      }) // 创建圆
      // eslint-disable-next-line no-undef
      var circle2 = new BMap.Circle(pp, 1000, {
        strokeColor: 'white',
        fillColor: 'rgba(64,167,241,0.36)',
        strokeWeight: 0,
        strokeOpacity: 0.01
      }) // 创建圆
      // eslint-disable-next-line no-undef
      var circle3 = new BMap.Circle(pp, 1500, {
        strokeColor: 'white',
        fillColor: 'rgba(128,166,231,0.66)',
        strokeWeight: 0,
        strokeOpacity: 0.01
      }) // 创建圆
      map.addOverlay(circle3)
      map.addOverlay(circle2)
      map.addOverlay(circle1)
      this.dangercount.push(this.onedgIndex)
      this.dangercount.push(this.threedgIndex)
      this.dangercount.push(this.fivedgIndex)
      if (this.searchpoint) {
        this.initChart1()
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
    }
  }
}
</script>
<style scoped>
@font-face {
  src: url("../public/font/KuHei.ttf");
  font-family: "KuHei";
}
#risk {
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
#risk #allmap {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
}
#risk .Mapwaper {
  position: absolute;
  right: 5px;
  top: 5px;
  z-index: 10;
  width: 400px;
  height: calc(100% - 10px);
  color: #fff;
  font-family: KuHei;
  font-size: 14px;
  border-radius: 2px;
  /* border: 1.5px solid #0fafeb; */
  padding: 5px;
}
/* 头部标题 */
#risk .Mapwaper .top {
  height: 40px;
  line-height: 40px;
  width: 100%;
  /* border: 1.5px solid #0fafeb; */
  background: url("../public/img/bn.png") rgba(79, 133, 177, 0.3);
  background-size: 100% 100%;
  position: relative;
  text-align: center;
  letter-spacing: 5px;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
}
/* 中部内容 */
#risk .Mapwaper .body {
  width: 100%;
  height: 140px;
  /* border: 1.5px solid #0fafeb; */
  background: url("../public/img/bn.png") ;
  background-size: 100% 100%;
  position: relative;
  text-align: center;
  margin-bottom: 5px;
}
#risk .Mapwaper .body .Btop {
  height: 40px;
  line-height: 40px;
  letter-spacing: 5px;
  font-size: 16px;
  border-bottom: 2px dashed rgba(219, 219, 219, 0.555);
  position: absolute;
  top: 0;
  width: 100%;
}
#risk .Mapwaper .body .Bbody {
  height: 60px;
  line-height: 60px;
  font-size: 16px;
  position: absolute;
  top: 40px;
  width: 100%;
}
#risk .Mapwaper .body .Bbody .fTime {
  position: absolute;
  right: 0;
  width: 100%;
  height: 60px;
  line-height: 60px;
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
}
#risk .Mapwaper .body .Bbody .fTime >>> .el-input__prefix,
#risk .Mapwaper .body .Bbody .fTime >>> .el-input__suffix {
  display: none;
}
#risk .Mapwaper .body .Bbody .fTime >>> .el-input__inner {
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
#risk .Mapwaper .body .Bbody .fTime >>> .el-date-editor.el-input,
#risk .Mapwaper .body .Bbody .fTime >>> .el-date-editor.el-input__inner {
  width: 140px;
}
#risk .Mapwaper .body .Bbody .fTime .img {
  margin: 0 15px;
  height: 45px;
  line-height: 45px;
  cursor: pointer;
  color: rgb(199, 199, 199);
  transition: all 0.5s;
}
#risk .Mapwaper .body .Bbody .fTime .img:hover {
  color: #fff;
}
#risk .Mapwaper .body .Bbotton {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 40px;
  line-height: 40px;
  letter-spacing: 5px;
  font-size: 16px;
  border-top: 2px dashed rgba(219, 219, 219, 0.555);
  transition: all 0.5s;
  color: rgb(202, 202, 202);
  cursor: pointer;
}
#risk .Mapwaper .body .Bbotton:hover {
  color: rgb(230, 230, 230);
}
/* 底部 */
#risk .Mapwaper .bottom {
  width: 100%;
  height: 140px;
  background: url("../public/img/bn.png") ;
  background-size: 100% 100%;
  position: relative;
  text-align: center;
  margin-bottom: 5px;
}
#risk .Mapwaper .bottom .Mtop {
  height: 40px;
  line-height: 40px;
  letter-spacing: 5px;
  font-size: 16px;
  border-bottom: 2px dashed rgba(219, 219, 219, 0.555);
  position: absolute;
  top: 0;
  width: 100%;
}
#risk .Mapwaper .bottom .Mbody {
  height: 60px;
  line-height: 60px;
  font-size: 16px;
  position: absolute;
  top: 40px;
  width: 100%;
}
#risk .Mapwaper .bottom .Mbody >>> .el-input__inner {
  background-color: rgba(255, 255, 255, 0) ;
  border: none;
  font-family: KuHei;
  color: #fff;
  text-align: center;
  width: 250px;
  border-bottom: 2px solid rgba(219, 219, 219, 0.555);
  height: 30px;
  border-radius: 0;
  cursor: pointer;
  user-select: none;
  padding: 0 10px;
}
#risk .Mapwaper .bottom .Mbotton {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 40px;
  line-height: 40px;
  letter-spacing: 5px;
  font-size: 16px;
  border-top: 2px dashed rgba(219, 219, 219, 0.555);
  transition: all 0.5s;
  color: rgb(202, 202, 202);
  cursor: pointer;
}
#risk .Mapwaper .bottom .Mbotton:hover {
  color: rgb(230, 230, 230);
}
/* 图表 */
#risk .Mapwaper .BottomNTool {
  position: absolute;
  width: calc(100% - 10px);
  height: calc(100% - 345px);
  background: url("../public/img/bn.png") ;
  background-size: 100% 100%;
}
#risk .Mapwaper .BottomNTool .NumHo {
  height: 40px;
  line-height: 40px;
  letter-spacing: 5px;
  font-size: 16px;
  /* border-bottom: 2px dashed #0fafeb; */
  position: absolute;
  top: 0;
  width: 100%;
  text-align: center;
}
#risk .Mapwaper .BottomNTool #CircleChart1 {
  position: absolute;
  width: 100%;
  top: 40px;
  height: calc(100% - 40px);
}
/* 修饰 */
#risk .Mapwaper .top::after,
#risk .Mapwaper .body::after,
#risk .Mapwaper .bottom::after,
#risk .Mapwaper .BottomNTool::after {
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
#risk .Mapwaper .top::before,
#risk .Mapwaper .body::before,
#risk .Mapwaper .bottom::before,
#risk .Mapwaper .BottomNTool::before {
  position: absolute;
  content: "";
  top: -1px;
  left: -1px;
  height: 10px;
  width: 10px;
  /* border-top: 2px solid #02a6b5;
  border-left: 2px solid #02a6b5; */
  transition: all 1.5s;
  z-index: 0;
}
#risk >>> .anchorBL {
  display: none;
}
#risk >>> .inmap-legend-container {
  position: absolute;
  left: 45px;
  bottom: 5px;
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
