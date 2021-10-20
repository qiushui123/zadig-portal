import * as types from '../mutations'

const state = {
  permissionList: {
    'zly-pm': ['/project/view/workflow', '/project/action/editWorkflow']
  }
}

const getters = {}

const actions = {
  async getPermissionList ({ commit, state }, payload) {
    const projectName = payload.projectName
    if (state.permissionList[projectName]) {
      return Promise.resolve(state.permissionList[projectName])
    } else {
    //   const res = await
    //   if (res) {
    //     return Promise.resolve(res)
    //   }
    }
  }
}

const mutations = {
  [types.INJECT_PROFILE] (state, profile) {

  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
