<template>
  <div>
    <div v-if="ceng == 0">
      <yuce />
    </div>
    <div v-if="ceng == 1">
      <ylzy />
    </div>
    <div v-if="ceng == 2">
      <mrsw />
    </div>
    <div v-if="ceng == 3">
      <gryc />
    </div>
    <div v-if="ceng == 4">
      <kzly />
    </div>
    <div v-if="ceng == 5">
      <shsy />
    </div>
  </div>
</template>
<script>
import Bus from '../js/bus.js'
import Yuce from './ljsw.vue'
import Ylzy from './ylzy.vue'
import Mrsw from './mrsw.vue'
import Gryc from './gryc.vue'
import Kzly from './kzly.vue'
import Shsy from './shsy.vue'
export default {
  components: {
    Yuce,
    Ylzy,
    Mrsw,
    Gryc,
    Kzly,
    Shsy
  },
  data() {
    return {
      ceng: 0
    }
  },
  watch: {
    'ceng'() {
      Bus.$emit('ceng', this.ceng)
    }
  },
  mounted: function() {
    var vm = this
    // 用$on事件来接收参数
    Bus.$on('val', (data) => {
      vm.ceng = data
    })
  },
  methods: {}
}
</script>

