<template>
  <div class="grjc">
    <div id="gr" style="height: 100%;width: 100%;z-index: 1;" />
    <div id="zhegai">
      <i class="jia el-icon-loading" />
    </div>
  </div>
</template>
<script>
import * as echarts from 'echarts'
import Bus from '../js/bus'
export default {
  name: 'Grjc',
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
      ljsw: [],
      legend: [],
      datalegend: [],
      updateTime: [],
      alldateTime: [],
      InfectedSF: [], // 添加历史数据
      InfectedSS: [],
      InfectedST: [],
      vInfectedSF: [], // 添加预测数据
      vInfectedSS: [],
      vInfectedST: [],
      rInfectedSF: [], // 填充echarts
      rInfectedSS: [],
      rInfectedST: [],
      rvInfectedSF: [],
      rvInfectedSS: [],
      rvInfectedST: [],
      CIInfected: [],
      vCIInfected: [],
      rCIInfected: [],
      rvCIInfected: []
    }
  },
  watch: {
    'id'() {
      var that = this
      if (that.region === 'yibaodao') {
        setTimeout(function() {
          that.getqAgestatistics()
        }, 1000)
      } else if (that.region === 'weibaodao') {
        setTimeout(function() {
          that.getqAgestatistics()
        }, 1000)
      }
    }
  },
  mounted() {
    var that = this
    Bus.$on('grjc1', (data) => {
      that.id = data.id
      that.region = data.label
    })
    Bus.$on('grjc2', (data) => {
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
      document.getElementById('gr').removeAttribute('_echarts_instance_')
      const myChart = echarts.init(document.getElementById('gr'))
      const option = {
        title: {
          text: '感染检测'
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
            data: that.rInfectedSF
          },
          {
            name: 'Projection',
            type: 'line',
            data: that.rvInfectedSF,
            lineStyle: {
              normal: {
                type: 'dotted'
              }
            }
          },
          {
            type: 'line',
            data: that.rInfectedSS
          },
          {
            name: 'Worse',
            type: 'line',
            data: that.rvInfectedSS,
            lineStyle: {
              normal: {
                type: 'dotted'
              }
            }
          },
          {
            name: 'Marks',
            type: 'line',
            data: that.rInfectedST
          },
          {
            name: 'vMarks',
            type: 'line',
            data: that.rvInfectedST,
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
      // var nowDate = new Date()
      // var date = {
      //   year: nowDate.getFullYear(),
      //   month: nowDate.getMonth() + 1,
      //   date: nowDate.getDate()
      // }
      // var newmonth = date.month > 10 ? date.month : '0' + date.month
      // var day = date.date > 10 ? date.date : '0' + date.date
      that.updateTime = []
      that.updateTime = '2021-06-28'
      // that.updateTime = date.year + '-' + newmonth + '-' + day

      that.InfectedSF = []
      that.InfectedSS = []
      that.InfectedST = []
      that.vInfectedSF = []
      that.vInfectedSS = []
      that.vInfectedST = []
      that.alldateTime = []
      that.c = 0
      that.rInfectedSF = []
      that.rInfectedSS = []
      that.rInfectedST = []
      that.rvInfectedSF = []
      that.rvInfectedSS = []
      that.rvInfectedST = []
      if (that.region === 'yggr') {
        that.$store.dispatch('city/qPInfection', that.getdata.name).then((dataH) => {
          that.legend = []
          that.datalegend = []
          var j = 0
          for (var i = 0; i < dataH.PInfectedSFTime.length; i++) {
            var time = new Date(dataH.PInfectedSFTime[i])
            dataH.PInfectedSFTime[i] = time.getFullYear() + '-' + that.checkTime(time.getMonth() + 1) + '-' + that.checkTime(time.getDate())
            that.alldateTime.push(dataH.PInfectedSFTime[i])
            if (that.updateTime === dataH.PInfectedSFTime[i - 1]) {
              that.vInfectedSF.push(dataH.PInfectedSF[i - 1]) // 获取当前日期时间
              that.vInfectedSS.push(dataH.PInfectedSF[i - 1])
              that.vInfectedST.push(dataH.PInfectedSF[i - 1])
              that.c = i
            }
            if (that.c) {
              that.vInfectedSF.push(dataH.PInfectedSF[i]) // 获取预测数据
              j++
              that.vInfectedSS.push(dataH.PInfectedSS[j])
              that.vInfectedST.push(dataH.PInfectedST[j])
            } else {
              that.InfectedSF.push(dataH.PInfectedSF[i]) // 获取历史数据
              that.vInfectedSF.push('')
              that.InfectedSS.push(dataH.PInfectedSF[i])
              that.vInfectedSS.push('')
              that.InfectedST.push(dataH.PInfectedSF[i])
              that.vInfectedST.push('')
            }
          }
          if (that.tree.length === 1) {
            if (that.tree.includes('projection')) {
              that.rInfectedSF = that.InfectedSF
              that.rvInfectedSF = that.vInfectedSF
              that.legend = ['Projection']
              that.datalegend = that.legend
            } else if (that.tree.includes('worse')) {
              that.rInfectedSS = that.InfectedSS
              that.rvInfectedSS = that.vInfectedSS
              that.legend = ['Worse']
              that.datalegend = that.legend
            } else if (that.tree.includes('marks')) {
              that.rInfectedST = that.InfectedST
              that.rvInfectedST = that.vInfectedST
              that.legend = ['Marks']
              that.datalegend = that.legend
            }
          } else if (that.tree.length === 2) {
            if (that.tree.includes('projection') && that.tree.includes('worse')) {
              that.rInfectedSF = that.InfectedSF
              that.rvInfectedSF = that.vInfectedSF
              that.rInfectedSS = that.InfectedSS
              that.rvInfectedSS = that.vInfectedSS
              that.legend = ['Projection', 'Worse']
              that.datalegend = that.legend
            } else if (that.tree.includes('worse') && that.tree.includes('marks')) {
              that.rInfectedSS = that.InfectedSS
              that.rvInfectedSS = that.vInfectedSS
              that.rInfectedST = that.InfectedST
              that.rvInfectedST = that.vInfectedST
              that.legend = ['Worse', 'Marks']
              that.datalegend = that.legend
            } else if (that.tree.includes('marks') && that.tree.includes('projection')) {
              that.rInfectedSF = that.InfectedSF
              that.rvInfectedSF = that.vInfectedSF
              that.rInfectedST = that.InfectedST
              that.rvInfectedST = that.vInfectedST
              that.legend = ['Projection', 'Marks']
              that.datalegend = that.legend
            }
          } else if (that.tree.length === 3) {
            that.rInfectedSF = that.InfectedSF
            that.rInfectedSS = that.InfectedSS
            that.rInfectedST = that.InfectedST
            that.rvInfectedSF = that.vInfectedSF
            that.rvInfectedSS = that.vInfectedSS
            that.rvInfectedST = that.vInfectedST
            that.legend = ['Projection', 'Worse', 'Marks']
            that.datalegend = that.legend
          }
          that.initCharts()
        })
      } else if (that.region === 'qzgr') {
        that.legend = []
        that.datalegend = []
        that.$store.dispatch('city/qCInfection', that.getdata.name).then((dataH) => {
          for (var i = 0; i < dataH.CIInfectedTime.length; i++) {
            var time = new Date(dataH.CIInfectedTime[i])
            dataH.CIInfectedTime[i] = time.getFullYear() + '-' + that.checkTime(time.getMonth() + 1) + '-' + that.checkTime(time.getDate())
            that.alldateTime.push(dataH.CIInfectedTime[i])
            if (that.updateTime === dataH.CIInfectedTime[i - 1]) {
              that.vInfectedSF.push(dataH.CIInfected[i - 1]) // 获取当前日期时间
              that.c = i
            }
            if (that.c) {
              that.vInfectedSF.push(dataH.CIInfected[i]) // 获取预测数据
            } else {
              that.InfectedSF.push(dataH.CIInfected[i]) // 获取历史数据
              that.vInfectedSF.push('')
            }
          }
          that.rInfectedSF = that.InfectedSF
          // that.rvInfectedSF = that.vInfectedSF
          that.initCharts()
        })
      } else {
        that.legend = []
        that.datalegend = []
        that.$store.dispatch('city/qCInfection', that.getdata.name).then((dataH) => {
          for (var i = 0; i < dataH.TeInfectedTime.length; i++) {
            var time = new Date(dataH.TeInfectedTime[i])
            dataH.TeInfectedTime[i] = time.getFullYear() + '-' + that.checkTime(time.getMonth() + 1) + '-' + that.checkTime(time.getDate())
            that.alldateTime.push(dataH.TeInfectedTime[i])
            if (that.updateTime === dataH.TeInfectedTime[i - 1]) {
              that.vInfectedSF.push(dataH.TeInfected[i - 1]) // 获取当前日期时间
              that.c = i
            }
            if (that.c) {
              that.vInfectedSF.push(dataH.TeInfected[i]) // 获取预测数据
            } else {
              that.InfectedSF.push(dataH.TeInfected[i]) // 获取历史数据
              that.vInfectedSF.push('')
            }
          }
          that.rInfectedSF = that.InfectedSF
          that.rvInfectedSF = that.vInfectedSF
          that.initCharts()
        })
      }
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
.grjc {
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
