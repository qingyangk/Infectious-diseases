<template>
  <div>
    <ceshimap />
  </div>
</template>
<script>
import ceshimap from './components/ceshimap'
// import { mapGetters } from 'vuex'
// import qiehuan from './components/qiehuan'

export default {
  name: 'Monitor',
  components: {
    // qiehuan
    ceshimap
    // Ceshimap // 首页交互有问题，搜索不会高亮
    // Zgqushi, // 没数据
    // Sjqushi, // 没数据
    // Yuqing, //
    // Yuce// 地图地图没问题
  },
  // computed: {
  //   ...mapGetters([
  //     'roles'
  //   ])
  // },
  data() {
    return {
      msg: {},
      weidu: '1231321'
    }
  }
}
</script>
