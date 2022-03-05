<template>
  <div class="detailed">
    <ul>
      <!-- 左 -->
      <li class="top public">
        <ul>
          <!-- 左上 -->
          <li class="public publiz" style="z-index: 13">
            <qXGDetection />
          </li>
          <!-- 左中 -->
          <li class="public">
            <ul>
              <!-- 左中左 -->
              <li class="public publiz" style="z-index: 12">
                <qXQuarter />
              </li>
              <!-- 左中右 -->
              <li class="public publiz" style="z-index: 11">
                <qXMonth />
              </li>
            </ul>
          </li>
          <!-- 左下 -->
          <li class="public publiz">
            <qXYStatistics />
          </li>
        </ul>
      </li>
      <!-- 中 -->
      <li class="center public">
        <ul>
          <!-- 中上 -->
          <li class="public publiz">
            <dmap />
          </li>
          <!-- 中下 -->
          <li class="public publiz">
            <qXTInterval />
          </li>
        </ul>
      </li>
      <!-- 右 -->
      <li class="botton public">
        <ul>
          <!-- 右上 -->
          <li class="public">
            <ul>
              <!-- 右上左 -->
              <li class="public publiz">
                <el-carousel ref="c1" :autoplay="false" arrow="never" @change="xuan($event)">
                  <el-carousel-item v-for="item in 3" :key="item">
                    <div v-if="item == 1">
                      <qXQVType />
                    </div>
                    <div v-if="item == 2">
                      <qXQCrowd />
                    </div>
                    <div v-if="item == 3">
                      <qXQAGroup />
                    </div>
                  </el-carousel-item>
                </el-carousel>
              </li>
              <!-- 右上右 -->
              <li class="public publiz">
                <el-carousel ref="c2" :autoplay="false" arrow="never" @change="xuan($event)">
                  <el-carousel-item v-for="item in 3" :key="item">
                    <div v-if="item == 1">
                      <qXSVType />
                    </div>
                    <div v-if="item == 2">
                      <qXSCrowd />
                    </div>
                    <div v-if="item == 3">
                      <qXSAGroup />
                    </div>
                  </el-carousel-item>
                </el-carousel>
              </li>
            </ul>
          </li>
          <!-- 右中 -->
          <li class="public">
            <ul>
              <!-- 右中左 -->
              <li class="public publiz">
                <qXARegion />
              </li>
              <!-- 右中右 -->
              <li class="public publiz">
                <el-carousel ref="c3" :autoplay="false" arrow="never" @change="xuan($event)">
                  <el-carousel-item v-for="item in 3" :key="item">
                    <div v-if="item == 1">
                      <qXDVType />
                    </div>
                    <div v-if="item == 2">
                      <qXDCrowd />
                    </div>
                    <div v-if="item == 3">
                      <qXDAGroup />
                    </div>
                  </el-carousel-item>
                </el-carousel>
              </li>
            </ul>
          </li>
          <!-- 右下 -->
          <li class="public publiz">
            <qAStatistics />
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
<script>
import QXGDetection from './components/QXGDetection' // 左上-全局检测
import QXQuarter from './components/QXQuarter' // 左中左-季节统计
import QXMonth from './components/QXMonth' // 左中右-月份统计
import QXYStatistics from './components/QXYStatistics' // 左下-年份统计
import Dmap from './components/dmap' // 中上-地图
import QXTInterval from './components/QXTInterval' // 中下-年份统计
import QXQVType from './components/QXQVType' // 右上左左-死亡病毒类型
import QXQCrowd from './components/QXQCrowd' // 右上左中-死亡人群分布
import QXQAGroup from './components/QXQAGroup' // 右上左右-死亡年龄组
import QXSVType from './components/QXSVType' // 右上右左-重症病毒类型
import QXSCrowd from './components/QXSCrowd' // 右上右中-重症人群分布
import QXSAGroup from './components/QXSAGroup' // 右上右右-重症年龄组
import QXARegion from './components/QXARegion' // 右中左-行政区统计
import QXDVType from './components/QXDVType' // 右中右左-诊断病毒类型
import QXDCrowd from './components/QXDCrowd' // 右中右中-诊断人群分布
import QXDAGroup from './components/QXDAGroup' // 右中右右-诊断年龄组
import QAStatistics from './components/QAStatistics' // 右下-年龄统计

export default {
  name: 'Detailed',
  components: {
    QXGDetection,
    QXQuarter,
    QXMonth,
    QXYStatistics,
    Dmap,
    QXTInterval,
    QXQVType,
    QXQCrowd,
    QXQAGroup,
    QXSVType,
    QXSCrowd,
    QXSAGroup,
    QXARegion,
    QXDVType,
    QXDCrowd,
    QXDAGroup,
    QAStatistics
  },
  data() {
    return {
      data: {
        name: '', // 地名
        type: '', // 疾病名称
        table: '', // 数据库名称
        where: 0 // 范围层级
      }
    }
  },
  mounted() {
    var that = this
    that.data.type = that.$route.query.type
    that.data.table = that.$route.query.table
    that.data.where = that.$route.query.where
    if (that.data.type === undefined) {
      this.$router.push('/')
    }
  },
  methods: {
    xuan(e) {
      this.$refs.c1.setActiveItem(e)
      this.$refs.c2.setActiveItem(e)
      this.$refs.c3.setActiveItem(e)
    }
  }
}
</script>
<style scoped>
@import './public/css/index.css';
.detailed >>> .el-carousel {
  height: 100%;
}
.detailed >>> .el-carousel__container {
  height: 100%;
}
</style>
