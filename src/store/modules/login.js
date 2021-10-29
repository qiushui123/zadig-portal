import * as types from '../mutations'
import { userLoginAPI, queryUserBindings } from '@api'
import { Message } from 'element-ui'
import { parseJwt } from '@/utilities/jwt'

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
    localStorage.setItem('userInfo', JSON.stringify(res))
    Message({
      message: '登录成功，欢迎 ' + res.name,
      type: 'success'
    })
    return Promise.resolve(true)
  },
  async LOGIN (context, args) {
    const res = await userLoginAPI(args).catch(error => console.log(error))
    localStorage.setItem('userInfo', JSON.stringify(res)) // 存储用户信息
    const res1 = await queryUserBindings(res.uid).catch(error => console.log(error))
    if (res && res1) {
      localStorage.setItem('role', JSON.stringify(res1)) // 存储用户角色信息
      Message({
        message: '登录成功，欢迎 ' + res.name,
        type: 'success'
      })
    }
    return Promise.resolve(res)
  },
  async LOGINOUT (context, args) {
    localStorage.removeItem('userInfo')
    localStorage.removeItem('role')

    Message({
      message: '登出成功',
      type: 'success'
    })
    return Promise.resolve(true)
  },
  async GETUSERINFO (context, args) {
    context.commit('INJECT_PROFILE', JSON.parse(localStorage.getItem('userInfo')))
    context.commit('INJECT_ROLE', JSON.parse(localStorage.getItem('role')).map(item => (item.role)))
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
