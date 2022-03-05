import { login, logout, getInfo } from '@/api/user'
import { getUser, getToken, setToken, removeToken } from '@/utils/auth'
import { Message } from 'element-ui'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    email: getUser(),
    system: '',
    name: '',
    avatar: '',
    roles: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_SYSTEM: (state, system) => {
    state.system = system
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_POWER: (state, power) => {
    state.power = power
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, system } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, system: system }).then(response => {
        const { dates } = response
        Message({
          showClose: true,
          message: response.msg,
          type: response.type,
          duration: 3 * 1000
        })
        commit('SET_TOKEN', dates.token)
        commit('SET_SYSTEM', dates.system)
        commit('SET_EMAIL', dates.username)
        setToken(dates.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo({ username: state.email }).then(response => {
        const { dates } = response
        commit('SET_ROLES', dates.roles)
        commit('SET_POWER', dates.power)
        commit('SET_NAME', dates.name)
        commit('SET_AVATAR', dates.avatar)
        resolve(dates)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then((response) => {
        commit('SET_TOKEN', '')
        removeToken()
        resetRouter()
        var storage = window.localStorage
        storage.clear()
        window.sessionStorage.clear()
        Message({
          showClose: true,
          message: response.msg,
          type: response.type,
          duration: 3 * 1000
        })
        location.reload()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken() // must remove  token  first
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

