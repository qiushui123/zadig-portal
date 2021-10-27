<template>
  <div class="form-code-container">
    <div class="create-origin">
      <span>服务配置来源</span>
      <el-radio-group v-model="tabName" :disabled="isUpdate">
        <el-radio label="git">Git 仓库</el-radio>
        <el-radio label="chart" disabled>Chart 仓库</el-radio>
        <el-radio label="template">模板库</el-radio>
      </el-radio-group>
    </div>

    <GitRepo
      v-show="tabName === 'git'"
      @triggleAction="$emit('triggleAction')"
      @canUpdateEnv="$emit('canUpdateEnv', $event)"
      :currentService="gitCurrentService"
      @input="$emit('input', $event)"
      :value="value"
      ref="gitRepo"
    ></GitRepo>

    <ChartRepo
      v-show="tabName === 'chart'"
      @canUpdateEnv="$emit('canUpdateEnv', $event)"
      :currentService="chartCurrentService"
      @input="$emit('input', $event)"
      :value="value"
      ref="chartRepo"
    ></ChartRepo>

    <TemplateRepo
      v-show="tabName === 'template'"
      @canUpdateEnv="$emit('canUpdateEnv', $event)"
      @input="$emit('input', $event)"
      :currentService="templateCurrentService"
      :value="value"
      ref="templateRepo"
    ></TemplateRepo>
  </div>
</template>
<script>
import GitRepo from './git_repo.vue'
import ChartRepo from './chart_repo.vue'
import TemplateRepo from './template_repo.vue'
export default {
  data () {
    return {
      tabName: '',
      gitCurrentService: null,
      chartCurrentService: null,
      templateCurrentService: null,
      isUpdate: false
    }
  },
  props: {
    value: Boolean,
    currentService: Object
  },
  watch: {
    value: {
      handler (val) {
        this.gitCurrentService = null
        this.chartCurrentService = null
        this.templateCurrentService = null
        if (val) {
          const cs = this.currentService
          this.tabName = 'git'
          this.gitCurrentService = cs
          if (cs) {
            this.isUpdate = true
            if (cs.source && cs.source === 'chartTemplate') {
              this.tabName = 'template'
              this.templateCurrentService = cs
            }
          } else {
            this.isUpdate = false
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    closeSelectRepo () {
      this.$refs.gitRepo.closeSelectRepo()
      this.$refs.chartRepo.closeSelectRepo()
      this.$refs.templateRepo.closeSelectRepo()
    }
  },
  components: {
    GitRepo,
    ChartRepo,
    TemplateRepo
  }
}
</script>
<style lang="less" scoped>
.form-code-container {
  .create-origin {
    span {
      display: inline-block;
      width: 128px;
      margin-bottom: 20px;
      padding-right: 12px;
      line-height: 40px;
      text-align: right;
    }
  }

  /deep/.el-tabs__content {
    max-height: 500px;
    overflow: auto;
  }
}
</style>
