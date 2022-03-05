import { CSTData, CSPInformation, CSPTrajectory, CSBuffer, DCBPlace, ICBPlace, UCBPlace } from '@/api/communication'

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
  // 查询今日感染人员数据
  CSTData({ commit }, data) {
    return new Promise((resolve, reject) => {
      CSTData({ where: data.where, name: data.name, timz: data.timz, timx: data.timx }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询个人详细信息
  CSPInformation({ commit }, data) {
    return new Promise((resolve, reject) => {
      CSPInformation({ id: data.id, where: data.where, name: data.name }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询个人轨迹
  CSPTrajectory({ commit }, data) {
    return new Promise((resolve, reject) => {
      CSPTrajectory({ id: data.id, where: data.where, name: data.name, timz: data.timz, timx: data.timx }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询某时间段在缓冲区内的数据
  CSBuffer({ commit }, data) {
    return new Promise((resolve, reject) => {
      CSBuffer({ id: data.id, where: data.where, name: data.name, x: data.x, y: data.y, radius: data.radius, timz: data.timz, timx: data.timx }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 删除错误地点
  DCBPlace({ commit }, data) {
    return new Promise((resolve, reject) => {
      DCBPlace({ id: data.id, value: data.value, where: data.where, name: data.name }).then(response => {
        // const { dates } = response
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 新增正确地点
  ICBPlace({ commit }, data) {
    return new Promise((resolve, reject) => {
      ICBPlace({ where: data.where, name: data.name, id: data.id, time: data.time, x: data.x, y: data.y, value: data.value }).then(response => {
        // const { dates } = response
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 更新错误地点
  UCBPlace({ commit }, data) {
    return new Promise((resolve, reject) => {
      UCBPlace({ id: data.id, value: data.value, where: data.where, name: data.name, newx: data.newx, newy: data.newy, newvalue: data.newvalue, time: data.time }).then(response => {
        // const { dates } = response
        resolve(response)
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
