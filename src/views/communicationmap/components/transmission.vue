<template>
  <div v-if="x === 1" id="transmission">
    <!-- 传播途径选择 -->
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="(value, index) in json" :key="index" :label="value.name" :name="value.name">
        <ul>
          <li v-for="(valuz, indez) in value.value" :key="indez" :class="name == valuz.name ? 'xuan' : ''" class="Lpublic" @click="gatName(valuz.table)">{{ valuz.name }}</li>
        </ul>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import eventBum from '../public/js/EvebtBus'

export default {
  name: 'Transmission',
  data() {
    return {
      activeName: '接触性',
      name: '',
      json: [],
      x: 0
    }
  },
  mounted() {
    var that = this
    that.get()
  },
  methods: {
    get() {
      var that = this
      that.$store.dispatch('ndatapanel/QDiseaseJson').then((datas) => {
        that.json = []
        var a = { name: '接触性', value: [] }
        var b = { name: '空气', value: [] }
        var c = { name: '水/食物', value: [] }
        var d = { name: '虫媒', value: [] }
        var e = { name: '其他', value: [] }
        for (var i = 0; i < datas.length; i++) {
          var gong = {}
          if (datas[i].typc === '1') {
            gong.name = datas[i].name
            gong.table = datas[i].table
            a.value.push(gong)
          } else if (datas[i].typc === '2') {
            gong.name = datas[i].name
            gong.table = datas[i].table
            b.value.push(gong)
          } else if (datas[i].typc === '3') {
            gong.name = datas[i].name
            gong.table = datas[i].table
            c.value.push(gong)
          } else if (datas[i].typc === '4') {
            gong.name = datas[i].name
            gong.table = datas[i].table
            d.value.push(gong)
          } else if (datas[i].typc === '5') {
            gong.name = datas[i].name
            gong.table = datas[i].table
            e.value.push(gong)
          }
        }
        that.json.push(a)
        that.json.push(b)
        that.json.push(c)
        that.json.push(d)
        that.json.push(e)
        that.x = 1
      }).catch(() => {
      })
    },
    // 传回一个疾病名称
    gatName(e) {
      if (e === '陕西手足口点') {
        this.name = '手足口病'
      } else {
        this.name = e
      }
      eventBum.$emit('typc', e)
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
@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
#transmission {
  padding: 5px;
  text-align: center;
  height: 100%;
  animation: fade-in;
  animation-duration: 1s;
  -webkit-animation: fade-in 1s;
}
#transmission ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
#transmission .Lpublic {
  display: inline-block;
  vertical-align: top;
  color: rgb(249, 248, 248);
  margin: -8px 10px;
  margin-bottom: 10px;
  padding: 7.5px 10px;
  cursor: pointer;
  width: 165px;
  font-family: YaHei;
  font-size: 13px;
  border-radius: 5px;
  transition: all 1s;
}
#transmission .Lpublic:nth-child(2n) {
  margin-right: 4px;
}
#transmission .Lpublic:hover {
  color: #fff;
  background-color: #ff7979;
}
#transmission .xuan {
  color: #fff;
  background-color: #ff7979 !important;
}
</style>
// --------------------------------------- 分割线
<style scoped>
@font-face {
  src: url("../public/font/KuHei.ttf");
  font-family: "KuHei";
}
/* 头部 */
#transmission >>> .el-tabs__header {
  position: absolute;
  top: 5px;
  width: calc(100% - 10px);
  background-color: rgba(79, 133, 177, 0.3);
}
#transmission >>> .el-tabs__nav {
  width: 100%;
}
#transmission >>> .el-tabs__item {
  padding: 0;
  margin: 0;
  width: calc(100% / 5);
  font-family: KuHei;
  font-weight: bold;
  font-size: 14px;
  color: rgb(210, 210, 210);
}
/* 身体 */
#transmission >>> .el-tabs__content {
  position: absolute;
  top: 45px;
  height: calc(100% - 50px);
  width: calc(100% - 10px);
  overflow: auto;
  background-color: rgba(18, 18, 18, 0.2);
  padding-top: 10px;
}
/* 悬浮 */
#transmission >>> .el-tabs__item.is-active,
#transmission >>> .el-tabs__item:hover {
  color: #ff7979;
}
#transmission >>> .el-tabs__active-bar {
  background-color: #ff7979;
}
</style>
