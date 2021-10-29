import * as types from '../mutations'
import { getProductsAPI } from '../../api'
import { orderBy } from 'lodash'
const state = {
  productList: []
}

const getters = {
  productList: (state) => {
    return state.productList
  },
  getOnboardingTemplates: (state) => {
    return state.productList
      .filter((temp) => {
        return temp.onboarding_status
      })
  }
}

const mutations = {
  [types.SET_PROJECT_LIST] (state, payload) {
    state.productList = payload
  }
}

const actions = {
  async getProjectList ({ commit, state, rootGetters }) {
    return await getProductsAPI().then(
      (res) => {
        const result = orderBy(res, 'name')
        commit(types.SET_PROJECT_LIST, result)
      }
    )
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
