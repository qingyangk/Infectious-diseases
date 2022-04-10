<template>
  <div id="conditionx">
    <p id="biaoqian">条件查询</p>
    <div id="top">
      <ul>
        <li class="cpublic">
          <span style="font-size: 13px;color: rgb(200, 200, 200);">开始时间：</span>
          <p><el-date-picker v-model="timz" type="date" placeholder="选择开始日期" :picker-options="pickerOptions1" :editable="false" @change="z()" /></p>
        </li>
        <li class="cpublic">
          <span style="font-size: 13px;color: rgb(200, 200, 200);">结束时间：</span>
          <p><el-date-picker v-model="timx" type="date" placeholder="选择结束日期" :picker-options="pickerOptions2" :editable="false" @change="x()" /></p>
        </li>
        <li class="cpublic">
          <span style="font-size: 13px;color: rgb(200, 200, 200);">选择类型：</span>
          <p>
            <el-radio v-model="type" label="诊断">诊断</el-radio>
            <el-radio v-model="type" label="重症">重症</el-radio>
            <el-radio v-model="type" label="死亡">死亡</el-radio>
          </p>
        </li>
        <li class="cpublic">
          <div class="right">
            <el-select v-model="condition" placeholder="选择条件" :popper-append-to-body="false">
              <el-option v-for="item in conditions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
          <div class="left">
            <el-input v-model="QContent" placeholder="输入查询条件" clearable />
          </div>
        </li>
        <li class="cpublic" style="font-size: 13px;color: rgb(200, 200, 200);">
          <span v-if="json.name !== '' && illness !== '' && json.name !== '中国'">
            {{ json.name }} -- {{ illness }}
          </span>
          <p v-if="newTimz !== ''" style="margin: 5px 0;">
            时间：{{ newTimz }} 至 {{ newTimx }}
          </p>
          <span v-if="condition !== '' && type !== ''">
            {{ type }} -- {{ condition }}：{{ QContent }}
          </span>
        </li>
        <li class="cpublic" @click="find()">
          <p class="find"><i class="el-icon-search" /> 查询</p>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import eventBuq from '../public/js/EvebtBus'

export default {
  name: 'Conditionx',
  data() {
    return {
      illness: '',
      json: {
        table: '', // 表名
        name: '中国', // 地名
        where: 0 // 层级
      },
      pageNum: 1, // 页码
      pageSize: 500, // 条数
      FINDtype: 0, // 查询种类
      Condition: 0, // 模糊查询次数
      // 条件查询
      timz: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      timx: new Date(),
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
      // 条件下拉框
      condition: '',
      conditions: [
        {
          value: '性别',
          label: '性别'
        },
        {
          value: '年龄',
          label: '年龄'
        },
        {
          value: '联系电话',
          label: '联系电话'
        },
        {
          value: '人群分类',
          label: '人群分类'
        },
        {
          value: '单位类型',
          label: '单位类型'
        },
        {
          value: '实验室结果',
          label: '实验室结果'
        }
      ],
      type: '诊断',
      // 输入的查询内容
      QContent: '',
      newTimz: '',
      newTimx: ''
    }
  },
  beforeDestroy() {
    eventBuq.$off('type')
    eventBuq.$off('typc')
    eventBuq.$off('json')
    eventBuq.$off('pageNum')
    eventBuq.$off('pageSize')
    eventBuq.$off('FINDtype')
    eventBuq.$off('Condition')
  },
  mounted() {
    var that = this
    // 疾病名称
    eventBuq.$on('type', type => {
      that.json.table = type
      if (type === '陕西手足口点') {
        that.illness = '手足口病'
      } else {
        that.illness = type
      }
    })
    // 传播名称
    eventBuq.$on('typc', typc => {
      that.json.table = typc
      if (typc === '陕西手足口点') {
        that.illness = '手足口病'
      } else {
        that.illness = typc
      }
    })
    // 城市名称
    eventBuq.$on('json', json => {
      that.json.name = json.name
      that.json.where = json.where
    })
    // 页码
    eventBuq.$on('pageNum', pageNum => {
      that.pageNum = pageNum
      if (this.FINDtype === 2) {
        that.find()
      }
    })
    // 页条数
    eventBuq.$on('pageSize', pageSize => {
      that.pageSize = pageSize
      if (this.FINDtype === 2) {
        that.find()
      }
    })
    // 查询类别
    eventBuq.$on('FINDtype', FINDtype => {
      this.FINDtype = FINDtype
    })
    // 进入调用
    this.z()
    this.x()
    // 查询类型
    eventBuq.$on('Condition', Condition => {
      this.Condition = Condition
    })
  },
  methods: {
    // 开始时间
    z() {
      this.newTimz = this.checkTime2(this.timz)
    },
    // 结束时间
    x() {
      this.newTimx = this.checkTime2(this.timx)
    },
    // 查询
    find() {
      var that = this
      // 查询
      if (that.json.name === '' || that.json.name === '中国') {
        this.$message({
          message: '请选择城市！',
          type: 'warning',
          showClose: true
        })
      } else if (that.json.table === '') {
        this.$message({
          message: '请选择疾病！',
          type: 'warning',
          showClose: true
        })
      } else if (this.condition === '' || this.QContent === '') {
        this.$message({
          message: '请输入查询条件！',
          type: 'warning',
          showClose: true
        })
      } else {
        // 更改查询种类 1条件查询
        this.FINDtype = 2
        eventBuq.$emit('FINDtype', this.FINDtype)
        eventBuq.$emit('FuzzyQuery', 0)
        that.Condition++
        var data = {}
        data.timz = that.checkTime3(new Date(that.newTimz)) // 开始时间
        data.timx = that.checkTime3(new Date(that.newTimx)) // 结束时间
        // 判断是否是同一天
        if (new Date(data.timz).getTime() === new Date(data.timx).getTime()) {
          data.timx = that.checkTime3(new Date(new Date(data.timx).getTime() + 24 * 60 * 60 * 1000))
        }
        data.type = that.type // 类型
        data.condition = that.condition // 类型
        data.QContent = that.QContent // 条件
        data.where = that.json.where // 层级
        data.name = that.json.name // 地名
        data.table = that.json.table // 表名
        data.pageNum = that.pageNum // 页码
        data.pageSize = that.pageSize // 条数
        eventBuq.$emit('Tiao', data) // 将条件传回首页
        that.$store.dispatch('query/QSCQuery', data).then((datas) => {
          var dataz = {}
          dataz.length = datas.length[0].length
          dataz.dates = datas.dates
          eventBuq.$emit('datas', dataz)
        })
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
      return i.getFullYear() + '-' + that.checkTime(i.getMonth() + 1) + '-' + that.checkTime(i.getDate())
    },
    // 时间处理2
    checkTime3(i) {
      var that = this
      return i.getFullYear() + '-' + that.checkTime(i.getMonth() + 1) + '-' + that.checkTime(i.getDate()) + ' ' + '00' + ':' + '00'
    }
  }
}
</script>
<style scoped>
@font-face {
  src: url("../public/font/KuHei.ttf");
  font-family: "KuHei";
}
#conditionx {
  position: absolute;
  height: calc(100% - 10px);
  width: calc(100% - 10px);
  top: 5px;
  left: 5px;
}
#conditionx p {
  margin: 0;
  padding: 0;
}
#conditionx #biaoqian {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 2px solid rgba(219, 219, 219, 0.555);
}
#conditionx #top {
  position: absolute;
  top: 30px;
  left: 0;
  height: calc(100% - 30px);
  width: 100%;
}
#conditionx ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
#conditionx ul .cpublic {
  position: absolute;
  height: calc(100% / 5);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
#conditionx ul .cpublic:nth-child(1) {
  top: 0;
  height: 14%;
}
#conditionx ul .cpublic:nth-child(2) {
  top: 14%;
  height: 14%;
}
#conditionx ul .cpublic:nth-child(3) {
  top: 28%;
  height: 14%;
}
#conditionx ul .cpublic:nth-child(4) {
  top: 42%;
  border-bottom: 2px dashed rgba(219, 219, 219, 0.555);
}
#conditionx ul .cpublic:nth-child(5) {
  top: 62%;
  height: 28%;
  border-bottom: 2px dashed rgba(219, 219, 219, 0.555);
}
#conditionx ul .cpublic:nth-child(6) {
  top: 90%;
  height: 10%;
}
#conditionx ul .cpublic:nth-child(1) >>> .el-input__inner,
#conditionx ul .cpublic:nth-child(2) >>> .el-input__inner {
  background-color: rgba(255, 255, 255, 0);
  border: none;
  text-align: center;
  font-family: KuHei;
  color: #fff;
  border-radius: 0;
  border-bottom: 2px solid rgba(219, 219, 219, 0.555);
  width: 190px;
  margin: 0 5px;
}
#conditionx ul .cpublic:nth-child(1) >>> .el-input__prefix,
#conditionx ul .cpublic:nth-child(2) >>> .el-input__prefix,
#conditionx ul .cpublic:nth-child(1) >>> .el-input__suffix,
#conditionx ul .cpublic:nth-child(2) >>> .el-input__suffix {
  display: none;
}
#conditionx ul .cpublic:nth-child(1) span,
#conditionx ul .cpublic:nth-child(2) span,
#conditionx ul .cpublic:nth-child(3) span {
  width: 140px;
  position: absolute;
  left: 5px;
  display: flex;
  justify-content: center;
}
#conditionx ul .cpublic:nth-child(1) p,
#conditionx ul .cpublic:nth-child(2) p,
#conditionx ul .cpublic:nth-child(3) p {
  position: absolute;
  right: 20px;
  width: 190px;
}
#conditionx ul .cpublic:nth-child(3) >>> .el-radio {
  color: #fff;
  margin-right: 10px !important;
}
#conditionx ul .cpublic:nth-child(3) >>> .el-radio__inner::after {
  left: 54.2%;
  top: 53.3%;
}
#conditionx ul .cpublic:nth-child(3) >>> .el-radio__input.is-checked+.el-radio__label {
  color: #ff7979;
}
#conditionx ul .cpublic:nth-child(3) >>> .el-radio__input.is-checked .el-radio__inner {
  border-color: #ff7979;
  background: #ff7979;
}
#conditionx ul .cpublic:nth-child(4) >>> .el-input__suffix {
  display: block;
}
#conditionx ul .cpublic:nth-child(4) >>> .el-input__inner {
  background-color: rgba(255, 255, 255, 0);
  text-align: center;
  border: none;
  font-family: KuHei;
  color: #fff;
}
#conditionx ul .cpublic:nth-child(4) .right {
  width: 140px;
  position: absolute;
  left: 5px;
}
#conditionx ul .cpublic:nth-child(4) .right >>> .el-input__inner {
  border: 1px solid rgba(230, 230, 230, 0.6);
}
#conditionx ul .cpublic:nth-child(4) .right >>> .el-popper {
  left: 0px !important;
  top: -185px !important;
}
#conditionx ul .cpublic:nth-child(4) .right >>> .el-select .el-input.is-focus .el-input__inner {
  border: 1px solid rgba(255, 255, 255, 0.8);
}
#conditionx ul .cpublic:nth-child(4) .right >>> .el-select-dropdown {
  background-color: rgba(79, 133, 177, 0.3);
}
#conditionx ul .cpublic:nth-child(4) .right >>> .el-select-dropdown__wrap,
#conditionx ul .cpublic:nth-child(4) .right >>> .el-scrollbar {
  height: 165px !important;
  max-height: 165px !important;
}
#conditionx ul .cpublic:nth-child(4) .right >>> .el-select-dropdown__item {
  text-align: center;
  color: #fff;
}
#conditionx ul .cpublic:nth-child(4) .right >>> .el-select-dropdown__item.hover,
#conditionx ul .cpublic:nth-child(4) .right >>> .el-select-dropdown__item:hover {
  background-color: rgb(31, 33, 44);
}
#conditionx ul .cpublic:nth-child(4) .right >>> .popper__arrow {
  border: none;
}
#conditionx ul .cpublic:nth-child(4) .right >>> .popper__arrow::after {
  content: none;
}
#conditionx ul .cpublic:nth-child(4) .left {
  width: 190px;
  position: absolute;
  right: 20px;
}
#conditionx ul .cpublic:nth-child(4) .left >>> .el-input__inner {
  background-color: rgba(255, 255, 255, 0);
  border: none;
  text-align: center;
  font-family: KuHei;
  color: #fff;
  border-radius: 0;
  border-bottom: 2px solid rgba(219, 219, 219, 0.555);
  width: 190px;
  margin: 0 5px;
  padding: 0 30px;
}
#conditionx ul .cpublic:nth-child(5) {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center
}
#conditionx ul .cpublic:nth-child(6) {
  transition: all 0.5s;
  cursor: pointer;
  font-weight: bold;
  color: rgb(233, 233, 233);
  margin-top: 5px;
}
/* #conditionx ul .cpublic:nth-child(6):hover {
  color: rgb(233, 233, 233);
} */
</style>
