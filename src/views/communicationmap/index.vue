<template>
  <div id="Communicationmap">
    <!-- 展示信息 -->
    <div class="exhibition">
      <ul>
        <li>
          <!-- <span class="Tspan" style="background-color: #C2C459;" /> -->
          <p class="publis">确诊患者</p>
          <div class="numbers">
            {{ diagnosis }}<span style="font-size: 20px;font-family: 'KuHei';padding-left:5px;display: inline-block;vertical-align: top;color: rgb(180, 180, 180);">人</span>
          </div>
        </li>
      </ul>
    </div>
    <div id="parameter">
      <div class="setup">
        <div class="ding">
          参数设置
        </div>
        <div class="di">
          <ul>
            <li>
              <div class="Sleft">
                空间容差：
              </div>
              <div class="Sright">
                <el-input-number v-model="fanwei" :step="100" size="mini" controls-position="right" :min="100" />
                <p style="width: 20px;color: #b3b3b3;margin-right: 3px;">米</p>
              </div>
            </li>
            <li>
              <div class="Sleft">
                时间容差：
              </div>
              <div class="Sright">
                <el-input-number v-model="jiange" :step="10" size="mini" controls-position="right" :min="10" />
                <p style="width: 20px;color: #b3b3b3;margin-right: 3px;">分</p>
              </div>
            </li>
            <li>
              <div class="Sleft">
                传播天数：
              </div>
              <div class="Sright">
                <el-input-number v-model="tiansh" :step="1" size="mini" controls-position="right" :min="1" @change="days()" />
                <p style="width: 20px;color: #b3b3b3;margin-right: 3px;">天</p>
              </div>
            </li>
            <li>
              <div class="Sleft">
                传播代数：
              </div>
              <div class="Sright">
                <el-input-number v-model="daishu" :step="1" size="mini" controls-position="right" :min="1" :max="2" />
                <p style="width: 20px;color: #b3b3b3;margin-right: 3px;">代</p>
              </div>
            </li>
          </ul>
        </div>
        <div class="xuanz" @click="shengcheng()">
          关系图谱生成
        </div>
      </div>
    </div>
    <!-- 个人轨迹表 -->
    <div id="PTTable">
      <div class="top" @mousedown.prevent="m1($event)">≡</div>
      <div class="body">
        <div class="left">
          <div class="personal">
            <el-image :src="details.头像">
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
            <p style="position: absolute;top: 40px;left: 50%;transform: translateX(-50%);width: 100%;">姓名：{{ details.姓名 }}</p>
            <p style="position: absolute;top: 65px;left: 50%;transform: translateX(-50%);width: 100%;">编号：{{ details.编号 }}</p>
          </div>
        </div>
        <div class="right">
          <div class="nAdded" @click="add()">
            <i class="el-icon-plus" /><span> 新增</span>
          </div>
          <div class="table">
            <el-table ref="multipleTable" :data="trajectory" tooltip-effect="dark" style="width: 100%" height="calc(100%)" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="50" align="center" />
              <el-table-column prop="时间" label="时间" width="160" align="center" />
              <el-table-column prop="地点" label="地点" width="200" align="center" :show-overflow-tooltip="false" />
              <el-table-column label="操作" width="180" align="center">
                <template slot-scope="scope">
                  <el-button-group>
                    <el-button type="success" plain icon="el-icon-edit-outline" size="mini" @click="edit(scope.row)">编辑</el-button>
                    <el-button type="danger" plain size="mini" @click="deletes(scope.row)">删除 <i class="el-icon-delete" /></el-button>
                  </el-button-group>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="confirm" style="letter-spacing: 2px;" @click="query('源头')">
            <icon-svg icon-class="icon-analysis" style="font-size: 18px;margin-top: 15px" /> <span>密接人员查询</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 编辑/新增 -->
    <div id="business">
      <div class="top" @mousedown.prevent="m2($event)">≡</div>
      <div class="close" @click="close()"><i class="el-icon-close" /></div>
      <div class="body">
        <ul>
          <li>
            <div class="bleft">
              选择时间：
            </div>
            <div class="bright">
              <el-date-picker v-model="timeZon" type="datetime" :picker-options="pickerOptions" placeholder="选择时间" />
            </div>
          </li>
          <li>
            <div class="bleft">
              选择地点：
            </div>
            <div class="bright">
              <el-input id="place" v-model="place" placeholder="请输入地点" clearable @input="shuru()" />
            </div>
          </li>
        </ul>
      </div>
      <div class="botton" @click="submits()">
        <i class="el-icon-check" /> <span>确认</span>
      </div>
    </div>
    <!-- 个人关系图谱 -->
    <div v-show="relationShow" id="relationShip">
      <div class="top" @mousedown.prevent="m3($event)">≡</div>
      <div class="close" @click="relationclose()"><i class="el-icon-close" /></div>
      <div class="body">
        <el-button class="btns" type="primary" @click="addrelatonship">添加关系</el-button>
        <div id="addrelationship">
          <table>
            <tr>
              <th>添加患者姓名:</th>
              <th><el-input v-model="form.name" placeholder="请输入内容" /></th>
            </tr>
            <tr>
              <th>添加患者性别:</th>
              <th>
                <el-radio v-model="form.sex" label="1">男</el-radio>
                <el-radio v-model="form.sex" label="2">女</el-radio>
              </th>
            </tr>
            <tr>
              <th>患者确诊日期:</th>
              <th><el-date-picker v-model="form.date" :picker-options="pickerOptions" :editable="false" style="width: 100%" type="date" placeholder="选择日期" /></th>
            </tr>
            <tr>
              <th>患者关联病例:</th>
              <th>
                <el-select v-model="form.relation" :popper-append-to-body="false" style="width: 100%" filterable placeholder="请选择关系">
                  <el-option v-for="item in graphdata.nodes" :key="item.id" :label="item.id+'        '+item.name" :value="item.id" />
                </el-select>
              </th>
            </tr>
            <tr>
              <th>患者身份信息:</th>
              <th><el-input v-model="form.pid" placeholder="请输入内容" /></th>
            </tr>
            <tr>
              <th>添加患者住址:</th>
              <th><el-input v-model="form.address" placeholder="请输入内容" /></th>
            </tr>
            <tr>
              <th>
                <el-button type="primary" @click="backrelatonship">取消</el-button>
              </th>
              <th>
                <el-button type="primary" @click="addxiansuo">添加线索</el-button>
              </th>
            </tr>
          </table>
        </div>
        <SeeksRelationGraph ref="seeksRelationGraph" :options="graphOptions" />
      </div>
    </div>
    <!-- 地图 -->
    <div id="map1" />
    <!-- 右侧列表 -->
    <div id="right">
      <div class="pack">
        <transmission />
      </div>
      <div class="top">
        <div class="lable" style="font-size: 14px;">
          查询时间：
        </div>
        <div class="fTime">
          <i class="el-icon-d-arrow-left img" style="font-size:21px" @click="ReduceTime()" />
          <el-date-picker v-model="timx" type="date" placeholder="选择日期" :picker-options="pickerOptions" :editable="false" @change="STime()" />
          <i class="el-icon-d-arrow-right img" style="font-size:21px" @click="IncreaseTime()" />
        </div>
      </div>
      <div class="bottom">
        <div class="find">
          <div class="left" style="font-size: 14px;">筛选患者：</div>
          <div class="right">
            <el-input v-model="patient" placeholder="请输入患者编号" clearable />
          </div>
        </div>
        <div class="table">
          <el-table :data="tableData" style="width: 100%;" height="calc(100%)" highlight-current-row @row-click="s">
            <el-table-column width="62" label="单选" align="center">
              <template slot-scope="scope">
                <el-radio v-model="choice" :label="scope.row.编号" @change="dian()" />
              </template>
            </el-table-column>
            <el-table-column prop="编号" label="编号" width="180" align="center" />
            <el-table-column prop="姓名" label="姓名" width="140" align="center" />
          </el-table>
        </div>
        <div class="choice" @click="LStroke()">
          <span><icon-svg icon-class="icon-huizhiguiji" style="font-size: 18px;margin-right: 10px;margin-top: 15px" /> 加载行程</span>
        </div>
      </div>
    </div>
    <!-- 城市选择器 -->
    <selectRegion />
    <!-- 加载动画 -->
    <div id="bg">
      <div id="xuan">
        <span /><span /><span /><span />
      </div>
    </div>
    <!-- 路由 -->
    <router />
  </div>
</template>
<script>
import mapboxgl from 'mapbox-gl'
import { Mapbox } from '@antv/l7-maps'
import { Control } from '@antv/l7'
import { Scene, LineLayer, PointLayer } from '@antv/l7'
import SelectRegion from './components/selectRegion'
import Transmission from './components/transmission'
import Router from './components/router'
import eventBum from './public/js/EvebtBus'
import SeeksRelationGraph from 'relation-graph'
// 定义地图及可视化图层
// var loca, map

export default {
  name: 'Communicationmap',
  components: {
    SelectRegion,
    Transmission,
    Router,
    SeeksRelationGraph
  },
  data() {
    return {
      // 条件
      json: {
        name: '中国',
        where: 0,
        table: ''
      },
      timx: '',
      pickerOptions: {
        disabledDate: time => {
          return time > new Date().getTime()
        }
      },
      fanwei: 100,
      jiange: 0,
      tiansh: 1,
      daishu: 1,
      canMove: false, // 移动
      state: 0, // 新增/编辑
      relationShow: 'false',
      timeZon: '', // 时间
      place: '', // 地点
      // 右侧值
      diagnosis: 0, // 今日确诊
      tables: [], // 表中数据
      patient: '', // 患者
      choice: '', // 选中者
      // 用户值
      details: {}, // 用户信息
      trajectory: [], // 轨迹值
      SValue: [], // 选中值
      TStorage: {}, // 暂存值
      newx: '',
      newy: '',
      // 密接查询
      personnel: [], // 密接人员列表
      personnels: [], // 密接人员信息
      // 关系图谱
      nodes: [], // 数据
      links: [], // 关系
      graphdata: {
        rootId: '',
        nodes: '',
        links: ''
      },
      graphOptions: {
        defaultNodeBorderWidth: 0,
        defaultNodeColor: 'rgba(238, 178, 94, 1)',
        allowSwitchJunctionPoint: false,
        moveToCenterWhenResize: true,
        allowSwitchLineShape: false,
        defaultLineShape: 1,
        'layouts': [
          {
            'label': '自动布局',
            'layoutName': 'force',
            'layoutClassName': 'seeks-layout-force'
          }
        ],
        defaultJunctionPoint: 'border'
        // 这里可以参考"Graph 图谱"中的参数进行设置
      },
      // 地图控件
      infoWindow: null, // 弹窗
      isclick: 0, // 弹窗
      // 定位
      polygons: [], // 存储定位面
      // 道路数据
      waydata: [],
      // 地理编码
      geocoder: [],
      // 根据点生成路径
      route: undefined,
      routeall: [],
      // 点图标
      startpoint: undefined,
      endpoint: undefined,
      afterpoint: undefined,
      // 脉冲
      mcpath: [], // 脉冲路径数据
      grName: [], // 个人脉冲名称
      allName: [], // 个人脉冲名称
      maichong: [], // 脉冲路径
      layer1: undefined, // 脉冲图层
      layerall: [], // 脉冲集合
      headColors: [], // 脉冲颜色集合
      maichongTimes: 0, // 脉冲线数量
      linetype: 1, // 脉冲线类型
      lengend: null, // 脉冲线图例
      // 图例
      dataMap: [],
      // 缓冲区
      Circledata: [], // 缓冲区详细数据
      circle: undefined, // 缓冲区圆
      circleall: [], // 缓冲区集合
      markers: [], // 缓冲区圆
      // 判断是否执行一次
      isgrtimes: false,
      form: {
        name: '',
        sex: '1',
        relation: [],
        date: '',
        pid: '',
        address: ''
      },
      // 地图要素
      pointAll: [], // 标记点数据
      pathAll: [], // 轨迹数据
      pointAllLayer: null, // 标记点要素
      pathAlllayer: null, // 标记线要素
      otherlineLayer: null, // 密接线要素
      bufferData: null, // 缓冲区数据
      popup: null // 弹窗
    }
  },
  computed: {
    tableData: function() {
      var patient = this.patient
      if (patient) {
        return this.tables.filter(function(dataNews) {
          return Object.keys(dataNews).some(function(key) {
            return String(dataNews[key]).toLowerCase().indexOf(patient) > -1
          })
        })
      }
      return this.tables
    }
  },
  watch: {
    timx: function() {
      this.form.date = this.timx
    }
  },
  beforeDestroy() {
    // 关闭传值
    eventBum.$off('typc')
    eventBum.$off('json')
    document.getElementById('Communicationmap').style.display = 'none'
  },
  mounted() {
    var that = this
    // 接收疾病
    eventBum.$on('typc', typc => {
      that.json.table = typc
      if (that.json.name !== '' && that.json.name === '中国') {
        that.$message({
          message: '请选择城市！',
          type: 'warning'
        })
      } else {
        that.gatDate()
      }
    })
    // 接收值
    eventBum.$on('json', json => {
      this.json.name = json.name
      this.json.where = json.where
      document.getElementById('bg').style.display = 'block'
      // 地图定位
      that.getJson(1)
      if (that.json.table === '') {
        that.$message({
          message: '请选择疾病！',
          type: 'warning'
        })
      } else {
        that.gatDate()
      }
    })
    // 地图
    this.int()
    // 今日时间
    that.timx = that.checkTime2(new Date((new Date()).getTime() - 24 * 60 * 60 * 1000))
    // 切换时间是否展示
    if ((new Date((new Date(this.timx)).getTime() + 24 * 60 * 60 * 1000)) < (new Date()).getTime()) {
      document.querySelectorAll('.fTime .img')[1].style.zIndex = 0
      document.querySelectorAll('.fTime .img')[1].style.opacity = 1
    } else {
      document.querySelectorAll('.fTime .img')[1].style.zIndex = -10
      document.querySelectorAll('.fTime .img')[1].style.opacity = 0
    }
  },
  methods: {
    // 地图
    int() {
      var that = this
      mapboxgl.accessToken = 'pk.eyJ1Ijoid3VqaW5odWkwIiwiYSI6ImNrdDFoZWphNDBhaGszMXBoazZ1dWdwMWkifQ.AX5nvyCpK8yKsCqyz36rsw' // 你的accessToken
      this.map = new mapboxgl.Map({
        container: 'map1', // 地图容器的id
        center: [107.01292828127248, 34.12077517311424], // 中心点
        zoom: 2.75, // 地图初始化时的层级
        maxZoom: 22,
        style: {
          'version': 8,
          'sources': {
            'raster-tiles': {
              'type': 'raster',
              'tiles': [
                'https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}'
              ],
              'tileSize': 256
            }
          },
          'layers': [
            {
              'id': 'simple-tiles',
              'type': 'raster',
              'source': 'raster-tiles',
              'minzoom': 0,
              'maxzoom': 22
            }
          ],
          'glyphs': 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf'
        }
      })
      this.popup = new mapboxgl.Popup({ closeOnClick: false })
      this.scene = new Scene({
        id: 'map1',
        map: new Mapbox({
          mapInstance: that.map
        })
      })
      // const map1 = new AMap.Map()
      // 加载输入提示插件
      AMap.plugin(['AMap.Autocomplete'], function() {
        // eslint-disable-next-line no-unused-vars
        const auto = new AMap.Autocomplete({
          input: 'place'
        })
        auto.on('select', function name(e) {
          that.place = e.poi.name
        })
      })
      that.scene.addImage(
        'star',
        '/img/star.png'
      )
      that.scene.addImage(
        'end',
        '/img/end.png'
      )
      that.scene.addImage(
        'after',
        '/img/after.png'
      )
      that.scene.addImage(
        'mi',
        '/img/mi.png'
      )

      that.scene.addImage(
        'road',
        'https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*haGlTpW2BQgAAAAAAAAAAAAAARQnAQ'
      )
      that.map.on('load', function() {
        that.getJson(0)
      })
    },
    getJson(e) {
      var that = this
      document.getElementById('bg').style.display = 'block' // 遮罩
      that.$store.dispatch('ndatapanel/QJson', that.json.name).then((dataz) => {
        that.boundary = dataz
        // 数据
        if (e === 0) {
          // that.creatmap(dataz, TDate)
          that.bian(dataz, 0)
        } else if (e === 1) {
          // that.map.getSource('earthquakes').setData(TDate)
          that.bian(that.boundary, 1) // 清除原始边界
        } else if (e === 2) {
          // that.map.getSource('earthquakes').setData(TDate)
        }
      })
    },
    // 边界
    bian(dataz, e) {
      var that = this
      var bound = []
      if (e === 1) {
        if (that.length !== undefined) {
          for (let i = 0; i < that.length; i++) {
            that.map.removeLayer('maine' + i) // 清除范围
            that.map.removeSource('maine' + i)
          }
        } else {
          that.map.removeLayer('maine') // 清除范围
          that.map.removeSource('maine')
        }
      }
      if (dataz.json.features.length !== undefined) {
        if (that.json.name !== '中国') {
          for (let i = 0; i < dataz.json.features.length; i++) {
            const ele = dataz.json.features[i].geometry.coordinates
            for (let j = 0; j < ele.length; j++) {
              const element = ele[j][0]
              for (let z = 0; z < element.length; z++) {
                const element3 = element[z]
                bound.push(element3)
              }
            }
            that.map.addLayer({
              'id': 'maine' + i,
              'type': 'fill',
              'source': {
                'type': 'geojson',
                'data': dataz.json.features[i].geometry
              },
              'layout': {},
              'paint': {
                'fill-color': '#088',
                'fill-opacity': 0.2
              }
            })
          }
          // eslint-disable-next-line no-undef
          var line = turf.lineString(bound)
          // eslint-disable-next-line no-undef
          var bbox = turf.bbox(line)
          that.map.fitBounds(bbox, {
            padding: { bottom: 60 }
          })
          that.length = dataz.json.features.length
        } else {
          var hball = []
          var features = []
          // console.log(china_con)
          const hbfeatures = [[dataz.json.features[2].geometry.coordinates[0][0]], [dataz.json.features[2].geometry.coordinates[0][1]], dataz.json.features[2].geometry.coordinates[1]]
          for (let index = 0; index < hbfeatures.length; index++) {
            const element = hbfeatures[index]
            hball.push({ id: 33 + index, type: 'Feature', properties: { name: '河北省' }, geometry: { coordinates: element, type: 'Polygon' }})
          }
          for (let index = 0; index < dataz.json.features.length; index++) {
            const element = dataz.json.features[index]
            if (index === 2) {
              features.push(hball[0])
              features.push(hball[1])
              features.push(hball[2])
            } else {
              features.push(element)
            }
          }
          var qtbian = {
            'type': 'FeatureCollection',
            'features': features
          }
          that.map.addLayer({
            'id': 'maine0',
            'type': 'fill',
            'source': {
              'type': 'geojson',
              'data': qtbian
            },
            'layout': {},
            'paint': {
              'fill-color': '#088',
              'fill-opacity': 0.2
            }
          })
          that.length = 1
        }
      } else {
        that.map.addLayer({
          'id': 'maine',
          'type': 'fill',
          'source': {
            'type': 'geojson',
            'data': dataz.json.features.geometry
          },
          'layout': {},
          'paint': {
            'fill-color': '#088',
            'fill-opacity': 0.2
          }
        })
        // eslint-disable-next-line no-undef
        const line1 = turf.lineString(dataz.json.features.geometry.coordinates[0][0])
        // eslint-disable-next-line no-undef
        const bbox1 = turf.bbox(line1)
        that.map.fitBounds(bbox1, {
          padding: { bottom: 60 }
        })
        that.length = dataz.json.features.length
      }
      document.getElementById('bg').style.display = 'none' // 遮罩
    },
    // 选择时间时触发
    STime() {
      if (this.json.name === '' || this.json.name === '中国') {
        this.$message({
          message: '请选择城市！',
          type: 'warning',
          showClose: true
        })
        this.timx = this.checkTime2(new Date())
      } else {
        if ((new Date((new Date(this.timx)).getTime() + 24 * 60 * 60 * 1000)) < (new Date()).getTime()) {
          document.querySelectorAll('.fTime .img')[1].style.zIndex = 0
          document.querySelectorAll('.fTime .img')[1].style.opacity = 1
        } else {
          document.querySelectorAll('.fTime .img')[1].style.zIndex = -10
          document.querySelectorAll('.fTime .img')[1].style.opacity = 0
        }
        // 触发查询
        this.gatDate()
      }
    },
    // 减少时间
    ReduceTime() {
      if (this.json.name === '' || this.json.name === '中国') {
        this.$message({
          message: '请选择城市！',
          type: 'warning',
          showClose: true
        })
      } else {
        this.timx = this.checkTime2(new Date((new Date(this.timx)).getTime() - 24 * 60 * 60 * 1000))
        document.querySelectorAll('.fTime .img')[1].style.zIndex = 0
        document.querySelectorAll('.fTime .img')[1].style.opacity = 1
        // 触发查询
        this.gatDate()
      }
    },
    // 增加时间
    IncreaseTime() {
      if (this.json.name === '' || this.json.name === '中国') {
        this.$message({
          message: '请选择城市！',
          type: 'warning',
          showClose: true
        })
      } else {
        this.timx = this.checkTime2(new Date((new Date(this.timx)).getTime() + 24 * 60 * 60 * 1000))
        if ((new Date((new Date(this.timx)).getTime() + 24 * 60 * 60 * 1000)) < (new Date()).getTime()) {
          document.querySelectorAll('.fTime .img')[1].style.zIndex = 0
          document.querySelectorAll('.fTime .img')[1].style.opacity = 1
        } else {
          document.querySelectorAll('.fTime .img')[1].style.zIndex = -10
          document.querySelectorAll('.fTime .img')[1].style.opacity = 0
        }
        // 触发查询
        this.gatDate()
      }
    },
    // 传播天数改变
    days() {
      if (this.details !== {}) {
        this.LStroke()
      }
    },
    // 查询今日感染人员数据
    gatDate() {
      var that = this
      // 清空全部地图数据
      this.clearpp()
      document.getElementById('bg').style.display = 'block'
      var data = {}
      data.name = this.json.name
      data.where = this.json.where
      data.timz = that.checkTime3(new Date(that.timx))
      data.timx = that.checkTime3(new Date((new Date(data.timz)).getTime() + 24 * 60 * 60 * 1000))
      that.$store.dispatch('communication/CSTData', data).then((datas) => {
        that.tables = datas
        that.diagnosis = that.format(datas.length)
        document.getElementById('bg').style.display = 'none'
      })
    },
    s(row) {
      this.choice = row.编号
      this.dian()
    },
    // 选择人时
    dian() {
      // 表
      const PTTable = document.getElementById('PTTable')
      var maxLeft = window.innerWidth - PTTable.offsetWidth / 2 - 405
      PTTable.style.transition = '0.5s all'
      PTTable.style.left = maxLeft + 'px'
      PTTable.style.top = 'calc(100% + 430px)'
      setTimeout(function() {
        PTTable.style.transition = 'all 0s ease 0s'
      }, 500)
      this.details = {} // 用户信息
      this.trajectory = [] // 轨迹值
      // 清空全部地图数据
      this.clearpp()
      // this.des('gg')
      // 清空图例
      // if (this.lengend !== null) {
      //   this.lengend.remove()
      // }
    },
    // 加载行程数据
    LStroke() {
      if (this.json.table === '') {
        this.$message({
          message: '请选择疾病！',
          type: 'warning',
          showClose: true
        })
      } else
      if (this.choice === '') {
        this.$message({
          message: '请选择接触者！',
          type: 'warning',
          showClose: true
        })
      } else {
        this.clearpp()
        document.getElementById('bg').style.display = 'block'
        var that = this
        var data = {}
        data.id = this.choice
        data.name = this.json.name
        data.where = this.json.where
        data.timz = that.checkTime3(new Date(that.timx))
        data.timx = that.checkTime3(new Date((new Date(data.timz)).getTime() + 24 * 60 * 60 * 1000))
        data.timz = that.checkTime3(new Date((new Date(that.timx)).getTime() - 24 * 60 * 60 * 1000 * (that.tiansh - 1)))
        // 个人详细信息
        that.$store.dispatch('communication/CSPInformation', data).then((datas) => {
          that.$store.dispatch('communication/CSPTrajectory', data).then((dataz) => {
            document.getElementById('bg').style.display = 'none'
            this.details = datas[0] // 个人详细信息
            for (let i = 0; i < dataz.length; i++) {
              dataz[i].时间 = that.checkTime2(new Date(dataz[i].时间))
            }
            this.trajectory = dataz // 个人轨迹数据
            this.$refs.multipleTable.toggleAllSelection()
            // 行程数据点
            // console.log(dataz)
            this.oneline(dataz) // 加载个人行程轨迹
            that.bufferData = dataz
            // that.locus(dataz, 'gr')
            // 出现
            const PTTable = document.getElementById('PTTable')
            PTTable.style.transition = '0.5s all'
            PTTable.style.left = 'calc(50% - 30px)'
            PTTable.style.top = '50%'
            PTTable.style.transform = 'translate(-50%, -50%)'
            setTimeout(function() {
              PTTable.style.transition = 'all 0s ease 0s'
            }, 500)
          })
        })
      }
    },
    // 个人轨迹
    oneline(data) {
      // console.log(data)
      var that = this
      that.pathAll = []
      that.pointAll = []
      that.pointAll.push({ x: data[0].经度, y: data[0].纬度, icon: 'star', id: data[0].编号, 地点: data[0].地点, name: data[0].姓名, time: data[0].时间, img: data[0].头像 })
      var waypoints = ''
      if (data.length > 1) {
        for (let x = 1; x < data.length - 1; x++) {
          const element2 = data[x]
          that.pointAll.push({ x: element2.经度, y: element2.纬度, icon: 'after', id: element2.编号, 地点: element2.地点, name: element2.姓名, time: element2.时间, img: element2.头像 })
          if (x > 1) {
            waypoints += ';' + element2.经度 + ',' + element2.纬度
          } else {
            waypoints += element2.经度 + ',' + element2.纬度
          }
        }
        that.pointAll.push({ x: data[data.length - 1].经度, y: data[data.length - 1].纬度, icon: 'end', id: data[data.length - 1].编号, 地点: data[data.length - 1].地点, name: data[data.length - 1].姓名, time: data[data.length - 1].时间, img: data[data.length - 1].头像 })
      } else {
        that.map.flyTo({
          center: [data[0].经度, data[0].纬度],
          zoom: 15,
          speed: 2,
          curve: 1,
          easing(t) {
            return t
          }
        })
      }
      // 轨迹
      // origin起点，waypoints途经点（最大16），destination终点
      fetch(
        'https://restapi.amap.com/v3/direction/driving?origin=' + data[0].经度 + ',' + data[0].纬度 + '&waypoints=' + waypoints + '&destination=' + data[data.length - 1].经度 + ',' + data[data.length - 1].纬度 + '&output=JSON&key=49b3d756d1c570298d8b75eedf308f88'
      )
        .then(res => res.json())
        .then(datas => {
          var path = ''
          if (datas.status === '1') {
            for (let index = 0; index < datas.route.paths[0].steps.length; index++) {
              const element = datas.route.paths[0].steps[index]
              if (index !== datas.route.paths[0].steps.length - 1) {
                path += element.polyline + ';'
              } else {
                path += element.polyline
              }
            }
          }
          // 以;分数组将数组中在以,划分将内容转为数值
          var point = path.split(';').map(s => s.split(',').map(e => e * 1))
          that.pathAll.push({ information: data[0], path: point })
          if (data.length > 2) {
            if (that.pathAlllayer === null) {
              that.pathAlllayer = new LineLayer({
                zIndex: 5,
                autoFit: true })
                .source(that.pathAll, {
                  parser: {
                    type: 'json',
                    coordinates: 'path'
                  }
                })
                .size(4)
                .shape('line')
                .texture('road')
                .color('rgb(20, 180, 90)')
                .animate({
                  interval: 1, // 间隔
                  duration: 4, // 持续时间，延时
                  trailLength: 2 // 流线长度
                })
                .style({
                  lineTexture: false, // 开启线的贴图功能
                  iconStep: 50 // 设置贴图纹理的间距
                })
              this.pathAlllayer.zIndex = -100
              that.scene.addLayer(that.pathAlllayer)
            } else {
              this.pathAlllayer.zIndex = -100
              that.pathAlllayer.setData(that.pathAll)
            }
          }
          // 标记点
          if (that.pointAllLayer === null) {
            this.pointAllLayer = new PointLayer({ })
              .source(that.pointAll, {
                parser: {
                  type: 'json',
                  x: 'x',
                  y: 'y'
                }
              })
              .shape('icon', ['star', 'after', 'end', 'mi'])
              .size(20)
              .style({
              })
            this.pointAllLayer.zIndex = 1
            this.pointAllLayer.on('click', function(e) {
              // console.log(e)
              var lnglat = e.lngLat
              var feature = e.feature
              var html = '<p>编号：' + feature.id + '</p>\n<p>姓名：' + feature.name + '</p>\n<p>地点：' + feature.地点 + '</p>\n<p>时间：' + feature.time + '</p>'
              that.popup.setLngLat([lnglat.lng, lnglat.lat]).setHTML(html).addTo(that.map)
            })
            that.scene.addLayer(that.pointAllLayer)
          } else {
            this.pointAllLayer.zIndex = 1
            that.pointAllLayer.setData(that.pointAll)
          }
        })
    },
    // 全部人员轨迹
    allline(e) {
      var that = this
      var pathAll = []
      var leng = e.length
      for (let j = 0; j < e.length; j++) {
        const element = e[j]
        leng--
        if (element.length >= 2) {
          var waypoints = ''
          for (let x = 1; x < element.length - 1; x++) {
            const element2 = element[x]
            if (x > 1) {
              waypoints += ';' + element2.经度 + ',' + element2.纬度
            } else {
              waypoints += element2.经度 + ',' + element2.纬度
            }
          }
          // origin起点，waypoints途经点（最大16），destination终点
          fetch(
            'https://restapi.amap.com/v3/direction/driving?origin=' + element[0].经度 + ',' + element[0].纬度 + '&waypoints=' + waypoints + '&destination=' + element[element.length - 1].经度 + ',' + element[element.length - 1].纬度 + '&output=JSON&key=49b3d756d1c570298d8b75eedf308f88'
          )
            .then(res => res.json())
            .then(data => {
              var path = ''
              if (data.status === '1') {
                for (let index = 0; index < data.route.paths[0].steps.length; index++) {
                  const element = data.route.paths[0].steps[index]
                  if (index !== data.route.paths[0].steps.length - 1) {
                    path += element.polyline + ';'
                  } else {
                    path += element.polyline
                  }
                }
              }
              // 以;分数组将数组中在以,划分将内容转为数值
              var point = path.split(';').map(s => s.split(',').map(e => e * 1))
              // const color = this.getRandomColor()\
              var color = '#'
              var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']
              for (var i = 0; i < 6; i++) {
                var num = parseInt(Math.random() * 16)
                color += arr[num]
              }
              pathAll.push({ color: color, information: element[0], path: point })
              if (leng === 0) {
                setTimeout(() => {
                  document.getElementById('bg').style.display = 'none'
                  var name1 = []
                  var color1 = []
                  for (let x = 0; x < pathAll.length; x++) {
                    const element = pathAll[x]
                    name1.push(element.information.姓名)
                    color1.push(element.color)
                  }
                  if (this.otherlineLayer === null) {
                  // eslint-disable-next-line no-undef
                    that.otherlineLayer = new LineLayer({
                      autoFit: true
                    })
                      .source(pathAll, {
                        parser: {
                          type: 'json',
                          coordinates: 'path'
                        }
                      })
                      .size(1.5)
                      .shape('line')
                      .color(
                        'color', v => {
                          return `${v}`
                        }
                      )
                      .animate({
                        interval: 0.6,
                        trailLength: 1.5,
                        duration: 6
                      })
                    that.scene.addLayer(that.otherlineLayer)
                    that.otherlineLayer.zIndex = -1
                    // 图例
                    that.legend = new Control({
                      // position: 'bottomright'
                    })
                    that.legend.onAdd = function() {
                      const el = document.createElement('div')
                      el.className = 'infolegend legend'
                      // el.innerHTML +=
                      const grades = name1
                      const color = color1
                      for (var i = 0; i < grades.length; i++) {
                        el.innerHTML += '<i style="background:' +
                          color[i] + '"></i><p>' + grades[i] + '</p><br>'
                      }
                      return el
                    }
                    that.scene.addControl(that.legend)
                  } else {
                    that.legend.onAdd = function() {
                      const el = document.getElementsByClassName('infolegend legend')[0]
                      el.innerHTML = ''
                      // el.innerHTML +=
                      const grades = name1
                      const color = color1
                      for (var i = 0; i < grades.length; i++) {
                        el.innerHTML += '<i style="background:' +
                          color[i] + '"></i><span>' + grades[i] + '</span><br>'
                      }
                      return el
                    }
                    that.scene.addControl(that.legend)
                    that.otherlineLayer.setData(pathAll)
                    that.otherlineLayer.zIndex = -1
                  }
                }, 200)
              }
            })
        }
      }
    },
    // 创建缓冲区
    buffer() {
      var that = this
      const metersToPixelsAtMaxZoom = (meters, latitude) =>
        meters / 0.075 / Math.cos(latitude * Math.PI / 180)
      // var pointFeature = []
      // console.log(this.bufferData)
      for (let index = 0; index < this.bufferData.length; index++) {
        var pointFeature = []
        const element = that.bufferData[index]
        pointFeature.push({
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [element.经度, element.纬度]
          }
        })
        var pointsoure = {
          'type': 'FeatureCollection',
          'crs': { 'type': 'name', 'properties': { 'name': 'urn:ogc:def:crs:OGC:1.3:CRS84' }}, 'features': pointFeature
        }
        that.map.addSource('point' + index, {
          'type': 'geojson',
          'data': pointsoure
        })
        that.map.addLayer({
          'id': 'points' + index,
          'type': 'circle',
          'source': 'point' + index,
          'paint': {
            'circle-color': 'rgba(255,255,255,0)',
            'circle-radius': that.fanwei,
            'circle-stroke-width': 3,
            'circle-stroke-color': '#cf45cf'
          }
        })
        that.map.setPaintProperty('points' + index, 'circle-radius', {
          stops: [
            [0, 0],
            [20, metersToPixelsAtMaxZoom(that.fanwei * 1, element.纬度)]
          ],
          base: 2
        })
      }
      var isExistence = false
      var layers = that.map.getStyle().layers
      for (let index = 0; index < layers.length; index++) {
        const element = layers[index].id
        if (element === 'points') {
          isExistence = true
        }
      }
      // if (isExistence === false) {
      //   that.map.addSource('point', {
      //     'type': 'geojson',
      //     'data': pointsoure
      //   })
      //   that.map.addLayer({
      //     'id': 'points',
      //     'type': 'circle',
      //     'source': 'point',
      //     'paint': {
      //       'circle-color': 'rgba(255,255,255,0)',
      //       'circle-radius': that.fanwei,
      //       'circle-stroke-width': 3,
      //       'circle-stroke-color': '#cf45cf'
      //     }
      //   })
      // } else {
      //   that.map.setLayoutProperty('points', 'visibility', 'visible')
      //   that.map.getSource('point').setData(pointsoure)
      //   that.map.setPaintProperty('points', 'circle-radius', that.fanwei)
      // }
    },
    // 清空地图
    clearpp() {
      var that = this
      if (that.pathAlllayer !== null) {
        that.pathAlllayer.setData([])
      }
      if (that.pointAllLayer !== null) {
        that.pointAllLayer.setData([])
      }
      if (that.otherlineLayer !== null) {
        that.otherlineLayer.setData([])
      }
      if (that.map.getSource('point') !== undefined) {
        that.map.setLayoutProperty('points', 'visibility', 'none')
      }
    },
    // 输入框输入事件
    shuru() {
      var that = this
      AMap.plugin('AMap.Geocoder', function() {
        that.geocoder = new AMap.Geocoder({
          radius: 1000 // 范围，默认：500
        })
      })
      this.geocoder.getLocation(this.place, function(status, result) {
        if (status === 'complete' && result.geocodes.length) {
          var lnglat = result.geocodes[0].location
          that.newx = lnglat.lng
          that.newy = lnglat.lat
        } else {
          console.log('根据地址查询位置失败')
        }
      })
    },
    // 新增
    add(e) {
      this.post(0)
      this.state = 0
      this.timeZon = ''
      this.place = ''
    },
    // 编辑
    edit(e) {
      this.post(0)
      this.state = 1
      this.timeZon = this.checkTime4(new Date(e.时间))
      this.place = e.地点
      this.newx = e.经度
      this.newy = e.纬度
      this.TStorage = e // 暂存值
    },
    // 提交
    submits(e) {
      var that = this
      if (that.state === 0) { // 新增
        if (that.timeZon === '') {
          that.$message({
            message: '时间不能为空！',
            type: 'warning',
            showClose: true
          })
        } else if (that.place === '') {
          that.$message({
            message: '地点不能为空！',
            type: 'warning',
            showClose: true
          })
        } else if (that.newx === '' || that.newy === '') {
          that.$message({
            message: '地点无效！',
            type: 'warning',
            showClose: true
          })
        } else {
          const data = {}
          data.where = that.json.where
          data.name = that.json.name
          data.id = that.details.编号
          data.time = that.checkTime2(new Date(that.timeZon))
          data.x = that.newx
          data.y = that.newy
          data.value = that.place
          that.$store.dispatch('communication/ICBPlace', data).then((dataz) => {
            that.$message({
              message: dataz.msg,
              type: dataz.type,
              showClose: true
            })
            that.LStroke()
            that.post(1)
          })
        }
      } else { // 编辑
        const data = {}
        data.id = that.TStorage.编号
        data.value = that.TStorage.地点
        data.where = that.json.where
        data.name = that.json.name
        data.newx = that.newx
        data.newy = that.newy
        data.newvalue = that.place
        data.time = that.checkTime2(new Date(that.timeZon))
        that.$store.dispatch('communication/UCBPlace', data).then((dataz) => {
          that.$message({
            message: dataz.msg,
            type: dataz.type,
            showClose: true
          })
          that.LStroke()
          that.post(1)
        })
      }
    },
    // 删除
    deletes(e) {
      var that = this
      var data = {}
      data.id = e.编号
      data.value = e.地点
      data.where = that.json.where
      data.name = that.json.name
      that.$store.dispatch('communication/DCBPlace', data).then((dataz) => {
        that.$message({
          message: dataz.msg,
          type: dataz.type,
          showClose: true
        })
        that.LStroke()
      })
    },
    handleSelectionChange(val) {
      this.SValue = val
    },
    // 密接人员查询
    query() {
      this.nodes = []
      this.links = []
      this.Complex(this.details, this.SValue) // 祖宗
      const a = this.pointAll
      this.buffer(a)
    },
    // 路径与关系图谱创建
    Complex(user, value) {
      var that = this
      document.getElementById('bg').style.display = 'block'
      that.RMap(user) // 将父亲加入关系图谱
      var id = user.编号 // 将父亲ID拿到
      // 清空
      that.personnel = [] // 子的列表
      that.personnels = [] // 子的详细信息列表
      // 条件
      var leng = value.length
      for (let i = 0; i < value.length; i++) {
        var data = {}
        data.id = that.details.编号
        data.where = that.json.where
        data.name = that.json.name
        data.x = value[i].经度
        data.y = value[i].纬度
        data.radius = that.fanwei / 1000
        var c = new Date(value[i].时间) // 中间时间
        data.timz = that.checkTime2(new Date(c.setMinutes((new Date(value[i].时间).getMinutes()) - that.jiange * 1 / 2)))
        data.timx = that.checkTime2(new Date(c.setMinutes((new Date(value[i].时间).getMinutes()) + that.jiange * 1 / 2)))
        that.$store.dispatch('communication/CSBuffer', data).then((dataz) => {
          // console.log(dataz)
          for (let i = 0; i < dataz.length; i++) {
            that.pointAll.push({ x: dataz[i].经度, y: dataz[i].纬度, icon: 'mi', id: dataz[i].编号, 地点: dataz[i].地点, name: dataz[i].姓名, time: dataz[i].时间, img: dataz[i].头像 })
            if (that.personnel.indexOf(dataz[i].编号) === -1) {
              that.personnel.push(dataz[i].编号)
              that.personnels.push(dataz[i])
              // 将儿子加入关系图谱
              that.RMap(dataz[i])
              // 记录父子关系
              var gong = {}
              gong.from = id
              gong.to = dataz[i].编号
              that.links.push(gong)
            }
          }
          leng--
          // 密接行程轨迹
          if (leng === 0) {
            // console.log(that.pointAll)
            that.pointAllLayer.setData(that.pointAll)
            // 收起表
            const PTTable = document.getElementById('PTTable')
            var maxLeft = window.innerWidth - PTTable.offsetWidth / 2 - 405
            PTTable.style.transition = '0.5s all'
            PTTable.style.left = maxLeft + 'px'
            PTTable.style.top = window.innerHeight + 120 + 'px'
            setTimeout(function() {
              PTTable.style.transition = 'all 0s ease 0s'
            }, 500)
            // 加载轨迹
            that.maichongTimes = 0
            that.dataMap = []
            // 创建个人脉冲线
            that.isgrtimes = true
            var dataAll = []
            var addint = that.personnels.length
            if (addint !== 0) {
              for (let i = 0; i < that.personnels.length; i++) {
                var data = {}
                data.id = that.personnels[i].编号
                data.name = this.json.name
                data.where = this.json.where
                data.timz = that.checkTime3(new Date(that.timx))
                data.timx = that.checkTime3(new Date((new Date(data.timz)).getTime() + 24 * 60 * 60 * 1000))
                data.timz = that.checkTime3(new Date((new Date(that.timx)).getTime() - 24 * 60 * 60 * 1000 * (that.tiansh - 1)))
                that.$store.dispatch('communication/CSPTrajectory', data).then((dataz) => {
                  dataAll.push(dataz)
                  addint--
                  if (addint === 0) {
                    that.allline(dataAll)
                  }
                })
              }
            } else {
              that.$message({
                message: '未查询到密接人员！',
                type: 'warning',
                showClose: true
              })
              document.getElementById('bg').style.display = 'none'
            }
          }
        })
      }
    },
    // 关系图谱值
    RMap(e) {
      var gong = {}
      gong.id = e.编号
      gong.name = e.姓名
      gong.value = e.地点
      gong.time = this.checkTime2(new Date(e.时间))
      gong.innerHTML = '<div class="c-my-node" style="background-image: url(' + e.头像 + ');border:#ff875e solid 3px;"><div class="c-node-name" style="color:#ff875e">' + e.姓名 + '</div></div>'
      this.nodes.push(gong) // 将父亲添加到 关系图谱中
    },
    // 关系图谱生成
    setGraphData() {
      for (let i = 0; i < this.nodes.length; i++) {
        this.graphdata.rootId = this.nodes[i]
        break
      }
      this.nodes.forEach(element => {
        element.flated = false
      })
      this.graphdata.nodes = this.nodes
      this.graphdata.links = this.links
      this.$refs.seeksRelationGraph.setJsonData(this.graphdata, (seeksRGGraph) => {
        // 这些写上当图谱初始化完成后需要执行的代码
      })
    },
    shengcheng() {
      if (this.nodes.length !== 0) {
        // 收起表
        const PTTable = document.getElementById('PTTable')
        var maxLeft = window.innerWidth - PTTable.offsetWidth / 2 - 405
        PTTable.style.transition = '0.5s all'
        PTTable.style.left = maxLeft + 'px'
        PTTable.style.top = window.innerHeight + 120 + 'px'
        setTimeout(function() {
          PTTable.style.transition = 'all 0s ease 0s'
        }, 500)
        this.relationShow = true
        this.relationPost()
        this.setGraphData()
      } else {
        this.$message({
          message: '请先开始密接查询！',
          type: 'warning',
          showClose: true
        })
      }
    },
    addrelatonship() {
      document.getElementById('addrelationship').style.display = 'block'
    },
    backrelatonship() {
      document.getElementById('addrelationship').style.display = 'none'
    },
    addxiansuo() {
      if (this.form.relation === '') {
        this.$message({
          message: '请补充信息！',
          type: 'warning',
          showClose: true
        })
      } else {
        var graph = this.$refs.seeksRelationGraph
        var _index = graph.getNodes().length + 1
        var _new_node_id = 'xiaodi-' + _index
        var _new_node_name = this.form.name
        var _old_form = this.form.relation
        var __graph_json_data = {
          nodes: [
            { id: _new_node_id, name: _new_node_name + _index, innerHTML: '<div class="c-my-node" style="background-image: url(https://wx2.sinaimg.cn/mw600/006qkfXVly1g8t75zyqkvj30u00uc42f.jpg);border:#ff875e solid 3px;"><div class="c-node-name" style="color:#ff875e">' + _new_node_name + '</div></div>' }
          ],
          links: [
            { from: _old_form, to: _new_node_id }
          ]
        }
        graph.appendJsonData(__graph_json_data, true, (seeksRGGraph) => {
        // 这些写上当图谱初始化完成后需要执行的代码
        })
        document.getElementById('addrelationship').style.display = 'none'
      }
    },
    // 窗体位置
    post(e) {
      // 0隐藏下去，1显示出来
      if (e === 0) {
        // 表
        const PTTable = document.getElementById('PTTable')
        var maxLeft = window.innerWidth - PTTable.offsetWidth / 2 - 405
        PTTable.style.transition = '0.5s all'
        PTTable.style.left = maxLeft + 'px'
        PTTable.style.top = window.innerHeight + 120 + 'px'
        setTimeout(function() {
          PTTable.style.transition = 'all 0s ease 0s'
        }, 500)
        // 编辑/添加
        const business = document.getElementById('business')
        business.style.transition = '0.5s all'
        business.style.left = '50%'
        business.style.top = '50%'
        business.style.transform = 'translate(-50%, -50%)'
        setTimeout(function() {
          business.style.transition = 'all 0s ease 0s'
        }, 500)
      } else {
        // 表
        const PTTable = document.getElementById('PTTable')
        PTTable.style.transition = '0.5s all'
        PTTable.style.left = 'calc(50% - 30px)'
        PTTable.style.top = '50%'
        PTTable.style.transform = 'translate(-50%, -50%)'
        setTimeout(function() {
          PTTable.style.transition = 'all 0s ease 0s'
        }, 500)
        // 编辑/添加
        const business = document.getElementById('business')
        var maxLeft1 = window.innerWidth - business.offsetWidth / 2 - 405
        business.style.transition = '0.5s all'
        business.style.left = maxLeft1 + 'px'
        business.style.top = window.innerHeight + 160 + 'px'
        setTimeout(function() {
          business.style.transition = 'all 0s ease 0s'
        }, 500)
      }
    },
    relationPost() {
      const relationShip = document.getElementById('relationShip')
      relationShip.style.transition = '0.5s all'
      relationShip.style.left = 'calc(50% - 30px)'
      relationShip.style.top = '50%'
      relationShip.style.transform = 'translate(-50%, -50%)'
      setTimeout(function() {
        relationShip.style.transition = 'all 0s ease 0s'
      }, 500)
    },
    // 关闭弹窗
    close() {
      this.post(1)
    },
    relationclose() {
      this.relationShow = false
      this.graphdata.nodes = ''
      this.graphdata.nodes = []
      this.graphdata.links = []
    },
    // 移动
    m1(event) {
      var that = this
      const PTTable = document.getElementById('PTTable')
      const x = event.pageX - PTTable.offsetLeft
      const y = event.pageY - PTTable.offsetTop
      this.canMove = true
      document.onmouseup = function() {
        that.canMove = false
        document.onmousemove = null
        document.onmouseup = null
      }
      document.onmousemove = function(e) {
        if (that.canMove) {
          var left = e.clientX - x
          var top = e.clientY - y
          if (left < 0) left = 0
          if (top < 0) top = 0
          var maxLeft = window.innerWidth - PTTable.offsetWidth / 2 - 405
          var minLeft = PTTable.offsetWidth / 2 + 40
          var maxTop = window.innerHeight - PTTable.offsetHeight / 2 + 335
          var minTop = PTTable.offsetHeight / 2
          if (left > maxLeft) left = maxLeft
          if (left < minLeft) left = minLeft
          if (top > maxTop) top = maxTop
          if (top < minTop) top = minTop
          PTTable.style.left = left + 'px'
          PTTable.style.top = top + 'px'
        }
      }
    },
    m2(event) {
      var that = this
      const business = document.getElementById('business')
      const x = event.pageX - business.offsetLeft
      const y = event.pageY - business.offsetTop
      this.canMove = true
      document.onmouseup = function() {
        that.canMove = false
        document.onmousemove = null
        document.onmouseup = null
      }
      document.onmousemove = function(e) {
        if (that.canMove) {
          var left = e.clientX - x
          var top = e.clientY - y
          if (left < 0) left = 0
          if (top < 0) top = 0
          var maxLeft = window.innerWidth - business.offsetWidth / 2 - 405
          var minLeft = business.offsetWidth / 2 + 40
          var maxTop = window.innerHeight - business.offsetHeight / 2 + 65
          var minTop = business.offsetHeight / 2
          if (left > maxLeft) left = maxLeft
          if (left < minLeft) left = minLeft
          if (top > maxTop) top = maxTop
          if (top < minTop) top = minTop
          business.style.left = left + 'px'
          business.style.top = top + 'px'
        }
      }
    },
    m3(event) {
      var that = this
      const PTTable = document.getElementById('relationShip')
      const x = event.pageX - PTTable.offsetLeft
      const y = event.pageY - PTTable.offsetTop
      this.canMove = true
      document.onmouseup = function() {
        that.canMove = false
        document.onmousemove = null
        document.onmouseup = null
      }
      document.onmousemove = function(e) {
        if (that.canMove) {
          var left = e.clientX - x
          var top = e.clientY - y
          if (left < 0) left = 0
          if (top < 0) top = 0
          var maxLeft = window.innerWidth - PTTable.offsetWidth / 2 - 405
          var minLeft = PTTable.offsetWidth / 2 + 40
          var maxTop = window.innerHeight - PTTable.offsetHeight / 2 + 335
          var minTop = PTTable.offsetHeight / 2
          if (left > maxLeft) left = maxLeft
          if (left < minLeft) left = minLeft
          if (top > maxTop) top = maxTop
          if (top < minTop) top = minTop
          PTTable.style.left = left + 'px'
          PTTable.style.top = top + 'px'
        }
      }
    },
    // 时间处理
    checkTime(i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
    },
    // 时间处理2
    checkTime2(i) {
      var that = this
      return i.getFullYear() + '-' + that.checkTime(i.getMonth() + 1) + '-' + that.checkTime(i.getDate()) + ' ' + that.checkTime(i.getHours()) + ':' + that.checkTime(i.getMinutes())
    },
    // 时间处理3
    checkTime3(i) {
      var that = this
      return i.getFullYear() + '-' + that.checkTime(i.getMonth() + 1) + '-' + that.checkTime(i.getDate()) + ' ' + '00' + ':' + '00'
    },
    // 时间处理4
    checkTime4(i) {
      var that = this
      return i.getFullYear() + '-' + that.checkTime(i.getMonth() + 1) + '-' + that.checkTime(i.getDate()) + ' ' + that.checkTime(i.getHours()) + ':' + that.checkTime(i.getMinutes()) + ':' + that.checkTime(i.getSeconds())
    },
    // 数字处理
    format(number) {
      var str = parseInt(number).toString()
      var len = str.length
      if (len <= 3) { return str }
      var r = len % 3
      return r > 0 ? str.slice(0, r) + ',' + str.slice(r, len).match(/\d{3}/g).join(',') : str.slice(r, len).match(/\d{3}/g).join(',')
    }
  }
}
</script>
<style scoped>
@font-face {
  src: url("./public/font/KuHei.ttf");
  font-family: "KuHei";
}
@font-face {
  src: url("./public/font/Microsoft-YaHei.ttf");
  font-family: "YaHei";
}
@font-face {
  src: url("./public/font/DS-DIGIT.ttf");
  font-family: "DIGIT";
}
#Communicationmap {
  position: absolute;
  height: 100%;
  width: 100%;
  background: url("./public/img/back.png") no-repeat center center;
  /* 背景图不平铺 */
  background-size: cover;
  /* 让背景图基于容器大小伸缩 */
  background-attachment: fixed;
  /* 当内容高度大于图片高度时，背景图像的位置相对于viewport固定 */
  background-color: #CCCCCC;
}
#Communicationmap ul,
#Communicationmap p {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
/* 地图 */
#map1 {
  position: absolute;
  width: 100%;
  height: 100%;
}
#map1 >>> .l7-ctrl-logo {
  display: none;
}
#map1 >>> .legend {
	line-height: 18px;
	color: #555;
  background-color: rgba(95, 158, 160, 0.418);
}
#map1 >>> .legend i {
	width: 18px;
	height: 18px;
	float: left;
	margin-right: 8px;
	opacity: 0.7;
}

/* 地图弹框样式 */
#map1 >>> .mapboxgl-popup-anchor-bottom {
  z-index: 10;
}
/**===== xuan =====*/
#bg {
  display: none;
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(140, 140, 140, 0.4);
  z-index: 999;
}
#bg #xuan {
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  height: 50px;
  width: 70px;
  margin: -25px 0 0 -25px;
}
#bg #xuan span {
  width: 25px;
  height: 25px;
  background-color: #ff7979;
  display: inline-block;
  -webkit-animation: square3 1.7s infinite ease-in-out both;
  animation: square3 1.7s infinite ease-in-out both;
}
#bg #xuan span:nth-child(1) {
  left: 0px;
  -webkit-animation-delay: 0.1s;
  animation-delay: 0.1s;
}
#bg #xuan span:nth-child(2) {
  left: 15px;
  -webkit-animation-delay: 0.6s;
  animation-delay: 0.6s;
}
#bg #xuan span:nth-child(3) {
  left: 30px;
  -webkit-animation-delay: 1.1s;
  animation-delay: 1.1s;
}
#bg #xuan span:nth-child(4) {
  left: 45px;
  -webkit-animation-delay: 1.5s;
  animation-delay: 1.5s;
}
@keyframes square3 {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
    opacity: 0;
  }
  50% {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 1;
  }
  100% {
    -webkit-transform: rotate(60deg);
    transform: rotate(60deg);
    opacity: .5;
  }
}
@-webkit-keyframes square3 {
  0% {
    -webkit-transform: scale(0);
    opacity: 0;
  }
  50% {
    -webkit-transform: scale(1);
    opacity: 1;
  }
  100% {
    -webkit-transform: rotate(60deg);
    opacity: .5;
  }
}
/** END of xuan */
/* 屏蔽高德logo */
#Communicationmap >>> .amap-copyright {
  display: none !important;
}
/* 展示 */
#Communicationmap .exhibition {
  position: absolute;
  left: 45px;
  top: 5px;
  color: rgb(180, 180, 180);
  width: 200px;
  height: auto;
  text-align: center;
  z-index: 10;
}
#Communicationmap .exhibition li {
  background: url("./public/img/ba.png")rgba(79, 133, 177, 0.3);
  background-size: 100% 100%;
  height: 90px;
  margin: 5px 0;
  position: relative;
}
#Communicationmap .exhibition li .Tspan {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 10px;
}
#Communicationmap .exhibition li .publis {
  position: absolute;
  width: 100%;
  top: 10px;
  margin: 0;
  padding: 0;
  height: 25px;
  line-height: 25px;
  letter-spacing: 2px;
  font-family: KuHei;
  cursor: pointer;
  transition: all 1s;
  font-size: 15px;
}
#Communicationmap .exhibition li .publis:hover {
  color: rgb(230, 230, 230);
}
#Communicationmap .exhibition li .numbers {
  position: absolute;
  top: 35px;
  height: 55px;
  line-height: 55px;
  width: 100%;
  font-family: DIGIT;
  font-size: 28px;
  color: #fff;
}
/* 参数设置 */
#Communicationmap #parameter .setup {
  height: 320px;
  width: 250px;
  position: absolute;
  left: 45px;
  top: 50%;
  transform: translate(0, -50%);
  /* border: 1.5px solid #0fafeb; */
  /* background: url("./public/img/bg.png") rgba(255, 255, 255, 0.1); */
  background: url("./public/img/bn.png") ;
  background-size: 100% 100%;
  color: #fff;
  font-family: KuHei;
  z-index: 10;
}
#Communicationmap #parameter .setup .ding {
  height: 40px;
  line-height: 40px;
  width: 100%;
  text-align: center;
  border-bottom: 2px dashed rgba(219, 219, 219, 0.555);
  letter-spacing: 3px;
  position: absolute;

}
#Communicationmap #parameter .setup .di {
  height: 230px;
  width: 250px;
  position: absolute;
  top: 40px;
}
#Communicationmap #parameter .setup .xuanz {
  height: 50px;
  line-height: 50px;
  width: 100%;
  position: absolute;
  top: 270px;
  text-align: center;
  border-top: 2px dashed rgba(219, 219, 219, 0.555);
  letter-spacing: 3px;
  cursor: pointer;
}
#Communicationmap #parameter .setup li {
  position: absolute;
  width: 100%;
  height: 57.5px;
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
}
#Communicationmap #parameter .setup li:nth-child(1) {
  top: 0;
}
#Communicationmap #parameter .setup li:nth-child(2) {
  top: calc(100% / 4 * 1);
}
#Communicationmap #parameter .setup li:nth-child(3) {
  top: calc(100% / 4 * 2);
}
#Communicationmap #parameter .setup li:nth-child(4) {
  top: calc(100% / 4 * 3);
}
#Communicationmap #parameter .setup li .Sleft {
  width: 80px;
  height: 57.5px;
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
}
#Communicationmap #parameter .setup li .Sright {
  width: 120px;
  height: 57.5px;
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
}
#Communicationmap #parameter .setup li .Sright >>> .el-input__inner {
  border: none;
  background-color: rgba(255, 255, 255, 0);
  border-radius: 0;
  border-bottom: 2px solid rgba(219, 219, 219, 0.555);
  font-family: KuHei;
  color: #fff;
  width: 100px;
  margin: 0;
  padding: 0;
  padding-right: 30px;
}
#Communicationmap #parameter .setup li .Sright >>> .el-input-number__increase,
#Communicationmap #parameter .setup li .Sright >>> .el-input-number__decrease,
#Communicationmap #parameter .setup li .Sright >>> .is-disabled {
  margin: 0;
  background-color: rgba(255, 255, 255, 0);
  border: none;
  transform: scale(1.6);
  color: #fff;
}
#Communicationmap #parameter .setup li .Sright >>> .is-disabled {
  display: none;
}
#Communicationmap #parameter .setup li .Sright >>> .el-input-number__increase:hover,
#Communicationmap #parameter .setup li .Sright >>> .el-input-number__decrease:hover {
  color: #ff7979;
}
/* 个人轨迹表 */
#Communicationmap #PTTable {
  position: absolute;
  top: calc(100% + 430px);
  left: calc(50% - 30px);
  transform: translate(-50%, -50%);
  width: 790px;
  height: 430px;
  background: rgba(40, 43, 57, 0.85);
  z-index: 90;
}
#Communicationmap #PTTable .top {
  height: 30px;
  line-height: 30px;
  text-align: center;
  width: 790px;
  color: #fff;
  border-bottom: 1px solid #fff;
  cursor: move;
}
#Communicationmap #PTTable .body {
  height: 400px;
  width: 790px;
  color: #fff;
  font-family: KuHei;
  text-align: center;
}
#Communicationmap #PTTable .body .left {
  height: 400px;
  width: 200px;
  position: absolute;
  left: 0;
  border-right: 1px dashed #fff;
}
#Communicationmap #PTTable .body .left .personal {
  height: 170px;
  line-height: 170px;
  width: 200px;
  text-align: center;
  border-bottom: 1px dashed rgba(219, 219, 219, 0.555);
}
#Communicationmap #PTTable .body .left .personal >>> .el-image {
  width: 100px;
  height: 100px;
  margin: 0 !important;
  margin-top: 10px !important;
  border-radius: 5px;
}
#Communicationmap #PTTable .body .right {
  height: 400px;
  width: 590px;
  position: absolute;
  right: 0;
}
#Communicationmap #PTTable .body .right .nAdded {
  position: absolute;
  width: 65px;
  height: 47px;
  line-height: 47px;
  right: 0;
  font-size: 12px;
  transition: all 0.5s;
  color: rgba(255, 255, 255, 0.8);
  z-index: 11;
  cursor: pointer;
}
#Communicationmap #PTTable .body .right .nAdded:hover {
  font-size: 13px;
  color: rgba(255, 255, 255, 1);
}
#Communicationmap #PTTable .body .right .table {
  height: 350px;
  width: 590px;
}
#Communicationmap #PTTable .body .right .table >>> .el-table thead {
  font-family: KuHei;
  color: #fff;
  letter-spacing: 5px;
}
#Communicationmap #PTTable .body .right .table >>> .el-table {
  font-family: KuHei;
  color: #fff;
}
#Communicationmap #PTTable .body .right .table >>> .el-table td {
  border: none;
}
#Communicationmap #PTTable .body .right .table >>> .el-table,
#Communicationmap #PTTable .body .right .table >>> .el-table__expanded-cell {
  background-color: rgba(255, 255, 255, 0);
}
#Communicationmap #PTTable .body .right .table >>> .el-table__body tr.current-row>td,
#Communicationmap #PTTable .body .right .table >>> .el-table th,
#Communicationmap #PTTable .body .right .table >>> .el-table tr {
  background-color: rgba(255, 255, 255, 0);
}
#Communicationmap #PTTable .body .right .table >>> .el-table--border::after,
#Communicationmap #PTTable .body .right .table >>> .el-table--group::after,
#Communicationmap #PTTable .body .right .table >>> .el-table::before {
  background-color: rgba(255, 255, 255, 0);
}
#Communicationmap #PTTable .body .right .table >>> .el-table--enable-row-hover .el-table__body tr:hover>td{
  background-color: rgba(255, 255, 255, 0.1);
  cursor: pointer;
}
#Communicationmap #PTTable .body .right .table >>> .el-radio__label {
  display: none;
}
#Communicationmap #PTTable .body .right .table >>> .el-radio {
  color: #fff;
  margin-right: 10px !important;
}
#Communicationmap #PTTable .body .right .table >>> .el-radio__inner::after {
  left: 54.2%;
  top: 53.3%;
}
#Communicationmap #PTTable .body .right .table >>> .el-radio__input.is-checked+.el-radio__label {
  color: #ff7979;
}
#Communicationmap #PTTable .body .right .table >>> .el-radio__input.is-checked .el-radio__inner {
  border-color: #ff7979;
  background: #ff7979;
}
#Communicationmap #PTTable .body .right .confirm {
  height: 50px;
  line-height: 50px;
  width: 590px;
  border-top: 2px dashed rgba(219, 219, 219, 0.555);
  color: rgba(255, 255, 255, 0.9);
  transition: all 0.5s;
  cursor: pointer;
}
#Communicationmap #PTTable .body .right .confirm:hover {
  color: rgba(255, 255, 255, 1);
}
/* 新增/编辑 */
#Communicationmap #business {
  position: absolute;
  width: 400px;
  height: 160px;
  top: calc(100% + 160px);
  left: calc(100% - 805px);
  z-index: 91;
  background: rgba(40, 43, 57, 0.85);
  color: #fff;
  font-family: KuHei;
}
#Communicationmap #business .top {
  width: 400px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-bottom: 1px solid #fff;
  cursor: move;
}
#Communicationmap #business .close {
  position: absolute;
  width: 5px;
  height: 30px;
  line-height: 30px;
  top: 0;
  right: 15px;
  text-align: center;
  cursor: pointer;
  z-index: 2;
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
}
#Communicationmap #business .close:hover {
  color: rgba(255, 255, 255, 1);
}
#Communicationmap #business .body {
  position: absolute;
  top: 30px;
  width: 400px;
  height: 100px;
}
#Communicationmap #business .body li {
  position: absolute;
  height: 50%;
  width: 100%;
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
}
#Communicationmap #business .body li:nth-child(1) {
  top: 0;
  text-align: center;
}
#Communicationmap #business .body li:nth-child(2) {
  top: calc(50%);
  text-align: center;
}
#Communicationmap #business .body li .bleft {
  width: 100px;
  height: 50px;
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
}
#Communicationmap #business .body li .bright {
  width: 300px;
  height: 50px;
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
}
#Communicationmap #business .body >>> .el-input__prefix,
#Communicationmap #business .body >>> .el-input__suffix {
  display: none;
}
#Communicationmap #business .body >>> .el-input__inner {
  background-color: rgba(255, 255, 255, 0) ;
  border: none;
  font-family: KuHei;
  color: #fff;
  text-align: center;
  width: 220px;
  border-bottom: 2px solid rgba(219, 219, 219, 0.555);
  height: 30px;
  border-radius: 0;
  cursor: pointer;
  user-select: none;
  padding: 0 10px;
}
#Communicationmap #business .body >>> .el-date-editor.el-input,
#Communicationmap #business .body >>> .el-date-editor.el-input__inner {
  width: 220px;
}
#Communicationmap #business .botton {
  position: absolute;
  bottom: 0;
  width: 400px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-top: 1px solid #fff;
  cursor: pointer;
}
/* 个人关系图谱 */
#Communicationmap #relationShip{
  position: absolute;
  top: calc(100% + 430px);
  left: calc(20% - 30px);
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  background: rgba(40, 43, 57, 0.85);
  z-index: 90;
}
#Communicationmap #relationShip .top {
  height: 30px;
  line-height: 30px;
  text-align: center;
  width: 600px;
  color: #fff;
  border-bottom: 1px solid #fff;
  cursor: move;
}
#Communicationmap #relationShip .close {
  position: absolute;
  width: 5px;
  height: 30px;
  line-height: 30px;
  top: 0;
  right: 15px;
  text-align: center;
  cursor: pointer;
  z-index: 2;
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
}
#Communicationmap #relationShip .close:hover {
  color: rgba(255, 255, 255, 1);
}
#Communicationmap #relationShip .body {
  width: 600px;
  height: 570px;
  position: relative;
}
/* 关系图谱-工具 */
#Communicationmap #relationShip .body >>> .c-mini-namefilter {
  display: none;
}
#Communicationmap #relationShip .body >>> .c-mini-toolbar {
  position: absolute;
  margin: 0 !important;
  padding: 0 !important;
  top: 0px;
  left: 0px;
  z-index: 10;
}
#Communicationmap #relationShip .body >>> .c-mb-button {
  position: relative;
}
#Communicationmap #relationShip .body >>> .c-mb-child-panel {
  background-color: rgba(255, 255, 255, 0) !important;
  top: 45px;
  left: 75px;
  border-radius: 3px;
}
#Communicationmap #relationShip .body >>> .rel-linediv,
#Communicationmap #relationShip .body >>> .rel-map-canvas {
  position: absolute;
  width: 100% !important;
  height: 100% !important;
  top: 0;
  left: 0;
}
#Communicationmap #relationShip .body >>> .rel-map {
  position: relative;
}
/* 上传线索 */
#Communicationmap #relationShip >>> .btns {
  position: absolute;
  right: 5px;
  top: 5px;
  font-family: KuHei;
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid #fff;
  border-radius: 3px;
  z-index: 11;
  width: 80px;
  height: 35px;
  padding: 0;
  text-align: center;
  background-color: rgba(40, 43, 57, 0.8);
  border-color: rgba(219, 219, 219, 0.555);
  transition: all 1s;
}
#Communicationmap #relationShip >>> .btns:hover {
  background-color: rgb(21 62 109);
  color: rgba(255, 255, 255, 1);
  border-color: rgba(219, 219, 219, 0.8);
}
#Communicationmap #relationShip #addrelationship {
  position: absolute;
  background: rgb(21 62 109);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: none;
  z-index: 12;
}
#Communicationmap #relationShip #addrelationship table {
  position: absolute;
  width: 500px;
  height: 500px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
#Communicationmap #relationShip #addrelationship table tr {
  height: calc(500px / 7);
}
#Communicationmap #relationShip #addrelationship table th {
  text-align: center;
}
#Communicationmap #relationShip #addrelationship table th:nth-child(1) {
  color: #fff;
  letter-spacing: 2px;
}
#Communicationmap #relationShip #addrelationship table th:nth-child(2) >>> .el-input__inner {
  text-align: center;
  background-color: rgba(255, 255, 255, 0);
  border-radius: 0;
  border: none;
  border-bottom: 1px solid #fff;
  padding-left: 30px !important;
  padding-right: 30px !important;
  color: #fff;
  font-family: KuHei;
  letter-spacing: 2px;
}
#Communicationmap #relationShip #addrelationship table th:nth-child(2) >>> .el-radio {
  color: #fff;
}
#Communicationmap #relationShip #addrelationship table th:nth-child(2) >>> .el-radio__inner::after {
  left: 54.2%;
  top: 53.3%;
}
#Communicationmap #relationShip #addrelationship table th:nth-child(2) >>> .el-radio__input.is-checked+.el-radio__label {
  color: #ff7979;
}
#Communicationmap #relationShip #addrelationship table th:nth-child(2) >>> .el-radio__input.is-checked .el-radio__inner {
  border-color: #ff7979;
  background: #ff7979;
}
#Communicationmap #relationShip #addrelationship table th:nth-child(2) >>> .el-select-dropdown {
  background-color: rgba(40, 43, 57, 0.8);
}
#Communicationmap #relationShip #addrelationship table th:nth-child(2) >>> .el-select-dropdown__item {
  text-align: center;
  color: #fff;
}
#Communicationmap #relationShip #addrelationship table th:nth-child(2) >>> .el-select-dropdown__item.hover,
#Communicationmap #relationShip #addrelationship table th:nth-child(2) >>> .el-select-dropdown__item:hover {
  background-color: rgb(31, 33, 44) !important;
}
#Communicationmap #relationShip #addrelationship table th:nth-child(2) >>> .popper__arrow {
  display: none;
}
#Communicationmap #relationShip #addrelationship table th >>> .el-button {
  font-family: KuHei;
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid #fff;
  border-radius: 3px;
  z-index: 11;
  width: 80px;
  height: 35px;
  padding: 0;
  text-align: center;
  background-color: rgba(40, 43, 57, 0.8);
  border-color: rgba(219, 219, 219, 0.555);
  transition: all 1s;
}
#Communicationmap #relationShip #addrelationship table th >>> .el-button:hover {
  background-color: rgb(21 62 109);
  color: rgba(255, 255, 255, 1);
  border-color: rgba(219, 219, 219, 0.8);
}
/* 右侧部分 */
#Communicationmap #right {
  position: absolute;
  right: 5px;
  top: 5px;
  z-index: 10;
  width: 400px;
  height: calc(100% - 10px);
  color: #fff;
  font-family: KuHei;
  font-size: 14px;
  border-radius: 1.5px;
  /* border: 1.5px solid #0fafeb; */
}
/* 右侧部分-顶部 */
#Communicationmap #right .pack {
  position: absolute;
  width: calc(100% - 10px);
  right: 5px;
  top: 5px;
  height: calc(40% - 5px);
  /* border: 1.5px solid #0fafeb; */
  /* background: url("./public/img/bg.png") rgba(255, 255, 255, 0.1); */
  background: url("./public/img/bn.png");
  background-size: 100% 100%;
}
/* 右侧部分-头部 */
#Communicationmap #right .top {
  position: absolute;
  height: 70px;
  width: calc(100% - 10px);
  right: 5px;
  top: calc(40% + 5px);
  /* border: 1.5px solid #0fafeb; */
  /* background: url("./public/img/bg.png") rgba(255, 255, 255, 0.1); */
  background: url("./public/img/bn.png") ;
  background-size: 100% 100%;
}
#Communicationmap #right .top .lable {
  position: absolute;
  left: 0;
  width: 150px;
  height: 70px;
  line-height: 70px;
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
  letter-spacing: 5px;
}
#Communicationmap #right .top .fTime {
  position: absolute;
  right: 0;
  width: 250px;
  height: 70px;
  line-height: 70px;
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
}
#Communicationmap #right .top .fTime >>> .el-input__prefix,
#Communicationmap #right .top .fTime >>> .el-input__suffix {
  display: none;
}
#Communicationmap #right .top .fTime >>> .el-input__inner {
  background-color: rgba(255, 255, 255, 0) ;
  border: none;
  font-family: KuHei;
  color: #fff;
  text-align: center;
  width: 140px;
  border-bottom: 2px solid rgba(219, 219, 219, 0.555);
  height: 30px;
  border-radius: 0;
  cursor: pointer;
  user-select: none;
  padding: 0 10px;
}
#Communicationmap #right .top .fTime >>> .el-date-editor.el-input,
#Communicationmap #right .top .fTime >>> .el-date-editor.el-input__inner {
  width: 140px;
}
#Communicationmap #right .top .fTime .img {
  margin: 0 15px;
  height: 45px;
  line-height: 45px;
  cursor: pointer;
  color: rgb(199, 199, 199);
  transition: all 0.5s;
}
#Communicationmap #right .top .fTime .img:hover {
  color: #fff;
}
/* 右侧部分-底部 */
#Communicationmap #right .bottom {
  position: absolute;
  height: calc(60% - 85px);
  width: calc(100% - 10px);
  right: 5px;
  top: calc(40% + 80px);
  /* border: 1.5px solid #0fafeb; */
  /* background: url("./public/img/bg.png") rgba(255, 255, 255, 0.1); */
  background: url("./public/img/bn.png") ;
  background-size: 100% 100%;
}
#Communicationmap #right .bottom .find {
  position: absolute;
  width: 100%;
  top: 0;
  height: 70px;
  line-height: 70px;
  border-bottom: 2px dashed rgba(219, 219, 219, 0.555);
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
}
#Communicationmap #right .bottom .find .left {
  width: 150px;
  letter-spacing: 5px;
}
#Communicationmap #right .bottom .find .right {
  width: 250px;
}
#Communicationmap #right .bottom .find .right >>> .el-input__inner {
  background-color: rgba(255, 255, 255, 0) ;
  border: none;
  font-family: KuHei;
  color: #fff;
  text-align: center;
  width: 200px;
  border-bottom: 2px solid rgba(219, 219, 219, 0.555);
  height: 30px;
  border-radius: 0;
  cursor: pointer;
  user-select: none;
  padding: 0 10px;
  margin-right: 10px;
}
#Communicationmap #right .bottom .find .right >>> .el-input__suffix {
  margin-right: 15px;
}
#Communicationmap #right .bottom .find .right >>> .el-input__inner::-webkit-input-placeholder {
  text-align: center;
  font-family: KuHei;
  color: #fff;
}
#Communicationmap #right .bottom .table {
  position: absolute;
  width: 100%;
  top: 70px;
  height: calc(100% - 120px);
}
#Communicationmap #right .bottom .table >>> .el-table thead {
  font-family: KuHei;
  color: #fff;
  letter-spacing: 5px;
}
#Communicationmap #right .bottom .table >>> .el-table {
  font-family: KuHei;
  color: #fff;
}
#Communicationmap #right .bottom .table >>> .el-table td {
  border: none;
}
#Communicationmap #right .bottom .table >>> .el-table,
#Communicationmap #right .bottom .table >>> .el-table__expanded-cell {
  background-color: rgba(255, 255, 255, 0);
}
#Communicationmap #right .bottom .table >>> .el-table__body tr.current-row>td,
#Communicationmap #right .bottom .table >>> .el-table th,
#Communicationmap #right .bottom .table >>> .el-table tr {
  background-color: rgba(255, 255, 255, 0);
}
#Communicationmap #right .bottom .table >>> .el-table--border::after,
#Communicationmap #right .bottom .table >>> .el-table--group::after,
#Communicationmap #right .bottom .table >>> .el-table::before {
  background-color: rgba(255, 255, 255, 0);
}
#Communicationmap #right .bottom .table >>> .el-table--enable-row-hover .el-table__body tr:hover>td{
  background-color: rgba(255, 255, 255, 0.1);
  cursor: pointer;
}
#Communicationmap #right .bottom .table >>> .el-radio__label {
  display: none;
}
#Communicationmap #right .bottom .table >>> .el-radio {
  color: #fff;
  margin-right: 10px !important;
}
#Communicationmap #right .bottom .table >>> .el-radio__inner::after {
  left: 54.2%;
  top: 53.3%;
}
#Communicationmap #right .bottom .table >>> .el-radio__input.is-checked+.el-radio__label {
  color: #ff7979;
}
#Communicationmap #right .bottom .table >>> .el-radio__input.is-checked .el-radio__inner {
  border-color: #ff7979;
  background: #ff7979;
}
#Communicationmap #right .bottom .choice {
  position: absolute;
  width: 100%;
  bottom: 0;
  height: 50px;
  line-height: 50px;
  text-align: center;
  border-top: 2px dashed rgba(219, 219, 219, 0.555);
  cursor: pointer;
}
#Communicationmap >>> .l7-right {
  position: absolute;
  right: 410px;
  top: 55px;
  z-index: 9;
  height: auto;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  align-content: center;
}
#Communicationmap >>> .infolegend {
  background: rgba(40, 43, 57, 0.85);
  color: rgba(255, 255, 255, 0.75);
  height: auto;
  margin: 0;
  text-align: center;
  width: 60px;
  flex-direction: column;
  align-items: center;
  overflow: overlay;
  max-height: 400px;
}
#Communicationmap >>> .infolegend i {
  display: inline-block;
  vertical-align: top;
  float: none;
  margin: 0;
}
#Communicationmap >>> .infolegend span {
  width: 60px;
  display: inline-block;
  vertical-align: top;
  text-align: center;
  margin-bottom: 5px;
}
/* 右侧部分-公共 */
#Communicationmap #right .pack::after,
#Communicationmap #parameter .setup::after,
#Communicationmap #right .top::after,
#Communicationmap #right .bottom::after {
  position: absolute;
  content: "";
  bottom: -1px;
  right: -1px;
  height: 10px;
  width: 10px;
  /* border-bottom: 2px solid #02a6b5;
  border-right: 2px solid #02a6b5; */
  transition: all 1.5s;
  z-index: 0;
}
#Communicationmap #right .pack::before,
#Communicationmap #parameter .setup::before,
#Communicationmap #right .top::before,
#Communicationmap #right .bottom::before {
  position: absolute;
  content: "";
  top: -2px;
  left: -2px;
  height: 10px;
  width: 10px;
  /* border-top: 2px solid #02a6b5;
  border-left: 2px solid #02a6b5; */
  transition: all 1.5s;
  z-index: 0;
}
/* 关系图谱 */
#Communicationmap >>> .c-my-node {
  background-position: center center;
  background-size: 100%;
  border: #ff8c00 solid 2px;
  height: 80px;
  width: 80px;
  border-radius: 40px;
}
#Communicationmap >>> .c-node-name {
  width: 160px;
  margin-left: -40px;
  text-align: center;
  margin-top: 85px;
}
#Communicationmap >>> .rel-map[data-v-2964abc9] {
  background-color: rgba(40, 43, 57, 0.85) !important
}
#Communicationmap >>> .c-mb-button .c-mb-text {
  color: white!important;
}
#Communicationmap >>> .c-mini-toolbar {
  border: #bbbbbb solid 0px!important;
  background-color: rgba(40, 43, 57, 0.85)!important;
  box-shadow: 0px 0px 0px #cccccc!important;
}
#Communicationmap >>> .c-mb-button {
  background-color: rgba(40, 43, 57, 0.85)!important;
  border-top: #efefef solid 0px!important;
}
</style>
