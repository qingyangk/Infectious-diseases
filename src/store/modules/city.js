import { qMask, qRange, qDatas, qZDeath, qCDHome,
  qDCDHome, qCurrentlyI, qDBed, qDVaccines, qTesting, qRanking, qDRanking,
  qRDeath, qRNDeath, qDRDeath, qDRNDeath, qHBeds, qPInfection, qCInfection, qMUtilization, qDIDetection,
  qLNews } from '@/api/city'

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
  // 查询遮罩
  qMask({ commit }, data) {
    return new Promise((resolve, reject) => {
      qMask({ name: data }).then(response => {
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询范围
  qRange({ commit }, data) {
    return new Promise((resolve, reject) => {
      qRange({ name: data }).then(response => {
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 确诊-治愈-死亡
  qDatas({ commit }, data) {
    return new Promise((resolve, reject) => {
      qDatas({ name: data.name, today: data.today, yesterday: data.yesterday }).then(response => {
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询洲确诊
  qZDeath({ commit }, data) {
    return new Promise((resolve, reject) => {
      qZDeath().then(response => {
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // IMAP
  // 查询地区确诊死亡
  qCDHome({ commit }, data) {
    return new Promise((resolve, reject) => {
      qCDHome({ name: data }).then(response => {
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询地区日增确诊死亡
  qDCDHome({ commit }, data) {
    return new Promise((resolve, reject) => {
      qDCDHome({ name: data }).then(response => {
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询地区现有确诊
  qCurrentlyI({ commit }, data) {
    return new Promise((resolve, reject) => {
      qCurrentlyI({ name: data }).then(response => {
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询地区床|新冠床|ICU床
  qDBed({ commit }, data) {
    return new Promise((resolve, reject) => {
      qDBed({ name: data.name, range: data.range }).then(response => {
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询疫苗总数|第一针|完成
  qDVaccines({ commit }, data) {
    return new Promise((resolve, reject) => {
      qDVaccines({ name: data.name, range: data.range }).then(response => {
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询阳性阴性
  qTesting({ commit }, data) {
    return new Promise((resolve, reject) => {
      qTesting({ name: data.name, range: data.range }).then(response => {
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询排名
  qRanking({ commit }, data) {
    return new Promise((resolve, reject) => {
      qRanking({ name: data.name, range: data.range, time: data.time }).then(response => {
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询日排名
  qDRanking({ commit }, data) {
    return new Promise((resolve, reject) => {
      qDRanking({ name: data.name, range: data.range, time: data.time }).then(response => {
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 预测
  // 查询报告死亡
  qRDeath({ commit }, data) {
    return new Promise((resolve, reject) => {
      qRDeath({ name: data }).then(response => {
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询报告死亡未报告死亡
  qRNDeath({ commit }, data) {
    return new Promise((resolve, reject) => {
      qRNDeath({ name: data }).then(response => {
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询日报告死亡
  qDRDeath({ commit }, data) {
    return new Promise((resolve, reject) => {
      qDRDeath({ name: data }).then(response => {
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询日报告死亡未报告死亡
  qDRNDeath({ commit }, data) {
    return new Promise((resolve, reject) => {
      qDRNDeath({ name: data }).then(response => {
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询医院所有床位|ICU床位
  qHBeds({ commit }, data) {
    return new Promise((resolve, reject) => {
      qHBeds({ name: data }).then(response => {
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询预测感染
  qPInfection({ commit }, data) {
    return new Promise((resolve, reject) => {
      qPInfection({ name: data }).then(response => {
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询确认感染|检测
  qCInfection({ commit }, data) {
    return new Promise((resolve, reject) => {
      qCInfection({ name: data }).then(response => {
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询口罩利用
  qMUtilization({ commit }, data) {
    return new Promise((resolve, reject) => {
      qMUtilization({ name: data }).then(response => {
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询日常感染和检测
  qDIDetection({ commit }, data) {
    return new Promise((resolve, reject) => {
      qDIDetection({ name: data }).then(response => {
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询最新资讯
  qLNews({ commit }, data) {
    return new Promise((resolve, reject) => {
      qLNews().then(response => {
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
