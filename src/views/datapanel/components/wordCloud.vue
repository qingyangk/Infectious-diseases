<template>
  <div id="wordClouds">
    <div id="wordCloud" style="height: 100%;width: 100%;z-index: 1;" />
  </div>
</template>
<script>
import eventBus from './public/js/EvebtBus'
import * as echarts from 'echarts'
import 'echarts-wordcloud'

export default {
  name: 'WordCloud',
  data() {
    return {
      data: [],
      myChart: null
    }
  },
  mounted() {
    var that = this
    setTimeout(function() {
      that.get()
    }, 200)
  },
  methods: {
    // echarts地图
    initCharts(data) {
      var that = this
      this.myChart = echarts.init(document.getElementById('wordCloud'))
      const option = {
        tooltip: {
          show: true
        },
        series: [{
          type: 'wordCloud',
          shape: 'circle',
          left: 'center',
          top: 'center',
          width: '70%',
          height: '80%',
          right: null,
          bottom: null,
          sizeRange: [0, 40], // 画布范围
          rotationRange: [-45, 45], // 数据翻转范围,
          rotationStep: 25,
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
        var chart = echarts.init(document.getElementById('wordCloud'))
        if (chart) {
          chart.resize() // 不报错
        }
      })
      this.myChart.setOption(option)
      // 点击事件
      this.myChart.on('click', function(params) {
        var name = ''
        if (params.data.table === '陕西手足口点') {
          name = '手足口病'
        } else {
          name = params.data.table
        }
        eventBus.$emit('maptypx', name)
        that.upDate(params.data.id)
      })
    },
    get() {
      var that = this
      that.$store.dispatch('ndatapanel/QDiseaseJson').then((datas) => {
        that.CAdestroy()
        that.data = []
        for (let i = 0; i < datas.length; i++) {
          var gong = {}
          gong.id = datas[i].id
          gong.name = datas[i].name
          gong.value = datas[i].concern
          gong.table = datas[i].table
          that.data.push(gong)
        }
        that.initCharts(that.data)
      })
    },
    // 创建与销毁盒子
    CAdestroy() {
      if (this.myChart !== null) {
        this.myChart.clear()
        this.myChart.dispose()
      }
    },
    upDate(data) {
      var that = this
      that.$store.dispatch('ndatapanel/UDJson', data).then((datas) => {
        this.get()
      })
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
  src: url("./public/font/KuHei.ttf");
  font-family: "KuHei";
}
#wordClouds {
  position: absolute;
  width: calc(100% - 10px);
  height: calc(100% - 10px);
  top: 5px;
  left: 5px;
}
</style>
