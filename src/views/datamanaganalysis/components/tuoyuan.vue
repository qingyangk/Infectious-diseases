<template>
  <div style="position: absolute;width: 100%;height: 100%">
    <div id="button">
      <el-button class="" style="top: 40px;" @click="sta()">确诊标准差椭圆</el-button>
      <el-button class="" style="top: 90px;" @click="type()">死亡标准差椭圆</el-button>
    </div>
    <div id="MapSanJ1" />
  </div>
</template>
<script>
import { loadModules } from 'esri-loader'
var map
export default {
  name: 'Tuoyuan',
  data() {
    return {
      msg: {}
    }
  },
  watch: {
    'pjson.c'() {
      this.msg = this.pjson
      var button = document.getElementById('select')
      button.click()
    }
  },
  mounted() {
    this._Init()
  },
  methods: {
    sta() {
      map.layers.items[1].visible = true
      map.layers.items[2].visible = true
      map.layers.items[3].visible = true
      map.layers.items[6].visible = false
      map.layers.items[4].visible = false
      map.layers.items[5].visible = false
    },
    type() {
      map.layers.items[3].visible = false
      map.layers.items[1].visible = false
      map.layers.items[2].visible = false
      map.layers.items[6].visible = true
      map.layers.items[4].visible = true
      map.layers.items[5].visible = true
    },
    _Init() {
      // eslint-disable-next-line no-unused-vars
      const that = this
      const option = {
        url: 'http://js.arcgis.com/4.18/dojo/dojo.js',
        css: 'https://js.arcgis.com/4.18/esri/themes/dark-blue/main.css'
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
          'esri/widgets/TimeSlider',
          'esri/layers/MapImageLayer'
        ],
        option
      ).then(([TileLayer, Map, MapView, Basemap, SceneView, Camera, FeatureLayer, Legend, SketchViewModel, GraphicsLayer, OnDemandGrid, ColumnHider, Selection, TimeSlider, MapImageLayer]) => {
        const customBasemap = new Basemap({
          portalItem: {
            id: 'a14ba2b66c284ce4bd1c11a335760f70' // WGS84 Streets Vector webmap
          }
        })

        var linerenderer = {
          type: 'simple', // autocasts as new SimpleRenderer()
          symbol: {
            type: 'simple-fill', // autocasts as new SimpleFillSymbol()
            style: 'none',
            outline: { // autocasts as new SimpleLineSymbol()
              type: 'simple-line',
              width: 2,
              color: '#FF729F',
              style: 'long-dash'
            }
          }
        }
        var linerenderer1 = {
          type: 'simple', // autocasts as new SimpleRenderer()
          symbol: {
            type: 'simple-fill', // autocasts as new SimpleFillSymbol()
            style: 'none',
            outline: { // autocasts as new SimpleLineSymbol()
              type: 'simple-line',
              width: 2,
              color: 'rgb(18,149,193)',
              style: 'long-dash'
            }
          }
        }
        var FeatureLayer3 = new FeatureLayer({
          portalItem: {
            id: '49c25e0ce50340e08fcfe51fe6f26d1e' // 美国各县和地区的 COVID-19 趋势
          },
          visible: true,
          legendEnabled: false
        })
        var WH_Water = new FeatureLayer({
          url: 'http://114.98.239.36:6080/arcgis/rest/services/ShaanXiDisease/America/MapServer/7',
          renderer: linerenderer,
          title: '确诊人数标准差椭圆'
          // popupTemplate: popupTemplate
        })
        var WH_Water1 = new FeatureLayer({
          url: 'http://114.98.239.36:6080/arcgis/rest/services/ShaanXiDisease/America/MapServer/8',
          renderer: linerenderer,
          legendEnabled: false,
          title: '确诊人数标准差椭圆'
          // popupTemplate: popupTemplate
        })
        var WH_Water2 = new FeatureLayer({
          url: 'http://114.98.239.36:6080/arcgis/rest/services/ShaanXiDisease/America/MapServer/9',
          renderer: linerenderer,
          legendEnabled: false,
          title: '确诊人数标准差椭圆'
          // popupTemplate: popupTemplate
        })
        var WH_Water3 = new FeatureLayer({
          url: 'http://114.98.239.36:6080/arcgis/rest/services/ShaanXiDisease/America/MapServer/3',
          renderer: linerenderer1,
          title: '死亡人数标准差椭圆',
          visible: false
          // popupTemplate: popupTemplate
        })
        var WH_Water4 = new FeatureLayer({
          url: 'http://114.98.239.36:6080/arcgis/rest/services/ShaanXiDisease/America/MapServer/4',
          renderer: linerenderer1,
          title: '死亡人数标准差椭圆',
          legendEnabled: false,
          visible: false
          // popupTemplate: popupTemplate
        })
        var WH_Water5 = new FeatureLayer({
          url: 'http://114.98.239.36:6080/arcgis/rest/services/ShaanXiDisease/America/MapServer/5',
          renderer: linerenderer1,
          title: '死亡人数标准差椭圆',
          legendEnabled: false,
          visible: false
          // popupTemplate: popupTemplate
        })
        map = new Map({
          basemap: customBasemap,
          layers: [FeatureLayer3, WH_Water, WH_Water1, WH_Water2, WH_Water3, WH_Water4, WH_Water5]
        })
        var view = new MapView({
          container: 'MapSanJ1',
          map: map,
          center: [-94.91440152091359, 33.88754607741469],
          zoom: 2
        })
        view.on('drag', function(evt) {
          if (evt.action === 'end') {
            console.log(view)
          }
        })
        const legend = new Legend({
          view: view
        })
        view.ui.add(legend, 'bottom-left')
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
#button  {
  position: absolute;
  z-index: 99;
  top: 10%;
}
#select{
  display: none;
}

</style>
