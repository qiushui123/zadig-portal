import * as types from '../mutations'
import { listWorkflowAPI } from '@api'
const workflow = { SET_WORKFLOW_LIST_LOADING: 'SET_WORKFLOW_LIST_LOADING' }

const state = {
  workflowList: [],
  workflowListLoading: false
}

const getters = {
  workflowList: (state) => {
    return state.workflowList
  },
  workflowListLoading: (state) => {
    return state.workflowListLoading
  }
}

const mutations = {
  [types.SET_WORKFLOW_LIST] (state, payload) {
    state.workflowList = payload
  },
  [workflow.SET_WORKFLOW_LIST_LOADING] (state, payload) {
    state.workflowListLoading = payload
  }
}

// last getWorkflowList data that use the first
let requestStarted = false
let resolveGet
const theGetPromise = new Promise((resolve, reject) => {
  resolveGet = resolve
})

const actions = {
  getWorkflowList ({ commit, state }, projectName) {
    if (requestStarted) {
      return theGetPromise
    } else {
      requestStarted = true
      return doGet({ commit, state }, projectName)
    }
  },
  refreshWorkflowList ({ commit, state }, projectName) {
    return doGet({ commit, state }, projectName)
  }
}

function doGet ({ commit, state }, projectName) {
  if (state.workflowListLoading) {
    return resolveGet()
  }
  commit(workflow.SET_WORKFLOW_LIST_LOADING, true)
  return listWorkflowAPI(projectName).then((res) => {
    res.forEach((element) => {
      element.type = 'product'
    })
    commit(types.SET_WORKFLOW_LIST, res)
    commit(workflow.SET_WORKFLOW_LIST_LOADING, false)
    resolveGet()
  })
}

export default {
  state,
  getters,
  actions,
  mutations
}
