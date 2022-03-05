<template>
  <div class="negativeHotsearch">
    <div id="negativeHotsearch" style="height: 100%;width: 100%;z-index: 99;" />
  </div>
</template>
<script>
import * as echarts from 'echarts'
export default {
  name: 'NegativeHotsearch',
  data() {
    return {
    }
  },
  mounted() {
    var that = this
    setTimeout(function() {
      that.initCharts()
    }, 1000)
  },
  methods: {
    initCharts(data) {
      const that = this
      const myChart = echarts.init(document.getElementById('negativeHotsearch'))
      const option = {
        title: {
          text: '负面热搜讨论TOP5',
          textStyle: {
            fontSize: 18,
            color: 'rgba(255, 255, 255, .8)',
            fontFamily: 'KuHei'
          },
          left: 'center'
        },
        // grid区域
        grid: {
          top: '25%', // 距上边距
          left: '25%', // 距离左边距
          right: '5%', // 距离右边距
          bottom: '5%' // 距离下边距
        },
        yAxis: {
          show: true, // 是否显示
          type: '',
          name: '',
          nameLocation: 'end',
          nameTextStyle: {
          // 坐标轴名称样式
            color: 'rgba(255, 255, 255, .8)',
            padding: [5, 0, 0, -5] // 坐标轴名称相对位置
          },
          axisLabel: {
            textStyle: {
              fontSize: 12,
              color: 'rgba(255, 255, 255, .8)'
            }
          },
          data: [
            '增长速度',
            '隔离情况',
            '确诊病例',
            '认定病例',
            '无医用资源'
          ]
        },
        xAxis: {
          show: false, // 是否显示
          name: '万',
          axisTick: {
          // 坐标轴 刻度
            show: true, // 是否显示
            inside: true, // 是否朝内
            lineStyle: {
              type: 'solid'
            }
          },
          axisLabel: {
            textStyle: {
              fontSize: 12,
              color: 'rgba(255, 255, 255, .8)'
            },
            // 坐标轴 标签
            show: true, // 是否显示
            inside: false, // 是否朝内
            margin: 8 // 刻度标签与轴线之间的距离
          },
          interval: 450, // 数值轴可用,强制设定轴刻度
          splitLine: {
          // grid 区域中的分隔线
            show: true, // 是否显示，'category'类目轴不显示，此时我的y轴为类目轴，splitLine属性是有意义的
            lineStyle: {
              color: 'rgba(255, 255, 255, .8)',
              width: 1,
              type: 'dashed' // 类型
            }
          }
        },
        // 内容数据
        series: [
          {
            name: '热搜', // 系列名称
            type: 'bar', // 类型
            legendHoverLink: true, // 是否启用图例 hover 时的联动高亮
            label: {
            // 图形上的文本标签
              show: true,
              position: 'inside', // 相对位置
              rotate: 0, // 旋转角度
              color: '#eee'
            },
            itemStyle: {
            // 图形形状
              color: '#0099CC',
              barBorderRadius: [0, 100, 100, 0]
            },
            barWidth: '15', // 柱形宽度
            barCategoryGap: '5%', // 柱形间距
            data: [1316.27, 1358.78, 1386.97, 1409.28, 1840.33]
          }
        ]
      }
      window.addEventListener('resize', function() {
        that.chart = echarts.init(document.getElementById('negativeHotsearch'))
        that.chart.resize()
      })
      myChart.setOption(option)
      myChart.on('click', function(params) {})
    }
  }
}
</script>
<style scoped>
@font-face {
  src: url("../public/font/KuHei.ttf");
  font-family: "KuHei";
}
.negativeHotsearch {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 11;
}
</style>
