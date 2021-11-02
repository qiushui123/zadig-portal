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
      :currentSelect="tabName"
      ref="gitRepo"
    ></GitRepo>

    <ChartRepo
      v-show="tabName === 'chart'"
      :currentSelect="tabName"
      ref="chartRepo"
    ></ChartRepo>

    <TemplateRepo
      v-show="tabName === 'template'"
      :currentSelect="tabName"
      ref="templateRepo"
    ></TemplateRepo>
  </div>
</template>
<script>
import GitRepo from './git_repo.vue'
import ChartRepo from './chart_repo.vue'
import TemplateRepo from './template_repo.vue'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      tabName: '',
      isUpdate: false
    }
  },
  computed: {
    ...mapState({
      value: state => state.service_manage.serviceDialogVisible,
      currentService: state => state.service_manage.currentService
    })
  },
  watch: {
    value: {
      handler (val) {
        if (val) {
          this.tabName = 'git'
          const cs = this.currentService
          if (cs) {
            this.isUpdate = true
            if (cs.source && cs.source === 'chartTemplate') {
              this.tabName = 'template'
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
