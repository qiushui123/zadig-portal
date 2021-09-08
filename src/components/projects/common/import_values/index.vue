<template>
  <div class="values-outer">
    <h4>
      <span>values 文件</span>
      <i v-if="showDelete" class="el-icon-delete-solid icon-delete" @click="$emit('closeValueEdit')"></i>
    </h4>
    <el-divider></el-divider>
    <div class="desc">
      <template>
        <div class="title">文件来源</div>
        <el-select v-model="importRepoInfoUse.yamlSource" size="small">
          <el-option label="Git 仓库" value="gitRepo"></el-option>
          <el-option label="手动输入" value="freeEdit"></el-option>
          <el-option label="使用默认" value="default"></el-option>
        </el-select>
      </template>
      <template v-if="importRepoInfoUse.yamlSource !== 'default'">
        <div class="title">仓库信息</div>
        <Resize v-if="importRepoInfoUse.yamlSource === 'freeEdit'" class="mirror" :resize="resize.direction" :height="resize.height">
          <codemirror v-model="this.importRepoInfoUse.valuesYaml"></codemirror>
        </Resize>
        <ValueRepo
          v-if="importRepoInfoUse.yamlSource === 'gitRepo'"
          ref="valueRepo"
          :valueRepoInfo="importRepoInfoUse.gitRepoConfigs"
          @update:valueRepoInfo="importRepoInfoUse.gitRepoConfigs = $event"
        ></ValueRepo>
      </template>
    </div>
  </div>
</template>

<script>
import Resize from '@/components/common/resize'
import Codemirror from '../codemirror.vue'
import ValueRepo from './value_repo.vue'

const valueInfo = {
  yamlSource: '', // gitRepo or freeEdit or default
  valuesYaml: '',
  gitRepoConfigs: {
    codehostID: null,
    owner: '',
    repo: '',
    branch: '',
    valuesPaths: [{ path: '', yaml: '' }]
  }
}

export default {
  data () {
    return {}
  },
  props: {
    showDelete: {
      default: false,
      type: Boolean
    },
    resize: {
      type: Object,
      default: () => {
        return {
          height: '300px',
          direction: 'none'
        }
      }
    },
    importRepoInfo: Object
  },
  computed: {
    importRepoInfoUse: {
      get () {
        let gitRepoConfigs = {}
        if (!this.importRepoInfo.gitRepoConfigs) {
          gitRepoConfigs = { gitRepoConfigs: valueInfo.gitRepoConfigs }
        }
        console.log('importRepoInfoUse index:', this.importRepoInfo)
        return Object.assign(this.importRepoInfo, gitRepoConfigs)
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
      this.$nextTick(() => {
        if (this.importRepoInfoUse.yamlSource === 'gitRepo') {
          this.$refs.valueRepo.resetSource(
            this.importRepoInfoUse.gitRepoConfigs
          )
        }
      })
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
  /deep/ .el-divider--horizontal {
    margin: 12px 0;
  }

  padding: 10px;
  line-height: 1;

  .title {
    padding: 10px 0;
  }

  h4 {
    margin: 7px 0;
    color: #606266;
    font-size: 14px;

    .icon-delete {
      float: right;
      cursor: pointer;
    }
  }

  .desc {
    color: #a1a3a7;
    font-size: 14px;

    /deep/.el-input {
      .el-input__inner {
        width: 100%;
      }
    }
  }

  /deep/.el-select {
    width: 100%;
  }
}
</style>
