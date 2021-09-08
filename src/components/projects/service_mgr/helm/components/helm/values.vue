<template>
  <div class="values-container">
    <h4>变量</h4>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="tab in tabs" :key="tab" :label="tab" :name="tab"></el-tab-pane>
    </el-tabs>
    <div class="content">
      <h5>覆盖默认 values 文件</h5>
      <div v-show="!showValueEdit">
        <div class="desc">暂无自定义的 values 文件</div>
        <el-button type="text" @click="showValueEdit = true" icon="el-icon-plus">添加 values 文件</el-button>
      </div>
      <import-values
        v-if="showValueEdit"
        :showDelete="true"
        :importRepoInfo.sync="importRepoInfo"
        :resize="'vertical'"
        @closeValueEdit="closeValueEdit"
      ></import-values>
      <key-value></key-value>
    </div>
    <div class="bottom">
      <el-button type="primary" size="small" @click="addChartValuesYamlByEnv">保存</el-button>
    </div>
  </div>
</template>

<script>
import ImportValues from '@/components/projects/common/import_values/index.vue'
import KeyValue from '@/components/projects/common/import_values/key_value.vue'
import { addChartValuesYamlByEnvAPI } from '@api'
export default {
  data () {
    const tabs = ['dev', 'qa']
    return {
      activeName: tabs[0],
      tabs: tabs,
      showValueEdit: false,
      valuesYaml: {
        dev: {},
        qa: {}
      },
      yaml: '',
      importRepoInfo: {
        yamlSource: 'gitRepo',
        valuesYaml: '',
        gitRepoConfigs: null
      }
    }
  },
  methods: {
    handleClick ({ label }) {
      // 请求相应环境下的 values.yaml 和 键值对
      console.log('请求相应环境下的 values.yaml 和 键值对: ', label)
    },
    closeValueEdit () {
      this.showValueEdit = false
    },
    addChartValuesYamlByEnv () {
      addChartValuesYamlByEnvAPI().then(res => {
        console.log()
      })
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
  position: relative;
  height: 100%;
  padding: 0 20px;
  overflow: hidden;

  h5 {
    margin: 14px 0;
    color: #909399;
    font-size: 15px;
  }

  .desc {
    margin-top: 20px;
    color: #909399;
    font-size: 14px;
  }

  .content {
    height: calc(~'100% - 180px');
    overflow: auto;
  }

  .bottom {
    position: absolute;
    bottom: 0;
    height: 50px;
  }
}
</style>
