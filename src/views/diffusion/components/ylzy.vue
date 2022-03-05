<template>
  <div class="ylzy">
    <div id="yl" style="height: 100%;width: 100%;z-index: 1;" />
    <div id="zhegai">
      <i class="jia el-icon-loading" />
    </div>
  </div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import * as echarts from 'echarts'
import Bus from '../js/bus'
export default {
  name: 'Ylzy',
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
      alldateTime: [],
      Beds: [], // 添加历史数据
      vBeds: [], // 添加预测数据
      rBeds: [], // 填充echarts
      rvBeds: [],
      IBeds: [], // 添加历史数据
      vIBeds: [], // 添加预测数据
      rIBeds: [], // 填充echarts
      rvIBeds: []
    }
  },
  mounted() {
    var that = this
    Bus.$on('ylzy', (data) => {
      that.id = data.id
      that.region = data.label
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
      const myChart = echarts.init(document.getElementById('yl'))
      const option = {
        title: {
          text: '医疗资源'
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
            data: that.rBeds
          },
          {
            name: 'Allbeds',
            type: 'line',
            data: that.rvBeds,
            lineStyle: {
              normal: {
                type: 'dotted'
              }
            }
          },
          {
            type: 'line',
            data: that.rIBeds
          },
          {
            name: 'ICUbeds',
            type: 'line',
            data: that.rvIBeds,
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
      if (that.region === 'allbeds') {
        that.$store.dispatch('city/qHBeds', that.getdata.name).then((dataH) => {
          that.c = 0
          that.alldateTime = []
          that.Beds = [] // 添加历史数据
          that.vBeds = [] // 添加预测数据
          that.rBeds = [] // 填充echarts
          that.rvBeds = []
          for (var i = 0; i < dataH.ABedsTime.length; i++) {
            var time = new Date(dataH.ABedsTime[i])
            dataH.ABedsTime[i] = time.getFullYear() + '-' + that.checkTime(time.getMonth() + 1) + '-' + that.checkTime(time.getDate())
            that.alldateTime.push(dataH.ABedsTime[i])
            if (that.updateTime === dataH.ABedsTime[i - 1]) {
              that.vBeds.push(dataH.ABeds[i - 1]) // 获取当前日期时间
              that.c = i
            }
            if (that.c) {
              that.vBeds.push(dataH.ABeds[i]) // 获取预测数据
            } else {
              that.Beds.push(dataH.ABeds[i]) // 获取历史数据
              that.vBeds.push('')
            }
          }
          that.rBeds = that.Beds
          that.rvBeds = that.vBeds
          that.initCharts()
        })
      } else {
        that.$store.dispatch('city/qHBeds', that.getdata.name).then((dataH) => {
          that.c = 0
          that.alldateTime = []
          that.IBeds = [] // 添加历史数据
          that.IvBeds = [] // 添加预测数据
          that.rIBeds = [] // 填充echarts
          that.rvIBeds = []
          for (var i = 0; i < dataH.IBedsTime.length; i++) {
            var time = new Date(dataH.IBedsTime[i])
            dataH.IBedsTime[i] = time.getFullYear() + '-' + that.checkTime(time.getMonth() + 1) + '-' + that.checkTime(time.getDate())
            that.alldateTime.push(dataH.IBedsTime[i])
            if (that.updateTime === dataH.IBedsTime[i - 1]) {
              that.vIBeds.push(dataH.IBeds[i - 1]) // 获取当前日期时间
              that.c = i
            }
            if (that.c) {
              that.vIBeds.push(dataH.IBeds[i]) // 获取预测数据
            } else {
              that.IBeds.push(dataH.IBeds[i]) // 获取历史数据
              that.vIBeds.push('')
            }
          }
          that.rIBeds = that.IBeds
          that.rvIBeds = that.vIBeds
          that.initCharts()
        })
      }
    }
  }
}
</script>
<style scoped>
.ylzy {
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
