<template>
  <div class="values-container">
    <h4>变量</h4>
    <el-tabs v-model="activeEnv" @tab-click="handleSwitchTab">
      <el-tab-pane v-for="tab in tabs" :key="tab" :label="tab" :name="tab"></el-tab-pane>
    </el-tabs>
    <div class="content">
      <h5>覆盖默认 values 文件</h5>
      <div v-if="!showValueEdit">
        <div class="desc">暂无自定义的 values 文件</div>
        <el-button type="text" @click="showValueEdit = true" icon="el-icon-plus">添加 values 文件</el-button>
      </div>
      <ImportValues
        v-else
        ref="importValuesRef"
        :showDelete="true"
        :importRepoInfo.sync="valuesYaml[activeEnv].importRepoInfo"
        :resize="{ direction: 'vertical' }"
        @closeValueEdit="showValueEdit = false"
      ></ImportValues>
      <KeyValue ref="keyValueRef" :keyValues="valuesYaml[activeEnv].keyValues"></KeyValue>
    </div>
    <div class="bottom">
      <el-button type="primary" size="small" @click="addChartValuesYamlByEnv" :disabled="!serviceName">保存</el-button>
    </div>
  </div>
</template>

<script>
import ImportValues from '@/components/projects/common/import_values/index.vue'
import KeyValue from '@/components/projects/common/import_values/key_value.vue'
import { addChartValuesYamlByEnvAPI } from '@api'
import { cloneDeep } from 'lodash'
export default {
  data () {
    const tabs = ['dev', 'qa']
    return {
      activeEnv: tabs[0],
      tabs: tabs,
      showValueEdit: false,
      valuesYaml: {
        dev: {},
        qa: {}
      }
    }
  },
  computed: {
    projectName () {
      return this.$route.params.project_name
    },
    serviceName () {
      return this.$route.query.service_name
    }
  },
  methods: {
    handleSwitchTab ({ label }) {
      this.showValueEdit =
        this.valuesYaml[label].importRepoInfo.yamlSource !== 'default'
    },
    initValuesYaml () {
      const importRepoInfo = {
        yamlSource: 'default',
        valuesYaml: '',
        gitRepoConfig: null
      }
      const keyValues = []
      for (const key in this.valuesYaml) {
        this.valuesYaml[key] = {
          importRepoInfo: cloneDeep(importRepoInfo),
          keyValues: cloneDeep(keyValues),
          updated: false
        }
      }
    },
    generatePayload () {
      const valuesYaml = this.valuesYaml[this.activeEnv]
      let payload = {
        envName: this.activeEnv,
        yamlSource: valuesYaml.importRepoInfo.yamlSource,
        serviceName: this.serviceName,
        overrideValues: valuesYaml.keyValues
      }
      if (valuesYaml.importRepoInfo.yamlSource === 'freeEdit') {
        payload = Object.assign(payload, {
          valuesYAML: valuesYaml.importRepoInfo.valuesYaml
        })
      } else if (valuesYaml.importRepoInfo.yamlSource === 'gitRepo') {
        const gitRepoConfig = valuesYaml.importRepoInfo.gitRepoConfig
        payload = Object.assign(payload, {
          gitRepoConfig: {
            codehostID: gitRepoConfig.codehostID,
            branch: gitRepoConfig.branch,
            owner: gitRepoConfig.owner,
            repo: gitRepoConfig.repo,
            valuesPaths: gitRepoConfig.valuesPaths.map(config => config.path)
          }
        })
      }
      return payload
    },
    addChartValuesYamlByEnv () {
      const valid = []
      if (this.$refs.importValuesRef) {
        valid.push(this.$refs.importValuesRef.validate())
      }
      if (this.$refs.keyValueRef) valid.push(this.$refs.keyValueRef.validate())
      Promise.all(valid)
        .then(res => {
          addChartValuesYamlByEnvAPI(this.projectName, this.generatePayload()).then(res => {
            this.$message.success(`保存成功`)
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created () {
    this.initValuesYaml()
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
