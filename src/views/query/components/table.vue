<template>
  <div id="table">
    <!-- 工具 -->
    <div class="highest">
      <!-- 伸缩 -->
      <div class="sheng" @click="iocs(ioc.name)">
        <span><i :class="ioc.ioc" /> {{ ioc.name }}</span>
      </div>
      <div class="tubiao" @click="tubiao">
        <el-button>生成图表</el-button>
      </div>
      <!-- 导出 -->
      <div class="daochu">
        <span @click="exports('导出选中')">导出选中</span>
        <span @click="exports('导出本页')">导出本页</span>
      </div>
    </div>
    <div id="tabletop" class="top">
      <!-- 表对应属性：ref 最大高度 高度 开启虚拟滚动 表内容过长省略号 表头过长省略号 边框 斑马线 监听父元素 保持原始数据状态 编辑 -->
      <!-- 头对应属性：fixed:悬浮 resizable:可拖拽宽度 field:props title:名称  show-overflow-tooltip:过长隐藏时显示悬浮 -->
      <ux-grid
        ref="dates"
        :max-height="height"
        :height="height"
        use-virtual
        show-body-overflow="title"
        show-header-overflow="title"
        :width-resize="true"
        keep-source
        :edit-config="{trigger: 'click', mode: 'row'}"
        @selection-change="selectionChange"
      >
        <!-- 选中 -->
        <!-- <ux-table-column type="checkbox" width="60" align="center" /> -->
        <!-- 索引 -->
        <!-- <ux-table-column resizable type="index" width="100" align="center" /> -->
        <!-- 卡片编号 -->
        <ux-table-column resizable field="卡片编号" width="220" align="center" edit-render show-overflow="tooltip">
          <template v-slot:header>
            <span><icon-svg icon-class="icon-qiapian" /> 卡片编号</span>
          </template>
          <template v-slot:edit="scope">
            <el-input v-model="scope.row.卡片编号" />
          </template>
        </ux-table-column>
        <!-- 性别 -->
        <ux-table-column resizable field="性别" width="100" align="center" edit-render show-overflow="tooltip">
          <template v-slot:header>
            <span><icon-svg icon-class="icon-xingbienannv" /> 性别</span>
          </template>
          <template v-slot:edit="scope">
            <el-select v-model="scope.row.性别" @change="$refs.dates.updateStatus(scope)">
              <el-option v-for="item in sexList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </template>
        </ux-table-column>
        <!-- 年龄 -->
        <ux-table-column resizable field="年龄" title="年龄" width="80" align="center" edit-render show-overflow="tooltip">
          <template v-slot:header>
            <span><icon-svg icon-class="icon-nianling" /> 年龄</span>
          </template>
          <template v-slot:edit="scope">
            <el-input v-model="scope.row.年龄" />
          </template>
        </ux-table-column>
        <!-- 联系电话 -->
        <ux-table-column resizable field="联系电话" width="150" align="center" edit-render show-overflow="tooltip">
          <template v-slot:header>
            <span><icon-svg icon-class="icon-lianxidianhua" /> 联系电话</span>
          </template>
          <template v-slot:edit="scope">
            <el-input v-model="scope.row.联系电话" />
          </template>
        </ux-table-column>
        <!-- 出生日期 -->
        <ux-table-column resizable field="出生日期" width="130" align="center" edit-render show-overflow="tooltip">
          <template v-slot:header>
            <span><icon-svg icon-class="icon-riqi" /> 出生日期</span>
          </template>
          <template v-slot:edit="scope">
            <el-input v-model="scope.row.出生日期" />
          </template>
        </ux-table-column>
        <!-- 发病日期 -->
        <ux-table-column resizable field="发病日期" width="130" align="center" edit-render show-overflow="tooltip">
          <template v-slot:header>
            <span><icon-svg icon-class="icon-riqi" /> 发病日期</span>
          </template>
          <template v-slot:edit="scope">
            <el-input v-model="scope.row.发病日期" />
          </template>
        </ux-table-column>
        <!-- 诊断日期 -->
        <ux-table-column resizable field="诊断时间" width="130" align="center" edit-render show-overflow="tooltip">
          <template v-slot:header>
            <span><icon-svg icon-class="icon-riqi" /> 诊断日期</span>
          </template>
          <template v-slot:edit="scope">
            <el-input v-model="scope.row.诊断时间" />
          </template>
        </ux-table-column>
        <!-- 死亡日期 -->
        <ux-table-column resizable field="死亡日期" width="110" align="center" edit-render show-overflow="tooltip">
          <template v-slot:header>
            <span><icon-svg icon-class="icon-riqi" /> 死亡日期</span>
          </template>
          <template v-slot:edit="scope">
            <el-input v-model="scope.row.死亡日期" />
          </template>
        </ux-table-column>
        <!-- 重症患者 -->
        <ux-table-column resizable field="重症患者" width="110" align="center" edit-render show-overflow="tooltip">
          <template v-slot:header>
            <span><icon-svg icon-class="icon-zhongzhengjianhushi" /> 重症患者</span>
          </template>
          <template v-slot:edit="scope">
            <el-input v-model="scope.row.重症患者" />
          </template>
        </ux-table-column>
        <!-- 实验室结果 -->
        <ux-table-column resizable field="实验室结果" width="110" align="center" edit-render show-overflow="tooltip">
          <template v-slot:header>
            <span><icon-svg icon-class="icon-shiyanshianquan" /> 实验室结果</span>
          </template>
          <template v-slot:edit="scope">
            <el-input v-model="scope.row.实验室结果" />
          </template>
        </ux-table-column>
        <!-- 患者工作单位 -->
        <ux-table-column resizable field="患者工作单位" width="180" align="center" edit-render show-overflow="tooltip">
          <template v-slot:header>
            <span><icon-svg icon-class="icon-danweiguanli" /> 患者工作单位</span>
          </template>
          <template v-slot:edit="scope">
            <el-input v-model="scope.row.患者工作单位" />
          </template>
        </ux-table-column>
        <!-- 现住地址属于 -->
        <ux-table-column resizable field="病人属于" width="140" align="center" edit-render show-overflow="tooltip">
          <template v-slot:header>
            <span><icon-svg icon-class="icon-fenlei" /> 现住地址属于</span>
          </template>
          <template v-slot:edit="scope">
            <el-input v-model="scope.row.病人属于" />
          </template>
        </ux-table-column>
        <!-- 现住详细地址 -->
        <ux-table-column resizable field="现住详细地址" width="180" align="center" edit-render show-overflow="tooltip">
          <template v-slot:header>
            <span><icon-svg icon-class="icon-dizhi" /> 现住详细地址</span>
          </template>
          <template v-slot:edit="scope">
            <el-input v-model="scope.row.现住详细地址" />
          </template>
        </ux-table-column>
        <!-- 现住地址国标 -->
        <ux-table-column resizable field="现住地址国标" width="180" align="center" edit-render show-overflow="tooltip">
          <template v-slot:header>
            <span><icon-svg icon-class="icon-dizhi" /> 现住地址国标</span>
          </template>
          <template v-slot:edit="scope">
            <el-input v-model="scope.row.现住地址国标" />
          </template>
        </ux-table-column>
        <!-- 人群分类 -->
        <ux-table-column resizable field="人群分类" width="110" align="center" edit-render show-overflow="tooltip">
          <template v-slot:header>
            <span><icon-svg icon-class="icon-fenlei" /> 人群分类</span>
          </template>
          <template v-slot:edit="scope">
            <el-input v-model="scope.row.人群分类" />
          </template>
        </ux-table-column>
        <!-- 病例分类 -->
        <ux-table-column resizable field="病例分类" width="150" align="center" edit-render show-overflow="tooltip">
          <template v-slot:header>
            <span><icon-svg icon-class="icon-shebeimingcheng" /> 病例分类</span>
          </template>
          <template v-slot:edit="scope">
            <el-input v-model="scope.row.病例分类" />
          </template>
        </ux-table-column>
        <!-- 疾病名称 -->
        <ux-table-column resizable field="疾病名称" width="110" align="center" edit-render show-overflow="tooltip">
          <template v-slot:header>
            <span><icon-svg icon-class="icon-bingli" /> 疾病名称</span>
          </template>
          <template v-slot:edit="scope">
            <el-input v-model="scope.row.疾病名称" />
          </template>
        </ux-table-column>
        <!-- 报告单位 -->
        <ux-table-column resizable field="报告单位" width="120" align="center" edit-render show-overflow="tooltip">
          <template v-slot:header>
            <span><icon-svg icon-class="icon-danweiguanli" /> 报告单位</span>
          </template>
          <template v-slot:edit="scope">
            <el-input v-model="scope.row.报告单位" />
          </template>
        </ux-table-column>
        <!-- 单位类型 -->
        <ux-table-column resizable field="单位类型" width="110" align="center" edit-render show-overflow="tooltip">
          <template v-slot:header>
            <span><icon-svg icon-class="icon-danweiguanli" /> 单位类型</span>
          </template>
          <template v-slot:edit="scope">
            <el-input v-model="scope.row.单位类型" />
          </template>
        </ux-table-column>
        <!-- 备注 -->
        <ux-table-column resizable field="备注" width="180" align="center" edit-render show-overflow="tooltip">
          <template v-slot:header>
            <span><icon-svg icon-class="icon-danweiguanli" /> 备注</span>
          </template>
          <template v-slot:edit="scope">
            <el-input v-model="scope.row.备注" />
          </template>
        </ux-table-column>
        <!-- 编辑 -->
        <ux-table-column :resizable="false" show-overflow-tooltip width="180" align="center">
          <template v-slot:header>
            <span><icon-svg icon-class="icon-bianji1" /> 操作</span>
          </template>
          <template v-slot="{ row }">
            <!--判断行是否激活了, 编辑按钮执行的方式就是为了去激活-->
            <template v-if="$refs.dates.isActiveByRow(row)">
              <el-button-group>
                <el-button type="primary" plain size="mini" icon="el-icon-check" @click="saveEvent(row)">保存</el-button>
                <el-button type="info" plain size="mini" @click="cancelRowEvent(row)">取消<i class="el-icon-close" /></el-button>
              </el-button-group>
            </template>
            <template v-else>
              <!-- <el-button-group> -->
              <!-- <el-button type="primary" plain size="mini" icon="el-icon-edit" @click="edit(row)">编辑</el-button> -->
              <el-button type="danger" plain size="mini" @click="deletes(row)">删除<i class="el-icon-delete" /></el-button>
              <!-- </el-button-group> -->
            </template>
          </template>
        </ux-table-column>
      </ux-grid>
    </div>
    <div class="bottom">
      <!-- 分页 -->
      <el-pagination
        :current-page="page"
        :page-sizes="[250, 500, 750]"
        :page-size="size"
        :pager-count="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="number"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 加载动画 -->
    <div class="zhezhao">
      <div id="bars1">
        <span /><span /><span /><span /><span />
      </div>
    </div>
  </div>
</template>
<script>
import eventBuq from '../public/js/EvebtBus'
import ExportJsonExcel from 'js-export-excel'

export default {
  name: 'Table',
  data() {
    return {
      sexList: [
        { value: '男', label: '男' },
        { value: '女', label: '女' }
      ],
      size: 500, // 展示多少条
      number: 0, // 总条数
      page: 1,
      ioc: {
        ioc: 'el-icon-upload2',
        name: '展开'
      },
      height: 150,
      // 定时器
      times: null,
      // 数据
      datas: [], // 全部数据
      data: [] // 选中数据
    }
  },
  beforeDestroy() {
    eventBuq.$off('datas')
    eventBuq.$off('FINDtype')
    eventBuq.$off('true')
  },
  mounted() {
    var that = this
    // 查询信息
    eventBuq.$on('datas', datas => {
      // console.log(datas)
      that.dates = datas.dates
      that.number = datas.length
      for (let i = 0; i < that.dates.length; i++) {
      // 出生日期
        that.dates[i].出生日期 = that.checkTime2(new Date(that.dates[i].出生日期))
        // 发病日期
        that.dates[i].发病日期 = that.checkTime2(new Date(that.dates[i].发病日期))
        // 诊断日期
        that.dates[i].诊断时间 = that.checkTime2(new Date(that.dates[i].诊断时间))
        // 死亡日期
        if (that.dates[i].死亡日期 === '.') {
          that.dates[i].死亡日期 = '无'
        } else {
          that.dates[i].死亡日期 = that.checkTime2(new Date(that.dates[i].死亡日期))
        }
        // 实验室结果
        if (that.dates[i].实验室结果 === null) {
          that.dates[i].实验室结果 = '无'
        }
        // 患者工作单位
        if (that.dates[i].患者工作单位 === null) {
          that.dates[i].患者工作单位 = '无'
        }
        // 病人属于
        if (that.dates[i].病人属于 === null) {
          that.dates[i].病人属于 = '无'
        }
        // 现住地址国标
        that.dates[i].现住地址国标 = parseInt(that.dates[i].现住地址国标)
        // 备注
        if (that.dates[i].备注 === null) {
          that.dates[i].备注 = '无'
        }
      }
      that.datas = that.dates // 赋值
      eventBuq.$emit('mapdata', that.datas) // 赋值长度
      eventBuq.$emit('echartsLength', that.number) // 赋值长度
      that.$refs.dates.reloadData(that.dates) // 给表赋值
      document.querySelector('.zhezhao').style.display = 'none'
    })
    // 加载动画
    eventBuq.$on('FINDtype', FINDtype => {
      document.querySelector('.zhezhao').style.display = 'block'
    })
    // 生成图表
    eventBuq.$on('true', e => {
      if (e === '是') {
        document.querySelector('.tubiao').style.display = 'block'
      } else {
        document.querySelector('.tubiao').style.display = 'none'
      }
    })
  },
  methods: {
    // 点击保存
    saveEvent(row) {
      // 判断是否发生改变
      // 你也可以不使用这个判断，我是给示例，没做个性化需求
      if (this.$refs.dates.isUpdateByRow(row)) {
        // 清除表格激活状态
        this.$refs.dates.clearActived().then(() => {
          // 局部保存，并将行数据恢复到初始状态（如果 第二个参数record 为空则不改动行数据，只恢复状态）
          // 你不执行这个reloadRow，代表下次进来你上面的这个if还是会执行，不然下次点击保存，还是保存成功哦！状态没改变哦
          this.$refs.dates.reloadRow(row, null, null)
          // 如果，假如你保存了后端给你个当前行的row，那么你需要赋值给表格行呢，你就需要把后端给你的row填到第二个参数位置
          // this.$refs.plxTable.reloadRow(row, 后端的row, null)
          // 第三个参数呢就是只改变当前行中的call单个单元格。第三个参数是row中的字段名（field属性的值）
        })
        this.$message({
          message: '恭喜你，编辑成功！',
          type: 'success'
        })
        console.log(row)
      } else {
        this.$message({
          message: '编辑失败，你没改变当前行的数据',
          type: 'error'
        })
      }
    },
    // 取消
    cancelRowEvent(row) {
      // 清除表格激活状态
      this.$refs.dates.clearActived().then(() => {
        // 还原行数据
        this.$refs.dates.revertData(row)
      })
    },
    // 编辑
    edit(row) {
      this.$refs.dates.setActiveRow(row)
    },
    // 删除
    deletes(row) {
      this.$refs.dates.remove(row)
      console.log(row.OBJECTID)
      this.$message({
        message: '删除成功！',
        type: 'success',
        showClose: true
      })
    },
    // 选中
    selectionChange(row) {
      this.data = row
    },
    // 每页多少条
    handleSizeChange(val) {
      document.querySelector('.zhezhao').style.display = 'block'
      eventBuq.$emit('pageSize', val)
    },
    // 当前页/前往页/换页
    handleCurrentChange(val) {
      document.querySelector('.zhezhao').style.display = 'block'
      eventBuq.$emit('pageNum', val)
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
    // 伸展
    iocs(e) {
      var that = this
      if (e === '展开') {
        this.ioc.ioc = 'el-icon-download'
        this.ioc.name = '收缩'
        eventBuq.$emit('height', 415)
        document.getElementById('tabletop').style.height = '360px'
        this.times = setInterval(function() {
          that.height = that.height + 14
          if (that.height === 360) {
            clearInterval(that.times)
            that.times = null
          }
        }, 1)
      } else {
        this.ioc.ioc = 'el-icon-upload2'
        this.ioc.name = '展开'
        eventBuq.$emit('height', 245)
        document.getElementById('tabletop').style.height = '150px'
        this.times = setInterval(function() {
          that.height = that.height - 15
          if (that.height === 150) {
            clearInterval(that.times)
            that.times = null
          }
        }, 1)
      }
    },
    // 导出
    exports(e) {
      if (e === '导出本页') {
        this.exportExcel(this.datas)
      } else {
        if (this.data.length === 0) {
          this.$message({
            message: '请选择数据！',
            type: 'warning',
            showClose: true
          })
        } else {
          this.exportExcel(this.data)
        }
      }
    },
    // 导出至Excel
    exportExcel(e) {
      var option = {} // option代表的就是excel文件
      var dataTable = [] // dataTable代表excel文件中的数据内容
      // 循环赋值
      if (e) {
        for (var i in e) {
          var obj = {
            卡片编号: e[i].卡片编号,
            性别: e[i].性别,
            年龄: e[i].年龄,
            联系电话: e[i].联系电话,
            出生日期: e[i].出生日期,
            发病日期: e[i].发病日期,
            诊断日期: e[i].诊断时间,
            死亡日期: e[i].死亡日期,
            重症患者: e[i].重症患者,
            实验室结果: e[i].实验室结果,
            患者工作单位: e[i].患者工作单位,
            现住地址属于: e[i].病人属于,
            现在详细地址: e[i].现在详细地址,
            现住地址国标: e[i].现住地址国标,
            人群分类: e[i].人群分类,
            病例分类: e[i].病例分类,
            疾病名称: e[i].疾病名称,
            报告单位: e[i].报告单位,
            单位类型: e[i].单位类型,
            备注: e[i].备注
          }
          dataTable.push(obj) //   设置excel每列获取的数据源
        }
      }
      option.fileName = 'EpidemicDisease' // excel文件名
      // excel文件数据
      option.datas = [
        {
          //   excel文件的数据源
          sheetData: dataTable,
          //   excel文件sheet的表名
          sheetName: '第一列',
          //   excel文件表头名
          sheetHeader: ['卡片编号', '性别', '联系电话', '出生日期', '发病日期', '诊断日期', '死亡日期', '重症患者', '实验室结果', '患者工作单位', '现住地址属于', '现在详细地址', '现住地址国标', '人群分类', '病例分类', '疾病名称', '报告单位', '单位类型', '备注'],
          //   excel文件列名
          sheetFilter: ['卡片编号', '性别', '联系电话', '出生日期', '发病日期', '诊断日期', '死亡日期', '重症患者', '实验室结果', '患者工作单位', '现住地址属于', '现在详细地址', '现住地址国标', '人群分类', '病例分类', '疾病名称', '报告单位', '单位类型', '备注']
        }
      ]
      //   创建ExportJsonExcel实例对象
      const toExcel = new ExportJsonExcel(option)
      //   调用保存方法
      toExcel.saveExcel()
    },
    // 生成图表
    tubiao() {
      eventBuq.$emit('tubiao', 0)
    }
  }
}
</script>
<style scoped>
#table {
  position: absolute;
  width: calc(100% - 10px);
  height: calc(100% - 10px);
  text-align: center;
}
#table .top {
  position: absolute;
  width: 100%;
  height: 150px;
  top: 35px;
  transition: all 1s;
}
#table .bottom {
  position: absolute;
  width: 100%;
  height: 40px;
  line-height: 40px;
  bottom: 0px;
}
#table .highest {
  top: 0px;
  position: absolute;
  width: 100%;
  height: 30px;
  border-bottom: 1px solid #e8eaec4d;
}
/* 收缩 */
#table .sheng {
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  color: rgb(200, 200, 200);
  cursor: pointer;
}
/* 动态图表 */
#table .tubiao {
  display: none;
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  right: 140px;
}
#table .tubiao >>> .el-button {
  background-color: rgba(255, 255, 255, 0);
  color: rgb(200, 200, 200);
  border: none;
  padding: 0;
  font-size: 14px;
}
/* 导出 */
#table .daochu {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(0, -50%);
  color: rgba(219, 219, 219, 0.555);
  font-size: 14px;
}
#table .daochu span {
  padding: 0 5px;
  cursor: pointer;
  transition: all 0.5s;
}
#table .daochu span:hover {
  color: rgb(200, 200, 200) !important;
}
/* 表样式 */
#table .top >>> .elx-header--row {
  background-color: rgba(40, 43, 57, 0.2) !important;
}
#table .top >>> .elx-table--header-wrapper {
  background-color: rgba(255, 255, 255, 0) !important;
  color: rgb(200, 200, 200) !important;
}
/* 单数行 */
#table .top >>> .body--wrapper {
  background-color: rgba(255, 255, 255, 0) !important;
  color: rgb(200, 200, 200) !important;
}
#table .top >>> .row--stripe {
  background-color: rgba(65, 70, 92, 0.4) !important;
  color: rgb(200, 200, 200) !important;
}
#table .top >>> .row--current {
  background-color: rgba(40, 43, 57, 0.4) !important;
  color: rgb(200, 200, 200) !important;
}
#table .top >>> .row--hover {
  background-color: rgb(35, 35, 35, 0.6) !important;
  color: rgb(200, 200, 200) !important;
}
/* 输入框样式 */
#table .top >>> .el-input__inner {
  background-color: rgba(255, 255, 255, 0) !important;
  border: none !important;
  color: rgb(200, 200, 200) !important;
}
/* 去除原始样式 */
#table >>> .elx-header--column.col--ellipsis>.elx-cell>i:not(.elx-cell--title), .elx-header--column.col--ellipsis>.elx-cell>span:not(.elx-cell--title) {
  display: none;
}
/* 换页 */
#table >>> .el-pagination {
  justify-content: center;
  align-items: baseline;
  display: inline-flex;
  align-content: center;
}
#table >>> .el-pagination__total {
  margin: 0;
}
#table >>> .el-pager {
  justify-content: center;
  align-items: baseline;
  display: inline-flex;
  align-content: center;
}
#table >>> .el-pager .number {
  margin: 0 3px;
  border-radius: 2px;
}
#table >>> .btn-prev,
#table >>> .btn-next {
  margin: 0 3px;
  background-color: #fff0;
  color: rgb(202, 202, 202);
}
#table >>> .el-pager .number {
  background-color: #fff0;
  color: rgb(202, 202, 202);
}
#table >>> .el-pager .active {
  color: #409EFF;
}
#table >>> .el-pagination button:hover {
  color: rgba(219, 219, 219, 0.555);
}
#table >>> .el-input__inner {
  background-color: #fff0;
  border: none;
  color: rgb(202, 202, 202);
}
#table >>> .el-pagination__editor.el-input .el-input__inner {
  border-bottom: 2px solid rgba(148, 150, 153, 0.6);
  border-radius: 0;
}
#table >>> .el-icon.more {
  background-color: #fff0;
  color: rgb(202, 202, 202);
}
/* 遮罩 */
#table .zhezhao {
  display: none;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 90;
  background-color: rgba(79, 133, 177, 0.3);
  top: 0;
}
#table >>> .elx-table.border--full .elx-body--column,
#table >>> .elx-table.border--full .elx-footer--column,
#table >>> .elx-table.border--full .elx-header--column {
  background: none;
}
#table >>> .elx-table .elx-table--border-line {
  border: none;
}
#table >>> .elx-table .elx-table--header-wrapper .elx-table--header-border-line {
  border-bottom: 1px solid #e8eaec4d;
}
/**===== bars1 =====*/
#table #bars1 {
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  height: 50px;
  width: 50px;
  margin: -25px 0 0 -25px;
}

#table #bars1 span {
  position: absolute;
  display: block;
  bottom: 10px;
  width: 9px;
  height: 5px;
  background: rgba(255, 2555, 255, 0.25);
  -webkit-animation: bars1 1.5s  infinite ease-in-out;
  animation: bars1 1.5s  infinite ease-in-out;
}

#table #bars1 span:nth-child(2) {
  left: 11px;
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}

#table #bars1 span:nth-child(3) {
  left: 22px;
  -webkit-animation-delay: 0.4s;
  animation-delay: 0.4s;
}

#table #bars1 span:nth-child(4) {
  left: 33px;
  -webkit-animation-delay: 0.6s;
  animation-delay: 0.6s;
}

#table #bars1 span:nth-child(5) {
  left: 44px;
  -webkit-animation-delay: 0.8s;
  animation-delay: 0.8s;
}

@keyframes bars1 {
  0% {
    height: 5px;
    transform: translateY(0px);
    -webkit-transform: translateY(0px);
    background: rgba(255, 2555, 255, 0.25);
  }
  25% {
    height: 30px;
    transform: translateY(15px);
    -webkit-transform: translateY(15px);
    background: #fff;
  }
  50% {
    height: 5px;
    transform: translateY(0px);
    -webkit-transform: translateY(0px);
    background: rgba(255, 2555, 255, 0.25);
  }
  100% {
    height: 5px;
    transform: translateY(0px);
    -webkit-transform: translateY(0px);
    background: rgba(255, 2555, 255, 0.25);
  }
}
@-webkit-keyframes bars1 {
  0% {
    height: 5px;
    -webkit-transform: translateY(0px);
    background: rgba(255, 2555, 255, 0.25);
  }
  25% {
    height: 30px;
    -webkit-transform: translateY(15px);
    background: #fff;
  }
  50% {
    height: 5px;
    -webkit-transform: translateY(0px);
    background: rgba(255, 2555, 255, 0.25);
  }
  100% {
    height: 5px;
    -webkit-transform: translateY(0px);
    background: rgba(255, 2555, 255, 0.25);
  }
}
/** END of bars1 */
</style>
