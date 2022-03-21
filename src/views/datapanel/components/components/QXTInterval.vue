<template>
  <div class="QXTInterval">
    <div id="QXTInterval" style="height: 100%;width: 100%;z-index: 1;" />
  </div>
</template>
<script>
import * as echarts from 'echarts'
import eventBuz from '../public/js/EvebtBus'

export default {
  name: 'QXTInterval',
  data() {
    return {
      data: {
        name: '', // 地名
        table: '', // 数据库名称
        where: '', // 层级
        time: '', // 时间
        timec: 0 // 分年和分月 ALL为全部 0 4 7 substring(convert(varchar(30), time, 120), 1, *) x为传回数据库的*
      },
      day: [],
      diagnosis: [],
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
      this.myChart = echarts.init(document.getElementById('QXTInterval'))
      const option = {
        color: ['rgb(84, 112, 198)', '#ff7979'],
        title: {
          text: that.data.time  + this.data.name + '-时间间隔统计',
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
          position: 'right'
        },
        legend: {
          data: ['发病至诊断', '发病至死亡'],
          right: '0',
          top: '2%',
          orient: 'vertical', // 垂直显示
          textStyle: {
            color: '#ffffff'
          }
        },
        xAxis: [{
          name: '天',
          nameTextStyle: {
            padding: [30, 0, 0, -10],
            color: '#fff'
          },
          type: 'category',
          data: that.day,
          axisTick: {
            inside: true
          }
        }],
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: false
            }
          },
          {
            type: 'value',
            splitLine: {
              show: false
            },
            axisLabel: {
              margin: 25
            }
          }
        ],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          containLabel: true
        },
        dataZoom: [
          {
            type: 'slider',
            show: true,
            height: 15,
            start: 0,
            end: Math.ceil(10 / that.day.length * 100),
            bottom: '6%',
            showDetail: false
          }
        ],
        series: [
          {
            label: {
              show: true,
              position: 'top',
              color: '#fff',
              backgroundColor: 'none'
            },
            name: '发病至诊断',
            data: that.diagnosis,
            type: 'line'
          },
          {
            label: {
              show: true,
              position: 'top',
              color: 'rgba(255, 255, 255, 0)',
              backgroundColor: 'none'
            },
            name: '发病至死亡',
            yAxisIndex: 1,
            data: that.death,
            type: 'line'
          }
        ]
      }
      window.addEventListener('resize', function() {
        that.chart = echarts.init(document.getElementById('QXTInterval'))
        that.chart.resize()
      })
      this.myChart.setOption(option)
      this.myChart.on('click', function(params) {
      })
    },
    getJson() {
      var that = this
      that.$store.dispatch('ndatapanel/QXTInterval', that.data).then((dataz) => {
        that.day = []
        that.diagnosis = []
        that.death = []
        dataz.QXTDiagnosis.sort(function(a, b) {
          return Math.abs(a.year) - Math.abs(b.year)
        })
        dataz.QXTDeath.sort(function(a, b) {
          return Math.abs(a.year) - Math.abs(b.year)
        })
        // 确诊
        for (let i = 0; i < dataz.QXTDiagnosis.length; i++) {
          that.day.push(Math.abs(dataz.QXTDiagnosis[i].year))
          that.diagnosis.push(Math.abs(dataz.QXTDiagnosis[i].value))
        }
        // 死亡
        var guoT = []
        var guoS = []
        for (let i = 0; i < dataz.QXTDeath.length; i++) {
          guoT.push(Math.abs(dataz.QXTDeath[i].year))
          guoS.push(Math.abs(dataz.QXTDeath[i].value))
        }
        for (let i = 0; i < that.day.length; i++) {
          if (guoT.indexOf(that.day[i]) !== -1) {
            that.death.push(guoS[guoT.indexOf(that.day[i])])
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
      // document.getElementById('QXTInterval').remove()
      // const div = document.createElement('div')
      // div.id = 'QXTInterval'
      // div.style.position = 'absolute'
      // div.style.height = '100%'
      // div.style.width = '100%'
      // div.style.zIndex = '1'
      // const QXTInterval = document.getElementsByClassName('QXTInterval')[0]
      // QXTInterval.append(div)
    }
  }
}
</script>
<style scoped>
.QXTInterval {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
