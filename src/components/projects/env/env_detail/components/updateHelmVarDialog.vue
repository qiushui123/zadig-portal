<template>
  <el-dialog title="更新环境变量" :visible.sync="updateHelmEnvVarDialogVisible" width="80%">
    <div v-loading="getHelmEnvVarLoading" class="kv-container">
      <div class="helm-content">
        <el-tabs tab-position="left" type="border-card" v-model="checkedChart">
          <el-tab-pane :label="key" :name="key" v-for="(item, key) in helmServiceYamls" :key="key"></el-tab-pane>
        </el-tabs>
        <div class="values">
          <div class="title">Chart Version: {{helmServiceYamls[checkedChart].chart_version}}</div>
          <ImportValues :yaml.sync="helmServiceYamls[checkedChart].values_yaml" showKeyValue :resize="'vertical'"></ImportValues>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" :loading="updataHelmEnvVarLoading" @click="updateHelmEnvVar">更新</el-button>
      <el-button size="small" @click="cancelUpdateHelmEnvVar">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import ImportValues from '@/components/projects/common/import_values/index.vue'
import { getHelmEnvVarAPI, updateHelmEnvVarAPI } from '@/api'
import editor from 'vue2-ace-bind'
import 'brace/mode/yaml'
import 'brace/theme/xcode'
import 'brace/ext/searchbox'
import { keyBy } from 'lodash'
export default {
  name: 'updateHelmVarDialog',
  props: {
    productInfo: Object,
    fetchAllData: Function,
    projectName: String,
    envName: String
  },
  components: {
    editor,
    ImportValues
  },
  data () {
    return {
      updateHelmEnvVarDialogVisible: false,
      helmServiceYamls: { placeholder: { chart_version: '', values_yaml: '' } },
      updataHelmEnvVarLoading: false,
      getHelmEnvVarLoading: true,
      checkedChart: 'placeholder'
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
      const res = await getHelmEnvVarAPI(projectName, envName).catch((error) => {
        console.log(error)
      })
      if (res) {
        this.getHelmEnvVarLoading = false
        this.helmServiceYamls = keyBy(res, 'service_name')
        this.checkedChart = res[0].service_name
      }
    },
    updateHelmEnvVar () {
      const projectName = this.productInfo.product_name
      const envName = this.productInfo.env_name
      const payload = {
        chart_infos: this.$utils.cloneObj(Object.values(this.helmServiceYamls))
      }
      this.updataHelmEnvVarLoading = true
      updateHelmEnvVarAPI(projectName, envName, payload).then(response => {
        this.updataHelmEnvVarLoading = false
        this.updateHelmEnvVarDialogVisible = false
        this.initData()
        this.fetchAllData()
        this.$message({
          message: '更新环境变量成功，请等待服务升级',
          type: 'success'
        })
      }).catch(() => {
        this.updataHelmEnvVarLoading = false
      })
    },
    cancelUpdateHelmEnvVar () {
      this.updateHelmEnvVarDialogVisible = false
      this.initData()
    },
    initData () {
      this.$nextTick(() => {
        this.checkedChart = 'placeholder'
        this.helmServiceYamls = { placeholder: { chart_version: '', values_yaml: '' } }
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
  }
}

.helm-content {
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  margin-top: 20px;

  /deep/.el-tabs {
    flex-shrink: 0;

    .el-tabs__header {
      margin-right: 0;
    }

    .el-tabs__content {
      padding: 0;
    }
  }

  .values {
    box-sizing: border-box;
    width: calc(~'100% - 250px');
    padding: 20px;
    border: 1px solid #dcdfe6;
    border-left-width: 0;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);

    .title {
      line-height: 40px;
    }
  }
}
</style>
