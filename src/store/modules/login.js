import * as types from '../mutations'
import { userLoginAPI, queryUserBindings } from '@api'
import { Message } from 'element-ui'

const state = {
  userinfo: {
    id: 0,
    name: '',
    email: '',
    password: '',
    phone: ''
  },
  role: []
}

const getters = {}

const actions = {

  async LOGIN (context, args) {
    const res = await userLoginAPI(args).catch(error => console.log(error))
    if (res) {
      localStorage.setItem('userInfo', JSON.stringify(res))
      Message({
        message: '登录成功，欢迎 ' + res.name,
        type: 'success'
      })
    }
    return Promise.resolve(res)
  },
  async LOGINOUT (context, args) {
    localStorage.removeItem('userInfo')
    Message({
      message: '登出成功',
      type: 'success'
    })
    return Promise.resolve(true)
  },
  async GETUSERINFO (context, args) {
    context.commit('INJECT_PROFILE', JSON.parse(localStorage.getItem('userInfo')))
    context.dispatch('GETUSERROLE')
  },
  async GETUSERROLE (context, args) {
    const uid = JSON.parse(localStorage.getItem('userInfo')).uid
    const res = await queryUserBindings(uid).catch(error => console.log(error))
    if (res && Array.isArray(res)) {
      context.commit('INJECT_ROLE', res.map(item => (item.role))
      )
    }
  }
}

const mutations = {
  [types.INJECT_PROFILE] (state, profile) {
    state.userinfo = profile
  },
  [types.INJECT_ROLE] (state, role) {
    state.role = role
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
