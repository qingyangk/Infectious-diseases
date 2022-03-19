<template>
  <div id="sentiment">
    <!-- 地图 -->
    <div id="EMap1" />
    <!-- 左侧 -->
    <div id="left">
      <div class="left">
        <div class="top">高频热词分布</div>
        <div
          id="matrix"
          style="
            height: calc(100% - 35px);
            width: 100%;
            z-index: 2;
            top: 35px;
            position: absolute;
          "
        />
      </div>
      <div class="right">
        <div class="top">高频情感占比</div>
        <div
          id="proportion"
          style="
            height: calc(100% - 35px);
            width: 100%;
            z-index: 2;
            top: 35px;
            position: absolute;
          "
        />
      </div>
    </div>
    <!-- 中部 -->
    <div id="center">
      <ul>
        <li>
          <div class="top">新闻来源占比</div>
          <div
            id="source"
            style="
              height: calc(100% - 35px);
              width: 100%;
              z-index: 2;
              top: 35px;
              position: absolute;
            "
          />
        </li>
        <li>
          <el-carousel arrow="never">
            <el-carousel-item v-for="item in 2" :key="item">
              <div v-if="item === 1">
                <div class="bottom">正面讨论</div>
                <div
                  id="positive"
                  style="
                    height: calc(100% - 35px);
                    width: 100%;
                    z-index: 2;
                    bottom: 35px;
                    position: absolute;
                  "
                />
              </div>
              <div v-if="item === 2">
                <div class="bottom">负面讨论</div>
                <div
                  id="negative"
                  style="
                    height: calc(100% - 35px);
                    width: 100%;
                    z-index: 2;
                    bottom: 35px;
                    position: absolute;
                  "
                />
              </div>
            </el-carousel-item>
          </el-carousel>
        </li>
        <li>
          <div class="top">热搜类别占比</div>
          <div
            id="hsearch"
            style="
              height: calc(100% - 35px);
              width: 100%;
              z-index: 2;
              top: 35px;
              position: absolute;
            "
          />
        </li>
      </ul>
    </div>
    <!-- 右侧 -->
    <div id="right">
      <ul>
        <li class="public">
          <p>时间范围</p>
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
          <p>
            <span>{{ json.timz }}</span> 至 <span>{{ json.timx }}</span>
          </p>
        </li>
        <li class="publiz">
          <div id="neirong">
            <section
              v-for="(value, index) in Journalisz"
              :id="value.id"
              :key="index"
            >
              <h3>{{ value.title }}</h3>
              <!-- 标签 -->
              <p>{{ value.summary }}</p>
              <!-- 内容 -->
              <div class="diceng">
                <span>{{ value.time }}</span>
                <!-- 时间 -->
                <span>{{ value.infoSource }}</span>
                <!-- 来源 -->
              </div>
            </section>
          </div>
        </li>
      </ul>
    </div>
    <!-- 路由 -->
    <router />
    <!-- 加载动画 -->
    <div id="bg">
      <div id="xuan"><span /><span /><span /><span /></div>
    </div>
  </div>
</template>

<script>
import router from "./components/router";
import mapboxgl from "mapbox-gl";
import * as echarts from "echarts";

export default {
  name: "Sentiment",
  components: {
    router,
  },
  data() {
    return {
      // 数据
      json: {
        timx: "",
        timz: "",
      },
      timx: "", // 今日时间
      Journalism: {}, // 新闻数据集
      Journalisz: [], // 新闻数据集
      activeChapterName: "bian0", // 当前微博
      // 地图
      boundary: null, // 边界数据
      map: null, // 地图
      pickerOptions: {
        disabledDate: (time) => {
          return time > new Date().getTime();
        },
      },
      // echarts
      myChart1: null, // 矩阵
      myChart2: null, // 比例
      myChart3: null, // 来源
      myChart4: null, // 正面
      myChart5: null, // 负面
      myChart6: null, // 类别
    };
  },
  beforeDestroy() {
    document.getElementById("sentiment").style.display = "none";
    if (this.map !== null) {
      this.map.remove();
    }
  },
  mounted() {
    var that = this;
    // 今日时间
    that.timx = that.checkTime2(new Date());
    that.json.timx = that.checkTime5(new Date(this.timx));
    that.json.timz = that.checkTime5(
      new Date(new Date(that.timx).getTime() - 31 * 24 * 60 * 60 * 1000)
    );
    // 切换时间是否展示
    if (
      new Date(new Date(that.timx).getTime() + 24 * 60 * 60 * 1000) <
      new Date().getTime()
    ) {
      document.querySelectorAll(".fTime .img")[1].style.zIndex = 0;
      document.querySelectorAll(".fTime .img")[1].style.opacity = 1;
    } else {
      document.querySelectorAll(".fTime .img")[1].style.zIndex = -10;
      document.querySelectorAll(".fTime .img")[1].style.opacity = 0;
    }
    // 请求数据
    that.getJson(1);
    // 矩阵
    that.matrix();
  },
  methods: {
    // 请求数据
    getJson(e) {
      var that = this;
      document.getElementById("bg").style.display = "block"; // 遮罩
      var data = {};
      data.where = 0;
      data.name = "中国";
      data.timx = that.checkTime4(
        new Date(new Date(that.json.timx).getTime() + 24 * 60 * 60 * 1000)
      );
      data.timz = that.checkTime4(
        new Date(new Date(that.json.timz).getTime() + 24 * 60 * 60 * 1000)
      );
      that.$store.dispatch("ndatapanel/QJson", "中国").then((dataz) => {
        that.boundary = dataz;
        that.$store.dispatch("sentiment/POTQuery", data).then((datas) => {
          datas = datas.dates;
          that.Journalism = {}; // 新闻数据集
          that.Journalisz = []; // 新闻数据集
          var TFeatures = []; // 地图点数据
          for (let i = 0; i < datas.length; i++) {
            // 微博滚动
            var gong = {};
            if (i % 2 === 0) {
              gong.bearing = Math.random() * 1 * 180;
            } else {
              gong.bearing = Math.random() * 1 * -180;
            }
            gong.center = [datas[i].x * 1, datas[i].y * 1];
            gong.zoom = 13 + Math.random() * 1 * 4;
            gong.pitch = Math.random() * 1 * 60;
            gong.id = "bian" + i; // 卡片ID
            gong.title = datas[i].title.slice(0, 14) + "..."; // 标题
            gong.summary = datas[i].summary; // 内容
            gong.time = that.checkTime2(new Date(datas[i].time)); // 时间
            gong.infoSource = datas[i].infoSource; // 来源
            that.Journalism["bian" + i] = gong; // 地图数据
            that.Journalisz.push(gong); // 滚动数据
            // 地图点
            var TGong = {
              type: "Feature",
              properties: {
                id: datas[i].id,
                time: datas[i].time,
              },
              geometry: {
                type: "Point",
                coordinates: JSON.parse(
                  "[" + datas[i].x + ", " + datas[i].y + "]"
                ),
              },
            };
            TFeatures.push(TGong);
          }
          var TDate = {
            type: "FeatureCollection",
            crs: {
              type: "name",
              properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
            },
            features: TFeatures,
          };
          if (e === 1) {
            that.creatmap(TDate);
          } else {
            that.map.getSource("earthquakes").setData(TDate);
          }
        });
        document.getElementById("bg").style.display = "none"; // 遮罩
      });
    },
    matrix() {
      var that = this;
      that.$store.dispatch("sentiment/MAtrix").then((datas) => {
        var data = [];
        var z = 0;
        var f = 0;
        var date = [];
        for (let i = 0; i < datas.length; i++) {
          // 矩阵
          var gong = {};
          gong.value = datas[i].value;
          gong.name = datas[i].name;
          // 颜色
          var colc = 0;
          for (let i = 0; i < 1; i++) {
            var ret = that.randomHsl();
            // 颜色相邻颜色差异须大于 0.25
            if (i > 0 && Math.abs(ret[0] - colc) < 0.25) {
              i--;
              continue; // 重新获取随机色
            }
            ret[1] = 0.7 + ret[1] * 0.2; // [0.7 - 0.9] 排除过灰颜色
            ret[2] = 0.4 + ret[2] * 0.4; // [0.4 - 0.8] 排除过亮过暗色
            // 数据转化到小数点后两位
            ret = ret.map(function (item) {
              return parseFloat(item.toFixed(2));
            });
            colc = ret;
          }
          // var zhong = that.hslToRgb(colc[0], colc[1], colc[2])
          // gong.itemStyle = { color: 'rgb(' + zhong[0] + ', ' + zhong[1] + ', ' + zhong[2] + ')' }
          data.push(gong);
          // 比例
          if (datas[i].emotion * 1 < 0) {
            f = f + datas[i].emotion * 1 * -1;
          } else {
            z = z + datas[i].emotion * 1;
          }
        }
        that.Matrix(data);
        var Zs = z + f;
        date[0] = ((z / Zs) * 100).toFixed(2) * 1;
        date[1] = ((f / Zs) * 100).toFixed(2) * 1;
        that.Proportion(date);
        // 来源
        that.Source();
        // 正面
        that.Positive();
        // 负面
        that.Negative();
        // 类别
        that.Hsearch();
      });
    },
    // 矩阵
    Matrix(data) {
      var that = this;
      that.myChart1 = echarts.init(document.getElementById("matrix"));
      const option = {
        // tooltip: {
        //   trigger: 'item',
        //   formatter: '{b}: {c}'
        // },
        series: [
          {
            type: "treemap",
            width: "100%",
            height: "100%",
            breadcrumb: {
              show: false,
            },
            label: {
              normal: {
                show: true,
                textStyle: {
                  color: "#fff",
                  fontSize: 16,
                },
              },
            },
            itemStyle: {
              normal: {
                show: true,
                borderWidth: 1,
                borderColor: "#fff",
              },
              emphasis: {
                label: {
                  show: true,
                },
              },
            },
            data: data,
          },
        ],
      };
      window.addEventListener("resize", function () {
        var chart = echarts.init(document.getElementById("matrix"));
        if (chart) {
          chart.resize(); // 不报错
        }
      });
      that.myChart1.setOption(option);
      // 点击事件
      that.myChart1.on("click", function (params) {});
    },
    // 正负比例
    Proportion(data) {
      var that = this;
      that.myChart2 = echarts.init(document.getElementById("proportion"));
      const option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} %",
          textStyle: {
            fontWeight: "bold",
            fontSize: 14,
            fontFamily: "KuHei",
          },
          confine: true,
        },
        legend: {
          top: "10%",
          left: "center",
          textStyle: {
            fontSize: 13,
            color: "rgba(243,243,243,.9)",
            fontFamily: "KuHei",
          },
          data: ["正向", "负向"],
        },
        series: [
          {
            name: "情感正负向",
            type: "pie",
            radius: ["40%", "70%"],
            center: ["50%", "60%"],
            avoidLabelOverlap: false,
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
            data: [
              {
                value: data[0],
                name: "正向",
                itemStyle: {
                  normal: {
                    color: "rgb(254, 122, 125)",
                  },
                },
              },
              {
                value: data[1],
                name: "负向",
                itemStyle: {
                  normal: {
                    color: "rgb(51, 175, 249)",
                  },
                },
              },
            ],
          },
        ],
      };
      window.addEventListener("resize", function () {
        var chart = echarts.init(document.getElementById("proportion"));
        if (chart) {
          chart.resize(); // 不报错
        }
      });
      that.myChart2.setOption(option);
      // 点击事件
      that.myChart2.on("click", function (params) {});
    },
    // 来源
    Source() {
      var that = this;
      that.$store.dispatch("sentiment/Source").then((datas) => {
        that.myChart3 = echarts.init(document.getElementById("source"));
        const option = {
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {d}%",
            textStyle: {
              fontWeight: "bold",
              fontSize: 14,
              fontFamily: "KuHei",
            },
            confine: true,
          },
          legend: {
            top: "0%",
            left: "center",
            textStyle: {
              fontSize: 13,
              color: "rgba(243,243,243,.9)",
              fontFamily: "KuHei",
            },
          },
          series: [
            {
              name: "来源占比",
              type: "pie", // 环形图的type和饼图相同
              center: ["50%", "60%"],
              radius: ["45%", "70%"], // 饼图的半径，第一个为内半径，第二个为外半径
              startAngle: 150, // 起始角度
              avoidLabelOverlap: false,
              color: ["#79addc", "#ffc09f", "#ffee93", "#fcf5c7", "#adf7b6"],
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
          var chart = echarts.init(document.getElementById("source"));
          if (chart) {
            chart.resize(); // 不报错
          }
        });
        that.myChart3.setOption(option);
        // 点击事件
        that.myChart3.on("click", function (params) {});
      });
    },
    // 正面
    Positive() {
      var that = this;
      that.myChart4 = echarts.init(document.getElementById("positive"));
      const option = {
        grid: {
          top: "5%", // 距上边距
          left: "20%", // 距离左边距
          right: "10%", // 距离右边距
          bottom: "10%", // 距离下边距
        },
        yAxis: {
          show: true, // 是否显示
          type: "",
          name: "",
          nameLocation: "end",
          nameTextStyle: {
            // 坐标轴名称样式
            color: "rgba(255, 255, 255, .8)",
            padding: [5, 0, 0, -5], // 坐标轴名称相对位置
          },
          axisLabel: {
            textStyle: {
              fontSize: 12,
              color: "rgba(255, 255, 255, .8)",
            },
          },
          data: [
            "钟南山...",
            "120W抗癌...",
            "300名学生...",
            "健康码统...",
            "新版核酸...",
          ],
        },
        xAxis: {
          show: true, // 是否显示
          name: "万",
          axisTick: {
            // 坐标轴 刻度
            show: true, // 是否显示
            inside: true, // 是否朝内
            lineStyle: {
              type: "solid",
            },
          },
          axisLabel: {
            textStyle: {
              fontSize: 12,
              color: "rgba(255, 255, 255, .8)",
            },
            // 坐标轴 标签
            show: true, // 是否显示
            inside: false, // 是否朝内
            margin: 8, // 刻度标签与轴线之间的距离
          },
          splitLine: {
            // grid 区域中的分隔线
            show: true, // 是否显示，'category'类目轴不显示，此时我的y轴为类目轴，splitLine属性是有意义的
            lineStyle: {
              color: "rgba(255, 255, 255, .8)",
              width: 1,
              type: "dashed", // 类型
            },
          },
        },
        // 内容数据
        series: [
          {
            name: "热搜", // 系列名称
            type: "bar", // 类型
            legendHoverLink: true, // 是否启用图例 hover 时的联动高亮
            label: {
              // 图形上的文本标签
              show: true,
              position: "inside", // 相对位置
              rotate: 0, // 旋转角度
              color: "#eee",
            },
            itemStyle: {
              // 图形形状
              color: "#480000",
              barBorderRadius: [0, 100, 100, 0], // 调整柱状图图形
            },
            barWidth: "20", // 柱形宽度
            barCategoryGap: "5%", // 柱形间距
            data: [25.09, 22.34, 17.05, 7.24, 4.57],
          },
        ],
      };
      window.addEventListener("resize", function () {
        var chart = echarts.init(document.getElementById("positive"));
        if (chart) {
          chart.resize(); // 不报错
        }
      });
      that.myChart4.setOption(option);
      // 点击事件
      that.myChart4.on("click", function (params) {});
    },
    // 负面
    Negative() {
      var that = this;
      that.myChart5 = echarts.init(document.getElementById("negative"));
      const option = {
        grid: {
          top: "5%", // 距上边距
          left: "20%", // 距离左边距
          right: "10%", // 距离右边距
          bottom: "10%", // 距离下边距
        },
        yAxis: {
          show: true, // 是否显示
          type: "",
          name: "",
          nameLocation: "end",
          nameTextStyle: {
            // 坐标轴名称样式
            color: "rgba(255, 255, 255, .8)",
            padding: [5, 0, 0, -5], // 坐标轴名称相对位置
          },
          axisLabel: {
            textStyle: {
              fontSize: 12,
              color: "rgba(255, 255, 255, .8)",
            },
          },
          data: [
            "新冠确诊...",
            "患者增加...",
            "疫情反弹...",
            "价格过高...",
            "变异毒株...",
          ],
        },
        xAxis: {
          show: true, // 是否显示
          name: "万",
          axisTick: {
            // 坐标轴 刻度
            show: true, // 是否显示
            inside: true, // 是否朝内
            lineStyle: {
              type: "solid",
            },
          },
          axisLabel: {
            textStyle: {
              fontSize: 12,
              color: "rgba(255, 255, 255, .8)",
            },
            // 坐标轴 标签
            show: true, // 是否显示
            inside: false, // 是否朝内
            margin: 8, // 刻度标签与轴线之间的距离
          },
          splitLine: {
            // grid 区域中的分隔线
            show: true, // 是否显示，'category'类目轴不显示，此时我的y轴为类目轴，splitLine属性是有意义的
            lineStyle: {
              color: "rgba(255, 255, 255, .8)",
              width: 1,
              type: "dashed", // 类型
            },
          },
        },
        // 内容数据
        series: [
          {
            name: "热搜", // 系列名称
            type: "bar", // 类型
            legendHoverLink: true, // 是否启用图例 hover 时的联动高亮
            label: {
              // 图形上的文本标签
              show: true,
              position: "inside", // 相对位置
              rotate: 0, // 旋转角度
              color: "#eee",
            },
            itemStyle: {
              // 图形形状
              color: "#0099CC",
              barBorderRadius: [0, 100, 100, 0], // 调整柱状图图形
            },
            barWidth: "20", // 柱形宽度
            barCategoryGap: "5%", // 柱形间距
            data: [15.95, 14.23, 13.86, 11.5, 8.2],
          },
        ],
      };
      window.addEventListener("resize", function () {
        var chart = echarts.init(document.getElementById("negative"));
        if (chart) {
          chart.resize(); // 不报错
        }
      });
      that.myChart5.setOption(option);
      // 点击事件
      that.myChart5.on("click", function (params) {});
    },
    // 热搜类别占比
    Hsearch() {
      var that = this;
      that.myChart6 = echarts.init(document.getElementById("hsearch"));
      const option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {d}%",
          textStyle: {
            fontWeight: "bold",
            fontSize: 14,
            fontFamily: "KuHei",
          },
          confine: true,
        },
        legend: {
          top: "0%",
          left: "center",
          textStyle: {
            fontSize: 13,
            color: "rgba(243,243,243,.9)",
            fontFamily: "KuHei",
          },
          data: [
            "国内新闻",
            "娱乐类",
            "生活类",
            "国内进度",
            "社会类",
            "国外进度",
            "病毒科谱",
          ],
        },
        series: [
          {
            name: "访问来源",
            type: "pie", // 环形图的type和饼图相同
            center: ["50%", "60%"],
            radius: ["5%", "60%"], // 饼图的半径，第一个为内半径，第二个为外半径
            avoidLabelOverlap: false,
            roseType: "area",
            color: [
              "#05668d",
              "#00a896",
              "#f0f3bd",
              "#90e0ef",
              "#ff9b85",
              "#02c39a",
              "#028090",
            ],
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
            data: [
              { value: 2497, name: "国内新闻" },
              { value: 1731, name: "娱乐类" },
              { value: 1449, name: "生活类" },
              { value: 955, name: "国内进度" },
              { value: 652, name: "社会类" },
              { value: 341, name: "国外进度" },
              { value: 220, name: "病毒科谱" },
            ],
          },
        ],
      };
      window.addEventListener("resize", function () {
        var chart = echarts.init(document.getElementById("hsearch"));
        if (chart) {
          chart.resize(); // 不报错
        }
      });
      that.myChart6.setOption(option);
      // 点击事件
      that.myChart6.on("click", function (params) {});
    },
    // 创建地图
    creatmap(TDate) {
      var that = this;
      mapboxgl.accessToken =
        "pk.eyJ1Ijoid3VqaW5odWkwIiwiYSI6ImNrdDFoZWphNDBhaGszMXBoazZ1dWdwMWkifQ.AX5nvyCpK8yKsCqyz36rsw"; // 你的accessToken
      that.map = new mapboxgl.Map({
        container: "EMap1", // 找盒子
        center: [107.01292828127248, 34.12077517311424], // 中心点
        zoom: 2.75, // 地图初始化时的层级
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
        }, // 底图样式
      });
      // 样式加载完成时
      that.map.on("style.load", function () {
        that.map.setLayoutProperty("country-label", "text-field", [
          "get",
          `name_zh-Hans`,
        ]);
      });
      // 动态点
      const size = 65;
      const pulsingDot = {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),
        // 当图层被添加到地图时
        // 获取地图画布的渲染上下文
        onAdd: function () {
          const canvas = document.createElement("canvas");
          canvas.width = this.width;
          canvas.height = this.height;
          this.context = canvas.getContext("2d");
        },
        // 调用动画
        render: function () {
          const duration = 1200;
          const t = (performance.now() % duration) / duration;
          const radius = (size / 2) * 0.4;
          const outerRadius = (size / 2) * 0.6 * t + radius;
          const context = this.context;
          // 外圆
          context.clearRect(0, 0, this.width, this.height);
          context.beginPath();
          context.arc(
            this.width / 2,
            this.height / 2,
            outerRadius,
            0,
            Math.PI * 2
          );
          context.fillStyle = `rgba(255, 121, 121, ${1 - t})`;
          context.fill();
          // 内圆
          context.beginPath();
          context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
          context.fillStyle = "rgba(76, 201, 240, 1)";
          context.strokeStyle = "white";
          context.lineWidth = 0.5 + 2.5 * (1 - t);
          context.fill();
          context.stroke();
          // Update this image's data with data from the canvas.
          this.data = context.getImageData(0, 0, this.width, this.height).data;
          return true;
        },
      };
      that.map.on("load", function () {
        that.map.addImage("pulsing-dot", pulsingDot, { pixelRatio: 2 });
        // 加载边界
        // that.bian(that.boundary)
        that.map.flyTo(that.Journalism["bian0"]);
        document.getElementById("bian0").setAttribute("class", "me");
        // 加载聚合数据
        that.map.addSource("earthquakes", {
          type: "geojson",
          data: TDate,
        });
        // 动态点
        that.map.addLayer({
          id: "unclustered-point",
          type: "symbol",
          source: "earthquakes",
          filter: ["!", ["has", "point_count"]],
          layout: {
            "icon-image": "pulsing-dot",
          },
        });
      });
      // 滚动切换
      document
        .getElementById("neirong")
        .addEventListener("scroll", function () {
          var chapterNames = Object.keys(that.Journalism); // 获取全部ID
          for (var i = 0; i < chapterNames.length; i++) {
            var chapterName = chapterNames[i];
            var element = document.getElementById(chapterName); // 获取元素
            var bounds = element.getBoundingClientRect(); // 获取元素视图位置
            if (bounds.top - 120 < 150 && bounds.bottom - 230 > 0) {
              if (chapterName === that.activeChapterName) return; // 名称相同不切换
              that.map.flyTo(that.Journalism[chapterName]);
              document.getElementById(chapterName).setAttribute("class", "me");
              document
                .getElementById(that.activeChapterName)
                .setAttribute("class", "");
              that.activeChapterName = chapterName;
              break;
            }
          }
        });
    },
    // 边界
    bian(dataz) {
      var that = this;
      for (let i = 0; i < dataz.json.features.length; i++) {
        // that.map.addLayer({
        //   'id': 'maine' + i,
        //   'type': 'fill',
        //   'source': {
        //     'type': 'geojson',
        //     'data': dataz.json.features[i].geometry
        //   },
        //   'layout': {},
        //   'paint': {
        //     'fill-color': '#088',
        //     'fill-opacity': 0.2
        //   }
        // })
      }
    },
    // 选择时间时触发
    STime() {
      if (this.json.name === "") {
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
        this.json.timx = this.checkTime5(new Date(this.timx));
        this.json.timz = this.checkTime5(
          new Date(new Date(this.timx).getTime() - 31 * 24 * 60 * 60 * 1000)
        );
        this.getJson(2);
      }
    },
    // 减少时间
    ReduceTime() {
      if (this.json.name === "") {
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
        this.json.timx = this.checkTime5(new Date(this.timx));
        this.json.timz = this.checkTime5(
          new Date(new Date(this.timx).getTime() - 31 * 24 * 60 * 60 * 1000)
        );
        this.getJson(2);
      }
    },
    // 增加时间
    IncreaseTime() {
      if (this.json.name === "") {
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
        this.json.timx = this.checkTime5(new Date(this.timx));
        this.json.timz = this.checkTime5(
          new Date(new Date(this.timx).getTime() - 31 * 24 * 60 * 60 * 1000)
        );
        this.getJson(2);
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
    // 随机颜色
    hslToRgb(H, S, L) {
      var R, G, B;
      if (+S === 0) {
        R = G = B = L; // 饱和度为0 为灰色
      } else {
        var hue2Rgb = function (p, q, t) {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        };
        var Q = L < 0.5 ? L * (1 + S) : L + S - L * S;
        var P = 2 * L - Q;
        R = hue2Rgb(P, Q, H + 1 / 3);
        G = hue2Rgb(P, Q, H);
        B = hue2Rgb(P, Q, H - 1 / 3);
      }
      return [Math.round(R * 255), Math.round(G * 255), Math.round(B * 255)];
    },
    // 获取随机HSL
    randomHsl() {
      var H = Math.random();
      var S = Math.random();
      var L = Math.random();
      return [H, S, L];
    },
  },
};
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
/* #marix {
  background: url("./public/img/bn.png") rgba(79, 133, 177, 0.3);
  background-size: 100% 100%;
} */

#sentiment {
  position: absolute;
  width: 100%;
  height: 100%;
  /* background: url("./public/img/back.png") no-repeat center center; */
}
#sentiment #left .left,
#sentiment #left .right,
#sentiment #center ul li,
#sentiment #right ul li
{
background: url("./public/img/bn.png") ;
/* rgba(79, 133, 177, 0.3) */
  background-size: 100% 100%;
}

#sentiment ul,
#sentiment p {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
#sentiment #EMap1 {
  position: fixed;
  width: 100%;
  height: 100%;
}
#sentiment .top {
  position: absolute;
  width: 100%;
  height: 35px;
  line-height: 35px;
  /* background: rgba(79, 119, 165, 0.5); */
  /* background: url("./public/img/bn.png") rgba(79, 133, 177, 0.3);
    background-size: 100% 100%; */
  z-index: 10;
  color: #fff;
  font-family: KuHei;
  font-size: 15px;
  font-weight: bolder;
  letter-spacing: 2px;
  text-align: center;
  top: 0;
}
#sentiment .bottom {
  position: absolute;
  width: 100%;
  height: 35px;
  line-height: 35px;
  background: rgba(18, 18, 18, 0.5);
  z-index: 10;
  color: #fff;
  font-family: KuHei;
  font-size: 15px;
  font-weight: bolder;
  letter-spacing: 2px;
  text-align: center;
  bottom: 0px;
}
/* 右侧 */
#sentiment #left {
  position: absolute;
  width: calc(100% - 355px);
  /* border: 1.5px solid #0fafeb; */
  background-color: rgba(40, 43, 57, 0.1);
  left: 45px;
  height: calc(45% + 35px);
  padding: 5px;
}
#sentiment #left .left {
  position: absolute;
  height: calc(100% - 10px);
  top: 5px;
  left: 5px;
  width: calc(100% - 315px);
  /* border: 1.5px solid #0fafeb; */
}
#sentiment #left .right {
  position: absolute;
  height: calc(100% - 10px);
  top: 5px;
  right: 5px;
  width: 300px;
  /* border: 1.5px solid #0fafeb; */
  /* background: url("./public/img/bg.png") rgba(79, 133, 177, 0.3); */
}
/* 中间 */
#sentiment #center {
  position: absolute;
  width: calc(100% - 355px);
  /* border: 1.5px solid #0fafeb; */
  /* background-color: rgba(40, 43, 57, 0.1); */
  height: calc(100% - 45% - 45px);
  bottom: 5px;
  left: 45px;
}
#sentiment #center li {
  display: inline-block;
  vertical-align: top;
  width: calc(100% / 3 - 6.67px);
  /* border: 1.5px solid #0fafeb; */
  /* background: url("./public/img/bg.png") rgba(79, 133, 177, 0.3); */
  position: absolute;
  top: 5px;
  height: calc(100% - 10px);
}
#sentiment #center li:nth-child(1) {
  left: 5px;
}
#sentiment #center li:nth-child(2) {
  left: 50%;
  transform: translateX(-50%);
}
#sentiment #center li:nth-child(2) >>> .el-carousel,
#sentiment #center li:nth-child(2) >>> .el-carousel__container {
  position: absolute;
  width: 100%;
  height: 100%;
}
#sentiment #center li:nth-child(2) >>> .el-carousel__indicators {
  top: 0px;
}
#sentiment #center li:nth-child(3) {
  right: 5px;
}
/* 左侧 */
#sentiment #right {
  position: absolute;
  bottom: 5px;
  right: 5px;
  z-index: 1;
  padding: 5px;
  background-color: rgba(40, 43, 57, 0.1);
  /* border: 1.5px solid #0fafeb; */
  width: 300px;
  height: calc(100% - 5px);
  color: #fff;
  font-family: KuHei;
  font-size: 14px;
  border-radius: 2px;
}
#sentiment #right .public {
  position: absolute;
  width: calc(100% - 10px);
  /* border: 1.5px solid #0fafeb; */
  /* background: url("./public/img/bg.png") rgba(79, 133, 177, 0.3); */
  height: 140px;
  text-align: center;
}
#sentiment #right .public p:nth-child(1) {
  letter-spacing: 5px;
  height: 35px;
  line-height: 35px;
  border-bottom: 2px dashed rgba(219, 219, 219, 0.555);
}
#sentiment #right .public p:nth-child(3) {
  position: absolute;
  width: 100%;
  left: 0;
  height: 45px;
  line-height: 45px;
  border-top: 2px dashed rgba(219, 219, 219, 0.555);
  bottom: 0;
}
/* 时间范围 */
#sentiment #right .public .fTime {
  position: absolute;
  left: 0;
  width: 285px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
}
#sentiment #right .public .fTime >>> .el-input__prefix,
#sentiment #right .public .fTime >>> .el-input__suffix {
  display: none;
}
#sentiment #right .public .fTime >>> .el-input__inner {
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
#sentiment #right .public .fTime >>> .el-date-editor.el-input,
#sentiment #right .public .fTime >>> .el-date-editor.el-input__inner {
  width: 140px;
}
#sentiment #right .public .fTime .img {
  margin: 0 15px;
  height: 45px;
  line-height: 45px;
  cursor: pointer;
  color: rgb(199, 199, 199);
  transition: all 0.5s;
}
#sentiment #right .public .fTime .img:hover {
  color: #fff;
}
/* 新闻 */
#sentiment #right .publiz {
  position: absolute;
  width: calc(100% - 10px);
  /* border: 1.5px solid #0fafeb; */
  /* background: url("./public/img/bg.png") rgba(79, 133, 177, 0.3); */
  height: calc(100% - 155px);
  text-align: center;
  top: 150px;
  color: rgba(204, 204, 204, 0.8);
}
#sentiment #right .me {
  color: #fff;
}
#sentiment #right .publiz #neirong {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: overlay;
}
#sentiment #right .publiz #neirong section {
  height: 220px;
  /* border: 1px solid rgba(255, 255, 255, 0.2); */
  margin: 5px;
  border-radius: 3px;
}
#sentiment #right .publiz #neirong h3 {
  margin: 0;
  padding: 0;
  font-size: 15px;
  letter-spacing: 1px;
  margin-top: 5px;
  height: 25px;
  line-height: 25px;
}
#sentiment #right .publiz #neirong p {
  margin: 0;
  padding: 0;
  font-size: 12px;
  margin-top: 5px;
  text-indent: 2em;
  height: 155px;
  overflow: hidden;
  text-align: left;
}
#sentiment #right .publiz #neirong .diceng {
  margin-top: 5px;
  height: 25px;
  line-height: 25px;
  position: relative;
}
#sentiment #right .publiz #neirong .diceng span:nth-child(1) {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  color: rgba(204, 204, 204, 0.8) !important;
}
#sentiment #right .publiz #neirong .diceng span:nth-child(2) {
  position: absolute;
  left: 5px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  color: rgba(204, 204, 204, 0.8) !important;
}
/* 修饰 */
/* #sentiment #left .left::after,
#sentiment #left .right::after,
#sentiment #right .public::after,
#sentiment #right .publiz::after {
  position: absolute;
  content: "";
  bottom: -2px;
  right: -2px;
  height: 10px;
  width: 10px;
  border-bottom: 2px solid #02a6b5;
  border-right: 2px solid #02a6b5;
  transition: all 1.5s;
  z-index: 0;
} */
/* #sentiment #left .left::before,
#sentiment #left .right::before,
#sentiment #right .public::before,
#sentiment #right .publiz::before {
  position: absolute;
  content: "";
  top: -2px;
  left: -2px;
  height: 10px;
  width: 10px;
  border-top: 2px solid #02a6b5;
  border-left: 2px solid #02a6b5;
  transition: all 1.5s;
  z-index: 0;
} */
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
