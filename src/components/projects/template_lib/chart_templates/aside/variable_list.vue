<template>
  <div class="module-use">
    <header>变量列表</header>
    <section>
      <article>
        <h4>系统内置变量</h4>
        <el-table :data="systemVariables" style="width: 100%;">
          <el-table-column prop="key" label="变量"></el-table-column>
          <el-table-column prop="description" label="描述"></el-table-column>
        </el-table>
      </article>
      <article>
        <h4>自定义变量</h4>
        <el-table :data="customVariables" style="width: 100%;">
          <el-table-column prop="key" label="变量"></el-table-column>
          <el-table-column prop="value" label="默认值">
            <template slot-scope="{row}">
              <el-input v-model="row.value" :placeholder="row.description"></el-input>
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
      require: false, // true
      type: Array,
      default: () => {
        return [
          {
            key: '$T-Project$',
            description: '项目名称'
          },
          {
            key: '$T-Service$',
            description: '服务名称'
          }
        ]
      }
    },
    customVariables: {
      require: false, // true
      type: Array,
      default: () => {
        return [
          {
            key: '1',
            value: '1'
          },
          {
            key: '2',
            value: '2'
          }
        ]
      }
    }
  },
  methods: {
    saveCustomVariables () {
      console.log('保存自定义变量', this.customVariables)
      const serviceName = ''
      const payload = this.customVariables
      this.saveLoading = true
      saveHelmTemplateVariableAPI(serviceName, payload)
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
.module-use {
  box-sizing: border-box;
  max-height: 100%;
  padding: 10px 20px 20px;
  overflow: auto;
  background-color: #fff;

  header {
    padding: 20px 0;
    font-weight: 700;
    font-size: 16px;
    line-height: 1;
  }

  section {
    .desc {
      font-size: 14px;
      line-height: 2;
    }

    /deep/.el-button {
      margin-top: 20px;
    }
  }
}
</style>
