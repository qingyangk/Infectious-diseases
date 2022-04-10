<template>
  <div id="Travel">
    <!-- 城市选择器 -->
    <selectRegion />
    <!-- 地图 -->
    <div id="allmap" />
    <!-- 参数 -->
    <div class="Mapwaper">
      <!-- 头 -->
      <div class="top">出行风险分析</div>
      <!-- 身子 -->
      <div class="body">
        <div class="Btop">时间选择</div>
        <div class="Bbody">
          <div class="fTime">
            <i class="el-icon-d-arrow-left img" style="font-size:21px" @click="ReduceTime()" />
            <el-date-picker v-model="timx" type="date" placeholder="选择日期" :picker-options="pickerOptions" :editable="false" @change="STime()" />
            <i class="el-icon-d-arrow-right img" style="font-size:21px" @click="IncreaseTime()" />
          </div>
        </div>
        <div class="Bbotton" @click="selecttime"><i class="el-icon-s-promotion" />开始分析</div>
      </div>
      <!-- 底部 -->
      <div class="bottom">
        <div class="content">
          <!-- 出行方式 -->
          <div class="Mtop">
            <div class="left">
              <span>出行工具</span>
            </div>
            <div class="right">
              <el-select v-model="tool" placeholder="请选择" :popper-append-to-body="false" @change="trafficchange">
                <el-option v-for="item in traffic" :key="item.tool" :label="item.label" :value="item.tool" />
              </el-select>
            </div>
          </div>
          <!-- 地点 -->
          <div class="Mbottom">
            <ul>
              <li>
                出发点：
              </li>
              <li>
                <el-input id="suggestId" v-model="fistpoint" placeholder="请输入起点" />
                <div id="searchResultPanel" style="display: none" />
              </li>
              <li @click="addEl">
                <i class="el-icon-plus" />
              </li>
            </ul>
            <ul v-for="(list,index) in lists" :key="index">
              <li>
                目的地：
              </li>
              <li>
                <el-input :id="'sug'+index" v-model="list.mesg" placeholder="请输入目的地" @focus="getlocalname(index)" />
                <div :id="'search'+index" style="display: none" />
              </li>
              <li @click="del(index)">
                <i class="el-icon-delete" />
              </li>
            </ul>
          </div>
          <!-- 方法 -->
          <div class="NextStep" @click="nextstp">下一步</div>
        </div>
      </div>
    </div>
    <!-- 展示 -->
    <div v-show="dangerjudge" id="golineTip" />
    <div class="WaringWaper">
      <div v-show="dangercountnum" class="ToolRate">
        <span class="DangerTitle">危险系数：</span>
        <el-input v-model="dangercot" class="SLNum" />
        <div class="calculate" @click="dangercount">计算</div>
      </div>
    </div>
    <!-- 路由 -->
    <router />
    <!-- 加载动画 -->
    <div id="bg">
      <div id="xuan">
        <span /><span /><span /><span />
      </div>
    </div>
  </div>
</template>

<script>
import inMap from 'inmap'
import Router from './router'
import jsdata from '../public/js/02.json'
import SelectRegion from './selectRegion'
import eventBuq from '../public/js/EvebtBus'
var BMap = window.BMap
export default {
  name: 'HelloWorld',
  components: {
    Router,
    SelectRegion
  },
  data() {
    return {
      json: {
        table: '', // 表名
        name: '', // 地名
        where: 0 // 层级
      },
      inmap: null,
      traftool: 0,
      searchIndex: false,
      dangerjudge: false,
      tables: [],
      lists: [{
        id: 1,
        mesg: '',
        pre: {
          lng: '',
          lat: ''
        }
      }],
      map: {},
      input: '',
      gtData: [],
      fistpoint: '',
      fistlng: '',
      fistlat: '',
      A: [],
      dftime: '',
      timx: '',
      traffic: [{
        tool: '1',
        label: '公交'
      }, {
        tool: '2',
        label: '公交+地铁'
      }, {
        tool: '3',
        label: '驾车'
      }],
      tool: '',
      addNum: false,
      trafficIndex: '',
      lineData: [],
      dengNum: 0,
      dengIndex: 0,
      dangercot: '',
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() < new Date(this.timz).getTime() || time.getTime() > Date.now()
        }
      },
      dangercountnum: false,
      dangNums: 0,
      center: [111.972287, 37.146389],
      zoom: 5
    }
  },
  beforeDestroy() {
    eventBuq.$off('json')
  },
  mounted() {
    var that = this
    // 地名
    eventBuq.$on('json', Tiao => {
      this.json.where = Tiao.where
      this.json.name = Tiao.name
      that.dw()
    })
    // 今日时间
    that.timx = that.checkTime2(new Date())
    // 切换时间是否展示
    if ((new Date((new Date(this.timx)).getTime() + 24 * 60 * 60 * 1000)) < (new Date()).getTime()) {
      document.querySelectorAll('.fTime .img')[1].style.zIndex = 0
      document.querySelectorAll('.fTime .img')[1].style.opacity = 1
    } else {
      document.querySelectorAll('.fTime .img')[1].style.zIndex = -10
      document.querySelectorAll('.fTime .img')[1].style.opacity = 0
    }
    this.crMape()
  },
  methods: {
    // 选择时间时触发
    STime() {
      if (this.json.name === '') {
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
      }
    },
    // 减少时间
    ReduceTime() {
      if (this.json.name === '') {
        this.$message({
          message: '请选择城市！',
          type: 'warning',
          showClose: true
        })
      } else {
        this.timx = this.checkTime2(new Date((new Date(this.timx)).getTime() - 24 * 60 * 60 * 1000))
        document.querySelectorAll('.fTime .img')[1].style.zIndex = 0
        document.querySelectorAll('.fTime .img')[1].style.opacity = 1
      }
    },
    // 增加时间
    IncreaseTime() {
      if (this.json.name === '') {
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
      }
    },
    dw() {
      var that = this
      that.inmap.getMap().centerAndZoom(that.json.name)
      setTimeout(() => {
        console.log(that.inmap.getMap().getCenter())
        that.center = [that.inmap.getMap().getCenter().lng, that.inmap.getMap().getCenter().lat]
        that.zoom = that.inmap.getMap().getZoom()
        console.log(that.zoom)
      }, 1000)
    },
    crMape() {
      var that = this
      var data = this.gtData
      that.inmap = new inMap.Map({
        id: 'allmap',
        center: that.center,
        zoom: {
          value: that.zoom,
          show: false
        }
      })
      that.inmap.getMap().addEventListener('click', function(e) {
        // console.log(that.inmap.getMap().getCenter())
      })
      /* eslint-disable no-unused-vars */
      var cen = that.inmap.getMap().getCenter()
      that.inmap.getMap().setMapStyle({
        style: 'dark'
      })
      var overlay = new inMap.GriddingOverlay({
        tooltip: {
          show: false,
          formatter: function(val) {
            return val.count
          }
        },
        style: {
          type: 'avg',
          normal: {
            size: 8,
            unit: 'px', // 单位像素
            padding: 1
          },
          mouseOver: {
            shadowColor: 'rgba(255, 250, 255, 1)',
            shadowBlur: 20
          },
          selected: {
            backgroundColor: 'rgba(184,0,0,1)'
          },
          colors: [
            'rgba(31,98,1,1)', // 绿
            'rgba(95,154,4,1)', // #5F9A04
            'rgba(139,227,7,1)', // #8BE307
            'rgba(218,134,9,1)', // #DA8609
            'rgba(220,54,6,1)', // #DC3606
            'rgba(218,2,8,1)', // #DA0208
            'rgba(148,1,2,1)', // #940102
            'rgba(92,1,0,1)'// #5C0100
          ]
        },
        data: data,
        event: {
          onState(state) {
          },
          onMouseClick(data, event) {
          }
        }
      })
      that.inmap.add(overlay)
      this.map = that.inmap
      this.searchmap(that.inmap)
    },
    selecttime(val) {
      if (this.json.name === '') {
        this.$message({
          message: '请选择城市！',
          type: 'warning',
          showClose: true
        })
      } else {
        document.getElementById('bg').style.display = 'block'
        var data = []
        for (let index = 0; index < jsdata.length; index++) {
          const element = jsdata[index]
          const aNumber = (1000 - 20) * Math.random() + 20
          const result = Math.floor(aNumber)
          data.push({ 'count': result, geometry: { 'type': 'Point', 'coordinates': [element.lng, element.lat] }})
        }
        this.gtData = data
        this.crMape()
        setTimeout(() => {
          document.getElementById('bg').style.display = 'none'
        }, 3000)
      }
    },
    del: function(index) {
      if (this.addNum === true) {
        alert('请先重置')
      } else {
        alert('确定删除吗？')
        this.lists.splice(index, 1)
      }
    },
    addEl: function() {
      if (this.addNum === true) {
        alert('请先重置')
      } else {
        let dfIndex = 0
        if (!document.getElementById('suggestId').value) {
          alert('请填写出发点')
        } else {
          const len = this.lists.length
          for (let i = 0; i < len; i++) {
            if (!document.getElementById('sug' + i).value) {
              alert('请填写目的地')
            } else {
              dfIndex++
            }
          }
          if (dfIndex === len) {
            this.searchIndex = false
            const num = this.lists.id + 1
            const cope = {
              id: num,
              mesg: '',
              pre: {
                lng: '',
                lat: ''
              }
            }
            this.lists.push(cope)
          }
        }
      }
    },
    searchmap(inmap) {
      const that = this
      function G(id) {
        return document.getElementById(id)
      }
      var map = inmap.getMap()
      // eslint-disable-next-line no-undef
      var ac = new BMap.Autocomplete( // 建立一个自动完成的对象
        { 'input': 'suggestId',
          'location': map
        })
      ac.addEventListener('onhighlight', function(e) { // 鼠标放在下拉列表上的事件
        var str = ''
        var _value = e.fromitem.value
        var value = ''
        if (e.fromitem.index > -1) {
          value = _value.province + _value.city + _value.district + _value.street + _value.business
        }
        str = 'FromItem<br />index = ' + e.fromitem.index + '<br />value = ' + value
        value = ''
        if (e.toitem.index > -1) {
          _value = e.toitem.value
          value = _value.province + _value.city + _value.district + _value.street + _value.business
        }
        str += '<br />ToItem<br />index = ' + e.toitem.index + '<br />value = ' + value
        G('searchResultPanel').innerHTML = str
      })
      var myValue
      ac.addEventListener('onconfirm', function(e) { // 鼠标点击下拉列表后的事件
        var _value = e.item.value
        myValue = _value.province + _value.city + _value.district + _value.street + _value.business
        G('searchResultPanel').innerHTML = 'onconfirm<br />index = ' + e.item.index + '<br />myValue = ' + myValue

        setPlace()
      })

      function setPlace() {
        function myFun() {
          var pp = local.getResults().getPoi(0).point // 获取第一个智能搜索的结果
          that.fistlng = pp.lng
          that.fistlat = pp.lat
          // // console.log(pp) // 添加标注
        }
        // eslint-disable-next-line no-undef
        var local = new BMap.LocalSearch(map, { // 智能搜索
          onSearchComplete: myFun
        })
        local.search(myValue)
      }
    },
    getlocalname(index) {
      const that = this
      if (this.searchIndex === false) {
        this.searchIndex = true
        const inmap = this.map

        // eslint-disable-next-line no-inner-declarations
        function G(id) {
          return document.getElementById(id)
        }
        var map = inmap.getMap()
        // eslint-disable-next-line no-undef
        var ac = new BMap.Autocomplete( // 建立一个自动完成的对象
          { 'input': 'sug' + index,
            'location': map
          })

        ac.addEventListener('onhighlight', function(e) { // 鼠标放在下拉列表上的事件
          var str = ''
          var _value = e.fromitem.value
          var value = ''
          if (e.fromitem.index > -1) {
            value = _value.province + _value.city + _value.district + _value.street + _value.business
          }
          str = 'FromItem<br />index = ' + e.fromitem.index + '<br />value = ' + value

          value = ''
          if (e.toitem.index > -1) {
            _value = e.toitem.value
            value = _value.province + _value.city + _value.district + _value.street + _value.business
          }
          str += '<br />ToItem<br />index = ' + e.toitem.index + '<br />value = ' + value
          G('search' + index).innerHTML = str
        })
        var myValue
        ac.addEventListener('onconfirm', function(e) { // 鼠标点击下拉列表后的事件
          var _value = e.item.value
          myValue = _value.province + _value.city + _value.district + _value.street + _value.business
          G('search' + index).innerHTML = 'onconfirm<br />index = ' + e.item.index + '<br />myValue = ' + myValue

          setPlace()
        })

        // eslint-disable-next-line no-inner-declarations
        function setPlace() {
          function myFun() {
            var pp = local.getResults().getPoi(0).point // 获取第一个智能搜索的结果
            that.lists[index].pre.lng = pp.lng
            that.lists[index].pre.lat = pp.lat
          }
          // eslint-disable-next-line no-undef
          var local = new BMap.LocalSearch(map, { // 智能搜索
            onSearchComplete: myFun
          })
          local.search(myValue)
        }
      }
    },
    // reset() {
    //   this.reload()
    // },
    trafficchange(val) {
      this.trafficIndex = val
    },
    nextstp() {
      document.getElementById('bg').style.display = 'block'
      setTimeout(() => {
        document.getElementById('bg').style.display = 'none'
      }, 3000)

      let nextIndex = false
      let fistIndex = false
      let sendIndex = false
      const that = this
      if (!this.tool) {
        alert('请选择出行方式')
      } else {
        fistIndex = true
      }
      // eslint-disable-next-line eqeqeq
      if (fistIndex == true) {
        if (!this.fistpoint) {
          alert('请填写出发点')
        } else {
          sendIndex = true
        }
      }
      // eslint-disable-next-line eqeqeq
      if (sendIndex == true) {
        const len = this.lists.length
        for (let i = 0; i < len; i++) {
          if (!document.getElementById('sug' + i).value) {
            alert('请填写目的地')
          }
        }
      }

      const len = this.lists.length
      for (let i = 0; i < len; i++) {
        if (document.getElementById('sug' + i).value) {
          nextIndex = true
        }
      }
      // eslint-disable-next-line eqeqeq
      if (nextIndex == true) {
        const inmap = this.map
        const map = inmap.getMap()
        // eslint-disable-next-line eqeqeq
        if (this.trafficIndex == 1) {
          this.traftool = 0
          // eslint-disable-next-line no-undef
          var routePolicy = BMAP_TRANSIT_POLICY_AVOID_SUBWAYS
          var transit0 = new BMap.TransitRoute(map, {
            renderOptions: { map: map, panel: 'r-result' }
          })
          var start = new BMap.Point(this.fistlng, this.fistlat)
          var aname0 = new BMap.Point(this.lists[0].pre.lng, this.lists[0].pre.lat)
          search(start, aname0, routePolicy)
          // eslint-disable-next-line no-inner-declarations
          function search(start, end, route) {
            transit0.setPolicy(route)
            transit0.search(start, end)
          }
          transit0.setPolylinesSetCallback(function(result) {
            const reslen = result.length
            for (let x = 0; x < reslen; x++) {
              console.log(result[x], '数据来源1')
              const len = result[x].Ar.length
              for (let i = 0; i < len; i++) {
                that.lineData.push(result[x].Ar[i])
              }
            }
          })

          // transit0.search(start,aname0)

          const len = this.lists.length
          if (len > 1) {
            for (let i = 1; i < len; i++) {
              var name = 'transit' + i
              name = new BMap.TransitRoute(map, {
                renderOptions: { map: map, panel: 'r-result' }
              })
              const a = new BMap.Point(this.lists[i - 1].pre.lng, this.lists[i - 1].pre.lat)
              const b = new BMap.Point(this.lists[i].pre.lng, this.lists[i].pre.lat)
              // name.search(a,b)
              search(a, b, routePolicy)
              // eslint-disable-next-line no-inner-declarations
              function search(start, end, route) {
                name.setPolicy(route)
                name.search(start, end)
              }
              name.setPolylinesSetCallback(function(result) {
                // // console.log(result, 'res2')
                const reslen = result.length
                for (let x = 0; x < reslen; x++) {
                  console.log(result[x], '数据来源2')
                  const len = result[x].Ti.length
                  for (let i = 0; i < len; i++) {
                    that.lineData.push(result[x].Ti[i])
                  }
                }
              })
              var myIconfist = new BMap.Icon('/js/dangermap/起点.png', new BMap.Size(50, 50))
              var myIconcet = new BMap.Icon('/js/dangermap/中间点.png', new BMap.Size(50, 50))
              var myLablefist = '起点'
              var myLablecet = '中点'
              transit0.setMarkersSetCallback(function(result) {
                result[0].marker.setIcon(myIconfist)
                result[1].marker.setIcon(myIconcet)
                result[0].marker.setTitle(myLablefist)
                result[1].marker.setTitle(myLablecet)
              })
              if (len > 2) {
                // eslint-disable-next-line eqeqeq
                if (i == len - 1) {
                  myIconcet = new BMap.Icon('/js/dangermap/中间点.png', new BMap.Size(50, 50))
                  var myIconend = new BMap.Icon('/js/dangermap/终点.png', new BMap.Size(50, 50))
                  myLablecet = '中点'
                  var myLableend = '终点'
                  name.setMarkersSetCallback(function(result) {
                    result[0].marker.setIcon(myIconcet)
                    result[1].marker.setIcon(myIconend)
                    result[0].marker.setTitle(myLablecet)
                    result[1].marker.setTitle(myLableend)
                  })
                } else {
                  myIconcet = new BMap.Icon('/js/dangermap/中间点.png', new BMap.Size(50, 50))
                  myLablecet = '中点'
                  name.setMarkersSetCallback(function(result) {
                    result[0].marker.setIcon(myIconcet)
                    result[1].marker.setIcon(myIconcet)
                    result[0].marker.setTitle(myLablecet)
                    result[1].marker.setTitle(myLablecet)
                  })
                }
              }
              if (len < 3) {
                // eslint-disable-next-line eqeqeq
                if (i == len - 1) {
                  myIconcet = new BMap.Icon('/js/dangermap/中间点.png', new BMap.Size(50, 50))
                  myIconend = new BMap.Icon('/js/dangermap/终点.png', new BMap.Size(50, 50))
                  myLablecet = '中点'
                  myLableend = '终点'
                  name.setMarkersSetCallback(function(result) {
                    result[0].marker.setIcon(myIconcet)
                    result[1].marker.setIcon(myIconend)
                    result[0].marker.setTitle(myLablecet)
                    result[1].marker.setTitle(myLableend)
                  })
                } else {
                  myIconcet = new BMap.Icon('/js/dangermap/中间点.png', new BMap.Size(50, 50))
                  myLablecet = '中点'
                  name.setMarkersSetCallback(function(result) {
                    result[0].marker.setIcon(myIconcet)
                    result[1].marker.setIcon(myIconcet)
                    result[0].marker.setTitle(myLablecet)
                    result[1].marker.setTitle(myLablecet)
                  })
                }
              }
            }
          }
          document.getElementsByTagName('canvas')[0].style.zIndex = -1
          // eslint-disable-next-line eqeqeq
          if (len == 1) {
            myIconend = new BMap.Icon('/js/dangermap/终点.png', new BMap.Size(50, 50))
            myIconfist = new BMap.Icon('/js/dangermap/起点.png', new BMap.Size(50, 50))
            myLablefist = '起点'
            myLableend = '终点'
            transit0.setMarkersSetCallback(function(result) {
              result[0].marker.setIcon(myIconfist)
              result[1].marker.setIcon(myIconend)
              result[0].marker.setTitle(myLablefist)
              result[1].marker.setTitle(myLableend)
            })
          }
          this.addNum = true
          myIconend = new BMap.Icon('/js/dangermap/终点.png', new BMap.Size(50, 50))
          myIconfist = new BMap.Icon('/js/dangermap/起点.png', new BMap.Size(50, 50))
          const lencd = this.lists.length
          var theendmap = new BMap.TransitRoute(map, {
            renderOptions: { map: map, panel: 'r-result' }
          })
          var theend = new BMap.Point(this.fistlng, this.fistlat)
          var theced = new BMap.Point(this.lists[lencd - 1].pre.lng, this.lists[lencd - 1].pre.lat)
          searchcd(theced, theend, routePolicy)
          // eslint-disable-next-line no-inner-declarations
          function searchcd(start, end, route) {
            theendmap.setPolicy(route)
            theendmap.search(start, end)
          }
          theendmap.setPolylinesSetCallback(function(result) {
            // // console.log(result, 'res3')
            const reslen = result.length
            for (let x = 0; x < reslen; x++) {
              console.log(result[x], '数据来源3')
              const len = result[x].Ar.length
              for (let i = 0; i < len; i++) {
                that.lineData.push(result[x].Ar[i])
              }
            }
          })
          theendmap.setMarkersSetCallback(function(result) {
            result[0].marker.setIcon(myIconend)
            result[1].marker.setIcon(myIconfist)
          })
        // eslint-disable-next-line eqeqeq
        } else if (this.trafficIndex == 2) {
          this.traftool = 0
          transit0 = new BMap.TransitRoute(map, {
            renderOptions: { map: map, panel: 'r-result' }
          })
          start = new BMap.Point(this.fistlng, this.fistlat)
          aname0 = new BMap.Point(this.lists[0].pre.lng, this.lists[0].pre.lat)
          transit0.search(start, aname0)
          transit0.setPolylinesSetCallback(function(result) {
            // // console.log(result, 'res1')
            const reslen = result.length
            for (let x = 0; x < reslen; x++) {
              console.log(result[x], '数据来源4')
              const len = result[x].Ti.length
              for (let i = 0; i < len; i++) {
                that.lineData.push(result[x].Ti[i])
              }
            }
          })

          const len = this.lists.length
          if (len > 1) {
            for (let i = 1; i < len; i++) {
              name = 'transit' + i
              name = new BMap.TransitRoute(map, {
                renderOptions: { map: map, panel: 'r-result' }
              })
              const a = new BMap.Point(this.lists[i - 1].pre.lng, this.lists[i - 1].pre.lat)
              const b = new BMap.Point(this.lists[i].pre.lng, this.lists[i].pre.lat)
              name.search(a, b)
              name.setPolylinesSetCallback(function(result) {
                // // console.log(result, 'res2')
                const reslen = result.length
                for (let x = 0; x < reslen; x++) {
                  // // console.log(result[x], '数据来源5')
                  const len = result[x].Ti.length
                  for (let i = 0; i < len; i++) {
                    that.lineData.push(result[x].Ti[i])
                  }
                }
              })

              myIconfist = new BMap.Icon('/js/dangermap/起点.png', new BMap.Size(50, 50))
              myIconcet = new BMap.Icon('/js/dangermap/中间点.png', new BMap.Size(50, 50))
              myLablefist = '起点'
              myLablecet = '中点'
              transit0.setMarkersSetCallback(function(result) {
                result[0].marker.setIcon(myIconfist)
                result[1].marker.setIcon(myIconcet)
                result[0].marker.setTitle(myLablefist)
                result[1].marker.setTitle(myLablecet)
              })
              if (len > 2) {
                // eslint-disable-next-line eqeqeq
                if (i == len - 1) {
                  myIconcet = new BMap.Icon('/js/dangermap/static/中间点.png', new BMap.Size(50, 50))
                  myIconend = new BMap.Icon('/js/dangermap/static/终点.png', new BMap.Size(50, 50))
                  myLablecet = '中点'
                  myLableend = '终点'
                  name.setMarkersSetCallback(function(result) {
                    result[0].marker.setIcon(myIconcet)
                    result[1].marker.setIcon(myIconend)
                    result[0].marker.setTitle(myLablecet)
                    result[1].marker.setTitle(myLableend)
                  })
                } else {
                  myIconcet = new BMap.Icon('/js/dangermap/中间点.png', new BMap.Size(50, 50))
                  myLablecet = '中点'
                  name.setMarkersSetCallback(function(result) {
                    result[0].marker.setIcon(myIconcet)
                    result[1].marker.setIcon(myIconcet)
                    result[0].marker.setTitle(myLablecet)
                    result[1].marker.setTitle(myLablecet)
                  })
                }
              }
              if (len < 3) {
                // eslint-disable-next-line eqeqeq
                if (i == len - 1) {
                  myIconcet = new BMap.Icon('/js/dangermap/中间点.png', new BMap.Size(50, 50))
                  myIconend = new BMap.Icon('/js/dangermap/终点.png', new BMap.Size(50, 50))
                  myLablecet = '中点'
                  myLableend = '终点'
                  name.setMarkersSetCallback(function(result) {
                    result[0].marker.setIcon(myIconcet)
                    result[1].marker.setIcon(myIconend)
                    result[0].marker.setTitle(myLablecet)
                    result[1].marker.setTitle(myLableend)
                  })
                } else {
                  myIconcet = new BMap.Icon('/js/dangermap/中间点.png', new BMap.Size(50, 50))
                  myLablecet = '中点'
                  name.setMarkersSetCallback(function(result) {
                    result[0].marker.setIcon(myIconcet)
                    result[1].marker.setIcon(myIconcet)
                    result[0].marker.setTitle(myLablecet)
                    result[1].marker.setTitle(myLablecet)
                  })
                }
              }
            }
          }
          document.getElementsByTagName('canvas')[0].style.zIndex = -1
          // eslint-disable-next-line eqeqeq
          if (len == 1) {
            myIconend = new BMap.Icon('/js/dangermap/终点.png', new BMap.Size(50, 50))
            myIconfist = new BMap.Icon('/js/dangermap/起点.png', new BMap.Size(50, 50))
            myLablefist = '起点'
            myLableend = '终点'
            transit0.setMarkersSetCallback(function(result) {
              result[0].marker.setIcon(myIconfist)
              result[1].marker.setIcon(myIconend)
              result[0].marker.setTitle(myLablefist)
              result[1].marker.setTitle(myLableend)
            })
          }
          this.addNum = true
          myIconend = new BMap.Icon('/js/dangermap/终点.png', new BMap.Size(50, 50))
          myIconfist = new BMap.Icon('/js/dangermap/起点.png', new BMap.Size(50, 50))
          const lencd = this.lists.length
          theendmap = new BMap.TransitRoute(map, {
            renderOptions: { map: map, panel: 'r-result' }
          })
          theend = new BMap.Point(this.fistlng, this.fistlat)
          theced = new BMap.Point(this.lists[lencd - 1].pre.lng, this.lists[lencd - 1].pre.lat)
          theendmap.search(theced, theend)
          theendmap.setPolylinesSetCallback(function(result) {
            // // console.log(result, 'res3')
            const reslen = result.length
            for (let x = 0; x < reslen; x++) {
              // // console.log(result[x], '数据来源6')
              const len = result[x].Ti.length
              for (let i = 0; i < len; i++) {
                that.lineData.push(result[x].Ti[i])
              }
            }
          })
          theendmap.setMarkersSetCallback(function(result) {
            result[0].marker.setIcon(myIconend)
            result[1].marker.setIcon(myIconfist)
          })
        // eslint-disable-next-line eqeqeq
        } else if (this.trafficIndex == 3) {
          this.traftool = 1
          transit0 = new BMap.DrivingRoute(map, {
            renderOptions: { map: map, panel: 'r-result' }
          })
          start = new BMap.Point(this.fistlng, this.fistlat)
          aname0 = new BMap.Point(this.lists[0].pre.lng, this.lists[0].pre.lat)
          transit0.search(start, aname0)
          transit0.setPolylinesSetCallback(function(result) {
            console.log(result, '数据来源7')
            const len = result[0].tr.length
            for (let i = 0; i < len; i++) {
              that.lineData.push(result[0].tr[i])
            }
          })

          const len = this.lists.length
          if (len > 1) {
            for (let i = 1; i < len; i++) {
              name = 'transit' + i
              name = new BMap.DrivingRoute(map, {
                renderOptions: { map: map, panel: 'r-result' }
              })
              const a = new BMap.Point(this.lists[i - 1].pre.lng, this.lists[i - 1].pre.lat)
              const b = new BMap.Point(this.lists[i].pre.lng, this.lists[i].pre.lat)
              name.search(a, b)
              name.setPolylinesSetCallback(function(result) {
                console.log(result[0], '数据来源8')
                const len = result[0].tr.length
                for (let i = 0; i < len; i++) {
                  that.lineData.push(result[0].tr[i])
                }
              })

              myIconfist = new BMap.Icon('/js/dangermap/起点.png', new BMap.Size(50, 50))
              myIconcet = new BMap.Icon('/js/dangermap/中间点.png', new BMap.Size(50, 50))
              myLablefist = '起点'
              myLablecet = '中点'
              transit0.setMarkersSetCallback(function(result) {
                result[0].marker.setIcon(myIconfist)
                result[1].marker.setIcon(myIconcet)
                result[0].marker.setTitle(myLablefist)
                result[1].marker.setTitle(myLablecet)
              })
              if (len > 2) {
                // eslint-disable-next-line eqeqeq
                if (i == len - 1) {
                  myIconcet = new BMap.Icon('/js/dangermap/中间点.png', new BMap.Size(50, 50))
                  myLablecet = '中点'
                  myLableend = '终点'
                  name.setMarkersSetCallback(function(result) {
                    result[0].marker.setIcon(myIconcet)
                    result[1].marker.setIcon(myIconcet)
                    result[0].marker.setTitle(myLablecet)
                    result[1].marker.setTitle(myLableend)
                  })
                } else {
                  myIconcet = new BMap.Icon('/js/dangermap/中间点.png', new BMap.Size(50, 50))
                  myLablecet = '中点'
                  name.setMarkersSetCallback(function(result) {
                    result[0].marker.setIcon(myIconcet)
                    result[1].marker.setIcon(myIconcet)
                    result[0].marker.setTitle(myLablecet)
                    result[1].marker.setTitle(myLablecet)
                  })
                }
              }
              if (len < 3) {
                // eslint-disable-next-line eqeqeq
                if (i == len - 1) {
                  myIconcet = new BMap.Icon('/js/dangermap/中间点.png', new BMap.Size(50, 50))
                  myLablecet = '中点'
                  myLableend = '终点'
                  name.setMarkersSetCallback(function(result) {
                    result[0].marker.setIcon(myIconcet)
                    result[1].marker.setIcon(myIconcet)
                    result[0].marker.setTitle(myLablecet)
                    result[1].marker.setTitle(myLableend)
                  })
                } else {
                  myIconcet = new BMap.Icon('/js/dangermap/中间点.png', new BMap.Size(50, 50))
                  myLablecet = '中点'
                  name.setMarkersSetCallback(function(result) {
                    result[0].marker.setIcon(myIconcet)
                    result[1].marker.setIcon(myIconcet)
                    result[0].marker.setTitle(myLablecet)
                    result[1].marker.setTitle(myLablecet)
                  })
                }
              }
            }
          }
          document.getElementsByTagName('canvas')[0].style.zIndex = -1
          if (len === 1) {
            myIconend = new BMap.Icon('/js/dangermap/终点.png', new BMap.Size(50, 50))
            myIconcet = new BMap.Icon('/js/dangermap/中间点.png', new BMap.Size(50, 50))
            myLablefist = '起点'
            myLableend = '终点'
            transit0.setMarkersSetCallback(function(result) {
              result[0].marker.setIcon(myIconfist)
              result[1].marker.setIcon(myIconcet)
              result[0].marker.setTitle(myLablefist)
              result[1].marker.setTitle(myLableend)
            })
          }
          myIconend = new BMap.Icon('/js/dangermap/终点.png', new BMap.Size(50, 50))
          myIconfist = new BMap.Icon('/js/dangermap/起点.png', new BMap.Size(50, 50))
          const lencd = this.lists.length
          theendmap = new BMap.DrivingRoute(map, {
            renderOptions: { map: map, panel: 'r-result' }
          })
          theend = new BMap.Point(this.fistlng, this.fistlat)
          theced = new BMap.Point(this.lists[lencd - 1].pre.lng, this.lists[lencd - 1].pre.lat)
          theendmap.search(theced, theend)
          theendmap.setMarkersSetCallback(function(result) {
            result[0].marker.setIcon(myIconend)
            result[1].marker.setIcon(myIconfist)
          })

          theendmap.setPolylinesSetCallback(function(result) {
            console.log(result, '数据来源9')
            const len = result[0].tr.length
            for (let i = 0; i < len; i++) {
              that.lineData.push(result[0].tr[i])
            }
          })
        }
        setTimeout(() => {
          // // console.log(that.lineData, 'res4')
          that.dangNum()
        }, 2000)
      }
    },
    dangNum() {
      var that = this
      console.log(this.lineData, 'dengIndex')
      const lenadd = this.lineData.length
      // // console.log(lenadd)
      this.dengIndex = this.lineData.length
      function rad(d) {
        return d * Math.PI / 180.0
      }

      function deg(x) {
        return x * 180 / Math.PI
      }
      function getLonAndLat(lng, lat, brng, dist) {
        // 大地坐标系资料WGS-84 长半径a=6378137 短半径b=6356752.3142 扁率f=1/298.2572236
        var a = 6378137
        var b = 6356752.3142
        var f = 1 / 298.257223563

        var lon1 = lng * 1
        var lat1 = lat * 1
        var s = dist
        var alpha1 = rad(brng)
        var sinAlpha1 = Math.sin(alpha1)
        var cosAlpha1 = Math.cos(alpha1)

        var tanU1 = (1 - f) * Math.tan(rad(lat1))
        var cosU1 = 1 / Math.sqrt((1 + tanU1 * tanU1)); var sinU1 = tanU1 * cosU1
        var sigma1 = Math.atan2(tanU1, cosAlpha1)
        var sinAlpha = cosU1 * sinAlpha1
        var cosSqAlpha = 1 - sinAlpha * sinAlpha
        var uSq = cosSqAlpha * (a * a - b * b) / (b * b)
        var A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)))
        var B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)))

        var sigma = s / (b * A); var sigmaP = 2 * Math.PI
        while (Math.abs(sigma - sigmaP) > 1e-12) {
          var cos2SigmaM = Math.cos(2 * sigma1 + sigma)
          var sinSigma = Math.sin(sigma)
          var cosSigma = Math.cos(sigma)
          var deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
                B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)))
          sigmaP = sigma
          sigma = s / (b * A) + deltaSigma
        }

        var tmp = sinU1 * sinSigma - cosU1 * cosSigma * cosAlpha1
        var lat2 = Math.atan2(sinU1 * cosSigma + cosU1 * sinSigma * cosAlpha1,
          (1 - f) * Math.sqrt(sinAlpha * sinAlpha + tmp * tmp))
        var lambda = Math.atan2(sinSigma * sinAlpha1, cosU1 * cosSigma - sinU1 * sinSigma * cosAlpha1)
        var C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha))
        var L = lambda - (1 - C) * f * sinAlpha *
              (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)))
        // var revAz = Math.atan2(sinAlpha, -tmp) // final bearing
        var lngLatObj = [lon1 + deg(L), deg(lat2)]
        that.A = lngLatObj

        return lngLatObj
      }
      for (let i = 0; i < lenadd; i++) {
        var num = 0
        let j, w
        if (that.traftool === 0) {
          j = that.lineData[i].lng
          w = that.lineData[i].lat
        } else if (that.traftool === 1) {
          j = that.lineData[i].Mh.lng
          w = that.lineData[i].Mh.lat
        }
        // 调用
        var b100; var d100; var n100; var x100 = []
        getLonAndLat(j, w, 0, 100)
        b100 = JSON.parse(JSON.stringify(this.A))
        getLonAndLat(j, w, 90, 100)
        d100 = JSON.parse(JSON.stringify(this.A))
        getLonAndLat(j, w, 180, 100)
        n100 = JSON.parse(JSON.stringify(this.A))
        getLonAndLat(j, w, 270, 100)
        x100 = JSON.parse(JSON.stringify(this.A))

        const A100 = [x100[0], b100[1]]
        const B100 = [x100[0], n100[1]]
        const C100 = [d100[0], b100[1]]

        const len = this.gtData.length
        for (let i = 0; i < len; i++) {
          // 第一块
          if (A100[0] < this.gtData[i].geometry.coordinates[0] && this.gtData[i].geometry.coordinates[0] < C100[0]) {
            // // console.log(A100[0], '???????2')
            if (B100[1] < this.gtData[i].geometry.coordinates[1] && this.gtData[i].geometry.coordinates[1] < A100[1]) {
              num = num + this.gtData[i].count
              this.dangNums = num
              console.log(num)
            }
          }
        }
      }
      document.querySelector('.WaringWaper').style.display = 'block'
      setTimeout(() => {
        that.dangercountnum = true
      }, 1000)
    },
    dangercount() {
      console.log(this.dangNums)
      console.log(this.dengIndex)
      this.dangercot = this.dangNums / this.dengIndex
      // // console.log(this.dangercot)
      if (this.dangercot < 20) {
        this.dangerjudge = true
        document.getElementById('golineTip').innerHTML = '出行风险较低'
        document.getElementById('golineTip').style.color = 'rgba(34,139,34, 1)'
      } else if (this.dangercot > 19 && this.dangercot < 50) {
        this.dangerjudge = true
        document.getElementById('golineTip').innerHTML = '出行风险中等'
        document.getElementById('golineTip').style.color = 'rgba(255,140,0, 1)'
      } else if (this.dangercot > 49) {
        this.dangerjudge = true
        document.getElementById('golineTip').innerHTML = '出行风险较高'
        document.getElementById('golineTip').style.color = 'rgba(255, 62, 33, 1)'
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
    }
  }
}
</script>
<style scoped>
@font-face {
  src: url("../public/font/KuHei.ttf");
  font-family: "KuHei";
}
#Travel {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url("../public/img/back.png") no-repeat center center;
  /* 背景图不平铺 */
  background-size: cover;
  /* 让背景图基于容器大小伸缩 */
  background-attachment: fixed;
  /* 当内容高度大于图片高度时，背景图像的位置相对于viewport固定 */
  background-color: #CCCCCC;
}
#Travel ul,
#Travel p {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
#Travel #allmap {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
}
#Travel .Mapwaper {
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
  padding: 5px;
}
/* 头部 */
#Travel .Mapwaper .top {
  height: 40px;
  line-height: 40px;
  width: 100%;
  /* border: 1.5px solid #0fafeb; */
  background: url("../public/img/bn.png") ;
  background-size: 100% 100%;
  position: relative;
  text-align: center;
  letter-spacing: 5px;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
}
/* 身子 */
#Travel .Mapwaper .body {
  width: 100%;
  height: 140px;
  /* border: 1.5px solid #0fafeb; */
  background: url("../public/img/bn.png");
  background-size: 100% 100%;
  position: relative;
  text-align: center;
  margin-bottom: 5px;
}
#Travel .Mapwaper .body .Btop {
  height: 40px;
  line-height: 40px;
  letter-spacing: 5px;
  font-size: 16px;
  border-bottom: 2px dashed rgba(219, 219, 219, 0.555);
  position: absolute;
  top: 0;
  width: 100%;
}
#Travel .Mapwaper .body .Bbody {
  height: 60px;
  line-height: 60px;
  font-size: 16px;
  position: absolute;
  top: 40px;
  width: 100%;
}
#Travel .Mapwaper .body .Bbody .fTime {
  position: absolute;
  right: 0;
  width: 100%;
  height: 60px;
  line-height: 60px;
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
}
#Travel .Mapwaper .body .Bbody .fTime >>> .el-input__prefix,
#Travel .Mapwaper .body .Bbody .fTime >>> .el-input__suffix {
  display: none;
}
#Travel .Mapwaper .body .Bbody .fTime >>> .el-input__inner {
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
#Travel .Mapwaper .body .Bbody .fTime >>> .el-date-editor.el-input,
#Travel .Mapwaper .body .Bbody .fTime >>> .el-date-editor.el-input__inner {
  width: 140px;
}
#Travel .Mapwaper .body .Bbody .fTime .img {
  margin: 0 15px;
  height: 45px;
  line-height: 45px;
  cursor: pointer;
  color: rgb(199, 199, 199);
  transition: all 0.5s;
}
#Travel .Mapwaper .body .Bbody .fTime .img:hover {
  color: #fff;
}
#Travel .Mapwaper .body .Bbotton {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 40px;
  line-height: 40px;
  letter-spacing: 5px;
  font-size: 16px;
  border-top: 2px dashed rgba(219, 219, 219, 0.555);
  transition: all 0.5s;
  color: rgb(202, 202, 202);
  cursor: pointer;
}
#Travel .Mapwaper .body .Bbotton:hover {
  color: rgb(230, 230, 230);
}
/* 底部 */
#Travel .Mapwaper .bottom {
  width: calc(100% - 10px);
  height: calc(100% - 200px);
  /* border: 1.5px solid #0fafeb; */
  background: url("../public/img/bn.png");
  background-size: 100% 100%;
  position: absolute;
}
#Travel .Mapwaper .bottom .content {
  width: 100%;
  height: 100%;
  position: absolute;
  text-align: center;
}
/* 出行方式 */
#Travel .Mapwaper .bottom .content .Mtop {
  width: 100%;
  height: 60px;
  line-height: 60px;
  border-bottom: 2px solid rgba(219, 219, 219, 0.555);
  text-align: center;
}
#Travel .Mapwaper .bottom .content .Mtop .left {
  position: absolute;
  width: 180px;
  height: 60px;
  top: 0;
  left: 0;
}
#Travel .Mapwaper .bottom .content .Mtop .right {
  position: absolute;
  width: 220px;
  height: 60px;
  top: 0;
  right: 0;
}
#Travel .Mapwaper .bottom .content .Mtop .right >>> .el-input__inner {
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
}
#Travel .Mapwaper .bottom .content .Mtop .right >>> .el-popper {
  top: 40px !important;
}
#Travel .Mapwaper .bottom .content .Mtop .right >>> .el-select-dropdown {
  background-color: rgba(79, 133, 177, 0.3);
}
#Travel .Mapwaper .bottom .content .Mtop .right >>> .el-select-dropdown__wrap,
#Travel .Mapwaper .bottom .content .Mtop .right >>> .el-scrollbar {
  height: 115px !important;
  max-height: 115px !important;
  overflow: hidden;
}
#Travel .Mapwaper .bottom .content .Mtop .right >>> .el-select-dropdown__item {
  text-align: center;
  color: #fff;
}
#Travel .Mapwaper .bottom .content .Mtop .right >>> .el-select-dropdown__item.hover,
#Travel .Mapwaper .bottom .content .Mtop .right >>> .el-select-dropdown__item:hover {
  background-color: rgb(22, 23, 31);
}
#Travel .Mapwaper .bottom .content .Mtop .right >>> .popper__arrow {
  border: none;
}
#Travel .Mapwaper .bottom .content .Mtop .right >>> .popper__arrow::after {
  content: none;
}
#Travel .Mapwaper .bottom .content .Mbottom {
  position: absolute;
  top: 60px;
  overflow: overlay;
  height: calc(100% - 100px);
  width: 100%;
}
#Travel .Mapwaper .bottom .content .Mbottom li {
  vertical-align: top;
  display: inline-block;
  height: 50px;
  line-height: 50px;
  width: calc(100% / 3);
  margin: 5px 0;
  border-bottom: 2px solid rgba(219, 219, 219, 0.555);
  text-align: center;
}
#Travel .Mapwaper .bottom .content .Mbottom li:nth-child(1) {
  width: calc(100% / 3 - 50px);
}
#Travel .Mapwaper .bottom .content .Mbottom li:nth-child(3) {
  width: calc(100% / 3 - 80px);
}
#Travel .Mapwaper .bottom .content .Mbottom li:nth-child(2) {
  width: calc(100% / 3 + 130px);
}
#Travel .Mapwaper .bottom .content .Mbottom li:nth-child(2) >>> .el-input__inner {
  background-color: rgba(255, 255, 255, 0) ;
  border: none;
  font-family: KuHei;
  color: #fff;
  text-align: center;
  width: 100%;
  border-bottom: 2px solid rgba(219, 219, 219, 0.555);
  height: 30px;
  border-radius: 0;
  cursor: pointer;
  user-select: none;
  padding: 0 10px;
}
#Travel .Mapwaper .bottom .content .Mbottom li:nth-child(3) {
  transition: all 0.5s;
  color: rgb(202, 202, 202);
  cursor: pointer;
  font-size: 18px;
}
#Travel .Mapwaper .bottom .content .Mbottom li:nth-child(3):hover {
  color: rgb(230, 230, 230);
}
#Travel .Mapwaper .bottom .content .NextStep {
  position: absolute;
  bottom: 0;
  border-top: 2px solid rgba(219, 219, 219, 0.555);
  height: 40px;
  line-height: 40px;
  width: 100%;
  cursor: pointer;
}
#Travel #golineTip {
  position: absolute;
  z-index: 999;
  width: 300px;
  height: 70px;
  line-height: 70px;
  left: 45px;
  top: 80px;
  text-align: center;
  font-family: KuHei;
  color: #fff;
  background: #000000d1;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  font-size: 20px;
  letter-spacing: 10px;
  font-weight: bold;
}
#Travel .WaringWaper {
  display: none;
  position: absolute;
  z-index: 999;
  width: 300px;
  height: 70px;
  line-height: 70px;
  left: 45px;
  top: 5px;
  text-align: center;
  font-family: KuHei;
  color: #fff;
  background: #000000d1;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.5);
}
#Travel .WaringWaper .DangerTitle {
  position: absolute;
  left: 5px;
  width: 80px;
}
#Travel .WaringWaper .SLNum {
  position: absolute;
  left: 85px;
  width: 160px;
}
#Travel .WaringWaper .SLNum >>> .el-input__inner {
  text-align: center;
  font-family: KuHei;
  color: #fff;
  background: -webkit-radial-gradient(#5a85ab66, rgba(60, 59, 120, 0.39));
}
#Travel .WaringWaper .calculate {
  position: absolute;
  right: 1px;
  width: 50px;
  cursor: pointer;
}
/* 修饰 */
#Travel .Mapwaper .top::after,
#Travel .Mapwaper .body::after,
#Travel .Mapwaper .bottom::after {
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
#Travel .Mapwaper .top::before,
#Travel .Mapwaper .body::before,
#Travel .Mapwaper .bottom::before {
  position: absolute;
  content: "";
  top: -1px;
  left: -1px;
  height: 10px;
  width: 10px;
  /* border-top: 2px solid #02a6b5;
  border-left: 2px solid #02a6b5; */
  transition: all 1.5s;
  z-index: 0;
}
#Travel >>> .anchorBL {
  display: none;
}
#Travel >>> .inmap-legend-container {
  position: absolute;
  left: 45px;
  bottom: 5px;
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
</style>
