import { QPCondition, QHCondition, QCBroadcasting, QQuery, QQuarantine, QTrajectory,
  RQuarters, NOVaccinations, QTPopulation, QTVaccinations, QNOHVaccinations, QVType, QCVRate, QCStroke,
  ClockIn, CClockIn, CHistory, GUser } from '@/api/ncity'

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
  // 查询城市-当前体温/血压/心率
  QPCondition({ commit }, data) {
    return new Promise((resolve, reject) => {
      QPCondition({ where: data.where, name: data.name, timx: data.timx, timz: data.timz, monitor: data.monitor, wenduga: data.wenduga, wendudi: data.wendudi, xinlvga: data.xinlvga, xinlvdi: data.xinlvdi, xueygga: data.xueygga, xueygdi: data.xueygdi, xueydga: data.xueydga, xueyddi: data.xueyddi }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询城市-历史体温/血压/心率
  QHCondition({ commit }, data) {
    return new Promise((resolve, reject) => {
      QHCondition({ where: data.where, name: data.name, timx: data.timx, timz: data.timz, type: data.type, monitor: data.monitor, wenduga: data.wenduga, wendudi: data.wendudi, xinlvga: data.xinlvga, xinlvdi: data.xinlvdi, xueygga: data.xueygga, xueygdi: data.xueygdi, xueydga: data.xueydga, xueyddi: data.xueyddi }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询城市-播报
  QCBroadcasting({ commit }, data) {
    return new Promise((resolve, reject) => {
      QCBroadcasting({ where: data.where, name: data.name, timx: data.timx, timz: data.timz, monitor: data.monitor }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询城市-查询
  QQuery({ commit }, data) {
    return new Promise((resolve, reject) => {
      QQuery({ ID: data.ID, timx: data.timx, timz: data.timz }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询城市-隔离人员
  QQuarantine({ commit }, data) {
    return new Promise((resolve, reject) => {
      QQuarantine({ where: data.where, name: data.name, timx: data.timx, timz: data.timz }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询隔离人员-轨迹
  QTrajectory({ commit }, data) {
    return new Promise((resolve, reject) => {
      QTrajectory({ where: data.where, name: data.name, id: data.id, timx: data.timx, timz: data.timz }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 行程监测-------------------------------------------------------------
  // 查询小区打卡数
  RQuarters({ commit }, data) {
    return new Promise((resolve, reject) => {
      RQuarters({ where: data.where, name: data.name, timx: data.timx, timz: data.timz }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 行程监测-------------------------------------------------------------
  // 查询小区接种疫苗数
  NOVaccinations({ commit }, data) {
    return new Promise((resolve, reject) => {
      NOVaccinations({ where: data.where, name: data.name, type: data.type, timx: data.timx, timz: data.timz }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询小区总人口
  QTPopulation({ commit }, data) {
    return new Promise((resolve, reject) => {
      QTPopulation({ where: data.where, name: data.name, type: data.type }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询小区总接种疫苗数
  QTVaccinations({ commit }, data) {
    return new Promise((resolve, reject) => {
      QTVaccinations({ where: data.where, name: data.name, type: data.type }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询医院接种数
  QNOHVaccinations({ commit }, data) {
    return new Promise((resolve, reject) => {
      QNOHVaccinations({ where: data.where, name: data.name, type: data.type }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询疫苗种类
  QVType({ commit }, data) {
    return new Promise((resolve, reject) => {
      QVType({ where: data.where, name: data.name, type: data.type }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询疫苗种类
  QCVRate({ commit }, data) {
    return new Promise((resolve, reject) => {
      QCVRate({ where: data.where, name: data.name, type: data.type, timx: data.timx }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询画圈行程
  QCStroke({ commit }, data) {
    return new Promise((resolve, reject) => {
      QCStroke({ where: data.where, name: data.name, range: data.range, timx: data.timx, timz: data.timz }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询画圈行程
  ClockIn({ commit }, data) {
    return new Promise((resolve, reject) => {
      ClockIn({ where: data.where, name: data.name, timx: data.timx, timz: data.timz }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询画圈行程
  CClockIn({ commit }, data) {
    return new Promise((resolve, reject) => {
      CClockIn({ where: data.where, name: data.name, timx: data.timx, timz: data.timz }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询个人历史体温
  CHistory({ commit }, data) {
    return new Promise((resolve, reject) => {
      CHistory({ where: data.where, name: data.name, email: data.email, timx: data.timx, timz: data.timz }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询用户名用户
  GUser({ commit }, data) {
    return new Promise((resolve, reject) => {
      GUser({ where: data.where, name: data.name, value: data.value }).then(response => {
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
