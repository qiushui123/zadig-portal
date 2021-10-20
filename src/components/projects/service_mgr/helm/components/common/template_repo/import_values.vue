<template>
  <div class="values-outer">
    <el-form-item label="文件来源" class="margin-bottom-0">
      <el-select v-model="importRepoInfoUse.yamlSource" size="small" :disabled="substantial">
        <el-option label="Git 仓库" value="gitRepo"></el-option>
        <el-option label="手动输入" value="freeEdit"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="文件内容" v-if="importRepoInfoUse.yamlSource === 'freeEdit'">
      <Resize class="mirror" height="204px">
        <codemirror v-model="importRepoInfoUse.valuesYAML"></codemirror>
      </Resize>
    </el-form-item>
    <el-form-item v-if="importRepoInfoUse.yamlSource === 'gitRepo'" label-width="0px">
      <ValueRepo ref="valueRepo" :valueRepoInfo.sync="importRepoInfoUse.gitRepoConfig" :substantial="substantial"></ValueRepo>
    </el-form-item>
  </div>
</template>

<script>
import Resize from '@/components/common/resize'
import Codemirror from '@/components/projects/common/codemirror.vue'
import ValueRepo from '@/components/projects/common/import_values/value_repo.vue'
import { cloneDeep } from 'lodash'

const valueInfo = {
  yamlSource: '', // gitRepo or freeEdit
  valuesYAML: '',
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
    importRepoInfo: Object,
    substantial: Boolean
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
      if (this.importRepoInfoUse.yamlSource === 'gitRepo') {
        const valueRepo = this.$refs.valueRepo
        return Promise.all([valueRepo.validate(), valueRepo.validateRoute()])
      } else {
        return Promise.all([Promise.resolve(true)])
      }
    },
    resetValueRepoInfo () {
      this.$refs.valueRepo && this.$refs.valueRepo.resetSource()
      this.showErrorTip = false
    }
  },
  components: {
    Codemirror,
    Resize,
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

  /deep/.el-form-item.margin-bottom-0 {
    margin-bottom: 0;
  }

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
