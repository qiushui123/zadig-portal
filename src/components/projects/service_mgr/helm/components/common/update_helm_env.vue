<template>
  <el-dialog title="是否更新对应环境？" :visible.sync="updateHelmEnvDialogVisible" width="40%">
    <div class="title">
      <el-alert title="勾选需要更新的环境，点击确定之后，该服务将自动在对应的环境中进行更新" :closable="false" type="warning"></el-alert>
    </div>
    <div class="content">
      <el-checkbox-group v-model="checkedEnvList">
        <el-checkbox v-for="(env, index) in envNameList" :key="index" :label="env.envName"></el-checkbox>
      </el-checkbox-group>
      <div class="tip">
        <el-switch v-model="readTip" active-text="确认更新 Chart 保存后，即将要更新的相对应环境的 values.yaml 文件和变量已更新！"></el-switch>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" :disabled="!readTip || !checkedEnvList.length" type="primary" @click="autoUpgradeEnv">确 定</el-button>
      <el-button size="small" @click="skipUpdate">跳过</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  autoUpgradeHelmEnvAPI
} from '@api'
import { mapGetters } from 'vuex'

export default {
  name: 'updateHelmEnv',
  props: {
    value: Boolean
  },
  data () {
    return {
      checkedEnvList: [],
      readTip: false
    }
  },
  methods: {
    autoUpgradeEnv () {
      this.$confirm('更新环境, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const payload = {
          env_names: this.checkedEnvList
        }
        const projectName = this.projectName
        payload.update_type = 'envVar'
        autoUpgradeHelmEnvAPI(projectName, payload).then((res) => {
          this.$router.push(`/v1/projects/detail/${projectName}/envs`)
          this.$message({
            message: '更新环境成功',
            type: 'success'
          })
        })
      })
    },
    skipUpdate () {
      this.updateHelmEnvDialogVisible = false
    },
    async getProducts () {
      await this.$store.dispatch('getProductListSSE').closeWhenDestroy(this)
    }
  },
  computed: {
    updateHelmEnvDialogVisible: {
      get: function () {
        return this.value
      },
      set: function (val) {
        this.$emit('input', val)
      }
    },
    ...mapGetters(['productList']),
    envNameList () {
      const envNameList = []
      this.productList.forEach((element) => {
        if (
          element.product_name === this.projectName &&
          element.source !== 'external'
        ) {
          envNameList.push({
            envName: element.env_name
          })
        }
      })
      return envNameList
    },
    projectName () {
      return this.$route.params.project_name
    }
  },
  mounted () {
    this.getProducts()
  }
}
</script>

<style lang="less" scoped>
/deep/.el-dialog {
  .el-dialog__body {
    padding-top: 10px;

    .title {
      margin-bottom: 20px;
    }

    .content {
      .tip {
        margin-top: 30px;
        vertical-align: text-top;

        .el-switch__label {
          color: #606266;

          &.is-active {
            color: #409eff;
          }
        }
      }
    }
  }
}
</style>
