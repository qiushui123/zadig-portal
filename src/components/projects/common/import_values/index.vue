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
        <el-select v-model="tempSelect" size="small">
          <el-option label="Git 仓库" value="gitRepo"></el-option>
          <el-option label="手动输入" value="manualInput"></el-option>
        </el-select>
      </template>
      <template>
        <div class="title">仓库信息</div>
        <Resize v-if="tempSelect === 'manualInput'" class="mirror" :resize="resize.direction" :height="resize.height">
          <codemirror v-model="yamlValue"></codemirror>
        </Resize>
        <ValueRepo
          v-else
          ref="valueRepo"
          :valueRepoInfo.sync="valueRepoInfo"
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
  codehostID: null,
  owner: '',
  repo: '',
  branch: '',
  valuesPaths: [{ path: '', yaml: '' }]
}

export default {
  data () {
    return {
      tempSelect: 'gitRepo' // manualInput
    }
  },
  props: {
    value: Boolean,
    yaml: String,
    gitInfo: Object,
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
    }
  },
  computed: {
    yamlValue: {
      get () {
        return this.yaml || ''
      },
      set (val) {
        this.$emit('update:yaml', val)
        return val
      }
    },
    valueRepoInfo: {
      get () {
        console.log('index:', this.gitInfo)
        return Object.assign({}, valueInfo, this.gitInfo)
      },
      set (val) {
        console.log('set index:', this.gitInfo)
        this.$emit('update:gitInfo', val)
        return val
      }
    }
  },
  watch: {
    value (newV) {
      if (!newV) {
        this.$refs.valueRepo && this.$refs.valueRepo.resetSource(this.valueRepoInfo)
      }
    }
  },
  methods: {
    validate () {
      if (this.tempSelect === 'gitRepo') {
        const valueRepo = this.$refs.valueRepo
        return Promise.all([Promise.resolve('gitRepo'), valueRepo.validate(), valueRepo.validateRoute()])
      } else {
        return Promise.all([Promise.resolve('manualInput')])
      }
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
  }

  /deep/.el-select {
    width: 100%;
  }
}
</style>
