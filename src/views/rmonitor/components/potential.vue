<template>
  <div id="emotional">
    <!-- 地图 -->
    <div id="poteMap" />
    <!-- 参数 -->
    <div id="setup">
      <!-- 时间 -->
      <div class="fTime">
        <i
          class="el-icon-d-arrow-left img"
          style="font-size: 21px"
          @click="ReduceTime()"
        />
        <el-date-picker
          v-model="timx"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerOptions"
          :editable="false"
          @change="STime()"
        />
        <i
          class="el-icon-d-arrow-right img"
          style="font-size: 21px"
          @click="IncreaseTime()"
        />
      </div>
      <!-- 标题 -->
      <div class="title">健康打卡监测</div>
      <!-- 搜索 -->
      <div class="find">
        <el-input v-model="input" placeholder="请输入名称" clearable />
        <span @click="find()"><i class="el-icon-search" /> 搜索</span>
      </div>
    </div>
    <!-- 用户列表 -->
    <div id="popop">
      <div class="top" @mousedown.prevent="moveop($event)">
        <span>人员列表</span>
        <span @click="closeP()"><i class="el-icon-close" /></span>
      </div>
      <div class="center">
        <ux-grid
          ref="plxTable"
          height="395"
          max-height="395"
          use-virtual
          show-body-overflow="title"
          :stripe="true"
          show-header-overflow="title"
        >
          <!-- 索引 -->
          <ux-table-column type="index" width="80" align="center" />
          <!-- 姓名 -->
          <ux-table-column field="name" title="姓名" align="center" />
          <!-- 时间 -->
          <ux-table-column field="email" title="邮箱" align="center" />
          <!-- 操作 -->
          <ux-table-column title="操作" width="110" align="center">
            <template v-slot="{ row }">
              <el-button @click="CHistory(row.email)">查看轨迹</el-button>
            </template>
          </ux-table-column>
        </ux-grid>
      </div>
    </div>
    <!-- 体温-正常|异常 -->
    <div id="Lmonitor">
      <div
        id="temper"
        style="height: calc(100%); width: 100%; z-index: 2; position: absolute"
      />
    </div>
    <!-- 打开数量|历史体温 -->
    <div id="Cmonitor">
      <el-carousel ref="c" :autoplay="false" indicator-position="none">
        <el-carousel-item v-for="item in ci" :key="item">
          <div v-if="item === 1">
            <div
              id="history"
              style="
                height: calc(100%);
                width: 100%;
                z-index: 2;
                position: absolute;
              "
            />
          </div>
          <div v-if="item === 2">
            <div
              id="Ptemper"
              style="
                height: calc(100%);
                width: 100%;
                z-index: 2;
                position: absolute;
              "
            />
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 身体异常 -->
    <div id="emotional">
      <div
        id="unusual"
        style="height: calc(100%); width: 100%; z-index: 2; position: absolute"
      />
    </div>
    <!-- 图例 -->
    <div id="legend">
      <table>
        <tr>
          <td width="40">
            <p><img src="../../../../public/img/healthy.png" /></p>
          </td>
          <td>无异常特征</td>
        </tr>
        <tr>
          <td>
            <p><img src="../../../../public/img/temperature.png" /></p>
          </td>
          <td>体温异常</td>
        </tr>
        <tr>
          <td>
            <p><img src="../../../../public/img/stomach.png" /></p>
          </td>
          <td>腹泻乏力</td>
        </tr>
        <tr>
          <td>
            <p><img src="../../../../public/img/cough.png" /></p>
          </td>
          <td>咳嗽有痰</td>
        </tr>
        <tr>
          <td>
            <p><img src="../../../../public/img/pain.png" /></p>
          </td>
          <td>腹泻乏力 咳嗽有痰</td>
        </tr>
      </table>
    </div>
    <!-- 城市选择 -->
    <selectRegion />
    <!-- 路由 -->
    <router />
    <!-- 加载动画 -->
    <div id="bg">
      <div id="xuan"><span /><span /><span /><span /></div>
    </div>
  </div>
</template>
<script>
import Router from "./router";
import mapboxgl from "mapbox-gl";
import SelectRegion from "./selectRegion";
import eventBus from "../public/js/EvebtBus";
import * as echarts from "echarts";

export default {
  name: "EmotionalAnalysis",
  components: {
    Router,
    SelectRegion,
  },
  data() {
    return {
      json: {
        name: "中国",
        where: "",
        code: "",
      },
      timx: "", // 时间
      pickerOptions: {
        disabledDate: (time) => {
          return time > new Date().getTime();
        },
      },
      uploadUrl: process.env.VUE_APP_BASE_API, // 通讯地址
      websocket: null, // 通讯状态
      channel: 1, // 聊天室编号
      email: this.$store.getters.email,
      name: this.$store.getters.name,
      // 地图
      map: null,
      nulldata: {
        type: "FeatureCollection",
        features: [],
      },
      ci: 1,
      myChart1: null,
      myChart2: null,
      myChart3: null,
      myChart4: null,
      input: "",
      names: "",
    };
  },
  beforeDestroy() {
    // 页面销毁时
    eventBus.$off("json");
    document.getElementById("emotional").style.display = "none";
    if (this.websocket !== null) {
      this.websocket.close(3000, "连接关闭");
    }
    this.CAdestroy();
  },
  mounted() {
    var that = this;
    // 今日时间
    that.timx = that.checkTime2(new Date());
    // 切换时间是否展示
    if (
      new Date(new Date(this.timx).getTime() + 24 * 60 * 60 * 1000) <
      new Date().getTime()
    ) {
      document.querySelectorAll(".fTime .img")[1].style.zIndex = 0;
      document.querySelectorAll(".fTime .img")[1].style.opacity = 1;
    } else {
      document.querySelectorAll(".fTime .img")[1].style.zIndex = -10;
      document.querySelectorAll(".fTime .img")[1].style.opacity = 0;
    }
    // 建立通讯连接
    if ("WebSocket" in window) {
      var data = "/" + this.email + "/" + this.name;
      that.websocket = new WebSocket(
        "ws:" +
          this.uploadUrl.match(/http:(\S*)/)[1] +
          "webSocket/" +
          this.channel +
          data
      );
    } else {
      that.$message({
        message: "该浏览器不支持在线聊天！",
        type: "warning",
      });
    }
    // 当页面可以建立通讯时
    if (that.websocket !== null) {
      // 连接完成时触发
      that.websocket.onopen = function () {
        console.log("通讯-连接成功");
      };
      // 接收到服务器消息时
      that.websocket.onmessage = (e) => {
        var muster = JSON.parse(e.data.replace(/'/g, '"'));
        var data = {};
        data.name = muster.name;
        data.time = muster.message.time;
        data.x = muster.message.x;
        data.y = muster.message.y;
        data.tel = muster.message.tel;
        data.result = muster.message.result;
        console.log(muster.message.result);
        if (
          muster.message.result !== "无异常特征" ||
          muster.message.tel * 1 > 37 ||
          muster.message.tel * 1 < 36
        ) {
          // console.log(muster)
          this.addpoint(data);
          that.$notify({
            message:
              `<div class="PMsa">
            <img class="PMsaI" src="` +
              that.uploadUrl +
              `/imgs/jg" />
            <p class="PMsaP">查看详情</p>
            <div class="PMsaR">
              <p style="text-align: center;height: 25px;line-height: 25px;font-family: KuHei;color: black;font-weight: bold;letter-spacing: 2px;">打卡异常</p>
              <p style="text-align: center;height: 25px;line-height: 25px;font-family: KuHei;color: #ff824c;font-weight: bold;">姓名: ` +
              muster.name +
              `</P>
              <p style="text-align: center;height: 25px;line-height: 25px;font-family: KuHei;color: #ff824c;font-weight: bold;overflow: hidden;">种类: ` +
              muster.message.result +
              `</P>
              <p style="text-align: center;height: 25px;line-height: 25px;font-family: KuHei;color: #ff824c;font-weight: bold;font-size: 12px;">时间: ` +
              muster.message.time +
              `</P>
            </div>
          </div>`,
            offset: 100,
            dangerouslyUseHTMLString: true,
            onClick() {
              that.fly(data);
            },
          });
        }
      };
      // 与服务器连接变更时
      that.websocket.onerror = (e) => {
        that.$message({
          message: "连接发生改变！",
          type: "warning",
        });
      };
      // 连接发生错误时
      that.websocket.onerror = (e) => {
        that.$message({
          message: "连接发生错误！",
          type: "warning",
        });
      };
    }
    // 地图
    this.int();
    // 城市选择
    eventBus.$on("json", (json) => {
      that.json.name = json.name;
      that.json.where = json.where;
      that.json.code = json.code;
      if (that.json.name !== "中国") {
        document.getElementById("legend").style.display = "block";
        that.getJson();
        // 地图定位
        that.getbianJson(1);
      }
    });
    // 数据
  },
  methods: {
    fly(e) {
      this.map.flyTo({
        center: [e.x * 1, e.y * 1],
        zoom: 14,
        speed: 2,
        curve: 1,
        easing(t) {
          return t;
        },
      });
    },
    int() {
      var that = this;
      mapboxgl.accessToken =
        "pk.eyJ1Ijoid3VqaW5odWkwIiwiYSI6ImNrdDFoZWphNDBhaGszMXBoazZ1dWdwMWkifQ.AX5nvyCpK8yKsCqyz36rsw"; // 你的accessToken
      this.map = new mapboxgl.Map({
        container: "poteMap", // 地图容器的id
        center: [107.01292828127248, 34.12077517311424], // 中心点
        zoom: 3, // 地图初始化时的层级
        maxZoom: 22,
        style: {
          version: 8,
          sources: {
            "raster-tiles": {
              type: "raster",
              tiles: [
                "https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
              ],
              tileSize: 256,
            },
          },
          layers: [
            {
              id: "simple-tiles",
              type: "raster",
              source: "raster-tiles",
              minzoom: 0,
              maxzoom: 22,
            },
          ],
          glyphs: "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
        },
      });
      this.map.on("load", () => {
        that.getbianJson(0);
        // eslint-disable-next-line handle-callback-err
        that.map.loadImage("/img/temperature.png", function (error, image) {
          that.map.addImage("cat4", image);
        });
        // eslint-disable-next-line handle-callback-err
        that.map.loadImage("/img/cough.png", function (error, image) {
          that.map.addImage("cat1", image);
        });
        // eslint-disable-next-line handle-callback-err
        that.map.loadImage("/img/stomach.png", function (error, image) {
          that.map.addImage("cat2", image);
        });
        // eslint-disable-next-line handle-callback-err
        that.map.loadImage("/img/healthy.png", function (error, image) {
          that.map.addImage("cat0", image);
        });
        that.map.loadImage("/img/pain.png", function (error, image) {
          if (error) throw error;
          that.map.addImage("cat3", image);
          that.map.addSource("earthquakes", {
            type: "geojson",
            data: that.nulldata,
          });
          that.map.addLayer({
            id: "points",
            type: "symbol",
            source: "earthquakes",
            layout: {
              "icon-image": ["concat", "cat", ["get", "type"]],
              "icon-size": 0.1,
            },
          });
          // 点击邮箱
          that.map.on("click", "points", function (e) {
            console.log(e.features[0].properties.email);
            if (
              e.features[0].properties.email === "" ||
              e.features[0].properties.email === undefined
            ) {
              e.features[0].properties.email = "admin@admin.com";
            }
            that.CHistory(e.features[0].properties.email);
          });
        });
      });
    },
    getJson() {
      var that = this;
      var data = {};
      that.nulldata.features = [];
      data.where = that.json.where;
      data.name = that.json.name;
      data.timx = that.checkTime3(
        new Date(new Date(that.timx).getTime() + 24 * 60 * 60 * 1000)
      );
      data.timz = that.checkTime3(new Date(that.timx));
      // 时间
      var datz = {};
      datz.where = that.json.where;
      datz.name = that.json.name;
      datz.timx = that.checkTime3(new Date(new Date(that.timx).getTime()));
      datz.timz = that.checkTime3(
        new Date(new Date(datz.timx).getTime() - 14 * 24 * 60 * 60 * 1000)
      );
      that.$store.dispatch("ncity/CClockIn", datz).then((datas) => {
        that.$store.dispatch("ncity/ClockIn", data).then((dataz) => {
          var TMs = [[], []];
          for (let i = 0; i < datas.length; i++) {
            datas[i].time = that.checkTime5(new Date(datas[i].time));
            TMs[0].push(datas[i].time);
            TMs[1].push(datas[i].value);
          }
          // 左右
          var TWb = [
            { value: 0, name: "正常" },
            { value: 0, name: "异常" },
          ]; // 体温-正常|异常
          var REs = [
            { value: 0, name: "无异常特征" },
            { value: 0, name: "咳嗽有痰" },
            { value: 0, name: "腹泻乏力" },
            { value: 0, name: "咳嗽/乏力" },
          ]; // 身体异常
          for (let i = 0; i < dataz.length; i++) {
            dataz[i].time = that.checkTime4(new Date(dataz[i].time));
            var type = 0;
            if (dataz[i].tel * 1 > 37.4 || dataz[i].tel * 1 < 35.7) {
              TWb[1].value++;
            } else {
              TWb[0].value++;
              // type = 0
            }
            if (dataz[i].result === "无异常特征") {
              REs[0].value++;
              type = 0;
            } else if (dataz[i].tel * 1 > 37.4 || dataz[i].tel * 1 < 35.7) {
              type = 4;
            } else if (dataz[i].result === "咳嗽有痰 ") {
              REs[1].value++;
              type = 1;
            } else if (dataz[i].result === "腹泻乏力 ") {
              REs[2].value++;
              type = 2;
            } else {
              REs[3].value++;
              type = 3;
            }
            that.nulldata.features.push({
              type: "Feature",
              properties: {
                email: dataz[i].email,
                name: dataz[i].name,
                time: dataz[i].time,
                result: dataz[i].result,
                tel: dataz[i].tel,
                type: type,
                // 'description': '<p><a href="' + datas[i].sourceUrl + '" target="_blank">' +
                // datas[i].title.slice(0, 12) + '...' + '</a></p><p class="wenben">' + datas[i].summary + '</p><p class="time">' +
                // '时间：' + data.time + '</p>' + '<p class="laiyuan">来源：' + datas[i].infoSource + '</p><span id="dian" class="qinggan">情感分析</span>',
                // 'place': datas[i].place
              },
              geometry: {
                type: "Point",
                coordinates: [dataz[i].x, dataz[i].y],
              },
            });
          }
          that.map.getSource("earthquakes").setData(that.nulldata);
          this.CAdestroy();
          this.Temper(TWb);
          this.Unusual(REs);
          this.CClockIn(TMs);
        });
      });
    },
    // 体温-正常|异常
    Temper(datas) {
      var that = this;
      that.myChart1 = echarts.init(document.getElementById("temper"));
      const option = {
        // 标题
        title: {
          text: "体温状况",
          left: "center",
          padding: 10,
          textStyle: {
            color: "rgb(210, 210, 210)",
            fontFamily: "KuHei",
            fontWeight: "bolder",
            fontSize: "16px",
          },
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}: {d}%",
          textStyle: {
            fontWeight: "bold",
            fontSize: 14,
            fontFamily: "KuHei",
          },
          confine: true,
        },
        legend: {
          top: "2.5%",
          left: "right",
          orient: "vertical",
          textStyle: {
            fontSize: 13,
            color: "rgba(243,243,243,.9)",
            fontFamily: "KuHei",
          },
        },
        series: [
          {
            name: "体温状况",
            type: "pie", // 环形图的type和饼图相同
            center: ["50%", "60%"],
            radius: ["45%", "70%"], // 饼图的半径，第一个为内半径，第二个为外半径
            startAngle: 150, // 起始角度
            avoidLabelOverlap: false,
            color: ["#caffbf", "#ffb3ae"],
            label: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 12,
                  fontFamily: "KuHei",
                },
              },
              emphasis: { show: true },
            },
            labelLine: {
              normal: {
                show: true,
                length: 10,
              },
              emphasis: {
                show: true,
              },
            },
            data: datas,
          },
        ],
      };
      window.addEventListener("resize", function () {
        var chart = echarts.init(document.getElementById("temper"));
        if (chart) {
          chart.resize(); // 不报错
        }
      });
      that.myChart1.setOption(option);
      // 点击事件
      that.myChart1.on("click", function (params) {});
    },
    // 身体异常
    Unusual(datas) {
      var that = this;
      that.myChart2 = echarts.init(document.getElementById("unusual"));
      const option = {
        // 标题
        title: {
          text: "身体异常",
          left: "center",
          padding: 10,
          textStyle: {
            color: "rgb(210, 210, 210)",
            fontFamily: "KuHei",
            fontWeight: "bolder",
            fontSize: "16px",
          },
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}: {d}%",
          textStyle: {
            fontWeight: "bold",
            fontSize: 14,
            fontFamily: "KuHei",
          },
          confine: true,
        },
        legend: {
          top: "2.5%",
          left: "right",
          orient: "vertical",
          textStyle: {
            fontSize: 13,
            color: "rgba(243,243,243,.9)",
            fontFamily: "KuHei",
          },
        },
        series: [
          {
            name: "身体异常",
            type: "pie", // 环形图的type和饼图相同
            center: ["50%", "60%"],
            radius: ["45%", "70%"], // 饼图的半径，第一个为内半径，第二个为外半径
            startAngle: 150, // 起始角度
            avoidLabelOverlap: false,
            color: ["#caffbf", "#bee1e6", "#64dfdf", "#ecbcfd"],
            label: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 12,
                  fontFamily: "KuHei",
                },
              },
              emphasis: { show: true },
            },
            labelLine: {
              normal: {
                show: true,
                length: 10,
              },
              emphasis: {
                show: true,
              },
            },
            data: datas,
          },
        ],
      };
      window.addEventListener("resize", function () {
        var chart = echarts.init(document.getElementById("unusual"));
        if (chart) {
          chart.resize(); // 不报错
        }
      });
      that.myChart2.setOption(option);
      // 点击事件
      that.myChart2.on("click", function (params) {});
    },
    // 周期打卡情况
    CClockIn(datas) {
      var that = this;
      that.myChart3 = echarts.init(document.getElementById("history"));
      const option = {
        // 标题
        title: {
          text: "身体异常",
          left: "center",
          padding: 10,
          textStyle: {
            color: "rgb(210, 210, 210)",
            fontFamily: "KuHei",
            fontWeight: "bolder",
            fontSize: "16px",
          },
        },
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            var rez =
              params[0].name +
              "<br/>" +
              '<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:rgb(248, 165, 0);"></span>' +
              "打卡数" +
              "：" +
              '<span style="font-weight: bold">' +
              params[0].data +
              "</span>";
            return rez;
          },
          textStyle: {
            fontWeight: "bold",
            fontSize: 14,
            fontFamily: "KuHei",
          },
          confine: true,
          transitionDuration: 0,
        },
        grid: {
          left: "3%",
          right: "3%",
          bottom: "18%",
          top: "15%",
          containLabel: true,
        },
        dataZoom: [
          {
            show: true,
            type: "slider",
            height: "25px",
            bottom: "5%",
            start: 0,
            end: 100,
          },
        ],
        xAxis: {
          type: "category",
          data: datas[0],
          axisLabel: {
            show: true,
            color: "#fff",
          },
        },
        yAxis: {
          type: "value",
          scale: true,
          splitLine: false,
          name: "次",
          axisLabel: {
            show: true,
            color: "#fff",
          },
        },
        series: [
          {
            data: datas[1],
            type: "bar",
          },
          {
            data: datas[1],
            type: "line",
          },
        ],
      };
      window.addEventListener("resize", function () {
        var chart = echarts.init(document.getElementById("history"));
        if (chart) {
          chart.resize(); // 不报错
        }
      });
      that.myChart3.setOption(option);
      // 点击事件
      that.myChart3.on("click", function (params) {});
    },
    // 查询用户
    find() {
      var that = this;
      if (that.input.replace(/ /g, "") === "") {
        that.$message({
          message: "用户名不能为空！",
          type: "warning",
        });
      } else if (that.json.name === "" || that.json.name === "中国") {
        that.$message({
          message: "请选择城市！",
          type: "warning",
        });
      } else {
        var data = {};
        data.where = that.json.where;
        data.name = that.json.name;
        data.value = that.input;
        that.$store.dispatch("ncity/GUser", data).then((dataz) => {
          that.$refs.plxTable.reloadData(dataz);
          document.getElementById("popop").style.display = "block";
        });
      }
    },
    // 关闭用户列表
    closeP() {
      document.getElementById("popop").style.display = "none";
    },
    // 移动
    moveop(event) {
      var that = this;
      const popop = document.getElementById("popop");
      const x = event.pageX - popop.offsetLeft;
      const y = event.pageY - popop.offsetTop;
      this.canMove = true;
      document.onmouseup = function () {
        that.canMove = false;
        document.onmousemove = null;
        document.onmouseup = null;
      };
      document.onmousemove = function (e) {
        if (that.canMove) {
          var left = e.clientX - x;
          var top = e.clientY - y;
          if (left < 340) left = popop.offsetWidth / 2 + 40;
          if (top < 220) top = popop.offsetHeight / 2;
          var maxLeft = window.innerWidth - popop.offsetWidth / 2;
          var maxTop = window.innerHeight / 2 + popop.offsetHeight;
          if (left > maxLeft) left = maxLeft;
          if (top > maxTop) top = maxTop;
          popop.style.left = left + "px";
          popop.style.top = top + "px";
        }
      };
    },
    // 个人历史体温
    CHistory(e) {
      var that = this;
      that.ci = 2;
      that.CAdestroy1();
      that.closeP();
      var data = {};
      data.where = that.json.where;
      data.name = that.json.name;
      data.email = e;
      data.timx = that.checkTime3(new Date(new Date(that.timx).getTime()));
      data.timz = that.checkTime3(
        new Date(new Date(data.timx).getTime() - 14 * 24 * 60 * 60 * 1000)
      );
      that.$store.dispatch("ncity/CHistory", data).then((dataz) => {
        that.$refs.c.setActiveItem(1);
        var datas = [[], []];
        that.names = dataz[0].name;
        for (let i = 0; i < dataz.length; i++) {
          dataz[i].time = that.checkTime5(new Date(dataz[i].time));
          datas[0].push(dataz[i].time);
          datas[1].push(dataz[i].tel);
        }
        that.myChart4 = echarts.init(document.getElementById("Ptemper"));
        const option = {
          visualMap: [
            {
              show: false,
              type: "continuous",
              seriesIndex: 0,
              min: 36,
              max: 37,
              inRange: {
                color: ["#00dbde", "#fc00ff"],
              },
            },
          ],
          title: {
            text: that.names + "-个人14天记录",
            left: "center",
            padding: 10,
            textStyle: {
              color: "rgb(210, 210, 210)",
              fontFamily: "KuHei",
              fontWeight: "bolder",
              fontSize: "16px",
            },
          },
          tooltip: {
            trigger: "axis",
            formatter: function (params) {
              // console.log(params)
              var rez =
                params[0].name +
                "<br/>" +
                params[0].marker +
                "体温" +
                "：" +
                '<span style="font-weight: bold">' +
                params[0].data +
                "</span>";
              return rez;
            },
            textStyle: {
              fontWeight: "bold",
              fontSize: 14,
              fontFamily: "KuHei",
            },
            confine: true,
            transitionDuration: 0,
          },
          xAxis: {
            type: "category",
            data: datas[0],
            axisLabel: {
              show: true,
              color: "#fff",
            },
          },
          yAxis: {
            type: "value",
            scale: true,
            splitLine: false,
            name: "℃",
            axisLabel: {
              show: true,
              color: "#fff",
            },
          },
          grid: {
            left: "3%",
            right: "3%",
            bottom: "18%",
            top: "15%",
            containLabel: true,
          },
          dataZoom: [
            {
              show: true,
              type: "slider",
              height: "25px",
              bottom: "5%",
              start: 0,
              end: 100,
            },
          ],
          series: [
            {
              type: "line",
              showSymbol: false,
              data: datas[1],
              itemStyle: {
                normal: {
                  lineStyle: {
                    width: 5, // 设置线条粗细
                  },
                },
              },
            },
          ],
        };
        window.addEventListener("resize", function () {
          var chart = echarts.init(document.getElementById("Ptemper"));
          if (chart) {
            chart.resize(); // 不报错
          }
        });
        that.myChart4.setOption(option);
        // 点击事件
        that.myChart4.on("click", function (params) {});
      });
    },
    // 创建与销毁盒子
    CAdestroy() {
      if (
        this.myChart1 !== null &&
        this.myChart2 !== null &&
        this.myChart3 !== null &&
        this.myChart4 !== null
      ) {
        this.myChart1.clear();
        this.myChart1.dispose();
        this.myChart2.clear();
        this.myChart2.dispose();
        this.myChart3.clear();
        this.myChart3.dispose();
        this.myChart4.clear();
        this.myChart4.dispose();
      }
    },
    CAdestroy1() {
      if (this.myChart4 !== null) {
        this.myChart4.clear();
        this.myChart4.dispose();
      }
    },
    // 请求边界数据
    getbianJson(e) {
      var that = this;
      that.$store.dispatch("ndatapanel/QJson", that.json.name).then((dataz) => {
        that.boundary = dataz;
        // 数据
        if (e === 0) {
          that.bian(dataz, 0);
        } else if (e === 1) {
          that.bian(that.boundary, 1); // 清除原始边界
        }
      });
    },
    // 边界
    bian(dataz, e) {
      var that = this;
      var bound = [];
      if (e === 1) {
        if (that.length !== undefined) {
          for (let i = 0; i < that.length; i++) {
            that.map.removeLayer("maine" + i); // 清除范围
            that.map.removeSource("maine" + i);
          }
        } else {
          that.map.removeLayer("maine"); // 清除范围
          that.map.removeSource("maine");
        }
      }
      if (dataz.json.features.length !== undefined) {
        if (that.json.name !== "中国") {
          for (let i = 0; i < dataz.json.features.length; i++) {
            const ele = dataz.json.features[i].geometry.coordinates;
            for (let j = 0; j < ele.length; j++) {
              const element = ele[j][0];
              for (let z = 0; z < element.length; z++) {
                const element3 = element[z];
                bound.push(element3);
              }
            }
            that.map.addLayer({
              id: "maine" + i,
              type: "fill",
              source: {
                type: "geojson",
                data: dataz.json.features[i].geometry,
              },
              layout: {},
              paint: {
                "fill-color": "#088",
                "fill-opacity": 0.2,
              },
            });
          }
          // eslint-disable-next-line no-undef
          var line = turf.lineString(bound);
          // eslint-disable-next-line no-undef
          var bbox = turf.bbox(line);
          that.map.fitBounds(bbox, {
            padding: { bottom: 60 },
          });
          that.length = dataz.json.features.length;
        } else {
          var hball = [];
          var features = [];
          // console.log(china_con)
          const hbfeatures = [
            [dataz.json.features[2].geometry.coordinates[0][0]],
            [dataz.json.features[2].geometry.coordinates[0][1]],
            dataz.json.features[2].geometry.coordinates[1],
          ];
          for (let index = 0; index < hbfeatures.length; index++) {
            const element = hbfeatures[index];
            hball.push({
              id: 33 + index,
              type: "Feature",
              properties: { name: "河北省" },
              geometry: { coordinates: element, type: "Polygon" },
            });
          }
          for (let index = 0; index < dataz.json.features.length; index++) {
            const element = dataz.json.features[index];
            if (index === 2) {
              features.push(hball[0]);
              features.push(hball[1]);
              features.push(hball[2]);
            } else {
              features.push(element);
            }
          }
          var qtbian = {
            type: "FeatureCollection",
            features: features,
          };
          that.map.addLayer({
            id: "maine0",
            type: "fill",
            source: {
              type: "geojson",
              data: qtbian,
            },
            layout: {},
            paint: {
              "fill-color": "#088",
              "fill-opacity": 0.2,
            },
          });
          that.length = 1;
        }
      } else {
        that.map.addLayer({
          id: "maine",
          type: "fill",
          source: {
            type: "geojson",
            data: dataz.json.features.geometry,
          },
          layout: {},
          paint: {
            "fill-color": "#088",
            "fill-opacity": 0.2,
          },
        });
        // eslint-disable-next-line no-undef
        const line1 = turf.lineString(
          dataz.json.features.geometry.coordinates[0][0]
        );
        // eslint-disable-next-line no-undef
        const bbox1 = turf.bbox(line1);
        that.map.fitBounds(bbox1, {
          padding: { bottom: 60 },
        });
        that.length = dataz.json.features.length;
      }
      console.log(that.length);
    },
    addpoint(data) {
      var that = this;
      var type = 0;
      if (data.result === "无异常特征") {
        type = 0;
      } else if (data.result === "乏力腹泻 ") {
        type = 2;
      } else if (data.result === "咳嗽有痰 ") {
        type = 1;
      } else if (data.result === "咳嗽有痰 乏力腹泻 ") {
        type = 3;
      }
      that.nulldata.features.push({
        type: "Feature",
        properties: {
          email: data.email,
          name: data.name,
          time: data.time,
          result: data.result,
          tel: data.tel,
          type: type,
          // 'description': '<p><a href="' + datas[i].sourceUrl + '" target="_blank">' +
          // datas[i].title.slice(0, 12) + '...' + '</a></p><p class="wenben">' + datas[i].summary + '</p><p class="time">' +
          // '时间：' + data.time + '</p>' + '<p class="laiyuan">来源：' + datas[i].infoSource + '</p><span id="dian" class="qinggan">情感分析</span>',
          // 'place': datas[i].place
        },
        geometry: {
          type: "Point",
          coordinates: [data.x, data.y],
        },
      });
      that.map.getSource("earthquakes").setData(that.nulldata);
    },
    // 选择时间时触发
    STime() {
      if (this.json.name === "" || this.json.name === "中国") {
        this.$message({
          message: "请选择城市！",
          type: "warning",
          showClose: true,
        });
        this.timx = this.checkTime2(new Date());
      } else {
        if (
          new Date(new Date(this.timx).getTime() + 24 * 60 * 60 * 1000) <
          new Date().getTime()
        ) {
          document.querySelectorAll(".fTime .img")[1].style.zIndex = 0;
          document.querySelectorAll(".fTime .img")[1].style.opacity = 1;
        } else {
          document.querySelectorAll(".fTime .img")[1].style.zIndex = -10;
          document.querySelectorAll(".fTime .img")[1].style.opacity = 0;
        }
        // 请求数据
        this.getJson();
      }
    },
    // 减少时间
    ReduceTime() {
      if (this.json.name === "" || this.json.name === "中国") {
        this.$message({
          message: "请选择城市！",
          type: "warning",
          showClose: true,
        });
      } else {
        this.timx = this.checkTime2(
          new Date(new Date(this.timx).getTime() - 24 * 60 * 60 * 1000)
        );
        document.querySelectorAll(".fTime .img")[1].style.zIndex = 0;
        document.querySelectorAll(".fTime .img")[1].style.opacity = 1;
        // 请求数据
        this.getJson();
      }
    },
    // 增加时间
    IncreaseTime() {
      if (this.json.name === "" || this.json.name === "中国") {
        this.$message({
          message: "请选择城市！",
          type: "warning",
          showClose: true,
        });
      } else {
        this.timx = this.checkTime2(
          new Date(new Date(this.timx).getTime() + 24 * 60 * 60 * 1000)
        );
        if (
          new Date(new Date(this.timx).getTime() + 24 * 60 * 60 * 1000) <
          new Date().getTime()
        ) {
          document.querySelectorAll(".fTime .img")[1].style.zIndex = 0;
          document.querySelectorAll(".fTime .img")[1].style.opacity = 1;
        } else {
          document.querySelectorAll(".fTime .img")[1].style.zIndex = -10;
          document.querySelectorAll(".fTime .img")[1].style.opacity = 0;
        }
        // 请求数据
        this.getJson();
      }
    },
    // 时间处理
    checkTime(i) {
      if (i < 10) {
        i = "0" + i;
      }
      return i;
    },
    // 时间处理2
    checkTime2(i) {
      var that = this;
      return (
        i.getFullYear() +
        "-" +
        that.checkTime(i.getMonth() + 1) +
        "-" +
        that.checkTime(i.getDate()) +
        " " +
        that.checkTime(i.getHours()) +
        ":" +
        that.checkTime(i.getMinutes())
      );
    },
    // 时间处理3
    checkTime3(i) {
      var that = this;
      return (
        i.getFullYear() +
        "-" +
        that.checkTime(i.getMonth() + 1) +
        "-" +
        that.checkTime(i.getDate()) +
        " " +
        "00" +
        ":" +
        "00"
      );
    },
    // 时间处理4
    checkTime4(i) {
      var that = this;
      return (
        i.getFullYear() +
        "-" +
        that.checkTime(i.getMonth() + 1) +
        "-" +
        that.checkTime(i.getDate()) +
        " " +
        that.checkTime(i.getHours()) +
        ":" +
        that.checkTime(i.getMinutes()) +
        ":" +
        that.checkTime(i.getSeconds())
      );
    },
    // 时间处理5
    checkTime5(i) {
      var that = this;
      return (
        i.getFullYear() +
        "-" +
        that.checkTime(i.getMonth() + 1) +
        "-" +
        that.checkTime(i.getDate())
      );
    },
  },
};
</script>
<style scoped>
#emotional {
  position: absolute;
  width: 100%;
  height: 100%;
}
#emotional #poteMap {
  position: fixed;
  width: 100%;
  height: 100%;
}
/* 参数 */
#emotional #setup {
  position: absolute;
  width: calc(100% - 50px);
  left: 45px;
  bottom: calc(35% + 7px);
  height: 45px;
  line-height: 45px;
  font-family: KuHei;
  border: 1px solid #0fafeb;
  /* background: url("../public/img/bg.png") rgba(255, 255, 255, 0.1); */
  background: url("../public/img/bg.png") rgba(79, 133, 177, 0.3);
  color: #fff;
}
#emotional #setup .fTime {
  position: absolute;
  width: 250px;
  height: 45px;
  line-height: 45px;
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
  position: relative;
}
#emotional #setup .fTime::after {
  content: "";
  right: 0;
  top: -1px;
  height: 100%;
  width: 2px;
  background-color: rgba(219, 219, 219, 0.555);
  position: absolute;
}
#emotional #setup .fTime >>> .el-input__prefix,
#emotional #setup .fTime >>> .el-input__suffix {
  display: none;
}
#emotional #setup .fTime >>> .el-input__inner {
  background-color: rgba(255, 255, 255, 0);
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
#emotional #setup .fTime >>> .el-date-editor.el-input,
#emotional #setup .fTime >>> .el-date-editor.el-input__inner {
  width: 140px;
}
#emotional #setup .fTime .img {
  margin: 0 15px;
  height: 45px;
  line-height: 45px;
  cursor: pointer;
  color: rgb(199, 199, 199);
  transition: all 0.5s;
}
#emotional #setup .fTime .img:hover {
  color: #fff;
}
#emotional #setup .title {
  position: absolute;
  font-family: KuHei;
  color: #fff;
  font-size: 18px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  letter-spacing: 5px;
}
#emotional #setup .find {
  width: 250px;
  height: 45px;
  line-height: 45px;
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
  position: absolute;
  right: 0;
  top: 0;
}
#emotional #setup .find::after {
  content: "";
  left: 0;
  top: -1px;
  height: 100%;
  width: 2px;
  background-color: rgba(219, 219, 219, 0.555);
  position: absolute;
}
#emotional #setup .find >>> .el-input {
  width: 150px;
}
#emotional #setup .find >>> .el-input__inner {
  text-align: center;
  background-color: rgba(255, 255, 255, 0);
  border: none;
  border-bottom: 1px solid #fff;
  height: 35px;
  border-radius: 0;
  color: #fff;
  font-family: KuHei;
  letter-spacing: 1px;
}
#emotional #setup .find span {
  padding-left: 10px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.75);
  transition: all 1s;
}
#emotional #setup .find span:hover {
  color: rgba(255, 255, 255, 1);
}
/* 用户列表 */
#emotional #popop {
  display: none;
  position: absolute;
  width: 600px;
  height: 430px;
  border-radius: 3px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid #0fafeb;
  background-color: rgb(21 62 109);
  z-index: 11;
}
#emotional #popop .top {
  height: 35px;
  line-height: 35px;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: KuHei;
  font-size: 15px;
  border-bottom: 2px solid rgb(148, 150, 153);
  letter-spacing: 2px;
  position: relative;
  cursor: move;
}
#emotional #popop .top span:nth-child(2) {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(calc(-50% + 3px));
}
#emotional #popop .top span:nth-child(2) >>> i {
  transform: 2s;
  font-size: 20px;
  transition: all 1.5s;
  color: rgba(255, 255, 255, 0.65);
  cursor: pointer !important;
}
#emotional #popop .top span:nth-child(2) >>> i:hover {
  color: rgba(255, 255, 255, 1);
  transform: rotate(360deg);
}
#emotional #popop .center {
  width: 100%;
  height: 395px;
}
#emotional #popop .center >>> .elx-table {
  color: rgb(200, 200, 200);
  font-family: KuHei;
  height: 395px;
  overflow: hidden;
}
#emotional
  #popop
  .center
  >>> .elx-table.border--default
  .elx-table--header-wrapper,
#emotional
  #popop
  .center
  >>> .elx-table.border--full
  .elx-table--header-wrapper,
#emotional
  #popop
  .center
  >>> .elx-table.border--outer
  .elx-table--header-wrapper,
#emotional #popop .center >>> .elx-table .elx-table--body-wrapper,
#emotional #popop .center >>> .elx-table .elx-table--footer-wrapper {
  background-color: #ff000000;
}
#emotional #popop .center >>> .elx-table .elx-body--row.row--checked,
#emotional #popop .center >>> .elx-table .elx-body--row.row--current,
#emotional #popop .center >>> .elx-table .elx-body--row.row--radio {
  background-color: rgba(40, 43, 57, 0.4) !important;
}
#emotional #popop .center >>> .row--hover {
  background-color: rgb(35, 35, 35, 0.6) !important;
}
/* 单数行 */
#emotional #popop .center >>> .row--stripe {
  background-color: rgba(65, 70, 92, 0.4);
}
/* 框 */
#emotional #popop .center >>> .elx-table .elx-table--border-line {
  border: none;
}
#emotional
  #popop
  .center
  >>> .elx-table
  .elx-table--header-wrapper
  .elx-table--header-border-line {
  border: none;
}
#emotional #popop .center >>> .elx-table.border--full .elx-body--column,
#emotional #popop .center >>> .elx-table.border--full .elx-footer--column,
#emotional #popop .center >>> .elx-table.border--full .elx-header--column {
  background: rgba(255, 255, 255, 0);
}
#emotional
  #popop
  .center
  >>> .elx-table.border--default
  .elx-table--header-wrapper,
#emotional
  #popop
  .center
  >>> .elx-table.border--full
  .elx-table--header-wrapper,
#emotional
  #popop
  .center
  >>> .elx-table.border--outer
  .elx-table--header-wrapper {
  border-bottom: 2px solid rgb(148, 150, 153) !important;
}
#emotional #popop .center >>> .el-button {
  border: none;
  background-color: #ff000000;
  color: rgba(200, 200, 200, 0.75);
  font-family: KuHei;
  transition: all 0.5s;
}
#emotional #popop .center >>> .el-button:hover {
  color: #fff;
}
/* 监测 */
#emotional #Lmonitor {
  position: absolute;
  width: calc(25%);
  left: 45px;
  height: 35%;
  bottom: 3px;
  font-family: KuHei;
  /* border: 1px solid rgba(25, 186, 139, 0.2); */
  /* background: url("../public/img/bg.png") rgba(255, 255, 255, 0.1); */
  background-image: url("../public/img/bn.png");
  background-size: 100% 100%;
  z-index: 10;
}
#emotional #Cmonitor {
  position: absolute;
  width: calc(50% - 60px);
  left: calc(50%);
  transform: translateX(calc(-50% + 20px));
  height: 35%;
  bottom: 3px;
  font-family: KuHei;
  /* background: url("../public/img/bg.png") rgba(255, 255, 255, 0.1); */
  background-image: url("../public/img/bn.png");
  background-size: 100% 100%;
  z-index: 10;
}
#emotional #Cmonitor >>> .el-carousel,
#emotional #Cmonitor >>> .el-carousel__container {
  position: absolute;
  width: 100%;
  height: 100%;
}
#emotional #Cmonitor >>> .el-carousel__arrow--right {
  right: 5px;
  top: 20px;
  border-radius: 50%;
  background-color: rgba(204, 204, 204, 0.3);
  color: #fff;
  font-size: 18px;
  width: 30px;
  height: 30px;
  display: block !important;
}
#emotional #Cmonitor >>> .el-carousel__arrow--left {
  left: 5px;
  top: 20px;
  border-radius: 50%;
  background-color: rgba(204, 204, 204, 0.3);
  color: #fff;
  font-size: 18px;
  width: 30px;
  height: 30px;
  display: none !important;
}
#emotional #Cmonitor >>> .el-carousel__arrow--left:hover,
#emotional #Cmonitor >>> .el-carousel__arrow--right:hover {
  font-weight: bold;
  background-color: rgba(204, 204, 204, 0.5);
}
#emotional #emotional {
  position: absolute;
  width: calc(25%);
  right: 5px;
  height: 35%;
  bottom: 3px;
  font-family: KuHei;
  /* background: url("../public/img/bg.png") rgba(255, 255, 255, 0.1); */
  background: url("../public/img/bn.png") rgba(79, 133, 177, 0.3);
  background-size: 100% 100%;
  z-index: 10;
}
#emotional #legend {
  display: none;
  position: absolute;
  width: 180px;
  right: 5px;
  bottom: calc(35% + 57px);
  height: 200px;
  border-radius: 3px;
  background-color: rgba(79, 133, 177, 0.3);
  border: 1px solid rgba(175, 220, 233, 0.4);
  color: #fff;
}
#emotional #legend table {
  text-align: center;
  width: 180px;
  height: 200px;
}
#emotional #legend table td {
  text-align: center;
  position: relative;
  font-size: 13px;
  font-family: KuHei;
}
#emotional #legend table p {
  margin: 0;
  padding: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
}
#emotional #legend table td img {
  width: 25px;
}
/* 四角 */
#emotional #setup::after,
#emotional #Lmonitor::after,
#emotional #Cmonitor::after,
#emotional #emotional::after {
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
#emotional #setup::after {
  border-bottom: 2px solid #02a6b5;
  border-right: 2px solid #02a6b5;
}
#emotional #setup::before,
#emotional #Lmonitor::before,
#emotional #Cmonitor::before,
#emotional #emotional::before {
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
#emotional #setup::before {
  border-top: 2px solid #02a6b5;
  border-left: 2px solid #02a6b5;
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
    opacity: 0.5;
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
    opacity: 0.5;
  }
}
/** END of xuan */
</style>
