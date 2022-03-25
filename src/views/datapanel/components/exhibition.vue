<template>
  <div id="exhibition">
    <!-- 数据展示 -->
    <ul class="Upublic">
      <li v-for="(value, index) in json" :key="index" class="publiv">
        <div v-if="value.id === 0">
          <div :class="value.class" />
          <div class="ecenter">
            <p class="select" @click="get(value.name)">{{ value.name }}</p>
            <p :class="value.clasz">{{ value.value }}</p>
          </div>
        </div>
        <div v-if="value.id === 1">
          <div :class="value.class" />
          <div class="ecenter">
            <p>
              <ul>
                <li>{{ value.name }}</li>
                <!-- <li><i :class="value.ico" /></li> -->
                <!-- <li style="font-family: DIGIT;font-size: 25px;">{{ value.valux }}</li> -->
              </ul>
            </p>
            <p :class="value.clasz">{{ value.value }}</p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import eventBus from './public/js/EvebtBus'

export default {
  name: 'Exhibition',
  data() {
    return {
      json: [
        {
          id: 0,
          name: '发病数',
          value: '',
          class: 'mType',
          clasz: 'mTypez'
        },
        {
          id: 0,
          name: '死亡数',
          value: '',
          class: 'mQuantity',
          clasz: 'mQuantityz'
        },
        {
          id: 0,
          name: '发病率',
          value: '',
          class: 'mProbability',
          clasz: 'mProbabilityz'
        },
        {
          id: 0,
          name: '死亡率',
          value: '',
          class: 'dProbability',
          clasz: 'dProbabilityz'
        },
        {
          id: 1,
          name: '上周发病',
          value: '',
          class: 'yQuantity',
          clasz: 'yQuantityz',
          ico: '',
          valux: ''
        },
        {
          id: 1,
          name: '昨日发病',
          value: '',
          class: 'rQuantity',
          clasz: 'rQuantityz',
          ico: '',
          valux: ''
        }

      ],
      data: {
        name: '', // 地名
        type: '流行疾病', // 疾病名称
        where: 0, // 范围层级
        time: '', // 时间
        timec: 0 // 分年和分月 ALL为全部 0 4 7 substring(convert(varchar(30), time, 120), 1, *) x为传回数据库的*
      }
    }
  },
  beforeDestroy() {
    eventBus.$off('type')
    eventBus.$off('maptype')
    eventBus.$off('maptypc')
    eventBus.$off('maptypx')
    eventBus.$off('times')
  },
  mounted() {
    var that = this
    eventBus.$on('type', (type) => {
      that.data.name = type.name
      that.data.type = type.type
      that.data.where = type.where
      that.getData()
      that.weekC()
      that.dayC()
    })
    // 获取疾病名称
    eventBus.$on('maptype', (maptype) => {
      that.data.type = maptype
      that.getData()
      that.weekC()
      that.dayC()
    })
    eventBus.$on('maptypc', (maptypc) => {
      that.data.type = maptypc
      that.getData()
      that.weekC()
      that.dayC()
    })
    eventBus.$on('maptypx', (maptypx) => {
      that.data.type = maptypx
      that.getData()
      that.weekC()
      that.dayC()
    })
    // 获取查询时间
    eventBus.$on('times', (times) => {
      that.data.time = times.time
      that.data.timec = times.x
      that.getData()
      that.weekC()
      that.dayC()
    })
    // 选择样式
    var selects = document.querySelectorAll('.select')
    selects[0].className = selects[0].className + ' ' + 'yang'
    for (let i = 0; i < selects.length; i++) {
      selects[i].setAttribute('index', i)
      selects[i].addEventListener('click', function() {
        for (var j = 0; j < selects.length; j++) {
          selects[j].classList.remove('yang')
        }
        that.index = this.getAttribute('index') * 1
        this.className = this.className + ' ' + 'yang'
      })
    }
  },
  methods: {
    // 切换中间地图展示
    get(data) {
      eventBus.$emit('dataType', data)
    },
    getData() {
      var that = this
      that.$store.dispatch('ndatapanel/QDataJson', that.data).then((dataz) => {
        that.json[0].value = that.format(dataz[0].发病数)
        that.json[1].value = that.format(dataz[0].死亡数)
        that.json[2].value = String((dataz[0].发病率 / 10).toFixed(2)).replace(/^(.*\..{6}).*$/, '$1') + ' ‱'
        that.json[3].value = String((dataz[0].死亡率 / 10).toFixed(2)).replace(/^(.*\..{6}).*$/, '$1') + ' ‱'
      }).catch(() => {
      })
    },
    // 周对比
    weekC() {
      var that = this
      var timx = new Date()
      timx = this.checkTime3(timx) // 现在时间
      var tims = this.checkTime3(new Date(new Date(timx) - 24 * 60 * 60 * 1000 * 7)) // 上周时间
      var timq = this.checkTime3(new Date(new Date(timx) - 24 * 60 * 60 * 1000 * 14)) // 前周时间
      // 本周数据
      var datab = {}
      datab.where = that.data.where
      datab.name = that.data.name
      datab.type = that.data.type
      datab.timx = timx
      datab.timz = tims
      that.$store.dispatch('ndatapanel/QWComparison', datab).then((datax) => {
        // 上周数据
        var datab = {}
        datab.where = that.data.where
        datab.name = that.data.name
        datab.type = that.data.type
        datab.timx = tims
        datab.timz = timq
        that.$store.dispatch('ndatapanel/QWComparison', datab).then((dataz) => {
          that.json[4].value = that.format(Math.abs(datax[0].发病数))
          that.json[4].valux = that.format(Math.abs(datax[0].发病数 - dataz[0].发病数))
          if (datax[0].发病数 - dataz[0].发病数 < 0) {
            that.json[4].ico = 'el-icon-caret-bottom'
          } else {
            that.json[4].ico = 'el-icon-caret-top'
          }
        })
      })
    },
    // 日对比
    dayC() {
      var that = this
      var timx = new Date()
      timx = this.checkTime3(timx) // 现在时间
      var tims = this.checkTime3(new Date(new Date(timx) - 24 * 60 * 60 * 1000 * 2)) // 前天时间
      var datab = {}
      datab.where = that.data.where
      datab.name = that.data.name
      datab.type = that.data.type
      datab.timx = timx
      datab.timz = tims
      that.$store.dispatch('ndatapanel/QDComparison', datab).then((datax) => {
        that.json[5].value = that.format(Math.abs(datax[0].发病数))
        that.json[5].valux = that.format(Math.abs(datax[0].发病数 - datax[1].发病数))
        if (datax[0].发病数 - datax[1].发病数 < 0) {
          that.json[5].ico = 'el-icon-caret-bottom'
        } else {
          that.json[5].ico = 'el-icon-caret-top'
        }
      })
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
    }
  }
}
</script>
<style scoped>
@font-face {
  src: url("./public/font/DS-DIGIT.ttf");
  font-family: "DIGIT";
}
@font-face {
  src: url("./public/font/Microsoft-YaHei.ttf");
  font-family: "YaHei";
}
#exhibition .Upublic {
  position: absolute;
  width: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
/* 展示 */
#exhibition .publiv {
  display: inline-block;
  vertical-align: top;
  width: calc((100% - 50px) / 2);
  height: 80px;
  margin: 0 12.5px 15px 12.5px;
  text-align: center;
  background: url("../components/public/img/bg1.png") no-repeat;
  /* no-repeat center center; */
  background-size: 81% 100%;
  background-position-x: 60%;
  /* border: 1px solid rgba(180, 180, 180, 0.5); */
  color: #ffff;
  font-size: 17px;
  font-weight: bold;
}

#exhibition .ecenter {
  height: 77px;
}
#exhibition .ecenter p:nth-child(1) {
  margin: 0;
  padding: 0;
  font-family: YaHei;
  margin: 5px 0 !important;
  height: 25px;
  line-height: 25px;
  cursor: pointer;
  transition: all 0.5s;
}
#exhibition .ecenter p:nth-child(1):hover {
  color: rgb(61, 121, 250);
}
#exhibition .ecenter p:nth-child(2) {
  height: 37px;
  line-height: 37px;
  font-family: DIGIT;
  margin: 5px 0 !important;
  font-size: 28px;
}
/* 另外一种情况 */
#exhibition .ecenter li {
  /* display: inline-block; */
  vertical-align: top;
}
#exhibition .ecenter li:nth-child(2) {
  margin: 0 10px;
}
#exhibition .publiv:nth-child(5),
#exhibition .publiv:nth-child(6) {
  margin-bottom: 0;
}
/* 样式 */
#exhibition .publiv .mType {
  /* background-color: rgb(194, 196, 89); */
  width: 100%;
  height: 8px;
}
.mType .mProbability .mQuantity .dProbability .yQuantity{
  background-image: url("../components/public/img/bn.png");
  background-size: 100% 100%;
}
#exhibition .publiv .mQuantity {
  /* background-color: #ec5c19ee; */
  width: 100%;
  height: 8px;
}
#exhibition .publiv .mProbability {
  /* background-color: rgb(253, 141, 0); */
  width: 100%;
  height: 8px;
}
#exhibition .publiv .dProbability {
  /* background-color: #ff7979; */
  width: 100%;
  height: 8px;
}
#exhibition .publiv .yQuantity {
  /* background-color: rgb(228, 193, 249); */
  width: 100%;
  height: 8px;
}
#exhibition .publiv .rQuantity {
  /* background-color: rgba(17, 173, 224, 0.829); */
  width: 100%;
  height: 8px;
}
#exhibition .publiv .mTypez {
  /* color: rgb(194, 196, 89); */
  color: rgb(180, 180, 180);
  width: 100%;
  height: 8px;
}
#exhibition .publiv .mQuantityz {
  /* color: #ec5c19ee; */
  color: rgb(180, 180, 180);
  width: 100%;
  height: 8px;
}
#exhibition .publiv .mProbabilityz {
  /* color: rgb(253, 141, 0); */
  color: rgb(180, 180, 180);
  width: 100%;
  height: 8px;
}
#exhibition .publiv .dProbabilityz {
  /* color: #ff7979; */
  color: rgb(180, 180, 180);
  width: 100%;
  height: 8px;
}
#exhibition .publiv .yQuantityz {
  /* color: rgb(228, 193, 249); */
  color: rgb(180, 180, 180);
  width: 100%;
  height: 8px;
}
#exhibition .publiv .rQuantityz {
  /* color: rgb(0, 187, 249); */
  color: rgb(180, 180, 180);
  width: 100%;
  height: 8px;
}
/* 时间 */
#exhibition .time {
  width: 100%;
  padding: 0;
  text-align: center;
}
#exhibition .time .timeLi {
  display: inline-block;
  vertical-align: top;
  width: calc((100% - 50px) / 2);
  margin: 0 12.5px 0 12.5px;
}
/* 选中样式 */
@keyframes fade-in1 {
  0% {
    right: 20%;
  }
  50% {
    right: 25%;
  }
  100% {
    right: 20%;
  }
}
@keyframes fade-in2 {
  0% {
    left: 20%;
  }
  50% {
    left: 25%;
  }
  100% {
    left: 20%;
  }
}
#exhibition .yang {
  position: relative;
  color: #ff7979;
}
#exhibition .yang::before {
  position: absolute;
  content: '▶';
  width: 20px;
  height: 20px;
  color: #ff7979;
  left: 25%;
  top: 50%;
  transform: translateY(calc(50% - 24px));
  animation: fade-in2 1.5s linear infinite; /* 调用动画 */
}
#exhibition .yang::after {
  position: absolute;
  content: '◀';
  width: 20px;
  height: 20px;
  color: #ff7979;
  right: 25%;
  top: 50%;
  transform: translateY(calc(50% - 24px));
  animation: fade-in1 1.5s linear infinite; /* 调用动画 */
}
</style>
<style>
#exhibition .el-input {
  width: 100%;
}
#exhibition .el-icon-caret-top {
  color: rgb(243, 13, 13);
}
#exhibition .el-icon-caret-bottom {
  color: #93e951;
}
</style>
