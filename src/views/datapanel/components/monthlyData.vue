<template>
  <div id="monthlyDatas">
    <div id="monthlyData" style="height: 100%;width: 100%;z-index: 1;" />
  </div>
</template>
<script>
import * as echarts from 'echarts'
import eventBus from './public/js/EvebtBus'

export default {
  name: 'MonthlyData',
  data() {
    return {
      data: {
        name: '中国', // 地名
        type: '流行疾病', // 疾病名称
        where: 0, // 范围层级
        timx: '', // 时间
        timz: ''
      },
      myChart: null
    }
  },
  beforeDestroy() {
    eventBus.$off('type')
    eventBus.$off('maptype')
    eventBus.$off('maptypc')
    eventBus.$off('maptypx')
    eventBus.$off('returnAll')
    this.CAdestroy()
  },
  mounted() {
    var that = this
    this.getJson()
    eventBus.$on('type', (type) => {
      that.data.name = type.name
      that.data.where = type.where
      this.CAdestroy()
      this.getJson()
    })
    // 获取疾病名称
    eventBus.$on('maptype', (maptype) => {
      that.data.type = maptype
      this.CAdestroy()
      this.getJson()
    })
    eventBus.$on('maptypc', (maptypc) => {
      that.data.type = maptypc
      this.CAdestroy()
      this.getJson()
    })
    eventBus.$on('maptypx', (maptypx) => {
      that.data.type = maptypx
      this.CAdestroy()
      this.getJson()
    })
    // 返回全部
    eventBus.$on('returnAll', returnAll => {
      that.data.type = '流行疾病'
      this.myChart.clear()
      this.myChart.dispose()
      this.getJson()
    })
  },
  methods: {
    // echarts地图
    initCharts(times, fa, si) {
      var that = this
      this.myChart = echarts.init(document.getElementById('monthlyData'))
      const option = {
        // 标题
        title: {
          text: '近一月' + '-' + that.data.name + '-' + that.data.type,
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
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'line' // 默认为直线，可选为：'line' | 'shadow'
          },
          confine: true
        },
        legend: {
          data: ['确诊数', '死亡数'],
          right: 'left',
          orient: 'horizontal',
          align: 'auto',
          textStyle: {
            color: '#ffffff',
            fontSize: 13
          },
          itemWidth: 24,
          itemGap: 14,
          itemHeight: 12
        },
        xAxis: {
          type: 'category',
          data: times,
          axisLine: {
            lineStyle: {
              color: '#cccccc'
            }
          },
          axisLabel: {
            fontSize: '10px'
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(204, 204, 204, 0.3)'
            }
          }
        },
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#cccccc'
              }
            },
            splitLine: {
              show: false
            },
            scale: true
          },
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#cccccc'
              }
            },
            splitLine: {
              show: false
            },
            scale: true
          }
        ],
        grid: {
          left: '3%',
          right: '3%',
          bottom: '15%',
          top: '20%',
          containLabel: true
        },
        dataZoom: [
          {
            type: 'slider',
            show: true,
            height: 15,
            start: 50,
            end: 100,
            bottom: '6%',
            showDetail: false
          }
        ],
        series: [
          {
            name: '确诊数',
            data: fa,
            type: 'line',
            showBackground: false,
            itemStyle: {
              color: 'rgb(194, 196, 89)'
            },
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            },
            barWidth: '85%',
            yAxisIndex: 0
          },
          {
            name: '死亡数',
            data: si,
            type: 'line',
            showBackground: false,
            itemStyle: {
              color: '#ff7979'
            },
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            },
            barWidth: '85%',
            yAxisIndex: 1
          }
        ]
      }
      window.addEventListener('resize', function() {
        var chart = echarts.init(document.getElementById('monthlyData'))
        if (chart) {
          chart.resize() // 不报错
        }
      })
      this.myChart.setOption(option)
      // 点击事件
      this.myChart.on('click', function(params) {
      })
    },
    getJson() {
      var that = this
      var timx = new Date()
      timx = this.checkTime3(timx) // 现在时间
      var tims = this.checkTime3(new Date(new Date(timx) - 24 * 60 * 60 * 1000 * 30)) // 前天时间
      that.data.timx = timx
      that.data.timz = tims
      that.$store.dispatch('ndatapanel/QMData', that.data).then((dataz) => {
        var times = []
        var fa = []
        var si = []
        for (let i = 0; i < dataz.length; i++) {
          times.push(dataz[i].日期)
          fa.push(dataz[i].发病数)
          si.push(dataz[i].死亡数)
        }
        that.initCharts(times, fa, si)
      })
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
  src: url("./public/font/KuHei.ttf");
  font-family: "KuHei";
}
#monthlyDatas {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
