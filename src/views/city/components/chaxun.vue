<template>
  <div class="chaxun" style="position: absolute;width: 100%;height: 100%">
    <div id="button">
      <!-- <input -->
      <el-input v-model="name" placeholder="请输入内容" />
      <el-select v-model="valueselect" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button id="findsx" type="primary" style="top: 101px;">查 找</el-button>
      <el-button type="primary" style="left: 0px; top: 150px;" @click="sta()">新冠监测点状态</el-button>
      <el-button type="primary" style="left: 0px; top: 200px;" @click="type()">新冠监测点类型</el-button>
      <el-button type="primary" style="left: 0px; top: 250px;" @click="feel()">媒体数量和情绪</el-button>
    </div>
    <div id="MapSanJ1" />
  </div>
</template>
<script>
import { loadModules } from 'esri-loader'
import { Message } from 'element-ui'
var map
export default {
  name: 'Idw',
  data() {
    return {
      name: '',
      options: [{
        value: '1',
        label: '州名'
      }, {
        value: '2',
        label: '县名'
      }],
      valueselect: '2'
    }
  },
  mounted() {
    this._Init()
  },
  methods: {
    sta() {
      map.layers.items[2].visible = true
      map.layers.items[1].visible = false
      map.layers.items[3].visible = false
    },
    type() {
      map.layers.items[1].visible = false
      map.layers.items[2].visible = false
      map.layers.items[3].visible = true
    },
    feel() {
      map.layers.items[3].visible = false
      map.layers.items[2].visible = false
      map.layers.items[1].visible = true
    },
    _Init() {
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
        const template = {
          title: 'COVID-19疫情状况',
          content: [
            {
              type: 'fields',
              fieldInfos: [
                {
                  fieldName: 'Countyname',
                  label: '县名'
                },
                {
                  fieldName: 'ST_Name',
                  label: '所属州'
                },
                {
                  fieldName: 'Confirmed',
                  label: '确诊',
                  format: {
                    digitSeparator: true,
                    places: 0
                  }
                },
                {
                  fieldName: 'Deaths',
                  label: '死亡',
                  format: {
                    digitSeparator: true,
                    places: 0
                  }
                },
                {
                  fieldName: 'NewCases',
                  label: '新增病例',
                  format: {
                    digitSeparator: true,
                    places: 0
                  }
                },
                {
                  fieldName: 'NewDeaths',
                  label: '新增死亡',
                  format: {
                    digitSeparator: true,
                    places: 0
                  }
                },
                {
                  fieldName: 'Age_Less15',
                  label: '年龄小于15',
                  format: {
                    digitSeparator: true,
                    places: 0
                  }
                },
                {
                  fieldName: 'Age_15_24',
                  label: '年龄在15到24岁之间',
                  format: {
                    digitSeparator: true,
                    places: 0
                  }
                },
                {
                  fieldName: 'Age_25_34',
                  label: '年龄在25到34岁之间',
                  format: {
                    digitSeparator: true,
                    places: 0
                  }
                },
                {
                  fieldName: 'Age_35_64',
                  label: '年龄在35到64岁之间',
                  format: {
                    digitSeparator: true,
                    places: 0
                  }
                },
                {
                  fieldName: 'Age_65_74',
                  label: '年龄在65到74岁之间',
                  format: {
                    digitSeparator: true,
                    places: 0
                  }
                },
                {
                  fieldName: 'Age_Over75',
                  label: '年龄大于75岁',
                  format: {
                    digitSeparator: true,
                    places: 0
                  }
                },
                {
                  fieldName: 'Unemployme',
                  label: '失业',
                  format: {
                    digitSeparator: true,
                    places: 0
                  }
                },
                {
                  fieldName: 'Ventilator',
                  label: '呼吸机',
                  format: {
                    digitSeparator: true,
                    places: 0
                  }
                }
              ]
            }
          ]
        }
        var WH_Water = new FeatureLayer({
          url: 'http://114.98.239.36:6080/arcgis/rest/services/ShaanXiDisease/America/MapServer/6',
          // renderer: norrender,
          title: '美国各县各地区疫情地图',
          popupTemplate: template
        })
        var meiti = new FeatureLayer({
          portalItem: {
            id: 'feb6280d42de4e91b47cf37344a91eae' // COVID-19 社交媒体数量和情绪
          },
          visible: false
        })
        var zhuangtai = new FeatureLayer({
          portalItem: {
            id: '11fe8f374c344549815a716c8472832f' // 以状态为标志的 GISCorps COVID-19 测试地点在美国
          },
          visible: false
        })
        var leixing = new FeatureLayer({
          portalItem: {
            id: 'd7d10caf1cec43e0985cc90fbbcf91cb' // 美国 GISCorps COVID-19 测试地点以测试类型为标志
          },
          visible: false
        })
        map = new Map({
          basemap: customBasemap,
          layers: [WH_Water, meiti, zhuangtai, leixing]
        })
        var view = new MapView({
          container: 'MapSanJ1',
          map: map,
          center: [-101.26011108321582, 34.95329492978438],
          zoom: 4
        })
        var resultsLayer = new GraphicsLayer()
        var query = new Query({
          returnGeometry: true,
          outFields: ['*']
        })
        query.outSpatialReference = { wkid: 102100 }
        view.when(function() {
          // 对button不做设置，其在地图外面
          document.getElementById('findsx').addEventListener('click', function name(params) {
            if (that.name !== '') {
              console.log(that.name)
              doQuery(that.name)
            }
          }
          )
        })
        function doQuery(e) {
          // 清除查询语句
          // 搜索

          resultsLayer.removeAll()
          // 判断查询图层
          // map.layers.remove(featureLayer4)
          // var queryurl = that.f4
          // console.log(queryurl)
          that.queryurl = that.f4

          var featureLayer5 = new FeatureLayer(
            'http://114.98.239.36:6080/arcgis/rest/services/ShaanXiDisease/America/MapServer/6',
            {
              opacity: 0.8
            })
          map.add(resultsLayer)
          // SQL查询语句
          // value
          // var name = ''
          if (that.valueselect === 1) {
            // name = 'ST_Name'
            query.where = "ST_Name  like '%" + that.name + "%'"
          } else {
            // name = 'Countyname'
            query.where = "Countyname  like '%" + that.name + "%'"
          }
          // console.log(query.where)

          featureLayer5.queryFeatures(query).then(function(response) {
            console.log(response)
            view.popup.close()
            if (response.features.length !== 0) {
              getResults(response)
            } else {
              promiseRejected()
            }
          })
        }
        function getResults(response) {
          var peakResults = response.features.map(function(feature) {
            // 搜索结果要素的样式
            feature.symbol = {
              type: 'simple-fill', // autocasts as new SimpleFillSymbol()
              color: [51, 51, 204, 0.6],
              style: 'solid',
              outline: { // autocasts as new SimpleLineSymbol()
                color: 'white',
                width: 1
              }
            }
            feature.popupTemplate = template
            return feature
          })
          // 向结果图层中添加刚找到的全部特征要素图层
          resultsLayer.addMany(peakResults)
          view.goTo(peakResults).then(function() {
            view.popup.open({
              features: peakResults,
              featureMenuOpen: true,
              updateLocationEnabled: true,
              lastEditInfoEnabled: true
            })
          }).catch(function(error) {
            if (error.name !== 'AbortError') {
              console.error(error)
            }
          })
          // document.getElementById('printResults').innerHTML = peakResults.length + ' results found!'
        }
        // 查询为空
        function promiseRejected(error) {
          console.log(error)
          Message({
            showClose: true,
            message: '查询失败',
            type: 'error'
          })
        }
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
#button {
  position: absolute;
  z-index: 99;
}
.chaxun .el-button {
  background: #302f2fcb;
  border: 1px solid #f7f7f7;
  color: #fff;
  position: absolute;
  margin: 0;
  font-family: KuHei;
}
#button .el-input {
  width: 140px;
  top: 100px;
  margin-right: 10px;
}
#button .el-input .el-input__inner {
  background: #302f2fcb;
  border: 1px solid #f7f7f7;
  color: #fff;
  font-family: KuHei;
}
#button .el-button {
  background: #302f2fcb;
  border: 1px solid #f7f7f7;
  color: #fff;
  font-family: KuHei;
}
</style>
