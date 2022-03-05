<template>
  <div class="hotwords">
    <div id="hotwords" style="height: 100%;width: 100%;z-index: 99;" />
  </div>
</template>
<script>
import * as echarts from 'echarts'
export default {
  name: 'Hotwords',
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
      const myChart = echarts.init(document.getElementById('hotwords'))
      const option = {
        title: {
          text: '总评率随热词分布中,最高为肺炎,最低为症状',
          textStyle: {
            color: 'rgba(255, 255, 255, .8)',
            fontSize: 18,
            fontFamily: 'KuHei'
          },
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}%'
        },
        calculable: false,
        series: [
          {
            name: '矩形图',
            type: 'treemap',
            breadcrumb: false, // 矩形图下的提示显示与否
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: '{b}:{c}%',
                  fontSize: 10
                },
                borderWidth: 0
              },
              emphasis: {
                label: {
                  show: true
                }
              }
            },
            data: [
              {
                name: '肺炎',
                value: 9.06
              },
              {
                name: '疫情',
                value: 7.74
              },
              {
                name: '微博',
                value: 7.25
              },
              {
                name: '病例',
                value: 6.95
              },
              {
                name: '新冠',
                value: 6.88
              },
              {
                name: '确诊',
                value: 6.59
              },
              {
                name: '武汉',
                value: 5.2
              },
              {
                name: '视频',
                value: 4.86
              },
              {
                name: '冠状病毒',
                value: 4.34
              },
              {
                name: '口罩',
                value: 4.28
              },
              {
                name: '新型',
                value: 3.49
              },
              {
                name: '患者',
                value: 3.05
              },
              {
                name: '防控',
                value: 2.92
              },
              {
                name: '感染',
                value: 2.81
              },
              {
                name: '医院',
                value: 2.73
              },
              {
                name: '新增',
                value: 2.43
              },
              {
                name: '隔离',
                value: 2.19
              },
              {
                name: '出院',
                value: 2.17
              },
              {
                name: '湖北',
                value: 2.1
              },
              {
                name: '病毒',
                value: 1.79
              },
              {
                name: '累计',
                value: 1.79
              },
              {
                name: '加油',
                value: 1.6
              },
              {
                name: '哈哈哈',
                value: 1.53
              },
              {
                name: '韩国',
                value: 1.39
              },
              {
                name: '医护人员',
                value: 1.35
              },
              {
                name: '治愈',
                value: 1.3
              },
              {
                name: '人员',
                value: 1.28
              },
              {
                name: '死亡',
                value: 1.23
              },
              {
                name: '投票',
                value: 1.2
              },
              {
                name: '武汉市',
                value: 1.19
              },
              {
                name: '工作',
                value: 1.18
              },
              {
                name: '科比',
                value: 1.39
              },
              {
                name: '复工',
                value: 1.17
              },
              {
                name: '密切接触者',
                value: 1.16
              },
              {
                name: '抗疫',
                value: 1.15
              },
              {
                name: '疑似病例',
                value: 1.14
              },
              {
                name: '中国',
                value: 1.23
              },
              {
                name: '防疫',
                value: 1.13
              },
              {
                name: '治疗',
                value: 1.12
              },
              {
                name: '检测',
                value: 1.1
              },
              {
                name: '目前',
                value: 1.09
              },
              {
                name: '物资',
                value: 1.08
              },
              {
                name: '医学观察',
                value: 1.07
              },
              {
                name: '例新冠状',
                value: 1.06
              },
              {
                name: '发热',
                value: 1.05
              },
              {
                name: '时间',
                value: 1.04
              },
              {
                name: '大家',
                value: 1.03
              },
              {
                name: '一线工作者',
                value: 1.02
              },
              {
                name: '央视',
                value: 1.01
              },
              {
                name: '医疗',
                value: 1.0
              },
              {
                name: '在家',
                value: 0.98
              },
              {
                name: '开学',
                value: 0.96
              },
              {
                name: '放舱',
                value: 0.95
              },
              {
                name: '救治',
                value: 0.94
              },
              {
                name: '战役',
                value: 0.92
              },
              {
                name: '核酸检测',
                value: 0.91
              },
              {
                name: '卫健委',
                value: 0.88
              },
              {
                name: '火神山',
                value: 0.87
              },
              {
                name: '美国',
                value: 0.86
              },
              {
                name: '消毒',
                value: 0.85
              },
              {
                name: '乘客',
                value: 0.84
              },
              {
                name: '留学生',
                value: 0.83
              },
              {
                name: '英雄回归',
                value: 0.82
              },
              {
                name: '境外输入',
                value: 0.8
              },
              {
                name: '塞尔维亚',
                value: 0.79
              },
              {
                name: '马云',
                value: 0.78
              },
              {
                name: '大学生返校',
                value: 0.76
              },
              {
                name: '高三',
                value: 0.75
              },
              {
                name: '高考',
                value: 0.74
              },
              {
                name: '高考延期',
                value: 0.73
              },
              {
                name: '高三开学',
                value: 0.72
              },
              {
                name: '初三',
                value: 0.71
              },
              {
                name: '小学',
                value: 0.68
              },
              {
                name: '李兰娟',
                value: 0.65
              },
              {
                name: '钟南山',
                value: 0.64
              },
              {
                name: '拐点',
                value: 0.63
              },
              {
                name: '疫情',
                value: 0.62
              },
              {
                name: '地图',
                value: 0.61
              },
              {
                name: '舆情',
                value: 0.6
              },
              {
                name: '脱贫',
                value: 0.59
              },
              {
                name: '江苏',
                value: 0.58
              },
              {
                name: '安徽',
                value: 0.57
              },
              {
                name: '电影',
                value: 0.56
              },
              {
                name: '隔离',
                value: 0.55
              },
              {
                name: '意大利',
                value: 0.54
              },
              {
                name: '塞尔维亚',
                value: 0.53
              },
              {
                name: '英国',
                value: 0.52
              },
              {
                name: '退税',
                value: 0.51
              },
              {
                name: '大学生开学',
                value: 0.5
              },
              {
                name: '英国首相',
                value: 0.49
              },
              {
                name: '日本',
                value: 0.48
              },
              {
                name: '韩国',
                value: 0.47
              },
              {
                name: '西藏',
                value: 0.46
              },
              {
                name: '南京开学',
                value: 0.45
              },
              {
                name: '宿管阿姨',
                value: 0.44
              }
            ],
            width: '95%',
            bottom: '5%',
            top: '10%'
          }
        ]
      }
      window.addEventListener('resize', function() {
        that.chart = echarts.init(document.getElementById('hotwords'))
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
.hotwords {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 11;
}
</style>
