<template>
  <div class="template-repo-container">
    <el-form ref="tempForm" :model="tempData" label-width="80px" :rules="rules">
      <el-form-item label="服务名称" prop="serviceName">
        <el-input v-model="tempData.serviceName" placeholder="请输入服务名称" size="small"></el-input>
      </el-form-item>
      <el-form-item label="选择模板" prop="moduleName">
        <el-select v-model="tempData.moduleName" placeholder="请选择模板" size="small">
          <el-option :label="chart.name" :value="chart.name" v-for="chart in tempCharts" :key="chart.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="0">
        <ImportValues
          ref="importValues"
          :resize="{direction: 'vertical', height: '250px'}"
          :importRepoInfo.sync="importRepoInfo"
        ></ImportValues>
      </el-form-item>
      <el-form-item style="text-align: right;">
        <el-button size="small" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="importTempRepo">导入</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ImportValues from '@/components/projects/common/import_values/index.vue'
import { createTemplateServiceAPI, getChartTemplatesAPI } from '@api'

const rules = {
  serviceName: [{ required: true, message: '请输入服务名称', trigger: 'blur' }],
  moduleName: [{ required: true, message: '请选择模板', trigger: 'blur' }]
}

// const createTemplateForm = {
//   source: 'chartTemplate',
//   name: '',
//   createFrom: {
//     templateName: '',

//     valuesYAML: '',

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
    return {
      tempCharts: [],
      tempData: {
        serviceName: '',
        moduleName: ''
      },
      importRepoInfo: {
        yamlSource: 'gitRepo',
        valuesYaml: '',
        gitRepoConfigs: null
      }
    }
  },
  props: {
    value: Boolean
  },
  computed: {
    dialogVisible: {
      get: function () {
        return this.value
      },
      set: function (value) {
        this.$emit('input', value)
      }
    }
  },
  methods: {
    closeSelectRepo () {
      this.tempData = {
        serviceName: '',
        moduleName: ''
      }
      this.importRepoInfo = {
        yamlSource: 'gitRepo',
        valuesYaml: '',
        gitRepoConfigs: null
      }
      this.$refs.importValues.resetValueRepoInfo()
    },
    getTemplateCharts () {
      return getChartTemplatesAPI().then(res => {
        this.tempCharts = [{ name: 'x' }]// res
        return res
      })
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

      const projectName = this.$route.params.project_name
      let payload = {
        source: 'chartTemplate',
        name: this.tempData.serviceName
      }
      if (this.importRepoInfo.yamlSource === 'freeEdit') {
        payload = Object.assign(payload, {
          createFrom: {
            templateName: this.tempData.moduleName,
            valuesYAML: this.importRepoInfo.valuesYaml
          }
        })
      } else if (this.importRepoInfo.yamlSource === 'gitRepo') {
        payload = Object.assign(payload, {
          createFrom: {
            codehostID: this.importRepoInfo.gitRepoConfigs.codehostID,
            owner: this.importRepoInfo.gitRepoConfigs.owner,
            repo: this.importRepoInfo.gitRepoConfigs.repo,
            branch: this.importRepoInfo.gitRepoConfigs.branch,
            valuesPaths: this.importRepoInfo.gitRepoConfigs.valuesPaths.map(path => path.path),
            templateName: this.tempData.moduleName
          }
        })
      } else {
        payload = Object.assign(payload, {
          createFrom: {
            templateName: this.tempData.moduleName
          }
        })
      }
      const res = await createTemplateServiceAPI(projectName, payload).catch(
        err => {
          console.log(err)
        }
      )
      if (res) {
        this.$message.success(`导入模板 ${payload.name} 成功`)
        this.dialogVisible = false
        this.$store.dispatch('queryService', {
          projectName: this.$route.params.project_name
        })
        this.$emit('canUpdateEnv')
      }
    }
  },
  components: {
    ImportValues
  },
  created () {
    this.rules = rules
    this.getTemplateCharts()
  }
}
</script>

<style lang="less" scoped>
.template-repo-container {
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
