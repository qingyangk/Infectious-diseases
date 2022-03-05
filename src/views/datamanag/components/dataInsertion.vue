<template>
  <div class="adddate">
    <!-- 地图 -->
    <div id="MapSanJ1" />
    <!-- 编辑+图例 -->
    <div class="zujian">
      <div id="editorDiv" />
      <div id="lengthDiv" />
    </div>
    <!-- 小工具 -->
    <div class="gadget">
      <ul>
        <el-tooltip class="item" effect="light" content="放大" placement="right">
          <li>
            <i class="el-icon-share" />
          </li>
        </el-tooltip>
        <el-tooltip class="item" effect="light" content="缩小" placement="right">
          <li>
            <i class="el-icon-share" />
          </li>
        </el-tooltip>
        <el-tooltip class="item" effect="light" content="Home" placement="right">
          <li>
            <i class="el-icon-share" />
          </li>
        </el-tooltip>
      </ul>
    </div>
    <!-- 加载Excel+地图加点+插入数据库 -->
    <div id="hezi">
      <div class="upload">
        <el-upload action="" :multiple="false" :show-file-list="false" accept="csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" :http-request="httpRequest">
          <el-button ref="upload" size="mini" type="primary">上传文件</el-button>
        </el-upload>
      </div>
      <el-button id="join" ref="join" @click="xian()">加点</el-button>
      <el-button id="editor" ref="editor">插入</el-button>
    </div>
    <!-- 表 -->
    <div class="table">
      <div class="top" @mousedown.prevent="moveo($event)"><span>≡</span></div>
      <div class="tool">
        <el-row :gutter="5">
          <el-col :span="2">
            <el-button type="success" size="mini" icon="el-icon-refresh">重置表单</el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" size="mini" :icon="icon" @click="clear()">取消选择</el-button>
          </el-col>
          <el-col :span="16">
            <div>123</div>
          </el-col>
          <el-col :span="4">
            <el-input v-model="find" size="mini" clearable placeholder="请输入查询内容" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click="finds()" />
            </el-input>
          </el-col>
        </el-row>
      </div>
      <div class="body">
        <ux-grid
          ref="table"
          :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
          :stripe="true"
          keep-source
          :edit-config="{trigger: 'manual', mode: 'row'}"
          beautify-table
          highlight-current-row
          inverse-current-row
          header-drag-style
          tooltip-effect="dark"
          select-tr-class="selectTr"
          border
          style="width: 100%;border-radius: 5px"
          show-body-overflow="title"
          show-header-overflow="title"
          max-height="300"
          height="300"
          use-virtual
          @handlePageSize="handlePageSize"
          @selection-change="handleSelectionChange"
        >
          <ux-table-column type="checkbox" fixed width="40" align="center" />
          <ux-table-column resizable field="卡片编号" title="卡片编号" width="180" align="center" edit-render>
            <template v-slot:header>
              <span><icon-svg icon-class="icon-qiapian" /> 卡片编号</span>
            </template>
            <template v-slot:edit="scope">
              <el-input v-model="scope.row.卡片编号" />
            </template>
          </ux-table-column>
          <ux-table-column resizable field="性别" title="性别" width="100" align="center" edit-render>
            <template v-slot:header>
              <span><icon-svg icon-class="icon-xingbienannv" /> 性别</span>
            </template>
            <template v-slot:edit="scope">
              <el-select v-model="scope.row.性别" @change="$refs.table.updateStatus(scope)">
                <el-option v-for="item in sexList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </template>
            <template v-slot="{ row }">{{ getLabel(row.性别) }}</template>
          </ux-table-column>
          <ux-table-column resizable field="出生日期" title="出生日期" width="130" align="center" edit-render>
            <template v-slot:header>
              <span><icon-svg icon-class="icon-riqi" /> 出生日期</span>
            </template>
            <template v-slot:edit="scope">
              <el-input v-model="scope.row.出生日期" />
            </template>
          </ux-table-column>
          <ux-table-column resizable field="年龄" title="年龄" width="80" align="center" edit-render>
            <template v-slot:header>
              <span><icon-svg icon-class="icon-nianling" /> 年龄</span>
            </template>
            <template v-slot:edit="scope">
              <el-input v-model="scope.row.年龄" />
            </template>
          </ux-table-column>
          <ux-table-column resizable field="联系电话" title="联系电话" width="150" align="center" edit-render>
            <template v-slot:header>
              <span><icon-svg icon-class="icon-lianxidianhua" /> 联系电话</span>
            </template>
            <template v-slot:edit="scope">
              <el-input v-model="scope.row.联系电话" />
            </template>
          </ux-table-column>
          <ux-table-column resizable field="发病日期" title="发病日期" width="130" align="center" edit-render>
            <template v-slot:header>
              <span><icon-svg icon-class="icon-riqi" /> 发病日期</span>
            </template>
            <template v-slot:edit="scope">
              <el-input v-model="scope.row.发病日期" />
            </template>
          </ux-table-column>
          <ux-table-column resizable field="诊断时间" title="诊断日期" width="130" align="center" edit-render>
            <template v-slot:header>
              <span><icon-svg icon-class="icon-riqi" /> 诊断日期</span>
            </template>
            <template v-slot:edit="scope">
              <el-input v-model="scope.row.诊断时间" />
            </template>
          </ux-table-column>
          <ux-table-column resizable field="死亡日期" title="死亡日期" width="110" align="center" edit-render>
            <template v-slot:header>
              <span><icon-svg icon-class="icon-riqi" /> 死亡日期</span>
            </template>
            <template v-slot:edit="scope">
              <el-input v-model="scope.row.死亡日期" />
            </template>
          </ux-table-column>
          <ux-table-column resizable field="现住详细地址" title="现住详细地址" width="180" align="center" edit-render show-overflow-tooltip>
            <template v-slot:header>
              <span><icon-svg icon-class="icon-dizhi" /> 现住详细地址</span>
            </template>
            <template v-slot:edit="scope">
              <el-input v-model="scope.row.现住详细地址" />
            </template>
          </ux-table-column>
          <ux-table-column resizable field="患者工作单位" title="患者工作单位" width="180" align="center" edit-render show-overflow-tooltip>
            <template v-slot:header>
              <span><icon-svg icon-class="icon-danweiguanli" /> 患者工作单位</span>
            </template>
            <template v-slot:edit="scope">
              <el-input v-model="scope.row.患者工作单位" />
            </template>
          </ux-table-column>
          <ux-table-column resizable field="病人属于" title="病人属于" width="140" align="center" edit-render show-overflow-tooltip>
            <template v-slot:header>
              <span><icon-svg icon-class="icon-fenlei" /> 病人属于</span>
            </template>
            <template v-slot:edit="scope">
              <el-input v-model="scope.row.病人属于" />
            </template>
          </ux-table-column>
          <ux-table-column resizable field="现住地址国标" title="现住地址国标" width="180" align="center" edit-render>
            <template v-slot:header>
              <span><icon-svg icon-class="icon-dizhi" /> 现住地址国标</span>
            </template>
            <template v-slot:edit="scope">
              <el-input v-model="scope.row.现住地址国标" />
            </template>
          </ux-table-column>
          <ux-table-column resizable field="人群分类" title="人群分类" width="110" align="center" edit-render>
            <template v-slot:header>
              <span><icon-svg icon-class="icon-fenlei" /> 人群分类</span>
            </template>
            <template v-slot:edit="scope">
              <el-input v-model="scope.row.人群分类" />
            </template>
          </ux-table-column>
          <ux-table-column resizable field="病例分类" title="病例分类" width="150" align="center" edit-render>
            <template v-slot:header>
              <span><icon-svg icon-class="icon-shebeimingcheng" /> 病例分类</span>
            </template>
            <template v-slot:edit="scope">
              <el-input v-model="scope.row.病例分类" />
            </template>
          </ux-table-column>
          <ux-table-column resizable field="疾病名称" title="疾病名称" width="110" align="center" edit-render>
            <template v-slot:header>
              <span><icon-svg icon-class="icon-bingli" /> 疾病名称</span>
            </template>
            <template v-slot:edit="scope">
              <el-input v-model="scope.row.疾病名称" />
            </template>
          </ux-table-column>
          <ux-table-column resizable field="报告单位" title="报告单位" width="120" align="center" edit-render show-overflow-tooltip>
            <template v-slot:header>
              <span><icon-svg icon-class="icon-danweiguanli" /> 报告单位</span>
            </template>
            <template v-slot:edit="scope">
              <el-input v-model="scope.row.报告单位" />
            </template>
          </ux-table-column>
          <ux-table-column resizable field="单位类型" title="单位类型" width="110" align="center" edit-render>
            <template v-slot:header>
              <span><icon-svg icon-class="icon-danweiguanli" /> 单位类型</span>
            </template>
            <template v-slot:edit="scope">
              <el-input v-model="scope.row.单位类型" />
            </template>
          </ux-table-column>
          <ux-table-column resizable field="重症患者" title="重症患者" width="110" align="center" edit-render>
            <template v-slot:header>
              <span><icon-svg icon-class="icon-zhongzhengjianhushi" /> 重症患者</span>
            </template>
            <template v-slot:edit="scope">
              <el-input v-model="scope.row.重症患者" />
            </template>
          </ux-table-column>
          <ux-table-column resizable field="实验室结果" title="实验室结果" width="110" align="center" edit-render>
            <template v-slot:header>
              <span><icon-svg icon-class="icon-shiyanshianquan" /> 实验室结果</span>
            </template>
            <template v-slot:edit="scope">
              <el-input v-model="scope.row.实验室结果" />
            </template>
          </ux-table-column>
          <ux-table-column fixed="right" :resizable="false" title="操作" width="180" show-overflow-tooltip align="center">
            <template v-slot="{ row }">
              <!--判断行是否激活了, 编辑按钮执行的方式就是为了去激活-->
              <template v-if="$refs.table.isActiveByRow(row)">
                <el-button-group>
                  <el-button type="primary" plain size="mini" icon="el-icon-edit" @click="saveEvent(row)">保存</el-button>
                  <el-button type="danger" plain size="mini" @click="cancelRowEvent(row)">取消<i class="el-icon-delete" /></el-button>
                </el-button-group>
              </template>
              <template v-else>
                <el-button-group>
                  <el-button type="primary" plain size="mini" icon="el-icon-edit" @click="edit(row)">编辑</el-button>
                  <el-button type="danger" plain size="mini" @click="deletes(row.卡片编号)">删除<i class="el-icon-delete" /></el-button>
                </el-button-group>
              </template>
            </template>
          </ux-table-column>
        </ux-grid>
        <!-- <el-table ref="table" :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" type="selection" stripe border style="width: 100%;border-radius: 5px" max-height="300" height="300" @selection-change="handleSelectionChange">
          <el-table-column type="selection" fixed width="40" align="center" />
          <el-table-column prop="卡片编号" label="卡片编号" width="180" align="center" />
          <el-table-column prop="性别" label="性别" width="50" align="center" />
          <el-table-column prop="出生日期" label="出生日期" width="100" align="center" />
          <el-table-column prop="年龄" label="年龄" width="50" align="center" />
          <el-table-column prop="联系电话" label="联系电话" width="110" align="center" />
          <el-table-column prop="发病日期" label="发病日期" width="110" align="center" />
          <el-table-column prop="诊断时间" label="诊断日期" width="110" align="center" />
          <el-table-column prop="死亡日期" label="死亡日期" width="110" align="center" />
          <el-table-column prop="现住详细地址" label="现住详细地址" width="180" align="center" show-overflow-tooltip />
          <el-table-column prop="患者工作单位" label="患者工作单位" width="110" align="center" show-overflow-tooltip />
          <el-table-column prop="病人属于" label="病人属于" width="110" align="center" show-overflow-tooltip />
          <el-table-column prop="现住地址国标" label="现住地址国标" width="110" align="center" />
          <el-table-column prop="人群分类" label="人群分类" width="110" align="center" />
          <el-table-column prop="病例分类" label="病例分类" width="110" align="center" />
          <el-table-column prop="疾病名称" label="疾病名称" width="110" align="center" />
          <el-table-column prop="报告单位" label="报告单位" width="120" align="center" show-overflow-tooltip />
          <el-table-column prop="单位类型" label="单位类型" width="110" align="center" />
          <el-table-column prop="重症患者" label="重症患者" width="110" align="center" />
          <el-table-column prop="实验室结果" label="实验室结果" width="100" align="center" />
          <el-table-column fixed="right" label="操作" width="180" show-overflow-tooltip align="center">
            <template slot-scope="scope">
              <el-button-group>
                <el-button type="primary" plain size="mini" icon="el-icon-edit" @click="edit(scope.row.卡片编号)">编辑</el-button>
                <el-button type="danger" plain size="mini" @click="deletes(scope.row.卡片编号)">删除<i class="el-icon-delete" /></el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table> -->
      </div>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          background
          :total="tableData.length"
          :current-page="currentPage"
          :page-sizes="[500, 750, 1000]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { loadModules } from 'esri-loader'
import XLSX from 'xlsx'

export default {
  name: 'DataInsertion',
  props: {
    ceng: {
      type: null,
      default: ''
    }
  },
  data() {
    return {
      results: [{
        x: 107.93237273055436,
        y: 35.889434782090895
      }, {
        x: 107.932372730555,
        y: 35.8894347820905
      }
      ],
      tableData: [],
      tableDatas: [],
      find: '',
      icon: 'el-icon-turn-off',
      currentPage: 1,
      pagesize: 500,
      sexList: [
        { value: '男', label: '男' },
        { value: '女', label: '女' }
      ],
      // 移动
      canMove: false
    }
  },
  watch: {
    tableDatas() {
      if (this.tableDatas.length > 0) {
        this.icon = 'el-icon-open'
      } else {
        this.icon = 'el-icon-turn-off'
      }
    }
  },
  mounted() {
    if (this.ceng === 2) {
      var that = this
      setTimeout(function() {
        that.$refs.upload.$el.click()
      }, 1000)
    }
  },
  created() {
    this._Init()
  },
  methods: {
    // 移动
    moveo(event) {
      var that = this
      const table = document.getElementsByClassName('table')[0]
      this.canMove = true
      document.onmouseup = function() {
        that.canMove = false
        document.onmousemove = null
        document.onmouseup = null
      }
      document.onmousemove = function(e) {
        if (that.canMove) {
          var top = window.innerHeight - e.clientY
          var height = top
          var minheight = 70
          var maxheight = 420
          if (height < minheight) height = minheight
          if (height > maxheight) height = maxheight
          table.style.height = height + 'px'
        }
      }
    },
    // 修改高度
    cai(e) {
      return e.split('%')[0] * 1
    },
    // 清除选则
    clear() {
      this.$refs.table.clearSelection()
    },
    // 多选事件
    handleSelectionChange(val) {
      this.tableDatas = val
    },
    // 查询
    finds() {
      console.log(this.find)
    },
    // 编辑
    edit(e) {
      this.$refs.table.setActiveRow(e)
    },
    // 转换男女
    getLabel(val) {
      const item = this.sexList.filter(item => item['value'] === val)[0]
      return item ? item.label : ''
    },
    // 点击保存
    saveEvent(row) {
      // 判断是否发生改变
      console.log(row)
      // 你也可以不使用这个判断，我是给示例，没做个性化需求
      if (this.$refs.table.isUpdateByRow(row)) {
        // ...保存相关的逻辑（后端的呀，或者前端的呀）
        // 清除表格激活状态
        this.$refs.table.clearActived().then(() => {
          // 局部保存，并将行数据恢复到初始状态（如果 第二个参数record 为空则不改动行数据，只恢复状态）
          // 你不执行这个reloadRow，代表下次进来你上面的这个if还是会执行，不然下次点击保存，还是保存成功哦！状态没改变哦
          this.$refs.table.reloadRow(row, null, null)
          // 如果，假如你保存了后端给你个当前行的row，那么你需要赋值给表格行呢，你就需要把后端给你的row填到第二个参数位置
          // this.$refs.plxTable.reloadRow(row, 后端的row, null)
          // 第三个参数呢就是只改变当前行中的call单个单元格。第三个参数是row中的字段名（field属性的值）
        })
        this.$message({
          message: '恭喜你，保存成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: '保存失败，你没改变当前行的数据',
          type: 'error'
        })
      }
    },
    // 取消
    cancelRowEvent(row) {
      // 清除表格激活状态
      this.$refs.table.clearActived().then(() => {
        // 还原行数据
        this.$refs.table.revertData(row)
      })
    },
    // 删除
    deletes(e) {
      console.log(e)
    },
    // 一页显示多少条
    handleSizeChange(size) {
      this.pagesize = size
    },
    // 页码更改方法
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
    },
    handlePageSize({ page, size }) {
      console.log(page, size)
    },
    // 读取文件
    httpRequest(e) {
      var that = this
      const file = e.file // 文件信息
      if (!file) {
        // 没有文件
        return false
      } else if (!/\.(xls|xlsx)$/.test(file.name.toLowerCase())) {
        // 格式根据自己需求定义
        this.$message.error('上传格式不正确，请上传xls或者xlsx格式')
        return false
      }
      const fileReader = new FileReader()
      fileReader.onload = ev => {
        const data = ev.target.result
        const workbook = XLSX.read(data, {
          type: 'binary', // 以字符编码的方式解析
          cellDates: true
        })
        const exlname = workbook.SheetNames[0] // 取第一张表
        const exl = XLSX.utils.sheet_to_json(workbook.Sheets[exlname]) // 生成json表格内容
        // 将 JSON 数据挂到 data 里
        this.tableData = exl
        // this.tableData = this.tableData.slice((this.currentPage - 1) * this.pagesize, this.currentPage * this.pagesize)
        // that.$refs.table.reloadData(this.tableData)
        // 加载至地图
        that.$refs.join.$el.click()
        console.log(this.tableData)
        // 加载至数据库
        // setTimeout(function() {
        //   that.$refs.editor.$el.click()
        // }, 10000)
      }
      fileReader.readAsBinaryString(file)
    },
    // 时间
    checkTime(i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
    },
    xian() {
      document.getElementById('editorDiv').style.display = 'block'
      document.getElementById('lengthDiv').style.display = 'block'
    },
    _Init: function() {
      // eslint-disable-next-line no-unused-vars
      const that = this
      const option = {
        url: 'http://js.arcgis.com/4.18/dojo/dojo.js',
        css: 'https://js.arcgis.com/4.18/esri/themes/dark-blue/main.css'
      }
      // 通过loadModules来做衔接
      loadModules(
        [
          'esri/layers/TileLayer',
          'esri/Map',
          'esri/views/MapView',
          'esri/Basemap',
          'esri/views/SceneView',
          'esri/Camera',
          'esri/layers/FeatureLayer',
          'esri/widgets/Legend',
          'esri/widgets/Sketch/SketchViewModel',
          'esri/layers/GraphicsLayer',
          'dgrid/OnDemandGrid',
          'dgrid/extensions/ColumnHider',
          'dgrid/Selection',
          'esri/layers/MapImageLayer',
          'esri/Graphic',
          'esri/geometry/SpatialReference',
          'esri/widgets/Editor',
          'esri/config'
        ],
        option
      ).then(([TileLayer, Map, MapView, Basemap, SceneView, Camera, FeatureLayer, Legend, SketchViewModel, GraphicsLayer, OnDemandGrid, ColumnHider, Selection, MapImageLayer, Graphic, SpatialReference, Editor, config]) => {
        var popupTemplate = {
          title: '{疾病名称}--{性别}', // 全国矢量（省、市、县）
          content: [
            {
              type: 'fields',
              fieldInfos: [
                { fieldName: 'OBJECTID', label: 'OBJECTID' },
                { fieldName: '卡片编号', label: '卡片编号' },
                { fieldName: '疾病名称', label: '疾病名称' },
                { fieldName: '人群分类', label: '人群分类' },
                { fieldName: '病例分类', label: '病例分类' },
                { fieldName: '发病日期', label: '发病日期' },
                { fieldName: '诊断时间', label: '诊断时间' },
                { fieldName: '报告单位', label: '报告单位' },
                { fieldName: '性别', label: '性别' },
                { fieldName: '出生日期', label: '出生日期' },
                { fieldName: '现住地址国标', label: '现住地址国标' },
                { fieldName: '现住详细地址', label: '现住详细地址' },
                { fieldName: '年龄', label: '年龄' },
                { fieldName: '实验室结果', label: '实验室结果' },
                { fieldName: '死亡日期', label: '死亡日期' }
              ]
            }
          ]
        }
        const customBasemap = new Basemap({
          portalItem: {
            id: 'a14ba2b66c284ce4bd1c11a335760f70' // WGS84 Streets Vector webmap
          }
        })
        // Create a symbol for drawing the point
        const norrender = {
          type: 'simple',
          field: 'mag',
          symbol: {
            type: 'simple-marker',
            size: 4,
            color: '#69dcff',
            outline: {
              color: 'rgba(0, 139, 174, 0.5)',
              width: 5
            }
          }
        }
        var url = 'http://1.117.71.181:6080/arcgis/rest/services/cs/cspts/FeatureServer/0'
        var WH_Water = new FeatureLayer({
          url: url,
          renderer: norrender,
          popupTemplate: popupTemplate
        })
        const map = new Map({
          basemap: customBasemap
        })
        map.add(WH_Water)
        // eslint-disable-next-line no-unused-vars
        var view = new MapView({
          container: 'MapSanJ1',
          map: map,
          zoom: 8,
          center: [107.93237273055436, 35.889434782090895]
        })
        // console.log(WH_Water)
        var markerSymbol = {
          type: 'simple-marker',
          size: 4,
          color: '#69dcff',
          outline: {
            color: 'rgba(50, 201, 113, 0.5)',
            width: 5
          }
        }
        // eslint-disable-next-line no-unused-vars
        const editor = new Editor({
          view: view
        }, document.getElementById('editorDiv'))
        // eslint-disable-next-line no-unused-vars
        const legend = new Legend({
          view: view
        }, document.getElementById('lengthDiv'))
        var graphics = []
        view.when(function() {
          document.getElementById('editor').addEventListener('click', function name(params) {
            editor('editor')
          })
          document.getElementById('join').addEventListener('click', function name(params) {
            editor('join')
          })
          function editor(params) {
            view.graphics = null
            graphics = []
            for (let index = 0; index < that.tableData.length; index++) {
              const STime = new Date(that.tableData[index].发病日期)
              const ETime = new Date(that.tableData[index].诊断时间)
              that.tableData[index].发病日期 = STime.getFullYear() + '-' + that.checkTime(STime.getMonth() + 1) + '-' + that.checkTime(STime.getDate())
              that.tableData[index].诊断时间 = ETime.getFullYear() + '-' + that.checkTime(ETime.getMonth() + 1) + '-' + that.checkTime(ETime.getDate())
              that.tableData[index].发病日期 = String(that.tableData[index].发病日期)
              that.tableData[index].诊断时间 = String(that.tableData[index].诊断时间)
              const point = {
                type: 'point', // autocasts as new Point()
                latitude: that.tableData[index].纬度,
                longitude: that.tableData[index].经度,
                spatialReference: { wkid: 102100 },
                z: 0
              }
              const graphic = new Graphic({
                geometry: point,
                symbol: markerSymbol
              })
              graphic.attributes = {
                'OBJECTID': that.tableData[index].卡片ID,
                '卡片编号': that.tableData[index].卡片编号,
                '性别': that.tableData[index].性别,
                '出生日期': that.tableData[index].出生日期,
                '年龄': that.tableData[index].年龄,
                '患者工作单': that.tableData[index].患者工作单位,
                '联系电话': that.tableData[index].联系电话,
                '病人属于': that.tableData[index].病人属于,
                '现住地址国': that.tableData[index].现住地址国标,
                '现住详细地': that.tableData[index].现住详细地址,
                '人群分类': that.tableData[index].人群分类,
                '病例分类': that.tableData[index].病例分类,
                '发病日期': that.tableData[index].发病日期,
                '诊断时间': that.tableData[index].诊断时间,
                '死亡日期': that.tableData[index].死亡日期,
                '疾病名称': that.tableData[index].疾病名称,
                '报告单位': that.tableData[index].报告单位,
                '经度': that.tableData[index].经度,
                '纬度': that.tableData[index].纬度,
                '单位类型': that.tableData[index].单位类型,
                '实验室结果': that.tableData[index].实验室结果,
                '重症患者': that.tableData[index].重症患者,
                '备注': that.tableData[index].备注,
                '导入时间': that.tableData[index].导入时间,
                '省': that.tableData[index].省,
                '市': that.tableData[index].市,
                '县': that.tableData[index].县,
                '镇': that.tableData[index].镇
              }
              graphic.popupTemplate = popupTemplate
              view.graphics.add(graphic)
              graphics.push(graphic)
            }
            var param = {
              addFeatures: graphics
              // timeout: 600000
            }
            if (params === 'editor') {
              applyEditsToLayer(param)
            } else if (params === 'join') {
              console.log('join')
            }
            // 请求时间
            WH_Water.refresh()
          }
          function applyEditsToLayer(params) {
            console.log(params)
            config.request.timeout = 60000000
            WH_Water.applyEdits(params).then(function(results) {
              console.log('添加成功: ', results)
            })
          }
        })
      })
    }
  }
}
</script>

<style scoped>
.adddate {
  position: absolute;
  width: 100%;
  height: 100%
}
.adddate #MapSanJ1  {
  float: left;
  width: 100%;
  height: 100%;
}
.adddate #hezi {
  display: none;
}
.adddate .zujian {
  position: absolute;
  z-index: 99;
  width: 300px;
  height: 200px;
  top: 15px;
  right: 15px;
}
.adddate .zujian #editorDiv {
  display: none;
}
.adddate .zujian #lengthDiv {
  display: none;
}
.adddate .table {
  width: 100%;
  height: 70px;
  background-color: rgba(40, 43, 57, 0.8);
  border: 1px solid rgb(39,45,57);
  z-index: 100;
  user-select: none;
  text-align: center;
  border-radius: 5px;
  position: absolute;
  bottom: 0;
  right: 0;
}
.adddate .table .top {
  background-color: rgb(40, 43, 57);
  color: rgba(255, 255, 255, 0.8);
  border-bottom: 1px solid #fff;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
  width: 100%;
  height: 20px;
  line-height: 20px;
  cursor: n-resize;
  user-select: none;
}
.adddate .table .tool {
  margin: 0 10px;
  margin-top: 10px;
}
.adddate .table .body {
  margin: 0 10px;
  margin-top: 10px;
  border-radius: 5px;
}
.adddate .table .block {
  margin-top: 10px;
}
.adddate .gadget {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  /* width: 2.5%; */
  width: 30px;
  background-color: rgba(40, 43, 57, 0.8);
  border-right: 1px solid rgb(102, 103, 105);
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  z-index: 99;
  text-align: center;
}
.adddate .gadget ul {
  padding: 0;
  margin: 0;
  list-style-type: none;
}
.adddate .gadget ul li {
  padding: 6px 0;
  border-bottom: 1px solid rgb(102, 103, 105);
  color: #ffffff;
  font-size: 17px;
}
</style>
<style>
.adddate .zujian .esri-editor__scroller {
  height: 250px !important;
}
.adddate ::-webkit-scrollbar {
  height: 12px;
}
.adddate ::-webkit-scrollbar-track {
  --webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}
.adddate .table .block .el-pagination__total {
  color: #ccc !important;
  margin: 0 10px;
}
.adddate .table .block button {
  margin: 0 10px;
}
.adddate .table .block .el-pagination__jump {
  color: #ccc !important;
  margin: 0 10px;
}
.adddate .elx-cell--edit-icon {
  display: none;
}
</style>
