<template>
  <div style="position: absolute;width: 100%;height: 100%">
    <div id="buttons">
      <!-- <input -->
      <el-select v-model="valueselect" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button id="findsx" type="primary">查 找</el-button>
    </div>
    <div id="MapSanJ1" />
  </div>
</template>
<script>
import { loadModules } from 'esri-loader'
// import { Message } from 'element-ui'
var map
export default {
  name: 'Idw',
  data() {
    return {
      name: '',
      options: [{
        value: '1',
        label: '患者A'
      }, {
        value: '2',
        label: '患者B'
      }, {
        value: '3',
        label: '患者C'
      }],
      valueselect: '1'
    }
  },
  mounted() {
    this._Init()
  },
  methods: {
    _Init() {
      var that = this
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
          'esri/layers/MapImageLayer',
          'esri/tasks/QueryTask',
          'esri/tasks/support/Query'
        ],
        option
      ).then(([TileLayer, Map, MapView, Basemap, SceneView, Camera, FeatureLayer, Legend, SketchViewModel, GraphicsLayer, OnDemandGrid, ColumnHider, Selection, TimeSlider, MapImageLayer
        , QueryTask, Query]) => {
        const customBasemap = new Basemap({
          portalItem: {
            id: 'a14ba2b66c284ce4bd1c11a335760f70' // WGS84 Streets Vector webmap
          }
        })
        var linerenderer = {
          type: 'simple', // autocasts as new SimpleRenderer()
          symbol: {
            type: 'simple-line', // autocasts as new SimpleFillSymbol()
            style: 'long-dash',
            color: '#FF729F',
            width: 1,
            marker: { // autocasts from LineSymbolMarker
              placement: 'end',
              style: 'arrow'
            }
          }
        }
        const backrenderer = {
          type: 'simple', // autocasts as new SimpleRenderer()
          symbol: {
            type: 'simple-fill',
            color: {
              r: 51,
              g: 51,
              b: 204,
              a: 0.7
            },
            outline: {
              type: 'simple-line',
              width: 1,
              color: '#F3DFA2'
              // style: 'long-dash'
            }
          }
        }
        var WH_Water = new FeatureLayer({
          url: 'http://114.98.239.36:6080/arcgis/rest/services/ShaanXiDisease/America/MapServer/1',
          // renderer: norrender,
          title: '车站',
          labelingInfo: ({
            labelExpressionInfo: { expression: '$feature.STATION ' },
            symbol: {
              type: 'text', // autocasts as new TextSymbol()
              color: 'black',
              haloSize: 1,
              haloColor: 'white'
            }
          })
          // popupTemplate: template
        })
        var WH_Water1 = new FeatureLayer({
          url: 'http://114.98.239.36:6080/arcgis/rest/services/ShaanXiDisease/America/MapServer/0',
          renderer: backrenderer,
          title: '移动范围'
          // popupTemplate: template
        })
        var WH_Water2 = new FeatureLayer({
          url: 'http://114.98.239.36:6080/arcgis/rest/services/ShaanXiDisease/America/MapServer/2',
          renderer: linerenderer,
          title: '移动轨迹'
          // popupTemplate: template
        })
        map = new Map({
          basemap: customBasemap,
          layers: [WH_Water1, WH_Water2, WH_Water]
        })
        var view = new MapView({
          container: 'MapSanJ1',
          map: map,
          center: [-92.26615785508876, 34.747472068251035],
          zoom: 15
        })
        var query = new Query({
          returnGeometry: true,
          outFields: ['*']
        })
        query.outSpatialReference = { wkid: 102100 }
        view.when(function() {
          // 对button不做设置，其在地图外面
          document.getElementById('findsx').addEventListener('click', function name(params) {
            if (that.valueselect === '1') {
              view.goTo({
                center: [-92.26615785508876, 34.747472068251035],
                zoom: 15
              })
            } else if (that.valueselect === '2') {
              view.goTo({
                center: [-92.2687649622498, 34.75662566288038],
                zoom: 15
              })
            } else {
              view.goTo({
                center: [-83.04579015268699, 42.33403283464118],
                zoom: 15
              })
            }
          }
          )
        })
        const legend = new Legend({
          view: view
        })
        view.ui.add(legend, 'bottom-right')
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
#select{
  display: none;
}

</style>
<style>
@font-face {
  src: url("./public/font/KuHei.ttf");
  font-family: "KuHei";
}
#buttons {
  position: absolute;
  z-index: 99;
  top: 100px;
}
#buttons .el-input {
  margin-right: 10px;
  width: 140px;
}
#buttons .el-input .el-input__inner {
  background: #302f2fcb;
  border: 1px solid #f7f7f7;
  color: #fff;
  font-family: KuHei;
}
#buttons .el-button {
  background: #302f2fcb;
  border: 1px solid #f7f7f7;
  color: #fff;
  font-family: KuHei;
}
</style>
