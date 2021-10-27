<template>
  <div class="variable-list">
    <header class="var-title">变量列表</header>
    <section>
      <article>
        <h4>
          <span>
            <i class="iconfont iconfuwu"></i>
          </span> 系统内置变量
        </h4>
        <el-table :data="systemVariables" style="width: 100%;">
          <el-table-column prop="key" label="Key"></el-table-column>
          <el-table-column prop="description" label="描述"></el-table-column>
        </el-table>
      </article>
      <article>
        <h4>
          <span>
            <i class="iconfont icontanhao"></i>
          </span> 自定义变量
          <el-tooltip effect="dark" :content="'自定义变量通过'+' {{'+'.key}} ' +' 声明'" placement="top">
            <span>
              <i class="el-icon-question"></i>
            </span>
          </el-tooltip>
        </h4>
        <el-table :data="customVariables" style="width: 100%;">
          <el-table-column prop="key" label="Key"></el-table-column>
          <el-table-column prop="value" label="Value">
            <template slot-scope="{row}">
              <el-input v-model="row.value" :placeholder="row.value" size="small"></el-input>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="saveCustomVariables" size="small" :loading="saveLoading">保存</el-button>
      </article>
    </section>
  </div>
</template>

<script>
import { saveHelmTemplateVariableAPI } from '@api'
export default {
  data () {
    return {
      saveLoading: false
    }
  },
  props: {
    systemVariables: {
      require: true,
      type: Array
    },
    customVariables: {
      require: true,
      type: Array
    }
  },
  computed: {
    serviceName () {
      return this.$route.query.service_name || ''
    }
  },
  methods: {
    saveCustomVariables () {
      if (!this.serviceName) {
        this.$message.info('未选择服务')
        return
      }
      this.saveLoading = true
      saveHelmTemplateVariableAPI(this.serviceName, this.customVariables)
        .then(res => {
          this.$message.success(`自定义变量保存成功！`)
        })
        .catch(err => {
          this.$message.error(`自定义变量保存失败：${err}`)
        })
        .then(() => {
          this.saveLoading = false
        })
    }
  }
}
</script>

<style lang="less" scoped>
.variable-list {
  box-sizing: border-box;
  height: 100%;
  max-height: 100%;
  padding: 10px 20px 20px;
  overflow: auto;
  background-color: #fff;

  .var-title {
    height: 35px;
    padding-bottom: 10px;
    font-weight: 700;
    font-size: 16px;
    line-height: 35px;
  }

  /deep/.el-table__cell {
    padding: 6px 0;
  }

  /deep/.el-button {
    margin-top: 20px;
  }

  article {
    padding: 12px 0;

    h4 {
      margin: 0;
      padding: 0;
      color: #909399;
      font-weight: 300;
    }
  }
}
</style>
