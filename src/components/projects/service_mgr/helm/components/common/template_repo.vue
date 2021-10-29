<template>
  <div class="template-repo-container">
    <el-form ref="tempForm" :model="tempData" label-width="140px" :rules="rules">
      <h4 class="flex-center" style="padding-left: 40px;">
        <span>Chart 模板</span>
        <el-button type="text" @click="triggerSubstantial" :disabled="isUpdate">{{substantial ? '关闭批量创建' : '批量创建'}}</el-button>
      </h4>
      <el-form-item label="服务名称" prop="serviceName" v-if="!substantial">
        <el-input v-model="tempData.serviceName" placeholder="请输入服务名称" size="small" :disabled="isUpdate"></el-input>
      </el-form-item>
      <el-form-item v-else label="服务名称">
        <span style="line-height: 41px;">批量创建的服务名称为 values 文件名称</span>
      </el-form-item>
      <el-form-item label="选择模板" prop="moduleName">
        <el-select v-model="tempData.moduleName" placeholder="请选择模板" size="small" :disabled="isUpdate">
          <el-option :label="chart.name" :value="chart.name" v-for="chart in tempCharts" :key="chart.name"></el-option>
        </el-select>
      </el-form-item>
      <keep-alive>
        <component
          :is="isComp"
          ref="importValues"
          :importRepoInfo.sync="importRepoInfo"
          :resize="{height: '188px'}"
          :style="{'padding-left': substantial ? '0px':'40px'}"
        ></component>
      </keep-alive>
      <el-form-item>
        <el-button size="small" @click="commitDialogVisible(false)">取消</el-button>
        <el-button type="primary" size="small" @click="importTempRepo" :loading="importLoading">导入</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import CommonImportValues from '@/components/projects/common/import_values/index.vue'
import ImportValues from './template_repo/import_values.vue'
import {
  createTemplateServiceAPI,
  createTemplateMultiServiceAPI,
  getChartTemplatesAPI
} from '@api'
import { mapState } from 'vuex'

const rules = {
  serviceName: [{ required: true, message: '请输入服务名称', trigger: 'blur' }],
  moduleName: [{ required: true, message: '请选择模板', trigger: 'blur' }]
}

// const createTemplateForm = {
//   source: 'chartTemplate',
//   name: '',
//   createFrom: {
//     templateName: '',
//     valuesYAML: '',  // 后端传输字段，这里使用的是 overrideYaml
//     valuesPaths: [],
//     codehostID: null,
//     owner: '',
//     repo: '',
//     branch: ''
//   }
// }

export default {
  name: 'TemplateRepo',
  data () {
    this.rules = rules
    return {
      tempCharts: [],
      tempData: {
        serviceName: '',
        moduleName: ''
      },
      importRepoInfo: {
        yamlSource: 'freeEdit',
        overrideYaml: '',
        gitRepoConfig: null
      },
      substantial: false,
      importLoading: false,
      isUpdate: false
    }
  },
  props: {
    currentSelect: String
  },
  computed: {
    isComp () {
      return this.substantial ? ImportValues : CommonImportValues
    },
    ...mapState({
      currentService: state => state.service_manage.currentService
    })
  },
  watch: {
    currentService: {
      handler (val) {
        if (this.currentSelect === 'template' && val) {
          const createFrom = val.create_from
          this.tempData = {
            serviceName: createFrom.service_name,
            moduleName: createFrom.template_name
          }
          if (createFrom.yaml_data) {
            this.importRepoInfo = {
              yamlSource: 'freeEdit',
              overrideYaml: createFrom.yaml_data.yaml_content,
              gitRepoConfig: null
            }
          }
          this.isUpdate = true
        } else {
          this.isUpdate = false
        }
      },
      immediate: true
    }
  },
  methods: {
    commitDialogVisible (value) {
      this.$store.commit('SERVICE_DIALOG_VISIBLE', value)
    },
    triggerSubstantial () {
      this.substantial = !this.substantial
      this.closeSelectRepo()
    },
    closeSelectRepo () {
      this.tempData = {
        serviceName: '',
        moduleName: ''
      }
      this.importRepoInfo = {
        yamlSource: 'freeEdit',
        overrideYaml: '',
        gitRepoConfig: null
      }
      this.$refs.tempForm.clearValidate()
      this.$refs.importValues.resetValueRepoInfo()
    },
    getTemplateCharts () {
      return getChartTemplatesAPI().then(res => {
        this.tempCharts = res
        return res
      })
    },
    async createTemplateService () {
      const projectName = this.$route.params.project_name
      const payload = {
        source: 'chartTemplate',
        name: this.tempData.serviceName,
        createFrom: {
          templateName: this.tempData.moduleName,
          valuesYAML: this.importRepoInfo.overrideYaml
        }
      }

      const res = await createTemplateServiceAPI(projectName, payload).catch(
        err => {
          console.log(err)
        }
      )
      this.importLoading = false
      if (res) {
        this.$message.success(
          `${this.isUpdate ? '更新' : '新建'}服务 ${payload.name} 成功`
        )
        this.commitDialogVisible(false)
        this.$store.dispatch('queryService', {
          projectName: this.$route.params.project_name
        })

        this.$store.commit('UPDATE_ENV_BUTTON', true)
        this.$store.commit('CHART_NAMES', [
          {
            serviceName: payload.name,
            type: this.isUpdate ? 'update' : 'create'
          }
        ])
      }
    },
    async createTemplateMultiService () {
      const projectName = this.$route.params.project_name
      const payload = {
        source: 'chartTemplate',
        createFrom: { templateName: this.tempData.moduleName },
        valuesData: {
          gitRepoConfig: this.importRepoInfo.gitRepoConfig
        }
      }
      const sId = setTimeout(() => {
        this.$message.info('服务过多，请耐心等待！')
      }, 5000)
      const res = await createTemplateMultiServiceAPI(
        projectName,
        payload
      ).catch(err => {
        console.log(err)
      })
      clearTimeout(sId)
      this.importLoading = false
      if (res) {
        this.$message.success(`导入模板成功`)
        this.commitDialogVisible(false)
        this.$store.dispatch('queryService', {
          projectName: this.$route.params.project_name
        })

        this.$store.commit('UPDATE_ENV_BUTTON', true)
        this.$store.commit('CHART_NAMES', res.successServices.map(service => {
          return {
            serviceName: service,
            type: 'create'
          }
        }))

        if (res.failedServices.length) {
          let message = ``
          res.failedServices.forEach(fail => {
            message += `<div style="margin-bottom: 10px;"><span style="color: #e6a23c;">${fail.path}</span>: ${fail.error}</div>`
          })
          this.$notify.error({
            dangerouslyUseHTMLString: true,
            message,
            duration: 0,
            title: '批量创建失败服务列表'
          })
        }
      }
    },
    async importTempRepo () {
      const valid1 = await this.$refs.importValues
        .validate()
        .catch(err => console.log(err))
      const valid2 = await this.$refs.tempForm.validate().catch(err => {
        console.log(err)
      })
      if (!valid1 || !valid2) {
        return
      }
      this.importLoading = true
      if (this.substantial) {
        this.createTemplateMultiService()
      } else {
        this.createTemplateService()
      }
    }
  },
  created () {
    this.getTemplateCharts()
  }
}
</script>

<style lang="less" scoped>
.template-repo-container {
  h4 {
    margin: 0;
  }

  .flex-center {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: -16px;
  }

  /deep/.el-form {
    .el-form-item {
      margin-bottom: 15px;

      .el-select {
        width: 100%;
      }
    }
  }
}
</style>
