<template>
  <div id="router">
    <ul>
      <li>
        <el-tooltip class="item" effect="dark" content="模拟预测" placement="right-end">
          <el-link :underline="false" href="/#/forecast/index">
            <span class="imgz"><icon-svg icon-class="icon-weiwangguanicon-defuben-" /></span>
          </el-link>
        </el-tooltip>
      </li>
      <li>
        <el-tooltip class="item" effect="dark" content="SEIR模拟" placement="right-end">
          <el-link :underline="false" href="/#/forecast/seir">
            <span class="imgz"><icon-svg icon-class="icon-xinguanfeiyan-miqiejiechuzhe" /></span>
          </el-link>
        </el-tooltip>
      </li>
      <li>
        <el-tooltip class="item" effect="dark" content="城市模拟" placement="right-end">
          <el-link :underline="false" href="/#/forecast/CForecast">
            <span class="imgz"><icon-svg icon-class="icon-miqiejiechuzhesuyuan" /></span>
          </el-link>
        </el-tooltip>
      </li>
      <li>
        <el-tooltip class="item" effect="dark" content="城市预测" placement="right-end">
          <el-link :underline="false" href="/#/forecast/arima">
            <span class="imgz"><icon-svg icon-class="icon-yucefuwu" /></span>
          </el-link>
        </el-tooltip>
      </li>
    </ul>
  </div>
</template>
<script>
import store from '@/store'
import { mapGetters } from 'vuex'

export default {
  name: 'Router',
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  mounted() {
    this.jihuo()
  },
  methods: {
    async jihuo() {
      // 获得全部路由
      var zu = []
      var routers = await store.dispatch('permission/generateRoutes', this.roles)
      var children = routers[6].children
      for (let i = 0; i < children.length; i++) {
        zu.push(children[i].path)
      }
      var path = this.$route.path
      path = path.slice(path.lastIndexOf('/') + 1)
      // 样式
      var imgzs = document.querySelectorAll('.imgz')
      for (var i = 0; i < imgzs.length; i++) {
        imgzs[i].classList.remove('xuan')
      }
      imgzs[zu.indexOf(path)].className = 'svg-icon imgz xuan'
    }
  }
}
</script>
<style scoped>
#router {
  position: absolute;
  width: 40px;
  text-align: center;
  height: calc(100%);
  background-color: rgb(31 65 120);
  top: 0;
  left: 0;
  z-index: 10;
}
#router .xuan {
  color: rgb(255, 121, 121) !important;
}
#router ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, calc(-50%));
}
#router ul li {
  margin: 30px 0;
}
#router ul li .imgz {
  font-size: 25px;
  color: rgba(255, 255, 255, 0.9);
  transition: all 0.5s;
}
#router ul li .imgz:hover {
  color: rgba(255, 255, 255, 0.9);
}
</style>
