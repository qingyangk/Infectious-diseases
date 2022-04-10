<template>
  <div id="sentiment">
    <div id="map1" />
    <!-- 查询类型 -->
    <div class="type">
      <!-- <ul>
        <li class="CircleSearch" @click="zanting()"><icon-svg icon-class="icon-relitu2" /><span> 热力图</span></li>
      </ul> -->
    </div>
    <!-- 参数 -->
    <div id="setup">
      <!-- 标题 -->
      <div class="title">城市疾病预测</div>
    </div>
    <!-- 监测 -->
    <div id="monitor">
      <div class="left">
        <div id="chart" style="height: 100%; width: 100%; z-index: 1" />
      </div>
      <div class="right">
        <div class="right-left">
          <div id="chart1" style="height: 100%; width: 100%; z-index: 1" />
        </div>
        <div class="right-mid">
          <div id="chart2" style="height: 100%; width: 100%; z-index: 1" />
        </div>
        <div class="right-right">
          <div id="chart3" style="height: 100%; width: 100%; z-index: 1" />
        </div>
        <!-- <div id="chart1" style="height: 100%;width: 100%;z-index: 1;" /> -->
      </div>
    </div>
    <router />
    <!-- 疾病选择 -->
    <div class="condition">
      <div class="top">
        <i v-if="j === 1" class="el-icon-arrow-left" @click="huan(0)" />
        <listDiseases class="s" />
        <transmission class="x" />
        <i v-if="j === 0" class="el-icon-arrow-right" @click="huan(1)" />
      </div>
    </div>
    <!-- 图例 -->
    <div id="legend">
      <table>
        <tr>
          <td width="40">
            <p><span style="background-color: #80ffdb" /></p>
          </td>
          <td>0 ~ 200</td>
        </tr>
        <tr>
          <td>
            <p><span style="background-color: #64dfdf" /></p>
          </td>
          <td>200 ~ 400</td>
        </tr>
        <tr>
          <td>
            <p><span style="background-color: #48bfe3" /></p>
          </td>
          <td>400 ~ 600</td>
        </tr>
        <tr>
          <td>
            <p><span style="background-color: #5390d9" /></p>
          </td>
          <td>600 ~ 800</td>
        </tr>
        <tr>
          <td>
            <p><span style="background-color: #6930c3" /></p>
          </td>
          <td>800 ~ 1000</td>
        </tr>
        <tr>
          <td>
            <p><span style="background-color: #ff7979" /></p>
          </td>
          <td>2000 ~ MAX</td>
        </tr>
      </table>
    </div>
    <!-- 城市选择 -->
    <selectRegion />
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
import ListDiseases from "./listDiseases"; // 疾病选择
import Transmission from "./transmission"; // 传播途径
import concount from "../public/js/9-25/concount.json"; // 预测确诊
import curedCount from "../public/js/9-25/curedCount.json"; // 预测治愈
import deadCount from "../public/js/9-25/deadCount.json"; // 预测死亡
import conCount_time from "../public/js/conCount_time.json"; // 累计确诊
import deadCount_time from "../public/js/deadCount_time.json"; // 累计死亡
import curedCount_time from "../public/js/curedCount_time.json"; // 累计治愈
import china_con from "../public/js/china_con.json"; // 累计治愈
import sh_yc from "../public/js/shanghai/20210916.json"; // 累计治愈
import * as echarts from "echarts";
import eventBus from "../public/js/EvebtBus";
import { Mapbox } from "@antv/l7-maps";
import { Scene } from "@antv/l7";
// import Router from ''
export default {
  name: "Sentiment",
  components: {
    Router,
    SelectRegion,
    ListDiseases,
    Transmission,
  },
  data() {
    return {
      json: {
        name: "中国",
        where: "",
        code: "",
        type: "",
      },
      j: 0, // 右上角左右切换
      // 数据
      datas: [],
      xValue: [],
      myChart: null,
      option: null,
      // 地图
      map: null,
      scene: null,
      order: 0, // 地区
      yCon: [], // 预测确诊
      yCure: [], // 预测治愈
      yDead: [], // 预测死亡
      con: [], // 确诊
      dead: [], // 死亡
      cure: [], // 治愈
      heat: null, // 判断热力图
      // echarts
      chinaChart: null, // 中国各省疫情
      myChart1: null, // 确诊预测
      quezhen: [],
      myChart2: null, // 预测
      myChart3: null, // 预测
      xName: [],
      subscript: 0, // 播放所在下标
      chartsIndex: 0,
      mTime: null, // 播放任务
      chartTime: null, // 播放任务
    };
  },
  beforeDestroy() {
    eventBus.$off("json");
    eventBus.$off("typc");
    eventBus.$off("type");
    document.getElementById("sentiment").style.display = "none";
    clearInterval(this.mTime);
    clearInterval(this.chartTime);
    this.CAdestroy();
  },
  mounted() {
    var that = this;
    this.int();
    this.xaxis();
    // 城市选择
    eventBus.$on("json", (json) => {
      that.json.name = json.name;
      that.json.where = json.where;
      that.json.code = json.code;
      if (that.json.name !== "中国") {
        document.getElementById("legend").style.display = "none";
        this.CAdestroy();
        clearInterval(that.mTime);
        clearInterval(that.chartTime);
        // 地图定位
        that.getbianJson(1);
        that.getHJson();
      }
    });
    // 疾病名称
    eventBus.$on("typc", (typc) => {
      if (typc === "陕西手足口点") {
        this.json.type = "手足口病";
      } else {
        this.json.type = typc;
      }
      document.getElementById("legend").style.display = "block";
    });
    eventBus.$on("type", (type) => {
      if (type === "陕西手足口点") {
        this.json.type = "手足口病";
      } else {
        this.json.type = type;
      }
      if (this.json.name === "中国") {
        this.timecovid();
      }
      document.getElementById("legend").style.display = "block";
    });
  },
  methods: {
    huan(e) {
      this.j = e;
      var s = document.getElementsByClassName("s")[0];
      var x = document.getElementsByClassName("x")[0];
      if (e === 1) {
        s.style.display = "none";
        x.style.display = "block";
      } else {
        x.style.display = "none";
        s.style.display = "block";
      }
    },
    int() {
      var that = this;
      mapboxgl.accessToken =
        "pk.eyJ1Ijoid3VqaW5odWkwIiwiYSI6ImNrdDFoZWphNDBhaGszMXBoazZ1dWdwMWkifQ.AX5nvyCpK8yKsCqyz36rsw"; // 你的accessToken
      this.map = new mapboxgl.Map({
        container: "map1", // 地图容器的id
        center: [107.01292, 34.12077], // 中心点
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
      that.map.on("click", function (e) {
        var s = JSON.parse(JSON.stringify(e.lngLat));
        console.log("lng：" + s.lng + "\nlat：" + s.lat);
      });
      this.scene = new Scene({
        id: "map1",
        map: new Mapbox({
          mapInstance: that.map,
        }),
      });
      this.map.on("load", () => {
        that.getbianJson(0);
      });
      this.con = this.typeName(conCount_time);
      this.dead = this.typeName(deadCount_time);
      this.cure = this.typeName(curedCount_time);
      this.yCon = this.changeTime(
        JSON.parse(JSON.stringify(this.typeName(concount)))
      );
      this.yCure = this.changeTime(
        JSON.parse(JSON.stringify(this.typeName(curedCount)))
      );
      this.yDead = this.changeTime(
        JSON.parse(JSON.stringify(this.typeName(deadCount)))
      );
    },
    // 排序函数
    typeName(data) {
      // var that = this
      const map = data.reduce((result, item) => {
        result[item[0]] = result[item[0]] || [];
        result[item[0]].push(item);
        return result;
      }, {});
      // console.log(Object.values(map))
      // result即为所求
      return Object.values(map);
    },
    changeTime(datas) {
      for (let index = 0; index < datas.length; index++) {
        const element1 = datas[index];
        for (let i = 0; i < element1.length; i++) {
          element1[i][1] =
            element1[i][1].substring(0, 4) +
            "-" +
            element1[i][1].substring(4, 6) +
            "-" +
            element1[i][1].substring(6, 8);
        }
      }
      return datas;
    },
    xaxis() {
      // 获取集合中全部属性名
      for (var i in china_con[0]) {
        if (i !== "Province" && i !== "Lat" && i !== "Long") {
          this.xName.push(i);
        }
      }
    },
    timecovid() {
      this.CAdestroy();
      var that = this;
      var lenName = [];
      var dataAll = [];
      for (let j = 0; j < 5; j++) {
        const element = china_con[j];
        lenName.push(element.Province);
        var dat = [];
        var a = 0;
        for (const mealName of Object.values(element)) {
          a++;
          if (a > 3) {
            dat.push(mealName);
          }
        }
        dataAll.push({
          name: element.Province,
          type: "line",
          lineStyle: { width: 4 },
          data: dat,
        });
      }
      // eslint-disable-next-line no-undef
      that.chinaChart = echarts.init(document.getElementById("chart"));
      var option = {
        tooltip: {
          trigger: "axis",
        },
        dataZoom: [
          {
            type: "slider",
            xAxisIndex: 0,
            show: true,
            height: 15,
            start: 0,
            // end: this.end,
            bottom: "6%",
            showDetail: false,
          },
        ],
        legend: {
          type: "scroll",
          top: 0,
          data: lenName,
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: that.xName,
        },
        yAxis: {
          type: "value",
        },
        series: dataAll,
      };

      that.chinaChart.setOption(option);
      if (that.json.name === "中国") {
        this.mTime = setInterval(this.start, 100);
      }
    },
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
          for (let index = 0; index < features.length; index++) {
            const element = features[index];
            for (let j = 0; j < china_con.length; j++) {
              const element2 = china_con[j];
              if (element.properties.name === element2.Province) {
                features[index].properties = element2;
                break;
              }
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
    },
    // 时间图表
    initCharts(data, deaddata, curedata, name) {
      var that = this;
      // eslint-disable-next-line no-undef
      this.myChart = echarts.init(document.getElementById("chart"));
      // eslint-disable-next-line no-undef
      var option = {
        color: ["#ff7979", "rgb(194, 196, 89)", "#3A84FF"],
        grid: {
          top: "12%",
          left: "2%",
          right: "6%",
          bottom: "12%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            console.log(params);
            var rez =
              that.json.name +
              "预测<br/>" +
              params[2].marker +
              "确诊数据" +
              "：" +
              '<span style="font-weight: bold">' +
              params[0].data +
              "</span><br/>" +
              params[1].marker +
              "治愈数据" +
              "：" +
              '<span style="font-weight: bold">' +
              params[2].data +
              "</span><br/>" +
              params[0].marker +
              "死亡数据" +
              "：" +
              '<span style="font-weight: bold">' +
              params[1].data +
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
          nameLocation: "middle",
          axisLabel: {
            show: true,
            color: "#fff",
          },
          name: "时间",
          data: name,
        },
        yAxis: {
          name: "人数",
          splitLine: false,
          axisLabel: {
            show: true,
            color: "#fff",
          },
        },
        series: [
          {
            name: "确诊数据",
            type: "line",
            stack: "Total",
            data: data,
          },
          {
            name: "死亡数据",
            type: "line",
            stack: "Total",
            data: deaddata,
          },
          {
            name: "治愈数据",
            type: "line",
            stack: "Total",
            data: curedata,
          },
        ],
      };
      that.myChart.setOption(option);
    },
    // 播放标签
    start() {
      var that = this;
      // this.subscript = 0 // 播放所在下标
      this.chinaChart.dispatchAction({
        type: "showTip",
        seriesIndex: 0,
        dataIndex: this.subscript,
      });
      this.subscript++;
      var mag1 = ["<", ["get", that.xName[that.subscript]], 200];
      var mag2 = [
        "all",
        [">=", ["get", that.xName[that.subscript]], 200],
        ["<", ["get", that.xName[that.subscript]], 400],
      ];
      var mag3 = [
        "all",
        [">=", ["get", that.xName[that.subscript]], 400],
        ["<", ["get", that.xName[that.subscript]], 600],
      ];
      var mag4 = [
        "all",
        [">=", ["get", that.xName[that.subscript]], 600],
        ["<", ["get", that.xName[that.subscript]], 800],
      ];
      var mag5 = [
        "all",
        [">=", ["get", that.xName[that.subscript]], 800],
        ["<", ["get", that.xName[that.subscript]], 1000],
      ];
      var mag6 = [">=", ["get", that.xName[that.subscript]], 2000];
      var colors = [
        "#80ffdb",
        "#64dfdf",
        "#48bfe3",
        "#5390d9",
        "#6930c3",
        "#ff7979",
      ];
      if (this.json.name === "中国") {
        this.map.setPaintProperty("maine0", "fill-color", [
          "case",
          // 定义不同层次数据颜色
          mag1,
          colors[0],
          mag2,
          colors[1],
          mag3,
          colors[2],
          mag4,
          colors[3],
          mag5,
          colors[4],
          mag6,
          colors[5],
          colors[4],
        ]);
      }
    },
    zanting() {
      clearInterval(this.mTime);
    },
    // 请求数据
    getHJson() {
      var that = this;
      // that.dead
      // that.cure
      var data = [["Country", "time", "min", "real", "max"]];
      if (that.json.name === "上海市") {
        that.order = 0;
      } else if (that.json.name === "广东省") {
        that.order = 1;
      } else if (that.json.name === "北京市") {
        that.order = 2;
      } else if (that.json.name === "辽宁省") {
        that.order = 3;
      } else if (that.json.name === "黑龙江省") {
        that.order = 4;
      } else if (that.json.name === "河北省") {
        that.order = 5;
      } else if (that.json.name === "新疆维吾尔自治区") {
        that.order = 6;
      } else if (that.json.name === "吉林省") {
        that.order = 7;
      } else {
        that.order = 8;
      }
      if (that.order !== 8) {
        for (let index = 0; index < that.con[that.order].length; index++) {
          const con = that.con[that.order][index];
          const dead = that.dead[that.order][index];
          const cure = that.cure[that.order][index];
          data.push(con);
          data.push(dead);
          data.push(cure);
        }
        this.addheatmap(data);
        // console.log(data)
        // console.log(that.con)
        var condata = [];
        var deaddata = [];
        var curedata = [];
        var name1 = [];
        for (let index = 0; index < that.con[that.order].length; index++) {
          const element = that.con[that.order][index];
          condata.push(element[2]);
          deaddata.push(that.dead[that.order][index][2]);
          curedata.push(that.cure[that.order][index][2]);
          name1.push(element[1]);
        }
        that.initCharts(condata, deaddata, curedata, name1);
      } else {
        that.$message({
          message: "暂不支持该地区",
          type: "warning",
        });
      }
    },
    addheatmap() {
      if (this.heat === null && this.json.name === "上海市") {
        this.heat = 1;
        this.map.addSource("earthquakes", {
          type: "geojson",
          data: sh_yc[0],
        });
        this.map.addLayer({
          id: "earthquakes-heat",
          type: "heatmap",
          source: "earthquakes",
          paint: {
            // Increase the heatmap weight based on frequency and property magnitude
            "heatmap-weight": [
              "interpolate",
              ["linear"],
              ["get", "value"],
              0,
              0,
              5,
              1,
            ],
            "heatmap-intensity": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0,
              1,
              9,
              2,
            ],
            "heatmap-color": [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0,
              "rgba(33,102,172,0)",
              0.2,
              "rgb(103,169,207)",
              0.4,
              "rgb(209,229,240)",
              0.6,
              "rgb(253,219,199)",
              0.8,
              "rgb(239,138,98)",
              1,
              "rgb(178,24,43)",
            ],
            // Adjust the heatmap radius by zoom level
            "heatmap-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0,
              2,
              9,
              9,
              12,
              12,
              20,
              20,
            ],
            // Transition from heatmap to circle layer by zoom level
            "heatmap-opacity": [
              "interpolate",
              ["linear"],
              ["zoom"],
              7,
              1,
              20,
              0,
            ],
          },
        });
        this.map.setLayoutProperty("Bubbpoints", "visibility", "visible");
      } else if (this.json.name === "上海市") {
        this.map.setLayoutProperty("Bubbpoints", "visibility", "visible");
      } else {
        this.map.setLayoutProperty("Bubbpoints", "visibility", "none");
      }
      this.chartTime = setInterval(this.ycStart, 500);
    },
    ycStart() {
      var that = this;
      // var aaa = 0
      this.map.getSource("earthquakes").setData(sh_yc[this.chartsIndex]);
      this.chartsIndex++;
      if (that.chartsIndex === sh_yc.length - 1) {
        that.chartsIndex = 0;
      }
      that.quezhen = [];
      var zhiyu = [];
      var siwang = [];
      for (let index = 0; index < that.chartsIndex + 1; index++) {
        const yCon = that.yCon[that.order][index];
        const yCure = that.yCure[that.order][index];
        const yDead = that.yDead[that.order][index];
        that.quezhen.push(yCon);
        zhiyu.push(yCure);
        siwang.push(yDead);
      }
      this.addchart1(that.quezhen);
      this.addchart2(zhiyu);
      this.addchart3(siwang);
    },
    addchart1(data) {
      var name = [];
      var condata = [];
      var min = data[0][2];
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        name.push(element[1]);
        if (min > element[2]) {
          min = element[2];
        }
        condata.push(element[2]);
      }
      if (this.myChart1 === null) {
        this.myChart1 = echarts.init(document.getElementById("chart1"));
      }
      var option = {
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false, // 坐标轴两边留白
          data: name,
          axisTick: {
            // 坐标轴刻度相关设置。
            show: false,
          },
          axisLine: {
            // 坐标轴轴线相关设置
          },
        },
        yAxis: {
          type: "value",
          name: "人数",
          // min: Math.round(min - 50),
          splitLine: false,
          axisLabel: {
            show: true,
            color: "#fff",
          },
          scale: true,
        },
        series: [
          {
            name: this.json.name + "预测确诊",
            type: "line",
            itemStyle: {
              normal: {
                color: "#3A84FF",
                lineStyle: {
                  color: "#3A84FF",
                  width: 1,
                },
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 0,
                      color: "rgba(58,132,255,0)",
                    },
                    {
                      offset: 1,
                      color: "rgba(58,132,255,0.35)",
                    },
                  ]),
                },
              },
            },
            data: condata,
          },
        ],
      };
      this.myChart1.setOption(option);
    },
    addchart2(data) {
      var name = [];
      var condata = [];
      var min = data[0][2];
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        name.push(element[1]);
        condata.push(element[2]);
        if (min > element[2]) {
          min = element[2];
        }
      }
      if (this.myChart2 === null) {
        this.myChart2 = echarts.init(document.getElementById("chart2"));
      }
      var option = {
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false, // 坐标轴两边留白
          data: name,
          axisTick: {
            // 坐标轴刻度相关设置。
            show: false,
          },
          axisLine: {
            // 坐标轴轴线相关设置
          },
        },
        yAxis: {
          type: "value",
          name: "人数",
          // min: Math.round(min - 50),
          splitLine: false,
          scale: true,
          axisLabel: {
            show: true,
            color: "#fff",
          },
        },
        series: [
          {
            name: this.json.name + "预测治愈",
            type: "line",
            itemStyle: {
              normal: {
                color: "rgb(194, 196, 89)",
                lineStyle: {
                  color: "rgb(194, 196, 89)",
                  width: 1,
                },
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 0,
                      color: "rgba(194, 196, 89,0)",
                    },
                    {
                      offset: 1,
                      color: "rgba(194, 196, 89,0.35)",
                    },
                  ]),
                },
              },
            },
            data: condata,
          },
        ],
      };

      this.myChart2.setOption(option);
    },
    addchart3(data) {
      var name = [];
      var condata = [];
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        name.push(element[1]);
        condata.push(element[2]);
      }
      if (this.myChart3 === null) {
        this.myChart3 = echarts.init(document.getElementById("chart3"));
      }
      var option = {
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false, // 坐标轴两边留白
          data: name,
          axisTick: {
            // 坐标轴刻度相关设置。
            show: false,
          },
          axisLine: {
            // 坐标轴轴线相关设置
          },
        },
        yAxis: {
          type: "value",
          name: "人数",
          splitLine: false,
          axisLabel: {
            show: true,
            color: "#fff",
          },
          scale: true,
        },
        series: [
          {
            name: this.json.name + "预测死亡",
            type: "line",
            itemStyle: {
              normal: {
                color: "#ff7979",
                lineStyle: {
                  color: "#ff7979",
                  width: 1,
                },
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 0,
                      color: "rgba(255, 121, 121,0)",
                    },
                    {
                      offset: 1,
                      color: "rgba(255, 121, 121,0.35)",
                    },
                  ]),
                },
              },
            },
            data: condata,
          },
        ],
      };
      this.myChart3.setOption(option);
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
        that.checkTime(i.getDate())
      );
    },
    // 时间处理3
    checkTime3(i) {
      var that = this;
      return (
        that.checkTime(i.getHours()) + ":" + that.checkTime(i.getMinutes())
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
        "00" +
        ":" +
        "00"
      );
    },
    // 数字处理
    format(number) {
      var str = parseInt(number).toString();
      var len = str.length;
      if (len <= 3) {
        return str;
      }
      var r = len % 3;
      return r > 0
        ? str.slice(0, r) + "," + str.slice(r, len).match(/\d{3}/g).join(",")
        : str.slice(r, len).match(/\d{3}/g).join(",");
    },
    // 创建与销毁盒子
    CAdestroy() {
      if (this.myChart !== null) {
        this.myChart.clear();
        this.myChart.dispose();
      }
      if (this.chinaChart !== null) {
        this.chinaChart.clear();
        this.chinaChart.dispose();
      }
      if (this.myChart1 !== null) {
        this.myChart1.clear();
        this.myChart1.dispose();
        this.myChart1 = null;
      }
      if (this.myChart2 !== null) {
        this.myChart2.clear();
        this.myChart2.dispose();
        this.myChart2 = null;
      }
      if (this.myChart3 !== null) {
        this.myChart3.clear();
        this.myChart3.dispose();
        this.myChart3 = null;
      }
    },
  },
};
</script>
<style scoped>
@font-face {
  src: url("../public/font/KuHei.ttf");
  font-family: "KuHei";
}
@font-face {
  src: url("../public/font/Microsoft-YaHei.ttf");
  font-family: "YaHei";
}
@font-face {
  src: url("../public/font/DS-DIGIT.ttf");
  font-family: "DIGIT";
}
#sentiment {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url("../public/img/back.png") no-repeat center center;
  /* 背景图不平铺 */
  background-size: cover;
  /* 让背景图基于容器大小伸缩 */
  background-attachment: fixed;
  /* 当内容高度大于图片高度时，背景图像的位置相对于viewport固定 */
  background-color: #cccccc;
}
/* L7logo */
#sentiment >>> .l7-left .l7-control {
  display: none !important;
}
/* mapboxlogo */
#sentiment >>> .mapboxgl-ctrl-bottom-right {
  display: none !important;
}
/* 地图 */
#map1 {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
}
/* 参数 */
#sentiment #setup {
  position: absolute;
  width: calc(100% - 50px);
  left: 45px;
  bottom: calc(35% + 7px);
  height: 45px;
  line-height: 45px;
  font-family: KuHei;
  border: 1px solid #0fafeb;
  background: url("../public/img/bg.png") rgba(19, 72, 172, 0.3);
  /* z-index: 20; */
}
/* 标题 */
#sentiment #setup .title {
  position: absolute;
  font-family: KuHei;
  color: #fff;
  font-size: 18px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  letter-spacing: 5px;
}
/* 监测 */
#sentiment #monitor {
  position: absolute;
  width: calc(100% - 50px);
  left: 45px;
  height: 35%;
  bottom: 3px;
  font-family: KuHei;
  color: #fff;
}
#sentiment #monitor .left {
  position: absolute;
  height: 100%;
  left: 0;
  width: calc(40% - 2.5px);
  border: 1px solid #0fafeb;
  background: url("../public/img/bn.png") ;
  background-size: 100% 100%;
  z-index: 20;
}
#sentiment #monitor .right {
  position: absolute;
  height: 100%;
  right: 0;
  width: calc(60% - 2.5px);
  z-index: 20;
}
#sentiment #monitor .right .right-left {
  position: absolute;
  height: 100%;
  left: 0;
  width: 33%;
  border: 1px solid #0fafeb;
  z-index: 20;
  background: url("../public/img/bn.png") ;
  background-size: 100% 100%;
}
#sentiment #monitor .right .right-mid {
  position: absolute;
  height: 100%;
  left: calc(33.5% - 2.5px);
  width: 33%;
  border: 1px solid #0fafeb;
  z-index: 20;
  background: url("../public/img/bn.png") ;
  background-size: 100% 100%;
}
#sentiment #monitor .right .right-right {
  position: absolute;
  height: 100%;
  right: 5px;
  width: 33%;
  border: 1px solid #0fafeb;
  z-index: 20;
  background: url("../public/img/bn.png") ;
  background-size: 100% 100%;
}
/* 四角 */
#sentiment #setup::after
/* #sentiment #monitor .right .right-left::after,
#sentiment #monitor .right .right-mid::after,
#sentiment #monitor .right .right-right::after, */ {
  position: absolute;
  content: "";
  bottom: -1px;
  right: -1px;
  height: 10px;
  width: 10px;
  border-bottom: 2px solid #02a6b5;
  border-right: 2px solid #02a6b5;
  transition: all 1.5s;
  z-index: 0;
}
#sentiment #setup::before
/* #sentiment #monitor .right .right-left::before,
#sentiment #monitor .right .right-mid::before,
#sentiment #monitor .right .right-right::before, */
/* #sentiment #monitor .left::before { */ {
  position: absolute;
  content: "";
  top: -1px;
  left: -1px;
  height: 10px;
  width: 10px;
  border-top: 2px solid #02a6b5;
  border-left: 2px solid #02a6b5;
  transition: all 1.5s;
  z-index: 0;
}
#sentiment #legend {
  display: none;
  position: absolute;
  width: 180px;
  left: 45px;
  top: 0;
  height: 240px;
  border-radius: 3px;
  background-color: rgba(79, 133, 177, 0.3);
  border: 1px solid #0fafeb;
  color: #fff;
}
#sentiment #legend table {
  text-align: center;
  width: 180px;
  height: 240px;
}
#sentiment #legend table td {
  text-align: center;
  position: relative;
  font-size: 13px;
  font-family: KuHei;
}
#sentiment #legend table p {
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
#sentiment #legend table td span {
  width: 25px;
  height: 25px;
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
/* 条件 */
#sentiment .condition .top {
  position: absolute;
  width: 400px;
  right: 5px;
  top: 5px;
  height: calc(40% - 5px);
  /* border: 2px solid rgba(25, 186, 139, 0.2); */
  background: url("../public/img/bn.png");
  background-size: 100% 100%;
}
/** END of xuan */
/* 四角 */
#sentiment .condition .top::after,
#sentiment .condition .top::before,
/* 切换 */
#sentiment .condition .top >>> .el-icon-arrow-left {
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
#sentiment .condition .top >>> .el-icon-arrow-right {
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
/* 查询类型 */
#sentiment ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
#sentiment .type {
  position: absolute;
  z-index: 10;
  top: 55px;
  right: 5px;
  font-family: KuHei;
  font-size: 14px;
}
#sentiment .type li {
  width: 100px;
  height: 35px;
  text-align: center;
  padding: 5px 0;
  cursor: pointer;
  border-radius: 2px;
  color: rgb(202, 202, 202);
  background-color: rgba(79, 133, 177, 0.3);
  border: 1.5px solid #0fafeb;
  transition: all 0.5s;
  margin-bottom: 5px;
}
#sentiment .type li:hover {
  color: rgb(230, 230, 230);
}
</style>
