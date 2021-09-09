<template>
  <el-dialog title="更新环境变量" :visible.sync="updateHelmEnvVarDialogVisible" width="80%">
    <div v-loading="getHelmEnvVarLoading" class="kv-container">
      <UpdateHelmEnvChart v-if="Object.keys(chartInfos).length>0" :chartInfos="chartInfos" :envTabs="false"></UpdateHelmEnvChart>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" :loading="updataHelmEnvVarLoading" @click="updateHelmEnvVar">更新</el-button>
      <el-button size="small" @click="cancelUpdateHelmEnvVar">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import UpdateHelmEnvChart from '../common/updateHelmEnvChart.vue'
import { getHelmEnvVarAPI, updateHelmEnvVarAPI } from '@/api'
export default {
  name: 'updateHelmVarDialog',
  props: {
    productInfo: Object,
    fetchAllData: Function,
    projectName: String,
    envName: String
  },
  components: {
    UpdateHelmEnvChart
  },
  data () {
    return {
      updateHelmEnvVarDialogVisible: false,
      updataHelmEnvVarLoading: false,
      getHelmEnvVarLoading: true,
      chartInfos: {}
    }
  },
  methods: {
    openDialog () {
      this.updateHelmEnvVarDialogVisible = true
    },
    async getHelmEnvVar () {
      this.getHelmEnvVarLoading = true
      const projectName = this.projectName
      const envName = this.envName
      const res = await getHelmEnvVarAPI(projectName, envName).catch(error => {
        console.log(error)
      })
      if (res) {
        this.getHelmEnvVarLoading = false
        // TODO test  start
        const handled = {}
        res.forEach(re => {
          handled[re.service_name] = {
            serviceName: re.service_name,
            chartVersion: re.chart_version,
            yamlSource: 'default',
            valuesYAML: re.values_yaml,
            overrideValues: [],
            gitRepoConfig: null
          }
        })
        this.chartInfos = handled
        // TODO test  end
      }
    },
    updateHelmEnvVar () {
      const projectName = this.productInfo.product_name
      const envName = this.productInfo.env_name
      const payload = {
        chart_infos: Object.values(this.chartInfos).map(chart => {
          return {
            chart_version: chart.chartVersion,
            values_yaml: chart.valuesYAML
          }
        })
      }
      this.updataHelmEnvVarLoading = true
      updateHelmEnvVarAPI(projectName, envName, payload)
        .then(response => {
          this.updataHelmEnvVarLoading = false
          this.updateHelmEnvVarDialogVisible = false
          this.initData()
          this.fetchAllData()
          this.$message({
            message: '更新环境变量成功，请等待服务升级',
            type: 'success'
          })
        })
        .catch(() => {
          this.updataHelmEnvVarLoading = false
        })
    },
    cancelUpdateHelmEnvVar () {
      this.updateHelmEnvVarDialogVisible = false
      this.initData()
    },
    initData () {
      this.$nextTick(() => {
        this.chartInfos = {}
      })
    }
  },
  watch: {
    updateHelmEnvVarDialogVisible (value) {
      if (value) {
        this.getHelmEnvVar()
      }
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.el-dialog {
  .el-dialog__body {
    padding: 0 10px 20px;

    .kv-container {
      margin: 0 50px;
    }
  }
}
</style>
