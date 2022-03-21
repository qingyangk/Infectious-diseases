<template>
  <div class="QXQuarter">
    <div id="QXQuarter" style="height: 100%;width: 100%;z-index: 1;" />
  </div>
</template>
<script>
import * as echarts from 'echarts'
import eventBuz from '../public/js/EvebtBus'

export default {
  name: 'QXQuarter',
  data() {
    return {
      data: {
        name: '', // 地名
        table: '', // 数据库名称
        where: '', // 层级
        degree: 0, // 程度
        time: '', // 时间
        timec: 0 // 分年和分月 ALL为全部 0 4 7 substring(convert(varchar(30), time, 120), 1, *) x为传回数据库的*
      },
      diagnosis: [0, 0, 0, 0],
      severe: [0, 0, 0, 0],
      death: [0, 0, 0, 0],
      max: 0, // 最大值
      length: { '重症': false, '死亡': false },
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
      if (times.x === 4 || times.x === 0) {
        that.CAdestroy()
        // 调取数据
        that.getJson()
      }
    })
  },
  methods: {
    initCharts() {
      var that = this
      this.myChart = echarts.init(document.getElementById('QXQuarter'))
      const option = {
        color: ['#0cb5f0', 'rgb(253, 141, 0)', '#ff7979'],
        title: {
          text: that.data.time  + this.data.name + '-季节统计',
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
          data: ['诊断', '重症', '死亡'],
          right: '0',
          top: 'top',
          orient: 'vertical',
          textStyle: {
            color: '#ffffff'
          },
          selectedMode: 'single',
          selected: that.length
        },
        radar: [
          {
            center: ['50%', '60%'],
            radius: ['0%', '65%'],
            nameGap: 5,
            indicator: [
              { text: '春季', max: that.max },
              { text: '夏季', max: that.max },
              { text: '秋季', max: that.max },
              { text: '冬季', max: that.max }
            ]
          }
        ],
        series: [
          {
            type: 'radar',
            tooltip: {
              trigger: 'item'
            },
            areaStyle: {},
            data: [
              {
                value: that.diagnosis,
                name: '诊断'
              },
              {
                value: that.severe,
                name: '重症'
              },
              {
                value: that.death,
                name: '死亡'
              }
            ]
          }
        ]
      }
      window.addEventListener('resize', function() {
        that.chart = echarts.init(document.getElementById('QXQuarter'))
        that.chart.resize()
      })
      this.myChart.setOption(option)
      this.myChart.on('click', function(params) {})
      this.myChart.on('legendselectchanged', function(params) {
        if (params.name === '诊断') {
          that.data.degree = 0
          that.length = { '重症': false, '死亡': false }
          that.getJson()
          that.CAdestroy()
        } else if (params.name === '重症') {
          that.data.degree = 1
          that.length = { '诊断': false, '死亡': false }
          that.getJson()
          that.CAdestroy()
        } else {
          that.data.degree = 2
          that.length = { '诊断': false, '重症': false }
          that.getJson()
          that.CAdestroy()
        }
      })
    },
    getJson() {
      var that = this
      that.$store.dispatch('ndatapanel/QXQuarter', that.data).then((dataz) => {
        // 重置
        var season = [1, 2, 3, 4]
        that.diagnosis = [0, 0, 0, 0]
        that.severe = [0, 0, 0, 0]
        that.death = [0, 0, 0, 0]
        that.max = 0
        // 排序
        dataz.sort(function(a, b) {
          return a.name - b.name
        })
        var year = []
        var data = []
        for (let i = 0; i < dataz.length; i++) {
          year.push(dataz[i].name)
          data.push(dataz[i].value)
        }
        // 赋值
        if (that.data.degree === 0) { // 确诊
          that.diagnosis = []
          for (let i = 0; i < season.length; i++) {
            if (year.indexOf(season[i]) !== -1) {
              that.diagnosis.push(data[year.indexOf(season[i])])
            } else {
              that.diagnosis.push(0)
            }
          }
        } else if (that.data.degree === 1) { // 重症
          that.severe = []
          for (let i = 0; i < season.length; i++) {
            if (year.indexOf(season[i]) !== -1) {
              that.severe.push(data[year.indexOf(season[i])])
            } else {
              that.severe.push(0)
            }
          }
        } else { // 死亡
          that.death = []
          for (let i = 0; i < season.length; i++) {
            if (year.indexOf(season[i]) !== -1) {
              that.death.push(data[year.indexOf(season[i])])
            } else {
              that.death.push(0)
            }
          }
        }
        // 值从大到小
        data.sort(function(a, b) {
          return b - a
        })
        var length = data[0].toString().length - 2
        that.max = data[0].toString().charAt(0) + data[0].toString().charAt(1)
        that.max = that.max * 1 + 1
        for (let i = 0; i < length; i++) {
          that.max = that.max + '0'
        }
        that.max = that.max * 1
        that.initCharts()
      })
    },
    // 创建与销毁盒子
    CAdestroy() {
      if (this.myChart !== null) {
        this.myChart.clear()
        this.myChart.dispose()
      }
      // document.getElementById('QXQuarter').remove()
      // const div = document.createElement('div')
      // div.id = 'QXQuarter'
      // div.style.position = 'absolute'
      // div.style.height = '100%'
      // div.style.width = '100%'
      // div.style.zIndex = '1'
      // const QXQuarter = document.getElementsByClassName('QXQuarter')[0]
      // QXQuarter.append(div)
    }
  }
}
</script>
<style scoped>
.QXQuarter {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
