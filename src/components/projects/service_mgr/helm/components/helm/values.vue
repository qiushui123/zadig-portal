<template>
  <div class="values-container">
    <h4>变量</h4>
    <el-tabs v-model="activeEnv">
      <el-tab-pane v-for="tab in tabs" :key="tab" :label="tab" :name="tab"></el-tab-pane>
    </el-tabs>
    <div class="content" :loading="valuesLoading">
      <h5>覆盖默认 values 文件</h5>
      <div v-if="valuesYaml[activeEnv].importRepoInfo.yamlSource === 'default'">
        <div class="desc">暂无自定义的 values 文件</div>
        <el-button type="text" @click="valuesYaml[activeEnv].importRepoInfo.yamlSource = 'gitRepo'" icon="el-icon-plus">添加 values 文件</el-button>
      </div>
      <ImportValues
        v-else
        ref="importValuesRef"
        showDelete
        :importRepoInfo.sync="valuesYaml[activeEnv].importRepoInfo"
        :resize="{ direction: 'vertical' }"
        @closeValueEdit="valuesYaml[activeEnv].importRepoInfo.yamlSource = 'default'"
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
import { addChartValuesYamlByEnvAPI, getChartValuesYamlAPI } from '@api'
import { cloneDeep } from 'lodash'
export default {
  props: {
    valuesYamlDeposit: Object
  },
  data () {
    const tabs = ['dev', 'qa']
    return {
      activeEnv: tabs[0],
      tabs: tabs,
      valuesYaml: {
        dev: {},
        qa: {}
      },
      valuesLoading: false
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
    getChartValuesYaml ({ env = this.activeEnv, service = this.serviceName }) {
      return getChartValuesYamlAPI(this.projectName, env, [service])
        .then(res => {
          if (res.length) {
            const re = res[0]
            const valueYaml = {}
            valueYaml.updated = false
            valueYaml.keyValues = re.overrideValues
            valueYaml.importRepoInfo = {
              yamlSource: re.yamlSource,
              valuesYAML: re.valuesYAML || '',
              gitRepoConfig: re.gitRepoConfig || null
            }

            this.valuesYaml[env] = valueYaml
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    async initValuesYaml (service = this.serviceName) {
      this.valuesLoading = true

      const importRepoInfo = {
        yamlSource: 'default',
        valuesYAML: '',
        gitRepoConfig: null
      }
      const keyValues = []

      for (const key in this.valuesYaml) {
        this.valuesYaml[key] = {
          importRepoInfo: cloneDeep(importRepoInfo),
          keyValues: cloneDeep(keyValues),
          updated: false
        }
        if (service) {
          await this.getChartValuesYaml({ env: key, service: service })
        }
      }

      this.valuesLoading = false
      return Promise.resolve(this.valuesYaml)
    },
    generatePayload () {
      const valuesYaml = this.valuesYaml[this.activeEnv]
      let payload = {
        yamlSource: valuesYaml.importRepoInfo.yamlSource,
        serviceName: this.serviceName,
        overrideValues: valuesYaml.keyValues
      }
      if (valuesYaml.importRepoInfo.yamlSource === 'freeEdit') {
        payload = {
          ...payload,
          valuesYAML: valuesYaml.importRepoInfo.valuesYAML
        }
      } else if (valuesYaml.importRepoInfo.yamlSource === 'gitRepo') {
        payload = {
          ...payload,
          gitRepoConfig: valuesYaml.importRepoInfo.gitRepoConfig
        }
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
          addChartValuesYamlByEnvAPI(
            this.projectName,
            this.activeEnv,
            this.generatePayload()
          ).then(res => {
            this.$message.success(`保存成功`)
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  watch: {
    serviceName: {
      handler (newV, oldV) {
        if (!newV) {
          this.initValuesYaml(newV)
          return
        }
        if (this.valuesYamlDeposit[newV]) {
          this.valuesYaml = this.valuesYamlDeposit[newV]
        } else {
          this.initValuesYaml(newV).then(res => {
            this.valuesYamlDeposit[newV] = res
          })
        }
      },
      immediate: true
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
