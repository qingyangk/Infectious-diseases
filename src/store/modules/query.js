import { QSFQuery, QSCQuery, QSPQuery, QAStatistics, QYStatistics, QRStatistics, QPType, QAGroup } from '@/api/query'

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
  // 查询统计-模糊查询
  QSFQuery({ commit }, data) {
    return new Promise((resolve, reject) => {
      QSFQuery({ table: data.table, where: data.where, name: data.name, vague: data.vague, pageNum: data.pageNum, pageSize: data.pageSize }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询统计-条件查询
  QSCQuery({ commit }, data) {
    return new Promise((resolve, reject) => {
      QSCQuery({ table: data.table, where: data.where, name: data.name, type: data.type, condition: data.condition, QContent: data.QContent, pageNum: data.pageNum, pageSize: data.pageSize, timz: data.timz, timx: data.timx }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询统计-条件查询
  QSPQuery({ commit }, data) {
    return new Promise((resolve, reject) => {
      QSPQuery({ table: data.table, where: data.where, name: data.name, x: data.x, y: data.y, radius: data.radius, timz: data.timz, timx: data.timx }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询统计-年份统计
  QAStatistics({ commit }, data) {
    return new Promise((resolve, reject) => {
      QAStatistics({ table: data.table, where: data.where, name: data.name, type: data.type, condition: data.condition, QContent: data.QContent, timz: data.timz, timx: data.timx }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询统计-年龄统计
  QYStatistics({ commit }, data) {
    return new Promise((resolve, reject) => {
      QYStatistics({ table: data.table, where: data.where, name: data.name, type: data.type, condition: data.condition, QContent: data.QContent, timz: data.timz, timx: data.timx }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询统计-区域统计
  QRStatistics({ commit }, data) {
    return new Promise((resolve, reject) => {
      QRStatistics({ table: data.table, where: data.where, name: data.name, type: data.type, condition: data.condition, QContent: data.QContent, timz: data.timz, timx: data.timx }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询统计-人群统计
  QPType({ commit }, data) {
    return new Promise((resolve, reject) => {
      QPType({ table: data.table, where: data.where, name: data.name, type: data.type, condition: data.condition, QContent: data.QContent, timz: data.timz, timx: data.timx }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询统计-年龄段统计
  QAGroup({ commit }, data) {
    return new Promise((resolve, reject) => {
      QAGroup({ table: data.table, where: data.where, name: data.name, type: data.type, condition: data.condition, QContent: data.QContent, timz: data.timz, timx: data.timx }).then(response => {
        // const { dates } = response
        resolve(response.dates)
      }).catch(error => {
        reject(error)
      })
    })
  }
  // // 更新病例
  // QSUCase({ commit }, data) {
  //   return new Promise((resolve, reject) => {
  //     QSUCase({ OBJECTID: data.OBJECTID, number: data.number, gender: data.gender, birth: data.birth, age: data.age,
  //       workunit: data.workunit, contact: data.contact, belong: data.belong, addressgb: data.addressgb, address: data.address,
  //       population: data.population, case: data.case, dateonset: data.dateonset, diacrisis: data.diacrisis, death: data.death,
  //       disease: data.disease, reporting: data.reporting, unittype: data.unittype, laboratory: data.laboratory, severe: data.severe,
  //       remarks: data.remarks }).then(response => {
  //       // const { dates } = response
  //       resolve(response.dates)
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
