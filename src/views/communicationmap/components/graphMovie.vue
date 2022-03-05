<template>
  <div id="GraphMovie">
    <iframe id="iframe" ref="iframe" class="SEIRWarning" src="/html/evolution/index.html" />
    <!-- 路由 -->
    <router />
  </div>
</template>
<script>
import Router from './router'

export default {
  name: 'GraphMovie',
  components: {
    Router
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
@font-face {
  src: url("../public/font/DS-DIGIT.ttf");
  font-family: "DIGIT";
}
#GraphMovie {
  position: absolute;
  height: 100%;
  width: 100%;
  background: url("../public/img/back.png") no-repeat center center;
  /* 背景图不平铺 */
  background-size: cover;
  /* 让背景图基于容器大小伸缩 */
  background-attachment: fixed;
  /* 当内容高度大于图片高度时，背景图像的位置相对于viewport固定 */
  background-color: #CCCCCC;
}
#iframe {
  position: absolute;
  width: calc(100% + 2px);
  height: calc(100% + 2px);
  top: -1px;
  z-index: 10;
}
</style>
