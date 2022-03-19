<template>
  <div :class="'navbar'+(roles == 'acute' ? ' xin' : '')">
    <!-- 非急性 -->
    <el-row v-if="roles == 'virus'" :gutter="10">
      <el-col :span="1">
        <div class="right-menu">
          <icon-svg icon-class="icon-tuichu" class="imgs" @click.native="logout" />
        </div>
      </el-col>
      <el-col :span="7">
        <div>
          <div class="lefts">
            <el-link class="harf activation" type="primary" :underline="false" href="/#/datapanel"><icon-svg icon-class="icon-shishijiance" class="img" /> 数据面板</el-link>
            <el-link class="harf" type="primary" :underline="false" href="/#/query/index"><icon-svg icon-class="icon-chaxun" class="img" /> 查询统计</el-link>
            <el-link class="harf" type="primary" :underline="false" href="/#/rmonitor/index"><icon-svg icon-class="icon-ziyuan143" class="img" /> 城市监测</el-link>
            <el-link class="harf" type="primary" :underline="false" href="/#/map/index"><icon-svg icon-class="icon-iconditubianji" class="img" /> 专题地图</el-link>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="contents">
          <!-- <p>疾病流行多维可视化引擎系统</p> -->
          <p>传染疾病精准防控与智能分析系统</p>
        </div>
      </el-col>
      <el-col :span="7">
        <div>
          <div class="rights">
            <el-link class="harf" type="primary" :underline="false" href="/#/spacetime/index"><icon-svg icon-class="icon-shikong-kongjian" class="img" /> 时空分析</el-link>
            <el-link class="harf" type="primary" :underline="false" href="/#/forecast/index"><icon-svg icon-class="icon-weiwangguanicon-defuben-" class="img" /> 模拟预测</el-link>
            <el-link class="harf" type="primary" :underline="false" href="/#/communicationmap/index"><icon-svg icon-class="icon-tupushujuyuan" class="img" /> 传播调查</el-link>
            <el-link class="harf" type="primary" :underline="false" href="/#/sentiment/index"><icon-svg icon-class="icon-yuqingjiankong" class="img" /> 舆情分析</el-link>
            <!-- <el-link class="harf" type="primary" :underline="false" href="/#/datamanag/index"><icon-svg icon-class="icon-ziyuan143" class="img" /> 系统管理</el-link> -->
          </div>
        </div>
      </el-col>
      <el-col :span="1">
        <div>
          <el-link class="harf users" :underline="false" href="/#/datamanag/index"><icon-svg icon-class="icon-yonghu" /></el-link>
        </div>
        <div class="right-menu">
          <template>
            <screenfull id="screenfull" class="right-menu-item hover-effect" />
          </template>
        </div>
      </el-col>
    </el-row>
    <!-- 急性 -->
    <el-row v-if="roles == 'acute'" :gutter="10">
      <el-col :span="1">
        <div class="right-menu">
          <icon-svg icon-class="icon-tuichu" class="imgs" @click.native="logout" />
        </div>
      </el-col>
      <el-col :span="7">
        <div>
          <div class="lefts">
            <el-link class="harf activation" type="primary" :underline="false" href="/#/datapanel"><icon-svg icon-class="icon-shishijiance" class="img" /> 美国战疫</el-link>
            <el-link class="harf" type="primary" :underline="false" href="/#/monitor/index"><icon-svg icon-class="icon-chaxun" class="img" /> 多维监测</el-link>
            <el-link class="harf" type="primary" :underline="false" href="/#/city/index"><icon-svg icon-class="icon-iconditubianji" class="img" /> 城市查询</el-link>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="contents">
          <h2>突发急性传染病多尺度智能监测预警系统</h2>
          <!-- <h2>新冠疫情多尺度智能监测预警系统</h2> -->
        </div>
      </el-col>
      <el-col :span="7">
        <div>
          <div class="rights">
            <el-link class="harf" type="primary" :underline="false" href="/#/publicsentiment/index"><icon-svg icon-class="icon-weiwangguanicon-defuben-" class="img" /> 舆情分析</el-link>
            <el-link class="harf" type="primary" :underline="false" href="/#/diffusion/index"><icon-svg icon-class="icon-tupushujuyuan" class="img" /> 扩散预警</el-link>
            <el-link class="harf" type="primary" :underline="false" href="/#/datamanaganalysis/index"><icon-svg icon-class="icon-yuqingjiankong" class="img" /> 时空分析</el-link>
          </div>
        </div>
      </el-col>
      <el-col :span="1">
        <div class="right-menu">
          <template>
            <screenfull id="screenfull" class="right-menu-item hover-effect" />
          </template>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Screenfull from '@/components/Screenfull'
import store from '@/store'

export default {
  name: 'Navbar',
  components: {
    Screenfull
  },
  data() {
    return {
      route: [],
      index: 0
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'power',
      'roles'
    ])
  },
  mounted() {
    var that = this
    // var harf = document.querySelectorAll('.harf')
    // for (var i = 0; i < harf.length; i++) {
    //   harf[i].setAttribute('index', i)
    //   harf[i].addEventListener('click', function() {
    //     for (var j = 0; j < harf.length; j++) {
    //       harf[j].classList.remove('activation')
    //     }
    //     that.index = that.getAttribute('index') * 1
    //     if (that.index < 8) {
    //       that.className = that.className + ' ' + 'activation'
    //     }
    //   })
    // }
    that.jihuo()
    // 前进后退
    window.addEventListener('popstate', function(e) {
      that.jihuo()
    })
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    async jihuo() {
      var that = this
      // 获得全部路由
      var routers = await store.dispatch('permission/generateRoutes', this.roles)
      that.route = []
      for (var i = 0; i < routers.length; i++) {
        if (routers[i].children !== undefined) {
          if (routers[i].children.length > 0) {
            if (routers[i].path.slice(1, routers[i].path.length) === '') {
              that.route.push('datapanel')
            } else {
              that.route.push(routers[i].path.slice(1, routers[i].path.length))
            }
          }
        }
      }
      // 当前页面路由
      var path = this.$route.path
      if (path === '/datapanel') {
        path = path.substr(1, path.length - 1)
      } else {
        path = path.slice(1, path.lastIndexOf('/'))
      }
      this.index = that.route.indexOf(path)
      // 当前激活
      var harf = document.querySelectorAll('.harf')
      for (var j = 0; j < harf.length; j++) {
        harf[j].classList.remove('activation')
      }
      if (this.index < 8) {
        harf[this.index].className = harf[this.index].className + ' ' + 'activation'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    margin-right: 10px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
<style scoped>
@font-face {
  src: url("./public/font/KuHei.ttf");
  font-family: "KuHei";
}

.user-dropdown {
  text-align: center;
}
.xin {
  background: url("./public/tops.png")  no-repeat center center !important;   /*加载背景图*/   /* 背景图不平铺 */
  background-size: cover !important;  /* 让背景图基于容器大小伸缩 */
  background-color: rgb(11, 18, 46) !important;   /* 设置背景颜色，背景图加载过程中会显示背景色 */
}
.navbar {
  position: relative;
  min-height: 100%;
  width: 100%;
  background: url("./public/tit.png")  no-repeat center center;   /*加载背景图*/   /* 背景图不平铺 */
  background-size: 55% 90%;  /* 让背景图基于容器大小伸缩 */
  background-position: 50% 90%;
  /* background-attachment: fixed;        当内容高度大于图片高度时，背景图像的位置相对于viewport固定 */
  background-color: rgb(21, 62, 109);  /* 设置背景颜色，背景图加载过程中会显示背景色 */
}
.navbar .harf {
  font-size: 15px;
  color: #ffffff;
}
.navbar .lefts {
  height: 50px;
  line-height: 52px;
  text-align: center;
  font-family: KuHei;
}
.navbar .contents {
  height: 50px;
  line-height: 50px;
  text-align: center;
  color: #fff;
  font-family: KuHei;
}
.navbar .contents p {
  margin: 0;
  padding: 0;
  text-shadow: -8px 2px 20px;
  position: relative;
  z-index: 3;
  font-family: KuHei;
  font-size: 22px;
  font-weight: bold;
}
.navbar .contents p::after {
  position: absolute;
  content: '';
  height: 100%;
  width: 85%;
  left: 50%;
  -webkit-transform: translate(-50%, 0);
  transform: translate(-50%, 0);
  z-index: -1;
  /* border-bottom: 50px solid red; */
  border-left: 22px solid transparent;
  border-right: 22px solid transparent;
  top: -5px;
}
.navbar .rights {
  height: 50px;
  line-height: 52px;
  text-align: center;
  font-family: KuHei;
  /* margin-top: 10px; */
}
.navbar .harf {
  margin: 0 15px;
}
.navbar .activation {
  position: relative;
  color: #FFFFFF;
  font-weight: bold;
}
.navbar .activation::after {
  position: absolute;
  content: '';
  height: 3px;
  width: 108%;
  bottom: 8px;
  background: #ff7979
;
}
</style>
<style scoped>
.navbar .el-col {
  height: 50px;
  margin: 0;
  padding: 0 !important;
}
.navbar .imgs {
  margin-right: 18px;
  font-size: 20px;
  color: #cccccc;
  margin-top: 18px;
  cursor: pointer;
}
.navbar .users {
  position: absolute;
  color: #ccc;
  font-size: 20px;
  height: calc(100% + 5px);
  cursor: pointer;
  margin: 0;
}
</style>
