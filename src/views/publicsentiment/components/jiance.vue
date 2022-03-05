<template>
  <div id="jiance">
    <!-- 左边 -->
    <div class="left">
      <left />
    </div>
    <!-- 中间 -->
    <div class="center">
      <center />
    </div>
    <!-- 右边 -->
    <div class="right">
      <right />
    </div>
  </div>
</template>
<script>
import Left from './components/left'
import Center from './components/center'
import Right from './components/right'

export default {
  name: 'Jiance',
  components: {
    Left,
    Center,
    Right
  }
}
</script>
<style scoped>
/* 背景 */
#jiance {
  position: absolute;
  height: 100%;
  width: 100%;
  background: url("../public/img/back.png") no-repeat center center;
  /*加载背景图*/
  /* 背景图不平铺 */
  background-size: cover;
  /* 让背景图基于容器大小伸缩 */
  background-attachment: fixed;
  /* 当内容高度大于图片高度时，背景图像的位置相对于viewport固定 */
  background-color: #CCCCCC;
  /* 设置背景颜色，背景图加载过程中会显示背景色 */
}
/* 左边 */
#jiance .left {
  position: absolute;
  z-index: 1;
  width: 20%;
  height: 100%;
  left: 0;
  /* background-color: chocolate; */
  padding: 10px 5px;
}
/* 中间 */
#jiance .center {
  position: absolute;
  z-index: 1;
  width: 60%;
  height: 100%;
  left: 50%;
  transform: translate(-50%, 0);
  /* background-color: red; */
  padding: 10px 5px;
}
/* 右边 */
#jiance .right {
  position: absolute;
  z-index: 1;
  width: 20%;
  height: 100%;
  right: 0;
  /* background-color: gold; */
  padding: 10px 5px;
}
</style>
