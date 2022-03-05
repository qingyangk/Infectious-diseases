<template>
  <div id="jmaps">
    <div id="jmap" style="position: absolute;height: 100%;width: 100%;z-index: 1;" />
  </div>
</template>
<script>
import * as echarts from 'echarts'
import eventBus from './public/js/EvebtBus'

export default {
  name: 'Mapjiu',
  data() {
    return {
      myChart: null
    }
  },
  beforeDestroy() {
    eventBus.$off('zoom')
    eventBus.$off('json')
    this.CAdestroy()
  },
  mounted() {
    var that = this
    eventBus.$on('zoom', (zoom) => {
      if (zoom === 0) {
        const div = document.createElement('div')
        div.id = 'jmap'
        div.style.position = 'absolute'
        div.style.height = '100%'
        div.style.width = '100%'
        div.style.zIndex = '1'
        const maps = document.getElementById('jmaps')
        maps.append(div)
      } else {
        if (document.getElementById('jmap') !== null) {
          document.getElementById('jmap').remove()
        }
      }
    })
    eventBus.$on('json', (json) => {
      if (this.myChart !== null) {
        this.myChart.clear()
        this.myChart.dispose()
      }
      that.initCharts(json)
    })
  },
  methods: {
    // echarts地图
    initCharts(json) {
      this.myChart = echarts.init(document.getElementById('jmap'))
      const option = {
        layoutCenter: ['50%', '50%'],
        series: [
          {
            name: json.name,
            map: json.name,
            type: 'map',
            roam: false,
            selectedMode: 'single',
            // data: data,
            // 文本位置修正
            textFixed: {
              Alaska: [20, -20]
            },
            label: {
              normal: {
                textStyle: {
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#fff'
                }
              }
            },
            itemStyle: {
              areaColor: 'rgba(255, 255, 255, 0.5)',
              borderColor: 'rgba(255, 255, 255, 0.5)',
              borderWidth: 1, // 设置外层边框
              shadowBlur: 5,
              shadowOffsetY: 2,
              shadowOffsetX: -2,
              shadowColor: '#01012a',
              emphasis: { // 也是选中样式
                areaColor: '#ff7979',
                shadowColor: 'rgba(0,0,0,0.2)',
                shadowOffsetX: 0, // 阴影水平方向上的偏移距离
                shadowOffsetY: 4, // 阴影垂直方向上的偏移距离
                shadowBlur: 8, // 图形阴影的模糊大小
                label: {
                  textStyle: {
                    color: '#fff'
                  },
                  formatter: function(params) {
                    var value = (params.value + '').split('.')
                    value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,')
                    return params.name + '：' + value
                  }
                }
              }
            }
          }
        ]
      }
      window.addEventListener('resize', function() {
        var chart = echarts.init(document.getElementById('jmap'))
        if (chart) {
          chart.resize() // 不报错
        }
      })
      // 加载数据
      echarts.registerMap(json.name, json.jsons, {
        // '九段线': {
        //   left: 120,
        //   top: 15,
        //   width: 15
        // }
      }) // 重要代码
      this.myChart.setOption(option)
      // 点击事件
      this.myChart.on('click', function(params) {
        // eventBus.$emit('name', params.name)
      })
    },
    // 创建与销毁盒子
    CAdestroy() {
      if (this.myChart !== null) {
        this.myChart.clear()
        this.myChart.dispose()
      }
      // document.getElementById('jmap').remove()
      // const div = document.createElement('div')
      // div.id = 'jmap'
      // div.style.position = 'absolute'
      // div.style.height = '100%'
      // div.style.width = '100%'
      // div.style.zIndex = '2'
      // const maps = document.getElementById('jmaps')
      // maps.append(div)
    }
  }
}
</script>
