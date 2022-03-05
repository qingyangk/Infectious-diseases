import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import datapanel from './modules/datapanel'
import query from './modules/query' // 新查询
import permission from './modules/permission'
import city from './modules/city'
import ndatapanel from './modules/ndatapanel' // 新首页
import ncity from './modules/ncity' // 新城市管理
import communication from './modules/communication' // 新传播调查
import sentiment from './modules/sentiment' // 舆情分析
import mapdata from './modules/mapdata' // 专题地图全局
import spacetimedata from './modules/spacetimedata' // 专题地图全局

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    datapanel,
    query,
    permission,
    city,
    ndatapanel,
    ncity,
    communication,
    sentiment,
    mapdata,
    spacetimedata
  },
  getters
})

export default store
