<template>
  <div class="confirmedDeathDay">
    <div id="confirmedDeathDay" style="height: 100%;width: 100%;z-index: 99;" />
  </div>
</template>
<script>
import * as echarts from 'echarts'
import eventBus from '../public/js/EvebtBus'
export default {
  name: 'ConfirmedDeathDay',
  data() {
    return {
      data: {
        name: 'US'
      }
    }
  },
  mounted() {
    eventBus.$on('pushMsg', (children1Msg) => {
      console.log(children1Msg)
      this.data.name = children1Msg
      if (children1Msg === 'US') {
        this.data.range = 0
      } else {
        this.data.range = 1
      }
      document.getElementById('confirmedDeathDay').remove()
      const div = document.createElement('div')
      div.id = 'confirmedDeathDay'
      // div.style.position = 'absolute'
      div.style.height = '100%'
      div.style.width = '100%'
      div.style.zIndex = '99'
      const maps = document.getElementsByClassName('confirmedDeathDay')[0]
      maps.append(div)
      this.getData()
    })
    var that = this
    setTimeout(function() {
      that.getData()
    }, 1000)
  },
  methods: {
    initCharts(data) {
      const that = this
      const myChart = echarts.init(document.getElementById('confirmedDeathDay'))
      const option = {
        color: ['rgb(242, 75, 61)', 'rgb(150, 150, 150)'],
        title: {
          left: 'left',
          text: that.data.name + ' 日增确诊死亡',
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
          selectedMode: 'single'
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
          show: false,
          offset: 3.5,
          type: 'category',
          data: data.time,
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
            data: data.cases,
            type: 'line',
            smooth: true
          },
          {
            name: '死亡',
            data: data.deaths,
            type: 'line',
            smooth: true
          }
        ],
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
        grid: {
          left: '0%',
          right: '5%',
          bottom: '5%',
          top: '20%',
          containLabel: true
        }
      }
      window.addEventListener('resize', function() {
        that.chart = echarts.init(document.getElementById('confirmedDeathDay'))
        that.chart.resize()
      })
      myChart.setOption(option)
      myChart.on('click', function(params) {
      })
    },
    getData() {
      var that = this
      that.$store.dispatch('city/qDCDHome', this.data.name).then((dataZ) => {
        for (var i = 0; i < dataZ.time.length; i++) {
          var time = new Date(dataZ.time[i])
          dataZ.time[i] = that.data.today = time.getFullYear() + '-' + that.checkTime(time.getMonth() + 1) + '-' + that.checkTime(time.getDate())
        }
        that.initCharts(dataZ)
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
.confirmedDeathDay {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 11;
}
</style>
