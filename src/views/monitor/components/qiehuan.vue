<template>
  <div style="position: absolute;width: 100%;height: 100%">
    <div class="button">
      <el-button id="DGeometry">切换</el-button>
    </div>
    <div id="MapSanJ1" />
  </div>
</template>

<script>
import { loadModules } from 'esri-loader'

export default {
  name: 'GWR',
  mounted() {
    this._Init()
  },
  methods: {
    _Init: function() {
      const option = {
        url: 'http://js.arcgis.com/4.16/dojo/dojo.js',
        css: 'https://js.arcgis.com/4.16/esri/themes/dark-blue/main.css'
      }

      // 通过loadModules来做衔接
      loadModules(
        [
          'esri/layers/TileLayer',
          'esri/Map',
          'esri/views/MapView',
          'esri/Basemap',
          'esri/views/SceneView',
          'esri/Camera',
          'esri/layers/FeatureLayer',
          'esri/widgets/Legend',
          'esri/widgets/Sketch/SketchViewModel',
          'esri/layers/GraphicsLayer',
          'dgrid/OnDemandGrid',
          'dgrid/extensions/ColumnHider',
          'dgrid/Selection',
          'esri/layers/MapImageLayer'
        ],
        option
      ).then(([TileLayer, Map, MapView, Basemap, SceneView, Camera, FeatureLayer, Legend, SketchViewModel, GraphicsLayer, OnDemandGrid, ColumnHider, Selection, MapImageLayer]) => {
        const customBasemap = new Basemap({
          portalItem: {
            id: 'a14ba2b66c284ce4bd1c11a335760f70' // WGS84 Streets Vector webmap
          }
        })

        const MapSanJ1 = new Map({
          basemap: customBasemap
        })
        // eslint-disable-next-line no-unused-vars
        var view = new MapView({
          container: 'MapSanJ1',
          map: MapSanJ1,
          zoom: 8,
          center: [114.31, 30.52]
        })
      })
    }
  }
}
</script>

<style scoped>
#MapSanJ1  {
  float: left;
  width: 100%;
  height: 100%;
}
</style>
