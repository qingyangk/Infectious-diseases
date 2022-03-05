<template>
  <div class="kzly">
    <div id="kz" style="height: 100%;width: 100%;z-index: 1;" />
    <div id="zhegai">
      <i class="jia el-icon-loading" />
    </div>
  </div>
</template>
<script>
import Bus from '../js/bus'
import * as echarts from 'echarts'
export default {
  name: 'Kzly',
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
      updateTime: [],
      alldateTime: [],
      MaskSF: [], // 添加历史数据
      MaskST: [],
      vMaskSF: [], // 添加预测数据
      vMaskST: [],
      rMaskSF: [], // 填充echarts
      rMaskST: [],
      rvMaskSF: [],
      rvMaskST: []
    }
  },
  mounted() {
    var that = this
    Bus.$on('kzly', (data) => {
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
      document.getElementById('kz').removeAttribute('_echarts_instance_')
      const myChart = echarts.init(document.getElementById('kz'))
      const option = {
        title: {
          text: '口罩利用'
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
            data: that.rMaskSF
          },
          {
            name: 'Projection',
            type: 'line',
            data: that.rvMaskSF,
            lineStyle: {
              normal: {
                type: 'dotted'
              }
            }
          },
          {
            type: 'line',
            data: that.rMaskST
          },
          {
            name: 'Marks',
            type: 'line',
            data: that.rvMaskST,
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
      that.$store.dispatch('city/qMUtilization', that.getdata.name).then((dataH) => {
        that.c = 0
        that.alldateTime = []
        that.MaskSF = [] // 添加历史数据
        that.MaskST = []
        that.vMaskSF = [] // 添加预测数据
        that.vMaskST = []
        that.rMaskSF = [] // 填充echarts
        that.rMaskST = []
        that.rvMaskSF = []
        that.rvMaskST = []
        for (var i = 0; i < dataH.MaskSFTime.length; i++) {
          var time = new Date(dataH.MaskSFTime[i])
          dataH.MaskSFTime[i] = time.getFullYear() + '-' + that.checkTime(time.getMonth() + 1) + '-' + that.checkTime(time.getDate())
          that.alldateTime.push(dataH.MaskSFTime[i])
          if (that.updateTime === dataH.MaskSFTime[i - 1]) {
            that.vMaskSF.push(dataH.MaskSF[i - 1]) // 获取当前日期时间
            that.vMaskST.push(dataH.MaskST[i - 1])
            that.c = i
          }
          if (that.c) {
            that.vMaskSF.push(dataH.MaskSF[i]) // 获取预测数据
            that.vMaskST.push(dataH.MaskST[i])
          } else {
            that.MaskSF.push(dataH.MaskSF[i]) // 获取历史数据
            that.vMaskSF.push('')
            that.MaskST.push(dataH.MaskST[i])
            that.vMaskST.push('')
          }
        }
        if (that.tree.length === 1) {
          if (that.tree.includes('projection')) {
            that.rMaskSF = that.MaskSF
            that.rvMaskSF = that.vMaskSF
            that.legend = ['Projection']
            that.datalegend = that.legend
          } else if (that.tree.includes('marks')) {
            that.rMaskST = that.MaskST
            that.rvMaskST = that.vMaskST
            that.legend = ['Marks']
            that.datalegend = that.legend
          }
        } else if (that.tree.length === 2) {
          that.rMaskSF = that.MaskSF
          that.rvMaskSF = that.vMaskSF
          that.rMaskST = that.MaskST
          that.rvMaskST = that.vMaskST
          that.legend = ['Projection', 'Marks']
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
.kzly {
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
