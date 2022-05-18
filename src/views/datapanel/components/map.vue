<template>
  <div id="maps">
    <div id="map" style="position: absolute;height: 100%;width: 100%;z-index: 1;" />
    <div id="jiu" class="mapjiu biankuang">
      <mapjiu />
    </div>
    <!-- 下部导航 -->
    <div class="hierarchy">
      <ul>
        <li @click="get('中国')">中国</li>
        <li v-if="sheng !== ''" @click="get(sheng)">{{ sheng }}</li>
        <li v-if="shi !== ''" @click="get(shi)">{{ shi }}</li>
        <li v-if="xian !== ''" @click="get(xian)">{{ xian }}</li>
      </ul>
    </div>
  </div>
</template>
<script>
import * as echarts from 'echarts'
import eventBus from './public/js/EvebtBus'
import Mapjiu from './mapjiu'

export default {
  name: 'Map',
  components: {
    Mapjiu
  },
  data() {
    return {
      data: {
        name: '中国', // 地名
        type: '流行疾病', // 疾病名称
        dataType: '发病数', // 查询类型 发病数、死亡数、发病率、死亡率
        where: 0, // 范围层级
        time: '', // 时间
        timec: 0, // 分年和分月 ALL为全部 0 4 7 substring(convert(varchar(30), time, 120), 1, *) x为传回数据库的*
        max: 0, // 最大值
        min: 0, // 最小值
        zoom: 0 // 层级-判断是否有九段线
      },
      // 省名 + 市名列表
      mingz: [],
      mings: [],
      // 下部导航
      sheng: '',
      shi: '',
      xian: '',
      myChart: null
    }
  },
  beforeDestroy() {
    eventBus.$off('name')
    eventBus.$off('dataType')
    eventBus.$off('maptype')
    eventBus.$off('maptypc')
    eventBus.$off('maptypx')
    eventBus.$off('times')
    eventBus.$off('returnAll')
    this.CAdestroy()
  },
  mounted() {
    // 加载调用
    var that = this
    // 加载地图
    setTimeout(function() {
      that.getJson()
      that.getPName()
    }, 1000)
    // 获取九段线传回的名称-海南
    eventBus.$on('name', (name) => {
      that.CAdestroy()
      that.get(name)
    })
    // 获取数据展示面板传回的-查询类型
    eventBus.$on('dataType', (dataType) => {
      that.data.dataType = dataType
      that.CAdestroy()
      // 查询事件
      setTimeout(function() {
        that.getJson()
      }, 200)
    })
    // 加载时-给查询类型页面传疾病名称
    that.exhibition()
    // 给疾病页面传个名称
    setTimeout(function() {
      that.listDiseases()
    }, 100)
    // 获取疾病名称
    eventBus.$on('maptype', (maptype) => {
      that.data.type = maptype
      that.CAdestroy()
      // 查询事件
      setTimeout(function() {
        that.getJson()
      }, 200)
    })
    eventBus.$on('maptypc', (maptypc) => {
      that.data.type = maptypc
      that.CAdestroy()
      // 查询事件
      setTimeout(function() {
        that.getJson()
      }, 200)
    })
    eventBus.$on('maptypx', (maptypx) => {
      that.data.type = maptypx
      that.CAdestroy()
      // 查询事件
      setTimeout(function() {
        that.getJson()
      }, 200)
    })
    // 获取查询时间
    eventBus.$on('times', (times) => {
      that.data.time = times.time
      that.data.timec = times.x
      that.CAdestroy()
      // 查询事件
      setTimeout(function() {
        that.getJson()
      }, 200)
    })
    // 返回全部
    eventBus.$on('returnAll', (returnAll) => {
      that.data.type = returnAll
      that.data.time = ''
      that.data.timec = 0
      // 加载时-给查询类型页面传疾病名称
      this.myChart.clear()
      this.myChart.dispose()
      // 给疾病页面传个名称
      that.listDiseases()
      // 查询事件
      that.getJson()
    })
  },
  methods: {
    // echarts地图
    initCharts(json, data) {
      var that = this
      this.myChart = echarts.init(document.getElementById('map'))
      const option = {
        // 标题
        title: {
          text: that.data.time  + that.data.name + '-' + that.data.type + '-' + that.data.dataType,
          left: 'center',
          padding: 10,
          textStyle: {
            color: 'rgb(210, 210, 210)',
            fontFamily: 'KuHei',
            fontWeight: 'bolder',
            fontSize: '14px'
          }
        },
        // 悬浮
        tooltip: {
          trigger: 'item',
          show: true,
          showDelay: 0,
          transitionDuration: 0.2,
          formatter: function(params) {
            var value = (params.value + '').split('.')
            value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,')
            return that.data.name + '<br/>' + params.name + '：' + value
          }
        },
        // 数据地图
        visualMap: {
          min: this.data.min,
          max: this.data.max,
          text: ['高', '低'],
          realtime: true,
          calculable: true,
          hoverLink: true,
          // orient: 'horizontal',
          precision: that.data.min.toString().split('.').length > 1 ? that.data.min.toString().split('.')[1].length : 0,
          left: 'left',
          top: 'middle',
          textStyle: {
            color: '#fff',
            fontWeight: 'bold'
          },
          inRange: {
            color: [ 'rgba(235, 235, 235,0.8)','#0cb5f0', '#ff7979']
          }
        },
        select: {
          itemStyle: {
            areaColor: '#ff7979',
            borderWidth: 2
          }
        },
        geo: {
          show: true,
          map: this.name,
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false
            }
          },
          roam: false,
          itemStyle: {
            normal: {
              areaColor: '#01215c',
              borderWidth: 5, // 设置外层边框
              borderColor: '#9ffcff',
              shadowColor: 'rgba(5, 175, 231, 1)',
              shadowBlur: 150
            }
          }
        },
        series: [
          {
            name: this.name,
            map: this.name,
            type: 'map',
            roam: false,
            selectedMode: 'single',
            data: data,
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
                  }
                }
              }
            }
          }
        ]
      }
      window.addEventListener('resize', function() {
        var chart = echarts.init(document.getElementById('map'))
        if (chart) {
          chart.resize() // 不报错
        }
      })
      // 加载数据
      echarts.registerMap(this.name, json, {
        // '九段线': {
        //   left: 120,
        //   top: 15,
        //   width: 15
        // }
      }) // 重要代码
      this.myChart.clear()
      this.myChart.setOption(option, true)
      // 点击事件
      this.myChart.on('click', function(params) {
        if (that.mings.indexOf(params.name) !== -1) {
          if (that.mingz.indexOf(params.name) !== -1) {
            that.data.where = 1
            that.sheng = params.name
          } else {
            that.data.where = 2
            that.shi = params.name
          }
          that.data.zoom = 1
          document.getElementById('jiu').classList.remove('biankuang')
          eventBus.$emit('zoom', 1)
          that.data.name = params.name
          that.CAdestroy() // 清空地图
          that.exhibition()
          setTimeout(function() {
            that.getJson()
          }, 200)
        } else {
          that.xian = params.name
          that.$message({
            showClose: true,
            message: '没有更多了！',
            type: 'warning'
          })
        }
      })
    },
    // 重置
    get(data) {
      var that = this
      if (that.mings.indexOf(data) !== -1) {
        that.data.name = data
        if (data === '中国') {
          that.data.zoom = 0
          document.getElementById('jiu').classList.add('biankuang')
          that.data.where = 0
          document.getElementsByClassName('mapjiu')[0].style.border = 'none'
          eventBus.$emit('zoom', 0)
          that.getPName()
          that.sheng = ''
          that.shi = ''
          that.xian = ''
        } else {
          if (that.mingz.indexOf(data) !== -1) {
            that.data.where = 1
            that.shi = ''
            that.xian = ''
          } else {
            that.data.where = 2
            that.xian = ''
          }
          that.data.zoom = 1
          document.getElementById('jiu').classList.remove('biankuang')
          eventBus.$emit('zoom', 1)
          that.getPName()
        }
        that.CAdestroy()
        that.exhibition()
        setTimeout(function() {
          that.getJson()
        }, 200)
      } else {
        that.$message({
          showClose: true,
          message: '没有更多了！',
          type: 'warning'
        })
      }
    },
    // 查询json数据
    getJson() {
      var that = this
      that.$store.dispatch('ndatapanel/QJson', that.data.name).then((datas) => {
        that.$store.dispatch('ndatapanel/QMapJson', that.data).then((dataz) => {
          that.data.max = 0
          that.data.min = 0
          const data = dataz.sort(function(a, b) {
            return b.value - a.value
          })
          that.data.max = data[0].value.toFixed(2) * 1
          that.data.min = data[dataz.length - 1].value.toFixed(2) * 1
          // 地图json数据 病情数据
          that.initCharts(datas.json, data)
        }).catch(() => {
        })
      }).catch(() => {
      })
    },
    // 查询名称+九段线
    getPName() {
      var that = this
      that.$store.dispatch('ndatapanel/QPName').then((dataz) => {
        // 省名 + 全部名称列表
        that.mingz = dataz[1].jsons
        that.mings = dataz[2].jsons
        if (that.data.zoom * 1 === 0) {
          eventBus.$emit('json', dataz[0])
        }
      }).catch(() => {
      })
    },
    // 给查询类型页面传疾病名称
    exhibition() {
      var that = this
      const type = {
        name: that.data.name,
        type: that.data.type,
        where: that.data.where
      }
      eventBus.$emit('type', type)
    },
    // 给疾病面板传一个名称
    listDiseases() {
      eventBus.$emit('listtype', this.data.type)
    },
    // 创建与销毁盒子
    CAdestroy() {
      if (this.myChart !== null) {
        this.myChart.clear()
        this.myChart.dispose()
      }
      // document.getElementById('map').remove()
      // const div = document.createElement('div')
      // div.id = 'map'
      // div.style.position = 'absolute'
      // div.style.height = '100%'
      // div.style.width = '100%'
      // div.style.zIndex = '1'
      // const maps = document.getElementById('maps')
      // maps.append(div)
    }
  }
}
</script>
<style scoped>
@font-face {
  src: url("./public/font/KuHei.ttf");
  font-family: "KuHei";
}
#maps .mapjiu {
  position: absolute;
  z-index: 10;
  width: 20%;
  height: 30%;
  overflow: hidden;
  right: 0;
  bottom: 0;
  margin: 0 -1px -1px 0;
}
#maps .biankuang {
  border-top: 2px solid rgba(3, 164, 179, 0.2) !important;
  border-left: 2px solid rgba(3, 164, 179, 0.2) !important;
}
#maps .hierarchy {
  position: absolute;
  bottom: 10px;
  left: 20px;
  z-index: 10;
}
#maps .hierarchy li {
  display: inline-block;
  vertical-align: top;
  position: relative;
  text-align: center;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0.548);
  border-right: none;
  border-left: none;
  color: #fff;
  background-color: rgba(40, 43, 57, 0.5);
  height: 30px;
  line-height: 28px;
  width: auto;
  padding: 0 5px 0 25px;
  font-weight: bold;
  font-family: "KuHei";
  letter-spacing: 4px;
  cursor: pointer;
  font-size: 15px;
}
#maps .hierarchy li:nth-child(1) {
  border-left: 1px solid rgba(255, 255, 255, 0.548);
  padding: 0 5px 0 15px;
}
#maps .hierarchy li::after {
  content: '';
  position: absolute;
  width: 22px;
  height: 22px;
  border: 2px solid rgba(255, 255, 255, 0.548);
  border-bottom: none;
  border-left: none;
  border-radius: 3px;
  right: -12px;
  top: 3px;
  transform: rotate(45deg);
  z-index: -1;
}
</style>
