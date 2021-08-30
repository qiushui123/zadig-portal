<template>
  <div class="values-container">
    <h4>变量</h4>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="tab in tabs" :key="tab" :label="tab" :name="tab"></el-tab-pane>
    </el-tabs>
    <div>
      <h5>覆盖默认 values 文件</h5>
      <div v-show="!showValueEdit">
        <div class="desc">暂无自定义的 values 文件</div>
        <el-button type="text" @click="showValueEdit = true" icon="el-icon-plus">添加 values 文件</el-button>
      </div>
      <import-values v-show="showValueEdit" :showDelete="true" @closeValueEdit="closeValueEdit"></import-values>
      <key-value></key-value>
    </div>
  </div>
</template>

<script>
import ImportValues from '@/components/projects/common/import_values/index.vue'
import KeyValue from '@/components/projects/common/import_values/key_value.vue'
export default {
  data () {
    return {
      activeName: 'dev',
      tabs: ['dev', 'qa'],
      showValueEdit: false
    }
  },
  methods: {
    handleClick ({ label }) {
      // 请求相应环境下的 values.yaml 和 键值对
      console.log('请求相应环境下的 values.yaml 和 键值对: ', label)
    },
    closeValueEdit () {
      this.showValueEdit = false
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
  padding: 10px 20px;

  h5 {
    margin: 14px 0;
    font-size: 14px;
  }

  .desc {
    margin-top: 20px;
    color: #909399;
    font-size: 14px;
  }
}
</style>
