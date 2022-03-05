<template>
  <div id="left">
    <p style="color: #ffffff;margin: 10px 0;padding: 0;text-align: center;font-family: 'KuHei';font-weight: bold;">最新资讯TOP20</p>
    <i class="el-icon-refresh-right" style="position: absolute;color: #fff;top: 12px;left: 0px;font-size: 20px;cursor: pointer;" @click="chong()" />
    <ul>
      <li v-for="(value, index) in json" :key="index">
        <p>{{ value.tital }}</p>
        <span>{{ value.value }}</span>
        <div class="botton">
          <p style="width: 50%">{{ value.time }}</p>
          <p>点赞：{{ value.zan }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'Left',
  data() {
    return {
      json: [],
      gong: {}
    }
  },
  mounted() {
    var that = this
    that.getData()
  },
  methods: {
    getData() {
      var that = this
      var today = /今天(\S*)/
      var days = /(\S*):(\S*)/
      var year = /(\S*)-(\S*)/
      var valuez = /#(\S*)#/
      var nian = /年(\S*)/
      that.$store.dispatch('city/qLNews').then((dataZ) => {
        that.json = []
        for (var i = 0; i < dataZ.length; i++) {
          that.gong = {}
          that.gong.zan = dataZ[i].fabulous
          if (today.test(dataZ[i].time)) {
            const day = new Date()
            day.setFullYear(new Date().getFullYear())
            day.setHours(dataZ[i].time.match(today)[1].match(days)[1])
            day.setMinutes(dataZ[i].time.match(today)[1].match(days)[2])
            that.gong.time = day.getFullYear() + '-' + that.checkTime(day.getMonth() + 1) + '-' + that.checkTime(day.getDate())
          } else {
            if (!nian.test(dataZ[i].time)) {
              const day = new Date(dataZ[i].time.replace(/[\u4e00-\u9fa5]/g, '-').replace(/-([^-]*)$/, ' ') + dataZ[i].time.replace(/[\u4e00-\u9fa5]/g, '-').match(year)[2])
              day.setFullYear(new Date().getFullYear())
              that.gong.time = day.getFullYear() + '-' + that.checkTime(day.getMonth() + 1) + '-' + that.checkTime(day.getDate())
            } else {
              const day = new Date(dataZ[i].time.replace(/[\u4e00-\u9fa5]/g, '-').replace(/-([^-]*)$/, ' ') + dataZ[i].time.replace(/[\u4e00-\u9fa5]/g, '-').match(year)[2])
              that.gong.time = day.getFullYear() + '-' + that.checkTime(day.getMonth() + 1) + '-' + that.checkTime(day.getDate())
            }
          }
          if (valuez.test(dataZ[i].value)) {
            that.gong.tital = dataZ[i].value.match(valuez)[0]
            that.gong.value = dataZ[i].value.match(valuez).input
          } else {
            that.gong.tital = '#美国疫情#'
            that.gong.value = dataZ[i].value
          }
          that.json.push(that.gong)
        }
      })
    },
    chong() {
      this.getData()
      this.$message({
        message: '刷新成功',
        type: 'success'
      })
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
  src: url("../public/font/KuHei.ttf");
  font-family: "KuHei";
}
#left {
  position: absolute;
  height: calc(100% - 20px);
  width: calc(100% - 10px);
  overflow: auto;
}
#left ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
  text-align: center;
}
#left ul li {
  padding: 0 20px;
  margin-bottom: 35px;
  position: relative;
  background: rgba(40, 41, 44, .5);
}
#left ul li p {
  margin: 5px 12px;
  padding: 0;
  font-family: KuHei;
  color: #fff;
  font-size: 15px;
}
#left ul li span {
  font-family: KuHei;
  color: #ccccccbb;
  font-size: 13px;
  transition: all 0.5s;
}
#left ul li span:hover {
  color: rgba(255, 255, 255, 0.8);
}
#left ul li .botton p {
  margin: 5px 5px;
  display: inline-block;
  vertical-align: top;
  padding: 0 10px;
  color: rgba(255, 255, 255, 0.8);
}
/* 修饰 */
#left ul li::after {
  width: 10px;
  height: 10px;
  position: absolute;
  left: 4.6px;
  top: 4.2px;
  content: '';
  background-color: #fff;
  border-radius: 50%;
}
#left ul li::before {
  position: absolute;
  left: 8.6px;
  top: 5px;
  content: '';
  width: 2px;
  height: calc(100% + 35px);
  background-color: #fff;
}
</style>
