import { upTable } from '@/api/data'


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
    // 保存表格数据
    upTable({ commit }, data) {
        return new Promise((resolve, reject) => {
            upTable({ OBJECTID: data.OBJECTID }).then(response => {
                // const { dates } = response
                resolve(response.dates)
            }).catch(error => {
                reject(error)
            })
        })
    }
}