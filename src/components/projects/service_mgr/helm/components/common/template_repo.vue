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
        <ImportValues :height="'250px'" :yaml.sync="tempData.valueYaml" :resize="'vertical'"></ImportValues>
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

export default {
  name: 'TemplateRepo',
  data () {
    return {
      tempCharts: [],
      tempData: {
        serviceName: '',
        moduleName: '',
        valueYaml: ''
      }
    }
  },
  props: {
    value: Boolean,
    currentService: Object
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
    getTemplateCharts () {
      return getChartTemplatesAPI().then(res => {
        this.tempCharts = res
        return res
      })
    },
    async importTempRepo () {
      const valid = await this.$refs.tempForm.validate().catch(err => {
        console.log(err)
      })
      if (!valid) {
        return
      }

      const projectName = this.$route.params.project_name
      const payload = {
        source: 'chartTemplate',
        name: this.tempData.serviceName,
        templateName: this.tempData.moduleName,
        valuesYAML: this.tempData.valueYaml
      }
      const res = await createTemplateServiceAPI(projectName, payload).catch(
        err => {
          console.log(err)
        }
      )
      if (res) {
        thihs.$message.success(`导入模板 ${payload.templateName} 成功`)
        this.dialogVisible = false
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
