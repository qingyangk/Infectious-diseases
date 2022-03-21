<template>
  <div class="QAStatistics">
    <div id="QAStatistics" style="height: 100%;width: 100%;z-index: 1;" />
  </div>
</template>
<script>
import * as echarts from 'echarts'
import eventBuz from '../public/js/EvebtBus'

export default {
  name: 'QAStatistics',
  data() {
    return {
      data: {
        name: '', // 地名
        table: '', // 数据库名称
        where: '', // 层级
        time: '', // 时间
        timec: 0 // 分年和分月 ALL为全部 0 4 7 substring(convert(varchar(30), time, 120), 1, *) x为传回数据库的*
      },
      age: [],
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
      this.myChart = echarts.init(document.getElementById('QAStatistics'))
      const option = {
        color: ['#0cb5f0', '#0030ff', '#ff7979'],
        title: {
          text: that.data.time  + this.data.name + '-年龄统计',
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
        legend: [
          {
            data: ['诊断', '重症'],
            right: '0',
            top: '2%',
            orient: 'horizontal',
            textStyle: {
              color: '#ffffff'
            }
          },
          {
            data: ['死亡'],
            right: '0',
            top: '12%',
            orient: 'horizontal',
            textStyle: {
              color: '#ffffff'
            }
          }
        ],
        xAxis: {
          name: '岁', // 关键代码
          nameTextStyle: { // 关键代码
            padding: [30, 0, 0, -10],
            color: '#fff'
          },
          type: 'category',
          data: that.age,
          axisTick: {
            inside: true
          }
        },
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
          right: '2%',
          bottom: '17%',
          containLabel: true
        },
        dataZoom: [
          {
            type: 'slider',
            show: true,
            height: 15,
            start: 0,
            end: Math.ceil(10 / that.age.length * 100),
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
            name: '诊断',
            data: that.diagnosis,
            areaStyle: {},
            type: 'line'
          },
          {
            // label: {
            //   show: true,
            //   position: 'top',
            //   color: '#fff',
            //   backgroundColor:'none'
            // },
            name: '重症',
            yAxisIndex: 1,
            data: that.severe,
            areaStyle: {},
            type: 'line'
          },
          {
            // label: {
            //   show: true,
            //   position: 'top',
            //   color: '#fff',
            //   backgroundColor:'none'
            // },
            name: '死亡',
            yAxisIndex: 1,
            data: that.death,
            areaStyle: {},
            type: 'line'
          }
        ]
      }
      window.addEventListener('resize', function() {
        that.chart = echarts.init(document.getElementById('QAStatistics'))
        that.chart.resize()
      })
      this.myChart.setOption(option)
      this.myChart.on('click', function(params) {
      })
    },
    getJson() {
      var that = this
      that.$store.dispatch('ndatapanel/QAStatistics', that.data).then((dataz) => {
        that.age = []
        that.diagnosis = []
        that.severe = []
        that.death = []
        // 确诊
        for (let i = 0; i < dataz.QXADiagnosis.length; i++) {
          that.age.push(dataz.QXADiagnosis[i].year)
          that.diagnosis.push(dataz.QXADiagnosis[i].value)
        }
        // 重症
        var zhongT = []
        var zhong = []
        for (let i = 0; i < dataz.QXASevere.length; i++) {
          zhongT.push(dataz.QXASevere[i].year)
          zhong.push(dataz.QXASevere[i].value)
        }
        // 死亡
        var siT = []
        var si = []
        for (let i = 0; i < dataz.QXADeath.length; i++) {
          siT.push(dataz.QXADeath[i].year)
          si.push(dataz.QXADeath[i].value)
        }
        // 循环
        for (let i = 0; i < that.age.length; i++) {
          // 重症
          if (zhongT.indexOf(that.age[i]) !== -1) {
            that.severe.push(zhong[zhongT.indexOf(that.age[i])])
          } else {
            that.severe.push(0)
          }
          // 死亡
          if (siT.indexOf(that.age[i]) !== -1) {
            that.death.push(si[siT.indexOf(that.age[i])])
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
      // document.getElementById('QAStatistics').remove()
      // const div = document.createElement('div')
      // div.id = 'QAStatistics'
      // div.style.position = 'absolute'
      // div.style.height = '100%'
      // div.style.width = '100%'
      // div.style.zIndex = '1'
      // const QAStatistics = document.getElementsByClassName('QAStatistics')[0]
      // QAStatistics.append(div)
    }
  }
}
</script>
<style scoped>
.QAStatistics {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
