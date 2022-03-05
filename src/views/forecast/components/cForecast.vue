<template>
  <div id="cForecast">
    <iframe id="cast" src="http://110.40.187.212:3000/app/main" frameborder="0" />
    <router />
    <selectRegion />
  </div>
</template>
<script>
import Router from './router'
import SelectRegion from './selectRegion' // 城市选择
export default {
  name: 'CForecast',
  components: {
    Router,
    SelectRegion
  }
}
</script>
<style scoped>
#cForecast {
  position: absolute;
  width: 100%;
  height: 100%;
}
#cForecast #cast {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
