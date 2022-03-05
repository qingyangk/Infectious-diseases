<template>
  <div style="position: absolute;width: 100%;height: 100%">
    <div class="button">
      <el-button @click="re()">热力图</el-button><br>
      <el-button @click="hy()">红荧光图</el-button><br>
      <el-button @click="fb()">分布图</el-button><br>
      <el-button @click="jh()">聚合图</el-button><br>
      <el-button @click="ly()">蓝荧光图</el-button><br>
      <el-button id="geometrySearch">几何查询</el-button><br>
      <el-button id="CircleSearch">画圈查询</el-button>
      <el-button id="geometryclearSearch">清空查询</el-button>
      <el-button id="DGeometry">{{ weidu }}</el-button>
    </div>
    <div id="MapSanJ1" />
  </div>
</template>
<script>
var map, view
import { loadModules } from 'esri-loader'
export default {
  name: 'Ceshimap',
  // props: {
  //   pjson: {
  //     type: null,
  //     required: true
  //   }
  // },
  data() {
    return {
      msg: {},
      weidu: '三维分析'
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
    re() {
      map.layers.items[0].visible = false
      map.layers.items[1].visible = false
      map.layers.items[2].visible = true
      map.layers.items[3].visible = false
      map.layers.items[4].visible = false
      map.layers.items[5].visible = false
    },
    hy() {
      map.layers.items[0].visible = false
      map.layers.items[1].visible = false
      map.layers.items[2].visible = false
      map.layers.items[3].visible = false
      map.layers.items[4].visible = true
      map.layers.items[5].visible = false
    },
    fb() {
      map.layers.items[0].visible = true
      map.layers.items[1].visible = false
      map.layers.items[2].visible = false
      map.layers.items[3].visible = false
      map.layers.items[4].visible = false
      map.layers.items[5].visible = false
    },
    ly() {
      map.layers.items[0].visible = false
      map.layers.items[1].visible = false
      map.layers.items[2].visible = false
      map.layers.items[3].visible = false
      map.layers.items[4].visible = false
      map.layers.items[5].visible = true
    },
    jh() {
      map.layers.items[0].visible = false
      map.layers.items[1].visible = true
      map.layers.items[2].visible = false
      map.layers.items[3].visible = false
      map.layers.items[4].visible = false
      map.layers.items[5].visible = false
    },
    _Init() {
      const that = this
      const option = {
        url: 'http://js.arcgis.com/4.17/dojo/dojo.js',
        css: 'https://js.arcgis.com/4.17/esri/themes/dark-blue/main.css'
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
          'esri/widgets/Sketch',
          'esri/core/watchUtils',
          'esri/widgets/Search',
          'esri/geometry/Polyline',
          'esri/geometry/geometryEngine',
          'esri/Graphic',
          'esri/tasks/QueryTask',
          'esri/tasks/support/Query'
        ],
        option
      ).then(([TileLayer, Map, MapView, Basemap, SceneView, Camera, FeatureLayer, Legend, SketchViewModel, GraphicsLayer, OnDemandGrid, ColumnHider, Selection, TimeSlider, MapImageLayer, Sketch, watchUtils, Search,
        Polyline,
        geometryEngine,
        Graphic,
        QueryTask,
        Query
      ]) => {
        const template = {
          title: 'COVID-19疫情状况',
          content: [
            {
              type: 'fields',
              fieldInfos: [
                {
                  fieldName: 'Province_State',
                  label: '省份'
                },
                {
                  fieldName: 'Country_Region',
                  label: '国家'
                },
                {
                  fieldName: 'Last_Update',
                  label: 'Last Update',
                  format: {
                    digitSeparator: true,
                    places: 0
                  }
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
                  fieldName: 'Recovered',
                  label: '治愈',
                  format: {
                    digitSeparator: true,
                    places: 0
                  }
                }
              ]
            }
          ]
        }
        var heatmapRenderer = {
          blurRadius: 10,
          type: 'heatmap',
          colorStops: [
            { color: 'rgba(0,0,0,0)', ratio: 0 },
            { color: 'rgb(000,000,255)', ratio: 0.083 },
            { color: 'rgb(000,255,255)', ratio: 0.166 },
            { color: 'rgb(000,255,000)', ratio: 0.249 },
            { color: 'rgb(255,255,000)', ratio: 0.332 },
            { color: 'rgb(243,81,17)', ratio: 0.415 }
          ],
          maxPixelIntensity: 25,
          minPixelIntensity: 0
        }
        // 原始大图
        var BasicFeatureLayer = new FeatureLayer({
          portalItem: {
            id: '041a05908ebd4a36af3dd8be10d770be',
            popupTemplate: template
          },
          outFields: ['Province_State', 'Country_Region', 'Last_Update', 'Confirmed', 'Recovered', 'Deaths'],
          popupTemplate: template
        })

        const clusterConfig = {
          type: 'cluster',
          clusterRadius: '100px',
          clusterMinSize: '35px',
          clusterMaxSize: '90px',
          popupTemplate: {
            content: '该片聚合区域内存在{cluster_count}个疫情分布',
            fieldInfos: [
              {
                fieldName: 'cluster_count',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              }
            ]
          },
          labelingInfo: [
            {
              labelExpressionInfo: {
                expression: "Text($feature.cluster_count, '#,###')"
              },
              symbol: {
                type: 'text',
                color: '#e0e9ea',
                font: {
                  weight: 'bold',
                  size: '22px'
                }
              },
              labelPlacement: 'center-center'
            }
          ]
        }
        // 聚合图
        var FeatureLayer1 = new FeatureLayer({
          portalItem: {
            id: '041a05908ebd4a36af3dd8be10d770be',
            opacity: 0.99,
            outFields: ['Province_State', 'Country_Region', 'Last_Update', 'Confirmed', 'Recovered', 'Deaths'],
            popupTemplate: template
          },
          featureReduction: clusterConfig,
          renderer: {
            type: 'simple',
            field: 'mag',
            symbol: {
              type: 'simple-marker',
              size: 25,
              color: '#69dcff',
              outline: {
                color: 'rgba(0, 139, 174, 0.8)',
                width: 5
              }
            }
          }
        })
        // 热力图
        var FeatureLayer2 = new FeatureLayer({
          portalItem: {
            id: '041a05908ebd4a36af3dd8be10d770be'
            // outFields: ['Province_State', 'Country_Region', 'Last_Update', 'Confirmed', 'Recovered', 'Deaths']
          },
          // opacity: 0.99,
          renderer: heatmapRenderer
        })
        // 填色图
        // 暂时不能用用荧光图替代
        var FeatureLayer3 = new FeatureLayer({
          url: 'http://114.98.239.36:6080/arcgis/rest/services/COVID/%E4%B8%96%E7%95%8C%E7%A1%AE%E8%AF%8A/MapServer'
        })
        // 荧光图
        var FeatureLayer4 = new FeatureLayer({
          url: 'http://114.98.239.36:6080/arcgis/rest/services/COVID/%E4%B8%96%E7%95%8C%E7%A1%AE%E8%AF%8A/MapServer'
        })
        // 荧光图
        var FeatureLayer5 = new FeatureLayer({
          url: 'http://114.98.239.36:6080/arcgis/rest/services/COVID/%E4%B8%96%E7%95%8C%E6%B2%BB%E6%84%88/MapServer'
        })

        const customBasemap = new Basemap({
          portalItem: {
            id: 'a14ba2b66c284ce4bd1c11a335760f70' // WGS84 Streets Vector webmap
          }
        })
        map = new Map({
          basemap: customBasemap,
          layers: [BasicFeatureLayer, FeatureLayer1, FeatureLayer2, FeatureLayer3, FeatureLayer4, FeatureLayer5]
        })
        map.layers.items[0].visible = true
        map.layers.items[1].visible = false
        map.layers.items[2].visible = false
        map.layers.items[3].visible = false
        map.layers.items[4].visible = false
        map.layers.items[5].visible = false

        view = new MapView({
          container: 'MapSanJ1',
          center: [100.527977, 35.591915],
          map: map,
          zoom: 3
        })
        view.when(function() {
          var switchButton = document.getElementById('DGeometry')
          switchButton.addEventListener('click', function() {
            switchView()
          })
          // 二三维切换
          function switchView() {
            const is3D = view.type
            // var is3D = appConfig.activeView.type === '3d'
            // var activeViewpoint = appConfig.activeView.viewpoint.clone()

            // remove the reference to the container for the previous view
            // appConfig.activeView.container = null

            if (is3D === '3d') {
              view = new MapView({
                container: 'MapSanJ1',
                center: [100.527977, 35.591915],
                map: map,
                zoom: 3
              })
              // if the input view is a SceneView, set the viewpoint on the
              // mapView instance. Set the container on the mapView and flag
              // it as the active view
              that.weidu = '三纬分析'
              start()
            } else {
              view = new SceneView({
                container: 'MapSanJ1',
                map: map,
                zoom: 3
              })
              that.weidu = '二纬分析'
              start()
            }
          }
          // Display the chart in an Expand widget
          const search = new Search({
            view: view,
            resultGraphicEnabled: false,
            popupEnabled: false
          })
          let pausableWatchHandle

          // Resume drawBufferPolygon() function; user searched for a new location
          // Must update the buffer polygon and re-run the stats query
          search.on('search-complete', function() {
            pausableWatchHandle.resume()
            that.mapclick = 1
          })
          // Add our components to the UI
          // view.ui.add(chartExpand, 'bottom-left')
          view.ui.add(search, 'top-right')
        })
        start()
        function start(params) {
          let sketchViewModel1, featureLayerView, pausableWatchHandle, centerGraphic, edgeGraphic, polylineGraphic, bufferGraphic, centerGeometryAtStart, labelGraphic
          var geometryClick = document.getElementById('geometrySearch')
          geometryClick.onclick = function() {
          // Update UI
            map.add(bufferLayer)
            map.add(graphicsLayer)
          }
          const unit = 'kilometers'
          const graphicsLayer = new GraphicsLayer()
          const bufferLayer = new GraphicsLayer({
            blendMode: 'color-burn'
          })
          var geometryclearClick = document.getElementById('geometryclearSearch')
          geometryclearClick.onclick = function() {
            // console.log('清空')
            console.log(highlightContent)
            if (highlightContent) {
              highlightContent.remove()
            }

            map.layers.items[6].removeAll()
            map.remove(bufferLayer)
            map.remove(graphicsLayer)
            pausableWatchHandle = null
          }
          function onMove(event) {
            // If the edge graphic is moving, keep the center graphic
            // at its initial location. Only move edge graphic
            if (event.toolEventInfo !== null) {
              var toolType = event.toolEventInfo.type
            }
            if (
              event.toolEventInfo &&
          event.toolEventInfo.mover.attributes.edge
            ) {
              const toolType1 = event.toolEventInfo.type
              if (toolType1 === 'move-start') {
                centerGeometryAtStart = centerGraphic.geometry
              } else if (toolType1 === 'move' || toolType1 === 'move-stop') {
                centerGraphic.geometry = centerGeometryAtStart
              }
            }
            // console.log(event)
            // the center or edge graphic is being moved, recalculate the buffer
            const vertices = [
              [centerGraphic.geometry.x, centerGraphic.geometry.y],
              [edgeGraphic.geometry.x, edgeGraphic.geometry.y]
            ]

            // client-side stats query of features that intersect the buffer
            calculateBuffer(vertices, toolType)
            if (event.state === 'complete') {
              sketchViewModel1.update([edgeGraphic, centerGraphic], {
                tool: 'move'
              })
            }
          }
          // view.on('drag', function(evt) {
          // // console.log(1111)
          //   if (evt.action === 'end') {
          //     sketchViewModel1.on('update', onMove)
          //   }
          // })
          const Static = ['Confirmed', 'Recovered']
          // eslint-disable-next-line no-unused-vars
          const statDefinitions = Static
            .map(function(fieldName) {
            // console.log(fieldName)
              return {
                onStatisticField: fieldName,
                outStatisticFieldName: fieldName,
                statisticType: 'sum'
              }
            })
          // Update UI
          setUpAppUI()
          setUpSketch()
          function setUpAppUI() {
            // When layer is loaded, create a watcher to trigger drawing of the buffer polygon
            view.whenLayerView(BasicFeatureLayer).then(function(layerView) {
            // console.log('打开⚪')
              featureLayerView = layerView

              pausableWatchHandle = watchUtils.pausable(
                layerView,
                'updating',
                function(val) {
                  if (!val) {
                    drawBufferPolygon()
                  }
                }
              )
              // Display directions when the layerView is loading
              watchUtils.whenFalseOnce(layerView, 'updating', function() {
                view.popup.alignment = 'top-left'
              })
            })
            // viwe.on()
            // view.on('click', function(event) {
            //   if (that.mapclick === 0) {
            //     that.$message({
            //       message: '请输入查询地址！',
            //       type: 'warning'
            //     })
            //   }
            // })

            // Close the 'help' popup when view is focused
            view.watch('focused', function(newValue) {
              if (newValue) {
                view.popup.close()
              }
            })
          }
          function setUpSketch() {
            sketchViewModel1 = new SketchViewModel({
              view: view,
              layer: graphicsLayer
            })

            // Listen to SketchViewModel's update event so that population pyramid chart
            // is updated as the graphics are updated
            sketchViewModel1.on('update', onMove)
          }
          function drawBufferPolygon() {
            pausableWatchHandle.pause()
            const viewCenter = view.center.clone()
            const centerScreenPoint = view.toScreen(viewCenter)
            const centerPoint = view.toMap({
              x: centerScreenPoint.x,
              y: centerScreenPoint.y
            })
            const edgePoint = view.toMap({
              x: centerScreenPoint.x + 160,
              y: centerScreenPoint.y - 160
            })
            // console.log(centerPoint)
            // Store updated vertices
            const vertices = [
              [centerPoint.x, centerPoint.y],
              [edgePoint.x, edgePoint.y]
            ]

            // Create center, edge, polyline and buffer graphics for the first time
            if (!centerGraphic) {
              const polyline = new Polyline({
                paths: vertices,
                spatialReference: view.spatialReference
              })

              // get the length of the initial polyline and create buffer
              const length = geometryEngine.geodesicLength(polyline, unit)
              const buffer = geometryEngine.geodesicBuffer(
                centerPoint,
                length,
                unit
              )

              // Create the graphics representing the line and buffer
              const pointSymbol = {
                type: 'simple-marker',
                style: 'circle',
                size: 10,
                // 点颜色
                color: '#E84855'
              }
              centerGraphic = new Graphic({
                geometry: centerPoint,
                symbol: pointSymbol,
                attributes: {
                  center: 'center'
                }
              })

              edgeGraphic = new Graphic({
                geometry: edgePoint,
                symbol: pointSymbol,
                attributes: {
                  edge: 'edge'
                }
              })

              polylineGraphic = new Graphic({
                geometry: polyline,
                symbol: {
                  type: 'simple-line',
                  // 线颜色
                  color: [254, 254, 254, 1],
                  width: 4
                }
              })

              bufferGraphic = new Graphic({
                geometry: buffer,
                symbol: {
                  type: 'simple-fill',
                  color: [140, 140, 222, 0.9],
                  outline: {
                    type: 'simple-line',
                    width: 1,
                    color: '#F3DFA2'
                  }
                }
              })
              labelGraphic = labelLength(edgePoint, length)

              // Add graphics to layer
              graphicsLayer.addMany([
                centerGraphic,
                edgeGraphic,
                polylineGraphic,
                labelGraphic
              ])
              setTimeout(function() {
                sketchViewModel1.update([edgeGraphic, centerGraphic], {
                  tool: 'move'
                })
              }, 1000)

              bufferLayer.addMany([bufferGraphic])
            } else {
              centerGraphic.geometry = centerPoint
              edgeGraphic.geometry = edgePoint
            }
            // Query features that intersect the buffer
            calculateBuffer(vertices)
          }
          function calculateBuffer(vertices, toolType) {
            // Update the geometry of the polyline based on location of edge and center points
            polylineGraphic.geometry = new Polyline({
              paths: vertices,
              spatialReference: view.spatialReference
            })

            // Recalculate the polyline length and buffer polygon
            const length = geometryEngine.geodesicLength(
              polylineGraphic.geometry,
              unit
            )
            const buffer = geometryEngine.geodesicBuffer(
              centerGraphic.geometry,
              length,
              unit
            )
            bufferGraphic.geometry = buffer
            // 搜索
            if (toolType === 'move-stop') {
            // console.log(11111)
              queryLayerViewAgeStats(buffer)
            }
            // Update label graphic to show the length of the polyline
            labelGraphic.geometry = edgeGraphic.geometry
            labelGraphic.symbol = {
              type: 'text',
              // 文字颜色
              color: '#FFEB00',
              text: length.toFixed(2) + ' 千米',
              xoffset: 50,
              yoffset: 10,
              font: {
                // autocast as Font
                size: 24,
                family: 'sans-serif'
              }
            }
          }
          function queryLayerViewAgeStats(buffer) {
            view.graphics.removeAll()
            // Data storage for the chart
            const confirmedData = []
            const recoverdData = []

            // Client-side spatial query:
            // Get a sum of age groups for census tracts that intersect the polygon buffer
            const query = featureLayerView.layer.createQuery()
            query.outStatistics = statDefinitions
            query.geometry = buffer

            // Query the features on the client using FeatureLayerView.queryFeatures
            return featureLayerView
              .queryFeatures(query)
              .then(function(results) {
              // 几何查询
                console.log('results')
                console.log(results)
                // Statistics query returns a feature with 'stats' as attributes
                const attributes = results.features[0].attributes

                // Loop through attributes and save the values for use in the population pyramid.
                for (var key in attributes) {
                  if (key.includes('Confirmed')) {
                    console.log(attributes[key])
                    confirmedData.push(attributes[key])
                  } else {
                    // Make 'all male age group population' total negative so that
                    // data will be displayed to the left of female age group
                    recoverdData.push(-Math.abs(attributes[key]))
                  }
                }
                // Return information, seperated by gender
                return [confirmedData, recoverdData]
              })
              .catch(function(error) {
                console.log(error)
              })
            // const query = { geometry: geometry, outFields: ['*'] }

            // Data storage for the chart
            // var qTask = new QueryTask({
            //   url: url
            // })
            // featureCircleLayerView.queryFeatures(query).then(function(results) {
            //   console.log(results)
            // })

          // // return qTask.execute(query).then(function(queryResult) {
          // return qTask.execute(query).then(function(queryResult) {
          //   that.tableData = []
          //   // console.log(queryResult)
          //   if (queryResult.features.length === 0) {
          //     // dom.byId('divShowResult').innerHTML = '查询结果为空！'
          //     // console.log('查询结果为空！')
          //     return
          //   }
          // })
          }
          const layer = new GraphicsLayer()
          var sketch = new SketchViewModel({
            view: view,
            layer: layer
          })
          function labelLength(geom, length) {
            return new Graphic({
              geometry: geom,
              symbol: {
                type: 'text',
                color: '#FFEB00',
                text: length.toFixed(2) + ' 千米',
                xoffset: 50,
                yoffset: 10,
                font: {
                  size: 10,
                  family: 'sans-serif'
                }
              }
            })
          }
          var highlightContent
          view.when(function() {
            document.getElementById('CircleSearch').addEventListener('click', function name(params) {
              create('polygon')
            })
          })
          function create(params) {
            if (params === 'polyline') {
              sketch.create('polyline')
            } else if (params === 'point') {
              sketch.create('point')
            } else if (params === 'polygon') {
              sketch.create('polygon', { mode: 'freehand' })// 丝滑
              sketch.create('polygon')// 点击
            } else if (params === 'rectangle') {
              sketch.create('rectangle')
            } else if (params === 'circle') {
              sketch.create('circle')
            }
            sketch.on('create', function(event) {
            // console.log(event)
              if (event.state !== 'cancel') {
                view.graphics.removeAll()
              }
              if (event.state === 'complete') {
              // featureCircleLayerView = {}
                selectFeatures(event.graphic.geometry)
              }
            })
          }
          var featureCircleLayerView
          BasicFeatureLayer.when(function() {
            view.whenLayerView(BasicFeatureLayer).then(function(layerView) {
              featureCircleLayerView = layerView
            // console.log(featureCircleLayerView)
            })
          })

          function selectFeatures(geometry) {
            if (featureCircleLayerView) {
              const query = { geometry: geometry, outFields: ['*'] }
              featureCircleLayerView.queryFeatures(query).then(function(results) {
              // console.log(results)
                const graphics = results.features
                if (highlightContent) {
                  highlightContent.remove()
                }
                highlightContent = featureCircleLayerView.highlight(results.features)
                var SearchRData = graphics.map(({ attributes }) => (attributes))
                const arrConfirmed = SearchRData.map(({ Confirmed }) => (Confirmed))
                const arrState = SearchRData.map(({ Province_State }) => (Province_State))
                const rst = []
                let GeTobj
                for (let e = 0; e < arrConfirmed.length; e++) {
                  GeTobj = { value: arrConfirmed[e], name: arrState[e] }
                  rst.push(GeTobj)
                }
              })
            }
          }
        }
        // eslint-disable-next-line no-unused-vars
        const legend = new Legend({
          view: view
        })
        // view.ui.add(legend, 'bottom-left')
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
.button{
  position: absolute;
  top:10%;
  left: 10%;
  z-index: 99;
}

</style>
