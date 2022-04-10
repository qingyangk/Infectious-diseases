<template>
  <div id="incidenceRates">
    <div id="incidenceRate" style="height: 100%;width: 100%;z-index: 1;" />
  </div>
</template>
<script>
import * as echarts from 'echarts'
import eventBus from './public/js/EvebtBus'

export default {
  name: 'IncidenceRate',
  data() {
    return {
      json: {
        name: '中国',
        where: 0,
        time: '',
        timec: '流行疾病', // 分年和分月 ALL为全部 0 4 7 substring(convert(varchar(30), time, 120), 1, *) x为传回数据库的*
        type: '流行疾病',
        detailed: 0 // 判断是否进行详细疾病展示
      },
      end: 50,
      myChart: null
    }
  },
  beforeDestroy() {
    eventBus.$off('returnAll')
    eventBus.$off('times')
    eventBus.$off('maptype')
    eventBus.$off('maptypc')
    eventBus.$off('maptypx')
    eventBus.$off('type')
    this.CAdestroy()
  },
  mounted() {
    var that = this
    that.getJson()
    // 返回全部
    eventBus.$on('returnAll', returnAll => {
      this.json.time = ''
      this.json.timec = '流行疾病'
      this.json.type = '流行疾病'
      this.json.detailed = 0
      this.end = 50
      this.myChart.clear()
      this.myChart.dispose()
      that.getJson()
    })
    // 获取查询时间
    eventBus.$on('times', (times) => {
      this.end = 50
      that.json.type = '流行疾病'
      that.json.time = times.time
      that.json.timec = times.x
      // 查询事件
      that.json.detailed = 0
      that.CAdestroy()
      that.getJson()
    })
    // 获取疾病名称
    eventBus.$on('maptype', (maptype) => {
      this.end = 100
      that.json.type = maptype
      that.json.time = ''
      // 查询事件
      that.json.detailed = 1
      that.CAdestroy()
      that.getJson()
    })
    eventBus.$on('maptypc', (maptypc) => {
      this.end = 100
      that.json.type = maptypc
      that.json.time = ''
      // 查询事件
      that.json.detailed = 1
      that.CAdestroy()
      that.getJson()
    })
    eventBus.$on('maptypx', (maptypx) => {
      this.end = 100
      that.json.type = maptypx
      that.json.time = ''
      // 查询事件
      that.json.detailed = 1
      that.CAdestroy()
      that.getJson()
    })
    // 获取地名和层级
    eventBus.$on('type', (type) => {
      that.json.name = type.name
      that.json.where = type.where
      that.CAdestroy()
      that.getJson()
    })
  },
  methods: {
    // echarts地图
    initCharts(names, datas) {
      var that = this
      this.myChart = echarts.init(document.getElementById('incidenceRate'))
      const option = {
        // 标题
        title: {
          text: that.json.time + that.json.name + '-' + that.json.type + '-' + '发病率',
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
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function(params) {
            var rez = params[0].name + '<br/>' +
              '<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#5470c6;"></span>' + '<span style="font-weight: bold">' + params[0].value + '‱' + '</span>'
            return rez
          }
        },
        xAxis: {
          type: 'category',
          data: names,
          axisLine: {
            lineStyle: {
              color: '#cccccc'
            }
          },
          axisLabel: {
            fontSize: '10px'
          }
        },
        yAxis: {
          type: 'value',
          name: '‱',
          axisLine: {
            lineStyle: {
              color: '#cccccc'
            }
          },
          splitLine: {
            show: false
          }
        },
        grid: {
          left: '3%',
          right: '3%',
          bottom: '15%',
          top: '20%',
          containLabel: true
        },
        dataZoom: [
          {
            type: 'slider',
            show: true,
            height: 15,
            start: 0,
            end: this.end,
            bottom: '6%',
            showDetail: false
          }
        ],
        series: [{
          data: datas,
          // type: 'bar',
          type: 'line',
          showBackground: true,
          itemStyle: {
            color: '#ff7979'
          },
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          },
          barWidth: '85%'
        }]
      }
      window.addEventListener('resize', function() {
        var chart = echarts.init(document.getElementById('incidenceRate'))
        if (chart) {
          chart.resize() // 不报错
        }
      })
      this.myChart.setOption(option)
      // 点击事件
      this.myChart.on('click', function(params) {
      })
    },
    getJson() {
      var that = this
      that.$store.dispatch('ndatapanel/QIncidenceRate', that.json).then((dataz) => {
        if (that.json.detailed === 0) {
          dataz.sort(function(a, b) {
            return b.发病率 - a.发病率
          })
          var names = [] // 疾病列表
          var datas = [] // 数据列表
          for (var i = 0; i < dataz.length; i++) {
            names.push(dataz[i].病名)
            datas.push(dataz[i].发病率.toFixed(2))
          }
          that.initCharts(names, datas)
        } else {
          dataz.sort(function(a, b) {
            return a.time - b.time
          })
          var times = [] // 疾病列表
          var datae = [] // 数据列表
          for (var k = 0; k < dataz.length; k++) {
            times.push(dataz[k].time)
            datae.push(dataz[k].发病率.toFixed(2))
          }
          that.initCharts(times, datae)
        }
      })
    },
    // 创建与销毁盒子
    CAdestroy() {
      if (this.myChart !== null) {
        this.myChart.clear()
        this.myChart.dispose()
      }
      // document.getElementById('incidenceRate').remove()
      // const div = document.createElement('div')
      // div.id = 'incidenceRate'
      // div.style.position = 'absolute'
      // div.style.height = '100%'
      // div.style.width = '100%'
      // div.style.zIndex = '1'
      // const incidenceRates = document.getElementById('incidenceRates')
      // incidenceRates.append(div)
    }
  }
}
</script>
<style scoped>
@font-face {
  src: url("./public/font/KuHei.ttf");
  font-family: "KuHei";
}
#incidenceRates {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
