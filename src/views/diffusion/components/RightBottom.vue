<template>
  <div>
    <h3 style="text-align:center">预测条件</h3>
    <el-form ref="form" class="form" :model="form" label-width="80px">
      <el-form-item v-show="yuce" label="预测范围" style="padding:5px">
        <!-- <el-select v-model="form.region" placeholder="请选择预测范围">
          <el-option label="已报道" value="yibaodao" />
          <el-option label="未报道" value="weibaodao" />
          <el-option label="全部" value="quanbu" />
        </el-select> -->
        <el-select v-model="test" value-key="id" @change="changeValue">
          <el-option v-for="item in form.region" :key="item.id" :label="item.name" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item v-show="envir" label="场景">
        <el-checkbox-group v-model="form.type" @change="changebox">
          <el-checkbox label="projection" type="name" />
          <el-checkbox v-show="Wor" label="worse" type="name" />
          <el-checkbox label="marks" type="name" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即预测</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import Bus from '../js/bus'
export default {
  data() {
    return {
      form: {
        region: '',
        type: ['projection']
      },
      envir: true,
      yuce: true,
      Wor: true,
      ceng: 0,
      test: '', // 控制下拉框默认显示
      reldata1: '', // 预测范围数据
      reldata2: '',
      ljsw: [
        { id: 1, name: '已报道', label: 'yibaodao' },
        { id: 2, name: '未报道', label: 'weibaodao' }
      ],
      ylzy: [
        { id: 1, name: '所有床位', label: 'allbeds' },
        { id: 2, name: 'ICU床位', label: 'ICUbed' }
      ],
      grjc: [
        { id: 1, name: '预估感染', label: 'yggr' },
        { id: 2, name: '确诊感染', label: 'qzgr' },
        { id: 3, name: '检测', label: 'jc' }
      ]
    }
  },
  watch: {
    'ceng'() {
      this.onSubmit()
    }
  },
  mounted: function() {
    var vm = this
    // 用$on事件来接收参数
    if (vm.ceng === 0) {
      vm.form.region = vm.ljsw
      vm.test = '已报道'
    }
    vm.init1()
    vm.init2()
    Bus.$on('ceng', (data) => {
      vm.ceng = data
      if (vm.ceng === 0 || vm.ceng === 2) {
        vm.form.region = vm.ljsw
        vm.reldata = ''
        vm.yuce = true
        vm.Wor = true
        vm.envir = true
        vm.test = '已报道'
        vm.form.type = []
        vm.form.type = ['projection']
        vm.init1()
        vm.init2()
      } else if (vm.ceng === 1) {
        vm.form.region = vm.ylzy
        vm.reldata = ''
        vm.yuce = true
        vm.envir = false
        vm.form.type = []
        vm.form.type = ['projection']
        vm.test = '所有床位'
        vm.init1()
        vm.init2()
      } else if (vm.ceng === 3) {
        vm.form.region = vm.grjc
        vm.reldata = ''
        vm.yuce = true
        vm.envir = true
        vm.test = '预估感染'
        vm.form.type = []
        vm.form.type = ['projection']
        vm.init1()
        vm.init2()
      } else if (vm.ceng === 4) {
        vm.yuce = false
        vm.reldata = ''
        vm.Wor = false
        vm.envir = true
        vm.form.type = []
        vm.form.type = ['projection']
        vm.init1()
        vm.init2()
      } else if (vm.ceng === 5) {
        vm.yuce = false
        vm.reldata = ''
        vm.Wor = true
        vm.envir = true
        vm.form.type = []
        vm.form.type = ['projection']
        vm.init1()
        vm.init2()
      }
    })
    vm.onSubmit()
  },
  methods: {
    onSubmit() {
      if (this.ceng === 0) {
        Bus.$emit('ljsw1', this.reldata1)
        Bus.$emit('ljsw2', this.reldata2)
        // console.log(this.reldata2)
      }
      if (this.ceng === 1) {
        Bus.$emit('ylzy', this.reldata1)
        // console.log(this.reldata2)
      }
      if (this.ceng === 2) {
        Bus.$emit('mrsw1', this.reldata1)
        Bus.$emit('mrsw2', this.reldata2)
        // console.log(this.reldata2)
      }
      if (this.ceng === 3) {
        Bus.$emit('grjc1', this.reldata1)
        Bus.$emit('grjc2', this.reldata2)
        // console.log(this.reldata2)
      }
      if (this.ceng === 4) {
        Bus.$emit('kzly', this.reldata2)
        // console.log(this.reldata2)
      }
      if (this.ceng === 5) {
        Bus.$emit('shsy', this.reldata2)
        // console.log(this.reldata2)
      }
    },
    changeValue(value) {
      var that = this
      that.reldata1 = value
      if (that.reldata1.label === 'qzgr' || that.reldata1.label === 'jc') {
        that.envir = false
      }
    },
    init1() {
      if (this.test.length > 0) {
        this.reldata1 = ''
        this.reldata1 = this.form.region[0]
      }
    },
    changebox(value) {
      this.reldata2 = value
    },
    init2() {
      if (this.form.type[0] === 'projection') {
        this.reldata2 = ''
        this.reldata2 = this.form.type
      }
    }
  }
}
</script>
<style scoped>
.form{
  position: absolute;
  top:15%
}
</style>>
