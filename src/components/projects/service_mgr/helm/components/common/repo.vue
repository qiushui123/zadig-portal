<template>
  <div class="form-code-container">
    <el-tabs type="border-card" v-model="tabName">
      <el-tab-pane label="Git 仓库" name="git">
        <GitRepo
          @triggleAction="$emit('triggleAction')"
          @canUpdateEnv="$emit('canUpdateEnv')"
          :currentService="currentService"
          @input="$emit('input', $event)"
          :value="value"
          ref="gitRepo"
        ></GitRepo>
      </el-tab-pane>
      <el-tab-pane label="Chart 仓库" name="chart">
        <ChartRepo
          @canUpdateEnv="$emit('canUpdateEnv')"
          :currentService="currentService"
          @input="$emit('input', $event)"
          :value="value"
          ref="chartRepo"
        ></ChartRepo>
      </el-tab-pane>
      <el-tab-pane label="模板库" name="template">
        <TemplateRepo
          @canUpdateEnv="$emit('canUpdateEnv')"
          :currentService="currentService"
          @input="$emit('input', $event)"
          :value="value"
          ref="templateRepo"
        ></TemplateRepo>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import GitRepo from './git_repo.vue'
import ChartRepo from './chart_repo.vue'
import TemplateRepo from './template_repo.vue'
export default {
  data () {
    return {
      tabName: 'git'
    }
  },
  props: {
    value: Boolean,
    currentService: Object
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
  /deep/.el-tabs__content {
    max-height: 500px;
    overflow: auto;
  }
}
</style>
