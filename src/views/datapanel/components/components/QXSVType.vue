<template>
  <div class="QXSVType">
    <div id="QXSVType" style="height: 100%;width: 100%;z-index: 1;" />
  </div>
</template>
<script>
import * as echarts from 'echarts'
import eventBuz from '../public/js/EvebtBus'

export default {
  name: 'QXSVType',
  data() {
    return {
      data: {
        name: '', // 地名
        table: '', // 数据库名称
        where: '', // 层级
        degree: 1,
        time: '', // 时间
        timec: 0 // 分年和分月 ALL为全部 0 4 7 substring(convert(varchar(30), time, 120), 1, *) x为传回数据库的*
      },
      json: [],
      zong: 0,
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
    initCharts(data) {
      const that = this
      this.myChart = echarts.init(document.getElementById('QXSVType'))
      // 图例
      var legend = []
      for (var i = 0; i < data.length; i++) {
        legend.push(data[i].name)
      }
      // 颜色
      var colors = ['#53B7F4', '#694EEB', '#9B1AD9']
      if (legend.length < colors.length) {
        for (var j = 0; j < legend.length; j++) {
          colors.push(that.color())
        }
      }
      const option = {
        title: {
          text: that.data.time  + this.data.name + '-重症-病毒类型',
          left: 'center',
          padding: 10,
          textStyle: {
            color: 'rgb(210, 210, 210)',
            fontFamily: 'KuHei',
            fontWeight: 'bolder',
            fontSize: '14px'
          }
        },
        color: colors,
        legend: {
          data: legend,
          right: 'left',
          bottom: '20',
          orient: 'horizontal',
          align: 'auto',
          textStyle: {
            color: '#ffffff',
            fontSize: 10
          },
          itemWidth: 18,
          itemGap: 6,
          itemHeight: 12
        },
        calculable: true,
        series: [
          {
            type: 'pie',
            center: ['50%', '50%'],
            radius: ['38%', '55%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10
            },
            label: {
              normal: {
                show: true,
                position: 'inner',
                formatter: '{d}%',
                color: '#fff'
              }
            },
            data: data
          },
          {
            type: 'pie',
            center: ['50%', '50%'],
            radius: ['38%', '55%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '15',
                fontWeight: 'bold',
                color: '#fff',
                formatter: '{b}'
              }
            },
            labelLine: {
              show: false
            },
            data: data
          }
        ]
      }
      window.addEventListener('resize', function() {
        that.chart = echarts.init(document.getElementById('QXSVType'))
        that.chart.resize()
      })
      this.myChart.setOption(option)
      this.myChart.on('click', function(params) {
      })
    },
    getJson() {
      var that = this
      that.$store.dispatch('ndatapanel/QXVType', that.data).then((dataz) => {
        that.initCharts(dataz)
      })
    },
    // 创建与销毁盒子
    CAdestroy() {
      if (this.myChart !== null) {
        this.myChart.clear()
        this.myChart.dispose()
      }
      // document.getElementById('QXSVType').remove()
      // const div = document.createElement('div')
      // div.id = 'QXSVType'
      // div.style.position = 'absolute'
      // div.style.height = '100%'
      // div.style.width = '100%'
      // div.style.zIndex = '1'
      // const QXSVType = document.getElementsByClassName('QXSVType')[0]
      // QXSVType.append(div)
    },
    color() {
      var r = Math.floor(Math.random() * 256)
      var g = Math.floor(Math.random() * 256)
      var b = Math.floor(Math.random() * 256)
      var color = '#' + r.toString(16) + g.toString(16) + b.toString(16)
      return color
    }
  }
}
</script>
<style scoped>
.QXSVType {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
