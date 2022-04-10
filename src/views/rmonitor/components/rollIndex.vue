<template>
  <div id="rollindex">
    <!-- 上部 -->
    <div class="top" @click="handleClick($event)">
      <vue-seamless-scroll :data="listData" :class-option="option">
        <ul>
          <li v-for="(value, item) in listData" :key="item">
            <div class="neirong" :class="value.className" :data-dept="value.id" :data-deps="value.name">
              <!-- 左边 -->
              <div class="left">
                <div class="LTop">
                  <el-avatar class="publiz" fit="fill" size="large" :src="value.url" />
                </div>
                <div class="LBootom">
                  <span style="color: #fff">{{ value.name }}</span>
                </div>
              </div>
              <!-- 右边 -->
              <div class="right">
                <p>手环ID：<span>{{ value.id }}</span><span>详情</span></p>
                <p><span>{{ value.type }}: {{ value.current }}</span><span>参考: {{ value.consult }}</span><span><icon-svg :icon-class="value.ioc" style="font-size: 16.5px" /></span></p>
                <p>{{ value.time }}</p>
              </div>
            </div>
          </li>
        </ul>
      </vue-seamless-scroll>
    </div>
    <!-- 下部 -->
    <div class="bottom" @click="stop()">{{ start }}</div>
    <!-- 弹窗 -->
    <div class="pupup">
      <div class="PTop">
        <!-- 时间 -->
        <div class="fTime">
          <i class="el-icon-d-arrow-left img" style="font-size:21px" @click="ReduceTime()" />
          <el-date-picker v-model="timx" type="date" placeholder="选择日期" :picker-options="pickerOptions" :editable="false" @change="STime()" />
          <i class="el-icon-d-arrow-right img" style="font-size:21px" @click="IncreaseTime()" />
        </div>
        <!-- 信息 -->
        <div class="other">
          <span>姓名: {{ name }}</span>
          <span>编号: {{ id }}</span>
          <span @click="close()"><i class="el-icon-close" /></span>
        </div>
      </div>
      <div class="PBottom">
        <div id="histor" style="height: 100%;width: 100%;z-index: 10;" />
      </div>
    </div>
  </div>
</template>
<script>
import vueSeamlessScroll from 'vue-seamless-scroll'
import eventBus from '../public/js/EvebtBus'
import * as echarts from 'echarts'

export default {
  name: 'Rollindex',
  components: {
    vueSeamlessScroll
  },
  data() {
    return {
      json: {
        name: '',
        where: 0,
        monitor: ''
      },
      listData: [], // 数据集
      step: 1, // 速度
      start: '暂停滚动', // 是否滚动
      myChart: null,
      timx: '', // 今日时间
      pickerOptions: {
        disabledDate: time => {
          return time > new Date().getTime()
        }
      },
      wendu: { },
      xinlv: { },
      xueyg: { },
      xueyd: { },
      id: null, // 编号
      name: '' // 姓名
    }
  },
  computed: {
    option() {
      return {
        step: this.step, // 速度
        hoverStop: true, // 悬停暂停滚动
        singleHeight: 110, // 单行停顿高度
        waitTime: 1500, // 单行停顿时间
        openWatch: true // 开启数据实时监控刷新dom
      }
    }
  },
  beforeDestroy() {
    eventBus.$off('data')
    this.CAdestroy()
  },
  mounted() {
    var that = this
    // 接收城市数据
    eventBus.$on('data', datas => {
      that.listDat = []
      that.json.name = datas.name
      that.json.where = datas.where
      that.json.monitor = datas.monitor
      that.timx = datas.timx
      that.wendu = datas.wendu
      that.xinlv = datas.xinlv
      that.xueyg = datas.xueyg
      that.xueyd = datas.xueyd
      // 查询
      var data = {}
      data.where = that.json.where
      data.name = that.json.name
      data.monitor = that.json.monitor
      data.timz = that.checkTime3(new Date(that.timx))
      data.timx = that.checkTime3(new Date((new Date(that.timx)).getTime() + 24 * 60 * 60 * 1000))
      that.$store.dispatch('ncity/QCBroadcasting', data).then((datas) => {
        var listData = []
        for (let i = 0; i < 30; i++) {
          var gong = {}
          gong.url = datas[i].头像
          gong.name = datas[i].姓名
          gong.id = datas[i].编号
          gong.time = that.checkTime2(new Date(datas[i].时间))
          if (datas[i].体温 < that.wendu.di) {
            gong.current = datas[i].体温
            gong.consult = that.wendu.di
            gong.ioc = 'icon-di'
            gong.className = 'tw'
            gong.type = '体温'
            listData.push(JSON.parse(JSON.stringify(gong)))
          }
          if (datas[i].体温 > that.wendu.ga) {
            gong.current = datas[i].体温
            gong.consult = that.wendu.ga
            gong.ioc = 'icon-gao'
            gong.className = 'tw'
            gong.type = '体温'
            listData.push(JSON.parse(JSON.stringify(gong)))
          }
          if (datas[i].心率 < that.xinlv.di) {
            gong.current = datas[i].心率
            gong.consult = that.xinlv.di
            gong.ioc = 'icon-di'
            gong.className = 'xl'
            gong.type = '心率'
            listData.push(JSON.parse(JSON.stringify(gong)))
          }
          if (datas[i].心率 > that.xinlv.ga) {
            gong.current = datas[i].心率
            gong.consult = that.xinlv.ga
            gong.ioc = 'icon-gao'
            gong.className = 'xl'
            gong.type = '心率'
            listData.push(JSON.parse(JSON.stringify(gong)))
          }
          if (datas[i].高压 < that.xueyg.di) {
            gong.current = datas[i].高压
            gong.consult = that.xueyg.di
            gong.ioc = 'icon-di'
            gong.className = 'gy'
            gong.type = '高压'
            listData.push(JSON.parse(JSON.stringify(gong)))
          }
          if (datas[i].高压 > that.xueyg.ga) {
            gong.current = datas[i].高压
            gong.consult = that.xueyg.ga
            gong.ioc = 'icon-gao'
            gong.className = 'gy'
            gong.type = '高压'
            listData.push(JSON.parse(JSON.stringify(gong)))
          }
          if (datas[i].低压 < that.xueyd.di) {
            gong.current = datas[i].低压
            gong.consult = that.xueyd.di
            gong.ioc = 'icon-di'
            gong.className = 'dy'
            gong.type = '低压'
            listData.push(JSON.parse(JSON.stringify(gong)))
          }
          if (datas[i].低压 > that.xueyd.ga) {
            gong.current = datas[i].低压
            gong.consult = that.xueyd.ga
            gong.ioc = 'icon-gao'
            gong.className = 'dy'
            gong.type = '低压'
            listData.push(JSON.parse(JSON.stringify(gong)))
          }
        }
        that.listData = listData
      })
    })
    // 今日时间
    that.timx = that.checkTime2(new Date())
    // 切换时间是否展示
    if ((new Date((new Date(this.timx)).getTime() + 24 * 60 * 60 * 1000)) < (new Date()).getTime()) {
      document.querySelectorAll('.fTime .img')[1].style.zIndex = 0
      document.querySelectorAll('.fTime .img')[1].style.opacity = 1
    } else {
      document.querySelectorAll('.fTime .img')[1].style.zIndex = -10
      document.querySelectorAll('.fTime .img')[1].style.opacity = 0
    }
  },
  methods: {
    // 暂停与播放
    stop() {
      var that = this
      if (that.start === '暂停滚动') {
        that.start = '开始滚动'
        that.step = 0
      } else {
        that.start = '暂停滚动'
        that.step = 1
      }
    },
    // 详情
    handleClick(event) {
      var that = this
      for (let i = 0; i < event.path.length; i++) {
        if (event.path[i].classList !== undefined) {
          if (event.path[i].classList.length === 2) {
            if (event.path[i].classList.item(0) === 'neirong' && event.path[i].classList.item(1) === 'tw' || event.path[i].classList.item(1) === 'gy' || event.path[i].classList.item(1) === 'dy' || event.path[i].classList.item(1) === 'xl') {
              that.id = event.path[i].dataset.dept
              that.name = event.path[i].dataset.deps
              that.PDetails()
            }
          }
        }
      }
    },
    // 个人详情
    PDetails() {
      var that = this
      var data = {}
      data.ID = that.id
      data.timz = that.checkTime3((new Date(that.timx)))
      data.timx = that.checkTime3(new Date((new Date(that.timx)).getTime() + 24 * 60 * 60 * 1000))
      that.$store.dispatch('ncity/QQuery', data).then((datas) => {
        datas.sort(function(a, b) {
          a.时间 - b.时间
        })
        var data = [[], [], [], [], []]
        for (let i = 0; i < datas.length; i++) {
          data[0].push(that.checkTime2(new Date(datas[i].时间)))
          data[1].push(datas[i].体温)
          data[2].push(datas[i].高压)
          data[3].push(datas[i].低压)
          data[4].push(datas[i].心率)
        }
        document.getElementsByClassName('pupup')[0].style.display = 'block'
        that.CAdestroy()
        that.initCharts(data)
      })
    },
    // echarts图表
    initCharts(data) {
      this.myChart = echarts.init(document.getElementById('histor'))
      const option = {
        tooltip: {
          trigger: 'axis',
          textStyle: {
            align: 'left'
          },
          showDelay: 20,
          confine: true
        },
        legend: {
          data: ['体温', '高压', '低压', '心率'],
          textStyle: {
            color: 'rgba(219, 219, 219, 1)'
          }
        },
        grid: {
          top: '10%',
          left: '5%',
          right: '10%',
          bottom: '12%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: data[0],
          axisLabel: {
            color: 'rgba(201, 201, 201)'
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: 'rgba(201, 201, 201)'
          },
          scale: true
        },
        dataZoom: [
          {
            type: 'slider',
            show: true,
            height: 20,
            start: 80,
            end: 100,
            bottom: '5%',
            xAxisIndex: 0,
            showDetail: false
          },
          {
            type: 'inside',
            show: true,
            height: 25,
            bottom: '5%',
            yAxisIndex: 0,
            zoomOnMouseWheel: true
          }
        ],
        series: [
          {
            name: '体温',
            type: 'line',
            smooth: true,
            data: data[1]
          },
          {
            name: '高压',
            type: 'line',
            smooth: true,
            data: data[2]
          },
          {
            name: '低压',
            type: 'line',
            smooth: true,
            data: data[3]
          },
          {
            name: '心率',
            type: 'line',
            smooth: true,
            data: data[4]
          }
        ]
      }
      this.myChart.setOption(option)
    },
    // 创建与销毁盒子
    CAdestroy() {
      if (this.myChart !== null) {
        this.myChart.clear()
        this.myChart.dispose()
      }
    },
    // 关闭个人历史
    close() {
      this.CAdestroy()
      document.getElementsByClassName('pupup')[0].style.display = 'none'
    },
    // 选择时间时触发
    STime() {
      if (this.json.name === '') {
        this.$message({
          message: '请选择城市！',
          type: 'warning',
          showClose: true
        })
        this.timx = this.checkTime2(new Date())
      } else {
        if ((new Date((new Date(this.timx)).getTime() + 24 * 60 * 60 * 1000)) < (new Date()).getTime()) {
          document.querySelectorAll('.fTime .img')[1].style.zIndex = 0
          document.querySelectorAll('.fTime .img')[1].style.opacity = 1
        } else {
          document.querySelectorAll('.fTime .img')[1].style.zIndex = -10
          document.querySelectorAll('.fTime .img')[1].style.opacity = 0
        }
        // 请求数据
        this.PDetails()
      }
    },
    // 减少时间
    ReduceTime() {
      if (this.json.name === '') {
        this.$message({
          message: '请选择城市！',
          type: 'warning',
          showClose: true
        })
      } else {
        this.timx = this.checkTime2(new Date((new Date(this.timx)).getTime() - 24 * 60 * 60 * 1000))
        document.querySelectorAll('.fTime .img')[1].style.zIndex = 0
        document.querySelectorAll('.fTime .img')[1].style.opacity = 1
        // 请求数据
        this.PDetails()
      }
    },
    // 增加时间
    IncreaseTime() {
      if (this.json.name === '') {
        this.$message({
          message: '请选择城市！',
          type: 'warning',
          showClose: true
        })
      } else {
        this.timx = this.checkTime2(new Date((new Date(this.timx)).getTime() + 24 * 60 * 60 * 1000))
        if ((new Date((new Date(this.timx)).getTime() + 24 * 60 * 60 * 1000)) < (new Date()).getTime()) {
          document.querySelectorAll('.fTime .img')[1].style.zIndex = 0
          document.querySelectorAll('.fTime .img')[1].style.opacity = 1
        } else {
          document.querySelectorAll('.fTime .img')[1].style.zIndex = -10
          document.querySelectorAll('.fTime .img')[1].style.opacity = 0
        }
        // 请求数据
        this.PDetails()
      }
    },
    // 时间处理
    checkTime(i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
    },
    // 时间处理2
    checkTime2(i) {
      var that = this
      return i.getFullYear() + '-' + that.checkTime(i.getMonth() + 1) + '-' + that.checkTime(i.getDate()) + ' ' + that.checkTime(i.getHours()) + ':' + that.checkTime(i.getMinutes())
    },
    // 时间处理3
    checkTime3(i) {
      var that = this
      return i.getFullYear() + '-' + that.checkTime(i.getMonth() + 1) + '-' + that.checkTime(i.getDate()) + ' ' + '00' + ':' + '00'
    },
    // 时间处理4
    checkTime4(i) {
      var that = this
      return i.getFullYear() + '-' + that.checkTime(i.getMonth() + 1) + '-' + that.checkTime(i.getDate()) + ' ' + that.checkTime(i.getHours()) + ':' + that.checkTime(i.getMinutes()) + ':' + that.checkTime(i.getSeconds())
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
  src: url("../public/font/DS-DIGIT.ttf");
  font-family: "DIGIT";
}
#rollindex {
  position: absolute;
  top: 5px;
  right: 0;
  width: 305px;
  height: calc(100% - 10px);
  z-index: 10;
  /* border: 1px solid #0fafeb; */
  /* background: url("../public/img/bg.png") rgba(255, 255, 255, 0.1); */
  background: url("../public/img/bg.png") rgba(79, 133, 177, 0.3);
}
#rollindex ul,
#rollindex p {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
/* 附带 */
#rollindex .top .tw {
  background-color: rgba(244, 151, 142, 0.2);
}
#rollindex .top .gy {
  background-color: rgba(255, 192, 159, 0.2);
}
#rollindex .top .dy {
  background-color: rgba(244, 172, 183, 0.2);
}
#rollindex .top .xl {
  background-color: #0fafeb;
}
/* 头部 */
#rollindex .top {
  position: absolute;
  top: 0;
  height: calc(100% - 35px);
  width: calc(100% - 5px);
  overflow: hidden;
  left: 50%;
  transform: translateX(-50%);
  padding-top: 5px;
  background-image: url("../public/img/bn.png");
  background-size: 100% 100%;
}
#rollindex .top li {
  height: 110px;
}
#rollindex .top .neirong {
  height: 100px;
  margin-bottom: 10px;
  width: calc(100%);
  /* border: 1px solid rgb(200, 200, 200, 0.6); */
  position: relative;
  display: inline-block;
  border-style: dashed;
  text-align: center;
  color: rgb(163, 163, 163);
  font-family: KuHei;
}
#rollindex .top .neirong .left {
  position: absolute;
  left: 5px;
  top: 5px;
  height: 90px;
  width: calc(30%);
}
#rollindex .top .neirong .left .LTop {
  height: 60px;
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
}
#rollindex .top .neirong .left .LTop >>> .el-avatar--large {
  width: 50px;
  height: 50px;
}
#rollindex .top .neirong .left .LTop >>> .el-avatar>img {
  width: 50px;
  height: 50px;
  display: inline-flex !important;
}
#rollindex .top .neirong .left .LBootom {
  height: 30px;
  line-height: 30px;
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
}
#rollindex .top .neirong .right {
  position: absolute;
  right: 5px;
  top: 5px;
  height: 90px;
  width: calc(70% - 15px);
}
#rollindex .top .neirong .right p {
  height: calc(100% / 3);
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
}
#rollindex .top .neirong .right p:nth-child(1) {
  font-size: 14px;
}
#rollindex .top .neirong .right p:nth-child(1) span:nth-child(1) {
  font-size: 18px;
  font-family: DIGIT;
  margin-top: 2px;
}
#rollindex .top .neirong .right p:nth-child(1) span:nth-child(2) {
  font-size: 14px;
  margin-left: 10px;
  transition: all 1s;
  cursor: pointer;
}
#rollindex .top .neirong .right p:nth-child(1) span:nth-child(2):hover {
  color: #fff;
}
#rollindex .top .neirong .right p:nth-child(2) {
  color: #fff;
  font-size: 13px;
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
}
#rollindex .top .neirong .right p:nth-child(2) span {
  margin: 0 6px;
}
#rollindex .top .neirong .right p:nth-child(3) {
  font-size: 13px;
}
/* 底部 */
#rollindex .bottom {
  position: absolute;
  border-top: 2px solid rgba(219, 219, 219, 0.555);
  width: 100%;
  height: 35px;
  line-height: 35px;
  bottom: 0px;
  text-align: center;
  color: rgb(201, 201, 201);
  font-family: KuHei;
  cursor: pointer;
  transition: all 0.5s;
  letter-spacing: 2px;
}
#rollindex .bottom:hover {
  color: rgb(235, 235, 235);
}
/* 修饰 */
#rollindex::after {
  position: absolute;
  content: "";
  bottom: -1px;
  right: -1px;
  height: 10px;
  width: 10px;
  /* border-bottom: 2px solid #02a6b5;
  border-right: 2px solid #02a6b5; */
  transition: all 1.5s;
  z-index: 0;
}
#rollindex::before {
  position: absolute;
  content: "";
  top: -2px;
  left: -2px;
  height: 10px;
  width: 10px;
  /* border-top: 2px solid #02a6b5;
  border-left: 2px solid #02a6b5;
  transition: all 1.5s; */
  z-index: 0;
}
/* 弹窗 */
#rollindex .pupup {
  display: none;
  position: fixed;
  width: 550px;
  height: 400px;
  z-index: 20;
  /* border: 1px solid rgba(25, 186, 139, 0.2); */
  background-color: rgb(21 62 109);
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 3px;
}
#rollindex .pupup .PTop {
  height: 50px;
  line-height: 50px;
  border-bottom: 2px solid rgba(219, 219, 219, 0.555);
  color: rgb(201, 201, 201);
  font-family: KuHei;
  font-size: 14px;
}
#rollindex .pupup .PTop .fTime {
  position: absolute;
  width: 250px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
}
#rollindex .pupup .PTop .fTime >>> .el-input__prefix,
#rollindex .pupup .PTop .fTime >>> .el-input__suffix {
  display: none;
}
#rollindex .pupup .PTop .fTime >>> .el-input__inner {
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
#rollindex .pupup .PTop .fTime >>> .el-date-editor.el-input,
#rollindex .pupup .PTop .fTime >>> .el-date-editor.el-input__inner {
  width: 140px;
}
#rollindex .pupup .PTop .fTime .img {
  margin: 0 15px;
  height: 45px;
  line-height: 45px;
  cursor: pointer;
  color: rgb(199, 199, 199);
  transition: all 0.5s;
}
#rollindex .pupup .PTop .fTime .img:hover {
  color: #fff;
}
#rollindex .pupup .PBottom {
  height: 350px;
  width: 100%;
}
#rollindex .pupup .PTop .other {
  position: absolute;
  width: calc(100% - 250px);
  right: 0;
  height: 50px;
  line-height: 50px;
  text-align: center;
  justify-content: flex-start;
  align-items: center;
  display: flex;
}
#rollindex .pupup .PTop .other span {
  margin: 0 10px;
}
#rollindex .pupup .PTop .other span:nth-child(3) {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(calc(-50% + 2px));
}
#rollindex .pupup .PTop .other span:nth-child(3) >>> i {
  transform: 2s;
  font-size: 20px;
  transition: all 1.5s;
  color: rgba(255, 255, 255, 0.65);
  cursor: pointer !important;
}
#rollindex .pupup .PTop .other span:nth-child(3) >>> i:hover {
  color: rgba(255, 255, 255, 1);
  transform: rotate(360deg);
}
</style>
