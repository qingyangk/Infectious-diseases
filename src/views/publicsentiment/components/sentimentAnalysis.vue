<template>
  <div>
    <iframe class="sentimentAnalysis" src="http://114.98.239.36:8082/saMap/saMapNew.html" marginheight="0" marginwidth="0" scrolling="no" frameborder="0" />
  </div>
</template>
<script>
export default {
  name: 'SentimentAnalysis'
}
</script>
<style scoped>
.sentimentAnalysis {
  position: absolute;
  height: 100%;
  width: 100%;
}
</style>
