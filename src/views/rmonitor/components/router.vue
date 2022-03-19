<template>
  <div id="router">
    <ul>
      <li>
        <el-tooltip class="item" effect="dark" content="手环监测" placement="right-end">
          <el-link :underline="false" href="/#/rmonitor/index">
            <span class="imgz"><icon-svg icon-class="icon-shouhuan" /></span>
          </el-link>
        </el-tooltip>
      </li>
      <li>
        <el-tooltip class="item" effect="dark" content="健康打卡" placement="right-end">
          <el-link :underline="false" href="/#/rmonitor/potential">
            <span class="imgz"><icon-svg icon-class="icon-qianzairenqun" /></span>
          </el-link>
        </el-tooltip>
      </li>
      <li>
        <el-tooltip class="item" effect="dark" content="信令监测" placement="right-end">
          <el-link :underline="false" href="/#/rmonitor/signalling">
            <span class="imgz"><icon-svg icon-class="icon-xinling" /></span>
          </el-link>
        </el-tooltip>
      </li>
      <li>
        <el-tooltip class="item" effect="dark" content="关口监测" placement="right-end">
          <el-link :underline="false" href="/#/rmonitor/pass">
            <span class="imgz"><icon-svg icon-class="icon-guankou" /></span>
          </el-link>
        </el-tooltip>
      </li>
      <li>
        <el-tooltip class="item" effect="dark" content="行程监测" placement="right-end">
          <el-link :underline="false" href="/#/rmonitor/trip">
            <span class="imgz"><icon-svg icon-class="icon-xingcheng" /></span>
          </el-link>
        </el-tooltip>
      </li>
      <li>
        <el-tooltip class="item" effect="dark" content="气象监测" placement="right-end">
          <el-link :underline="false" href="/#/rmonitor/meteorological">
            <span class="imgz"><icon-svg icon-class="icon-qixiang" /></span>
          </el-link>
        </el-tooltip>
      </li>
      <li>
        <el-tooltip class="item" effect="dark" content="疫苗接种监测" placement="right-end">
          <el-link :underline="false" href="/#/rmonitor/vaccines">
            <span class="imgz"><icon-svg icon-class="icon-mulutubiaoqietu_yimiaochaxun" /></span>
          </el-link>
        </el-tooltip>
      </li>
      <!-- <li>
        <el-tooltip class="item" effect="dark" content="虫媒监测" placement="right-end">
          <el-link :underline="false" href="/#/rmonitor/mosquito">
            <span class="imgz"><icon-svg icon-class="icon-chongqingshibie" /></span>
          </el-link>
        </el-tooltip>
      </li> -->
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
      var children = routers[3].children
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
