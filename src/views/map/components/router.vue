<template>
  <div>
    <!-- 导航模块 -->
    <div id="router">
      <ul>
        <li>
          <el-tooltip class="item" effect="dark" content="填色图" placement="right-end">
            <el-link :underline="false" href="/#/map/index">
              <span class="imgz"><icon-svg icon-class="icon-bg-colors" /></span>
            </el-link>
          </el-tooltip>
        </li>
        <li>
          <el-tooltip class="item" effect="dark" content="热力图" placement="right-end">
            <el-link :underline="false" href="/#/map/reli">
              <span class="imgz"><icon-svg icon-class="icon-relitu2" /></span>
            </el-link>
          </el-tooltip>
        </li>
        <li>
          <el-tooltip class="item" effect="dark" content="荧光图" placement="right-end">
            <el-link :underline="false" href="/#/map/yingguang">
              <span class="imgz"><icon-svg icon-class="icon-guangzhao" style="font-size: 35px" /></span>
            </el-link>
          </el-tooltip>
        </li>
        <li>
          <el-tooltip class="item" effect="dark" content="聚合图" placement="right-end">
            <el-link :underline="false" href="/#/map/jvhe">
              <span class="imgz"><icon-svg icon-class="icon-combine" /></span>
            </el-link>
          </el-tooltip>
        </li>
        <li>
          <el-tooltip class="item" effect="dark" content="分类图" placement="right-end">
            <el-link :underline="false" href="/#/map/fenglei">
              <span class="imgz"><icon-svg icon-class="icon-sort" /></span>
            </el-link>
          </el-tooltip>
        </li>
        <li>
          <el-tooltip class="item" effect="dark" content="三维图" placement="right-end">
            <el-link :underline="false" href="/#/map/sanwei">
              <span class="imgz"><icon-svg icon-class="icon-sanweimianzhuanmoxing" /></span>
            </el-link>
          </el-tooltip>
        </li>
        <li>
          <el-tooltip class="item" effect="dark" content="密度图" placement="right-end">
            <el-link :underline="false" href="/#/map/midu">
              <span class="imgz"><icon-svg icon-class="icon-dianmidu1" /></span>
            </el-link>
          </el-tooltip>
        </li>
        <li>
          <el-tooltip class="item" effect="dark" content="时间图" placement="right-end">
            <el-link :underline="false" href="/#/map/shijian">
              <span class="imgz"><icon-svg icon-class="icon-shijian" /></span>
            </el-link>
          </el-tooltip>
        </li>
      </ul>
    </div>
    <!-- 条件模块 -->
    <selectRegion />
    <div id="reiht">
      <div class="top">
        <i v-if="j === 1" class="el-icon-arrow-left" @click="huan(0)" />
        <listDiseases class="s" />
        <transmission class="x" />
        <i v-if="j === 0" class="el-icon-arrow-right" @click="huan(1)" />
      </div>
      <div class="centers">
        <div class="Shang">
          <ul>
            <li class="public">
              <div class="left">
                <span style="font-size: 13px;color: rgb(200, 200, 200);">开始时间：</span>
              </div>
              <div class="right">
                <el-date-picker v-model="json.STime" type="date" placeholder="选择开始日期" :picker-options="pickerOptions1" :editable="false" @change="SAT()" />
              </div>
            </li>
            <li class="public">
              <div class="left">
                <span style="font-size: 13px;color: rgb(200, 200, 200);">结束时间：</span>
              </div>
              <div class="right">
                <el-date-picker v-model="json.ETime" type="date" placeholder="选择结束日期" :picker-options="pickerOptions2" :editable="false" @change="END()" />
              </div>
            </li>
            <li class="public">
              <div class="left">
                <span style="font-size: 13px;color: rgb(200, 200, 200);">城市尺度：</span>
              </div>
              <div class="right">
                <el-select v-model="json.space" placeholder="选择城市尺度" :popper-append-to-body="false">
                  <el-option v-for="item in space" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </div>
            </li>
            <li class="public">
              <div class="left">
                <span style="font-size: 13px;color: rgb(200, 200, 200);">患病类型：</span>
              </div>
              <div class="right">
                <el-radio v-model="json.type" label="诊断">诊断</el-radio>
                <el-radio v-model="json.type" label="重症">重症</el-radio>
                <el-radio v-model="json.type" label="死亡">死亡</el-radio>
              </div>
            </li>
            <li class="public" style="color: rgb(200, 200, 200);">
              <span style="padding-bottom: 10px">
                {{ name }}
              </span>
              <span v-if="data.name !== '' && data.type !== '' && data.name !== '中国'">
                {{ data.name }} -- {{ data.type }}
              </span>
              <p v-if="data.STime !== '' && data.ETime !== ''" style="margin: 5px 0;">
                时间：{{ data.STime }} 至 {{ data.ETime }}
              </p>
              <span v-if="json.space !== '' && json.type !== ''">
                尺度：{{ json.space }} -- 类型：{{ json.type }}
              </span>
            </li>
            <li class="public">
              <p class="find" @click="btnSelect()"><i class="el-icon-search" />制图</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 加载动画 -->
    <div id="bg">
      <div id="xuan">
        <span /><span /><span /><span />
      </div>
    </div>
  </div>
</template>
<script>
import store from '@/store'
import { mapGetters, mapState } from 'vuex'
import SelectRegion from './selectRegion'
import ListDiseases from './listDiseases'
import Transmission from './transmission'
import evebtBum from '../public/js/EvebtBus.js' // 传值

export default {
  name: 'Router',
  components: {
    SelectRegion,
    ListDiseases,
    Transmission
  },
  data() {
    return {
      json: {
        STime: '',
        ETime: '',
        space: '市级',
        type: '诊断'
      },
      data: {
        name: '中国',
        type: '',
        STime: '',
        ETime: ''
      },
      j: 0, // 右上角左右切换
      space: [
        {
          value: '市级',
          label: '市级'
        },
        {
          value: '县级',
          label: '县级'
        },
        {
          value: '街道',
          label: '街道'
        }
      ],
      pickerOptions1: {
        disabledDate: (time) => {
          if (this.json.ETime !== '') {
            return time.getTime() > Date.now() || time.getTime() > this.json.ETime
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      pickerOptions2: {
        disabledDate: (time) => {
          return time.getTime() < new Date(this.json.STime).getTime() || time.getTime() > Date.now()
        }
      },
      name: '' // 制图名称
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ]),
    ...mapState({
      mapdata: state => state.mapdata // 想获取到的值
    })
  },
  created() {
    var that = this
    that.json.STime = that.mapdata.STime
    that.data.STime = that.mapdata.STime
    that.json.ETime = that.mapdata.ETime
    that.data.ETime = that.mapdata.ETime
    that.json.space = that.mapdata.space
    // evebtBum.$emit('space', that.mapdata.space)
    that.json.type = that.mapdata.type
  },
  beforeDestroy() {
    this.mapdata.space = this.json.space
    this.mapdata.type = this.json.type
    evebtBum.$off('json')
    evebtBum.$off('typc')
    evebtBum.$off('type')
  },
  mounted() {
    var that = this
    setTimeout(function() {
      evebtBum.$emit('space', that.mapdata.space)
    }, 200)
    this.jihuo()
    evebtBum.$on('json', json => {
      this.data.name = json.name
    })
    // 疾病名称
    evebtBum.$on('typc', typc => {
      if (typc === '陕西手足口点') {
        this.data.type = '手足口病'
      } else {
        this.data.type = typc
      }
    })
    evebtBum.$on('type', type => {
      if (type === '陕西手足口点') {
        this.data.type = '手足口病'
      } else {
        this.data.type = type
      }
    })
    evebtBum.$on('gai', e => {
      if (e === 0) {
        document.getElementById('bg').style.display = 'block'
      } else {
        document.getElementById('bg').style.display = 'none'
      }
    })
  },
  methods: {
    async jihuo() {
      // 获得全部路由
      var zu = []
      var routers = await store.dispatch('permission/generateRoutes', this.roles)
      var children = routers[4].children
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
      if (zu.indexOf(path) === 0) {
        this.name = '填色图'
      } else if (zu.indexOf(path) === 1) {
        this.name = '热力图'
      } else if (zu.indexOf(path) === 2) {
        this.name = '荧光图'
      } else if (zu.indexOf(path) === 3) {
        this.name = '聚合图'
      } else if (zu.indexOf(path) === 4) {
        this.name = '分类图'
      } else if (zu.indexOf(path) === 5) {
        this.name = '三维图'
      } else if (zu.indexOf(path) === 6) {
        this.name = '密度图'
      } else if (zu.indexOf(path) === 7) {
        this.name = '时间图'
      }
    },
    huan(e) {
      this.j = e
      var s = document.getElementsByClassName('s')[0]
      var x = document.getElementsByClassName('x')[0]
      if (e === 1) {
        s.style.display = 'none'
        x.style.display = 'block'
      } else {
        x.style.display = 'none'
        s.style.display = 'block'
      }
    },
    // 制图
    btnSelect() {
      var data = {}
      data.timz = this.checkTime2(new Date(this.json.STime))
      data.timx = this.checkTime2(new Date(this.json.ETime))
      data.spac = this.json.space
      data.type = this.json.type
      evebtBum.$emit('data', data)
    },
    SAT() {
      this.data.STime = this.checkTime2(new Date(this.json.STime))
      this.mapdata.STime = this.checkTime2(new Date(this.json.STime))
    },
    END() {
      this.data.ETime = this.checkTime2(new Date(this.json.ETime))
      this.mapdata.ETime = this.checkTime2(new Date(this.json.ETime))
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
      return i.getFullYear() + '-' + that.checkTime(i.getMonth() + 1) + '-' + that.checkTime(i.getDate())
    }
  }
}
</script>
<style scoped>
@font-face {
  src: url("../public/font/KuHei.ttf");
  font-family: "KuHei";
}
/* 导航模块 */
#router {
  position: absolute;
  width: 40px;
  text-align: center;
  height: calc(100%);
  background-color: rgba(11, 18, 46);
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
/* 条件模块 */
#reiht {
  position: absolute;
  right: 5px;
  z-index: 10;
  width: 400px;
  height: calc(100% - 5px);
  color: #fff;
  font-family: KuHei;
  font-size: 14px;
  border-radius: 2px;
  border: 2px solid rgba(25, 186, 139, 0.2);
}
#reiht .top {
  position: absolute;
  width: calc(100% - 10px);
  left: 5px;
  top: 5px;
  height: calc(35% - 5px);
  border: 2px solid rgba(25, 186, 139, 0.2);
  /* background: url("../public/img/bg.png") rgba(255, 255, 255, 0.1); */
  background: url("../public/img/bg.png") rgba(18, 18, 18, 0.4);
}
.x {
  display: none;
}
#reiht .top >>> .el-icon-arrow-left {
  position: absolute;
  color: #fff;
  font-size: 18px;
  z-index: 10;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 50%;
  background-color: rgba(204, 204, 204, 0.3);
  top: 5px;
  cursor: pointer;
  transition: all 0.5s;
  left: 5px;
  animation: fade-in;
  animation-duration: 1s;
  -webkit-animation: fade-in 1s;
}
#reiht .top >>> .el-icon-arrow-right {
  position: absolute;
  color: #fff;
  font-size: 18px;
  z-index: 10;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 50%;
  background-color: rgba(204, 204, 204, 0.3);
  top: 5px;
  cursor: pointer;
  transition: all 0.5s;
  right: 5px;
  animation: fade-in;
  animation-duration: 1s;
  -webkit-animation: fade-in 1s;
}
#reiht .centers .Shang {
  position: absolute;
  width: calc(100% - 10px);
  left: 5px;
  top: calc(35% + 5px);
  height: calc(65% - 10px);
  border: 2px solid rgba(25, 186, 139, 0.2);
  /* background: url("../public/img/bg.png") rgba(255, 255, 255, 0.1); */
  background: url("../public/img/bg.png") rgba(18, 18, 18, 0.4);
}
#reiht .centers .Shang ul,
#reiht .centers .Shang p {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
#reiht .centers .Shang .public {
  position: absolute;
  height: calc(100% / 6);
  width: 100%;
}
#reiht .centers .Shang .public .left {
  position: absolute;
  width: 40%;
  height: 100%;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
}
#reiht .centers .Shang .public .right {
  position: absolute;
  width: 60%;
  height: 100%;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
}
#reiht .centers .Shang .public .right >>> .el-input__prefix,
#reiht .centers .Shang .public .right >>> .el-input__suffix {
  display: none;
}
#reiht .centers .Shang .public:nth-child(3) >>> .el-input__suffix {
  display: block !important;
}
#reiht .centers .Shang .public .right >>> .el-input__inner {
  background-color: rgba(255, 255, 255, 0);
  border: none;
  text-align: center;
  font-family: KuHei;
  color: #fff;
  border-radius: 0;
  border-bottom: 2px solid rgba(219, 219, 219, 0.555);
  width: 190px;
  margin: 0 5px;
  padding: 0;
}
#reiht .centers .Shang .public .right >>> .el-input__inner::-webkit-input-placeholder {
  text-align: center;
  font-family: KuHei;
  color: #fff;
}
#reiht .centers .Shang .public .right >>> .popper__arrow {
  border: none !important;
}
#reiht .centers .Shang .public .right >>> .popper__arrow::after {
  content: none;
}
#reiht .centers .Shang .public .right >>> .el-select-dropdown {
  background-color: rgba(40, 43, 57, 0.65);
}
#reiht .centers .Shang .public .right >>> .el-select-dropdown__item {
  text-align: center;
  color: #fff;
}
#reiht .centers .Shang .public .right >>> .el-select-dropdown__item.hover,
#reiht .centers .Shang .public .right >>> .el-select-dropdown__item:hover {
  background-color: rgb(31, 33, 44) !important;
}
#reiht .centers .Shang .public:nth-child(1) {
  top: 0;
  height: calc(100% / 6 - 10px);
}
#reiht .centers .Shang .public:nth-child(2) {
  top: calc(100% / 6 - 10px);
  height: calc(100% / 6 - 10px);
}
#reiht .centers .Shang .public:nth-child(3) {
  top: calc(100% / 6 * 2 - 20px);
  height: calc(100% / 6 - 10px);
}
#reiht .centers .Shang .public:nth-child(4) {
  top: calc(100% / 6 * 3 - 30px);
  height: calc(100% / 6 - 10px);
}
#reiht .centers .Shang .public:nth-last-child(2) {
  top: calc(100% / 6 * 4 - 40px);
  height: calc(100% / 6 + 50px);
}
#reiht .centers .Shang .public:last-child {
  top: calc(100% / 6 * 5 + 10px);
  height: calc(100% / 6 - 10px);
}
#reiht .centers .Shang .public:nth-child(3) >>> .el-select {
  margin-right: 20px;
}
#reiht .centers .Shang .public:nth-child(4) >>> .el-radio {
  color: #fff;
  margin-right: 10px !important;
}
#reiht .centers .Shang .public:nth-child(4) >>> .el-radio__inner::after {
  left: 54.2%;
  top: 53.3%;
}
#reiht .centers .Shang .public:nth-child(4) >>> .el-radio__input.is-checked+.el-radio__label {
  color: #ff7979;
}
#reiht .centers .Shang .public:nth-child(4) >>> .el-radio__input.is-checked .el-radio__inner {
  border-color: #ff7979;
  background: #ff7979;
}
#reiht .centers .Shang .public:nth-last-child(2) {
  border-top: 2px dashed rgba(219, 219, 219, 0.555);
  border-bottom: 2px dashed rgba(219, 219, 219, 0.555);
}
#reiht .centers .Shang .public:nth-last-child(2) {
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  flex-direction: column;
  font-size: 13px;
}
#reiht .centers .Shang .public:last-child {
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
}
#reiht .centers .Shang .public:last-child {
  transition: all 0.5s;
  cursor: pointer;
  font-weight: bold;
  color: #fff;
  letter-spacing: 5px;
}
/* #reiht .centers .Shang .public:last-child:hover {
  color: rgb(233, 233, 233);
} */
#reiht .centers .Shang .public:last-child >>> .el-button--primary {
  background-color: rgb(255 255 255 / 0%);
  border: none;
}
#reiht .top::after,
#reiht .centers .Shang::after {
  position: absolute;
  content: "";
  bottom: -1px;
  right: -1px;
  height: 10px;
  width: 10px;
  border-bottom: 2px solid #02a6b5;
  border-right: 2px solid #02a6b5;
  transition: all 1.5s;
  z-index: 0;
}
#reiht .top::before,
#reiht .centers .Shang::before {
  position: absolute;
  content: "";
  top: -1px;
  left: -1px;
  height: 10px;
  width: 10px;
  border-top: 2px solid #02a6b5;
  border-left: 2px solid #02a6b5;
  transition: all 1.5s;
  z-index: 0;
}
/**===== xuan =====*/
#bg {
  display: none;
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(140, 140, 140, 0.4);
  z-index: 999;
}
#bg #xuan {
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  height: 50px;
  width: 70px;
  margin: -25px 0 0 -25px;
}
#bg #xuan span {
  width: 25px;
  height: 25px;
  background-color: #ff7979;
  display: inline-block;
  -webkit-animation: square3 1.7s infinite ease-in-out both;
  animation: square3 1.7s infinite ease-in-out both;
}
#bg #xuan span:nth-child(1) {
  left: 0px;
  -webkit-animation-delay: 0.1s;
  animation-delay: 0.1s;
}
#bg #xuan span:nth-child(2) {
  left: 15px;
  -webkit-animation-delay: 0.6s;
  animation-delay: 0.6s;
}
#bg #xuan span:nth-child(3) {
  left: 30px;
  -webkit-animation-delay: 1.1s;
  animation-delay: 1.1s;
}
#bg #xuan span:nth-child(4) {
  left: 45px;
  -webkit-animation-delay: 1.5s;
  animation-delay: 1.5s;
}
@keyframes square3 {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
    opacity: 0;
  }
  50% {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 1;
  }
  100% {
    -webkit-transform: rotate(60deg);
    transform: rotate(60deg);
    opacity: .5;
  }
}
@-webkit-keyframes square3 {
  0% {
    -webkit-transform: scale(0);
    opacity: 0;
  }
  50% {
    -webkit-transform: scale(1);
    opacity: 1;
  }
  100% {
    -webkit-transform: rotate(60deg);
    opacity: .5;
  }
}
/** END of xuan */
</style>
