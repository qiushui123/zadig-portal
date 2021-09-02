<template>
  <div class="import-chart-container">
    <el-form ref="form" :model="tempData" label-width="140px" :rules="rules">
      <el-form-item label="模板名称" prop="serviceName">
        <el-input v-model="tempData.serviceName" placeholder="请输入服务名称" size="small"></el-input>
      </el-form-item>
    </el-form>
    <GitRepo
      @triggleAction="$emit('triggleAction')"
      @canUpdateEnv="$emit('canUpdateEnv')"
      :currentService="currentService"
      @input="$emit('input', $event)"
      :value="value"
      ref="gitRepo"
    ></GitRepo>
  </div>
</template>

<script>
import GitRepo from '../service_mgr/helm/components/common/git_repo.vue'
export default {
  data () {
    return {
      tempData: {
        serviceName: ''
      }
    }
  },
  props: {
    value: Boolean,
    currentService: Object
  },
  components: {
    GitRepo
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
}
</style>
