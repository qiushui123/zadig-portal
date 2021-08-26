<template>
  <div class="values-container">
    <h4>变量</h4>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="tab in tabs" :key="tab" :label="tab" :name="tab"></el-tab-pane>
    </el-tabs>
    <div>
      <h4>覆盖默认 values 文件</h4>
      <div class="desc">暂无自定义的 values 文件</div>
      <el-button type="text" @click="addValuesFile" icon="el-icon-plus">添加 values 文件</el-button>

      <import-values></import-values>

      <key-value></key-value>
    </div>
  </div>
</template>

<script>
import ImportValues from '@/components/projects/common/import_values.vue'
import KeyValue from '@/components/projects/common/import_values/key_value.vue'
export default {
  data () {
    return {
      activeName: 'dev',
      tabs: ['dev', 'qa']
    }
  },
  components: {
    ImportValues,
    KeyValue
  }
}
</script>

<style lang="less" scoped>
.values-container {
  padding: 10px 30px;

  .desc {
    color: #909399;
    font-size: 14px;
  }
}
</style>
