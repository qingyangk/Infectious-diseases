<template>
  <div class="QXSAGroup">
    <div id="QXSAGroup" style="height: 100%;width: 100%;z-index: 1;" />
  </div>
</template>
<script>
import * as echarts from 'echarts'
import eventBuz from '../public/js/EvebtBus'

export default {
  name: 'QXSAGroup',
  data() {
    return {
      data: {
        name: '', // 地名
        table: '', // 数据库名称
        where: '', // 层级
        degree: 1,
        time: 'ALL', // 时间
        timec: 0 // 分年和分月 ALL为全部 0 4 7 substring(convert(varchar(30), time, 120), 1, *) x为传回数据库的*
      },
      man: [],
      manz: [],
      manV: [],
      woman: [],
      womanz: [],
      womanV: [],
      gong: {},
      myChart: null
    }
  },
  beforeDestroy() {
    eventBuz.$off('data')
    eventBuz.$off('times')
  },
  mounted() {
    var that = this
    that.data.name = that.$route.query.name
    that.data.type = that.$route.query.type
    that.data.table = that.$route.query.table
    that.data.where = that.$route.query.where
    that.getJson()
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
      this.myChart = echarts.init(document.getElementById('QXSAGroup'))
      const option = {
        // color:['#694EEB','#ff0000','#91CC75','#9c5333','#3B8E72','#3B8E72'],
        title: {
          text: that.data.time + '-' + this.data.name + '-重症-年龄组分布',
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
          formatter: '{b} : {c}'
        },
        legend: [
          {
            data: that.man,
            left: '0',
            bottom: '4%',
            orient: 'vertical',
            textStyle: {
              color: '#ffffff',
              fontSize: 10
            },
            selected: data,
            align: 'right',
            itemWidth: 24,
            itemGap: 6,
            itemHeight: 14
          },
          {
            data: that.woman,
            right: '0',
            bottom: '4%',
            orient: 'vertical',
            textStyle: {
              color: '#ffffff',
              fontSize: 10,
              lineHeight: 14
            },
            selected: data,
            itemWidth: 24,
            itemGap: 6,
            itemHeight: 14
          }
        ],
        calculable: true,
        series: [
          {
            top: '40',
            type: 'funnel',
            width: '45%',
            height: '70%',
            x: '5%',
            minSize: '10%',
            funnelAlign: 'right',
            center: ['50%', '55%'], // for pie
            data: that.manV.sort(function(a, b) {
              return a.value - b.value
            }),
            roseType: true,
            label: {
              show: true,
              formatter: '{d}%',
              position: 'insideRight',
              color: '#fff',
              backgroundColor: 'none'
            },
            itemStyle: {
              normal: {
                borderWidth: 0
              }
            }
          },
          {
            top: '40',
            type: 'funnel',
            width: '45%',
            height: '70%',
            x: '50%',
            minSize: '10%',
            funnelAlign: 'left',
            center: ['50%', '50%'], // for pie
            data: that.womanV.sort(function(a, b) {
              return a.value - b.value
            }),
            roseType: true,
            label: {
              show: true,
              formatter: '{d}%',
              position: 'insideLeft',
              color: '#fff',
              backgroundColor: 'none'
            },
            itemStyle: {
              normal: {
                borderWidth: 0
              }
            }
          }
        ]
      }
      window.addEventListener('resize', function() {
        that.chart = echarts.init(document.getElementById('QXSAGroup'))
        that.chart.resize()
      })
      this.myChart.setOption(option)
      this.myChart.on('click', function(params) {
      })
    },
    getJson() {
      var that = this
      that.$store.dispatch('ndatapanel/QXAGroup', that.data).then((dataH) => {
        that.man = []
        that.manz = []
        that.manV = []
        that.woman = []
        that.womanz = []
        that.womanV = []
        that.gong = null
        for (var i = 0; i < dataH.length; i++) {
          that.gong = {}
          if (that.man.indexOf(dataH[i].name) === -1 && dataH[i].sex === '男') {
            that.manz.push(dataH[i].name)
            that.man.push('男' + dataH[i].name)
            that.gong.name = '男' + dataH[i].name
            that.gong.value = dataH[i].value
            that.manV.push(that.gong)
          } else {
            that.womanz.push(dataH[i].name)
            that.woman.push('女' + dataH[i].name)
            that.gong.name = '女' + dataH[i].name
            that.gong.value = dataH[i].value
            that.womanV.push(that.gong)
          }
        }
        var bi = {}
        if (that.manz.length > that.womanz.length) {
          for (var k = 0; k < that.manz.length; k++) {
            if (that.womanz.indexOf(that.manz[k]) === -1) {
              const name = '男' + that.manz[k]
              bi[name] = false
            }
          }
        } else if (that.manz.length < that.womanz.length) {
          for (var j = 0; j < that.womanz.length; j++) {
            if (that.manz.indexOf(that.womanz[j]) === -1) {
              const name = '女' + that.womanz[j]
              bi[name] = false
            }
          }
        }
        that.initCharts(bi)
      })
    },
    // 创建与销毁盒子
    CAdestroy() {
      if (this.myChart !== null) {
        this.myChart.clear()
        this.myChart.dispose()
      }
      // document.getElementById('QXSAGroup').remove()
      // const div = document.createElement('div')
      // div.id = 'QXSAGroup'
      // div.style.position = 'absolute'
      // div.style.height = '100%'
      // div.style.width = '100%'
      // div.style.zIndex = '1'
      // const QXSAGroup = document.getElementsByClassName('QXSAGroup')[0]
      // QXSAGroup.append(div)
    }
  }
}
</script>
<style scoped>
.QXSAGroup {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
