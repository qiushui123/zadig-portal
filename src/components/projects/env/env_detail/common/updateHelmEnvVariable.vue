<template>
  <div class="helm-env-variable">
      <div v-show="envVariable.yamlSource === 'default'" class="default-values">
        <div class="desc">暂无环境默认变量 values 文件</div>
        <el-button type="text" @click="envVariable.yamlSource = 'gitRepo'" icon="el-icon-plus">添加 values 文件</el-button>
      </div>
      <ImportValues
        v-show="envVariable.yamlSource !== 'default'"
        showDelete
        ref="importValuesRef"
        :resize="{direction: 'vertical'}"
        :importRepoInfo="envVariable"
      ></ImportValues>
  </div>
</template>

<script>
import ImportValues from '@/components/projects/common/import_values/index.vue'
import {} from '@api'
import { cloneDeep } from 'lodash'

const envVariableTemp = {
  envName: '', // ?: String
  yamlSource: 'default', // : String
  valuesYAML: '', // : String
  gitRepoConfig: null // : Object
}

export default {
  name: 'EnvValues',
  props: {
    envNames: {
      /**
       * Array: 展示环境 tab
       * String: 不展示环境 tab
       */
      type: [Array, String],
      required: true
    }
  },
  data () {
    return {
      envVariable: {} // envVariableTemp
    }
  },
  computed: {
    projectName () {
      return this.$route.params.project_name
    }
  },
  methods: {
    switchTabs () {
      return this.$refs.importValuesRef.validate()
    },
    getAllEnvVariableInfo () {
      const envVar = this.envVariable
      let chart = {
        envName: envVar.envName === 'DEFAULT' ? '' : envVar.envName
      }
      if (envVar.yamlSource === 'gitRepo') {
        chart = {
          ...chart,
          yamlSource: envVar.yamlSource,
          gitRepoConfig: cloneDeep(envVar.gitRepoConfig)
        }
      } else if (envVar.yamlSource === 'freeEdit') {
        chart = {
          ...chart,
          yamlSource: envVar.yamlSource,
          valuesYAML: envVar.valuesYAML
        }
      }

      return chart
    },
    resetallEnvVariableInfo () {
      this.envVariable = {}
    },
    initallEnvVariableInfo (envName = 'DEFAULT') {
      this.envVariable = {
        ...cloneDeep(envVariableTemp),
        envName: envName === 'DEFAULT' ? '' : envName
      }
    },
    validate () {
      const valid = []
      if (this.$refs.importValuesRef) {
        valid.push(this.$refs.importValuesRef.validate())
      }
      return Promise.all(valid)
    },
    async getEnvVariablesYaml ({ envName }) {
      // todo
      //   const fn = () => {}
      //   const res = await fn(this.projectName, envName).catch(err =>
      //     console.log(err)
      //   )
      //   if (res) {
      //     const envVar = {
      //       ...cloneDeep(envVariableTemp),
      //       res
      //     }
      //     this.allEnvVariableInfo = cloneDeep(envVar)
      //   }
      this.initallEnvVariableInfo(envName)
    }
  },
  watch: {
    envNames: {
      handler (newV, oldV) {
        if (newV === 'DEFAULT') {
          this.initallEnvVariableInfo()
        } else {
          this.getEnvVariablesYaml({ envName: newV })
        }
      },
      immediate: true
    }
  },
  components: {
    ImportValues
  }
}
</script>

<style lang="less" scoped>
.helm-env-variable {
  width: 100%;

  .desc {
    margin-top: 10px;
    color: #909399;
    font-size: 14px;
  }
}
</style>
