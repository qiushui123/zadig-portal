<template>
  <div class="import-chart-container">
    <el-form ref="form" :model="tempData" label-width="140px" :rules="rules">
      <el-form-item label="模板名称" prop="name">
        <el-input v-model="tempData.name" placeholder="请输入服务名称" size="small"></el-input>
      </el-form-item>
      <el-form-item label-width="0">
        <GitRepo
          @triggleAction="$emit('triggleAction')"
          @canUpdateEnv="$emit('canUpdateEnv')"
          :currentService="currentService"
          @input="$emit('input', $event)"
          :controlParam="controlParam"
          :value="value"
          ref="gitRepo"
          @selectPath="selectedPath($event)"
        ></GitRepo>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="createChartTemplate" :disabled="!tempData.name && disabled" size="small">加载</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import GitRepo from '../service_mgr/helm/components/common/git_repo.vue'
const controlParam = {
  hiddenCreateButton: true,
  hiddenRepoSelect: true,
  justSelectOneFile: true
}
export default {
  data () {
    return {
      tempData: {
        name: ''
      },
      disabled: true,
      rules: {
        name: [{ required: true, message: '请输入模板名称', trigger: 'blur' }]
      }
    }
  },
  props: {
    value: Boolean,
    currentService: Object
  },
  methods: {
    selectedPath (emitParams) {
      emitParams.path = emitParams.path[0]
      this.tempData = Object.assign({}, this.tempData, emitParams)
      this.disabled = false
    },
    createChartTemplate () {
      console.log('加载')
    }
  },
  components: {
    GitRepo
  },
  created () {
    this.controlParam = controlParam
  }
}
</script>

<style lang="less" scoped>
.import-chart-container {
  padding: 5px;

  .repo-attr {
    span {
      display: inline-block;
      width: 128px;
      margin-bottom: 20px;
      padding-right: 12px;
      line-height: 40px;
      text-align: right;
    }

    /deep/.el-input {
      width: 200px;
    }
  }

  /deep/.el-form-item {
    .el-form-item {
      margin-bottom: 22px;
    }
  }
}
</style>
