<template>
  <div id="dmaps">
    <div id="dmap" style="position: absolute;height: 100%;width: 100%;z-index: 1;" />
    <div id="jiu" class="mapjiu biankuang">
      <dmapjiu />
    </div>
    <!-- 下部导航 -->
    <div class="hierarchy">
      <ul>
        <li @click="get('中国')">中国</li>
        <li v-if="sheng !== ''" @click="get(sheng)">{{ sheng }}</li>
        <li v-if="shi !== ''" @click="get(shi)">{{ shi }}</li>
        <li v-if="xian !== ''" @click="get(xian)">{{ xian }}</li>
        <li v-if="jie !== ''" @click="get(jie)">{{ jie }}</li>
      </ul>
    </div>
  </div>
</template>
<script>
import * as echarts from 'echarts'
import eventBuz from '../public/js/EvebtBus'
import Dmapjiu from './dmapjiu'

export default {
  name: 'Dmap',
  components: {
    Dmapjiu
  },
  data() {
    return {
      data: {
        name: '', // 地区名称
        type: '', // 疾病类型
        table: '', // 数据库名称
        where: 0, // 范围层级
        max: 0, // 最大值
        min: 0, // 最小值
        zoom: 0, // 层级-判断是否有九段线
        dataType: '诊断', // 查询类型 诊断、重症、死亡
        time: '', // 时间
        timec: 0 // 分年和分月 ALL为全部 0 4 7 substring(convert(varchar(30), time, 120), 1, *) x为传回数据库的*
      },
      // 省名 + 市名 + 县名 + 街道名
      mingz: [],
      mings: [],
      mingx: [],
      mingj: [],
      // 下部导航
      sheng: '',
      shi: '',
      xian: '',
      jie: '',
      myChart: null
    }
  },
  beforeDestroy() {
    eventBuz.$off('dataType')
    eventBuz.$off('times')
  },
  mounted() {
    var that = this
    // 接收诊断类型
    eventBuz.$on('dataType', (dataType) => {
      this.data.dataType = dataType
      that.CAdestroy()
      // 调取数据
      that.getJson()
      that.getPName()
    })
    // 接收时间
    eventBuz.$on('times', times => {
      this.data.time = times.time
      this.data.timec = times.x
      that.CAdestroy()
      // 调取数据
      that.getJson()
      that.getPName()
    })
    // 获取跳转过来的值
    if (that.$route.query.type !== undefined) {
      that.data.name = that.$route.query.name
      that.data.type = that.$route.query.type
      that.data.table = that.$route.query.table
      that.data.where = that.$route.query.where
      // 判断层级-同步左下角
      if (that.data.where * 1 !== 0) {
        that.data.zoom = 1
        document.getElementById('jiu').classList.remove('biankuang')
        eventBuz.$emit('dzoom', 1)
        if (that.data.where * 1 === 1) {
          that.sheng = that.data.name
        } else if (that.data.where * 1 === 2) {
          that.shi = that.data.name
          that.$store.dispatch('ndatapanel/QName', that.data.name).then((dataz) => {
            this.sheng = dataz[0].省
          })
        }
      }
      // 调取数据
      that.getJson()
      that.getPName()
      // 给子页面传值
      setTimeout(function() {
        that.ByVal()
      }, 100)
    }
  },
  methods: {
    // echarts地图
    initCharts(json, data) {
      var that = this
      this.myChart = echarts.init(document.getElementById('dmap'))
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
        that.chart = echarts.init(document.getElementById('dmap'))
        that.chart.resize()
      })
      // 加载数据
      echarts.registerMap(this.name, json) // 重要代码
      this.myChart.setOption(option)
      // 点击事件
      this.myChart.on('click', function(params) {
        if (that.mingx.indexOf(params.name) !== -1) {
        // 省
          if (that.mingz.indexOf(params.name) !== -1) {
            that.data.where = 1
            that.sheng = params.name
          } else if (that.mings.indexOf(params.name) !== -1) {
            that.data.where = 2
            that.shi = params.name
          } else {
            that.data.where = 3
            that.xian = params.name
          }
          that.data.zoom = 1
          document.getElementById('jiu').classList.remove('biankuang')
          eventBuz.$emit('dzoom', 1)
          that.data.name = params.name
          that.CAdestroy()
          that.getJson()
          that.ByVal()
        } else {
          that.jie = params.name
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
      if (that.mingx.indexOf(data) !== -1) {
        that.data.name = data
        if (data === '中国') {
          that.data.zoom = 0
          document.getElementById('jiu').classList.add('biankuang')
          that.data.where = 0
          document.getElementsByClassName('mapjiu')[0].style.border = 'none'
          eventBuz.$emit('dzoom', 0)
          that.getPName()
          that.sheng = ''
          that.shi = ''
          that.xian = ''
          that.jie = ''
        } else {
          if (that.mingz.indexOf(data) !== -1) {
            that.data.where = 1
            that.shi = ''
            that.xian = ''
            that.jie = ''
          } else if (that.mings.indexOf(data) !== -1) {
            that.data.where = 2
            that.xian = ''
            that.jie = ''
          } else {
            that.data.where = 3
            that.jie = ''
          }
          that.data.zoom = 1
          document.getElementById('jiu').classList.remove('biankuang')
          eventBuz.$emit('dzoom', 1)
          that.getPName()
        }
        that.CAdestroy()
        that.getJson()
        that.ByVal()
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
      // 查询范围数据
      that.$store.dispatch('ndatapanel/QJson', that.data.name).then((dataz) => {
        that.$store.dispatch('ndatapanel/QGDJson', that.data).then((datas) => {
          datas.sort(function(a, b) {
            return b.value - a.value
          })
          that.data.max = datas[0].value
          that.data.min = datas[datas.length - 1].value
          that.initCharts(dataz.json, datas)
        })
      }).catch(() => {
      })
    },
    // 查询名称+九段线
    getPName() {
      var that = this
      that.$store.dispatch('ndatapanel/QPName').then((dataz) => {
        // 省名 + 市名 + 县名 + 街道名
        that.mingz = dataz[1].jsons
        that.mings = dataz[2].jsons
        that.mingx = dataz[3].jsons
        that.mingj = dataz[4].jsons
        if (that.data.zoom * 1 === 0) {
          eventBuz.$emit('jjson', dataz[0])
        }
      }).catch(() => {
      })
    },
    // 创建与销毁盒子
    CAdestroy() {
      if (this.myChart !== null) {
        this.myChart.clear()
        this.myChart.dispose()
      }
      // document.getElementById('dmap').remove()
      // const div = document.createElement('div')
      // div.id = 'dmap'
      // div.style.position = 'absolute'
      // div.style.height = '100%'
      // div.style.width = '100%'
      // div.style.zIndex = '1'
      // const dmaps = document.getElementById('dmaps')
      // dmaps.append(div)
    },
    // 给子页面传值
    ByVal() {
      const data = { name: this.data.name, type: this.data.type, table: this.data.table, where: this.data.where } // 地区名称+数据库名称+范围层级
      eventBuz.$emit('data', data)
    }
  }
}
</script>
<style scoped>
@font-face {
  src: url("../public/font/KuHei.ttf");
  font-family: "KuHei";
}
#dmaps .mapjiu {
  position: absolute;
  z-index: 10;
  width: 20%;
  height: 30%;
  overflow: hidden;
  right: 0;
  bottom: 0;
  margin: 0 -1px -1px 0;
}
#dmaps .biankuang {
  border-top: 2px solid rgba(3, 164, 179, 0.2) !important;
  border-left: 2px solid rgba(3, 164, 179, 0.2) !important;
}
#dmaps .hierarchy {
  position: absolute;
  bottom: 10px;
  left: 10px;
  z-index: 10;
}
#dmaps .hierarchy li {
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
#dmaps .hierarchy li:nth-child(1) {
  border-left: 1px solid rgba(255, 255, 255, 0.548);
  padding: 0 5px 0 15px;
}
#dmaps .hierarchy li::after {
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
