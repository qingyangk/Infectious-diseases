<template>
  <div>
    <div style="position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;">
      <div id="map" style="position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;z-index: 990" />
    </div>
    <div>
      <iframe ref="iframe" class="SEIRWarning" src="/html/serirwarning/SEIRWarning.html" />
    </div>
  </div>
</template>

<script>
import { loadModules } from 'esri-loader'

export default {
  name: 'SEIR',
  data() {
    return {
      // SEIR: './SEIRModel/SEIRWarning.html'
    }
  },
  mounted: function() {
    const option = {
      // 定义一个包含有JS API中js开发包和css样式文件的对象
      url: 'http://js.arcgis.com/4.16/dojo/dojo.js',
      css: 'https://js.arcgis.com/4.16/esri/themes/dark-blue/main.css'
    }
    // 通过loadModules来做衔接
    loadModules(
      [
        'esri/Map',
        'esri/Basemap',
        'esri/layers/TileLayer',
        'esri/views/SceneView',
        'esri/views/MapView',
        'esri/layers/FeatureLayer',
        'esri/Camera'
      ],
      option
    ).then(([Map, Basemap, TileLayer, SceneView, MapView, FeatureLayer, Camera]) => {
      const customBasemap = new Basemap({
        portalItem: {
          id: 'a14ba2b66c284ce4bd1c11a335760f70' // WGS84 Streets Vector webmap
        }
      })
      const map = new Map({
        basemap: customBasemap
        // layers: [featureLayer]
      })
      // eslint-disable-next-line no-unused-vars
      var view = new MapView({
        zoom: 15,
        center: [-76.98956516111461, 39.57446998591422],
        container: 'map',
        map: map
      })
    })
  },
  methods: {
  }
}
</script>

<style scoped>
.SEIRWarning{
  position: absolute;
  width: 100%;
  height: 110%;
  top: -68px;
  left: 0px;
  margin: 0;
  padding: 0;
  z-index: 991;
  border: none;
}
</style>
