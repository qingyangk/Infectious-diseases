import { json, maps, mapx, mapz, qTotal, qStatistics, AdministrativeRegion, Severe, Month, qVirustype, qCriticalpopulation, qSeverevirus, qSevereagegroup, qThedead, qDeathvirus, qDeathagegroup, qAgestatistics, qYearstatistics, qNormalagegroup, qCrowddiagnosis, DAReduction, DRMorbidity } from '@/api/datapanel'

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
  // 地块查询
  json({ commit }, data) {
    return new Promise((resolve, reject) => {
      json({ name: data }).then(response => {
        // const { dates } = response
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 市一级查询
  maps({ commit }, data) {
    return new Promise((resolve, reject) => {
      maps({ name: data }).then(response => {
        // const { dates } = response
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 县一级查询
  mapx({ commit }, data) {
    return new Promise((resolve, reject) => {
      mapx({ name: data }).then(response => {
        // const { dates } = response
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 镇一级查询
  mapz({ commit }, data) {
    return new Promise((resolve, reject) => {
      mapz({ name: data }).then(response => {
        // const { dates } = response
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 陕西省总诊断病例 重症病例 死亡病例
  qTotal({ commit }) {
    return new Promise((resolve, reject) => {
      qTotal().then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 人群类型 病例类型 报告单位 年龄跨度
  qStatistics({ commit }) {
    return new Promise((resolve, reject) => {
      qStatistics().then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 行政区地区确诊 地区重症 地址死亡
  AdministrativeRegion({ commit }, data) {
    return new Promise((resolve, reject) => {
      AdministrativeRegion({ range: data.range, name: data.name }).then(response => {
        // const { dates } = response
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 季度地区确诊 地区重症 地址死亡
  Severe({ commit }, data) {
    return new Promise((resolve, reject) => {
      Severe({ range: data.range, name: data.name }).then(response => {
        // const { dates } = response
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 季度地区确诊 地区重症 地址死亡
  Month({ commit }, data) {
    return new Promise((resolve, reject) => {
      Month({ range: data.range, name: data.name }).then(response => {
        // const { dates } = response
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 病毒类型
  qVirustype({ commit }, data) {
    return new Promise((resolve, reject) => {
      qVirustype({ range: data.range, name: data.name }).then(response => {
        // const { dates } = response
        resolve(response.datas)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 重症人群
  qCriticalpopulation({ commit }, data) {
    return new Promise((resolve, reject) => {
      qCriticalpopulation({ range: data.range, name: data.name }).then(response => {
        // const { dates } = response
        resolve(response.datas)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 重症病毒
  qSeverevirus({ commit }, data) {
    return new Promise((resolve, reject) => {
      qSeverevirus({ range: data.range, name: data.name }).then(response => {
        // const { dates } = response
        resolve(response.datas)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 重症年龄组
  qSevereagegroup({ commit }, data) {
    return new Promise((resolve, reject) => {
      qSevereagegroup({ range: data.range, name: data.name }).then(response => {
        // const { dates } = response
        resolve(response.datas)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 死亡人群
  qThedead({ commit }, data) {
    return new Promise((resolve, reject) => {
      qThedead({ range: data.range, name: data.name }).then(response => {
        // const { dates } = response
        resolve(response.datas)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 死亡病毒
  qDeathvirus({ commit }, data) {
    return new Promise((resolve, reject) => {
      qDeathvirus({ range: data.range, name: data.name }).then(response => {
        // const { dates } = response
        resolve(response.datas)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 死亡年龄组
  qDeathagegroup({ commit }, data) {
    return new Promise((resolve, reject) => {
      qDeathagegroup({ range: data.range, name: data.name }).then(response => {
        // const { dates } = response
        resolve(response.datas)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 年龄诊断 重症 死亡
  qAgestatistics({ commit }, data) {
    return new Promise((resolve, reject) => {
      qAgestatistics({ range: data.range, name: data.name }).then(response => {
        // const { dates } = response
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 年龄诊断 重症 死亡
  qYearstatistics({ commit }, data) {
    return new Promise((resolve, reject) => {
      qYearstatistics({ range: data.range, name: data.name }).then(response => {
        // const { dates } = response
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 年龄组
  qNormalagegroup({ commit }, data) {
    return new Promise((resolve, reject) => {
      qNormalagegroup({ range: data.range, name: data.name }).then(response => {
        // const { dates } = response
        resolve(response.datas)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 人群
  qCrowddiagnosis({ commit }, data) {
    return new Promise((resolve, reject) => {
      qCrowddiagnosis({ range: data.range, name: data.name }).then(response => {
        // const { dates } = response
        resolve(response.datas)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 诊断-发病
  DAReduction({ commit }, data) {
    return new Promise((resolve, reject) => {
      DAReduction({ range: data.range, name: data.name }).then(response => {
        // const { dates } = response
        resolve(response.datas)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 死亡-发病
  DRMorbidity({ commit }, data) {
    return new Promise((resolve, reject) => {
      DRMorbidity({ range: data.range, name: data.name }).then(response => {
        // const { dates } = response
        resolve(response.datas)
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

