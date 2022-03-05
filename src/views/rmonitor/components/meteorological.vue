<template>
  <div id="Meteorological">
    <router />
    <iframe class="windy" src="/html/windy/index.html" marginheight="0" marginwidth="0" scrolling="no" frameborder="0" />
  </div>
</template>
<script>
import Router from './router'
export default {
  name: 'Meteorological',
  components: {
    Router
  },
  data() {
    return {
      lineLayer: null,
      map: null,
      scene: null
    }
  },
  beforeDestroy() {
    document.getElementById('Meteorological').style.display = 'none'
  },
  mounted() {
  },
  methods: {
  }
}
</script>
<style scoped>
#Meteorological {
  position: absolute;
  width: 100%;
  height: 100%;
}
.windy {
  position: absolute;
  height: 100%;
  width: calc(100% - 40px);
  right: 0;
}
</style>
