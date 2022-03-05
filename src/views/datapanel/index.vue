<template>
  <div class="datapanel">
    <!-- 上 -->
    <div class="top">
      <ul>
        <li class="public publiz">
          <exhibition />
        </li>
        <li class="public publiz">
          <maps />
        </li>
        <li class="public">
          <ul>
            <li class="publiz top">
              <i v-if="j === 3" class="el-icon-arrow-left" @click="huan(2)" />
              <i v-if="j === 2" class="el-icon-arrow-left" @click="huan(0)" />
              <wordCloud class="w" />
              <listDiseases class="s" />
              <transmission class="x" />
              <i v-if="j === 2" class="el-icon-arrow-right" @click="huan(3)" />
              <i v-if="j === 0" class="el-icon-arrow-right" @click="huan(2)" />
            </li>
            <li class="publiz bot">
              <i v-if="i === 1" class="el-icon-arrow-left" @click="dian(0)" />
              <timeSelection class="z" />
              <diseaseDetails class="y" />
              <i v-if="i === 0" class="el-icon-arrow-right" @click="dian(1)" />
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!-- 中 -->
    <div class="center">
      <ul>
        <li class="public publiz">
          <incidenceRate />
        </li>
        <li class="public publiz">
          <mortality />
        </li>
      </ul>
    </div>
    <!-- 下 -->
    <div class="botton">
      <ul>
        <li class="public publiz">
          <numberCases />
        </li>
        <li class="public publiz">
          <monthlyData />
        </li>
        <li class="public publiz">
          <numberDeaths />
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import eventBus from './components/public/js/EvebtBus'

import Exhibition from './components/exhibition' // 展示-右上
import Maps from './components/map' // 地图-中间
import WordCloud from './components/wordCloud' // 展示-左上-词云
import ListDiseases from './components/listDiseases' // 展示-左上-选病
import Transmission from './components/transmission' // 展示-左上-传播途径
import TimeSelection from './components/timeSelection' // 展示-左上-选时间
import DiseaseDetails from './components/diseaseDetails' // 展示-左上-进系统
import IncidenceRate from './components/incidenceRate' // 中间-左边-发病率
import Mortality from './components/mortality' // 中间-右边-死亡率
import NumberCases from './components/numberCases' // 下面-右边-发病数
import MonthlyData from './components/monthlyData' // 下面-中间-月统计
import NumberDeaths from './components/numberDeaths' // 下面-右边-死亡数

export default {
  name: 'Datapanel',
  components: {
    Exhibition,
    Maps,
    WordCloud,
    ListDiseases,
    Transmission,
    TimeSelection,
    DiseaseDetails,
    IncidenceRate,
    Mortality,
    NumberCases,
    MonthlyData,
    NumberDeaths
  },
  data() {
    return {
      i: 0,
      j: 0,
      type: '' // 疾病名称
    }
  },
  created() {
    setTimeout(function() {
      document.getElementsByClassName('datapanel')[0].style.display = 'block'
    }, 200)
  },
  destroyed() {
    document.getElementsByClassName('datapanel')[0].style.display = 'none'
    eventBus.$off('listtype')
    eventBus.$off('maptype')
    eventBus.$off('maptypc')
    eventBus.$off('maptypx')
  },
  mounted() {
    var that = this
    // 页面加载时-传疾病名称
    eventBus.$on('listtype', (listtype) => {
      that.type = listtype
    })
    // 疾病面板点击时-获取疾病名称
    eventBus.$on('maptype', (maptype) => {
      that.type = maptype
      that.bing()
    })
    // 疾病面板点击时-获取疾病名称
    eventBus.$on('maptypc', (maptypc) => {
      that.type = maptypc
      that.bing()
    })
    // 疾病面板点击时-获取疾病名称
    eventBus.$on('maptypx', (maptypx) => {
      that.type = maptypx
      that.bing()
    })
  },
  methods: {
    huan(e) {
      this.j = e
      var w = document.getElementsByClassName('w')[0]
      var s = document.getElementsByClassName('s')[0]
      var x = document.getElementsByClassName('x')[0]
      if (e === 3) {
        w.style.display = 'none'
        s.style.display = 'none'
        x.style.display = 'block'
      } else if (e === 2) {
        w.style.display = 'none'
        s.style.display = 'block'
        x.style.display = 'none'
      } else if (e === 0) {
        w.style.display = 'block'
        s.style.display = 'none'
        x.style.display = 'none'
      }
    },
    dian(e) {
      var that = this
      this.i = e
      var z = document.getElementsByClassName('z')[0]
      var y = document.getElementsByClassName('y')[0]
      if (e === 1) {
        eventBus.$emit('itype', that.type)
        z.style.display = 'none'
        y.style.display = 'block'
      } else {
        y.style.display = 'none'
        z.style.display = 'block'
      }
    },
    bing() {
      this.i = 1
      var z = document.getElementsByClassName('z')[0]
      var y = document.getElementsByClassName('y')[0]
      eventBus.$emit('itype', this.type)
      z.style.display = 'none'
      y.style.display = 'block'
    }
  }
}
</script>
<style scoped>
.datapanel {
  display: none
}
@import "./public/css/index.css";
@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
/* 上方样式 */
.datapanel .top >>> .el-icon-arrow-left {
  position: absolute;
  color: #fff;
  font-size: 18px;
  z-index: 10;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 50%;
  background-color: rgba(204, 204, 204, 0.3);
  top: 5px;
  cursor: pointer;
  transition: all 0.5s;
  left: 5px;
  animation: fade-in;
  animation-duration: 1s;
  -webkit-animation: fade-in 1s;
}
.datapanel .top >>> .el-icon-arrow-right {
  position: absolute;
  color: #fff;
  font-size: 18px;
  z-index: 10;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 50%;
  background-color: rgba(204, 204, 204, 0.3);
  top: 5px;
  cursor: pointer;
  transition: all 0.5s;
  right: 5px;
  animation: fade-in;
  animation-duration: 1s;
  -webkit-animation: fade-in 1s;
}
/* 下方样式 */
.datapanel .bot >>> .el-icon-arrow-left {
  position: absolute;
  color: #fff;
  font-size: 18px;
  z-index: 10;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 50%;
  background-color: rgba(204, 204, 204, 0.3);
  top: 50%;
  transform: translateY(-37.5px);
  cursor: pointer;
  transition: all 0.5s;
  left: 5px;
  animation: fade-in;
  animation-duration: 1s;
  -webkit-animation: fade-in 1s;
}
.datapanel .bot >>> .el-icon-arrow-right {
  position: absolute;
  color: #fff;
  font-size: 18px;
  z-index: 10;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 50%;
  background-color: rgba(204, 204, 204, 0.3);
  top: 50%;
  transform: translateY(-37.5px);
  cursor: pointer;
  transition: all 0.5s;
  right: 5px;
  animation: fade-in;
  animation-duration: 1s;
  -webkit-animation: fade-in 1s;
}
/* 悬浮 */
.datapanel >>> .el-icon-arrow-left:hover {
  font-weight: bold;
  background-color: rgba(204, 204, 204, 0.5);
}
.datapanel >>> .el-icon-arrow-right:hover {
  font-weight: bold;
  background-color: rgba(204, 204, 204, 0.5);
}
.y {
  display: none;
}
.x {
  display: none;
}
.s {
  display: none;
}
</style>
