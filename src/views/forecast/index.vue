<template>
  <div id="forecast">
    <iframe id="cast" src="/html/sri/index.html" frameborder="0" />
    <router />
  </div>
</template>
<script>
import Router from './components/router'
export default {
  name: 'Forecast',
  components: {
    Router
  }
}
</script>
<style scoped>
#forecast {
  position: absolute;
  width: 100%;
  height: 100%;
}
#forecast #cast {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
