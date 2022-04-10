<template>
  <div id="QXGDetection">
    <div v-if="s !== 0" id="top">
      <ul>
        <li class="public">
          <!-- <p style="background-color: rgb(194, 196, 89);" class="col" /> -->
          <div class="cent">
            <p class="ppublic yang" @click="qie('诊断')">诊断病例</p>
            <p>{{ diagnosis }}</p>
            <p style="font-size: 15px;">男：{{ diagnosisB }}%</p>
          </div>
        </li>
        <li class="public">
          <!-- <p style="background-color: rgb(253, 141, 0);" class="col" /> -->
          <div class="cent">
            <p class="ppublic" @click="qie('重症')">重症病例</p>
            <p>{{ severe }}</p>
            <p style="font-size: 15px;">男：{{ severeB }}%</p>
          </div>
        </li>
        <li class="public">
          <!-- <p style="background-color: rgb(255, 121, 121);" class="col" /> -->
          <div class="cent">
            <p class="ppublic" @click="qie('死亡')">死亡病例</p>
            <p>{{ death }}</p>
            <p style="font-size: 15px;">男：{{ deathB }}%</p>
          </div>
        </li>
      </ul>
    </div>
    <div id="botton" :class="s !== 0 ? 'xian' : 'ying'">
      <div class="botton">
        <p>统计时间</p>
        <ul>
          <!-- 年份选择器 -->
          <li class="bpublic">
            <span>年份：</span>
            <el-select v-model="year" placeholder="年度统计" :popper-append-to-body="false" @visible-change="getMonth($event)" @change="time()">
              <el-option v-for="item in years" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </li>
          <!-- 月份选择器 -->
          <li class="bpublic">
            <span>月份：</span>
            <el-select v-model="month" placeholder="月度统计" :popper-append-to-body="false" :disabled="zhuang" @change="time()">
              <el-option v-for="item in months" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import eventBuz from '../public/js/EvebtBus'

export default {
  name: 'QXGDetection',
  data() {
    return {
      data: {
        name: '', // 地名
        type: '', // 疾病名称
        table: '', // 数据库名称
        where: '', // 层级
        degree: 0, // 程度
        category: 0 // 下方类别
      },
      // 确诊/重症/死亡数据-男女比
      diagnosis: 0,
      diagnosisB: 0,
      severe: 0,
      severeB: 0,
      death: 0,
      deathB: 0,
      // 年份
      year: '',
      years: [{
        value: 'ALL',
        label: 'ALL'
      }],
      // 月份
      month: '',
      months: [{
        value: 'ALL',
        label: 'ALL'
      }],
      // 层级
      x: 0,
      // 状态
      zhuang: true,
      times: 'ALL',
      s: 0 // 控制显隐
    }
  },
  beforeDestroy() {
    eventBuz.$off('data')
  },
  mounted() {
    var that = this
    eventBuz.$on('data', (data) => {
      that.data.name = data.name
      that.data.table = data.table
      that.data.type = data.type
      that.data.where = data.where
      that.getJson()
    })
    // 月份
    var day = new Date()
    for (var i = 0; i <= (day.getFullYear() - 2004); i++) {
      const nDay = day.getFullYear() - i
      const gong = {}
      gong.value = nDay
      gong.label = nDay + '年'
      that.years.push(gong)
    }
  },
  methods: {
    getJson() {
      var that = this
      this.s = 0
      that.data.timec = that.x
      that.data.time = that.times
      for (let i = 0; i < 3; i++) {
        that.data.degree = i
        that.$store.dispatch('ndatapanel/QXJson', that.data).then((dataz) => {
          if (dataz.degree * 1 === 0) { // 确诊
            that.diagnosis = that.format(dataz.values[0].value)
            if (dataz.gender.length > 1) {
              if (dataz.gender[0].name === '男') {
                that.diagnosisB = (dataz.gender[0].value / dataz.values[0].value * 100).toFixed(2) * 1
              } else {
                that.diagnosisB = (dataz.gender[1].value / dataz.values[0].value * 100).toFixed(2) * 1
              }
            } else if (dataz.gender.length === 1) {
              if (dataz.gender[0].name === '男') {
                that.diagnosisB = 100
              } else {
                that.diagnosisB = 0
              }
            } else if (dataz.gender.length > 0) {
              that.diagnosisB = 0
            }
          } else if (dataz.degree * 1 === 1) { // 重症
            that.severe = that.format(dataz.values[0].value)
            if (dataz.gender.length > 1) {
              if (dataz.gender[0].name === '男') {
                that.severeB = (dataz.gender[0].value / dataz.values[0].value * 100).toFixed(2) * 1
              } else {
                that.severeB = (dataz.gender[1].value / dataz.values[0].value * 100).toFixed(2) * 1
              }
            } else if (dataz.gender.length === 1) {
              if (dataz.gender[0].name === '男') {
                that.severeB = 100
              } else {
                that.severeB = 0
              }
            } else if (dataz.gender.length > 0) {
              that.severeB = 0
            }
          } else { // 死亡
            that.death = that.format(dataz.values[0].value)
            if (dataz.gender.length > 1) {
              if (dataz.gender[0].name === '男') {
                that.deathB = (dataz.gender[0].value / dataz.values[0].value * 100).toFixed(2) * 1
              } else {
                that.deathB = (dataz.gender[1].value / dataz.values[0].value * 100).toFixed(2) * 1
              }
            } else if (dataz.gender.length === 1) {
              if (dataz.gender[0].name === '男') {
                that.deathB = 100
              } else {
                that.deathB = 0
              }
            } else if (dataz.gender.length > 0) {
              that.deathB = 0
            }
          }
          if (i === 2) {
            this.s = 1
            setTimeout(function() {
              var ppublics = document.querySelectorAll('.ppublic')
              for (let i = 0; i < ppublics.length; i++) {
                ppublics[i].setAttribute('index', i)
                ppublics[i].addEventListener('click', function() {
                  for (var j = 0; j < ppublics.length; j++) {
                    ppublics[j].classList.remove('yang')
                  }
                  this.className = this.className + ' ' + 'yang'
                })
              }
            }, 100)
          }
        })
      }
    },
    // 发送疾病类型
    qie(e) {
      eventBuz.$emit('dataType', e)
    },
    // 回传时间
    time() {
      var that = this
      // 选择全部时 substring(convert(varchar(30), time, 120), 1, *) x为传回数据库的*
      if (that.year === 'ALL') {
        that.x = 0 // 全部
        that.times = 'ALL'
      } else {
        // 选择年份时
        if (that.month === '') {
          that.x = 4 // 年份
          that.times = that.year
        } else {
          that.x = 7 // 月份
          that.times = that.year + '-' + that.month
        }
      }
      var timez = { time: that.times, x: that.x }
      eventBuz.$emit('times', timez)
      this.getJson()
    },
    // 月份
    getMonth(e) {
      if (!e) {
        var that = this
        var day = new Date()
        if (that.year === 'ALL') {
          that.zhuang = true
          that.months = [{ value: 'ALL', label: 'ALL' }]
          that.month = ''
        } else {
          that.zhuang = false
          that.months = [{ value: 'ALL', label: 'ALL' }]
          if (that.year === day.getFullYear()) {
            for (var i = 1; i <= day.getMonth(); i++) {
              const gong = {}
              gong.value = that.checkTime(i)
              gong.label = that.checkTime(i)
              that.months.push(gong)
            }
          } else {
            for (var j = 1; j <= 12; j++) {
              const gong = {}
              gong.value = that.checkTime(j)
              gong.label = that.checkTime(j)
              that.months.push(gong)
            }
          }
        }
      }
      if (this.year === '') {
        this.zhuang = true
      }
    },
    // 数字处理
    format(number) {
      var str = parseInt(number).toString()
      var len = str.length
      if (len <= 3) { return str }
      var r = len % 3
      return r > 0 ? str.slice(0, r) + ',' + str.slice(r, len).match(/\d{3}/g).join(',') : str.slice(r, len).match(/\d{3}/g).join(',')
    },
    // 时间处理
    checkTime(i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
    }
  }
}
</script>
<style scoped>
[v-cloak]{
display: none;
}
@font-face {
  src: url("../public/font/KuHei.ttf");
  font-family: "KuHei";
}
@font-face {
  src: url("../public/font/DS-DIGIT.ttf");
  font-family: "DIGIT";
}
#QXGDetection {
  position: absolute;
  width: 100%;
  height: 100%;
}
/* 头部 */
#QXGDetection #top {
  position: absolute;
  width: 100%;
  height: 60%;
  top: 0;
}
#QXGDetection #top p,
#QXGDetection #top ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
#QXGDetection #top .public {
  position: absolute;
  width: calc(100% / 3 - 10px);
  height: 100%;
  top: 0;
}
#QXGDetection #top .public .col {
  position: absolute;
  width: 100%;
  height: 10px;
  top: 0;
  left: 0;
}
#QXGDetection #top .public .cent {
  position: absolute;
  width: 100%;
  height: calc(100% - 10px);
  bottom: 0;
  left: 0;
  background-color: rgba(79, 133, 177, 0.3);
  background-image: url("../public/img/ba.png");
  background-size: 100% 100%;
  text-align: center;
  color: rgba(238, 234, 234, 0.9);
}
#QXGDetection #top .public .cent .ppublic {
  position: absolute;
  width: 100%;
  height: 25px;
  line-height: 25px;
  color: rgba(238, 234, 234, 0.9);
  background-image: url("../public/img/ba.png");
  background-size: 100% 100%;
  font-size: 14px;
  font-weight: bold;
  font-family: YaHei;
  cursor: pointer;
  transition: all 0.5s;
  text-align: center;
}
#QXGDetection #top .public .cent .ppublic:hover {
  color: rgb(238, 234, 234);
}
#QXGDetection #top .public .cent p:nth-child(2) {
  position: absolute;
  top: 25px;
  width: 100%;
  height: 35%;
  font-family: DIGIT;
  margin: 5px 0 !important;
  font-size: 28px;
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
}
#QXGDetection #top .public .cent p:nth-child(3) {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: calc(65% - 35px);
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
}
#QXGDetection #top .public .cent p:nth-child(3) >>> .el-progress {
  position: absolute;
  width: 80%;
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
}
#QXGDetection #top .public .cent p:nth-child(3) >>> .el-progress-bar__inner {
  background-color: rgb(0, 187, 249);
}
#QXGDetection #top .public .cent p:nth-child(3) >>> .el-progress-bar__outer {
  background-color: #ff7979;
}
#QXGDetection #top .public:nth-child(1) {
  left: 0;
}
#QXGDetection #top .public:nth-child(2) {
  left: 50%;
  transform: translate(-50%, 0);
}
#QXGDetection #top .public:nth-child(3) {
  right: 0;
}
/* 选中样式 */
@keyframes fade-in1 {
  0% {
    right: 10%;
  }
  50% {
    right: 15%;
  }
  100% {
    right: 10%;
  }
}
@keyframes fade-in2 {
  0% {
    left: 10%;
  }
  50% {
    left: 15%;
  }
  100% {
    left: 10%;
  }
}
#QXGDetection #top .public .cent .yang {
  position: relative;
  color: #ff7979;
}
#QXGDetection #top .public .cent .yang::before {
  position: absolute;
  content: '▶';
  width: 20px;
  height: 20px;
  color: #ff7979;
  left: 15%;
  top: 50%;
  transform: translateY(calc(50% - 22px));
  animation: fade-in2 1.5s linear infinite; /* 调用动画 */
}
#QXGDetection #top .public .cent .yang::after {
  position: absolute;
  content: '◀';
  width: 20px;
  height: 20px;
  color: #ff7979;
  right: 15%;
  top: 50%;
  transform: translateY(calc(50% - 22px));
  animation: fade-in1 1.5s linear infinite; /* 调用动画 */
}
/* 底部 */
#QXGDetection #botton {
  position: absolute;
  width: 100%;
  height: 40%;
  bottom: 0;
}
.xian {
  opacity: 1;
}
.ying {
  opacity: 0;
}
#QXGDetection #botton .botton {
  position: absolute;
  width: calc(100% - 10px);
  height: 75px;
  background-color: rgba(18, 18, 18, 0.2);
  text-align: center;
  top: 50%;
  transform: translate(0, -50%);
}
#QXGDetection #botton .botton p {
  margin: 0;
  padding: 0;
  font-family: KuHei;
  font-weight: bold;
  color: rgb(210, 210, 210);
  font-size: 14px;
  margin-bottom: 5px;
}
#QXGDetection #botton .botton span {
  font-family: KuHei;
  color: rgb(210, 210, 210);
  font-size: 13px;
  margin-bottom: 5px;
}
#QXGDetection #botton .botton ul {
  position: absolute;
  height: 100%;
  width: 100%;
}
#QXGDetection #botton .botton .bpublic {
  display: inline-block;
  vertical-align: top;
  width: 190px;
  height: calc(60% - 5px);
  line-height: calc(75px * 0.6 - 5px);
  margin-bottom: 5px;
  margin: 0 10px;
}
/* 禁用样式 */
#QXGDetection #botton >>> .el-select {
  width: 145px;
}
#QXGDetection #botton >>> .el-input.is-disabled .el-input__inner {
  color: rgba(204, 204, 204, 0.486) !important;
}
/* 选中样式 */
#QXGDetection #botton >>> .el-select-dropdown__item.selected {
  color: #ff7979;
}
/* 下拉框全局样式 */
#QXGDetection #botton >>> .el-select-dropdown {
  background-color: rgba(79, 133, 177, 0.3);
  border: 1px solid rgba(180, 180, 180, 0.5);
  top: 30px !important;
}
#QXGDetection #botton >>> .el-input__inner {
  /*浏览器厂商前缀 - 禁用选中*/
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  z-index: 99;
}
#QXGDetection #botton >>> .el-input__inner,
#QXGDetection #botton >>> .el-select-dropdown__item {
  text-align: center !important;
  background-color: rgba(40, 43, 57, 0);
  font-family: KuHei;
  font-weight: bold;
  font-size: 13px;
  color: rgb(210, 210, 210);
  height: 30px !important;
  border: 1px solid rgba(180, 180, 180, 0.5);
}
#QXGDetection #botton >>> .el-select .el-input.is-focus .el-input__inner,
#QXGDetection #botton >>> .el-select .el-input__inner:focus {
  border: 1px solid rgba(180, 180, 180, 0.5);
  height: 30px !important;
}
#QXGDetection #botton >>> .el-select-dropdown__item.hover,
#QXGDetection #botton >>> .el-select-dropdown__item:hover {
  background-color: rgba(40, 43, 57, 0.85);
  color: #ff7979;
}
#QXGDetection #botton >>> .el-select-dropdown__item.selected {
  color: #ff7979 !important;
}
/* 小三角 */
#QXGDetection #botton >>> .el-popper .popper__arrow {
  border: none;
}
#QXGDetection #botton >>> .el-popper .popper__arrow::after {
  content: none;
}
</style>
