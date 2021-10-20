<template>
  <div class="helm-env-variable">
    <div v-show="envVariable.yamlSource === 'default'" class="default-values">
      <div class="desc">暂无环境默认变量 values 文件</div>
      <el-button type="text" @click="envVariable.yamlSource = 'freeEdit'" icon="el-icon-plus">添加 values 文件</el-button>
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
import { getEnvDefaultVariableAPI } from '@api'
import { cloneDeep } from 'lodash'

const envVariableTemp = {
  yamlSource: 'default', // : String
  overrideYaml: '' // : String
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
      return this.envVariable
    },
    resetallEnvVariableInfo () {
      this.envVariable = {}
    },
    initEnvVariableInfo (envName = 'DEFAULT') {
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
      const res = await getEnvDefaultVariableAPI(
        this.projectName,
        envName
      ).catch(err => {
        console.log(err)
        this.initEnvVariableInfo(envName)
      })
      if (res) {
        const envVar = {
          ...cloneDeep(envVariableTemp),
          yamlSource: res.defaultValues ? 'freeEdit' : 'default',
          overrideYaml: res.defaultValues
        }
        this.envVariable = cloneDeep(envVar)
      }
    }
  },
  watch: {
    envNames: {
      handler (newV, oldV) {
        if (newV === 'DEFAULT') {
          this.initEnvVariableInfo()
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
