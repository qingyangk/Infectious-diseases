<template>
  <div class="hotsearchDistribution">
    <div id="hotsearchDistribution" style="height: 100%;width: 100%;z-index: 99;" />
  </div>
</template>
<script>
import * as echarts from 'echarts'
export default {
  name: 'HotsearchDistribution',
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
      const myChart = echarts.init(document.getElementById('hotsearchDistribution'))
      const option = {
        title: {
          text: '每日热搜分类分布',
          textStyle: {
            fontSize: 18,
            color: 'rgba(255, 255, 255, .8)',
            fontFamily: 'KuHei'
          },
          left: 'center'
        },
        legend: {
          orient: 'horizontal',
          x: 'center',
          y: 'top',
          padding: [25, 50, 0, 0],
          data: ['国内相关', '娱乐话题', '国外相关'],
          textStyle: {
            color: 'rgba(255, 255, 255, .8)'
          }
        },
        // 边框设置
        grid: {
          top: '32%', // 距上边距
          left: '8%', // 距离左边距
          right: '5%', // 距离右边距
          bottom: '15%' // 距离下边距
        },
        xAxis: [
          {
            type: 'category',
            data: [
              '2021-05-25',
              '2021-05-26',
              '2021-05-27',
              '2021-05-28',
              '2021-05-29',
              '2021-05-30',
              '2021-05-31',
              '2021-06-1',
              '2021-06-2',
              '2021-06-3',
              '2021-06-4',
              '2021-06-5',
              '2021-06-6',
              '2021-06-7',
              '2021-06-8',
              '2021-06-9',
              '2021-06-10',
              '2021-06-11',
              '2021-06-12',
              '2021-06-13',
              '2021-06-14',
              '2021-06-15',
              '2021-06-16',
              '2021-06-17',
              '2021-06-18',
              '2021-06-19',
              '2021-06-20',
              '2021-06-21',
              '2021-06-22',
              '2021-06-23',
              '2021-06-24',
              '2021-06-25',
              '2021-06-26',
              '2021-06-27',
              '2021-06-28',
              '2021-06-29',
              '2021-06-30',
              '2021-07-01',
              '2021-07-02',
              '2021-07-03',
              '2021-07-04',
              '2021-07-05',
              '2021-07-06',
              '2021-07-07',
              '2021-07-08',
              '2021-07-09',
              '2021-07-10',
              '2021-07-11',
              '2021-07-12',
              '2021-07-13'
            ],
            boundaryGap: false,
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              show: true,
              interval: 6,
              textStyle: {
                color: 'rgba(255, 255, 255, .8)'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed'
              }
            },
            axisLabel: {
              textStyle: {
                color: 'rgba(255, 255, 255, .8)'
              }
            }
          }
        ],
        series: [
          {
            name: '国内相关',
            type: 'line',
            barWidth: '90%',
            data: [
              27,
              40,
              82,
              120,
              113,
              148,
              99,
              118,
              117,
              115,
              83,
              89,
              94,
              69,
              90,
              97,
              117,
              114,
              87,
              95,
              72,
              68,
              88,
              78,
              100,
              87,
              71,
              60,
              69,
              52,
              85,
              89,
              69,
              64,
              61,
              70,
              43,
              72,
              60,
              67,
              60,
              52,
              55,
              51,
              38,
              50,
              55,
              70,
              64,
              55
            ],
            lineStyle: {
              normal: {
                color: '#3333CC' // f改变区域颜色
              }
            },
            smooth: true, // true 为平滑曲线，false为直线
            areaStyle: {
              type: 'default',
              // 渐变色实现
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1, // 变化度
                // 三种由深及浅的颜色
                [
                  {
                    offset: 0,
                    color: '#333399'
                  },
                  {
                    offset: 0.5,
                    color: '#339999'
                  },
                  {
                    offset: 1,
                    color: '#33FF99'
                  }
                ]
              )
            }
          },
          {
            name: '娱乐话题',
            type: 'line',
            barWidth: '90%',
            data: [
              75,
              83,
              55,
              48,
              68,
              37,
              45,
              42,
              35,
              28,
              30,
              56,
              34,
              63,
              48,
              39,
              57,
              54,
              50,
              70,
              90,
              69,
              86,
              84,
              89,
              87,
              110,
              103,
              112,
              93,
              118,
              87,
              99,
              91,
              112,
              119,
              111,
              108,
              128,
              110,
              118,
              105,
              111,
              113,
              117,
              150
            ],
            lineStyle: {
              normal: {
                color: '#880000' // f改变区域颜色
              }
            },
            smooth: true, // true 为平滑曲线，false为直线
            areaStyle: {
              type: 'default',
              // 渐变色实现
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1, // 变化度
                // 三种由深及浅的颜色
                [
                  {
                    offset: 0,
                    color: '#580000'
                  },
                  {
                    offset: 0.5,
                    color: '#680000'
                  },
                  {
                    offset: 1,
                    color: '#780000'
                  }
                ]
              )
            }
          },
          {
            name: '国外相关',
            type: 'line',
            barWidth: '90%',
            data: [
              3,
              2,
              1,
              10,
              6,
              8,
              11,
              14,
              16,
              13,
              15,
              15,
              10,
              2,
              4,
              5,
              4,
              2,
              1,
              0,
              3,
              6,
              4,
              7,
              3,
              6,
              2,
              5,
              1,
              15,
              17,
              20,
              10,
              25,
              26,
              29,
              30,
              45,
              32,
              30,
              40,
              33,
              30,
              50,
              33,
              40,
              32,
              31
            ],
            lineStyle: {
              normal: {
                color: '#A0A0A0' // f改变区域颜色
              }
            },
            smooth: true, // true 为平滑曲线，false为直线
            areaStyle: {
              type: 'default',
              // 渐变色实现
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1, // 变化度
                // 三种由深及浅的颜色
                [
                  {
                    offset: 0,
                    color: '#B8B8B8'
                  },
                  {
                    offset: 0.5,
                    color: '#C0C0C0'
                  },
                  {
                    offset: 1,
                    color: '#C8C8C8'
                  }
                ]
              )
            }
          }
        ]
      }
      window.addEventListener('resize', function() {
        that.chart = echarts.init(document.getElementById('hotsearchDistribution'))
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
.hotsearchDistribution {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 11;
}
</style>
