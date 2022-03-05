<template>
  <div>
    <div class="rtopTable">
      <tr>
        <td class="rtopTable-td"><el-button type="primary" @click="leiji()">累计死亡</el-button></td>
        <td class="rtopTable-td"><el-button type="primary" @click="yiliao()">医疗资源</el-button></td>
      </tr>
      <tr>
        <td class="rtopTable-td"><el-button type="primary" @click="meiri()">每日死亡</el-button></td>
        <td class="rtopTable-td"><el-button type="primary" @click="ganran()">感染检测</el-button></td>
      </tr>
      <tr>
        <td class="rtopTable-td"><el-button type="primary" @click="kouzhao()">口罩利用</el-button></td>
        <td class="rtopTable-td"><el-button type="primary" @click="shehui()">社会疏远</el-button></td>
      </tr>
    </div>
  </div>
</template>
<script>
import Bus from '../js/bus.js'
export default {
  data() {
    return {
      ceng: 0
    }
  },
  methods: {
    leiji: function() {
      this.ceng = 0
      Bus.$emit('val', this.ceng)
    },
    yiliao: function() {
      this.ceng = 1
      Bus.$emit('val', this.ceng)
    },
    meiri: function() {
      this.ceng = 2
      Bus.$emit('val', this.ceng)
    },
    ganran: function() {
      this.ceng = 3
      Bus.$emit('val', this.ceng)
    },
    kouzhao: function() {
      this.ceng = 4
      Bus.$emit('val', this.ceng)
    },
    shehui: function() {
      this.ceng = 5
      Bus.$emit('val', this.ceng)
    }
  }
}
</script>
<style scoped>
.rtopTable{
  position: absolute;
  top: 20%;
  text-align: center;
}
.rtopTable-td{
    width: 150px;
    height: 70px;
}
</style>
