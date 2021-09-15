<template>
  <el-dialog title="更新环境变量" :visible.sync="updateHelmEnvVarDialogVisible" width="80%">
    <div v-loading="getHelmEnvVarLoading" class="kv-container">
      <ChartValues v-if="updateHelmEnvVarDialogVisible" class="chart-value" ref="chartValuesRef" :envNames="envName"></ChartValues>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" :loading="updataHelmEnvVarLoading" @click="updateHelmEnvVar">更新</el-button>
      <el-button size="small" @click="cancelUpdateHelmEnvVar">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import ChartValues from '../common/updateHelmEnvChart.vue'
import { updateHelmEnvVarAPI } from '@/api'
export default {
  name: 'updateHelmVarDialog',
  props: {
    productInfo: Object,
    fetchAllData: Function,
    projectName: String,
    envName: String
  },
  components: {
    ChartValues
  },
  data () {
    return {
      updateHelmEnvVarDialogVisible: false,
      updataHelmEnvVarLoading: false,
      getHelmEnvVarLoading: false
    }
  },
  methods: {
    openDialog () {
      this.updateHelmEnvVarDialogVisible = true
    },
    async updateHelmEnvVar () {
      const res = await this.$refs.chartValuesRef.validate().catch(err => {
        console.log(err)
      })
      if (!res) {
        return
      }
      const projectName = this.productInfo.product_name
      const payload = {
        envName: this.productInfo.env_name,
        renderCharts: this.$refs.chartValuesRef.getAllChartNameInfo()
      }
      this.updataHelmEnvVarLoading = true
      updateHelmEnvVarAPI(projectName, payload)
        .then(response => {
          this.updataHelmEnvVarLoading = false
          this.updateHelmEnvVarDialogVisible = false
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
