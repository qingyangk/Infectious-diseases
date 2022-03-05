import { QJson, QPName, QMapJson, QDataJson, QDiseaseJson, UDJson,
  QIncidenceRate, QMortality, QNumberCases, QNumberDeaths, QWComparison, QDComparison, QMData,
  QGDJson, QName, QXYStatistics, QXTInterval, QAStatistics, QXARegion, QXQuarter, QXMonth,
  QXVType, QXCrowd, QXAGroup, QXJson } from '@/api/ndatapanel'

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
  // 地图范围数据
  QJson({ commit }, data) {
    return new Promise((resolve, reject) => {
      QJson({ name: data }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询地名
  QPName({ commit }, data) {
    return new Promise((resolve, reject) => {
      QPName().then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询地图内/发病数/死亡数/发病率/死亡率
  QMapJson({ commit }, data) {
    return new Promise((resolve, reject) => {
      QMapJson({ where: data.where, dataType: data.dataType, type: data.type, name: data.name, x: data.timec, time: data.time }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询展示数据/发病数/死亡数/发病率/死亡率
  QDataJson({ commit }, data) {
    return new Promise((resolve, reject) => {
      QDataJson({ where: data.where, type: data.type, name: data.name, x: data.timec, time: data.time }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询疾病列表
  QDiseaseJson({ commit }, data) {
    return new Promise((resolve, reject) => {
      QDiseaseJson().then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 更新疾病权重
  UDJson({ commit }, data) {
    return new Promise((resolve, reject) => {
      UDJson({ id: data }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询发病率
  QIncidenceRate({ commit }, data) {
    return new Promise((resolve, reject) => {
      QIncidenceRate({ time: data.time, timec: data.timec, detailed: data.detailed, type: data.type, where: data.where, name: data.name }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询死亡率
  QMortality({ commit }, data) {
    return new Promise((resolve, reject) => {
      QMortality({ time: data.time, timec: data.timec, detailed: data.detailed, type: data.type, where: data.where, name: data.name }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询发病数
  QNumberCases({ commit }, data) {
    return new Promise((resolve, reject) => {
      QNumberCases({ time: data.time, timec: data.timec, detailed: data.detailed, type: data.type, where: data.where, name: data.name }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询死亡数
  QNumberDeaths({ commit }, data) {
    return new Promise((resolve, reject) => {
      QNumberDeaths({ time: data.time, timec: data.timec, detailed: data.detailed, type: data.type, where: data.where, name: data.name }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询周对比
  QWComparison({ commit }, data) {
    return new Promise((resolve, reject) => {
      QWComparison({ type: data.type, where: data.where, name: data.name, timz: data.timz, timx: data.timx }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询日对比
  QDComparison({ commit }, data) {
    return new Promise((resolve, reject) => {
      QDComparison({ type: data.type, where: data.where, name: data.name, timz: data.timz, timx: data.timx }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询日对比
  QMData({ commit }, data) {
    return new Promise((resolve, reject) => {
      QMData({ type: data.type, where: data.where, name: data.name, timz: data.timz, timx: data.timx }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // --------------------------------------------------------------------------------------------------------------------------
  // 查询特定病种数据
  QGDJson({ commit }, data) {
    return new Promise((resolve, reject) => {
      QGDJson({ type: data.type, name: data.name, table: data.table, where: data.where, dataType: data.dataType, time: data.time, x: data.timec }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询省名
  QName({ commit }, data) {
    return new Promise((resolve, reject) => {
      QName({ name: data }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询年份统计-确诊/重症/死亡
  QXYStatistics({ commit }, data) {
    return new Promise((resolve, reject) => {
      QXYStatistics({ name: data.name, table: data.table, where: data.where }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询时间间隔-确诊/死亡
  QXTInterval({ commit }, data) {
    return new Promise((resolve, reject) => {
      QXTInterval({ name: data.name, table: data.table, where: data.where, time: data.time, x: data.timec }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询年龄统计-确诊/重症/死亡
  QAStatistics({ commit }, data) {
    return new Promise((resolve, reject) => {
      QAStatistics({ name: data.name, table: data.table, where: data.where, time: data.time, x: data.timec }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询行政区-确诊/重症/死亡
  QXARegion({ commit }, data) {
    return new Promise((resolve, reject) => {
      QXARegion({ name: data.name, table: data.table, where: data.where, time: data.time, x: data.timec }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询季度-确诊/重症/死亡
  QXQuarter({ commit }, data) {
    return new Promise((resolve, reject) => {
      QXQuarter({ name: data.name, table: data.table, where: data.where, degree: data.degree, time: data.time, x: data.timec }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询月份-确诊/重症/死亡
  QXMonth({ commit }, data) {
    return new Promise((resolve, reject) => {
      QXMonth({ name: data.name, table: data.table, where: data.where, degree: data.degree, time: data.time, x: data.timec }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询病毒类型
  QXVType({ commit }, data) {
    return new Promise((resolve, reject) => {
      QXVType({ name: data.name, table: data.table, where: data.where, degree: data.degree, time: data.time, x: data.timec }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询人群分部
  QXCrowd({ commit }, data) {
    return new Promise((resolve, reject) => {
      QXCrowd({ name: data.name, table: data.table, where: data.where, degree: data.degree, time: data.time, x: data.timec }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询年龄组
  QXAGroup({ commit }, data) {
    return new Promise((resolve, reject) => {
      QXAGroup({ name: data.name, table: data.table, where: data.where, degree: data.degree, time: data.time, x: data.timec }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询-确诊/重症/死亡+性别
  QXJson({ commit }, data) {
    return new Promise((resolve, reject) => {
      QXJson({ name: data.name, table: data.table, where: data.where, degree: data.degree, time: data.time, x: data.timec }).then(response => {
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

