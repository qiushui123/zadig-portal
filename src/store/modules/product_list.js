import * as types from '../mutations'
import { productTemplatesAPI } from '../../api'
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
  [types.SET_PRODUCT_LIST] (state, payload) {
    state.productList = payload
  }
}

const actions = {
  async getProductList ({ commit, state, rootGetters }) {
    return await productTemplatesAPI().then(
      (res) => {
        const result = orderBy(res, 'name')
        commit(types.SET_PRODUCT_LIST, result)
      }
    )
  },
  refreshProductList ({ commit, state, rootGetters, dispatch }) {
    commit(types.SET_PRODUCT_LIST, [])
    return dispatch('getProductList')
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
