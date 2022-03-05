<template>
  <div class="QXDCrowd">
    <div id="QXDCrowd" style="height: 100%;width: 100%;z-index: 1;" />
  </div>
</template>
<script>
import * as echarts from 'echarts'
import eventBuz from '../public/js/EvebtBus'

export default {
  name: 'QXDCrowd',
  data() {
    return {
      data: {
        name: '', // 地名
        table: '', // 数据库名称
        where: '', // 层级
        degree: 0,
        time: 'ALL', // 时间
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
      this.myChart = echarts.init(document.getElementById('QXDCrowd'))
      const option = {
        title: {
          text: that.data.time + '-' + this.data.name + '-诊断-人群分布',
          left: 'center',
          padding: 10,
          textStyle: {
            color: 'rgb(210, 210, 210)',
            fontFamily: 'KuHei',
            fontWeight: 'bolder',
            fontSize: '14px'
          }
        },
        series: [
          {
            hoverAnimation: false,
            z: 1,
            type: 'pie',
            radius: [10, '70%'],
            center: ['50%', '60%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 8
            },
            label: {
              formatter: '{b}',
              color: '#cccccc'
            },
            labelLine: {
              normal: {
                length: 0,
                length2: 0
              }
            },
            data: data
          },
          {
            type: 'pie',
            z: 100,
            radius: [10, '70%'],
            center: ['50%', '60%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 8
            },
            label: {
              position: 'inner',
              formatter: '{d}%',
              color: '#fff'
            },
            data: data
          }
        ]
      }
      window.addEventListener('resize', function() {
        that.chart = echarts.init(document.getElementById('QXDCrowd'))
        that.chart.resize()
      })
      this.myChart.setOption(option)
      this.myChart.on('click', function(params) {
      })
    },
    getJson() {
      var that = this
      that.$store.dispatch('ndatapanel/QXCrowd', that.data).then((dataz) => {
        that.initCharts(dataz)
      })
    },
    // 创建与销毁盒子
    CAdestroy() {
      if (this.myChart !== null) {
        this.myChart.clear()
        this.myChart.dispose()
      }
      // document.getElementById('QXDCrowd').remove()
      // const div = document.createElement('div')
      // div.id = 'QXDCrowd'
      // div.style.position = 'absolute'
      // div.style.height = '100%'
      // div.style.width = '100%'
      // div.style.zIndex = '1'
      // const QXDCrowd = document.getElementsByClassName('QXDCrowd')[0]
      // QXDCrowd.append(div)
    }
  }
}
</script>
<style scoped>
.QXDCrowd {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
