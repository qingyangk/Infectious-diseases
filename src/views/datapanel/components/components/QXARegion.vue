<template>
  <div class="QXARegion">
    <div id="QXARegion" style="height: 100%;width: 100%;z-index: 1;" />
  </div>
</template>
<script>
import * as echarts from 'echarts'
import eventBuz from '../public/js/EvebtBus'

export default {
  name: 'QXARegion',
  data() {
    return {
      data: {
        name: '', // 地名
        table: '', // 数据库名称
        where: '', // 层级
        time: '', // 时间
        timec: 0 // 分年和分月 ALL为全部 0 4 7 substring(convert(varchar(30), time, 120), 1, *) x为传回数据库的*
      },
      name: [],
      diagnosis: [],
      severe: [],
      death: [],
      myChart: null
    }
  },
  beforeDestroy() {
    eventBuz.$off('data')
    eventBuz.$off('times')
  },
  mounted() {
    var that = this
    eventBuz.$on('data', (data) => {
      that.data.name = data.name
      that.data.table = data.table
      that.data.where = data.where
      that.CAdestroy()
      that.getJson()
    })
    // 接收时间
    eventBuz.$on('times', times => {
      this.data.time = times.time
      this.data.timec = times.x
      that.CAdestroy()
      // 调取数据
      that.getJson()
    })
  },
  methods: {
    initCharts() {
      const that = this
      this.myChart = echarts.init(document.getElementById('QXARegion'))
      const option = {
        title: {
          text: that.data.time  + this.data.name + '-行政区统计',
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
          axisPointer: {
            type: 'shadow' // 悬浮柱状
          }
        },
        legend: {
          data: ['诊断', '重症', '死亡'],
          right: '0',
          top: '10%',
          orient: 'vertical',
          textStyle: {
            color: '#ffffff'
          },
          selected: {
            '诊断': false
          }
        },
        dataZoom: [
          {
            type: 'slider',
            show: true,
            yAxisIndex: 0,
            width: 15,
            height: '70%',
            start: 0,
            end: 50,
            handleSize: 8,
            showDataShadow: false,
            right: '94%'
          }],
        color: ['rgb(194, 196, 89)', 'rgb(83 183 244)', '#ff7979'],
        xAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#cccccc'
            }
          },
          axisLabel: {
            rotate: 35,
            fontSize: '10px'
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(204, 204, 204, 0.3)'
            }
          }
        },
        grid: {
          left: '10%',
          right: '10%',
          bottom: '0%',
          containLabel: true,
          height: '80%'
        },
        yAxis: {
          type: 'category',
          data: that.name,
          axisLine: {
            lineStyle: {
              color: '#cccccc'
            }
          },
          axisTick: { // y轴小格子隐藏
            show: false
          },
          axisLabel: { // y轴全部显示
            interval: 0,
            rotate: 25, // 代表逆时针旋转45度
            fontSize: '10px'
          }
        },
        series: [
          {
            name: '诊断',
            type: 'bar',
            stack: 'total',
            label: {
              show: true,
              position: 'right',
              color: '#fff',
              backgroundColor: 'none'
            },
            emphasis: {
              focus: 'series'
            },
            barWidth: '85%',
            data: that.diagnosis
          },
          {
            name: '重症',
            type: 'bar',
            stack: 'total',
            emphasis: {
              focus: 'series'
            },
            barWidth: '85%',
            data: that.severe
          },
          {
            name: '死亡',
            type: 'bar',
            stack: 'total',
            emphasis: {
              focus: 'series'
            },
            barWidth: '85%',
            data: that.death
          }
        ]
      }
      window.addEventListener('resize', function() {
        that.chart = echarts.init(document.getElementById('QXARegion'))
        that.chart.resize()
      })
      this.myChart.setOption(option)
      this.myChart.on('click', function(params) {
      })
    },
    getJson() {
      var that = this
      that.$store.dispatch('ndatapanel/QXARegion', that.data).then((dataz) => {
        that.name = []
        that.diagnosis = []
        that.severe = []
        that.death = []
        for (let i = 0; i < dataz.QXARDiagnosis.length; i++) {
          that.name.push(dataz.QXARDiagnosis[i].name)
          that.diagnosis.push(dataz.QXARDiagnosis[i].value)
        }
        // 重症
        var zhongT = []
        var zhong = []
        for (let i = 0; i < dataz.QXARSevere.length; i++) {
          zhongT.push(dataz.QXARSevere[i].name)
          zhong.push(dataz.QXARSevere[i].value)
        }
        // 死亡
        var siT = []
        var si = []
        for (let i = 0; i < dataz.QXARDeath.length; i++) {
          siT.push(dataz.QXARDeath[i].name)
          si.push(dataz.QXARDeath[i].value)
        }
        // 循环
        for (let i = 0; i < that.name.length; i++) {
          // 重症
          if (zhongT.indexOf(that.name[i]) !== -1) {
            that.severe.push(zhong[zhongT.indexOf(that.name[i])])
          } else {
            that.severe.push(0)
          }
          // 死亡
          if (siT.indexOf(that.name[i]) !== -1) {
            that.death.push(si[siT.indexOf(that.name[i])])
          } else {
            that.death.push(0)
          }
        }
        that.initCharts()
      })
    },
    // 创建与销毁盒子
    CAdestroy() {
      if (this.myChart !== null) {
        this.myChart.clear()
        this.myChart.dispose()
      }
      // document.getElementById('QXARegion').remove()
      // const div = document.createElement('div')
      // div.id = 'QXARegion'
      // div.style.position = 'absolute'
      // div.style.height = '100%'
      // div.style.width = '100%'
      // div.style.zIndex = '1'
      // const QXARegion = document.getElementsByClassName('QXARegion')[0]
      // QXARegion.append(div)
    }
  }
}
</script>
<style scoped>
.QXARegion {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
