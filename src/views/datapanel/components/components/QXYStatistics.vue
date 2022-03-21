<template>
  <div class="QXYStatistics">
    <div id="QXYStatistics" style="height: 100%;width: 100%;z-index: 1;" />
  </div>
</template>
<script>
import * as echarts from 'echarts'
import eventBuz from '../public/js/EvebtBus'

export default {
  name: 'QXYStatistics',
  data() {
    return {
      data: {
        name: '', // 地名
        table: '', // 数据库名称
        where: '' // 层级
      },
      age: [],
      diagnosis: [],
      severe: [],
      death: [],
      mortality: []
    }
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
  },
  methods: {
    initCharts() {
      const that = this
      const myChart = echarts.init(document.getElementById('QXYStatistics'))
      const option = {
        color: ['#0cb5f0', 'rgb(253, 141, 0)', '#ff7979', '#9c5333'],
        title: {
          text: this.data.name + '-年份统计',
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
            data: ['重症', '死亡'],
            right: '0',
            top: '0%',
            orient: 'vertical',
            textStyle: {
              color: '#ffffff'
            },
            selected: {
              重症: false,
              死亡: false
            }
          },
          {
            data: ['诊断', '死亡率'],
            right: '60',
            top: '0%',
            orient: 'vertical',
            textStyle: {
              color: '#ffffff'
            },
            selected: {
              重症: false
            }
          }
        ],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          containLabel: true
        },
        xAxis: {
          name: '年',
          nameTextStyle: {
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
              margin: 25,
              formatter: '{value} %'
            }
          }
        ],
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
            type: 'bar',
            stack: 'total',
            boundaryGap: true,
            data: that.diagnosis,
            barWidth: '30%'
          },
          {
            name: '重症',
            type: 'bar',
            stack: 'total',
            data: that.severe,
            barWidth: '30%'
          },
          {
            name: '死亡',
            type: 'bar',
            stack: 'total',
            data: that.death,
            barWidth: '30%'
          },
          {
            name: '死亡率',
            yAxisIndex: 1,
            data: that.mortality,
            type: 'line'
          }
        ]
      }
      window.addEventListener('resize', function() {
        that.chart = echarts.init(document.getElementById('QXYStatistics'))
        that.chart.resize()
      })
      myChart.setOption(option)
      myChart.on('click', function(params) {
      })
    },
    getJson() {
      var that = this
      that.$store.dispatch('ndatapanel/QXYStatistics', that.data).then((dataz) => {
        that.age = []
        that.diagnosis = []
        that.severe = []
        that.death = []
        that.mortality = []
        // 确诊 + 时间
        for (let i = 0; i < dataz.QXNDiagnosis.length; i++) {
          that.age.push(dataz.QXNDiagnosis[i].year)
          that.diagnosis.push(dataz.QXNDiagnosis[i].value)
        }
        // 重症
        var zhongT = []
        var zhong = []
        for (let i = 0; i < dataz.QXNSevere.length; i++) {
          zhongT.push(dataz.QXNSevere[i].year)
          zhong.push(dataz.QXNSevere[i].value)
        }
        // 死亡
        var siT = []
        var si = []
        for (let i = 0; i < dataz.QXNDeath.length; i++) {
          siT.push(dataz.QXNDeath[i].year)
          si.push(dataz.QXNDeath[i].value)
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
          // 死亡率
          that.mortality.push((that.death[i] / that.diagnosis[i] * 100).toFixed(4))
        }
        that.initCharts()
      })
    },
    // 创建与销毁盒子
    CAdestroy() {
      document.getElementById('QXYStatistics').remove()
      const div = document.createElement('div')
      div.id = 'QXYStatistics'
      div.style.position = 'absolute'
      div.style.height = '100%'
      div.style.width = '100%'
      div.style.zIndex = '1'
      const QXYStatistics = document.getElementsByClassName('QXYStatistics')[0]
      QXYStatistics.append(div)
    }
  }
}
</script>
<style scoped>
.QXYStatistics {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
