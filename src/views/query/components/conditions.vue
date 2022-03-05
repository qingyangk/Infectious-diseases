<template>
  <div class="conditions">
    <ul>
      <li class="cpublic">
        <div class="cpubliz">
          <el-row :gutter="5">
            <el-col :span="5">
              <p style="font-weight: bold;">简单查询：</p>
            </el-col>
            <el-col :span="14">
              <el-input v-model="vague" placeholder="请输入查询内容" clearable />
            </el-col>
            <el-col :span="5">
              <p class="find" @click="find()"><i class="el-icon-search" /> 查询</p>
            </el-col>
          </el-row>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import eventBuq from '../public/js/EvebtBus'

export default {
  name: 'Conditions',
  data() {
    return {
      json: {
        table: '', // 表名
        name: '', // 地名
        where: 0 // 层级
      },
      vague: '', // 模糊查询
      pageNum: 1, // 页码
      pageSize: 500, // 条数
      FINDtype: 0, // 查询种类
      FuzzyQuery: 0, // 模糊查询次数
      // 条件查询
      staTime: '',
      endTime: ''
    }
  },
  beforeDestroy() {
    eventBuq.$off('type')
    eventBuq.$off('typc')
    eventBuq.$off('json')
    eventBuq.$off('pageNum')
    eventBuq.$off('pageSize')
    eventBuq.$off('FINDtype')
    eventBuq.$off('FuzzyQuery')
  },
  mounted() {
    var that = this
    // 疾病名称
    eventBuq.$on('type', type => {
      that.json.table = type
    })
    // 传播名称
    eventBuq.$on('typc', typc => {
      that.json.table = typc
    })
    // 城市名称
    eventBuq.$on('json', json => {
      that.json.name = json.name
      that.json.where = json.where
    })
    // 页码
    eventBuq.$on('pageNum', pageNum => {
      that.pageNum = pageNum
      if (this.FINDtype === 1) {
        that.find()
      }
    })
    // 页条数
    eventBuq.$on('pageSize', pageSize => {
      that.pageSize = pageSize
      if (this.FINDtype === 1) {
        that.find()
      }
    })
    // 查询类别
    eventBuq.$on('FINDtype', FINDtype => {
      this.FINDtype = FINDtype
    })
    // 查询类型
    eventBuq.$on('FuzzyQuery', FuzzyQuery => {
      this.FuzzyQuery = FuzzyQuery
    })
  },
  methods: {
    // 查询
    find() {
      var that = this
      // 查询
      if (that.json.name === '') {
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
      } else if (that.vague === '') {
        this.$message({
          message: '请输入查询条件！',
          type: 'warning',
          showClose: true
        })
      }
      if (that.json.table !== '' && that.json.name !== '' && that.vague !== '') {
        // 更改查询种类 1模糊查询
        this.FINDtype = 1
        eventBuq.$emit('FINDtype', this.FINDtype)
        eventBuq.$emit('Condition', 0)
        that.FuzzyQuery++
        // 赋值
        var data = {}
        data.table = that.json.table
        data.name = that.json.name
        data.where = that.json.where
        data.vague = that.vague
        data.pageNum = that.pageNum
        data.pageSize = that.pageSize
        eventBuq.$emit('Tiao', data) // 将条件传回首页
        that.$store.dispatch('query/QSFQuery', data).then((datas) => {
          var dataz = {}
          dataz.length = datas.length[0].length
          dataz.dates = datas.dates
          eventBuq.$emit('datas', dataz)
        })
      }
    }
  }
}
</script>
<style scoped>
.conditions {
  position: absolute;
  width: 100%;
  height: 100%;
  text-align: center;
}
.conditions p {
  padding: 0;
  margin: 0;
}
.conditions ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
.conditions ul .cpublic {
  position: absolute;
  width: 100%;
  top: 5px;
  height: calc(100% - 10px);
  color: rgb(200, 200, 200);
}
.conditions ul .cpubliz {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 50%;
  transform: translate(0, -50%);
  z-index: 10;
  justify-content: center;
  align-items: center;
  display: flex;
}
/* 模糊查询 */
.conditions .find {
  transition: all 0.5s;
  cursor: pointer;
  font-weight: bold;
}
.conditions .find:hover {
  color: rgb(233, 233, 233);
}
</style>
<style scoped>
@font-face {
  src: url("../public/font/KuHei.ttf");
  font-family: "KuHei";
}
/* 模糊查询 */
.conditions ul .cpubliz >>> .el-row {
  position: absolute;
  height: calc(100% - 30px);
  width: 100%;
}
.conditions ul .cpubliz >>> .el-col {
  height: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
  vertical-align: top;
}
.conditions >>> .el-input {
  border-bottom: 2px solid rgba(219, 219, 219, 0.555);
  padding: 0 5px;
  height: 40px;
}
.conditions >>> .el-input__inner {
  background-color: #fff0;
  border: none !important;
  font-family: KuHei;
  color: #fff;
  margin: 0;
  padding: 0;
  padding: 0 25px;
  text-align: center;
}
</style>
