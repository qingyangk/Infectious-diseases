<template>
  <div class="ljsw">
    <div id="lj" style="height: 100%;width: 100%;z-index: 1;" />
    <div id="zhegai">
      <i class="jia el-icon-loading" />
    </div>
  </div>
</template>
<script>
import * as echarts from 'echarts'
import Bus from '../js/bus'
export default {
  name: 'Ljsw',
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
      legend: [],
      datalegend: [],
      ljsw: [],
      updateTime: [],
      alldateTime: [],
      CRDeathSF: [], // 添加历史数据
      CRDeathSS: [],
      CRDeathST: [],
      vCRDeathSF: [], // 添加预测数据
      vCRDeathSS: [],
      vCRDeathST: [],
      rCRDeathSF: [], // 填充echarts
      rCRDeathSS: [],
      rCRDeathST: [],
      rvCRDeathSF: [],
      rvCRDeathSS: [],
      rvCRDeathST: []
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
    Bus.$on('ljsw1', (data) => {
      that.id = data.id
      that.region = data.label
    })
    Bus.$on('ljsw2', (data) => {
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
      document.getElementById('lj').removeAttribute('_echarts_instance_')
      const myChart = echarts.init(document.getElementById('lj'))
      const option = {
        title: {
          text: '累计死亡'
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
            data: that.rCRDeathSF
          },
          {
            name: 'Projection',
            type: 'line',
            data: that.rvCRDeathSF,
            lineStyle: {
              normal: {
                type: 'dotted'
              }
            }
          },
          {
            type: 'line',
            data: that.rCRDeathSS
          },
          {
            name: 'Worse',
            type: 'line',
            data: that.rvCRDeathSS,
            lineStyle: {
              normal: {
                type: 'dotted'
              }
            }
          },
          {
            type: 'line',
            data: that.rCRDeathST
          },
          {
            name: 'Marks',
            type: 'line',
            data: that.rvCRDeathST,
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
      if (that.region === 'yibaodao') {
        that.$store.dispatch('city/qRDeath', that.getdata.name).then((dataH) => {
          that.CRDeathSF = []
          that.CRDeathSS = []
          that.CRDeathST = []
          that.vCRDeathSF = []
          that.vCRDeathSS = []
          that.vCRDeathST = []
          that.alldateTime = []
          that.c = 0
          that.rCRDeathSF = []
          that.rCRDeathSS = []
          that.rCRDeathST = []
          that.rvCRDeathSF = []
          that.rvCRDeathSS = []
          that.rvCRDeathST = []
          that.legend = []
          that.datalegend = []
          for (var i = 0; i < dataH.CRDeathSFTime.length; i++) {
            var time = new Date(dataH.CRDeathSFTime[i])
            dataH.CRDeathSFTime[i] = time.getFullYear() + '-' + that.checkTime(time.getMonth() + 1) + '-' + that.checkTime(time.getDate())
            that.alldateTime.push(dataH.CRDeathSFTime[i])
            if (that.updateTime === dataH.CRDeathSFTime[i - 1]) {
              that.vCRDeathSF.push(dataH.CRDeathSF[i - 1]) // 获取当前日期时间
              that.vCRDeathSS.push(dataH.CRDeathSS[i - 1])
              that.vCRDeathST.push(dataH.CRDeathST[i - 1])
              that.c = i
            }
            if (that.c) {
              that.vCRDeathSF.push(dataH.CRDeathSF[i]) // 获取预测数据
              that.vCRDeathSS.push(dataH.CRDeathSS[i])
              that.vCRDeathST.push(dataH.CRDeathST[i])
            } else {
              that.CRDeathSF.push(dataH.CRDeathSF[i]) // 获取历史数据
              that.vCRDeathSF.push('')
              that.CRDeathSS.push(dataH.CRDeathSS[i])
              that.vCRDeathSS.push('')
              that.CRDeathST.push(dataH.CRDeathST[i])
              that.vCRDeathST.push('')
            }
          }
          if (that.tree.length === 1) {
            if (that.tree.includes('projection')) {
              that.rCRDeathSF = that.CRDeathSF
              that.rvCRDeathSF = that.vCRDeathSF
              that.legend = ['Projection']
              that.datalegend = that.legend
            } else if (that.tree.includes('worse')) {
              that.rCRDeathSS = that.CRDeathSS
              that.rvCRDeathSS = that.vCRDeathSS
              that.legend = ['Worse']
              that.datalegend = that.legend
            } else if (that.tree.includes('marks')) {
              that.rCRDeathST = that.CRDeathST
              that.rvCRDeathST = that.vCRDeathST
              that.legend = ['Marks']
              that.datalegend = that.legend
            }
          } else if (that.tree.length === 2) {
            if (that.tree.includes('projection') && that.tree.includes('worse')) {
              that.rCRDeathSF = that.CRDeathSF
              that.rvCRDeathSF = that.vCRDeathSF
              that.rCRDeathSS = that.CRDeathSS
              that.rvCRDeathSS = that.vCRDeathSS
              that.legend = ['Projection', 'Worse']
              that.datalegend = that.legend
            } else if (that.tree.includes('worse') && that.tree.includes('marks')) {
              that.rCRDeathSS = that.CRDeathSS
              that.rvCRDeathSS = that.vCRDeathSS
              that.rCRDeathST = that.CRDeathST
              that.rvCRDeathST = that.vCRDeathST
              that.legend = ['Worse', 'Marks']
              that.datalegend = that.legend
            } else if (that.tree.includes('marks') && that.tree.includes('projection')) {
              that.rCRDeathSF = that.CRDeathSF
              that.rvCRDeathSF = that.vCRDeathSF
              that.rCRDeathST = that.CRDeathST
              that.rvCRDeathST = that.vCRDeathST
              that.legend = ['Projection', 'Marks']
              that.datalegend = that.legend
            }
          } else if (that.tree.length === 3) {
            that.rCRDeathSF = that.CRDeathSF
            that.rCRDeathSS = that.CRDeathSS
            that.rCRDeathST = that.CRDeathST
            that.rvCRDeathSF = that.vCRDeathSF
            that.rvCRDeathSS = that.vCRDeathSS
            that.rvCRDeathST = that.vCRDeathST
            that.legend = ['Projection', 'Worse', 'Marks']
            that.datalegend = that.legend
          }
          that.initCharts()
        })
      } else {
        that.$store.dispatch('city/qRNDeath', that.getdata.name).then((dataH) => {
          that.CRDeathSF = []
          that.CRDeathSS = []
          that.CRDeathST = []
          that.vCRDeathSF = []
          that.vCRDeathSS = []
          that.vCRDeathST = []
          that.alldateTime = []
          that.c = 0
          that.rCRDeathSF = []
          that.rCRDeathSS = []
          that.rCRDeathST = []
          that.rvCRDeathSF = []
          that.rvCRDeathSS = []
          that.rvCRDeathST = []
          for (var i = 0; i < dataH.CADeathSFTime.length; i++) {
            var time = new Date(dataH.CADeathSFTime[i])
            dataH.CADeathSFTime[i] = time.getFullYear() + '-' + that.checkTime(time.getMonth() + 1) + '-' + that.checkTime(time.getDate())
            that.alldateTime.push(dataH.CADeathSFTime[i])
            if (that.updateTime === dataH.CADeathSFTime[i - 1]) {
              that.vCRDeathSF.push(dataH.CADeathSF[i - 1]) // 获取当前日期时间
              that.vCRDeathSS.push(dataH.CADeathSS[i - 1])
              that.vCRDeathST.push(dataH.CADeathST[i - 1])
              that.c = i
            }
            if (that.c) {
              that.vCRDeathSF.push(dataH.CADeathSF[i]) // 获取预测数据
              that.vCRDeathSS.push(dataH.CADeathSS[i])
              that.vCRDeathST.push(dataH.CADeathST[i])
            } else {
              that.CRDeathSF.push(dataH.CADeathSF[i]) // 获取历史数据
              that.vCRDeathSF.push('')
              that.CRDeathSS.push(dataH.CADeathSS[i])
              that.vCRDeathSS.push('')
              that.CRDeathST.push(dataH.CADeathST[i])
              that.vCRDeathST.push('')
            }
          }
          if (that.tree.length === 1) {
            if (that.tree.includes('projection')) {
              that.rCRDeathSF = that.CRDeathSF
              that.rvCRDeathSF = that.vCRDeathSF
              that.legend = ['Projection']
              that.datalegend = that.legend
            } else if (that.tree.includes('worse')) {
              that.rCRDeathSS = that.CRDeathSS
              that.rvCRDeathSS = that.vCRDeathSS
              that.legend = ['Worse']
              that.datalegend = that.legend
            } else if (that.tree.includes('marks')) {
              that.rCRDeathST = that.CRDeathST
              that.rvCRDeathST = that.vCRDeathST
              that.legend = ['Marks']
              that.datalegend = that.legend
            }
          } else if (that.tree.length === 2) {
            if (that.tree.includes('projection') && that.tree.includes('worse')) {
              that.rCRDeathSF = that.CRDeathSF
              that.rvCRDeathSF = that.vCRDeathSF
              that.rCRDeathSS = that.CRDeathSS
              that.rvCRDeathSS = that.vCRDeathSS
              that.legend = ['Projection', 'Worse']
              that.datalegend = that.legend
            } else if (that.tree.includes('worse') && that.tree.includes('marks')) {
              that.rCRDeathSS = that.CRDeathSS
              that.rvCRDeathSS = that.vCRDeathSS
              that.rCRDeathST = that.CRDeathST
              that.rvCRDeathST = that.vCRDeathST
              that.legend = ['Worse', 'Marks']
              that.datalegend = that.legend
            } else if (that.tree.includes('marks') && that.tree.includes('projection')) {
              that.rCRDeathSF = that.CRDeathSF
              that.rvCRDeathSF = that.vCRDeathSF
              that.rCRDeathST = that.CRDeathST
              that.rvCRDeathST = that.vCRDeathST
              that.legend = ['Projection', 'Marks']
              that.datalegend = that.legend
            }
          } else if (that.tree.length === 3) {
            that.rCRDeathSF = that.CRDeathSF
            that.rCRDeathSS = that.CRDeathSS
            that.rCRDeathST = that.CRDeathST
            that.rvCRDeathSF = that.vCRDeathSF
            that.rvCRDeathSS = that.vCRDeathSS
            that.rvCRDeathST = that.vCRDeathST
            that.legend = ['Projection', 'Worse', 'Marks']
            that.datalegend = that.legend
          }
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
.ljsw {
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
