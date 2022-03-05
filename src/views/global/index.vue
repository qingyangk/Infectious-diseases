<template>
  <div id="global">
    <!-- 左侧地图 -->
    <div class="left">
      <cityMap />
      <div class="button" />
    </div>
    <!-- 右侧图标 -->
    <div class="right">
      <ul>
        <li class="top">
          <el-row>
            <!-- 全美累计确诊死亡 -->
            <el-col :span="12">
              <div class="lefts public">
                <confirmedDeath />
              </div>
            </el-col>
            <!-- 全美日增确诊死亡 -->
            <el-col :span="12">
              <div class="rights public">
                <confirmedDeathDay />
              </div>
            </el-col>
          </el-row>
        </li>
        <li class="body">
          <el-row>
            <!-- 全美现有确诊 -->
            <el-col :span="12">
              <div class="lefts public">
                <currentdiagnosis />
              </div>
            </el-col>
            <!-- 全美新冠床ICU新冠床 -->
            <el-col :span="12">
              <div class="rights public">
                <medicalresources />
              </div>
            </el-col>
          </el-row>
        </li>
        <li class="center">
          <el-row>
            <!-- 全美疫苗总/一/二 -->
            <el-col :span="12">
              <div class="lefts public">
                <vaccines />
              </div>
            </el-col>
            <!-- 全美阳性/阴性 -->
            <el-col :span="12">
              <div class="rights public">
                <nucleicaTest />
              </div>
            </el-col>
          </el-row>
        </li>
        <li class="bottom">
          <el-row>
            <!-- 地区排名 -->
            <el-col :span="12">
              <div class="lefts public">
                <regionalranking />
              </div>
            </el-col>
            <!-- 地区日增排名 -->
            <el-col :span="12">
              <div class="rights public">
                <regionalrankingDay />
              </div>
            </el-col>
          </el-row>
        </li>
      </ul>
      <div class="button" />
    </div>

  </div>
</template>
<script>
import CityMap from './components/cityMap'
import ConfirmedDeath from './components/confirmedDeath'
import ConfirmedDeathDay from './components/confirmedDeathDay'
import Currentdiagnosis from './components/currentdiagnosis'
import Medicalresources from './components/medicalresources'
import Vaccines from './components/vaccines'
import NucleicaTest from './components/nucleicaTest'
import Regionalranking from './components/regionalranking'
import RegionalrankingDay from './components/regionalrankingDay'
import eventBus from './public/js/EvebtBus'
export default {
  name: 'Global',
  components: {
    CityMap,
    ConfirmedDeath,
    ConfirmedDeathDay,
    Currentdiagnosis,
    Medicalresources,
    Vaccines,
    NucleicaTest,
    Regionalranking,
    RegionalrankingDay
  },
  data() {
    return {
    }
  },
  beforeDestroy() {
    eventBus.$off('pushMsg')
  },
  mounted() {
    eventBus.$on('pushMsg', (children1Msg) => {
      // console.log(children1Msg)
      document.getElementById('zhegai').style.display = 'block'
      this.ying = setTimeout(() => {
        displan()
      }, 3000)
      function displan(params) {
        eventBus.$emit('gai', 1)
      }
    })
  }
}
</script>
<style scoped>
#global {
  position: absolute;
  height: 100%;
  width: 100%;
  background: black;
}

/* 左侧 */
#global .left {
  position: absolute;
  width: 49.9%;
  height: 100%;
  left: 0;
  z-index: 1;
}
#global .left::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 25px;
  height: 20px;
  border-top: 2px solid #fff;
  border-left: 2px solid #fff;
  z-index: 99;
}
#global .left::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 25px;
  height: 20px;
  border-top: 2px solid #fff;
  border-right: 2px solid #fff;
  z-index: 99;
}
#global .left .button::after {
  content: '';
  position: absolute;
  bottom: 1px;
  left: 0;
  width: 25px;
  height: 20px;
  border-bottom: 2px solid #fff;
  border-left: 2px solid #fff;
  z-index: 99;
}
#global .left .button::before {
  content: '';
  position: absolute;
  bottom: 1px;
  right: 0;
  width: 25px;
  height: 20px;
  border-bottom: 2px solid #fff;
  border-right: 2px solid #fff;
  z-index: 99;
}
/* 右侧 */
#global .right::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 25px;
  height: 20px;
  border-top: 2px solid #fff;
  border-left: 2px solid #fff;
  z-index: 99;
}
#global .right::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 25px;
  height: 20px;
  border-top: 2px solid #fff;
  border-right: 2px solid #fff;
  z-index: 99;
}
#global .right .button::after {
  content: '';
  position: absolute;
  bottom: 1px;
  left: 0;
  width: 25px;
  height: 20px;
  border-bottom: 2px solid #fff;
  border-left: 2px solid #fff;
  z-index: 99;
}
#global .right .button::before {
  content: '';
  position: absolute;
  bottom: 1px;
  right: 0;
  width: 25px;
  height: 20px;
  border-bottom: 2px solid #fff;
  border-right: 2px solid #fff;
  z-index: 99;
}
#global .right {
  position: absolute;
  width: 49.9%;
  height: 100%;
  right: 0;
  z-index: 1;
  padding: 10px; /**/
}
#global .right ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
  position: absolute;
  height: 97%;
  width: 97.5%;
  z-index: 10;
}
#global .right ul li {
  width: 100%;
  background-color: rgb(19, 19, 19);
  margin-bottom: 5px;
}
/* 位置信息 */
#global .right ul .top {
  position: absolute;
  top: 0;
  background: url("./public/img/bg.png") rgba(255, 255, 255, 0.2);
  cursor: pointer;
  height: calc(25% - 5px);
}
#global .right ul .body {
  position: absolute;
  top: 25%;
  background: url("./public/img/bg.png") rgba(255, 255, 255, 0.2);
  cursor: pointer;
  height: calc(25% - 5px);
}
#global .right ul .center {
  position: absolute;
  top: 50%;
  background: url("./public/img/bg.png") rgba(255, 255, 255, 0.2);
  cursor: pointer;
  height: calc(25% - 5px);
}
#global .right ul .bottom {
  position: absolute;
  top: 75%;
  background: url("./public/img/bg.png") rgba(255, 255, 255, 0.2);
  cursor: pointer;
  height: calc(25%);
}
/* 公共的 */
#global .right .public {
  color: #ffffff;
  text-align: center;
}
#global .right .lefts {
  border-right: 2.5px solid black;
  position: absolute;
  left: 0;
  height: 100%;
  width: 50%;
  z-index: 10;
}
#global .right .rights {
  border-left: 2.5px solid black;
  position: absolute;
  right: 0;
  height: 100%;
  width: 50%;
  z-index: 10;
}
</style>
<style>
#global .right .el-row,
#global .right .el-row .el-col {
  height: 100%;
}
</style>
