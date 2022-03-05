<template>
  <div class="shsy">
    <div id="sh" style="height: 100%;width: 100%;z-index: 1;" />
    <div id="zhegai">
      <i class="jia el-icon-loading" />
    </div>
  </div>
</template>
<script>
import Bus from '../js/bus'
import * as echarts from 'echarts'
export default {
  name: 'Shsy',
  data() {
    return {
      getdata: {
        name: 'US' // 地区名称
      },
      region: '',
      tree: 0,
      c: 0,
      id: 0, // 监听调用
      length: 0,
      updateTime: [],
      legend: [],
      datalegend: [],
      alldateTime: [],
      DistancingSF: [], // 添加历史数据
      DistancingSS: [],
      DistancingST: [],
      vDistancingSF: [], // 添加预测数据
      vDistancingSS: [],
      vDistancingST: [],
      rDistancingSF: [], // 填充echarts
      rDistancingSS: [],
      rDistancingST: [],
      rvDistancingSF: [],
      rvDistancingSS: [],
      rvDistancingST: []
    }
  },
  mounted() {
    var that = this
    Bus.$on('shsy', (data) => {
      that.tree = data
      that.length = that.tree.length
      document.getElementById('zhegai').style.display = 'block'
      this.ying = setTimeout(() => {
        displan()
      }, 3000)
      function displan(params) {
        document.getElementById('zhegai').style.display = 'none'
      }
      setTimeout(function() {
        that.getqAgestatistics()
      }, 1000)
    })
  },
  methods: {
    initCharts() {
      const that = this
      document.getElementById('sh').removeAttribute('_echarts_instance_')
      const myChart = echarts.init(document.getElementById('sh'))
      const option = {
        title: {
          text: '社会疏远'
        },
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            var time = new Date(params[0].name)
            var timr = new Date() // 今天
            if (time - timr > 0) { // 如果在今天之后
              var res = params[0].name + '<br/>'
              for (var i = 0; i < params.length; i++) {
                res += params[i].marker + params[i].seriesName + '：' + '<span style="font-weight: bold">' + params[i].data + '</span>' + '<br/>'
              }
              return res
            } else {
              var rez = params[0].name + '<br/>' +
              '<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:rgb(248, 165, 0);"></span>' + 'reported' + '：' + '<span style="font-weight: bold">' + params[0].data + '</span>'
              return rez
            }
          }
        },
        legend: {
          data: that.datalegend
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: that.alldateTime
        },
        yAxis: {
          type: 'value'
        },
        dataZoom: [
          {
            show: true,
            type: 'slider',
            top: '90%',
            start: 55,
            end: 100
          }
        ],
        series: [
          {
            type: 'line',
            data: that.rDistancingSF
          },
          {
            name: 'Projection',
            type: 'line',
            data: that.rvDistancingSF,
            lineStyle: {
              normal: {
                type: 'dotted'
              }
            }
          },
          {
            type: 'line',
            data: that.rDistancingSS
          },
          {
            name: 'Worse',
            type: 'line',
            data: that.rvDistancingSS,
            lineStyle: {
              normal: {
                type: 'dotted'
              }
            }
          },
          {
            type: 'line',
            data: that.rDistancingST
          },
          {
            name: 'Marks',
            type: 'line',
            data: that.rvDistancingST,
            lineStyle: {
              normal: {
                type: 'dotted'
              }
            }
          }
        ]
      }
      myChart.setOption(option)
    },
    getqAgestatistics() {
      var that = this
      // 获取当前时间
      var nowDate = new Date()
      var date = {
        year: nowDate.getFullYear(),
        month: nowDate.getMonth() + 1,
        date: nowDate.getDate()
      }
      var newmonth = date.month > 10 ? date.month : '0' + date.month
      var day = date.date > 10 ? date.date : '0' + date.date
      that.updateTime = []
      that.updateTime = date.year + '-' + newmonth + '-' + day
      that.$store.dispatch('city/qDIDetection', that.getdata.name).then((dataH) => {
        that.c = 0
        that.alldateTime = []
        that.DistancingSF = [] // 添加历史数据
        that.DistancingSS = []
        that.DistancingST = []

        that.vDistancingSF = [] // 添加预测数据
        that.vDistancingSS = []
        that.vDistancingST = []

        that.rDistancingSF = []
        that.rDistancingSS = []
        that.rDistancingST = []

        that.rvDistancingSF = []
        that.rvDistancingSS = []
        that.rvDistancingST = []
        that.legend = []
        that.datalegend = []
        for (var i = 0; i < dataH.SDistancingSFTime.length; i++) {
          var time = new Date(dataH.SDistancingSFTime[i])
          dataH.SDistancingSFTime[i] = time.getFullYear() + '-' + that.checkTime(time.getMonth() + 1) + '-' + that.checkTime(time.getDate())
          that.alldateTime.push(dataH.SDistancingSFTime[i])
          if (that.updateTime === dataH.SDistancingSFTime[i - 1]) {
            that.vDistancingSF.push(dataH.SDistancingSF[i - 1]) // 获取当前日期时间
            that.vDistancingSS.push(dataH.SDistancingSS[i - 1])
            that.vDistancingST.push(dataH.SDistancingST[i - 1])
            that.c = i
          }
          if (that.c) {
            that.vDistancingSF.push(dataH.SDistancingSF[i]) // 获取预测数据
            that.vDistancingSS.push(dataH.SDistancingSS[i])
            that.vDistancingST.push(dataH.SDistancingST[i])
          } else {
            that.DistancingSF.push(dataH.SDistancingSF[i]) // 获取历史数据
            that.vDistancingSF.push('')
            that.DistancingSS.push(dataH.SDistancingSS[i])
            that.vDistancingSS.push('')
            that.DistancingST.push(dataH.SDistancingST[i])
            that.vDistancingST.push('')
          }
        }
        if (that.tree.length === 1) {
          if (that.tree.includes('projection')) {
            that.rDistancingSF = that.DistancingSF
            that.rvDistancingSF = that.vDistancingSF
            that.legend = ['Projection']
            that.datalegend = that.legend
          } else if (that.tree.includes('worse')) {
            that.rDistancingSS = that.DistancingSS
            that.rvDistancingSS = that.vDistancingSS
            that.legend = ['Worse']
            that.datalegend = that.legend
          } else if (that.tree.includes('marks')) {
            that.rDistancingST = that.DistancingST
            that.rvDistancingST = that.vDistancingST
            that.legend = ['Marks']
            that.datalegend = that.legend
          }
        } else if (that.tree.length === 2) {
          if (that.tree.includes('projection') && that.tree.includes('worse')) {
            that.rDistancingSF = that.DistancingSF
            that.rvDistancingSF = that.vDistancingSF
            that.rDistancingSS = that.DistancingSS
            that.rvDistancingSS = that.vDistancingSS
            that.legend = ['Projection', 'Worse']
            that.datalegend = that.legend
          } else if (that.tree.includes('worse') && that.tree.includes('marks')) {
            that.rDistancingSS = that.DistancingSS
            that.rvDistancingSS = that.vDistancingSS
            that.rDistancingST = that.DistancingST
            that.rvDistancingST = that.vDistancingST
            that.legend = ['Worse', 'Marks']
            that.datalegend = that.legend
          } else if (that.tree.includes('marks') && that.tree.includes('projection')) {
            that.rDistancingSF = that.DistancingSF
            that.rvDistancingSF = that.vDistancingSF
            that.rDistancingST = that.DistancingST
            that.rvDistancingST = that.vDistancingST
            that.legend = ['Projection', 'Marks']
            that.datalegend = that.legend
          }
        } else if (that.tree.length === 3) {
          that.rDistancingSF = that.DistancingSF
          that.rvDistancingSF = that.vDistancingSF
          that.rDistancingSS = that.DistancingSS
          that.rvDistancingSS = that.vDistancingSS
          that.rDistancingST = that.DistancingST
          that.rvDistancingST = that.vDistancingST
          that.legend = ['Projection', 'Worse', 'Marks']
          that.datalegend = that.legend
        }
        that.initCharts()
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
.shsy {
    position: absolute;
    width: 100%;
    height: 100%;
}
#zhegai {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(204, 204, 204, 0.8);
  z-index: 101;
  top: 0;
  display: none;
}
#zhegai .jia {
  position: absolute;
  left: 48%;
  top: 45.5%;
  font-size: 80px;
}
</style>
