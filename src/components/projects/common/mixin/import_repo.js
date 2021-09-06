import {
  getCodeSourceAPI,
  getRepoNameByIdAPI,
  getRepoOwnerByIdAPI,
  getBranchInfoByIdAPI
} from '@api'
import { cloneDeep } from 'lodash'
const sourceRules = {
  codehostId: [{
    required: true,
    message: '平台不能为空',
    trigger: 'change'
  }],
  repoOwner: [{
    required: true,
    message: '代码库拥有者不能为空',
    trigger: 'change'
  }],
  repoName: [{
    required: true,
    message: '名称不能为空',
    trigger: 'change'
  }],
  branchName: [{
    required: true,
    message: '分支不能为空',
    trigger: 'change'
  }]
}
export default {
  data () {
    return {
      allCodeHosts: [],
      source: {
        codehostId: null,
        repoOwner: '',
        repoName: '',
        branchName: ''
      },
      codeInfo: {
        repoOwners: [],
        repos: [],
        branches: []
      }
    }
  },
  methods: {
    async queryCodeSource () {
      const res = await getCodeSourceAPI().catch(error => console.log(error))
      if (res) {
        this.allCodeHosts = res
      }
    },
    async queryRepoOwnerById (id, key = '') {
      this.source.repoOwner = ''
      this.source.repoName = ''
      this.source.branchName = ''
      const res = await getRepoOwnerByIdAPI(id, key).catch(error =>
        console.log(error)
      )
      if (res) {
        this.codeInfo.repoOwners = res
      }
    },
    getRepoNameById (id, repoOwner, key = '') {
      this.source.repoName = ''
      this.source.branchName = ''
      const item = this.codeInfo.repoOwners.find(item => {
        return item.path === repoOwner
      })
      const type = item ? item.kind : 'group'
      this.$refs.repoForm.clearValidate()
      getRepoNameByIdAPI(id, type, encodeURI(repoOwner), key).then(res => {
        this.$set(this.codeInfo, 'repos', res)
      })
    },
    getBranchInfoById (id, repoOwner, repoName) {
      this.source.branchName = ''
      if (repoName && repoOwner) {
        getBranchInfoByIdAPI(id, repoOwner, repoName).then(res => {
          this.$set(this.codeInfo, 'branches', res)
        })
      }
    },
    async searchProject (query) {
      const repoOwner = this.source.repoOwner
      const item = this.codeInfo.repoOwners.find(item => {
        return item.path === repoOwner
      })
      const type = item ? item.kind : 'group'
      const id = this.source.codehostId
      const res = await getRepoNameByIdAPI(
        id,
        type,
        encodeURI(repoOwner),
        query
      ).catch(error => console.log(error))
      if (res) {
        this.codeInfo.repos = res
      }
    },
    selectedRepoChange () {
      this.$emit('selectedRepoChange', cloneDeep(this.source))
    },
    validate () {
      return this.$refs.repoForm.validate()
    }
  },
  created () {
    this.sourceRules = sourceRules
    this.queryCodeSource()
  }
}
