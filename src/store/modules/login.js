import * as types from '../mutations'
import { userLoginAPI, queryUserBindings } from '@api'
import { Message } from 'element-ui'
import { parseJwt } from '@/utilities/jwt'
import store from 'storejs'

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
  OTHERLOGIN (context, token) { // 第三方登录
    const info = parseJwt(token)
    const res = { ...info, token: token }
    store.set('userInfo', res)
    Message({
      message: '登录成功，欢迎 ' + res.name,
      type: 'success'
    })
    return Promise.resolve(true)
  },
  async LOGIN (context, args) {
    const userInfo = await userLoginAPI(args).catch(error => console.log(error))
    if (userInfo) {
      store.set('userInfo', userInfo) // 存储用户信息，包括 Token
      const roleBinding = await queryUserBindings(userInfo.uid).catch(error => console.log(error))
      if (roleBinding) {
        store.set('role', roleBinding) // 存储用户角色信息
        Message({
          message: '登录成功，欢迎 ' + userInfo.account,
          type: 'success'
        })
      }
    }
    return Promise.resolve(userInfo)
  },
  async LOGINOUT (context, args) {
    store.remove('userInfo')
    store.remove('role')

    Message({
      message: '登出成功',
      type: 'success'
    })
    return Promise.resolve(true)
  },
  async GETUSERINFO (context, args) {
    context.commit('INJECT_PROFILE', store.get('userInfo'))
    context.commit('INJECT_ROLE', store.get('role').map(item => (item.role)))
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
