<template>
  <div id="sentiment">
    <div id="mosMap" />
    <!-- 查询类型 -->
    <div class="type">
      <ul>
        <li class="CircleSearch" @click="heatmap()"><icon-svg icon-class="icon-jihechaxun1" /><span> 热力图</span></li>
        <li class="CircleSearch" @click="line()"><icon-svg icon-class="icon-jihechaxun1" /><span> 路线图</span></li>
        <li class="CircleSearch" @click="point()"><icon-svg icon-class="icon-jihechaxun1" /><span> 站点图</span></li>
      </ul>
    </div>
    <!-- 参数 -->
    <div id="setup">
      <!-- 标题 -->
      <div class="title">
        关口监测
      </div>
      <!-- 时间 -->
      <div class="fTime">
        <i class="el-icon-d-arrow-left img" style="font-size:21px" @click="ReduceTime()" />
        <el-date-picker v-model="timx" type="date" placeholder="选择日期" :picker-options="pickerOptions" :editable="false" @change="STime()" />
        <i class="el-icon-d-arrow-right img" style="font-size:21px" @click="IncreaseTime()" />
      </div>
      <!-- 监测 -->
      <div class="fMonitor">
        <el-radio v-model="x" label="24" @change="bmonitor(24)">24H</el-radio>
        <el-radio v-model="x" label="12" @change="bmonitor(12)">12H</el-radio>
      </div>
      <!-- 播放 -->
      <div id="play" class="play" @click="bofang()">
        <icon-svg :icon-class="ioc" class="img" />
        <p class="xuanfu">自动播放</p>
      </div>
    </div>
    <!-- 监测 -->
    <div id="monitor">
      <div id="chart" style="height: 100%;width: 100%;z-index: 1;" />
    </div>
    <router />
    <!-- 城市选择 -->
    <selectRegion />
    <!-- 加载动画 -->
    <div id="bg">
      <div id="xuan">
        <span /><span /><span /><span />
      </div>
    </div>
  </div>
</template>

<script>
import Router from './router'
import mapboxgl from 'mapbox-gl'
import SelectRegion from './selectRegion'
import eventBus from '../public/js/EvebtBus'
import * as echarts from 'echarts'
// import counties from '../public/js/counties.json' // 地铁车站数据
// import Router from ''
export default {
  name: 'Sentiment',
  components: {
    Router,
    SelectRegion
  },
  data() {
    return {
      json: {
        name: '中国',
        where: '',
        code: ''
      },
      timx: '', // 时间
      pickerOptions: {
        disabledDate: time => {
          return time > new Date().getTime()
        }
      },
      // 数据
      datas: [],
      x: '24',
      xValue: [],
      myChart: null,
      option: null,
      bfang: true,
      ioc: 'icon-zanting',
      // 地图
      map: null,
      scene: null,
      allMapData: []
    }
  },
  beforeDestroy() {
    eventBus.$off('json')
    document.getElementById('sentiment').style.display = 'none'
  },
  mounted() {
    // Source data CSV
    // var that = this
    this.int()
  },
  methods: {
    int() {
      mapboxgl.accessToken = 'pk.eyJ1IjoidWJlcmRhdGEiLCJhIjoiY2pudzRtaWloMDAzcTN2bzN1aXdxZHB5bSJ9.2bkj3IiRC8wj3jLThvDGdA'
      var chart = echarts.init(document.getElementById('mosMap'))
      chart.setOption({
        mapbox: {
          center: [174.7838400879, -36.8551296749],
          zoom: 5.2,
          // pitch: 50,
          // bearing: -50,
          altitudeScale: 10000000,
          style: 'mapbox://styles/mapbox/dark-v9',
          postEffect: {
            enable: true,
            FXAA: {
              enable: true
            }
          },
          light: {
            main: {
              itensity: 1,
              sadow: true,
              sadowQuality: 'high'
            },
            ambient: {
              itensity: 0
            }
          }
        },
        series: [{
          type: 'lines3D',

          coordinateSystem: 'mapbox',

          effect: {
            show: true,
            constantSpeed: 5,
            trailWidth: 1,
            trailLength: 10,
            trailOpacity: 1,
            spotIntensity: 2
          },

          blendMode: 'lighter',

          polyline: true,

          lineStyle: {
            width: 0.1,
            color: 'rgb(200, 40, 0)',
            opacity: 0.0
          },

          data: {
            count: function() {
              // return taxiRoutes.length
            },
            getItem: function(idx) {
              // return taxiRoutes[idx]
            }
          }
        }]
      })
    }
  }
}
</script>
<style scoped>
@font-face {
  src: url("../public/font/KuHei.ttf");
  font-family: "KuHei";
}
@font-face {
  src: url("../public/font/Microsoft-YaHei.ttf");
  font-family: "YaHei";
}
@font-face {
  src: url("../public/font/DS-DIGIT.ttf");
  font-family: "DIGIT";
}
#sentiment {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url("../public/img/back.png") no-repeat center center;
  /* 背景图不平铺 */
  background-size: cover;
  /* 让背景图基于容器大小伸缩 */
  background-attachment: fixed;
  /* 当内容高度大于图片高度时，背景图像的位置相对于viewport固定 */
  background-color: #CCCCCC;
}
/* L7logo */
#sentiment >>> .l7-left .l7-control{
  display: none !important;
}
/* mapboxlogo */
#sentiment >>>  .mapboxgl-ctrl-bottom-right{
  display: none !important;
}
/* 地图 */
#mosMap {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 0;
}
/* 参数 */
#sentiment #setup {
  position: absolute;
  width: calc(100% - 50px);
  left: 45px;
  bottom: calc(35% + 7px);
  height: 45px;
  line-height: 45px;
  font-family: KuHei;
  border: 1px solid rgba(25, 186, 139, 0.2);
  background: url("../public/img/bg.png") rgba(79, 133, 177, 0.3);
  /* z-index: 20; */
}
/* 标题 */
#sentiment #setup .title {
  position: absolute;
  font-family: KuHei;
  color: #fff;
  font-size: 18px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  letter-spacing: 5px;
}
/* 时间范围 */
#sentiment #setup .fTime {
  position: absolute;
  left: 0;
  width: 260px;
  height: 45px;
  line-height: 45px;
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
}
#sentiment #setup .fTime::after {
  content: '';
  position: absolute;
  height: calc(100% - 2px);
  width: 2px;
  background-color: rgba(219, 219, 219, 0.555);
  right: 0;
  top: 0;
}
#sentiment #setup .fTime >>> .el-input__prefix,
#sentiment #setup .fTime >>> .el-input__suffix {
  display: none;
}
#sentiment #setup .fTime >>> .el-input__inner {
  background-color: rgba(255, 255, 255, 0) ;
  border: none;
  font-family: KuHei;
  color: #fff;
  text-align: center;
  width: 140px;
  border-bottom: 2px solid rgba(219, 219, 219, 0.555);
  height: 30px;
  border-radius: 0;
  cursor: pointer;
  user-select: none;
  padding: 0 10px;
}
#sentiment #setup .fTime >>> .el-date-editor.el-input,
#sentiment #setup .fTime >>> .el-date-editor.el-input__inner {
  width: 140px;
}
#sentiment #setup .fTime .img {
  margin: 0 15px;
  height: 45px;
  line-height: 45px;
  cursor: pointer;
  color: rgb(199, 199, 199);
  transition: all 0.5s;
}
#sentiment #setup .fTime .img:hover {
  color: #fff;
}
/* 监测模式 */
#sentiment #setup .fMonitor {
  position: absolute;
  left: 260px;
  width: 260px;
  height: 45px;
  line-height: 45px;
  text-align: center;
  border-right: 2px solid rgba(219, 219, 219, 0.555);
  justify-content: center;
  align-items: center;
  display: flex;
}
#sentiment #setup .fMonitor >>> .el-radio {
  color: #fff;
}
#sentiment #setup .fMonitor >>> .el-radio__inner::after {
  left: 54.2%;
  top: 53.3%;
}
#sentiment #setup .fMonitor >>> .el-radio__input.is-checked+.el-radio__label {
  color: #ff7979;
}
#sentiment #setup .fMonitor >>> .el-radio__input.is-checked .el-radio__inner {
  border-color: #ff7979;
  background: #ff7979;
}
/* 播放 */
#sentiment #setup .play {
  position: absolute;
  cursor: pointer;
  font-size: 25px;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.5s;
  height: 100%;
  width: 35px;
  right: 0;
  text-align: center;
}
#sentiment #setup .play:hover {
  color: rgba(255, 255, 255, 1);
}
#sentiment #setup .play .xuanfu {
  color: #fff;
  font-family: KuHei;
  margin: 0;
  padding: 0;
  position: absolute;
  text-align: center;
  background-color: rgba(40, 43, 57, 0.8) !important;
  letter-spacing: 3px;
  border: 1px solid rgba(219, 219, 219, 0.555);
  width: 85px;
  border-radius: 4px;
  font-size: 12px;
  height: 35px;
  line-height: 35px;
  right: 35px;
  top: 50%;
  transform: translate(0, -50%);
  opacity: 0;
  transition: all 0.5s;
}
/* 监测 */
#sentiment #monitor {
  position: absolute;
  width: calc(100% - 50px);
  left: 45px;
  height: 35%;
  bottom: 3px;
  font-family: KuHei;
  border: 1px solid rgba(25, 186, 139, 0.2);
  background: url("../public/img/bg.png") rgba(79, 133, 177, 0.3);
  z-index: 20;
}
/* 四角 */
#sentiment #setup::after,
#sentiment #monitor::after {
  position: absolute;
  content: "";
  bottom: -1px;
  right: -1px;
  height: 10px;
  width: 10px;
  border-bottom: 2px solid #02a6b5;
  border-right: 2px solid #02a6b5;
  transition: all 1.5s;
  z-index: 0;
}
#sentiment #setup::before,
#sentiment #monitor::before {
  position: absolute;
  content: "";
  top: -1px;
  left: -1px;
  height: 10px;
  width: 10px;
  border-top: 2px solid #02a6b5;
  border-left: 2px solid #02a6b5;
  transition: all 1.5s;
  z-index: 0;
}
/**===== xuan =====*/
#bg {
  display: none;
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(140, 140, 140, 0.4);
  z-index: 999;
}
#bg #xuan {
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  height: 50px;
  width: 70px;
  margin: -25px 0 0 -25px;
}
#bg #xuan span {
  width: 25px;
  height: 25px;
  background-color: #ff7979;
  display: inline-block;
  -webkit-animation: square3 1.7s infinite ease-in-out both;
  animation: square3 1.7s infinite ease-in-out both;
}
#bg #xuan span:nth-child(1) {
  left: 0px;
  -webkit-animation-delay: 0.1s;
  animation-delay: 0.1s;
}
#bg #xuan span:nth-child(2) {
  left: 15px;
  -webkit-animation-delay: 0.6s;
  animation-delay: 0.6s;
}
#bg #xuan span:nth-child(3) {
  left: 30px;
  -webkit-animation-delay: 1.1s;
  animation-delay: 1.1s;
}
#bg #xuan span:nth-child(4) {
  left: 45px;
  -webkit-animation-delay: 1.5s;
  animation-delay: 1.5s;
}
@keyframes square3 {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
    opacity: 0;
  }
  50% {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 1;
  }
  100% {
    -webkit-transform: rotate(60deg);
    transform: rotate(60deg);
    opacity: .5;
  }
}
@-webkit-keyframes square3 {
  0% {
    -webkit-transform: scale(0);
    opacity: 0;
  }
  50% {
    -webkit-transform: scale(1);
    opacity: 1;
  }
  100% {
    -webkit-transform: rotate(60deg);
    opacity: .5;
  }
}
/** END of xuan */
/* 查询类型 */
#sentiment ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
#sentiment .type {
  position: absolute;
  z-index: 10;
  top: 55px;
  right: 5px;
  font-family: KuHei;
  font-size: 14px;
}
#sentiment .type li {
  width: 100px;
  height: 35px;
  text-align: center;
  padding: 5px 0;
  cursor: pointer;
  border-radius: 2px;
  color: rgb(202, 202, 202);
  background-color: rgba(79, 133, 177, 0.3);
  border: 2px solid rgba(25, 186, 139, 0.2);
  transition: all 0.5s;
  margin-bottom: 5px;
}
#sentiment .type li:hover {
  color: rgb(230, 230, 230);
}
</style>
