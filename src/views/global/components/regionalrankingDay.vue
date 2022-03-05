<template>
  <div class="regionalrankingDay">
    <div id="regionalrankingDay" style="height: 100%;width: 100%;z-index: 99;" />
  </div>
</template>
<script>
import * as echarts from 'echarts'
import eventBus from '../public/js/EvebtBus'
export default {
  name: 'RegionalrankingDay',
  data() {
    return {
      data: {
        name: 'US',
        range: 0,
        time: ''
      },
      switchs: 0,
      length: { '死亡': false },
      name: [],
      value: [],
      pan: 0
    }
  },
  mounted() {
    eventBus.$on('pushMsg', (children1Msg) => {
      // console.log(children1Msg)
      this.data.name = children1Msg
      if (children1Msg === 'US') {
        this.data.range = 0
      } else {
        this.data.range = 1
      }
      document.getElementById('regionalrankingDay').remove()
      const div = document.createElement('div')
      div.id = 'regionalrankingDay'
      // div.style.position = 'absolute'
      div.style.height = '100%'
      div.style.width = '100%'
      div.style.zIndex = '99'
      const maps = document.getElementsByClassName('regionalrankingDay')[0]
      maps.append(div)
      this.getData()
    })
    var that = this
    setTimeout(function() {
      that.getData()
    }, 1000)
  },
  methods: {
    initCharts() {
      const that = this
      const myChart = echarts.init(document.getElementById('regionalrankingDay'))
      const option = {
        color: ['rgb(242, 75, 61)', 'rgb(150, 150, 150)'],
        title: {
          left: 'left',
          text: that.data.name + ' 日增地区排名',
          textStyle: {
            fontSize: 15,
            color: 'rgba(255, 255, 255, 0.85)'
          }
        },
        legend: {
          show: true,
          right: '5%',
          data: ['确诊', '死亡'],
          textStyle: {
            color: 'rgba(255, 255, 255, 0.55)'
          },
          selectedMode: 'single',
          selected: that.length
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        xAxis: {
          show: true,
          offset: 3.5,
          type: 'category',
          data: that.name,
          axisTick: {
            show: true,
            alignWithLabel: true, // 是否居中显示刻度
            inside: true // 刻度方向
          },
          axisLabel: {
            show: true,
            color: 'rgba(255, 255, 255, 0.75)'
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            show: true,
            color: 'rgba(255, 255, 255, 0.75)'
          }
        },
        series: [
          {
            name: '确诊',
            data: that.value,
            type: 'bar',
            smooth: true
          },
          {
            name: '死亡',
            data: that.value,
            type: 'bar',
            smooth: true
          }
        ],
        dataZoom: [
          {
            type: 'slider',
            show: true,
            height: 20,
            start: 50,
            end: 100,
            bottom: '6%',
            showDetail: false
          }
        ],
        grid: {
          left: '0%',
          right: '5%',
          bottom: '5%',
          top: '20%',
          containLabel: true
        }
      }
      window.addEventListener('resize', function() {
        that.chart = echarts.init(document.getElementById('regionalrankingDay'))
        that.chart.resize()
      })
      myChart.setOption(option)
      myChart.on('click', function(params) {})
      myChart.on('legendselectchanged', function(params) {
        var thatz = that
        if (params.name === '死亡') {
          thatz.switchs = 1
          thatz.length = { '确诊': false }
        } else {
          thatz.switchs = 0
          thatz.length = { '死亡': false }
        }
        document.getElementById('regionalrankingDay').remove()
        const div = document.createElement('div')
        div.id = 'regionalrankingDay'
        // div.style.position = 'absolute'
        div.style.height = '100%'
        div.style.width = '100%'
        div.style.zIndex = '99'
        const maps = document.getElementsByClassName('regionalrankingDay')[0]
        maps.append(div)
        that.getData()
      })
    },
    getData() {
      var that = this
      var setup = new Date()
      var today = new Date()
      var yesterday = new Date()
      yesterday.setTime(yesterday.getTime() - 24 * 60 * 60 * 1000)
      setup.setHours('12')
      setup.setMinutes('30')
      // 判断是否在12.30之前(数据库数据更新在12点)
      if (today.getTime() - setup.getTime() < 0) {
        yesterday.setTime(yesterday.getTime() - 24 * 60 * 60 * 1000)
        that.data.time = yesterday.getFullYear() + '-' + that.checkTime(yesterday.getMonth() + 1) + '-' + that.checkTime(yesterday.getDate())
      } else {
        that.data.time = yesterday.getFullYear() + '-' + that.checkTime(yesterday.getMonth() + 1) + '-' + that.checkTime(yesterday.getDate())
      }
      that.$store.dispatch('city/qDRanking', this.data).then((dataZ) => {
        var dataX = dataZ.cranking
        that.name = []
        that.value = []
        for (var i = 0; i < dataX.length; i++) {
          if (dataX[i].cases === 'None') {
            dataX[i].cases = 0
          } else {
            dataX[i].cases = dataX[i].cases * 1
          }
          if (dataX[i].deaths === 'None') {
            dataX[i].deaths = 0
          } else {
            dataX[i].deaths = dataX[i].deaths * 1
          }
        }
        // 确诊排名
        if (that.switchs === 0) {
          dataX = dataX.sort(function(a, b) {
            return a.cases - b.cases
          })
          for (var j = 0; j < dataX.length; j++) {
            that.name.push(dataX[j].name)
            that.value.push(dataX[j].cases)
          }
          that.initCharts()
        } else { // 死亡排名
          dataX = dataX.sort(function(a, b) {
            return a.deaths - b.deaths
          })
          for (var k = 0; k < dataX.length; k++) {
            that.name.push(dataX[k].name)
            that.value.push(dataX[k].deaths)
          }
          that.initCharts()
        }
      })
    },
    // 时间处理
    checkTime(i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
    }
  }
}
</script>
<style scoped>
.regionalrankingDay {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 11;
}
</style>
