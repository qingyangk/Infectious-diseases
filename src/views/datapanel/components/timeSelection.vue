<template>
  <!-- 底部 -->
  <div id="timeSelection">
    <div class="botton">
      <p>流行疾病统计时间</p>
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
</template>
<script>
import eventBus from './public/js/EvebtBus'

export default {
  name: 'TimeSelection',
  data() {
    return {
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
      x: -1,
      // 状态
      zhuang: true,
      times: ''
    }
  },
  beforeDestroy() {
    eventBus.$off('returnAll')
  },
  mounted() {
    var that = this
    // 月份
    var day = new Date()
    for (var i = 0; i <= (day.getFullYear() - 2004); i++) {
      const nDay = day.getFullYear() - i
      const gong = {}
      gong.value = nDay
      gong.label = nDay + '年'
      that.years.push(gong)
    }
    // this.time() // 补充默认2018年
    // 返回全部
    eventBus.$on('returnAll', (returnAll) => {
      this.year = ''
      this.month = ''
    })
  },
  methods: {
    // 回传时间
    time() {
      var that = this
      // 选择全部时 substring(convert(varchar(30), time, 120), 1, *) x为传回数据库的*
      if (that.year === 'ALL') {
        that.x = -1 // 全部
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
      eventBus.$emit('times', timez)
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
@font-face {
  src: url("./public/font/KuHei.ttf");
  font-family: "KuHei";
}
@font-face {
  src: url("./public/font/Microsoft-YaHei.ttf");
  font-family: "YaHei";
}
@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
/* 底部 */
#timeSelection {
  padding: 5px;
  text-align: center;
  height: 100%;
  animation: fade-in;
  animation-duration: 1s;
  -webkit-animation: fade-in 1s;
}
#timeSelection .botton {
  position: absolute;
  width: calc(100% - 10px);
  height: 75px;
  background-color: rgba(18, 18, 18, 0.2);
  text-align: center;
  top: 50%;
  transform: translate(0, -50%);
}
#timeSelection .botton p {
  margin: 0;
  padding: 0;
  font-family: KuHei;
  font-weight: bold;
  color: rgb(210, 210, 210);
  font-size: 14px;
  margin-bottom: 5px;
}
#timeSelection .botton span {
  font-family: KuHei;
  color: rgb(210, 210, 210);
  font-size: 13px;
  margin-bottom: 5px;
}
#timeSelection .botton ul {
  position: absolute;
  height: 100%;
  width: 100%;
}
#timeSelection .botton .bpublic {
  display: inline-block;
  vertical-align: top;
  width: 190px;
  height: calc(60% - 5px);
  line-height: calc(75px * 0.6 - 5px);
  margin-bottom: 5px;
  margin: 0 10px;
}
</style>
<style scoped>
@font-face {
  src: url("./public/font/KuHei.ttf");
  font-family: "KuHei";
}
/* 禁用样式 */
#timeSelection >>> .el-select {
  width: 145px;
}
#timeSelection >>> .el-input.is-disabled .el-input__inner {
  color: rgba(204, 204, 204, 0.486) !important;
}
/* 选中样式 */
#timeSelection >>> .el-select-dropdown__item.selected {
  color: #ff7979;
}
/* 下拉框全局样式 */
#timeSelection >>> .el-select-dropdown {
  background-color: rgba(18, 18, 18, 0.2);
  border: 1px solid rgba(180, 180, 180, 0.5);
  top: 30px !important;
}
#timeSelection >>> .el-input__inner {
  /*浏览器厂商前缀 - 禁用选中*/
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  z-index: 99;
}
#timeSelection >>> .el-input__inner {
  border: 1px solid rgba(180, 180, 180, 0.5);
}
#timeSelection >>> .el-input__inner,
#timeSelection >>> .el-select-dropdown__item {
  text-align: center !important;
  background-color: rgba(40, 43, 57, 0);
  font-family: YaHei;
  font-weight: bold;
  font-size: 13px;
  color: rgb(210, 210, 210);
  height: 30px !important;
}
#timeSelection >>> .el-select-dropdown__item {
  border-bottom: 1px solid rgba(180, 180, 180, 0.5);
}
#timeSelection >>> .el-select .el-input.is-focus .el-input__inner,
#timeSelection >>> .el-select .el-input__inner:focus {
  border: 1px solid rgba(180, 180, 180, 0.5);
  height: 30px !important;
}
#timeSelection >>> .el-select-dropdown__item.hover,
#timeSelection >>> .el-select-dropdown__item:hover {
  background-color: rgba(40, 43, 57, 0.85);
  color: #ff7979;
}
#timeSelection >>> .el-select-dropdown__item.selected {
  color: #ff7979 !important;
}
/* 小三角 */
#timeSelection >>> .el-popper .popper__arrow {
  border: none;
}
#timeSelection >>> .el-popper .popper__arrow::after {
  content: none;
}
</style>
