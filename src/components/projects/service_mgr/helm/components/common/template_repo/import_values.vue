<template>
  <div class="values-outer">
    <h4 style="padding-left: 40px;">values 文件</h4>
    <el-form-item label-width="0px">
      <ValueRepo ref="valueRepo" :valueRepoInfo.sync="importRepoInfoUse.gitRepoConfig" substantial></ValueRepo>
    </el-form-item>
  </div>
</template>

<script>
import ValueRepo from '@/components/projects/common/import_values/value_repo.vue'
import { cloneDeep } from 'lodash'

const valueInfo = {
  gitRepoConfig: {
    codehostID: null,
    owner: '',
    repo: '',
    branch: '',
    valuesPaths: []
  }
}

export default {
  data () {
    return {}
  },
  props: {
    importRepoInfo: Object
  },
  computed: {
    importRepoInfoUse: {
      get () {
        let gitRepoConfig = {}
        if (!this.importRepoInfo.gitRepoConfig) {
          gitRepoConfig = { gitRepoConfig: cloneDeep(valueInfo.gitRepoConfig) }
        }
        return Object.assign(this.importRepoInfo, gitRepoConfig)
      },
      set (val) {
        this.$emit('update:importRepoInfo', val)
        return val
      }
    }
  },
  methods: {
    validate () {
      const valueRepo = this.$refs.valueRepo
      return Promise.all([valueRepo.validate(), valueRepo.validateRoute()])
    },
    resetValueRepoInfo () {
      this.$refs.valueRepo && this.$refs.valueRepo.resetSource()
    }
  },
  components: {
    ValueRepo
  }
}
</script>

<style lang="less" scoped>
.values-outer {
  margin-top: 10px;
  color: #606266;
  font-size: 14px;
  line-height: 1;

  /deep/.el-input {
    .el-input__inner {
      width: 100%;
    }
  }

  /deep/.el-select {
    width: 100%;
  }
}
</style>
