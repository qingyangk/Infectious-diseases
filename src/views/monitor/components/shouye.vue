<template>
  <div id="shuxingbiao">
    <div class="NumD">
      <div class="NumChild">
        <div class="NumChildTitle" style="color: #dd400e;">确诊人数</div>
        <div class="NumChildTitle" style="color: #dd400e;">{{ LQ }}</div>
        <div class="NumChina">美国:{{ Q }}</div>
      </div>
      <div class="NumChild">
        <div class="NumChildTitle" style="color: #3474EC;">治愈人数</div>
        <div class="NumChildTitle" style="color: #3474EC;">{{ LZ }}</div>
        <div class="NumChina">美国:{{ Z }}</div>
      </div>
      <div class="NumChild">
        <div class="NumChildTitle" style="color: #908b8b;">死亡人数</div>
        <div class="NumChildTitle" style="color: #908b8b;">{{ LS }}</div>
        <div class="NumChina">美国:{{ S }}</div>
      </div>
    </div>

    <div class="pagermap">
      <el-table
        :data="tableData"
        style="width: 100%;font-weight: 100"
        height="650"
        stripe
        class="TableClass"
        :default-sort="{prop: 'confirmed', order: 'descending'}"
      >
        <el-table-column
          prop="address"
          label="地区"
          width="70"
        />
        <el-table-column
          prop="confirmed"
          label="累计"
          sortable
          width="75"
        />
        <el-table-column
          prop="currentConfirmed"
          label="现有"
          sortable
          width="75"
        />
        <el-table-column
          prop="cure"
          label="治愈"
          sortable
          width="68"
        />
        <el-table-column
          prop="death"
          label="死亡"
          sortable
          width="68"
        />
      </el-table>
    </div>
    <div class="echa">
      <confirmedDeathDay />
    </div>
    <!-- <iframe style="position: absolute;top: 0;left: 0;height: 100%;width: 100%;" :src="DashBoardSrc" scrolling="no" frameborder="0" /> -->
    <!-- <router-link :to="{path:'/GlobalMonitor/DashBoard'}" tag="div">
      <div id="COVIDLine">疫情趋势</div>
    </router-link> -->
  </div>
<!--  <h1>城市选择</h1>-->
<!--  <iframe style="position: absolute;top: 0;left: 0;height: 100%;width: 100%;" src="http://114.98.239.36:8081/" scrolling="no" frameborder="0"></iframe>-->
<!--  <button id="Console">Console</button>-->
</template>

<script>
import axios from 'axios'
// import ConfirmedDeathDay from './confirmedDeathDay.vue'

export default {
  name: 'Test',
  components: {
    // ConfirmedDeathDay
  },
  data() {
    return {
      // DashBoardSrc: '/nCOVDashBoard/DashBoard.html',
      LQ: '',
      XQ: '',
      QAdd: '',
      LZ: '',
      XZ: '',
      LS: '',
      XS: '',
      T: '',
      Q: '',
      X: '',
      Z: '',
      S: '',

      tableData: [],
      sumconfirmed: 0,
      sumcure: 0,
      sumdeath: 0,
      currentConfirmed: 0
    }
  },
  mounted: function() {
    axios.get('http://api.tianapi.com/txapi/ncovabroad/index?key=6848bf141edb09a1ebfd4162bc84c624').then((res) => {
      const len = res.data.newslist.length

      for (let i = 0; i < len; i++) {
        const a = {
          address: res.data.newslist[i].provinceName,
          confirmed: res.data.newslist[i].confirmedCount,
          cure: res.data.newslist[i].curedCount,
          death: res.data.newslist[i].deadCount,
          currentConfirmed: res.data.newslist[i].currentConfirmedCount
        }

        if (a.address === '美国') {
          this.Q = a.confirmed
          this.Z = a.cure
          this.S = a.death
        }

        this.tableData.push(a)
      }
    })

    axios.get('https://api.inews.qq.com/newsqa/v1/automation/modules/list?modules=FAutoGlobalStatis').then((res) => {
      const ResData = res.data.data.FAutoGlobalStatis
      this.LQ = ResData.confirm
      this.XQ = ResData.nowConfirm
      this.QAdd = ResData.confirmAdd
      this.LZ = ResData.heal
      this.XZ = ResData.healAdd
      this.LS = ResData.dead
      this.XS = ResData.deadAdd
    })

    axios.get('https://lab.isaaclin.cn/nCoV/api/area?latest=1&province=%E4%B8%AD%E5%9B%BD').then((res) => {
      const ResData = res.data.results[0]
      this.Q = ResData.confirmedCount
      this.X = '0' + ResData.currentConfirmedCount.toString()
      this.Z = ResData.curedCount
      this.S = '0' + ResData.deadCount.toString()
    })

    // $('#Console').click(function () {
    //
    //   // http.get('http://39.102.60.28:8088/a3-d/all').then(res=>{
    //   //   console.log(res.data)
    //   // })
    //
    //   // let url = "http://39.102.60.28:8088/wuhan-move-in/getList";
    //   // axios.get(url,{
    //   //   headers:{"jwt-token": localStorage.getItem('Authorization')}})
    //   //   .then((res) =>{
    //   //     console.log(res.data.data)
    //   //   });
    //
    //   // axios.get("../../../static/data/武汉迁出指数.json").then((res) => {
    //   //   console.log(res.data)
    //   // })
    //
    // })

    // var CountryData
    // var ydata = []
    // var confirmed = []
    // var cured = []
    // var dead = []
    // axios.get('../../../static/data/Country.json').then((res) => {
    //   console.clear();
    //   CountryData = res.data
    //   for(var i =0;i < CountryData.length;i++){
    //     ydata.push(CountryData[i].country);
    //     confirmed.push(CountryData[i].confirmed);
    //     cured.push(CountryData[i].removed);
    //     dead.push(CountryData[i].dead);
    //   };
    //   console.log(ydata);
    //   console.log(confirmed);
    //   console.log(cured);
    //   console.log(dead);
    // })
  }
}
</script>

<style scoped>
#Console{
  width: 80px;
  position: absolute;
  top: 50px;
  left: 50px;
  z-index: 999;
  cursor: pointer;
}
#COVIDLine {
  background: rgba(33, 36, 37, .92);
  z-index: 99999;
  top: 31.2%;
  right: 25%;
  position: absolute;
  color: #ffffffcf;
  font-family: KuHei;
  padding: 4px 9px 5px 8px;
  cursor: pointer;
}
#COVIDLine:hover {
  color: #0096db;
}
.NumD{
  position: absolute;
  height: 108px;
  width: 360px;
  top: 0;
  left:10px;
  z-index: 999999999;
  background: rgba(0, 0, 0, .3);
}
.NumChild{
  position: relative;
  width: 33.3%;
  height: 100%;
  float: left;
}
.NumChildTitle{
  text-shadow: 1px 1px 1px #000, 1px 1px 1px #fff;
  font-size: 20px;
  top: 14px;
  left:8px;
  position: relative
}
.NumChina{
  font-size: 13px;
  color: rgba(238, 238, 238, 0.75);
  font-family: KuHei;
  position: relative;
  left:8px;
  margin-top: 20px;
}

.pagermap{
  height: 84%;
  overflow: auto;
  position: absolute;
  background: rgba(0, 0, 0, .3);
  z-index: 999;
  top: 16%;
  left:10px;
}

.TableClass>>> th{
  padding: 0!important;
  height: 10px;
  line-height: 10px;
}
.el-table {
    position: relative;
    overflow: hidden;
    flex: 1;
    max-width: 100%;
    font-size: 14px;
    color: #606266;
}
.pagermap[data-v-0a493cc1] {
    height: 78%;
    width: 370p;
    overflow: hidden;
    position: absolute;
    background: rgba(0, 0, 0, .3);
    z-index: 999;
    top: 19%;
    left: 10px;
}
.echa{
    width: 372px;
    height: 344px;
    position: relative;
    background: rgba(0, 0, 0, .3);
    left: 1165px;
    /* top: 22%; */
    top: 312px;
    z-index: 999;
}
</style>
<style>
@font-face {
  src: url("../public/font/KuHei.ttf");
  font-family: "KuHei";
}
.pagermap .el-table th>.cell {
    display: inline-block;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    position: relative;
    vertical-align: middle;
    /* padding-left: 0; */
    padding-right: 0;
    width: 100%;
    font-family: 'KuHei';
}
.pagermap .el-table .cell {
    overflow: inherit;
    text-overflow: ellipsis;
    white-space: initial;
    word-break: normal;
    line-height: 13px;
    padding-right: 0px;
    color: #c0c4cc;
    font-size: 13px;
    font-family: 'KuHei';
}
.pagermap .el-table, .el-table__expanded-cell {
    background-color: rgb(255 255 255 / 0%);
}
.pagermap .el-table th, .el-table tr {
    background-color: rgb(255 255 255 / 0%);
}
.pagermap .el-table td, .el-table th.is-leaf {
    border-bottom: 0.5px solid #333;
    text-align: center;
}
.pagermap .el-table--striped .el-table__body tr.el-table__row--striped td {
    background: #3a3a3a4f;
}
.el-table--enable-row-hover .el-table__body tr:hover>td {
    background-color: transparent;
}
</style>
