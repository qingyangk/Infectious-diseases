<template>
  <div class="proportionHotsearch">
    <div id="proportionHotsearch" style="height: 100%;width: 100%;z-index: 99;" />
  </div>
</template>
<script>
import * as echarts from 'echarts'
export default {
  name: 'ProportionHotsearch',
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
      const myChart = echarts.init(document.getElementById('proportionHotsearch'))
      const option = {
        title: {
          text: '热搜类别占比分布',
          textStyle: {
            fontSize: 18,
            color: 'rgba(255, 255, 255, .8)',
            fontFamily: 'KuHei'
          },
          left: 'center'
        },
        tooltip: {
        // 提示框，可以在全局也可以在
          trigger: 'item', // 提示框的样式
          formatter: '{a} <br/>{b}: {c} ({d}%)',
          color: '#000', // 提示框的背景色
          textStyle: {
          // 提示的字体样式
            color: 'rgba(255, 255, 255, .8)'
          }
        },
        legend: {
        // 图例
          orient: 'vertical', // 图例的布局，竖直    horizontal为水平
          x: 'right', // 图例显示在右边
          y: 'bottom',
          itemGap: 2,
          data: [
            '国内新闻',
            '娱乐类',
            '生活类',
            '国内进度',
            '社会类',
            '国外进度',
            '病毒科谱'
          ],
          textStyle: {
          // 图例文字的样式
            color: 'rgba(255, 255, 255, .8)', // 文字颜色
            fontSize: 10 // 文字大小
          }
        },
        // 边框设置
        grid: {
          top: '50%', // 距上边距
          left: '10%', // 距离左边距
          right: '10%', // 距离右边距
          bottom: '0%' // 距离下边距
        },
        series: [
          {
            name: '访问来源',
            type: 'pie', // 环形图的type和饼图相同
            center: ['40%', '56%'],
            radius: ['40%', '55%'], // 饼图的半径，第一个为内半径，第二个为外半径
            avoidLabelOverlap: false,
            color: [
              '#660066',
              '#663366',
              '#666666',
              '#669966',
              '#66CC66',
              '#666699',
              '#669999'
            ],
            label: {
              normal: {
              // 正常的样式
                show: true,
                position: 'left',
                borderWidth: 20,
                borderRadius: 3,
                padding: [0, -20]
              },
              itemStyle: {
                normal: {
                  label: {
                    show: true,
                    formatter: '{b}:{c}'
                  }
                }
              },
              emphasis: {
              // 选中时候的样式
                show: true,
                textStyle: {
                  fontSize: '10',
                  fontWeight: 'bold'
                }
              }
            },
            // 提示文字
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: 2497, name: '国内新闻' },
              { value: 1731, name: '娱乐类' },
              { value: 1449, name: '生活类' },
              { value: 955, name: '国内进度' },
              { value: 652, name: '社会类' },
              { value: 341, name: '国外进度' },
              { value: 220, name: '病毒科普' }
            ]
          }
        ]
      }
      window.addEventListener('resize', function() {
        that.chart = echarts.init(document.getElementById('proportionHotsearch'))
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
.proportionHotsearch {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 11;
}
</style>
