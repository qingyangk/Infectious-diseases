<template>
  <div style="position: absolute;width: 100%;height: 100%">
    <el-button id="select">123</el-button>
    <div id="button">
      <el-button class="" style="top: 40px;" @click="sta()">确诊冷热点分析</el-button>
      <el-button class="" style="top: 90px;" @click="type()">死亡冷热点分析</el-button>
    </div>
    <div id="MapSanJ1" />
  </div>
</template>
<script>
var map
import { loadModules } from 'esri-loader'
export default {
  name: 'Lengre',
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
      map.layers.items[0].visible = true
      map.layers.items[1].visible = false
    },
    type() {
      map.layers.items[0].visible = false
      map.layers.items[1].visible = true
    },
    _Init() {
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
        /* eslint-disable no-unused-vars */
        const popupTemplate = {
          title: '{疾病名称}--{性别}', // 全国矢量（省、市、县）
          content: [
            {
              type: 'fields',
              fieldInfos: [
                { fieldName: '卡片编号', label: '卡片编号' },
                { fieldName: '疾病名称', label: '疾病名称' },
                { fieldName: '人群分类', label: '人群分类' },
                { fieldName: '病例分类', label: '病例分类' },
                { fieldName: '发病日期', label: '发病日期' },
                { fieldName: '诊断时间', label: '诊断时间' },
                { fieldName: '报告单位', label: '报告单位' },
                { fieldName: '性别', label: '性别' },
                { fieldName: '出生日期', label: '出生日期' },
                { fieldName: '现住地址国标', label: '现住地址国标' },
                { fieldName: '现住详细地址', label: '现住详细地址' },
                { fieldName: '年龄', label: '年龄' },
                { fieldName: '实验室结果', label: '实验室结果' },
                { fieldName: '死亡日期', label: '死亡日期' }
              ]
            }
          ]
        }
        const norrender = {
          type: 'simple',
          field: 'mag',
          symbol: {
            type: 'simple-marker',
            size: 4,
            color: '#69dcff',
            outline: {
              color: 'rgba(0, 139, 174, 0.5)',
              width: 5
            }
          }
        }
        // var WH_Water = new FeatureLayer({
        //   url: 'http://114.98.239.36:6080/arcgis/rest/services/ShaanXiDisease/american/MapServer/0',
        //   // renderer: norrender,
        //   title: '确诊反距离权重'
        //   // popupTemplate: popupTemplate
        // })
        // var WH_Water = new FeatureLayer({
        //   url: 'http://114.98.239.36:6080/arcgis/rest/services/ShaanXiDisease/american/MapServer/1',
        //   // renderer: norrender,
        //   title: '死亡反距离权重'
        //   // popupTemplate: popupTemplate
        // })
        var WH_Water = new FeatureLayer({
          url: 'http://114.98.239.36:6080/arcgis/rest/services/ShaanXiDisease/american/MapServer/2',
          // renderer: norrender,
          title: '确诊冷热点分析'
          // popupTemplate: popupTemplate
        })
        var WH_Water1 = new FeatureLayer({
          url: 'http://114.98.239.36:6080/arcgis/rest/services/ShaanXiDisease/american/MapServer/3',
          // renderer: norrender,
          title: '死亡冷热点分析',
          visible: false
          // popupTemplate: popupTemplate
        })
        map = new Map({
          basemap: customBasemap,
          layers: [WH_Water, WH_Water1]
        })
        var view = new MapView({
          container: 'MapSanJ1',
          map: map,
          center: [-97.77963911456415, 38.00549593039876],
          zoom: 4
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
