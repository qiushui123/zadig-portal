<template>
  <el-dialog
    title="是否更新对应环境？"
    custom-class="dialog-upgrade-env"
    :visible.sync="updateEnvDialogVisible"
    width="40%"
  >
    <div class="title">
      <el-alert
        title="勾选需要更新的环境，点击确定之后，该服务将自动在对应的环境中进行更新"
        :closable="false"
        type="warning"
      >
      </el-alert>
      <el-checkbox-group v-model="checkList">
        <el-checkbox
          v-for="(env, index) in envNameList"
          :key="index"
          :label="env.envName"
        ></el-checkbox>
      </el-checkbox-group>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" @click="autoUpgradeEnv"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
import { autoUpgradeEnvAPI, listProductAPI } from '@api'
export default {
  data () {
    return {
      checkList: [],
      updateEnvDialogVisible: false,
      envNameList: []
    }
  },
  methods: {
    async getEnvNameList () {
      const projectName = this.projectName
      const envNameList = await listProductAPI('', projectName)
      envNameList.forEach(element => {
        element.envName = element.env_name
      })
      if (envNameList.length) {
        this.envNameList = envNameList
      }
    },
    openDialog () {
      this.updateEnvDialogVisible = true
    },
    autoUpgradeEnv () {
      const payload = {
        env_names: this.checkList
      }
      const projectName = this.projectName
      autoUpgradeEnvAPI(projectName, payload).then((res) => {
        this.$router.push(`/v1/projects/detail/${projectName}/envs`)
        this.$message({
          message: '更新环境成功',
          type: 'success'
        })
      })
    }
  },
  computed: {
    projectName () {
      return this.$route.params.project_name
    }
  },
  created () {
    this.getEnvNameList()
  }
}
</script>
