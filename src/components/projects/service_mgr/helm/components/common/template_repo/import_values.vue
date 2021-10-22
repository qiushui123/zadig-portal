<template>
  <div class="values-outer">
    <h4 style="padding-left: 40px;">values 文件</h4>
    <el-form-item label-width="0px">
      <Repertory ref="valueRepoRef" :repoSource="importRepoInfoUse.gitRepoConfig" substantial></Repertory>
    </el-form-item>
  </div>
</template>

<script>
import Repertory from '@/components/projects/common/import_values/repertory.vue'
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
  props: {
    importRepoInfo: Object
  },
  computed: {
    importRepoInfoUse () {
      let gitRepoConfig = {}
      if (!this.importRepoInfo.gitRepoConfig) {
        gitRepoConfig = { gitRepoConfig: cloneDeep(valueInfo.gitRepoConfig) }
      }
      return Object.assign(this.importRepoInfo, gitRepoConfig)
    }
  },
  methods: {
    validate () {
      return this.$refs.valueRepoRef.validate()
    },
    resetValueRepoInfo () {
      this.$refs.valueRepoRef && this.$refs.valueRepoRef.resetSource()
    }
  },
  components: {
    Repertory
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
