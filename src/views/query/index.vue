<template>
  <div id="query">
    <!-- 地图 -->
    <div id="querymap" />
    <!-- 查询类型 -->
    <selectRegion class="selectRegion" />
    <div class="type">
      <ul>
        <button class="dw" />
        <button class="jiadian" />
        <li class="clearSearch"><icon-svg icon-class="icon-qingkongchaxuntiaojian" /><span> 清空查询</span></li>
        <li class="CircleSearch"><icon-svg icon-class="icon-yuan" /><span> 画圈查询</span></li>
        <li class="geometrySearch"><icon-svg icon-class="icon-jihechaxun" /><span> 拖拽查询</span></li>
        <li @click="zhou()"><icon-svg icon-class="icon-icon-GIS_dizhi" /><span> 周边查询</span></li>
        <li class="dimension" @click="qie(viewwd.name)"><icon-svg :icon-class="viewwd.ioc" /><span> {{ viewwd.name }}</span></li>
      </ul>
    </div>
    <!-- 周边查询弹框 -->
    <div class="PQuery">
      <p class="top">
        周边查询参数设置
        <i class="el-icon-close" @click="closeP" />
      </p>
      <div class="body">
        <ul>
          <li>
            <div class="neirong">
              <el-date-picker v-model="timz" class="timess" type="date" placeholder="选择开始日期" :picker-options="pickerOptions1" :editable="false" />
              <el-date-picker v-model="timx" class="timess" type="date" placeholder="选择结束日期" :picker-options="pickerOptions2" :editable="false" />
            </div>
          </li>
          <li>
            <p>半径大小（米）</p>
            <div class="neirong">
              <el-input v-model="radius" class="radiuss" placeholder="请输入半径" />
            </div>
          </li>
        </ul>
      </div>
      <p id="zbbottom" class="bottom">确认</p>
    </div>
    <!-- 条件 -->
    <div class="condition">
      <div class="top">
        <i v-if="j === 1" class="el-icon-arrow-left" @click="huan(0)" />
        <listDiseases class="s" />
        <transmission class="x" />
        <i v-if="j === 0" class="el-icon-arrow-right" @click="huan(1)" />
      </div>
      <div class="centers">
        <conditions />
      </div>
      <div class="centerx">
        <conditionx />
      </div>
    </div>
    <!-- 图表 -->
    <div class="chart">
      <ul>
        <li class="public">
          <div id="Columnar" style="height: 100%;width: 100%;z-index: 1;" />
        </li>
        <li class="public">
          <div id="Strip" style="height: 100%;width: 100%;z-index: 1;" />
        </li>
        <li class="public">
          <el-carousel direction="vertical" :autoplay="true">
            <el-carousel-item v-for="item in 3" :key="item">
              <div v-if="item === 1">
                <div id="Crowds" style="height: 100%;width: 100%;z-index: 1;position: absolute;" />
              </div>
              <div v-if="item === 2">
                <div id="Groups" style="height: 100%;width: 100%;z-index: 1;position: absolute;" />
              </div>
              <div v-if="item === 3">
                <div id="Others" style="height: 100%;width: 100%;z-index: 1;position: absolute;" />
              </div>
            </el-carousel-item>
          </el-carousel>
        </li>
      </ul>
    </div>
    <!-- 表单 -->
    <div id="height" class="table">
      <tables />
    </div>
  </div>
</template>
<script>
import SelectRegion from './components/selectRegion' // 城市选择
import ListDiseases from './components/listDiseases' // 疾病选择
import Transmission from './components/transmission' // 传播途径
import Conditions from './components/conditions' // 模糊查询
import Conditionx from './components/conditionx' // 条件查询
import Tables from './components/table' // 表单
import eventBuq from './public/js/EvebtBus'
import * as echarts from 'echarts'
import { loadModules } from 'esri-loader'
export default {
  name: 'Query',
  components: {
    SelectRegion,
    ListDiseases,
    Transmission,
    Conditions,
    Conditionx,
    Tables
  },
  data() {
    return {
      viewwd: {
        ioc: 'icon-d1',
        name: '三维视图'
      },
      // 地名
      json: {
        table: '', // 表名
        name: '', // 地名
        where: 0 // 层级
      },
      j: 0, // 右上角左右切换
      FINDtype: 0, // 判断查询类型
      // 周边查询时间
      timz: '',
      timx: '',
      radius: 0,
      Tiao: {},
      data: [],
      pickerOptions1: {
        disabledDate: time => {
          if (this.timx !== '') {
            return time.getTime() > Date.now() || time.getTime() > this.timx
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      pickerOptions2: {
        disabledDate: time => {
          return time.getTime() < new Date(this.timz).getTime() || time.getTime() > Date.now()
        }
      },
      // 地图要素
      map: undefined,
      view: undefined,
      bShi: undefined,
      datalayer: undefined,
      bSheng: undefined,
      bxian: undefined,
      backSheng: 'http://114.98.239.36:6080/arcgis/rest/services/ShaanXiDisease/lk/MapServer/2',
      backShi: 'http://114.98.239.36:6080/arcgis/rest/services/ShaanXiDisease/lk/MapServer/1',
      backxian: 'http://114.98.239.36:6080/arcgis/rest/services/ShaanXiDisease/lk/MapServer/0',
      sqlurl: 'http://114.98.239.36:6080/arcgis/rest/services/ShaanXiDisease/ShaanXiPts/MapServer/0',
      // 是否周边查询
      zbSearch: false,
      bj: 100,
      ifbuff: false,
      // 表赋予数据
      fromTable: [],
      // 返回地图数据
      toTable: [],
      // 周边查询中心点
      px: 0,
      py: 0,
      myChart1: null,
      myChart2: null,
      myChart3: null,
      myChart4: null,
      myChart5: null
    }
  },
  beforeDestroy() {
    eventBuq.$off('json')
    eventBuq.$off('height')
    eventBuq.$off('FINDtype')
    eventBuq.$off('Tiao')
    eventBuq.$off('echartsLength')
    eventBuq.$off('mapdata')
    eventBuq.$off('type')
    eventBuq.$off('typc')
    eventBuq.$off('tubiao')
  },
  mounted() {
    // 地图
    this.int()
    // 高度
    eventBuq.$on('height', height => {
      this.height(height)
    })
    // 查询种类
    eventBuq.$on('FINDtype', FINDtype => {
      this.FINDtype = FINDtype
      if (this.FINDtype !== 0) {
        eventBuq.$emit('true', '否') // 是否显示生成图表
        document.querySelector('.table').style.display = 'block'
      }
    })
    // 地名
    eventBuq.$on('json', Tiao => {
      this.json.where = Tiao.where
      this.json.name = Tiao.name
      document.getElementsByClassName('dw')[0].click()
    })
    // 疾病名称
    eventBuq.$on('type', type => {
      this.json.table = type
    })
    // 传播名称
    eventBuq.$on('typc', typc => {
      this.json.table = typc
    })
    // 数据条件
    eventBuq.$on('Tiao', Tiao => {
      this.Tiao = Tiao
      this.x = ''
      this.y = ''
    })
    eventBuq.$on('mapdata', mapdata => {
      this.fromTable = mapdata
      document.getElementsByClassName('jiadian')[0].click()
    })
    // 数据长度
    eventBuq.$on('echartsLength', echartsLength => {
      this.Tiao.pageNum = 1
      this.Tiao.pageSize = echartsLength
      if (this.FINDtype === 1) { // 模糊查询
        this.findM()
      } else if (this.FINDtype === 2) { // 条件查询
        this.findT()
      }
    })
    // 生成图表
    eventBuq.$on('tubiao', e => {
      document.querySelector('.chart').style.display = 'block'
      console.log(this.Tiao)
      this.sCheng()
    })
  },
  methods: {
    // 切换3D/2D
    qie(e) {
      if (e === '三维视图') {
        this.viewwd.ioc = 'icon-d'
        this.viewwd.name = '二维视图'
      } else {
        this.viewwd.ioc = 'icon-d1'
        this.viewwd.name = '三维视图'
      }
    },
    // 周边查询
    zhou() {
      document.querySelector('.PQuery').style.display = 'block'
    },
    // 关闭参数设置
    closeP() {
      document.querySelector('.PQuery').style.display = 'none'
    },
    huan(e) {
      this.j = e
      var s = document.getElementsByClassName('s')[0]
      var x = document.getElementsByClassName('x')[0]
      if (e === 1) {
        s.style.display = 'none'
        x.style.display = 'block'
      } else {
        x.style.display = 'none'
        s.style.display = 'block'
      }
    },
    // 高度
    height(e) {
      document.getElementById('height').style.height = e + 'px'
    },
    // 模糊查询
    findM() {
    },
    // 条件查询
    findT() {
      eventBuq.$emit('true', '是') // 生成图表
    },
    // echarts图表
    sCheng() {
      document.getElementById('Columnar').style.opacity = 0
      document.getElementById('Strip').style.opacity = 0
      document.getElementById('Crowds').style.opacity = 0
      document.getElementById('Groups').style.opacity = 0
      document.getElementById('Others').style.opacity = 0
      setTimeout(() => {
        document.getElementById('Columnar').style.opacity = 1
        document.getElementById('Strip').style.opacity = 1
        document.getElementById('Crowds').style.opacity = 1
        document.getElementById('Groups').style.opacity = 1
        document.getElementById('Others').style.opacity = 1
      }, 1000)
      this.CAdestroy()
      this.year()
      this.zoning()
      this.crowd()
      this.ageGroup()
      this.age()
    },
    // 年度
    year() {
      this.$store.dispatch('query/QAStatistics', this.Tiao).then((datas) => {
        const guo = [] // 区间
        for (let i = 0; i < datas.length; i++) {
          if (guo.indexOf(datas[i].区间) === -1) {
            guo.push(datas[i].区间)
          }
        }
        const zhiZon = [] // 值
        const zhiMan = [] // 值
        const zhiWom = [] // 值
        for (let i = 0; i < guo.length; i++) {
          zhiZon.push(0)
          zhiMan.push(0)
          zhiWom.push(0)
        }
        // 排序
        guo.sort(function(a, b) {
          return a - b
        })
        // 添加值
        for (let i = 0; i < datas.length; i++) {
          zhiZon[guo.indexOf(datas[i].区间)] = zhiZon[guo.indexOf(datas[i].区间)] + datas[i].值
          if (datas[i].性别 === '男') {
            zhiMan[guo.indexOf(datas[i].区间)] = zhiMan[guo.indexOf(datas[i].区间)] + datas[i].值
          } else {
            zhiWom[guo.indexOf(datas[i].区间)] = zhiWom[guo.indexOf(datas[i].区间)] + datas[i].值
          }
        }
        var that = this
        this.myChart1 = echarts.init(document.getElementById('Columnar'))
        const option = {
          legend: {
            data: ['总数', '男', '女'],
            textStyle: {
              color: '#fff'
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          xAxis: {
            type: 'category',
            data: guo,
            axisLabel: {
              show: true,
              textStyle: {
                color: '#fff'
              }
            }
          },
          yAxis: [
            {
              splitLine: false,
              type: 'value',
              scale: true
            },
            {
              splitLine: false,
              type: 'value',
              scale: true
            }
          ],
          grid: {
            left: '3%',
            right: '3%',
            bottom: '15%',
            top: '15%',
            containLabel: true
          },
          dataZoom: [
            {
              type: 'slider',
              show: true,
              height: 18,
              start: 0,
              end: 50,
              bottom: '6%',
              showDetail: false
            }
          ],
          series: [
            {
              name: '总数',
              type: 'line',
              yAxisIndex: 0,
              data: zhiZon
            },
            {
              name: '男',
              type: 'line',
              yAxisIndex: 1,
              data: zhiMan
            },
            {
              name: '女',
              type: 'line',
              yAxisIndex: 1,
              data: zhiWom
            }
          ]
        }
        window.addEventListener('resize', function() {
          that.chart = echarts.init(document.getElementById('Columnar'))
          that.chart.resize()
        })
        this.myChart1.setOption(option)
        // 点击事件
        this.myChart1.on('click', function(params) {
        })
      })
    },
    // 区划
    zoning() {
      this.$store.dispatch('query/QRStatistics', this.Tiao).then((datas) => {
        const guo = [] // 区间
        for (let i = 0; i < datas.length; i++) {
          if (guo.indexOf(datas[i].区间) === -1) {
            guo.push(datas[i].区间)
          }
        }
        const zhiZon = [] // 值
        const zhiMan = [] // 值
        const zhiWom = [] // 值
        for (let i = 0; i < guo.length; i++) {
          zhiZon.push(0)
          zhiMan.push(0)
          zhiWom.push(0)
        }
        // 排序
        guo.sort(function(a, b) {
          return a - b
        })
        // 添加值
        for (let i = 0; i < datas.length; i++) {
          zhiZon[guo.indexOf(datas[i].区间)] = zhiZon[guo.indexOf(datas[i].区间)] + datas[i].值
          if (datas[i].性别 === '男') {
            zhiMan[guo.indexOf(datas[i].区间)] = zhiMan[guo.indexOf(datas[i].区间)] + datas[i].值
          } else {
            zhiWom[guo.indexOf(datas[i].区间)] = zhiWom[guo.indexOf(datas[i].区间)] + datas[i].值
          }
        }
        var that = this
        this.myChart2 = echarts.init(document.getElementById('Strip'))
        const option = {
          legend: {
            data: ['总数', '男', '女'],
            textStyle: {
              color: '#fff'
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          xAxis: {
            type: 'category',
            data: guo,
            axisLabel: {
              show: true,
              textStyle: {
                color: '#fff'
              }
            }
          },
          yAxis: [
            {
              splitLine: false,
              type: 'value',
              scale: true
            },
            {
              splitLine: false,
              type: 'value',
              scale: true
            }
          ],
          grid: {
            left: '3%',
            right: '3%',
            bottom: '15%',
            top: '15%',
            containLabel: true
          },
          dataZoom: [
            {
              type: 'slider',
              show: true,
              height: 18,
              start: 0,
              end: 50,
              bottom: '6%',
              showDetail: false
            }
          ],
          series: [
            {
              name: '总数',
              type: 'bar',
              yAxisIndex: 0,
              data: zhiZon
            },
            {
              name: '男',
              type: 'bar',
              stack: '性别',
              yAxisIndex: 1,
              data: zhiMan
            },
            {
              name: '女',
              type: 'bar',
              stack: '性别',
              yAxisIndex: 1,
              data: zhiWom
            }
          ]
        }
        window.addEventListener('resize', function() {
          that.chart = echarts.init(document.getElementById('Strip'))
          that.chart.resize()
        })
        this.myChart2.setOption(option)
        // 点击事件
        this.myChart2.on('click', function(params) {
        })
      })
    },
    // 人群种类
    crowd() {
      this.$store.dispatch('query/QPType', this.Tiao).then((datas) => {
        const guo = [] // 区间
        for (let i = 0; i < datas.length; i++) {
          if (guo.indexOf(datas[i].区间) === -1) {
            guo.push(datas[i].区间)
          }
        }
        const zhiZon = [] // 值
        const zhiMan = [] // 值
        const zhiWom = [] // 值
        for (let i = 0; i < guo.length; i++) {
          zhiZon.push(0)
          zhiMan.push(0)
          zhiWom.push(0)
        }
        // 排序
        guo.sort(function(a, b) {
          return a - b
        })
        // 添加值
        for (let i = 0; i < datas.length; i++) {
          zhiZon[guo.indexOf(datas[i].区间)] = zhiZon[guo.indexOf(datas[i].区间)] + datas[i].值
          if (datas[i].性别 === '男') {
            zhiMan[guo.indexOf(datas[i].区间)] = zhiMan[guo.indexOf(datas[i].区间)] + datas[i].值
          } else {
            zhiWom[guo.indexOf(datas[i].区间)] = zhiWom[guo.indexOf(datas[i].区间)] + datas[i].值
          }
        }
        // 最大值
        zhiZon.sort(function(a, b) {
          return b - a
        })
        var max = Math.ceil(zhiZon[0] * 1 / 10) * 10
        var indicator = [] // 坐标
        var zon = []
        var man = []
        var wom = []
        var j = 0
        if (guo.length > 2) {
          if (guo.length <= 5) {
            j = guo.length
          } else {
            j = 5
          }
        } else {
          j = 3
        }
        for (let i = 0; i < j; i++) {
          var gong = {}
          gong.name = guo[i]
          gong.max = max
          indicator.push(gong)
          zon.push(zhiZon[i])
          man.push(zhiMan[i])
          wom.push(zhiWom[i])
        }
        var data = []
        data.push({ value: zon, name: '总数' })
        data.push({ value: man, name: '男' })
        data.push({ value: wom, name: '女' })
        var that = this
        this.myChart3 = echarts.init(document.getElementById('Crowds'))
        const option = {
          legend: {
            data: ['总数', '男', '女'],
            textStyle: {
              color: '#fff'
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            confine: true
          },
          radar: {
            indicator: indicator,
            center: ['50%', '60%'],
            radius: 70,
            name: {
              textStyle: {
                color: '#fff'
              }
            }
          },
          series: [{
            type: 'radar',
            data: data,
            tooltip: {
              trigger: 'item'
            },
            areaStyle: {}
          }]
        }
        window.addEventListener('resize', function() {
          that.chart = echarts.init(document.getElementById('Crowds'))
          that.chart.resize()
        })
        this.myChart3.setOption(option)
        // 点击事件
        this.myChart3.on('click', function(params) {
        })
      })
    },
    // 年龄段
    ageGroup() {
      this.$store.dispatch('query/QAGroup', this.Tiao).then((datas) => {
        const guo = [] // 区间
        for (let i = 0; i < datas.length; i++) {
          if (guo.indexOf(datas[i].区间) === -1) {
            guo.push(datas[i].区间)
          }
        }
        const zhiZon = [] // 值
        const zhiMan = [] // 值
        const zhiWom = [] // 值
        for (let i = 0; i < guo.length; i++) {
          zhiZon.push(0)
          zhiMan.push(0)
          zhiWom.push(0)
        }
        // 排序
        guo.sort(function(a, b) {
          return a - b
        })
        // 添加值
        for (let i = 0; i < datas.length; i++) {
          zhiZon[guo.indexOf(datas[i].区间)] = zhiZon[guo.indexOf(datas[i].区间)] + datas[i].值
          if (datas[i].性别 === '男') {
            zhiMan[guo.indexOf(datas[i].区间)] = zhiMan[guo.indexOf(datas[i].区间)] + datas[i].值
          } else {
            zhiWom[guo.indexOf(datas[i].区间)] = zhiWom[guo.indexOf(datas[i].区间)] + datas[i].值
          }
        }
        // 最大值
        zhiZon.sort(function(a, b) {
          return b - a
        })
        var max = Math.ceil(zhiZon[0] * 1 / 10) * 10
        var indicator = [] // 坐标
        var zon = []
        var man = []
        var wom = []
        var j = 0
        if (guo.length > 2) {
          if (guo.length <= 6) {
            j = guo.length
          } else {
            j = 6
          }
        } else {
          j = 3
        }
        for (let i = 0; i < j; i++) {
          var gong = {}
          gong.name = guo[i]
          gong.max = max
          indicator.push(gong)
          zon.push(zhiZon[i])
          man.push(zhiMan[i])
          wom.push(zhiWom[i])
        }
        var data = []
        data.push({ value: zon, name: '总数' })
        data.push({ value: man, name: '男' })
        data.push({ value: wom, name: '女' })
        var that = this
        this.myChart3 = echarts.init(document.getElementById('Groups'))
        const option = {
          legend: {
            data: ['总数', '男', '女'],
            textStyle: {
              color: '#fff'
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            confine: true
          },
          radar: {
            indicator: indicator,
            center: ['50%', '60%'],
            radius: 70,
            name: {
              textStyle: {
                color: '#fff'
              }
            }
          },
          series: [{
            type: 'radar',
            data: data,
            tooltip: {
              trigger: 'item'
            },
            areaStyle: {}
          }]
        }
        window.addEventListener('resize', function() {
          that.chart = echarts.init(document.getElementById('Groups'))
          that.chart.resize()
        })
        this.myChart3.setOption(option)
        // 点击事件
        this.myChart3.on('click', function(params) {
        })
      })
    },
    // 年龄
    age() {
      this.$store.dispatch('query/QYStatistics', this.Tiao).then((datas) => {
        const guo = [] // 区间
        for (let i = 0; i < datas.length; i++) {
          if (guo.indexOf(datas[i].区间) === -1) {
            guo.push(datas[i].区间)
          }
        }
        const zhiZon = [] // 值
        const zhiMan = [] // 值
        const zhiWom = [] // 值
        for (let i = 0; i < guo.length; i++) {
          zhiZon.push(0)
          zhiMan.push(0)
          zhiWom.push(0)
        }
        // 排序
        guo.sort(function(a, b) {
          return a - b
        })
        // 添加值
        for (let i = 0; i < datas.length; i++) {
          zhiZon[guo.indexOf(datas[i].区间)] = zhiZon[guo.indexOf(datas[i].区间)] + datas[i].值
          if (datas[i].性别 === '男') {
            zhiMan[guo.indexOf(datas[i].区间)] = zhiMan[guo.indexOf(datas[i].区间)] + datas[i].值
          } else {
            zhiWom[guo.indexOf(datas[i].区间)] = zhiWom[guo.indexOf(datas[i].区间)] + datas[i].值
          }
        }
        var that = this
        this.myChart5 = echarts.init(document.getElementById('Others'))
        const option = {
          legend: {
            data: ['总数', '男', '女'],
            textStyle: {
              color: '#fff'
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          xAxis: {
            type: 'category',
            data: guo,
            axisLabel: {
              show: true,
              textStyle: {
                color: '#fff'
              }
            }
          },
          yAxis: [
            {
              splitLine: false,
              type: 'value',
              scale: true
            },
            {
              splitLine: false,
              type: 'value',
              scale: true
            }
          ],
          grid: {
            left: '3%',
            right: '3%',
            bottom: '15%',
            top: '15%',
            containLabel: true
          },
          dataZoom: [
            {
              type: 'slider',
              show: true,
              height: 18,
              start: 0,
              end: 50,
              bottom: '6%',
              showDetail: false
            }
          ],
          series: [
            {
              name: '总数',
              type: 'line',
              yAxisIndex: 0,
              data: zhiZon
            },
            {
              name: '男',
              type: 'line',
              yAxisIndex: 1,
              data: zhiMan
            },
            {
              name: '女',
              type: 'line',
              yAxisIndex: 1,
              data: zhiWom
            }
          ]
        }
        window.addEventListener('resize', function() {
          that.chart = echarts.init(document.getElementById('Others'))
          that.chart.resize()
        })
        this.myChart5.setOption(option)
        // 点击事件
        this.myChart5.on('click', function(params) {
        })
      })
    },
    // 创建与销毁盒子
    CAdestroy() {
      if (this.myChart1 !== null && this.myChart2 !== null && this.myChart3 !== null && this.myChart4 !== null && this.myChart5 !== null) {
        console.log('触发清除事件')
        this.myChart1.clear()
        this.myChart1.dispose()
        this.myChart2.clear()
        this.myChart2.dispose()
        this.myChart3.clear()
        this.myChart3.dispose()
        this.myChart4.clear()
        this.myChart4.dispose()
        this.myChart5.clear()
        this.myChart5.dispose()
      }
    },
    // 地图
    int() {
      // eslint-disable-next-line no-unused-vars
      const that = this
      const option = {
        url: 'http://js.arcgis.com/4.17/dojo/dojo.js',
        css: 'https://js.arcgis.com/4.17/esri/themes/dark-blue/main.css'
      }
      // 通过loadModules来做衔接
      loadModules(
        [
          'esri/layers/TileLayer',
          'esri/views/SceneView',
          'esri/Basemap',
          'esri/widgets/Sketch/SketchViewModel',
          'esri/geometry/Polyline',
          'esri/geometry/Point',
          'esri/Graphic',
          'esri/Map',
          'esri/views/MapView',
          'esri/layers/FeatureLayer',
          'esri/layers/GraphicsLayer',
          'esri/geometry/geometryEngine',
          'esri/widgets/Expand',
          'esri/widgets/Legend',
          'esri/widgets/Search',
          'esri/core/watchUtils',
          'esri/tasks/QueryTask',
          'esri/tasks/support/Query',
          'esri/widgets/Sketch',
          'esri/widgets/Home', // Home
          'esri/widgets/Zoom', // 放大缩小
          'esri/geometry/SpatialReference', // 投影
          'esri/geometry/Circle' // 圆
        ], option
      ).then(([
        TileLayer,
        SceneView,
        Basemap,
        SketchViewModel,
        Polyline,
        Point,
        Graphic,
        Map,
        MapView,
        FeatureLayer,
        GraphicsLayer,
        geometryEngine,
        Expand,
        Legend,
        Search,
        watchUtils,
        QueryTask,
        Query,
        Sketch,
        Home,
        Zoom,
        SpatialReference,
        Circle
      ]) => {
        // App 'globals'
        // eslint-disable-next-line no-unused-vars
        let sketchViewModel, featureLayerView, peakResults, pausableWatchHandle, chartExpand, centerGraphic, edgeGraphic, polylineGraphic, bufferGraphic, centerGeometryAtStart, labelGraphic
        const unit = 'kilometers'
        const graphicsLayer = new GraphicsLayer()
        const bufferLayer = new GraphicsLayer({
          blendMode: 'color-burn'
        })
        // var url = 'http://114.98.239.36:6080/arcgis/rest/services/ShaanXiDisease/ShaanXiPts/MapServer/0'
        const backrenderer = {
          type: 'simple', // autocasts as new SimpleRenderer()
          symbol: {
            type: 'simple-fill',
            color: 'rgba(0,136,136,0.2)',
            outline: {
              type: 'simple-line',
              width: 1,
              color: 'rgb(69,96,97)'
            }
          }
        }
        var popupTemplate = {
          title: '{疾病名称}--{性别}', // 全国矢量（省、市、县）
          content: [
            {
              type: 'fields',
              fieldInfos: [
                // { fieldName: 'OBJECTID', label: 'OBJECTID' },
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
        // 底图
        // 省
        that.bSheng = new FeatureLayer({
          url: that.backSheng,
          renderer: backrenderer,
          legendEnabled: false,
          title: '省际'
        })
        // 市
        that.bShi = new FeatureLayer({
          url: that.backShi,
          renderer: backrenderer,
          legendEnabled: false,
          title: '市际'
        })
        // 县区地图
        that.bxian = new FeatureLayer({
          url: that.backxian,
          title: '陕西省',
          renderer: backrenderer,
          legendEnabled: false
        })
        // 数据图层
        that.datalayer = new FeatureLayer({
          url: that.sqlurl,
          title: '陕西省',
          legendEnabled: false,
          outFields: ['*']
        })
        // 蓝色底图
        const customBasemap = new Basemap({
          portalItem: {
            id: 'a14ba2b66c284ce4bd1c11a335760f70' // WGS84 Streets Vector webmap
          }
        })
        that.map = new Map({
          basemap: customBasemap,
          layers: [that.bSheng, that.bShi, that.bxian, that.datalayer]
        })
        that.map.layers.items[0].visible = true
        that.map.layers.items[1].visible = false
        that.map.layers.items[2].visible = false
        that.map.layers.items[3].visible = false
        that.view = new MapView({
          container: 'querymap',
          map: that.map,
          zoom: 4,
          center: [113.37048202663054, 33.52942318538481]
        })
        // 隐藏放大缩小
        that.view.ui.remove('zoom')
        var gl = new GraphicsLayer({ id: 'circles' })
        that.map.add(gl)
        that.view.when(function name(params) {
          // 二三维切换按钮
          var switchButton = document.getElementsByClassName('dimension')[0]
          switchButton.addEventListener('click', function() {
            switchView()
          })
          // 二三维切换
          function switchView() {
            const is3D = that.view.type
            if (is3D === '3d') {
              that.view = new MapView({
                container: 'querymap',
                center: [113.37048202663054, 33.52942318538481],
                map: that.map,
                zoom: 3
              })
              if (peakResults !== null) {
                that.view.goTo(peakResults)
              }
              document.getElementsByClassName('dw')[0].click()
              star()
            } else {
              that.view = new SceneView({
                container: 'querymap',
                camera: {
                  fov: 55,
                  heading: 0,
                  tilt: 0.16066527450575638,
                  position: {
                    latitude: 33.80771918237416,
                    longitude: 108.23318115052652,
                    type: 'point',
                    x: 12048462.612612749,
                    y: 4003012.5394015196,
                    z: 13470911.5795401
                  }
                },
                map: that.map,
                zoom: 3
              })
              document.getElementsByClassName('dw')[0].click()
              star()
              if (peakResults !== null) {
                that.view.goTo(peakResults)
              }
            }
            that.view.ui.components = []// 清空所有ESRI自带的组件
          }
          star()
          function star(params) {
            // 隐藏放大缩小
            that.view.ui.remove('zoom')
            that.view.on('click', function(e) {
              gl.removeAll()
              that.px = e.mapPoint.longitude
              that.py = e.mapPoint.latitude
              if (that.zbSearch === true) {
                if (that.timz === '' || that.timx === '') {
                  this.$message({
                    message: '请输入时间！',
                    type: 'warning'
                  })
                } else if (that.radius === 0) {
                  that.$message({
                    message: '请输入半径！',
                    type: 'warning'
                  })
                } else if (that.json.name === '') {
                  that.$message({
                    message: '请选择城市！',
                    type: 'warning'
                  })
                } else if (that.json.table === '') {
                  that.$message({
                    message: '请选择疾病种类！',
                    type: 'warning'
                  })
                } else {
                  // 清空查询到的所有要素
                  that.view.graphics.removeAll()
                  // 清空几何查询
                  that.map.remove(bufferLayer)
                  that.map.remove(graphicsLayer)
                  // 关闭周边查询
                  gl.removeAll()
                  var circle = new Circle({
                    center: e.mapPoint, // 圆的中心点
                    radius: that.radius * 1
                  })
                  var circle1 = new Circle({
                    center: e.mapPoint, // 圆的中心点
                    radius: that.radius * 1.5
                  })
                  console.log(e.mapPoint)
                  // Symbol for other major highways
                  const sOpen = {
                    type: 'picture-marker',
                    url: '/img/tujing.png',
                    width: '30px',
                    height: '30px'
                  }
                  const point = {
                    type: 'point', // autocasts as new Point()
                    longitude: e.mapPoint.longitude,
                    latitude: e.mapPoint.latitude
                  }
                  // Create a symbol for drawing the point
                  // const markerSymbol = {
                  //   type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
                  //   color: [226, 119, 40]
                  // }
                  // Create a graphic and add the geometry and symbol to it
                  const pointGraphic = new Graphic({
                    geometry: point,
                    symbol: sOpen
                  })
                  var graphic = new Graphic(circle, {
                    type: 'simple-fill',
                    color: [255, 0, 0, 0.5]
                  })
                  var graphic1 = new Graphic(circle1, {
                    type: 'simple-fill',
                    color: [101, 222, 241, 0.3]
                  })
                  gl.add(graphic)
                  gl.add(graphic1)
                  gl.add(pointGraphic)
                  that.view.goTo(graphic1).then(function() {
                    if (that.px !== 0) {
                      var data = {}
                      data.timz = that.checkTime2(new Date(that.timz))
                      data.timx = that.checkTime2(new Date(that.timx))
                      data.radius = that.radius / 1000
                      data.where = that.json.where
                      data.name = that.json.name
                      data.table = that.json.table
                      data.x = that.px
                      data.y = that.py
                      that.$store.dispatch('query/QSPQuery', data).then((datas) => {
                        addpoint(datas)
                        if (datas.length > 0) {
                          const data = {}
                          data.dates = datas
                          data.length = datas.length
                          that.data = that.toTable
                          document.querySelector('.table').style.display = 'block'
                          eventBuq.$emit('true', '是')
                          eventBuq.$emit('datas', data)
                        }
                      })
                    }
                  })
                }
              }
            })
            // 清空查询
            document.getElementsByClassName('clearSearch')[0].addEventListener('click', function name(params) {
              // 清空查询到的所有要素
              that.view.graphics.removeAll()
              // 清空几何查询
              that.map.remove(bufferLayer)
              that.map.remove(graphicsLayer)
              // 关闭周边查询
              that.zbSearch = false
              gl.removeAll()
            })
            // 周边查询
            document.getElementById('zbbottom').addEventListener('click', function name(params) {
              gl.removeAll()
              that.zbSearch = true
              document.querySelector('.PQuery').style.display = 'none'
              that.$message({
                message: '设置成功，请点击地图进行搜索！',
                type: 'warning'
              })
            })
            // 画圈查询
            document.getElementsByClassName('CircleSearch')[0].addEventListener('click', function name(params) {
              // 清空查询到的所有要素
              that.view.graphics.removeAll()
              // 清空几何查询
              that.map.remove(bufferLayer)
              that.map.remove(graphicsLayer)
              // 关闭周边查询
              that.zbSearch = false
              gl.removeAll()
              create('polygon')
            })
            // 几何查询
            document.getElementsByClassName('geometrySearch')[0].addEventListener('click', function name(params) {
              // 清空查询到的所有要素
              that.view.graphics.removeAll()
              // 清空几何查询
              // 关闭周边查询
              that.zbSearch = false
              setUpSketch()
              drawBufferPolygon()
              sketchViewModel.on('update', onMove)
              that.map.add(bufferLayer)
              that.map.add(graphicsLayer)
              that.ifbuff = true
            })

            // 定义存储画圈图层
            const layer = new GraphicsLayer()
            var sketch = new SketchViewModel({
              view: that.view,
              layer: layer
            })
            // 创建画圈工具
            function create(params) {
              if (params === 'polyline') {
                sketch.create('polyline')
              } else if (params === 'point') {
                sketch.create('point')
              } else if (params === 'polygon') {
                sketch.create('polygon')// 点击
              } else if (params === 'rectangle') {
                sketch.create('rectangle')
              } else if (params === 'circle') {
                sketch.create('circle')
              }
              sketch.on('create', function(event) {
                if (event.state !== 'cancel') {
                  that.view.graphics.removeAll()
                }
                if (event.state === 'complete') {
                  // featureCircleLayerView = {}
                  queryTask(event.graphic.geometry)
                  that.view.graphics.add(event.graphic)
                }
              })
            }
            const Static = ['联系电话']
            // eslint-disable-next-line no-unused-vars
            const statDefinitions = Static
              .map(function(fieldName) {
                return {
                  onStatisticField: fieldName,
                  outStatisticFieldName: fieldName,
                  statisticType: 'sum'
                }
              })
              // Update UI
            setUpAppUI()
            // setUpSketch()
            function setUpAppUI() {
              that.view.whenLayerView(that.datalayer).then(function(layerView) {
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
                sketchViewModel = new SketchViewModel({
                  view: that.view,
                  layer: graphicsLayer
                })
                // Display directions when the layerView is loading
                // watchUtils.whenFalseOnce(layerView, 'updating', function() {
                //   that.view.popup.alignment = 'top-left'
                // })
              })
              // Close the 'help' popup when view is focused
              that.view.watch('focused', function(newValue) {
                if (newValue) {
                  that.view.popup.close()
                }
              })
            }
            function setUpSketch() {
              // Listen to SketchViewModel's update event so that population pyramid chart
              // is updated as the graphics are updated
              sketchViewModel.on('update', onMove)
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
              // the center or edge graphic is being moved, recalculate the buffer
              const vertices = [
                [centerGraphic.geometry.x, centerGraphic.geometry.y],
                [edgeGraphic.geometry.x, edgeGraphic.geometry.y]
              ]
              // client-side stats query of features that intersect the buffer
              calculateBuffer(vertices, toolType)
              if (event.state === 'complete') {
                sketchViewModel.update([edgeGraphic, centerGraphic], {
                  tool: 'move'
                })
              }
            }
            function calculateBuffer(vertices, toolType) {
              // Update the geometry of the polyline based on location of edge and center points
              polylineGraphic.geometry = new Polyline({
                paths: vertices,
                spatialReference: that.view.spatialReference
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
                // queryLayerViewAgeStats(buffer)
                queryTask(buffer)
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
            // 画圈中心点及大小
            function drawBufferPolygon() {
              pausableWatchHandle.pause()
              const viewCenter = that.view.center.clone()
              const centerScreenPoint = that.view.toScreen(viewCenter)
              const centerPoint = that.view.toMap({
                x: centerScreenPoint.x,
                y: centerScreenPoint.y
              })
              const edgePoint = that.view.toMap({
                x: centerScreenPoint.x + 160,
                y: centerScreenPoint.y - 160
              })
              // Store updated vertices
              const vertices = [
                [centerPoint.x, centerPoint.y],
                [edgePoint.x, edgePoint.y]
              ]
              // Create center, edge, polyline and buffer graphics for the first time
              if (!centerGraphic) {
                const polyline = new Polyline({
                  paths: vertices,
                  spatialReference: that.view.spatialReference
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
                  color: '#ff7979'
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
                    color: [9, 146, 191, 0.8],
                    // color: '#ff7979',
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
                  sketchViewModel.update([edgeGraphic, centerGraphic], {
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
            // 图形相交查询
            function queryTask(geometry) {
            // 清空返回表数据
              that.toTable = []
              // 清空查询到的所有要素
              that.view.graphics.removeAll()
              var qTask = new QueryTask({
                url: 'http://114.98.239.36:6080/arcgis/rest/services/ShaanXiDisease/ShaanXiPts/MapServer/0' //
              })
              var query = new Query({
                returnGeometry: true,
                outFields: ['*']
                // 结果要素包含的属性字段
              })
              // 限制条件
              if (that.json.where === 1) {
                query.where = "省 = '" + that.json.name + "'"
              } else if (that.json.where === 2) {
                query.where = "市 = '" + that.json.name + "'"
              } else if (that.json.where === 3) {
                query.where = "县 = '" + that.json.name + "'"
              }
              query.geometry = geometry
              // 空间参考信息
              query.outSpatialReference = that.map.spatialReference
              // 查询的标准，此处代表和geometry相交的图形都要返回
              query.spatialRelationship = Query.SPATIAL_REL_INTERSECTS
              // 执行空间查询
              qTask.execute(query).then(showQueryResult)
            }
            function showQueryResult(queryResult) {
              if (queryResult.features.length === 0) {
                that.$message({
                  message: '查询结果为空！',
                  type: 'warning'
                })
                return
              } else if (queryResult.features.length >= 1) {
                for (let index = 0; index < queryResult.features.length; index++) {
                  // 得到graphic
                  var graphic = queryResult.features[index]
                  // 修改时间格式
                  graphic.attributes.发病日期 = that.checkTime2(new Date(graphic.attributes.发病日期))
                  graphic.attributes.导入时间 = that.checkTime2(new Date(graphic.attributes.导入时间))
                  graphic.attributes.诊断时间 = that.checkTime2(new Date(graphic.attributes.诊断时间))
                  graphic.symbol = {
                    type: 'simple-marker',
                    size: 4,
                    color: '#69dcff',
                    outline: {
                      color: 'rgba(0, 139, 174, 0.5)',
                      width: 5
                    }
                  }
                  graphic.popupTemplate = popupTemplate
                  // 添加到地图从而实现高亮效果
                  that.view.graphics.add(graphic, 100) // api 4.x
                  // graphic.on('click', closeDialog)
                  that.toTable.push(graphic.attributes)
                }
                // eventBuq.$emit('datas', that.toTable)
                if (that.toTable.length > 0) {
                  const data = {}
                  data.dates = that.toTable
                  data.length = that.toTable.length
                  // 给echarts赋值
                  that.data = that.toTable
                  document.querySelector('.table').style.display = 'block'
                  eventBuq.$emit('true', '是')
                  eventBuq.$emit('datas', data)
                }
              }
            }
            // 查询加点
            document.getElementsByClassName('jiadian')[0].addEventListener('click', function name(params) {
              addpoint(that.fromTable)
            })
            function addpoint(indata) {
              that.toTable = []
              that.toTable = indata
              for (let index = 0; index < indata.length; index++) {
                var element = indata[index]
                const point = {
                  type: 'point', // autocasts as new Point()
                  longitude: element.经度,
                  latitude: element.纬度
                }
                var graphic = new Graphic({
                  geometry: point,
                  symbol: {
                    type: 'simple-marker',
                    size: 4,
                    color: '#69dcff',
                    outline: {
                      color: 'rgba(0, 139, 174, 0.5)',
                      width: 5
                    }
                  }
                })
                graphic.attributes = {
                  // 'OBJECTID': element.OBJECTID,
                  '卡片编号': element.卡片编号,
                  '疾病名称': element.疾病名称,
                  '人群分类': element.人群分类,
                  '病例分类': element.病例分类,
                  '发病日期': element.发病日期,
                  '诊断时间': element.诊断时间,
                  '报告单位': element.报告单位,
                  '性别': element.性别,
                  '出生日期': element.出生日期,
                  '现住地址国标': element.现住地址国标,
                  '现住详细地址': element.现住详细地址,
                  '年龄': element.年龄,
                  '实验室结果': element.实验室结果,
                  '死亡日期': element.死亡日期
                }
                graphic.popupTemplate = popupTemplate
                that.view.graphics.add(graphic, 100) // api 4.x
              }
            }
            // 定位到面
            document.getElementsByClassName('dw')[0].addEventListener('click', function name(params) {
              var sqlwhere = ''
              var sqlwhereurl = ''
              if (that.json.where === 1) {
                that.bSheng.visible = true
                that.bShi.visible = false
                that.bxian.visible = false
                sqlwhere = "省 = '" + that.json.name + "'"
                sqlwhereurl = that.backSheng
                that.bSheng.definitionExpression = "省 = '" + that.json.name + "'"
                // that.datalayer.definitionExpression = "省 = '" + that.json.name + "'"
                that.bSheng.refresh()
                // that.datalayer.refresh()
              } else if (that.json.where === 2) {
                that.bSheng.visible = false
                that.bShi.visible = true
                that.bxian.visible = false
                sqlwhere = "市 = '" + that.json.name + "'"
                sqlwhereurl = that.backShi
                that.bShi.definitionExpression = "市 = '" + that.json.name + "'"
                // that.datalayer.definitionExpression = "市 = '" + that.json.name + "'"
                // that.datalayer.refresh()
                that.bShi.refresh()
              } else if (that.json.where === 3) {
                that.bSheng.visible = false
                that.bShi.visible = false
                that.bxian.visible = true
                sqlwhere = "NAME = '" + that.json.name + "'"
                sqlwhereurl = that.backxian
                that.bxian.definitionExpression = "NAME = '" + that.json.name + "'"
                // that.datalayer.definitionExpression = "县 = '" + that.json.name + "'"
                // that.datalayer.refresh()
                that.bxian.refresh()
              }
              areaQuery(sqlwhere, sqlwhereurl)
            })
            var arearsLayer = new GraphicsLayer()
            function areaQuery(sqlwhere, sqlwhereurl) {
              var areaLayer = new FeatureLayer(sqlwhereurl)
              arearsLayer.removeAll()
              that.map.add(arearsLayer)
              var query1 = new Query({
                returnGeometry: true,
                outFields: ['*']
              })
              query1.where = sqlwhere
              areaLayer.queryFeatures(query1).then(function(response) {
                if (response.features.length !== 0) {
                  getAreaResults(response)
                } else {
                  // promiseRejected()
                }
              })
            }
            // 定位结果高亮
            function getAreaResults(response) {
              peakResults = response.features.map(function(feature) {
                // feature.symbol = {
                //   type: 'simple-fill', // autocasts as new SimpleFillSymbol()
                //   style: 'solid',
                //   color: [173, 220, 220, 0.35],
                //   outline: { // autocasts as new SimpleLineSymbol()
                //     type: 'simple-line',
                //     width: 1,
                //     color: 'rgb(0,255,255)'
                //   // style: 'long-dash'
                //   }
                // }
                return feature
              })
              // arearsLayer.addMany(peakResults)
              that.view.goTo(peakResults).then(function name(params) {
              })
            }
          }
        })
      })
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
      return i.getFullYear() + '-' + that.checkTime(i.getMonth() + 1) + '-' + that.checkTime(i.getDate())
    }
  }
}
</script>
<style scoped>
@font-face {
  src: url("./public/font/KuHei.ttf");
  font-family: "KuHei";
}
#query {
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
#query ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
/* 地图 */
#query #querymap {
  position: absolute;
  width: 100%;
  height: 100%;
}
/* 查询类型 */
#query .type {
  position: absolute;
  z-index: 10;
  top: 55px;
  right: 410px;
  font-family: KuHei;
  font-size: 14px;
}
/* 模拟点击 */
#query .type .dw{
  display: none;
}
#query .type .jiadian{
  display: none;
}
#query .type li {
  width: 100px;
  height: 35px;
  text-align: center;
  padding: 5px 0;
  cursor: pointer;
  border-radius: 2px;
  color: rgb(202, 202, 202);
  /* background-color: rgba(79, 133, 177, 0.3); */
  background-color: rgba(79, 133, 177, 0.3);
  border: 1.5px solid #0fafeb;
  transition: all 0.5s;
  margin-bottom: 5px;
}
#query .type li:hover {
  color: rgb(230, 230, 230);
}
/* 周边查询弹框 */
#query .PQuery {
  display: none;
  position: absolute;
  z-index: 10;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 200px;
  background-color: rgb(21 62 109);
  border: 1.5px solid #0fafeb;
  font-family: KuHei;
  color: rgb(202, 202, 202);
}
#query .PQuery p {
  margin: 0;
  padding: 0;
  text-align: center;
}
#query .PQuery .top {
  position: absolute;
  top: 0;
  width: 100%;
  height: 40px;
  line-height: 40px;
  border-bottom: 2px solid rgba(219, 219, 219, 0.555);
}
#query .PQuery .top >>> .el-icon-close {
  position: absolute;
  right: 5px;
  cursor: pointer;
  color: rgb(202, 202, 202);
  transition: all 0.5s;
  top: 50%;
  transform: translate(0, -50%);
  font-size: 20px;
}
#query .PQuery .top >>> .el-icon-close:hover {
  color: rgb(230, 230, 230);
}
#query .PQuery .body {
  position: absolute;
  top: 40px;
  width: 100%;
  height: 110px;
  border-bottom: 2px solid rgba(219, 219, 219, 0.555);
}
#query .PQuery .body li {
  position: absolute;
  height: 100%;
}
#query .PQuery .body li p {
  height: 30px;
  line-height: 30px;
}
#query .PQuery .body li .neirong {
  height: 80px;
  line-height: 80px;
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
}
#query .PQuery .body li .neirong:nth-child(1) {
  height: 110px;
  line-height: 110px;
}
#query .PQuery .body li .neirong >>> .el-input__inner {
  border: none;
  background-color: rgba(255, 255, 255, 0);
  font-family: KuHei;
  color: rgb(202, 202, 202);
  text-align: center;
  border-radius: 0;
  border-bottom: 2px solid rgba(219, 219, 219, 0.555);
}
#query .PQuery .body li .neirong >>> .el-input__suffix {
  display: none;
}
#query .PQuery .body li .neirong >>> .el-input__prefix {
  display: none;
}
#query .timess >>> .el-input__inner {
  width: 200px;
  margin-left: 10px;
  position: absolute;
  top: -50px;
}
#query .timess:nth-child(2) >>> .el-input__inner {
  top: -110px;
}
#query .radiuss >>> .el-input__inner{
  width: 120px;
}
#query .PQuery .body li:nth-child(1) {
  width: 250px;
  left: 0;
  border-right: 2px solid rgba(219, 219, 219, 0.555);
  border-right-style: dashed;
}
#query .PQuery .body li:nth-child(2) {
  width: 150px;
  right: 0;
}
#query .PQuery .bottom {
  position: absolute;
  bottom: 0;
  height: 50px;
  line-height: 50px;
}
#query .PQuery .bottom {
  width: 100%;
  cursor: pointer;
}
/* 条件 */
#query .condition {
  position: absolute;
  right: 5px;
  z-index: 10;
  width: 400px;
  height: calc(100% - 5px);
  color: #fff;
  font-family: KuHei;
  font-size: 14px;
  border-radius: 2px;
  /* border: 1.5px solid #0fafeb; */
}
#query .condition .top {
  position: absolute;
  width: calc(100% - 10px);
  left: 5px;
  top: 5px;
  height: calc(40% - 5px);
  /* border: 1.5px solid #0fafeb; */
  /* background: url("./public/img/bx.png") rgba(255, 255, 255, 0.1); */
  background: url("./public/img/bx.png") ;
  background-size: 100% 100%;
}
#query .condition .centers {
  position: absolute;
  width: calc(100% - 10px);
  left: 5px;
  top: calc(40% + 5px);
  height: calc(10% - 5px);
  /* border: 2px solid rgba(25, 186, 139, 0.2); */
  border:none;
  /* background: url("./public/img/bg.png") rgba(255, 255, 255, 0.1); */
  background: url("./public/img/bx.png");
  background-size: 100% 100%;
  /* 背景 */
}
#query .condition .centerx {
  position: absolute;
  width: calc(100% - 10px);
  left: 5px;
  top: calc(50% + 5px);
  height: calc(50% - 10px);
  /* border: 2px solid rgba(25, 186, 139, 0.2); */
  border: none;
  /* background: url("./public/img/bg.png") rgba(255, 255, 255, 0.1); */
  background: url("./public/img/bx.png");
   background-size: 100% 100%;
}
/* 图表 */
#query .chart {
  display: none;
  position: absolute;
  left: 5px;
  top: 5px;
  z-index: 10;
  padding: 5px;
  background-color: rgba(40, 43, 57, 0.1);
  border: 1.5px solid #0fafeb;
  width: 300px;
  height: calc(100% - 10px);
  color: #fff;
  font-family: KuHei;
  font-size: 14px;
  border-radius: 2px;
}
#query .chart .public {
  position: absolute;
  width: calc(100% - 10px);
  border: 1.5px solid #0fafeb;
  /* background: url("./public/img/bg.png") rgba(255, 255, 255, 0.1); */
  background: url("./public/img/bg.png") rgba(79, 133, 177, 0.3);
  height: calc((100% / 3) - 6.67px);
}
#query .chart .public:nth-child(2) {
  top: 50%;
  transform: translateY(-50%);
}
#query .chart .public:nth-child(3) {
  bottom: 5px;
}
#query .chart .public:nth-child(3) >>> .el-carousel,
#query .chart .public:nth-child(3) >>> .el-carousel__container {
  position: absolute;
  width: 100%;
  height: 100%;
}
#query .condition .top::after,
#query .condition .centers::after,
#query .condition .centerx::after,
#query .condition .bottom::after,
#query .chart .public::after {
  position: absolute;
  content: "";
  bottom: -1px;
  right: -1px;
  height: 10px;
  width: 10px;
  /* border-bottom: 2px solid #02a6b5; */
  /* border-right: 2px solid #02a6b5; */
  transition: all 1.5s;
  z-index: 0;
}
#query .condition .top::before,
#query .condition .centers::before,
#query .condition .centerx::before,
#query .condition .bottom::before,
#query .chart .public::before {
  position: absolute;
  content: "";
  top: -1px;
  left: -1px;
  height: 10px;
  width: 10px;
  /* border-top: 2px solid #02a6b5; */
  /* border-left: 2px solid #02a6b5; */
  transition: all 1.5s;
  z-index: 0;
}
/* 表单 */
#query .table {
  display: none;
  position: absolute;
  width: calc(100% - 720px);
  height: 245px;
  background-color: rgba(79, 133, 177, 0.3);
  bottom: 5px;
  left: 310px;
  padding: 5px;
  border: 1.5px solid #0fafeb;
  color: #fff;
  transition: all 1s;
}
/* 切换 */
#query .condition .top >>> .el-icon-arrow-left {
  position: absolute;
  color: #fff;
  font-size: 18px;
  z-index: 10;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 50%;
  background-color: rgba(204, 204, 204, 0.3);
  top: 5px;
  cursor: pointer;
  transition: all 0.5s;
  left: 5px;
  animation: fade-in;
  animation-duration: 1s;
  -webkit-animation: fade-in 1s;
}
#query .condition .top >>> .el-icon-arrow-right {
  position: absolute;
  color: #fff;
  font-size: 18px;
  z-index: 10;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 50%;
  background-color: rgba(204, 204, 204, 0.3);
  top: 5px;
  cursor: pointer;
  transition: all 0.5s;
  right: 5px;
  animation: fade-in;
  animation-duration: 1s;
  -webkit-animation: fade-in 1s;
}
.x {
  display: none;
}
</style>
