import { MAtrix, Source, POTQuery, POAQuery, TAnalysis, PAnalysis, Sequential } from '@/api/sentiment'

const getDefaultState = () => {
  return {
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  }
}

const actions = {
  // 舆情分析-矩阵
  MAtrix({ commit }, data) {
    return new Promise((resolve, reject) => {
      MAtrix().then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 舆情分析-来源
  Source({ commit }, data) {
    return new Promise((resolve, reject) => {
      Source().then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 舆情分析-时间查询
  POTQuery({ commit }, data) {
    return new Promise((resolve, reject) => {
      POTQuery({ where: data.where, name: data.name, timz: data.timz, timx: data.timx }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 舆情分析-区域查询
  POAQuery({ commit }, data) {
    return new Promise((resolve, reject) => {
      POAQuery({ where: data.where, name: data.name, range: data.range, timz: data.timz, timx: data.timx }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 舆情分析-文本分析
  TAnalysis({ commit }, data) {
    return new Promise((resolve, reject) => {
      TAnalysis({ data }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 舆情分析-标注分析
  PAnalysis({ commit }, data) {
    return new Promise((resolve, reject) => {
      PAnalysis({ data }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 舆情分析-时序统计
  Sequential({ commit }, data) {
    return new Promise((resolve, reject) => {
      Sequential({ where: data.where, name: data.name, timz: data.timz, timx: data.timx }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
