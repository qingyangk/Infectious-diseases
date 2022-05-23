<template>
  <div class="datamanag">
    <!-- 盒子 -->
    <div v-if="ceng == 0">
      0
    </div>
    <div v-if="ceng == 1">
      1
    </div>
    <div v-if="ceng == 2">
      <dataInsertion :ceng="ceng" />
    </div>
    <!-- 按钮 -->
    <div class="switch">
      <ul>
        <li @click="user()">
          <p>用户管理</p>
          <icon-svg icon-class="icon-yonghuzhongxin" class="img" />
        </li>
        <li @click="guanli()">
          <p>数据管理</p>
          <icon-svg icon-class="icon-dongtaishujuchaxun" class="img" />
        </li>
        <li @click="shujv()">
          <p>添加数据</p>
          <icon-svg icon-class="icon-charuhang" class="img" />
        </li>
      </ul>
    </div>

    <!-- <el-button style="z-index: 9999999; position: absolute; right: 0; " @click="xian()">加点</el-button>
    <el-button style="z-index: 9999999; position: absolute; right: 100px; " @click="jian()">减点</el-button> -->
  </div>
</template>
<script>
import DataInsertion from './components/dataInsertion' // 数据插入

export default {
  name: 'Datamanag',
  components: {
    DataInsertion
  },
  data() {
    return {
      ceng: 0
    }
  },
  destroyed() {
    document.getElementsByClassName('datamanag')[0].style.display = 'none'
  },
  methods: {
    user() {
      this.ceng = 0
    },
    guanli() {
      this.ceng = 1
    },
    shujv() {
      this.ceng = 2
    }
  }
}
</script>
<style scoped>
.switch {
  position: absolute;
  /* 为了不遮住 第三页表格 */
  z-index: 99;
  bottom: 12%;
  left: 50%;
  transform: translate(-50%, 0);
  background-color: rgba(40, 43, 57, 0.8);
  border: 1px solid rgb(39,45,57);
  border-radius: 15px;
  width: 350px;
  height: 60px;
  line-height: 60px;
  animation: fade-in;
  animation-duration: 1.2s;
  -webkit-animation: fade-in 1.2s;
  text-align: center;
}
.switch ul {
  margin: 0;
  padding: 0;
  height: 60px;
  list-style-type: none;
}
.switch li {
  display: inline-block;
  margin: 0 20px;
  margin-top: 3px;
  cursor: pointer;
  position: relative;
}
.switch li .img {
  width: 35px;
  height: 35px;
  -webkit-box-reflect: below -4px -webkit-gradient(linear, left top, left bottom, from(transparent), color-stop(0.3, transparent), to(rgba(255, 255, 255, .5)));
  transition: all 0.3s;
  transform-origin: 40% 70%;
}
.switch li p {
  margin: 0;
  padding: 0;
  display: none;
  position: absolute;
  bottom: 90px;
  left: 0;
  width: 100%;
  background-color: #222;
  border-radius: 5px;
  height: 40px;
  line-height: 40px;
}
.switch li:hover p {
  display: block;
  color: #fff;
  animation: fade-in;
  animation-duration: 0.5s;
  -webkit-animation: fade-in 0.5s;
}
.switch li:hover .img {
  transform: scale(2);
  margin: 0 30px;
}
.switch li:hover + li .img,
.switch li.prev .img {
  transform: scale(1.5);
  margin: 0 10px;
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  /*初始状态 透明度为0*/
  40% {
    opacity: 0;
  }
  /*过渡状态 透明度为0*/
  100% {
    opacity: 1;
  }
  /*结束状态 透明度为1*/
}
</style>
