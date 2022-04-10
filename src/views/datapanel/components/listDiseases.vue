<template>
  <div v-if="x === 1" id="listDiseases">
    <!-- 病类选择 -->
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="(value, index) in json" :key="index" :label="value.name" :name="value.name">
        <ul>
          <li v-for="(valuz, indez) in value.value" :key="indez" :class="name == valuz.name ? 'xuan' : ''" class="Lpublic" @click="gatName(valuz.table, valuz.id)">{{ valuz.name }}</li>
        </ul>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import eventBus from './public/js/EvebtBus'

export default {
  name: 'ListDiseases',
  data() {
    return {
      activeName: '乙类',
      name: '',
      json: [],
      x: 0
    }
  },
  beforeDestroy() {
    eventBus.$off('listtype')
    eventBus.$off('maptypc')
    eventBus.$off('maptypx')
  },
  mounted() {
    var that = this
    // 接收一个疾病类型
    eventBus.$on('listtype', (listtype) => {
      that.name = listtype
      that.get()
    })
    // 疾病面板点击时-获取疾病名称
    eventBus.$on('maptypc', (maptypc) => {
      that.name = maptypc
    })
    // 疾病面板点击时-获取疾病名称
    eventBus.$on('maptypx', (maptypx) => {
      that.name = maptypx
    })
  },
  methods: {
    get() {
      var that = this
      that.$store.dispatch('ndatapanel/QDiseaseJson').then((datas) => {
        that.json = []
        var a = { name: '甲类', value: [] }
        var b = { name: '乙类', value: [] }
        var c = { name: '丙类', value: [] }
        var d = { name: '其他', value: [] }
        for (var i = 0; i < datas.length; i++) {
          var gong = {}
          if (datas[i].type === '1') {
            gong.id = datas[i].id
            gong.name = datas[i].name
            gong.table = datas[i].table
            a.value.push(gong)
          } else if (datas[i].type === '2') {
            gong.id = datas[i].id
            gong.name = datas[i].name
            gong.table = datas[i].table
            b.value.push(gong)
          } else if (datas[i].type === '3') {
            gong.id = datas[i].id
            gong.name = datas[i].name
            gong.table = datas[i].table
            c.value.push(gong)
          } else if (datas[i].type === '4') {
            gong.id = datas[i].id
            gong.name = datas[i].name
            gong.table = datas[i].table
            d.value.push(gong)
          }
        }
        that.json.push(a)
        that.json.push(b)
        that.json.push(c)
        that.json.push(d)
        that.x = 1
      }).catch(() => {
      })
    },
    // 传回一个疾病名称
    gatName(e, id) {
      if (e === '陕西手足口点') {
        this.name = '手足口病'
      } else {
        this.name = e
      }
      eventBus.$emit('maptype', this.name)
      this.$store.dispatch('ndatapanel/UDJson', id).then((datas) => {})
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
#listDiseases {
  padding: 5px;
  text-align: center;
  height: 100%;
  animation: fade-in;
  animation-duration: 1s;
  -webkit-animation: fade-in 1s;
}
#listDiseases .Lpublic {
  display: inline-block;
  vertical-align: top;
  color: rgb(249, 248, 248);
  margin: -8px 10px;
  margin-bottom: 10px;
  padding: 7.5px 10px;
  cursor: pointer;
  width: 190px;
  font-family: YaHei;
  border-radius: 5px;
  font-size: 13px;
  transition: all 1s;
}
#listDiseases .Lpublic:nth-child(2n) {
  margin-right: 4px;
}
#listDiseases .Lpublic:hover {
  color: #fff;
  background-color: #ff7979;
}
#listDiseases .xuan {
  color: #fff;
  background-color: #ff7979 !important;
}
</style>
// --------------------------------------- 分割线
<style scoped>
@font-face {
  src: url("./public/font/KuHei.ttf");
  font-family: "KuHei";
}
/* 头部 */
#listDiseases >>> .el-tabs__header {
  position: absolute;
  top: 5px;
  width: calc(100% - 10px);
  background-color: rgba(79, 133, 177, 0.3);
}
#listDiseases >>> .el-tabs__nav {
  width: 100%;
}
#listDiseases >>> .el-tabs__item {
  padding: 0;
  margin: 0;
  width: calc(100% / 4);
  font-family: KuHei;
  font-weight: bold;
  color: rgb(210, 210, 210);
}
/* 身体 */
#listDiseases >>> .el-tabs__content {
  position: absolute;
  top: 45px;
  height: calc(100% - 50px);
  width: calc(100% - 10px);
  overflow: auto;
  background-color: rgba(18, 18, 18, 0.2);
  padding-top: 10px;
}
/* 悬浮 */
#listDiseases >>> .el-tabs__item.is-active,
#listDiseases >>> .el-tabs__item:hover {
  color: #ff7979;
}
#listDiseases >>> .el-tabs__active-bar {
  background-color: #ff7979;
}
</style>
