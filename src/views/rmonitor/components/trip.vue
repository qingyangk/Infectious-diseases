<template>
  <div id="Trip">
    <div id="tripMap" />
    <!-- 参数 -->
    <div id="setup">
      <!-- 标题 -->
      <div class="title">通行码监测</div>
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
      <!-- 监测 -->
      <div class="fMonitor">
        <el-radio v-model="x" label="24" @change="bmonitor(24)">24H</el-radio>
        <el-radio v-model="x" label="12" @change="bmonitor(12)">12H</el-radio>
      </div>
      <!-- 播放 -->
      <div id="play" class="play" @click="bofang()">
        <icon-svg :icon-class="ioc" class="img" />
        <p class="xuanfu">自动播放</p>
      </div>
    </div>
    <!-- 监测 -->
    <div id="monitor">
      <div id="chart" style="height: 100%; width: 100%; z-index: 1" />
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
import * as echarts from "echarts";
// eslint-disable-next-line no-unused-vars
import { Scene, Marker } from "@antv/l7";
import { Mapbox } from "@antv/l7-maps";
import mapboxgl from "mapbox-gl";
import Router from "./router";
import SelectRegion from "./selectRegion";
import eventBus from "../public/js/EvebtBus";

export default {
  name: "Trip",
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
      // 数据
      datas: [],
      x: "24",
      xValue: [],
      myChart: null,
      option: null,
      bfang: true,
      ioc: "icon-zanting",
      // map
      map: null,
      // antv
      scene: null,
      // 定位图层
      countryLayer: null, // 国家
      provinceLayer: null, // 省
      cityLayer: null, // 市
      countyLayer: null, // 县
      // 地图数据
      allMapData: [],
    };
  },
  beforeDestroy() {
    eventBus.$off("json");
    document.getElementById("Trip").style.display = "none";
    this.CAdestroy();
  },
  mounted() {
    var that = this;
    // 地图
    this.int();
    // 城市选择
    eventBus.$on("json", (json) => {
      that.json.name = json.name;
      that.json.where = json.where;
      that.json.code = json.code;
      if (that.json.name !== "中国") {
        that.getHJson();
        // 地图定位
        that.getbianJson(1);
      }
    });
    // X轴
    that.xZhou();
    // 今日时间
    that.timx = that.checkTime2(new Date());
    // 切换时间是否展示
    if (
      new Date(new Date(this.timx).getTime() + 24 * 60 * 60 * 1000) <
      new Date().getTime()
    ) {
      document.querySelectorAll(".fTime .img")[1].style.zIndex = 0;
    } else {
      document.querySelectorAll(".fTime .img")[1].style.zIndex = -10;
    }
    // 动画
    document.getElementById("play").addEventListener("mouseover", function () {
      document.querySelector(".xuanfu").style.opacity = 1;
    });
    document.getElementById("play").addEventListener("mouseout", function () {
      document.querySelector(".xuanfu").style.opacity = 0;
    });
  },
  methods: {
    // 创建地图
    int() {
      mapboxgl.accessToken =
        "pk.eyJ1Ijoid3VqaW5odWkwIiwiYSI6ImNrdDFoZWphNDBhaGszMXBoazZ1dWdwMWkifQ.AX5nvyCpK8yKsCqyz36rsw"; // 你的accessToken
      this.map = new mapboxgl.Map({
        container: "tripMap", // 地图容器的id
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
      var that = this;
      this.scene = new Scene({
        id: "tripMap",
        map: new Mapbox({
          mapInstance: that.map,
        }),
      });
      this.map.on("load", () => {
        that.getbianJson(0);
      });
    },
    getbianJson(e) {
      var that = this;
      var data = {};
      data.timx = that.checkTime4(
        new Date(new Date(that.json.timx).getTime() + 24 * 60 * 60 * 1000)
      );
      data.timz = that.checkTime4(
        new Date(new Date(that.json.timz).getTime() + 24 * 60 * 60 * 1000)
      );
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
    // 初始化图层
    loadMapData(data) {
      var that = this;
      var isExistence = false;
      if (this.map.getSource("earthquakes") !== undefined) {
        isExistence = true;
      }
      if (isExistence === false) {
        that.map.addSource("earthquakes", {
          type: "geojson",
          data: data,
          cluster: true,
          clusterMaxZoom: 14, // Max zoom to cluster points on
          clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
        });
        that.map.addSource("people", {
          type: "geojson",
          data: data,
        });
        // 热力图
        that.map.addLayer({
          id: "earthquakes-heat",
          type: "heatmap",
          source: "people",
          maxzoom: 16,
          paint: {
            "heatmap-weight": [
              "interpolate",
              ["linear"],
              ["get", "mag"],
              0,
              0,
              6,
              1,
            ],
            "heatmap-intensity": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0,
              1,
              9,
              3,
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
              20,
            ],
            // Transition from heatmap to circle layer by zoom level
            "heatmap-opacity": [
              "interpolate",
              ["linear"],
              ["zoom"],
              10,
              0.9,
              11,
              0.8,
              12,
              0.7,
              13,
              0.6,
              14,
              0.5,
              15,
              0,
            ],
          },
        });
        // 聚合图
        that.map.addLayer({
          id: "clusters",
          type: "circle",
          source: "earthquakes",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": [
              "step",
              ["get", "point_count"],
              "#51bbd6",
              100,
              "#f1f075",
              750,
              "#f28cb1",
            ],
            "circle-radius": [
              "step",
              ["get", "point_count"],
              20,
              100,
              30,
              750,
              40,
            ],
          },
        });

        that.map.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "earthquakes",
          filter: ["has", "point_count"],
          layout: {
            "text-field": "{point_count_abbreviated}",
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 12,
          },
        });

        that.map.addLayer({
          id: "unclustered-point",
          type: "circle",
          source: "earthquakes",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": "#11b4da",
            "circle-radius": 4,
            "circle-stroke-width": 1,
            "circle-stroke-color": "#fff",
          },
        });
        that.map.on("click", "clusters", function (e) {
          var features = that.map.queryRenderedFeatures(e.point, {
            layers: ["clusters"],
          });
          var clusterId = features[0].properties.cluster_id;
          that.map
            .getSource("earthquakes")
            .getClusterExpansionZoom(clusterId, function (err, zoom) {
              if (err) {
                return;
              }

              that.map.easeTo({
                center: features[0].geometry.coordinates,
                zoom: zoom,
              });
            });
        });

        that.map.on("mouseenter", "clusters", function () {
          that.map.getCanvas().style.cursor = "pointer";
        });
        that.map.on("mouseleave", "clusters", function () {
          that.map.getCanvas().style.cursor = "";
        });
      } else {
        this.map.getSource("earthquakes").setData(data);
        this.map.getSource("people").setData(data);
      }
    },
    initCharts(options) {
      var that = this;
      this.myChart = echarts.init(document.getElementById("chart"));
      this.option = {
        baseOption: {
          timeline: {
            axisType: "category",
            show: true,
            symbol: "emptyCircle",
            progress: {
              itemStyle: {
                color: "#ff7979",
              },
              lineStyle: {
                color: "#ff7979",
              },
            },
            autoPlay: true, // 自动播放
            playInterval: 2000,
            data: that.xValue,
            // 默认颜色
            lineStyle: {
              color: "#ff7979",
            },
            itemStyle: {
              color: "#ff7979",
            },
            // 选择颜色
            checkpointStyle: {
              color: "#ff7979",
            },
            controlStyle: {
              show: false,
            },
            top: "5px",
          },
          xAxis: {
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
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
            },
          },
          grid: {
            top: "60px",
            left: "10px",
            right: "10px",
            bottom: "40px",
            containLabel: true,
          },
          dataZoom: [
            {
              type: "slider",
              show: true,
              height: 15,
              start: 0,
              end: 30,
              bottom: "6%",
              showDetail: false,
            },
          ],
        },
        options: options,
      };
      window.addEventListener("resize", function () {
        this.myChart = echarts.init(document.getElementById("chart"));
        if (this.myChart) {
          this.myChart.resize(); // 不报错
        }
      });
      this.myChart.setOption(this.option);
      // 监听时间轴
      this.myChart.on("timelinechanged", function (timeLineIndex) {
        const index = timeLineIndex.currentIndex;
        that.loadMapData(that.allMapData[index]);
      });
      // 点击事件
      this.myChart.on("click", function (params) {});
    },
    // X轴
    xZhou() {
      this.xValue = [];
      for (let i = 0; i < this.x * 1; i++) {
        this.xValue.push(i + "时");
      }
    },
    // 切换时间间隔
    bmonitor(e) {
      if (this.json.name === "" || this.json.name === "中国") {
        this.$message({
          message: "请选择城市！",
          type: "warning",
          showClose: true,
        });
        if (e * 1 === 12) {
          this.x = "24";
        } else {
          this.x = "12";
        }
      } else {
        this.x = e + "";
        this.xZhou();
        this.getHJson();
      }
    },
    // 自动播放
    bofang() {
      if (this.json.name === "" || this.json.name === "中国") {
        this.$message({
          message: "请选择城市！",
          type: "warning",
          showClose: true,
        });
      } else {
        if (this.bfang === false) {
          this.option.baseOption.timeline.autoPlay = true;
          this.myChart.setOption(this.option);
          this.bfang = true;
          this.ioc = "icon-zanting";
        } else {
          this.option.baseOption.timeline.autoPlay = false;
          this.myChart.setOption(this.option);
          this.bfang = false;
          this.ioc = "icon-bofang";
        }
      }
    },
    // 请求数据
    getHJson() {
      document.getElementById("bg").style.display = "block"; // 遮罩
      var that = this;
      that.CAdestroy();
      var data = {};
      data.where = that.json.where;
      data.name = that.json.name;
      data.timz = that.checkTime4(new Date(that.timx));
      data.timx = that.checkTime4(
        new Date(new Date(data.timz).getTime() + 24 * 60 * 60 * 1000)
      );
      // 重置
      that.datas = [];
      for (let i = 0; i < this.x * 1; i++) {
        var shu = [];
        that.datas.push(shu);
      }
      that.$store.dispatch("ncity/RQuarters", data).then((datas) => {
        for (let i = 0; i < datas.length; i++) {
          if (that.x * 1 === 24) {
            that.datas[datas[i].hour].push(datas[i]);
          } else {
            if (datas[i].hour % 2 === 0) {
              that.datas[datas[i].hour / 2].push(datas[i]);
            } else {
              that.datas[(datas[i].hour - 1) / 2].push(datas[i]);
            }
          }
        }
        for (let i = 0; i < that.datas.length; i++) {
          that.datas[i].sort(function (a, b) {
            return b.value - a.value;
          });
        }
        document.getElementById("bg").style.display = "none"; // 遮罩
        that.allMapData = [];
        // 时间值
        var options = [];
        for (let i = 0; i < that.datas.length; i++) {
          // 为echarts
          var name = [];
          var way = [];
          var mapdata = [];
          for (let j = 0; j < that.datas[i].length; j++) {
            name.push(that.datas[i][j].name);
            way.push(that.datas[i][j].value);
            mapdata.push({
              type: "Feature",
              properties: {
                name: that.datas[i][j].name,
                value: that.datas[i][j].value * 1,
              },
              geometry: {
                type: "Point",
                coordinates: [that.datas[i][j].x * 1, that.datas[i][j].y * 1],
              },
            });
          }
          options.push({
            xAxis: {
              type: "category",
              axisLabel: {
                show: true,
                color: "#fff",
              },
              data: name,
            },
            series: {
              type: "bar",
              itemStyle: {
                color: "#ff7979",
              },
              data: way,
            },
          });
          // 为地图
          that.allMapData.push({
            type: "FeatureCollection",
            crs: {
              type: "name",
              properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
            },
            features: mapdata,
          });
        }
        that.loadMapData(that.allMapData[0]);
        that.initCharts(options);
      });
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
        } else {
          document.querySelectorAll(".fTime .img")[1].style.zIndex = -10;
        }
        this.getHJson();
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
        this.getHJson();
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
        } else {
          document.querySelectorAll(".fTime .img")[1].style.zIndex = -10;
        }
        this.getHJson();
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
#Trip {
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
#Trip >>> .l7-left .l7-control {
  display: none !important;
}
/* mapboxlogo */
#Trip >>> .mapboxgl-ctrl-bottom-right {
  display: none !important;
}
/* 地图 */
#tripMap {
  position: absolute;
  width: 100%;
  height: 100%;
}
/* 参数 */
#Trip #setup {
  position: absolute;
  width: calc(100% - 50px);
  left: 45px;
  bottom: calc(35% + 7px);
  height: 45px;
  line-height: 45px;
  font-family: KuHei;
  border: 1px solid #0fafeb;
  background: url("../public/img/bg.png") rgba(79, 133, 177, 0.3);
  /* z-index: 20; */
}
/* 标题 */
#Trip #setup .title {
  position: absolute;
  font-family: KuHei;
  color: #fff;
  font-size: 18px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  letter-spacing: 5px;
}
/* 时间范围 */
#Trip #setup .fTime {
  position: absolute;
  left: 0;
  width: 260px;
  height: 45px;
  line-height: 45px;
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
}
#Trip #setup .fTime::after {
  content: "";
  position: absolute;
  height: calc(100% - 2px);
  width: 2px;
  background-color: rgba(219, 219, 219, 0.555);
  right: 0;
  top: 0;
}
#Trip #setup .fTime >>> .el-input__prefix,
#Trip #setup .fTime >>> .el-input__suffix {
  display: none;
}
#Trip #setup .fTime >>> .el-input__inner {
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
#Trip #setup .fTime >>> .el-date-editor.el-input,
#Trip #setup .fTime >>> .el-date-editor.el-input__inner {
  width: 140px;
}
#Trip #setup .fTime .img {
  margin: 0 15px;
  height: 45px;
  line-height: 45px;
  cursor: pointer;
  color: rgb(199, 199, 199);
  transition: all 0.5s;
}
#Trip #setup .fTime .img:hover {
  color: #fff;
}
/* 监测模式 */
#Trip #setup .fMonitor {
  position: absolute;
  left: 260px;
  width: 260px;
  height: 45px;
  line-height: 45px;
  text-align: center;
  border-right: 2px solid rgba(219, 219, 219, 0.555);
  justify-content: center;
  align-items: center;
  display: flex;
}
#Trip #setup .fMonitor >>> .el-radio {
  color: #fff;
}
#Trip #setup .fMonitor >>> .el-radio__inner::after {
  left: 54.2%;
  top: 53.3%;
}
#Trip #setup .fMonitor >>> .el-radio__input.is-checked + .el-radio__label {
  color: #ff7979;
}
#Trip #setup .fMonitor >>> .el-radio__input.is-checked .el-radio__inner {
  border-color: #ff7979;
  background: #ff7979;
}
/* 播放 */
#Trip #setup .play {
  position: absolute;
  cursor: pointer;
  font-size: 25px;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.5s;
  height: 100%;
  width: 35px;
  right: 0;
  text-align: center;
}
#Trip #setup .play:hover {
  color: rgba(255, 255, 255, 1);
}
#Trip #setup .play .xuanfu {
  color: #fff;
  font-family: KuHei;
  margin: 0;
  padding: 0;
  position: absolute;
  text-align: center;
  background-color: rgba(40, 43, 57, 0.8) !important;
  letter-spacing: 3px;
  border: 1px solid rgba(219, 219, 219, 0.555);
  width: 85px;
  border-radius: 4px;
  font-size: 12px;
  height: 35px;
  line-height: 35px;
  right: 35px;
  top: 50%;
  transform: translate(0, -50%);
  opacity: 0;
  transition: all 0.5s;
}
/* 监测 */
#Trip #monitor {
  position: absolute;
  width: calc(100% - 50px);
  left: 45px;
  height: 35%;
  bottom: 3px;
  font-family: KuHei;
  /* border: 1px solid #0fafeb; */
  background: url("../public/img/bn.png") rgba(18, 18, 18, 0.2);
  background-size: 100% 100%;
  z-index: 20;
}
/* 四角 */
#Trip #setup::after,
#Trip #monitor::after {
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
#Trip #setup::after {
  border-bottom: 2px solid #02a6b5;
  border-right: 2px solid #02a6b5;
}
#Trip #setup::before,
#Trip #monitor::before {
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
#Trip #setup::before {
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
