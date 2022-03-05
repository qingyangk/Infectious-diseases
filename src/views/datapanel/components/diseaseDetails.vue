<template>
  <div id="diseaseDetails">
    <!-- 进入详情/返回全部 -->
    <div class="details">
      <ul>
        <li @click="goLink()"><el-link :underline="false" :disabled="type == '流行疾病' ? true : false">进入 {{ type }} 详细界面</el-link></li>
        <li @click="returnAll()"><el-link :underline="false">返回全部</el-link></li>
      </ul>
    </div>
  </div>
</template>
<script>
import eventBus from './public/js/EvebtBus'

export default {
  name: 'DiseaseDetails',
  data() {
    return {
      name: '中国', // 区域名称
      type: '', // 疾病名称
      where: 0, // 尺度
      acute: [],
      normal: [],
      ceng: 0
    }
  },
  beforeDestroy() {
    eventBus.$off('listtype')
    eventBus.$off('maptype')
    eventBus.$off('maptypc')
    eventBus.$off('maptypx')
    eventBus.$off('itype')
    eventBus.$off('type')
  },
  mounted() {
    var that = this
    // 接收一个疾病类型
    eventBus.$on('listtype', (listtype) => {
      that.type = listtype
      that.get()
    })
    // 获取疾病名称
    eventBus.$on('maptype', (maptype) => {
      that.type = maptype
    })
    // 疾病面板点击时-获取疾病名称
    eventBus.$on('maptypc', (maptypc) => {
      that.type = maptypc
    })
    // 疾病面板点击时-获取疾病名称
    eventBus.$on('maptypx', (maptypx) => {
      that.type = maptypx
    })
    // 从主页切换过来时-获取疾病名称
    eventBus.$on('itype', (itype) => {
      that.type = itype
      that.get()
    })
    eventBus.$on('type', (type) => {
      that.name = type.name
      that.type = type.type
      that.where = type.where
      that.get()
    })
  },
  methods: {
    // 加载数据
    get() {
      var that = this
      that.$store.dispatch('ndatapanel/QDiseaseJson').then((datas) => {
        that.acute = []
        that.normal = []
        for (var i = 0; i < datas.length; i++) {
          const gong = {}
          if (datas[i].acute !== '0') {
            gong.name = datas[i].name
            gong.table = datas[i].table
            that.acute.push(gong)
          } else {
            gong.name = datas[i].name
            gong.table = datas[i].table
            that.normal.push(gong)
          }
        }
      }).catch(() => {
      })
    },
    // 跳转
    goLink() {
      var that = this
      that.ceng = 0
      for (var i = 0; i < that.acute.length; i++) {
        if (that.acute[i].name === that.type) {
          that.ceng++
        }
      }
      // 判断是不是 新的急性传染病
      if (that.ceng !== 0) {
        for (var x = 0; x < that.acute.length; x++) {
          if (that.acute[x].name === that.type) {
            // 将表名传过去
            const json = { name: that.name, type: that.acute[x].table, where: that.where }
            that.$router.push({ path: '/datapanel/detailed', query: json })
          }
        }
      } else {
        for (var p = 0; p < that.normal.length; p++) {
          if (that.normal[p].name === that.type) {
            // 将表名传过去
            const json = { name: that.name, type: that.normal[p].name, table: that.normal[p].table, where: that.where }
            that.$router.push({ path: '/datapanel/detailed', query: json })
          }
        }
      }
    },
    returnAll() {
      eventBus.$emit('returnAll', '流行疾病')
    }
  }
}
</script>
<style scoped>
@font-face {
  src: url("./public/font/KuHei.ttf");
  font-family: "KuHei";
}
@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
#diseaseDetails {
  padding: 5px;
  animation: fade-in;
  animation-duration: 1s;
  -webkit-animation: fade-in 1s;
}
#diseaseDetails .details {
  position: absolute;
  width: calc(100% - 10px);
  height: 75px;
  background-color: rgba(18, 18, 18, 0.2);
  text-align: center;
  top: 50%;
  transform: translate(0, -50%);
}
#diseaseDetails .details ul {
  position: absolute;
  height: 100%;
  width: 100%;
}
#diseaseDetails .details li {
  display: inline-block;
  vertical-align: top;
  height: 100%;
  line-height: calc(75px);
  font-family: KuHei;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
  transition: all 0.5s;
}
#diseaseDetails .details li:hover {
  color: #ff7979;
}
#diseaseDetails .details li:nth-child(1) {
  width: auto;
  max-width: calc(70% - 40px);
}
#diseaseDetails .details li:nth-child(2) {
  width: calc(30% - 40px);
  margin-left: 55px;
}
#diseaseDetails >>> .el-link {
  font-family: KuHei;
  font-weight: bold;
  color: rgb(210, 210, 210);
  font-size: 14px;
}
#diseaseDetails >>> .el-link:hover {
  color: #ff7979;
}
#diseaseDetails >>> .el-link.is-disabled:hover {
  color: #fff;
}
</style>
