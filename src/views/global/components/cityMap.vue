<template>
  <div id="citymap">
    <!-- 数据展示 -->
    <div class="datas">
      <ul>
        <li v-for="(value, index) in lis" :key="index" :class="value.clas">
          <!-- 头部 -->
          <p>
            <span class="name">{{ value.name }}</span>
            <span style="margin: 0 5px"><i :class="value.state == 'up' ? 'el-icon-caret-top': 'el-icon-caret-bottom'" /></span>
            <span class="compare">{{ value.compare }}</span>
          </p>
          <p :class="value.claz">{{ value.heal }}</p>
        </li>
      </ul>
    </div>
    <!-- 地图 -->
    <div id="allmap" style="width:100%;height:100%;position: absolute;" />
    <el-tooltip class="item" effect="dark" content="重置地图" placement="left">
      <i class="el-icon-refresh-right" @click="s()" />
    </el-tooltip>
  </div>
</template>
<script>
import eventBus from '../public/js/EvebtBus'
export default {
  name: 'CityMap',
  data() {
    return {
      data: {
        name: 'US',
        today: '',
        yesterday: ''
      },
      center: [],
      zoom: 1,
      lis: [],
      gong: {}
    }
  },
  mounted() {
    this.getZhezhao()
    this.getData()
  },
  methods: {
    pushMsg(name) {
      // 通过事件总线发送消息
      eventBus.$emit('pushMsg', name)
    },
    initMap(zhezhao, fanwei) {
      var that = this
      var inMaps = window.inMap
      // 将inmap引入地图
      var inmap = new inMaps.Map({
        id: 'allmap',
        skin: 'WhiteLover',
        center: that.center,
        zoom: {
          value: that.zoom,
          show: false
        }
      })
      // 设置地图样式
      // inmap.getMap().enableAutoResize()
      // inmap.getMap().disableDragging() // 禁止移动
      inmap.getMap().disableScrollWheelZoom() // 禁止缩放
      inmap.getMap().setMapStyle({
        style: 'dark'
      })
      // 创建遮盖区周边样式
      var data = zhezhao
      var MaskOverlay = new inMaps.MaskOverlay({
        style: {
          backgroundColor: 'rgb(19,19,19)',
          borderColor: 'rgba(200,200,55,0.7)',
          shadowColor: 'rgba(250, 250, 55, 1)',
          shadowBlur: 30,
          borderWidth: 15
        }
      })
      // 内部县区
      var data2 = fanwei
      // 行政围栏
      var PolygonOverlay1 = new inMaps.PolygonOverlay({
        tooltip: {
          show: true,
          // formatter: "{name}+'~'+{count}",
          formatter: function(params) {
            return (
              '<div>' +
                ' <div>' +
                ' <span>地区 : </span><span>' +
                params.name +
                '</span>' +
                ' </div>' +
                ' <div>' +
                ' <span>数量 : </span><span>' +
                params.count +
                '</span>' +
                ' </div></div>'
            )
          }
        },
        legend: {
          show: true,
          title: '确诊患者数'
        },
        style: {
          normal: {
            borderWidth: 0.3,
            borderColor: 'rgba(200,200,55,0.7)',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            label: {
              color: 'rgba(255,255,255,0)'
            }
          },
          mouseOver: {
            borderWidth: 0.1,
            backgroundColor: 'rgba(251,132,7,0.15)',
            label: {
              overflow: 'scroll',
              font: '15px bold',
              color: 'rgba(255,255,255,1)'
            }
          },
          colors: [
            'rgba(0,133,235,0.40)',
            'rgba(0,184,255,0.40)',
            'rgba(72,246,217,0.40)',
            'rgba(252,196,95,0.40)',
            'rgba(255,132,84,0.40)',
            'rgba(219,66,90,0.40)'
          ]
        },
        // 获取州图层信息
        event: {
          onMouseClick: function(item, event) {
            that.data.name = item[0].name
            that.getZhezhao()
            that.getData()
          }
        }
      })
      // 行政围栏
      var PolygonOverlay2 = new inMaps.PolygonOverlay({
        style: {
          normal: {
            borderWidth: 0.3,
            borderColor: 'rgba(200,200,55,0.7)',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            label: {
              color: 'rgba(255,255,255,0)'
            }
          },
          mouseOver: {
            borderWidth: 0.1,
            backgroundColor: 'rgba(251,132,7,0.15)',
            label: {
              overflow: 'scroll',
              font: '15px bold',
              color: 'rgba(255,255,255,1)'
            }
          }
        },
        // 获取图层信息
        event: {
          onMouseClick: function(item, event) {
            that.name = item[0].name
            that.getZhezhao()
          }
        }
      })
      // 将遮盖添加至地图
      MaskOverlay.setData(data)
      inmap.add(MaskOverlay)
      if (that.data.name === 'US') {
        PolygonOverlay1.setData(data2)
        inmap.add(PolygonOverlay1)
      } else {
        PolygonOverlay2.setData(data2)
        inmap.add(PolygonOverlay2)
      }
    },
    getZhezhao() {
      var that = this
      // 请求遮罩数据
      that.pushMsg(this.data.name)
      that.$store.dispatch('city/qMask', this.data.name).then((dataZ) => {
        // 设置中心点 与 缩放比例
        that.zoom = parseInt(dataZ[0].zoom)
        that.center = JSON.parse(dataZ[0].center)
        // 设置范围
        var zhezhao = JSON.parse(dataZ[0].json)
        // 请求范围数据
        that.$store.dispatch('city/qRange', this.data.name).then((dataX) => {
          // 设置范围
          var fanwei = JSON.parse(dataX[0].json)
          if (that.data.name === 'US') {
          // 如果是US的话 加载确诊数据
            that.$store.dispatch('city/qZDeath', this.data.name).then((dataC) => {
              var name = dataC.name
              var cases = dataC.cases
              for (var i = 0; i < fanwei.length; i++) {
                fanwei[i].count = cases[name.indexOf(fanwei[i].name)]
              }
              that.initMap(zhezhao, fanwei)
            })
          } else {
            // 不是的话直接加载地图
            that.initMap(zhezhao, fanwei)
          }
        })
      })
    },
    getData() {
      var that = this
      var setup = new Date()
      var today = new Date()
      var yesterday = new Date()
      yesterday.setTime(yesterday.getTime() - 24 * 60 * 60 * 1000)
      setup.setHours('12')
      setup.setMinutes('30')
      // 判断是否在12.30之前(数据库数据更新在12点)
      if (today.getTime() - setup.getTime() < 0) {
        today.setTime(today.getTime() - 24 * 60 * 60 * 1000)
        that.data.today = today.getFullYear() + '-' + that.checkTime(today.getMonth() + 1) + '-' + that.checkTime(today.getDate())
        yesterday.setTime(yesterday.getTime() - 24 * 60 * 60 * 1000)
        that.data.yesterday = yesterday.getFullYear() + '-' + that.checkTime(yesterday.getMonth() + 1) + '-' + that.checkTime(yesterday.getDate())
      } else {
        that.data.today = today.getFullYear() + '-' + that.checkTime(today.getMonth() + 1) + '-' + that.checkTime(today.getDate())
        that.data.yesterday = yesterday.getFullYear() + '-' + that.checkTime(yesterday.getMonth() + 1) + '-' + that.checkTime(yesterday.getDate())
      }
      that.$store.dispatch('city/qDatas', this.data).then((dataZ) => {
        that.lis = []
        // 确诊
        // 较昨天
        that.gong.compare = dataZ.Cases[0] - dataZ.Cases[0]
        // 判读上升 or 下降
        if (that.gong.compare < 0) {
          that.gong.compare = -1 * that.gong.compare
          that.gong.state = 'down'
        } else {
          that.gong.state = 'up'
        }
        // 今日情况
        that.gong.heal = that.format(dataZ.Cases[0])
        that.gong.name = '确诊人数'
        // 样式
        that.gong.clas = 'quezhen'
        that.gong.claz = 'quezhens'
        that.lis.push(that.gong)
        that.gong = {}

        // 治愈
        // 较昨天
        that.gong.compare = dataZ.Cure[0].value - dataZ.Cure[1].value
        // 判读上升 or 下降
        if (that.gong.compare < 0) {
          that.gong.compare = -1 * that.gong.compare
          that.gong.state = 'down'
        } else {
          that.gong.state = 'up'
        }
        // 今日情况
        that.gong.heal = that.format(dataZ.Cure[0].value)
        that.gong.name = '治愈人数'
        // 样式
        that.gong.clas = 'zhiyv'
        that.gong.claz = 'zhiyvs'
        that.lis.push(that.gong)
        that.gong = {}

        // 死亡
        // 较昨天
        that.gong.compare = dataZ.Death[0] - dataZ.Death[0]
        // 判读上升 or 下降
        if (that.gong.compare < 0) {
          that.gong.compare = -1 * that.gong.compare
          that.gong.state = 'down'
        } else {
          that.gong.state = 'up'
        }
        // 今日情况
        that.gong.heal = that.format(dataZ.Death[0])
        that.gong.name = '死亡人数'
        // 样式
        that.gong.clas = 'siwang'
        that.gong.claz = 'siwangs'
        that.lis.push(that.gong)
        that.gong = {}
      })
    },
    s() {
      this.data.name = 'US'
      this.getZhezhao()
      this.getData()
    },
    // 时间处理
    checkTime(i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
    },
    // 数字处理
    format(number) {
      var str = parseInt(number).toString()
      var len = str.length
      if (len <= 3) { return str }
      var r = len % 3
      return r > 0 ? str.slice(0, r) + ',' + str.slice(r, len).match(/\d{3}/g).join(',') : str.slice(r, len).match(/\d{3}/g).join(',')
    }
  }
}
</script>
<style scoped>
@font-face {
  src: url("../public/font/DS-DIGIT.ttf");
  font-family: "DIGIT";
}
@font-face {
  src: url("../public/font/Microsoft-YaHei.ttf");
  font-family: "YaHei";
}
@keyframes fade-in {
  0% {
    opacity: 0;
  }

  /*初始状态 透明度为0*/
  40% {
    opacity: 0;
  }

  /*过渡状态 透明度为0*/
  100% {
    opacity: 1;
  }

  /*结束状态 透明度为1*/
}
/* 数据展示 */
#citymap .datas {
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 90;
  height: 100px;
  text-align: center;
}
#citymap .datas ul {
  margin: 0;
  padding: 0;
  margin-top: 20px;
  list-style-type: none;
  height: 100%;
  animation: fade-in;
  animation-duration: 1.5s;
  -webkit-animation: fade-in 1.5s;
}
#citymap .datas ul li {
  height: 100%;
  display: inline-block;
  vertical-align: top;
  width: 30%;
  margin: 0 10px;
  background-color: rgb(38, 38, 38);
}
#citymap .datas ul li p {
  margin: 0;
  padding: 0;
  font-weight: bold;
  font-size: 17px;
  color: rgb(171, 171, 171);
  height: 40px;
  line-height: 40px;
}
#citymap .datas ul li p span {
  vertical-align: middle;
}
#citymap .datas ul li p .name {
  font-family: YaHei;
  margin-right: 5px;
}
#citymap .datas ul li p .compare {
  font-family: DIGIT;
  font-size: 28px;
  margin-left: 5px;
}
#citymap .datas ul .quezhen {
  border-top: 8px solid rgb(242, 75, 61);
}
#citymap .datas ul .zhiyv {
  border-top: 8px solid #79bc45;
}
#citymap .datas ul .siwang {
  border-top: 8px solid rgb(90, 90, 90);
}
#citymap .datas ul .quezhens {
  color: rgb(242, 75, 61);
  font-family: DIGIT;
  font-size: 35px;
}
#citymap .datas ul .zhiyvs {
  color: #79bc45;
  font-family: DIGIT;
  font-size: 35px;
}
#citymap .datas ul .siwangs {
  color: rgb(150, 150, 150);
  font-family: DIGIT;
  font-size: 35px;
}
</style>
<style>
/* 地图 */
#allmap .BMap_cpyCtrl {
  display: none;
}
#allmap .anchorBL {
  display: none;
}
#citymap .el-icon-caret-top {
  color: rgb(180, 0, 0);
}
#citymap .el-icon-caret-bottom {
  color: #79bc45;
}
#citymap .el-icon-refresh-right {
  position: absolute;
  z-index: 90;
  bottom: 10px;
  right: 10px;
  color: #ffffff;
  font-weight: bold;
  font-size: 25px;
  cursor: pointer;
}
</style>
