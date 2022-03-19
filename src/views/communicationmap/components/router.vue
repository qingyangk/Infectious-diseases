<template>
  <div id="router">
    <ul>
      <li>
        <el-tooltip class="item" effect="dark" content="密接查询" placement="right-end">
          <el-link :underline="false" href="/#/communicationmap/index">
            <span class="imgz"><icon-svg icon-class="icon-jiechu" /></span>
          </el-link>
        </el-tooltip>
      </li>
      <li>
        <el-tooltip class="item" effect="dark" content="传播演示" placement="right-end">
          <el-link :underline="false" href="/#/communicationmap/graphMovie">
            <span class="imgz"><icon-svg icon-class="icon-wangluochuanbo" /></span>
          </el-link>
        </el-tooltip>
      </li>
      <li>
        <el-tooltip class="item" effect="dark" content="地域风险" placement="right-end">
          <el-link :underline="false" href="/#/communicationmap/riskRegion">
            <span class="imgz"><icon-svg icon-class="icon-a1" /></span>
          </el-link>
        </el-tooltip>
      </li>
      <li>
        <el-tooltip class="item" effect="dark" content="出行风险" placement="right-end">
          <el-link :underline="false" href="/#/communicationmap/riskTravel">
            <span class="imgz"><icon-svg icon-class="icon-chuhang" /></span>
          </el-link>
        </el-tooltip>
      </li>
      <li>
        <el-tooltip class="item" effect="dark" content="气象模拟" placement="right-end">
          <el-link :underline="false" href="/#/communicationmap/meteorological">
            <span class="imgz"><icon-svg icon-class="icon-fengxiang" /></span>
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
      var children = routers[7].children
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
