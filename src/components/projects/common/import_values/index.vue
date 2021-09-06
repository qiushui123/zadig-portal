<template>
  <div class="values-outer">
    <div class="yaml-container">
      <h4>
        <span>{{ fileName }}</span>
        <i v-if="showDelete" class="el-icon-delete-solid icon-delete" @click="hiddenValueEdit"></i>
      </h4>
      <el-divider></el-divider>
      <div class="desc">
        <template>
          <div class="title">文件来源</div>
          <el-select v-model="tempSelect" size="small">
            <el-option label="Git 仓库" value="gitRepo"></el-option>
            <el-option label="手动输入" value="manualInput"></el-option>
          </el-select>
        </template>
        <template>
          <div class="title">仓库信息</div>
          <Resize v-if="tempSelect === 'manualInput'" class="mirror" :resize="resize" :height="height">
            <codemirror :value="yamlValue" @input="handleInput"></codemirror>
          </Resize>
          <ValueRepo v-else ref="valueRepo" :currentService="currentService" :valuesPaths="valuesPaths" @selectedRepoChange="selectedRepoChange($event)"></ValueRepo>
        </template>
      </div>
    </div>

    <!-- 底部的添加键值对 -->
    <key-value v-if="showKeyValue"></key-value>
  </div>
</template>

<script>
import Resize from '@/components/common/resize'
import Codemirror from '../codemirror.vue'
import KeyValue from './key_value.vue'
import ValueRepo from './value_repo.vue'

export default {
  data () {
    return {
      currentService: null,
      tempSelect: 'gitRepo' // manualInput
    }
  },
  props: {
    fileName: {
      default: 'values 文件',
      type: String
    },
    yaml: String,
    showKeyValue: {
      default: false,
      type: Boolean
    },
    showDelete: {
      default: false,
      type: Boolean
    },
    height: {
      default: '300px',
      type: String
    },
    resize: {
      default: 'none',
      type: String
    },
    valuesPaths: Array
  },
  computed: {
    yamlValue: {
      get () {
        return this.yaml || ''
      },
      set (val) {
        return val
      }
    }
  },
  methods: {
    handleInput (code) {
      this.yamlValue = code
      this.$emit('update:yaml', code)
    },
    hiddenValueEdit () {
      this.$emit('closeValueEdit')
    },
    selectedRepoChange (data) {
      this.currentService = {
        codehostID: data.codehostId,
        branch: data.branchName,
        repo: data.repoName,
        owner: data.repoOwner
      }
      this.$emit('updateRepoInfo', this.currentService)
    },
    validate () {
      if (this.tempSelect === 'gitRepo') {
        const valueRepo = this.$refs.valueRepo
        return Promise.all([valueRepo.validate(), valueRepo.validateRoute()])
      } else {
        return Promise.resolve('true')
      }
    }
  },
  components: {
    Codemirror,
    KeyValue,
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

  .yaml-container {
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
    }
  }
}
</style>
