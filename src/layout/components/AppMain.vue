<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header+.app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
<style>
@font-face {
  src: url("./public/font/KuHei.ttf");
  font-family: "KuHei";
}
.el-tooltip__popper {
  color: #fff;
  font-family: KuHei;
  width: auto;
  margin: -10px 0 0 0;
  text-align: center;
  background-color: rgba(40, 43, 57, 0.8) !important;
  letter-spacing: 3px;
  border: 1px solid rgba(219, 219, 219, 0.555);
}
.el-tooltip__popper.is-dark {
  left: 35px !important;
}
.el-tooltip__popper.is-dark .popper__arrow {
  top: 11px !important;
}
.el-tooltip__popper .popper__arrow, .el-tooltip__popper .popper__arrow::after {
  display: none !important;
}
/* 时间选择器 */
.el-picker-panel {
  background-color: rgba(21, 62, 109, 0.9) !important;
  color: #fff !important;
}
.el-picker-panel .el-picker-panel__icon-btn,
.el-picker-panel .el-date-picker__header-label,
.el-picker-panel .cell,
.el-date-table th {
  color: #fff !important;
}
.el-picker-panel .popper__arrow {
  border-style: none !important;
}
.el-picker-panel .popper__arrow::after {
  content: none !important;
}
.el-year-table td.disabled .cell,
.el-month-table td.disabled .cell {
  background-color: rgba(222, 222, 222,0.9) !important;
}
.el-picker-panel__footer {
  background-color: rgba(222, 222, 222,0.9) !important;
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
}
.el-picker-panel__footer .el-button--text {
  display: none !important;
}
.el-date-picker__time-header .el-input--small .el-input__inner {
  text-align: center !important;
}
.el-date-picker__time-header .el-input__inner {
  background-color: rgba(255, 255, 255, 0);
  color: #fff;
  font-family: KuHei;
  border-style: dashed;
  border-color: rgba(255, 255, 255, 0.5);
}
.el-date-picker__time-header .el-input__inner:focus {
  border-color: #ff7979;
}
/* 输入框提示 */
.amap-sug-result {
  margin-top: 5px;
  background-color: rgb(27, 29, 39) !important;
  color: rgba(255, 255, 255, 0.9);
  font-family: KuHei;
  text-align: center;
  border-radius: 3px;
}
.amap-sug-result .auto-item {
  margin: 5px;
  letter-spacing: 1px;
}
.amap-sug-result .auto-item:hover {
  background-color: #ff79793a;
}
/* 地址提示 */
.tangram-suggestion-main {
  z-index: 999 !important;
}
/* 弹出警告 */
.el-notification.right {
  padding: 10px 15px;
  width: 280px;
  height: 124px;
}
.el-notification__group {
  width: 100%;
  position: relative;
}
.el-notification__closeBtn.el-icon-close {
  position: absolute;
  top: -6px;
  right: -12px;
  font-size: 20px;
  color: rgba(56, 56, 56, 0.45);
  transition: all 1.5s;
  transform: 2s;
}
.el-notification__closeBtn.el-icon-close:hover {
  color: rgba(56, 56, 56, 1);
  transform: rotate(360deg);
}
.el-notification__group {
  margin: 0;
}
.el-notification__content {
  margin: 0 5px;
}
/* 健康打卡页面警告 */
.el-notification__content .PMsa {
  width: 100%;
}
.el-notification__content .PMsaI {
  width: 65px;
  height: 65px;
}
.el-notification__content .PMsaP {
  position: absolute;
  left: 5px;
  top: 70px;
  width: 65px;
  height: calc(100% - 70px);
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
  background-color: rgba(32, 79, 126, 0.9);
  border: 1px solid rgba(18, 45, 71, 0.9);
  color: rgba(255, 255, 255, 0.9);
  font-family: KuHei;
  transition: all 1s;
  cursor: pointer;
}
.el-notification__content .PMsaP:hover {
  background-color: rgba(32, 79, 126, 1);
  color: rgba(255, 255, 255, 1);
}
.el-notification__content .PMsaR {
  position: absolute;
  right: 5px;
  top: 0;
  width: calc(100% - 80px);
  height: 100%;
  border-radius: 3px;
}
</style>

